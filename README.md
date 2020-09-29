# react-native-session-stats

This tiny component logs locally the total time the user spent on the app, the count of sessions -- let's call *session* the time app is in the foreground -- and the time when the last session ended. It helps you schedule actions, for example:
- open a _Rate me_ dialog, when the user has already spent 10 minutes using your app,
- want to tell the user "long time no see" after a long period of absence,
- show an interstitial ad every fifth time the app is opened,
- log the time of the session at the backend.

## Install

```
npm install --save https://github.com/balazsherczeg/react-native-session-stats.git
```

## Usage

The `SessionStats` component takes two props: `onSessionStart` is fired when the app's state changes to active, `onSessionEnd`, when it ends to be active.

```javascript
import SessionStats from 'react-native-session-stats';
// ...
<SessionStats
  onSessionStart={({
    timeSpent, // total time spent in seconds...
    sessionCount, // ... and number of sessions as of at opening the app
    lastSessionEnd,
  }) => { /* ... */ }}
  onSessionEnd={({
    timeSpent, // total time spent in seconds...
    sessionCount, // ... and number of sessions as of at closing the app
    lastSessionEnd,
    sessionDuration, // the length of the session to end in seconds
  }) => { /* ... */ }}
/>
```

You can use `SessionStats` as a context provider.

```javascript
import SessionStats from 'react-native-session-stats';
// ...
<SessionStats>
  <App />
<SessionStats/>
```

Inside, the values -- as of the start of the session -- are available through a higher order component:

```javascript
import {withSessionStats} from 'react-native-session-stats';
const SomeComponent = ({sessionStats: {timeSpent, sessionCount, lastSessionEnd}}) => {
    //...
}
export withSessionStats(<SomeComponent />);
```

... or `useContext`

```javascript
import {sessionStatsContext} from 'react-native-session-stats'
const SomeComponent = () => {
    const {timeSpent, sessionCount, lastSessionEnd} = useContext(sessionStatsContext);
    //...
}
```

## Notes

Tested on Android only.