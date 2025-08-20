import { userStorage } from './userStorage';

const API_BASE = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3001/api`;

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

    // Fetch with timeout and retry mechanism
    const fetchWithRetry = async (url, retries = 3, timeout = 8000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await Promise.race([
            fetch(url),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ]);
          return response;
        } catch (error) {
          if (i === retries - 1) throw error;
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    };

    // Process in smaller batches with delays
    const batchSize = 3;
    const results = [];
    
    for (let i = 0; i < group.rollNumbers.length; i += batchSize) {
      const batch = group.rollNumbers.slice(i, i + batchSize);
      const batchPromises = batch.map(async (roll) => {
        try {
          const response = await fetchWithRetry(`${API_BASE}/attendance/${roll}`);
          if (response.ok) {
            const data = await response.json();
            return { roll, success: true, data };
          } else {
            return { roll, success: false, error: `HTTP ${response.status}` };
          }
        } catch (error) {
          return { roll, success: false, error: error.message };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to avoid overwhelming server
      if (i + batchSize < group.rollNumbers.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }
};