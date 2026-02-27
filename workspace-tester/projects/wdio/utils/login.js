import { getToday } from './getToday.js';

export default function getCurrentYear() {
    return getToday().getFullYear();
}

/**
 * return formatted Date string
 * @param {Date} date date
 *
 * @returns {String} 'MM/DD/YYYY', en-US
 */
// export function getStringofDate(date) {
export const getStringOfDate = (date = getToday()) => {
    const newDate = new Date(date);
    const year = String(newDate.getFullYear());
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
};

export const getStringOfDayTime = (daytime = getToday()) => {
    const newDate = new Date(daytime);
    const year = String(newDate.getFullYear());
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const hour = String(newDate.getHours());
    const minute = String(newDate.getMinutes());
    const second = String(newDate.getSeconds());
    return `${month}/${day}/${year} ${hour}:${minute}:${second}`;
};

export const addDays = (diff, date) => {
    const clone = new Date(date);

    clone.setDate(clone.getDate() + diff);

    return clone;
};

const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getDaysInMonth = (year, month) => [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];

export const addMonths = (diff, date) => {
    const clone = new Date(date);
    const n = clone.getDate();
    clone.setDate(1);
    clone.setMonth(clone.getMonth() + diff);
    clone.setDate(Math.min(n, getDaysInMonth(clone.getFullYear(), clone.getMonth())));

    return clone;
};

export const addMonthsAndDays = (monthDiff, dayDiff, startDate) => {
    const clone = addMonths(monthDiff, startDate);
    clone.setDate(clone.getDate() + dayDiff);
    const n = clone.getDate();
    clone.setDate(Math.min(n, getDaysInMonth(clone.getFullYear(), clone.getMonth())));

    return clone;
};
