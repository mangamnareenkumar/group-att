import React, { useState } from 'react';
import { Plus, X, Users, AlertCircle } from 'lucide-react';

export default function GroupForm({ onSubmit, loading, editingGroup, groups, onCancel }) {
  const [name, setName] = useState('');
  const [rollNumbers, setRollNumbers] = useState(['']);
  const [campus, setCampus] = useState('AEC');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (editingGroup && groups[editingGroup]) {
      const group = groups[editingGroup];
      setName(editingGroup);
      setRollNumbers(Array.isArray(group) ? group : group.rollNumbers);
      setCampus(group.campus || 'AEC');
    } else {
      setName('');
      setRollNumbers(['']);
      setCampus('AEC');
    }
  }, [editingGroup, groups]);

  const addRollField = () => {
    if (rollNumbers.length < 20) {
      setRollNumbers([...rollNumbers, '']);
    }
  };

  const removeRollField = (index) => {
    if (rollNumbers.length > 1) {
      setRollNumbers(rollNumbers.filter((_, i) => i !== index));
    }
  };

  const updateRollNumber = (index, value) => {
    const updated = [...rollNumbers];
    updated[index] = value.toUpperCase();
    setRollNumbers(updated);
  };

  const validateRollNumber = (roll) => {
    const rollRegex = /^\d.*\d$/;
    return roll.length === 10 && rollRegex.test(roll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validRolls = rollNumbers.filter(roll => roll.trim());
    if (!name.trim() || validRolls.length === 0) {
      setError('Please provide group name and at least one roll number');
      return;
    }

    // Validate roll numbers
    const invalidRolls = validRolls.filter(roll => !validateRollNumber(roll));
    if (invalidRolls.length > 0) {
      setError('Invalid Reg.No');
      return;
    }

    try {
      await onSubmit(name.trim(), validRolls, campus);
      if (!editingGroup) {
        setName('');
        setRollNumbers(['']);
        setCampus('AEC');
      }
    } catch (err) {
      setError(editingGroup ? 'Failed to update group. Please try again.' : 'Failed to create group. Please try again.');
    }
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="gradient-btn p-2 rounded-xl">
          <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          {editingGroup ? 'Edit Group' : 'Create New Group'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Roommates, Project Team"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 glass rounded-xl text-white placeholder-white/50 focus:bg-white/20 transition-all border border-white/20 focus:border-green-400"
              maxLength={50}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Campus
            </label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 glass rounded-xl text-white focus:bg-white/20 transition-all border border-white/20 focus:border-green-400"
            >
              <option value="AEC" className="bg-slate-800">AEC</option>
              <option value="ACET" className="bg-slate-800">ACET</option>
              <option value="AGBS" className="bg-slate-800">AGBS</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Roll Numbers
          </label>
          <div className="space-y-3">
            {rollNumbers.map((roll, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={roll}
                  onChange={(e) => updateRollNumber(index, e.target.value)}
                  placeholder="22A91A6188"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 glass rounded-xl text-white placeholder-white/50 focus:bg-white/20 transition-all font-mono border border-white/20 focus:border-green-400"
                  maxLength={10}
                />
                {rollNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRollField(index)}
                    className="p-2 sm:p-3 glass glass-hover rounded-xl text-red-400 hover:text-red-300 border border-white/20 hover:border-red-400"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {rollNumbers.length < 20 && (
            <button
              type="button"
              onClick={addRollField}
              className="mt-3 flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors glass-hover px-3 py-2 rounded-xl"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Add another roll number</span>
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-400 glass rounded-xl p-3 sm:p-4 border border-red-400/50">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-white/20">
          {editingGroup && (
            <button
              type="button"
              onClick={onCancel}
              className="glass glass-hover flex-1 py-2 sm:py-3 px-4 rounded-xl text-white/90 font-medium border border-white/20 hover:border-white/40 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn flex-1 py-2 sm:py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (editingGroup ? 'Updating...' : 'Creating...') : (editingGroup ? 'Update Group' : 'Create Group')}
          </button>
        </div>
      </form>
    </div>
  );
}