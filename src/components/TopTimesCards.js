import React, { useState } from 'react';
import TopTimesCard from 'components/TopTimesCard';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

const TopTimesCards = ({ levels, times }) => {
  console.log(times);
  console.log(levels);

  if (!Array.isArray(levels)) {
    return null;
  }

  return (
    <Root>
      {levels.map(level => {
        let levelTimes = times?.['' + level.LevelIndex];

        return (
          <TopTimesCard
            level={level}
            levelTimes={isEmpty(levelTimes) ? [] : levelTimes}
          />
        );
      })}
    </Root>
  );
};

const Root = styled.div``;

export default TopTimesCards;
