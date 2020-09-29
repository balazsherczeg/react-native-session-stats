import React, {Component} from 'react';
import {node, func} from 'prop-types';
import {AppState} from 'react-native';

import SessionStatsContext from './context';
import {STORAGE} from './constants';

const getNow = () => Math.round(Date.now() / 1000);
const isOn = (appState) => appState === 'active';
const isOff = (appState) => appState.match(/inactive|background/);

export default class SessionStats extends Component {
  state = {
    session: {
      timeSpent: 0,
      sessionCount: 0,
      lastSessionEnd: false,
    },
  };

  activeFrom;

  appState;

  componentDidMount() {
    this.appState = AppState.currentState;
    this.handleSessionStart();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleSessionStart = () => {
    const {onSessionStart} = this.props;

    this.activeFrom = getNow();

    AsyncStorage.getItem(STORAGE).then(
      (result) => {
        if (result != null) {
          const previousSession = JSON.parse(result);
          return previousSession;
        }

        return this.state.session;
      },
    ).then((previousSession) => {
      this.setState({session: previousSession});
      onSessionStart(previousSession);
    });
  }

  handleSessionEnd = () => {
    const {onSessionEnd} = this.props;
    const {timeSpent, sessionCount} = this.state.session;

    const now = getNow();
    const sessionDuration = now - this.activeFrom;

    const endableSession = {
      timeSpent: timeSpent + sessionDuration,
      sessionCount: sessionCount + 1,
      lastSessionEnd: now,
    };

    AsyncStorage.setItem(
      STORAGE,
      JSON.stringify(endableSession),
    );

    onSessionEnd({
      ...endableSession,
      sessionDuration,
    });
  }

  handleAppStateChange = (nextAppState) => {
    if (isOff(this.appState) && isOn(nextAppState)) {
      this.handleSessionStart();
    } else if (isOn(this.appState) && isOff(nextAppState)) {
      this.handleSessionEnd();
    }

    this.appState = nextAppState;
  }

  render() {
    return (
      <SessionStatsContext.Provider value={this.state.session}>
        {this.props.children}
      </SessionStatsContext.Provider>
    );
  }
}

SessionStats.defaultProps = {
  children: null,
  onSessionEnd: () => true,
  onSessionStart: () => true,
};

SessionStats.propTypes = {
  children: node,
  onSessionEnd: func,
  onSessionStart: func,
};
