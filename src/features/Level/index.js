import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';

import Comments from 'components/Comments';

const Level = props => {
  useStoreEffect(
    store => store.Level,
    actions => actions.setLevelIndex(32),
  );

  return <div>hi </div>;
};
