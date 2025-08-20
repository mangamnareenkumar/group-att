import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import Layout from './components/Layout';
import GroupForm from './components/GroupForm';
import GroupCard from './components/GroupCard';
import AttendanceTable from './components/AttendanceTable';
import LoadingSpinner from './components/LoadingSpinner';
import { attendanceAPI } from './utils/api';
import { userStorage } from './utils/userStorage';

export default function App() {
  const [groups, setGroups] = useState({});
  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'attendance' ? 'attendance' : 'groups';
  });
  const [selectedGroup, setSelectedGroup] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('group') || null;
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [limitMessage, setLimitMessage] = useState('');

  useEffect(() => {
    loadGroups();
    
    // Load attendance data if URL indicates attendance view
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const group = params.get('group');
    
    if (view === 'attendance' && group) {
      handleViewAttendance(group);
    }
  }, []);

  const loadGroups = async () => {
    try {
      // Load user-specific groups from localStorage
      const localGroups = userStorage.getUserGroups();
      setGroups(localGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const handleCreateGroup = async (name, rollNumbers, campus) => {
    setLoading(true);
    try {
      const currentGroups = userStorage.getUserGroups();
      
      if (editingGroup) {
        // Update existing group
        delete currentGroups[editingGroup];
        currentGroups[name] = { rollNumbers, campus };
        setEditingGroup(null);
      } else {
        // Check group limit for new groups
        if (!userStorage.canCreateGroup()) {
          throw new Error('Maximum 3 groups allowed per user');
        }
        // Create new group
        if (currentGroups[name]) {
          throw new Error('Group already exists');
        }
        currentGroups[name] = { rollNumbers, campus };
      }
      
      userStorage.saveUserGroups(currentGroups);
      await loadGroups();
      setShowForm(false);
      if (editingGroup) {
        setEditingGroup(null);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditGroup = (groupName) => {
    setEditingGroup(groupName);
    setShowForm(true);
  };

  const handleDeleteGroup = async (name) => {
    if (!confirm(`Delete group "${name}"?`)) return;
    
    try {
      const currentGroups = userStorage.getUserGroups();
      delete currentGroups[name];
      userStorage.saveUserGroups(currentGroups);
      await loadGroups();
    } catch (error) {
      alert('Failed to delete group');
    }
  };

  const handleViewAttendance = async (groupName) => {
    setSelectedGroup(groupName);
    setCurrentView('attendance');
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.set('view', 'attendance');
    url.searchParams.set('group', groupName);
    window.history.pushState({}, '', url);
    
    setLoading(true);
    
    try {
      const data = await attendanceAPI.getGroupAttendance(groupName);
      setAttendanceData(data);
    } catch (error) {
      alert('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAttendance = async () => {
    if (selectedGroup) {
      setLoading(true);
      try {
        const data = await attendanceAPI.getGroupAttendance(selectedGroup);
        setAttendanceData(data);
      } catch (error) {
        alert('Failed to refresh attendance data');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToGroups = () => {
    setCurrentView('groups');
    setSelectedGroup(null);
    setAttendanceData([]);
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.delete('view');
    url.searchParams.delete('group');
    window.history.pushState({}, '', url);
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {currentView === 'groups' ? (
          <motion.div
            key="groups"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div></div>
              <button
                onClick={() => {
                  if (!userStorage.canCreateGroup() && !showForm) {
                    setLimitMessage('Group limit reached! Maximum 3 groups allowed per user.');
                    setTimeout(() => setLimitMessage(''), 5000);
                    return;
                  }
                  setShowForm(!showForm);
                  setLimitMessage('');
                }}
                className="gradient-btn flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">New Group</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>

            {limitMessage && (
              <div className="glass rounded-xl p-4 border border-red-400/50 bg-red-500/10">
                <p className="text-red-400 text-sm font-medium text-center">{limitMessage}</p>
              </div>
            )}

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <GroupForm 
                    onSubmit={handleCreateGroup} 
                    loading={loading} 
                    editingGroup={editingGroup}
                    groups={groups}
                    onCancel={() => { setShowForm(false); setEditingGroup(null); }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groups).map(([name, group], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GroupCard
                    name={name}
                    group={group}
                    onView={handleViewAttendance}
                    onEdit={handleEditGroup}
                    onDelete={handleDeleteGroup}
                  />
                </motion.div>
              ))}
            </div>

            {Object.keys(groups).length === 0 && !showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="glass rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
                  <div className="gradient-btn w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Plus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    No groups yet
                  </h3>
                  <p className="text-white/70 mb-8 text-sm sm:text-base">
                    Create your first group to start tracking attendance together
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="gradient-btn text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    Create First Group
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={handleBackToGroups}
                  className="glass glass-hover p-2 rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </button>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white">
                    Attendance Data
                  </h1>
                  <p className="text-xs sm:text-sm text-white/70 hidden sm:block">
                    Real-time attendance tracking for your group
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefreshAttendance}
                disabled={loading}
                className="gradient-btn flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-xl disabled:opacity-50 text-sm sm:text-base"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching attendance data..." />
            ) : (
              <AttendanceTable data={attendanceData} groupName={selectedGroup} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}