import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid } from '@material-ui/core';
import { Level, BattleType } from 'components/Names';
import Link from 'components/Link';
import Kuski from 'components/Kuski';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import LevelMap from 'features/LevelMap';
import styled from 'styled-components';
import { toLocalTime } from 'utils/time';
import m from 'moment';
import useInterval from '@use-it/interval';
import LinearProgressWithLabel from 'components/LinearProgressWithLabel';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

const TopTimesCard = ({ level, levelTimes, getLink }) => {
  return (
    <Root>
      <Title>
        <Link to="">
          {level.Name}: {level.LongName}
        </Link>
      </Title>
      {levelTimes.map(time => {
        return (
          <div>
            <span>{time.Time}</span>
          </div>
        );
      })}
    </Root>
  );
};

const Root = styled.div``;

const Title = styled.div``;

export default TopTimesCard;
