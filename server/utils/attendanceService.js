import fetch from 'node-fetch';
import { parseAttendance } from './parseAttendance.js';

const ATTENDANCE_BASE_URL = 'https://attendance.sandyy.in';
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchAttendanceData(rollNumber, campus = 'AEC') {
  const cacheKey = rollNumber;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `${ATTENDANCE_BASE_URL}/${campus}/${rollNumber}`;
    const response = await fetch(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Group-Attendance-Viewer/1.0' }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const data = parseAttendance(html);
    
    if (!data.name || !data.roll) {
      throw new Error('Invalid attendance data received');
    }

    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch attendance for ${rollNumber}: ${error.message}`);
  }
}

export async function fetchGroupAttendance(rollNumbers) {
  const results = await Promise.allSettled(
    rollNumbers.map(roll => fetchAttendanceData(roll))
  );

  return results.map((result, index) => ({
    roll: rollNumbers[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }));
}