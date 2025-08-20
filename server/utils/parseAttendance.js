import * as cheerio from 'cheerio';

export function parseAttendance(html) {
  const $ = cheerio.load(html);
  const bodyText = $('body').text();
  
  // Extract name and roll
  const titleMatch = bodyText.match(/([A-Z\s]+)'s Attendance Data \(([A-Z0-9]+)\)/);
  const name = titleMatch?.[1]?.trim() || null;
  const roll = titleMatch?.[2] || null;
  
  // Extract updated date
  const updatedMatch = bodyText.match(/Updated on:\s*([^\n]+)/);
  const updatedOn = updatedMatch?.[1]?.trim() || null;
  
  // Extract today's attendance data with date
  const todaySection = bodyText.match(/Today's Attendance \(([^)]+)\)[\s\S]*?(?=Yesterday's Attendance|Day before|Total Attendance|$)/);
  let today = null;
  let todayDate = null;
  let todaySubjects = [];
  if (todaySection) {
    todayDate = todaySection[1];
    const todayTotal = todaySection[0].match(/TOTAL\s+(\d+)\s+(\d+)\s+[\d.]+/);
    today = todayTotal ? `${todayTotal[2]}/${todayTotal[1]}` : '0/0';
    
    // Extract subjects for today
    const subjectRegex = /(\d+)\s+([A-Za-z][A-Za-z0-9\s-]*?)\s+(\d+)\s+(\d+)\s+([\d.]+)/g;
    let match;
    while ((match = subjectRegex.exec(todaySection[0]))) {
      const subject = match[2].trim();
      if (subject !== 'TOTAL') {
        todaySubjects.push({
          sNo: Number(match[1]),
          subject: subject,
          held: Number(match[3]),
          attended: Number(match[4]),
          percent: Number(match[5])
        });
      }
    }
  }
  
  // Extract yesterday's attendance data with date
  const yesterdaySection = bodyText.match(/Yesterday's Attendance \(([^)]+)\)[\s\S]*?(?=Day before|Total Attendance|$)/);
  let yesterday = null;
  let yesterdayDate = null;
  let yesterdaySubjects = [];
  if (yesterdaySection) {
    yesterdayDate = yesterdaySection[1];
    const yesterdayTotal = yesterdaySection[0].match(/TOTAL\s+(\d+)\s+(\d+)\s+[\d.]+/);
    yesterday = yesterdayTotal ? `${yesterdayTotal[2]}/${yesterdayTotal[1]}` : '0/0';
    
    // Extract subjects for yesterday
    const subjectRegex = /(\d+)\s+([A-Za-z][A-Za-z0-9\s-]*?)\s+(\d+)\s+(\d+)\s+([\d.]+)/g;
    let match;
    while ((match = subjectRegex.exec(yesterdaySection[0]))) {
      const subject = match[2].trim();
      if (subject !== 'TOTAL') {
        yesterdaySubjects.push({
          sNo: Number(match[1]),
          subject: subject,
          held: Number(match[3]),
          attended: Number(match[4]),
          percent: Number(match[5])
        });
      }
    }
  }
  
  // Extract day before yesterday's attendance data with date
  const dayBeforeSection = bodyText.match(/Day before Yesterday's Attendance \(([^)]+)\)[\s\S]*?(?=Total Attendance|$)/);
  let dayBefore = null;
  let dayBeforeDate = null;
  let dayBeforeSubjects = [];
  if (dayBeforeSection) {
    dayBeforeDate = dayBeforeSection[1];
    const dayBeforeTotal = dayBeforeSection[0].match(/TOTAL\s+(\d+)\s+(\d+)\s+[\d.]+/);
    dayBefore = dayBeforeTotal ? `${dayBeforeTotal[2]}/${dayBeforeTotal[1]}` : '0/0';
    
    // Extract subjects for day before
    const subjectRegex = /(\d+)\s+([A-Za-z][A-Za-z0-9\s-]*?)\s+(\d+)\s+(\d+)\s+([\d.]+)/g;
    let match;
    console.log('Day before section text:', dayBeforeSection[0]);
    while ((match = subjectRegex.exec(dayBeforeSection[0]))) {
      const subject = match[2].trim();
      console.log('Found day before subject:', subject, 'held:', match[3], 'attended:', match[4]);
      if (subject !== 'TOTAL') {
        dayBeforeSubjects.push({
          sNo: Number(match[1]),
          subject: subject,
          held: Number(match[3]),
          attended: Number(match[4]),
          percent: Number(match[5])
        });
      }
    }
    console.log('Day before subjects found:', dayBeforeSubjects.length);
  }
  
  // Extract total percentage - find the main TOTAL row in Total Attendance section
  const totalAttendanceMatch = bodyText.match(/Total Attendance[\s\S]*?TOTAL\s+(\d+)\s+(\d+)\s+([\d.]+)/);
  const totalAggPercent = totalAttendanceMatch ? Number(totalAttendanceMatch[3]) : null;
  
  // Extract subject breakdown - only from Total Attendance section
  const totalBreakdown = [];
  const totalAttendanceSection = bodyText.match(/Total Attendance[\s\S]*?(?=Yesterday's Attendance|Day before|$)/);
  
  if (totalAttendanceSection) {
    const subjectRegex = /(\d+)\s+([A-Za-z][A-Za-z0-9\s-]*?)\s+(\d+)\s+(\d+)\s+([\d.]+)/g;
    let match;
    
    while ((match = subjectRegex.exec(totalAttendanceSection[0]))) {
      const subject = match[2].trim();
      if (subject !== 'TOTAL') {
        totalBreakdown.push({
          sNo: Number(match[1]),
          subject: subject,
          held: Number(match[3]),
          attended: Number(match[4]),
          percent: Number(match[5])
        });
      }
    }
  }
  
  return {
    name,
    roll,
    updatedOn,
    today,
    yesterday,
    dayBefore,
    todayDate,
    yesterdayDate,
    dayBeforeDate,
    todaySubjects,
    yesterdaySubjects,
    dayBeforeSubjects,
    totalBreakdown,
    totalAggPercent
  };
}