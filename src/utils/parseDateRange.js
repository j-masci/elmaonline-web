import { endOfMonth, addDays as dateFnsAddDays } from 'date-fns';

export const toInt = (str, min, max) => {
  const int = parseInt(str, 10);

  if (Number.isNaN(int)) {
    return null;
  }

  return int >= min && int <= max ? int : null;
};

export const lastDayOfMonth = (year, month) => {
  return endOfMonth(new Date(year, month - 1, 1)).getDate();
};

export const addDays = ([year, month, day], days) => {
  const obj = dateFnsAddDays(new Date(year, month - 1, day), days);
  return [obj.getFullYear(), obj.getMonth() + 1, obj.getDate()];
};

const toTime = (year, month, day) => {
  return new Date(year, month - 1, day).getTime();
};

// parses and validates the day/month/year in a given user input string.
// supports only "one" format currently (yyyy, yyyy-mm, yyyy-mm-dd).
// if the type is not null, it means that the user input string
// was parsed correctly, and the values for day/month/year are legit.
export const getTypeAndDate = str => {
  const y = toInt(str.substring(0, 4), 1, 9999);
  const m = toInt(str.substring(5, 7), 1, 12);
  const d = toInt(str.substring(8, 10), 1, 31);

  // ie. '2020'
  if (str.length === 4 && /[1-9]\d\d\d/.test(str)) {
    if (y !== null) {
      return ['year', y, null, null];
    }
  } else if (str.length === 7 && /[1-9]\d\d\d-\d\d/.test(str)) {
    if (y !== null && m !== null) {
      return ['month', y, m, null];
    }
  } else if (str.length === 10 && /[1-9]\d\d\d-\d\d-\d\d/.test(str)) {
    if (y !== null && m !== null && d !== null) {
      return ['day', y, m, Math.min(d, lastDayOfMonth(y, m))];
    }
  }

  return [null, null, null, null];
};

// [ 'year', 2020, null, null ] => [ 2021, 1, 1 ]
const nextDay = ([type, year, month, day]) => {
  if (type === 'year') {
    return [year + 1, 1, 1];
  }

  if (type === 'month') {
    return addDays([year, month, lastDayOfMonth(year, month)], 1);
  }

  if (type === 'day') {
    return addDays([year, month, day], 1);
  }
};

// [ 'month', 2020, 10, null ] => [ 2020, 9, 30 ]
const prevDay = ([type, year, month, day]) => {
  if (type === 'year') {
    return [year - 1, 12, 31];
  }

  if (type === 'month') {
    return addDays([year, month, 1], -1);
  }

  if (type === 'day') {
    return addDays([year, month, day], -1);
  }
};

// [ 'month', 2020, 10, null ] => [ 2020, 10, 31 ]
const lastDayOf = ([type, year, month, day]) => {
  if (type === 'year') {
    return [year, 12, 31];
  }

  if (type === 'month') {
    return [year, month, lastDayOfMonth(year, month)];
  }

  if (type === 'day') {
    return [year, month, day];
  }
};

// [ 'year', 2020, null, null ] => [ 2020, 1, 1 ]
const firstDayOf = ([type, year, month, day]) => {
  if (type === 'year') {
    return [year, 1, 1];
  }

  if (type === 'month') {
    return [year, month, 1];
  }

  if (type === 'day') {
    return [year, month, day];
  }
};

const handleBefore = ([type, year, month, day]) => {
  return [null, type === null ? null : prevDay([type, year, month, day])];
};

const handleAfter = ([type, year, month, day]) => {
  return [type === null ? null : nextDay([type, year, month, day]), null];
};

const handleBetween = (
  [type, year, month, day],
  [type2, year2, month2, day2],
) => {
  if (type === null || type2 === null) {
    return [null, null];
  }

  const [firstDay, lastDay] = [
    firstDayOf([type, year, month, day]),
    lastDayOf([type2, year2, month2, day2]),
  ];

  if (toTime(...firstDay) > toTime(...lastDay)) {
    return [lastDay, firstDay];
  }

  return [firstDay, lastDay];
};

// ie. ('2010-10-15', '2010-11') => [[ 2010, 10, 15 ], [ 2010, 11, 30 ]]
export const parseDateRange = (str1, str2) => {
  str1 = (str1 || '').trim();
  str2 = (str2 || '').trim();

  if (str2 && !str1) {
    return handleBefore(getTypeAndDate(str2));
  }

  if (str1 && !str2) {
    return handleAfter(getTypeAndDate(str1));
  }

  // note: if str1 === str2 then you can think of this as: handle "on" the date given.
  if (str1 && str2) {
    // if either date is invalid, returns [ null, null ]
    return handleBetween(getTypeAndDate(str1), getTypeAndDate(str2));
  }

  return [null, null];
};
