import moment from 'moment';
import { getToday } from './getToday.js';
export { getToday } from './getToday.js';

export const DATE_FORMATE_MULTI_LANGUAGE = {
    en_US: 'MM/DD/YYYY',
    en_GB: 'DD/MM/YYYY',
};

export const CALENDAR_STARTWEEKDAY_MULTI_LANGUAGE = {
    en_US: 'Su',
    en_GB: 'Mo',
};

/**
 * return formatted Date string
 * @param {Date} date date
 *
 * @returns {String} 'MM/DD/YYYY', en-US
 */
export const getStringOfDate = (date, zeropadding = true) => {
    const newDate = new Date(date);
    
    const year = String(newDate.getFullYear());
    
    if (zeropadding === false) {
        // New format: no zero-padding
        const month = String(newDate.getMonth() + 1);
        const day = String(newDate.getDate());
        return `${month}/${day}/${year}`;
    } else {
        // Original format: with zero-padding
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');
        return `${month}/${day}/${year}`;
    }
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

export const diffDays = (dateA, dateB) => {
    const zoneDelta = (-dateA.getTimezoneOffset() + dateB.getTimezoneOffset()) * 60 * 1000;
    let diff = dateA - dateB + zoneDelta;

    return parseInt(diff / (60 * 60 * 24 * 1000));
};

/**
 * Get day count between two dates, date format MM/DD/YYYY
 * @param dateA
 * @param dateB
 * @returns {number}
 */
export const dayCount = (dateA, dateB) => {
    return diffDays(createDateObj(dateA), createDateObj(dateB)) + 1;
};

export const createDateObj = (dateString) => {
    const [month, day, year] = dateString.split('/');
    let date = new Date(2016, parseInt(month) - 1, parseInt(day));

    // for pre 1900
    date.setFullYear(parseInt(year));
    return date;
};

export const startOfMonth = (date) => {
    let clone = new Date(date);

    clone.setDate(1);
    return clone;
};

// previous day of next month's first day
export const endOfMonth = (date) => {
    let clone = new Date(date);

    clone.setDate(1); // Preset the date to 1 to make sure setMonth() work expected.
    clone.setMonth(clone.getMonth() + 1);
    clone.setDate(0);

    return clone;
};

export const startOfQuarter = (date) => {
    let clone = new Date(date);
    clone.setDate(1);
    clone.setMonth(parseInt(clone.getMonth() / 3) * 3);
    return clone;
};

// previous day of next quarter's first day
export const endOfQuarter = (date) => {
    let clone = new Date(date);
    clone.setDate(1); // Preset the date to 1 to make sure setMonth() work expected.
    clone.setMonth((parseInt(clone.getMonth() / 3) + 1) * 3);
    clone.setDate(0);
    return clone;
};

export const startOfYear = (date) => {
    let clone = new Date(date);
    clone.setMonth(0);
    clone.setDate(1);
    return clone;
};

export const endOfYear = (date) => {
    let clone = new Date(date);
    clone.setMonth(11);
    clone.setDate(31);
    return clone;
};

/**
 * @param {Date} date Date obj
 * @returns {Date} start of week
 */
export const startOfWeek = (date) => {
    let clone = new Date(date);

    let diff = clone.getDay();
    clone.setDate(clone.getDate() - diff);

    // apply offset based on locale
    clone.setDate(clone.getDate());
    return clone;
};

/**
 * @param {Date} date Date obj
 * @returns {Date} end of week
 */
export const endOfWeek = (date) => {
    let clone = new Date(date);

    const diff = 6 - clone.getDay();
    clone.setDate(clone.getDate() + diff);

    // apply offset based on locale
    clone.setDate(clone.getDate());
    return clone;
};

export const addDays = (diff, date) => {
    let clone = new Date(date);
    clone.setDate(clone.getDate() + diff);
    return clone;
};

export const addBusinessDays = (diff, date) => {
    let clone = new Date(date);
    let daysRemaining = Math.abs(diff);
    const direction = diff > 0 ? 1 : -1;

    while (!isBusinessDay(clone)) {
        clone.setDate(clone.getDate() + direction);
    }
    
    while (daysRemaining > 0) {
        clone.setDate(clone.getDate() + direction);
        
        // Check if current day is a business day (Monday to Friday)
        if (isBusinessDay(clone)) {
            daysRemaining--;
        }
    }
    
    return clone;
};

/**
 * Check if a date is a business day (Monday to Friday)
 * @param {Date} date - The date to check
 * @returns {boolean} True if it's a business day
 */
const isBusinessDay = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // 1 = Monday, 5 = Friday
};

export const addWeeks = (diff, date) => {
    let clone = new Date(date);
    clone.setDate(clone.getDate() + diff * 7);
    return clone;
};

const isLeapYear = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getDaysInMonth = function (year, month) {
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

// export const addMonths = (diff, date) => {
//     let clone = new Date(date);
//     let n = clone.getDate();
//     clone.setDate(1);
//     clone.setMonth(clone.getMonth() + diff);
//     clone.setDate(Math.min(n, getDaysInMonth(clone.getFullYear(), clone.getMonth())));

//     return clone;
// };

export const addMonths = (diff, date, isExcludeWeekends = false) => {
    let clone = new Date(date);
    let n = clone.getDate();
    clone.setDate(1);
    clone.setMonth(clone.getMonth() + diff);
    clone.setDate(Math.min(n, getDaysInMonth(clone.getFullYear(), clone.getMonth())));

    // Skip weekends if the flag is true
    if (isExcludeWeekends) {
        clone = skipWeekends(clone);
    }

    return clone;
};

/**
 * Adjust date to skip weekends (Saturday and Sunday)
 * @param {Date} date - The date to adjust
 * @returns {Date} The adjusted date (will be Monday if input is weekend)
 */
const skipWeekends = (date) => {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    if (dayOfWeek === 0) { // Sunday - move to Monday
        date.setDate(date.getDate() + 1);
    } else if (dayOfWeek === 6) { // Saturday - move to Monday
        date.setDate(date.getDate() + 2);
    }
    
    return date;
};


export const addYears = (diff, date) => {
    let clone = new Date(date);
    let year = clone.getFullYear();
    clone.setFullYear(year + diff);

    return clone;
};

export const formateDateMultiLanguage = (day, month, year) => {
    while (year.length < 4) {
        year = '0' + year;
    }
    while (month.length < 2) {
        month = '0' + month;
    }
    while (day.length < 2) {
        day = '0' + day;
    }
    const format = DATE_FORMATE_MULTI_LANGUAGE['en_US'];
    return moment(`${year}-${month}-${day}`).format(format);
};

export const calendarStartWeekDay = () => {
    const startWeekday = CALENDAR_STARTWEEKDAY_MULTI_LANGUAGE['en_US'];
    return startWeekday;
};

export const getMonthFromString = (mon) => {
    return new Date(Date.parse(mon + ' 1, 2012')).getMonth() + 1;
};

export const addMonthsAndDays = (monthDiff, dayDiff, startDate) => {
    const clone = addMonths(monthDiff, startDate);
    clone.setDate(clone.getDate() + dayDiff);
    const n = clone.getDate();
    clone.setDate(Math.min(n, getDaysInMonth(clone.getFullYear(), clone.getMonth())));

    return clone;
};

export const getAge = (yearOfBirth) => {
    return getToday().getFullYear() - yearOfBirth;
};

export const getDaysDifference = (date1, date2) => {
  // Convert inputs to Date objects
  const d1 = date1 instanceof Date ? new Date(date1) : new Date(date1);
  const d2 = date2 instanceof Date ? new Date(date2) : new Date(date2);
  const cutoffDate = new Date('12/31/2016');
  const effectiveD2 = d2 < cutoffDate ? d2 : cutoffDate;
  
  // Validate date objects
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    throw new Error('Invalid date format provided');
  }
  
  // Calculate time difference in milliseconds
  const timeDiff = Math.abs(effectiveD2 - d1);
  
  // Convert milliseconds to days
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  return daysDiff;
};




/**
 * Get a specific weekday date based on various parameters
 * @param {Object} params - Parameters object
 * @param {string} [params.index] - Week index: 'first', 'second', 'third', 'fourth', 'fifth'
 * @param {string} params.weekday - Target weekday: 'Sunday', 'Monday', etc.
 * @param {string} [params.month] - Month name: 'January', 'February', etc.
 * @param {string} params.date - Reference date string
 * @param {number} [params.quarterMonthIndex] - Month index within quarter (1-3)
 * @param {boolean} [zeropadding=true] - Whether to zero-pad month and day
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const getDayOfWeek = ({index, weekday, month, date, quarterMonthIndex}, zeropadding = true) => {
    // Map English weekdays to numeric values (0-6, where 0 is Sunday)
    const weekdayMap = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    
    // Map index to week number
    const indexMap = {
        'first': 1,
        'second': 2, 
        'third': 3,
        'fourth': 4,
        'fifth': 5
    };
    
    // Map month names to numeric values (0-11, where 0 is January)
    const monthMap = {
        'January': 0, 'February': 1, 'March': 2, 'April': 3,
        'May': 4, 'June': 5, 'July': 6, 'August': 7,
        'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    // Validate weekday parameter
    const targetWeekday = weekdayMap[weekday];
    if (targetWeekday === undefined) {
        throw new Error('Invalid weekday parameter');
    }
    
    const startDate = new Date(date);
    const currentYear = startDate.getFullYear();
    
    // Case 1: Only weekday and date parameters
    // Return weekday in the same week as the given date
    if (!index && !month && quarterMonthIndex === undefined) {
        const currentDay = startDate.getDay();
        const diff = targetWeekday - currentDay;
        const targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + diff);
        return getStringOfDate(targetDate, zeropadding);
    }
    
    // Case 2: index + weekday + date (without month and quarterMonthIndex)
    // Return the Nth weekday in the same month as the given date
    if (index && !month && quarterMonthIndex === undefined) {
        const weekIndex = indexMap[index];
        if (weekIndex === undefined) {
            throw new Error('Invalid index parameter');
        }
        
        const currentMonth = startDate.getMonth();
        
        let foundCount = 0;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const testDate = new Date(currentYear, currentMonth, day);
            if (testDate.getDay() === targetWeekday) {
                foundCount++;
                if (foundCount === weekIndex) {
                    return getStringOfDate(testDate, zeropadding);
                }
            }
        }
        
        throw new Error(`No ${index} ${weekday} in this month`);
    }
    
    // Case 3: index + weekday + date + quarterMonthIndex
    // Return the Nth weekday in the specified month of the quarter
    if (index && quarterMonthIndex !== undefined && !month) {
        const weekIndex = indexMap[index];
        if (weekIndex === undefined) {
            throw new Error('Invalid index parameter');
        }
        
        // Validate quarter month index (1-3)
        if (quarterMonthIndex < 1 || quarterMonthIndex > 3) {
            throw new Error('quarterMonthIndex must be 1, 2, or 3');
        }
        
        // Determine quarter based on the reference date's month
        const refMonth = startDate.getMonth(); // 0-11
        const quarter = Math.floor(refMonth / 3); // 0, 1, 2, 3
        
        // Calculate target month within the quarter (0-11)
        const targetMonth = (quarter * 3) + (quarterMonthIndex - 1);
        
        // Find the Nth weekday in the target month
        let foundCount = 0;
        const daysInMonth = new Date(currentYear, targetMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const testDate = new Date(currentYear, targetMonth, day);
            if (testDate.getDay() === targetWeekday) {
                foundCount++;
                if (foundCount === weekIndex) {
                    return getStringOfDate(testDate, zeropadding);
                }
            }
        }
        
        throw new Error(`No ${index} ${weekday} in month ${quarterMonthIndex} of quarter ${quarter + 1}`);
    }
    
    // Case 4: index + weekday + month + date (original logic)
    // Return the Nth weekday in the specified month of the same year
    if (index && month) {
        const weekIndex = indexMap[index];
        if (weekIndex === undefined) {
            throw new Error('Invalid index parameter');
        }
        
        const currentMonth = monthMap[month];
        if (currentMonth === undefined) {
            throw new Error('Invalid month parameter');
        }
        
        // For first, second, third, fourth, fifth weeks
        let foundCount = 0;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const testDate = new Date(currentYear, currentMonth, day);
            if (testDate.getDay() === targetWeekday) {
                foundCount++;
                if (foundCount === weekIndex) {
                    return getStringOfDate(testDate, zeropadding);
                }
            }
        }
        
        // If we reach here, it means the month doesn't have the requested occurrence of that weekday
        throw new Error(`No ${index} ${weekday} in ${month}`);
    }
    
    // Case 5: Additional case - only month + weekday + date (without index)
    // Return the first weekday in the specified month
    if (month && !index && quarterMonthIndex === undefined) {
        const currentMonth = monthMap[month];
        if (currentMonth === undefined) {
            throw new Error('Invalid month parameter');
        }
        
        // Find the first matching weekday in the specified month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const testDate = new Date(currentYear, currentMonth, day);
            if (testDate.getDay() === targetWeekday) {
                return getStringOfDate(testDate, zeropadding);
            }
        }
        
        throw new Error(`No ${weekday} found in ${month}`);
    }
    
    // Invalid parameter combination
    throw new Error('Invalid parameter combination');
};

// Adjust date to nearest business day (forward by default)
const adjustToBusinessDay = (date, backward = false) => {
    const result = new Date(date);
    
    while (!isBusinessDay(result)) {
        if (backward) {
            result.setDate(result.getDate() - 1);
        } else {
            result.setDate(result.getDate() + 1);
        }
    }
    
    return result;
};

export const getDayAfterDate = ({period, days, date, isExcludeWeekend = false}, zeropadding = true) => {
    const startDate = new Date(date);
    let resultDate = new Date(startDate);
    
    if (period === 'Month') {
        const year = startDate.getFullYear();
        const month = startDate.getMonth();
        
        if (isExcludeWeekend) {
            // Find the Nth business day of the month
            let businessDayCount = 0;
            let currentDay = 1;
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            while (currentDay <= daysInMonth && businessDayCount < days) {
                const currentDate = new Date(year, month, currentDay);
                if (isBusinessDay(currentDate)) {
                    businessDayCount++;
                    if (businessDayCount === days) {
                        resultDate = currentDate;
                        break;
                    }
                }
                currentDay++;
            }
            
            // If there aren't enough business days in the month, return the last business day
            if (businessDayCount < days) {
                // Find the last business day by checking backwards from the end of the month
                let lastDay = daysInMonth;
                while (lastDay >= 1) {
                    const lastDate = new Date(year, month, lastDay);
                    if (isBusinessDay(lastDate)) {
                        resultDate = lastDate;
                        break;
                    }
                    lastDay--;
                }
            }
        } else {
            // Original logic: return the Nth calendar day
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const targetDay = Math.min(days, daysInMonth);
            resultDate = new Date(year, month, targetDay);
        }
    } else if (period === 'Quarter') {
        // Calculate current quarter
        const currentQuarter = Math.floor(startDate.getMonth() / 3);
        const quarterStartMonth = currentQuarter * 3;
        const quarterStartDate = new Date(startDate.getFullYear(), quarterStartMonth, 1);
        const quarterEndMonth = quarterStartMonth + 2;
        const quarterEndDate = new Date(startDate.getFullYear(), quarterEndMonth + 1, 0);
        
        if (isExcludeWeekend) {
            // Find the Nth business day of the quarter
            let businessDayCount = 0;
            let currentDate = new Date(quarterStartDate);
            
            while (currentDate <= quarterEndDate && businessDayCount < days) {
                if (isBusinessDay(currentDate)) {
                    businessDayCount++;
                    if (businessDayCount === days) {
                        resultDate = new Date(currentDate);
                        break;
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            
            // If there aren't enough business days in the quarter, return the last business day
            if (businessDayCount < days) {
                // Find the last business day by checking backwards from the end of the quarter
                let lastDate = new Date(quarterEndDate);
                while (lastDate >= quarterStartDate) {
                    if (isBusinessDay(lastDate)) {
                        resultDate = new Date(lastDate);
                        break;
                    }
                    lastDate.setDate(lastDate.getDate() - 1);
                }
            }
        } else {
            // Original Quarter logic
            resultDate = new Date(quarterStartDate);
            resultDate.setDate(resultDate.getDate() + days);
            
            // If result exceeds the quarter, use the last day of the quarter
            if (resultDate.getMonth() > quarterEndMonth || resultDate.getFullYear() !== startDate.getFullYear()) {
                resultDate = new Date(quarterEndDate);
            }
        }
    } else {
        throw new Error('Invalid period parameter. Use "Month" or "Quarter"');
    }
    
    return getStringOfDate(resultDate, zeropadding);
};




export const getDayPriorToEndOfDate = ({period, days, date, isExcludeWeekend = false}, zeropadding = true) => {
    const startDate = new Date(date);
    let endOfPeriodDate;
    
    
    if (period === 'Month') {
        // Get the last day of the current month
        endOfPeriodDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    } else if (period === 'Quarter') {
        // Calculate the current quarter
        const currentQuarter = Math.floor(startDate.getMonth() / 3);
        const quarterEndMonth = currentQuarter * 3 + 2;
        
        // Get the last day of the current quarter
        endOfPeriodDate = new Date(startDate.getFullYear(), quarterEndMonth + 1, 0);
    } else {
        throw new Error('Invalid period parameter. Use "Month" or "Quarter"');
    }
    
    // Get the base result date by subtracting days from end of period
    let resultDate = new Date(endOfPeriodDate);
    resultDate.setDate(resultDate.getDate() - days);
    
    // Check if still within the same period
    if (period === 'Month') {
        if (resultDate.getMonth() !== endOfPeriodDate.getMonth() || 
            resultDate.getFullYear() !== endOfPeriodDate.getFullYear()) {
            // If subtracted into previous month, adjust to the first day of current period
            resultDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        }
    } else if (period === 'Quarter') {
        const currentQuarter = Math.floor(startDate.getMonth() / 3);
        const quarterStartMonth = currentQuarter * 3;
        const quarterEndMonth = quarterStartMonth + 2;
        
        if (resultDate.getMonth() < quarterStartMonth || 
            resultDate.getFullYear() !== startDate.getFullYear()) {
            // If subtracted into previous quarter, adjust to the first day of current period
            resultDate = new Date(startDate.getFullYear(), quarterStartMonth, 1);
        }
    }
    
    // If exclude weekend is true and result is not a business day, adjust it
    if (isExcludeWeekend && !isBusinessDay(resultDate)) {
        if (period === 'Month') {
            // For Month period
            // First try adjusting backward to a business day
            let adjustedDate = adjustToBusinessDay(resultDate, true);
            
            // Check if adjusted date is still in the same month
            if (adjustedDate.getMonth() !== resultDate.getMonth() || 
                adjustedDate.getFullYear() !== resultDate.getFullYear()) {
                // If backward adjustment goes to previous month, adjust forward
                adjustedDate = adjustToBusinessDay(resultDate, false);
                
                // Check again if it's in the same month
                if (adjustedDate.getMonth() !== resultDate.getMonth() || 
                    adjustedDate.getFullYear() !== resultDate.getFullYear()) {
                    // If still not in same month, use the first business day of the month
                    adjustedDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                    adjustedDate = adjustToBusinessDay(adjustedDate, false);
                }
            }
            
            resultDate = adjustedDate;
        } else if (period === 'Quarter') {
            // For Quarter period
            // First try adjusting backward to a business day
            let adjustedDate = adjustToBusinessDay(resultDate, true);
            
            // Check if adjusted date is still in the same quarter
            const currentQuarter = Math.floor(startDate.getMonth() / 3);
            const adjustedQuarter = Math.floor(adjustedDate.getMonth() / 3);
            
            if (adjustedQuarter !== currentQuarter || adjustedDate.getFullYear() !== startDate.getFullYear()) {
                // If backward adjustment goes to previous quarter, adjust forward
                adjustedDate = adjustToBusinessDay(resultDate, false);
                
                // Check again if it's in the same quarter
                const newAdjustedQuarter = Math.floor(adjustedDate.getMonth() / 3);
                if (newAdjustedQuarter !== currentQuarter || adjustedDate.getFullYear() !== startDate.getFullYear()) {
                    // If still not in same quarter, use the first business day of the quarter
                    const quarterStartMonth = currentQuarter * 3;
                    adjustedDate = new Date(startDate.getFullYear(), quarterStartMonth, 1);
                    adjustedDate = adjustToBusinessDay(adjustedDate, false);
                }
            }
            
            resultDate = adjustedDate;
        }
    }
    
    return getStringOfDate(resultDate, zeropadding);
};


export const getYearOfDate = ({month, day, date}, zeropadding = true) => {
    const referenceDate = new Date(date);
    const year = referenceDate.getFullYear();
    
    // Create date with the same year, and specified month and day
    let resultDate = new Date(year, month - 1, day); // month is 0-indexed in Date
    
    // Check if the resulting date is valid (handles cases like Feb 30, etc.)
    if (resultDate.getFullYear() !== year || 
        resultDate.getMonth() !== month - 1 || 
        resultDate.getDate() !== day) {
        // If invalid date (like Feb 30), adjust to the last day of the specified month
        resultDate = new Date(year, month, 0);
    }
    
    return getStringOfDate(resultDate, zeropadding);
};




