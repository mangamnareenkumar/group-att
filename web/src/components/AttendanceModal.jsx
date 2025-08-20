import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BookOpen } from 'lucide-react';

export default function AttendanceModal({ isOpen, onClose, studentData, type, date }) {
  if (!isOpen || !studentData) return null;

  const getSubjects = () => {
    if (type === 'total') {
      return studentData.totalBreakdown || [];
    } else if (type === 'today') {
      return studentData.todaySubjects || [];
    } else if (type === 'yesterday') {
      return studentData.yesterdaySubjects || [];
    } else if (type === 'dayBefore') {
      return studentData.dayBeforeSubjects || [];
    }
    return [];
  };

  const subjects = getSubjects();

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass shadow-2xl max-w-md sm:max-w-2xl w-full max-h-[80vh] overflow-hidden border border-white/20"
          style={{ borderRadius: '24px' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="gradient-btn p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">{studentData.name}</h2>
                  <p className="text-white/80 text-xs sm:text-sm">
                    {type === 'total' ? 'Total Attendance Breakdown' : `${type} Attendance`}
                    {date && ` - ${date}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 glass-hover rounded-xl transition-colors text-white/80 hover:text-white"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
            {subjects.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-xl p-3 sm:p-4 border border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-white">
                            {subject.subject}
                          </h3>

                        </div>
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold text-white">
                            {subject.attended}/{subject.held}
                          </div>
                          <div className={`text-xs sm:text-sm font-medium ${
                            subject.percent >= 85 ? 'text-green-400' :
                            subject.percent >= 75 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {subject.percent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              subject.percent >= 85 ? 'bg-green-500' :
                              subject.percent >= 75 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(subject.percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-white/40 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-white/70">
                  {type === 'total' ? 'No subject breakdown available' : 'No classes held on this day'}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}