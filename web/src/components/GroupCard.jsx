import React from 'react';
import { Users, Trash2, Eye, Edit } from 'lucide-react';

export default function GroupCard({ name, group, onView, onEdit, onDelete }) {
  const rollNumbers = Array.isArray(group) ? group : (group?.rollNumbers || []);
  const campus = group?.campus || 'AEC';

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 glass-hover group">
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="h-5 w-5 text-green-400" />
          <h3 className="font-semibold text-white text-base sm:text-lg">{name}</h3>
        </div>
        <p className="text-white/70 text-xs sm:text-sm">
          {rollNumbers.length} members • {campus}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {rollNumbers.slice(0, 3).map((roll, index) => (
            <span
              key={index}
              className="px-3 py-1 glass rounded-xl text-white/90 text-xs font-mono"
            >
              {roll}
            </span>
          ))}
          {rollNumbers.length > 3 && (
            <span className="px-3 py-1 glass rounded-xl text-white/70 text-xs">
              +{rollNumbers.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onView(name)}
          className="gradient-btn flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center space-x-1 sm:space-x-2"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>View</span>
        </button>
        <button
          onClick={() => onEdit(name)}
          className="glass glass-hover p-2 rounded-xl text-green-400 hover:text-green-300"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
        <button
          onClick={() => onDelete(name)}
          className="glass glass-hover p-2 rounded-xl text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
}