import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import BattleList from 'features/BattleList';
import queryString from 'query-string';
import { useNavigate, useLocation } from '@reach/router';
import { Tabs, Tab, Grid } from '@material-ui/core';
import { CheckBox, Timer, Today } from '@material-ui/icons';
import { format, formatDistance } from 'date-fns';
import Interviews from '../cup/Interviews';
import Leaders from '../cup/Leaders';
import ByDate from './ByDate';
import Search from './Search';
import Paper from '@material-ui/core/Paper';

const Battles = ({ tab }) => {
  const navigate = useNavigate();

  console.log('tab', tab);

  return (
    <Layout edge t={`Battles`}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => {
          navigate(['/battles', value].filter(Boolean).join('/'));
        }}
      >
        <Tab label="Recent" value="" />
        <Tab label="Search" value="search" />
      </Tabs>
      <Paper>
        {tab === '' && <ByDate />}
        {tab === 'search' && <Search />}
      </Paper>
    </Layout>
  );
};

export default Battles;
