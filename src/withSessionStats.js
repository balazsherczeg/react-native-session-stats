import React from 'react';
import SessionStatsContext from './context';

const withSessionStats = (Component) => (
  ({
    forwardedRef,
    ...rest
  }) => (
    <SessionStatsContext.Consumer>
      {(sessionStats) => (
        <Component
          ref={forwardedRef}
          {...rest}
          sessionStats={sessionStats}
        />
      )}
    </SessionStatsContext.Consumer>
  )
);

export default withSessionStats;