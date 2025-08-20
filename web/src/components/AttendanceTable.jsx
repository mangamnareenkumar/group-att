import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import AttendanceModal from './AttendanceModal';

const getAttendanceColor = (percentage) => {
  if (percentage >= 85) return 'text-green-600 dark:text-green-400';
  if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

const getAttendanceBg = (percentage) => {
  if (percentage >= 85) return 'bg-green-50 dark:bg-green-900/20';
  if (percentage >= 75) return 'bg-yellow-50 dark:bg-yellow-900/20';
  return 'bg-red-50 dark:bg-red-900/20';
};

export default function AttendanceTable({ data, groupName }) {
  const [modalData, setModalData] = useState({ isOpen: false, student: null, type: null, date: null });
  
  const { successfulData, failedData } = useMemo(() => ({
    successfulData: data.filter(item => item.success),
    failedData: data.filter(item => !item.success)
  }), [data]);

  const openModal = (student, type, date = null) => {
    setModalData({ isOpen: true, student, type, date });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, student: null, type: null, date: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="gradient-btn p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
          <div>
            <h2 className="text-lg sm:text-2xl font-bold">{groupName} Attendance</h2>
            <p className="text-xs sm:text-sm text-white/80">
              {successfulData.length} of {data.length} records loaded successfully
            </p>
          </div>
        </div>
      </div>

      {failedData.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Failed to load data for:</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {failedData.map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs rounded-md font-mono"
              >
                {item.roll}
              </span>
            ))}
          </div>
        </div>
      )}

      {successfulData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="glass">
              <tr>
                <th className="px-2 sm:px-6 py-2 sm:py-4 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  <div>Today</div>
                  {successfulData[0]?.data?.todayDate && (
                    <div className="text-xs font-normal normal-case text-white/50 hidden sm:block">
                      {successfulData[0].data.todayDate}
                    </div>
                  )}
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  <div>Yesterday</div>
                  {successfulData[0]?.data?.yesterdayDate && (
                    <div className="text-xs font-normal normal-case text-white/50 hidden sm:block">
                      {successfulData[0].data.yesterdayDate}
                    </div>
                  )}
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Total %
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {successfulData.map((item, index) => (
                <motion.tr
                  key={item.roll}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-2 sm:px-6 py-2 sm:py-4">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="gradient-btn p-1 sm:p-2 rounded-xl">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-white">
                          {item.data.name || 'Unknown'}
                        </div>
                        <div className="text-xs sm:text-sm text-white/70 font-mono">
                          {item.data.roll}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4">
                    <button
                      onClick={() => openModal(item.data, 'today', item.data.todayDate)}
                      className="flex items-center space-x-1 sm:space-x-2 glass-hover p-1 sm:p-2 rounded-xl transition-colors"
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {item.data.today || '0/0'}
                      </span>
                    </button>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4">
                    <button
                      onClick={() => openModal(item.data, 'yesterday', item.data.yesterdayDate)}
                      className="flex items-center space-x-1 sm:space-x-2 glass-hover p-1 sm:p-2 rounded-xl transition-colors"
                    >
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {item.data.yesterday || '0/0'}
                      </span>
                    </button>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4">
                    <button
                      onClick={() => openModal(item.data, 'total')}
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium hover:scale-105 transition-transform ${getAttendanceBg(item.data.totalAggPercent)}`}
                    >
                      <span className={getAttendanceColor(item.data.totalAggPercent)}>
                        {item.data.totalAggPercent?.toFixed(1) || 'N/A'}%
                      </span>
                    </button>
                  </td>
                  <td className="px-2 sm:px-6 py-2 sm:py-4">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      {item.data.totalAggPercent >= 75 ? (
                        <div className="flex items-center space-x-1 text-green-400">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Good</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-400">
                          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm font-medium hidden sm:inline">Low</span>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center">
          <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-white/40 mx-auto mb-4" />
          <p className="text-sm sm:text-base text-white/70">No attendance data available</p>
        </div>
      )}

      {successfulData.length > 0 && (
        <div className="glass px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-white/70">
            <span>Last updated: {new Date().toLocaleString()}</span>
            <span>
              Average: {successfulData.length > 0 ? (successfulData.reduce((acc, item) => acc + (item.data.totalAggPercent || 0), 0) / successfulData.length).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>
      )}

      <AttendanceModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        studentData={modalData.student}
        type={modalData.type}
        date={modalData.date}
      />
    </motion.div>
  );
}