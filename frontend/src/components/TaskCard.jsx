import React from 'react';
import { Calendar, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, isAdmin }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  const statusColors = {
    TODO: 'bg-slate-700/50 text-slate-300 border-slate-600',
    IN_PROGRESS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    DONE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  };

  const statusIcons = {
    TODO: <Clock size={16} />,
    IN_PROGRESS: <PlayCircle size={16} />,
    DONE: <CheckCircle2 size={16} />,
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
          {task.title}
        </h3>
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${statusColors[task.status]} flex items-center gap-1.5`}>
          {statusIcons[task.status]}
          {task.status.replace('_', ' ')}
        </span>
      </div>
      
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {task.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
        <div className="flex flex-col gap-1">
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-rose-400 font-medium' : 'text-slate-400'}`}>
              <Calendar size={14} />
              {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && <span className="ml-1 bg-rose-500/20 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-tighter">Overdue</span>}
            </div>
          )}
          {task.assignee && (
            <div className="text-xs text-slate-500 italic">
              Assigned to: {task.assignee.name}
            </div>
          )}
        </div>

        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
