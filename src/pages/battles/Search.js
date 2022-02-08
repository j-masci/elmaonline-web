import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import BattleList from 'features/BattleList';
import queryString from 'query-string';
import { Dropdown, TextField } from 'components/Inputs';
import { useNavigate, useLocation, useParams } from '@reach/router';
import { useDebounce } from 'use-debounce';
import { getCripples, getBattleTypes } from 'utils/eol';
import { forceInt } from 'utils/calcs';
import Slider from '@material-ui/core/Slider';
import { Grid } from '@material-ui/core';
import { parseDateRange } from 'utils/parseDateRange';
import { format, endOfDay } from 'date-fns';
import { BattleListTable } from 'features/BattleList';
import {
  TextField as TextField2,
  TablePagination,
  Typography,
  Switch,
  ListSubheader,
  CircularProgress,
  useMediaQuery,
} from '@material-ui/core';
import { BattlesSearch, useQueryAlt } from '../../api';

const urlOrder = [
  'kuski',
  'durMin',
  'durMax',
  'cripple',
  'date',
  'page',
  'perPage',
];

const formatDateArr = (arr, dayEnd) => {
  if (Array.isArray(arr)) {
    let date = new Date(arr[0], arr[1] - 1, arr[2]);

    if (dayEnd) {
      date = endOfDay(date);
    }

    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }
  return null;
};

const isDateError = (startDate, endDate, startDateArr, endDateArr) => {
  const tr = s => (s || '').trim();
  return (
    (tr(startDate) || tr(endDate)) &&
    startDateArr === null &&
    endDateArr === null
  );
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);

  const [kuski, setKuski] = useState(queryParams.kuski || '');
  const [cripples, setCripples] = useState(
    (queryParams.cripple || '').split(','),
  );
  const [battleType, setBattleType] = useState(
    (queryParams.battleType || '').trim(),
  );
  const [duration, setDuration] = useState([
    forceInt(queryParams.durMin, 0, 0, 60),
    forceInt(queryParams.durMax, 60, 0, 60),
  ]);

  const [startDate, setStartDate] = useState(
    (queryParams.startDate || '').trim(),
  );

  const [endDate, setEndDate] = useState((queryParams.endDate || '').trim());

  const [startDateFormatted, endDateFormatted, dateError] = useMemo(() => {
    const [startDateArr, endDateArr] = parseDateRange(startDate, endDate);
    return [
      formatDateArr(startDateArr),
      formatDateArr(endDateArr, 1),
      isDateError(startDate, endDate, startDateArr, endDateArr),
    ];
  }, [startDate, endDate]);

  const [results, setResults] = useState({});

  const { data: battles } = results;

  const { refetch: runQuery } = useQueryAlt(
    ['BattleSearch', kuski, cripples, battleType, duration, startDate, endDate],
    async () =>
      BattlesSearch({
        Kuski: kuski,
        BattleType: battleType,
        Cripple: cripples.join(','),
        DurationMin: duration[0] < 1 ? undefined : duration[0],
        DurationMax: duration[1] > 59 ? undefined : duration[1],
        StartDate: startDateFormatted || undefined,
        EndDate: endDateFormatted || undefined,
      }),
    {
      enabled: false,
    },
  );

  useEffect(() => {
    runQuery().then(setResults);
  }, []);

  const onSubmit = e => {
    e.preventDefault();
    runQuery().then(setResults);

    const query = queryString.stringify(
      {
        kuski: kuski
          .trim()
          .split(',')
          .map(k => k.trim())
          .filter(Boolean),
        cripple: cripples,
        battleType,
        durMin: duration[0] <= 1 ? '' : duration[0],
        durMax: duration[1] > 59 ? '' : duration[1],
        startDate: (startDate || '').trim(),
        endDate: (endDate || '').trim(),
      },
      {
        arrayFormat: 'comma',
        skipEmptyString: true,
        sort: (a, b) => urlOrder.indexOf(a) - urlOrder.indexOf(b),
      },
    );

    navigate('/battles/search?' + query);
  };

  const crippleOpts = [['', 'None']].concat(getCripples()[0]);
  const battleTypeOpts = [['', 'Any']].concat(getBattleTypes()[0]);

  console.log('battles', battles);

  return (
    <Root>
      <form onSubmit={onSubmit}>
        <Fields>
          <Field>
            <TextField name="Kuski" value={kuski} onChange={v => setKuski(v)} />
          </Field>
          <Field>
            <Dropdown
              name="Battle Type(s)"
              options={battleTypeOpts}
              update={setBattleType}
              selected={battleType}
            />
          </Field>
          <Field>
            <Slider
              min={0}
              max={60}
              step={1}
              value={duration}
              onChange={(e, v) => setDuration(v)}
              valueLabelDisplay="auto"
            />
            <div>
              Duration: {duration[0]} - {duration[1]} minutes
            </div>
          </Field>
          <Field>
            <TextField
              name="Start Date"
              value={startDate}
              onChange={setStartDate}
            />
          </Field>
          <Field>
            <TextField name="End Date" value={endDate} onChange={setEndDate} />
          </Field>
          <button type="submit">Submit</button>
        </Fields>
      </form>
      <div>
        from: {startDateFormatted}
        <br />
        to: {endDateFormatted}
        <br />
        error:
        {dateError ? 1 : '0'}
      </div>

      {results.isLoading && <Loading />}
      {!results.isLoading && (
        <BattleListTable
          battles={Array.isArray(battles) ? battles : []}
          condensed={false}
        />
      )}
    </Root>
  );
};

const Fields = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const Field = styled.div`
  width: 280px; ;
`;

const Root = styled.div``;

export default Search;
