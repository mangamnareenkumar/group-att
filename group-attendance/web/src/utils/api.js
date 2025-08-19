import { userStorage } from './userStorage';

const API_BASE = `${window.location.protocol}//${window.location.hostname}${window.location.hostname === 'localhost' ? ':3001' : ''}/api`;

// Cache for attendance data
const attendanceCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const attendanceAPI = {
  getGroupAttendance: async (groupName) => {
    const groups = userStorage.getUserGroups();
    const group = groups[groupName];
    
    if (!group) {
      throw new Error('Group not found');
    }

    // Fetch with timeout and parallel processing
    const fetchWithTimeout = (url, timeout = 5000) => {
      return Promise.race([
        fetch(url),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);
    };

    // Process in batches to avoid overwhelming the server
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < group.rollNumbers.length; i += batchSize) {
      const batch = group.rollNumbers.slice(i, i + batchSize);
      const batchPromises = batch.map(async (roll) => {
        try {
          const response = await fetchWithTimeout(`${API_BASE}/attendance/${roll}`);
          if (response.ok) {
            const data = await response.json();
            return { roll, success: true, data };
          } else {
            return { roll, success: false, error: 'Failed to fetch' };
          }
        } catch (error) {
          return { roll, success: false, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }
};