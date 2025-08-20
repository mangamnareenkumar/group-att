// Simple user management for production
export const userStorage = {
  getCurrentUser() {
    return localStorage.getItem('attendance_user_id') || this.createUser();
  },

  createUser() {
    const adjectives = ['Smart', 'Cool', 'Fast', 'Bright', 'Quick', 'Sharp', 'Bold', 'Swift'];
    const nouns = ['Student', 'Learner', 'Scholar', 'Genius', 'Ace', 'Star', 'Pro', 'Expert'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;
    
    const username = `${randomAdjective}${randomNoun}${randomNum}`;
    localStorage.setItem('attendance_user_id', username);
    return username;
  },

  getUserGroups() {
    const userId = this.getCurrentUser();
    const groups = localStorage.getItem(`groups_${userId}`);
    return groups ? JSON.parse(groups) : {};
  },

  saveUserGroups(groups) {
    const userId = this.getCurrentUser();
    localStorage.setItem(`groups_${userId}`, JSON.stringify(groups));
  },

  canCreateGroup() {
    const groups = this.getUserGroups();
    return Object.keys(groups).length < 3;
  },

  clearUserData() {
    const userId = this.getCurrentUser();
    localStorage.removeItem(`groups_${userId}`);
    localStorage.removeItem('attendance_user_id');
  }
};