import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Pencil,
  Trash2,
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PlayCircle,
  LogOut,
  AlertCircle,
  LayoutDashboard,
  ChevronRight,
  Plus
} from 'lucide-react';

// --- API Instance ---
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- UI Components ---

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-[var(--color-glass-medium)] backdrop-blur-md border border-[var(--color-glass-light)] shadow-[var(--shadow-glass-dark)] rounded-2xl ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const variants = {
    primary: "bg-[var(--color-brand-primary)] hover:opacity-90",
    outline: "border border-[var(--color-glass-light)] hover:bg-[var(--color-glass-light)]",
  };
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Navbar = ({ user, onLogout }) => (
  <nav className="fixed top-0 w-full z-50 h-24 flex items-center px-6">
    <GlassCard className="w-full max-w-[1800px] mx-auto px-6 py-4 flex justify-between items-center bg-[var(--color-glass-dark)]">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="text-[var(--color-brand-primary)]" />
        <h1 className="text-xl font-black tracking-tighter">AuraTask <span className="text-[var(--color-brand-secondary)] text-xs ml-2 uppercase font-black">{user.role}</span></h1>
      </div>
      <Button variant="outline" onClick={onLogout} className="text-sm">
        <LogOut size={16} /> Logout
      </Button>
    </GlassCard>
  </nav>
);

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const { data } = await API.post(endpoint, formData);
      localStorage.setItem('token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Auth failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <GlassCard className="w-full max-w-md p-8 bg-[var(--color-glass-dark)]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-brand-primary)] rounded-2xl mx-auto mb-6 flex items-center justify-center text-white">
            <LayoutDashboard size={32} />
          </div>
          <h2 className="text-3xl font-black text-white">{isLogin ? 'Sign In' : 'Create Space'}</h2>
          <p className="text-white/40 mt-2">Team Task Manager MVP</p>
        </div>

        {error && <div className="bg-rose-500/10 text-rose-400 p-3 rounded-xl text-sm mb-6 text-center border border-rose-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input 
                placeholder="Name" required
                className="w-full bg-[var(--color-glass-dark)] border border-[var(--color-glass-light)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)]"
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <select 
                className="w-full bg-[var(--color-glass-dark)] border border-[var(--color-glass-light)] rounded-xl px-4 py-3 text-white/60 outline-none"
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="MEMBER" className="bg-[#1a1a1a] text-white">Member</option>
                <option value="ADMIN" className="bg-[#1a1a1a] text-white">Admin</option>
              </select>
            </>
          )}
          <input 
            type="email" placeholder="Email" required
            className="w-full bg-[var(--color-glass-dark)] border border-[var(--color-glass-light)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)]"
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full bg-[var(--color-glass-dark)] border border-[var(--color-glass-light)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-brand-primary)]"
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          <Button className="w-full py-3">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-white/40 text-sm hover:text-white">
          {isLogin ? "Need an account? Join us" : "Already have an account? Login"}
        </button>
      </GlassCard>
    </div>
  );
};

const TaskCard = ({ task, onStatusChange, onDelete, onEdit, isAdmin }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
  const statusColors = {
    TODO: "text-slate-400 bg-slate-400/10",
    IN_PROGRESS: "text-indigo-400 bg-indigo-400/10",
    DONE: "text-emerald-400 bg-emerald-400/10",
  };

  return (
    <GlassCard className="p-6 flex flex-col gap-4 border-[var(--color-glass-light)] hover:border-[var(--color-brand-primary)] transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg leading-tight mb-1">{task.title}</h3>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-black flex items-center gap-1.5">
            <Users size={12} className="text-[var(--color-brand-primary)]" /> {task.assignedTo?.name || 'Unassigned'}
          </p>
        </div>
        <span className={`px-2 py-1 rounded text-[10px] font-black border border-current ${statusColors[task.status]}`}>
          {task.status}
        </span>
      </div>
      
      {task.description ? (
        <p className="text-white/60 text-xs leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 italic">
          {task.description}
        </p>
      ) : (
        <p className="text-white/20 text-xs italic">No description provided.</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--color-glass-light)]">
        <div className={`flex items-center gap-1.5 text-xs ${isOverdue ? 'text-rose-400 font-bold' : 'text-white/40'}`}>
          <Calendar size={14} />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}
          {isOverdue && <AlertCircle size={14} className="animate-pulse" />}
        </div>
        
        {isAdmin && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(task)} className="p-1.5 hover:bg-white/10 rounded-lg text-indigo-400 transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-400 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
          <button
            key={status}
            onClick={() => onStatusChange(task.id, status)}
            className={`py-2 text-[9px] font-black rounded-lg border transition-all ${
              task.status === status 
              ? 'bg-[var(--color-brand-primary)] border-transparent text-white' 
              : 'border-[var(--color-glass-light)] text-white/40 hover:bg-white/10'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </GlassCard>
  );
};

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <GlassCard className="w-full max-w-sm p-8 bg-[var(--color-glass-dark)] border-white/10 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center ${type === 'danger' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            {message}
          </p>
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onCancel} className="flex-1 py-3 text-xs">
              Cancel
            </Button>
            <Button 
              onClick={onConfirm} 
              className={`flex-1 py-3 text-xs ${type === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : ''}`}
            >
              Confirm
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  // Admin Forms
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '', project: '' });
  const [editingTask, setEditingTask] = useState(null);

  // Custom Alert State
  const [confirmConfig, setConfirmConfig] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    onConfirm: () => {}, 
    type: 'danger' 
  });

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
      if (data.length > 0 && !selectedProject) setSelectedProject(data[0]);
    } catch (err) {
      console.error('Failed to fetch projects');
    }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await API.get('/users');
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      if (user.role === 'ADMIN') fetchMembers();
    }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProjects([]);
    setTasks([]);
  };

  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    const { data } = await API.get(`/tasks/${project.id}`);
    setTasks(data);
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (editingProject) {
      const { data } = await API.patch(`/projects/${editingProject.id}`, newProject);
      setProjects(projects.map(p => p.id === editingProject.id ? data : p));
      cancelEditProject();
    } else {
      const { data } = await API.post('/projects', newProject);
      setProjects([...projects, data]);
      setNewProject({ name: '', description: '' });
    }
  };

  const editProject = (project) => {
    setEditingProject(project);
    setNewProject({ name: project.name, description: project.description || '' });
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setNewProject({ name: '', description: '' });
  };

  const assignTask = async (e) => {
    e.preventDefault();
    if (editingTask) {
      const { data } = await API.patch(`/tasks/${editingTask.id}`, newTask);
      setTasks(tasks.map(t => t.id === editingTask.id ? data : t));
      cancelEdit();
    } else {
      const { data } = await API.post('/tasks', { ...newTask, project: selectedProject.id });
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', project: '' });
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    await API.patch(`/tasks/${taskId}/status`, { status });
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const deleteTask = (taskId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Task?',
      message: 'This action is irreversible. This task will be removed from existence in the workspace.',
      type: 'danger',
      onConfirm: async () => {
        await API.delete(`/tasks/${taskId}`);
        setTasks(prev => prev.filter(t => t.id !== taskId));
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const deleteProject = (projectId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Project?',
      message: 'Warning: This will delete the project and all associated tasks forever. Proceed with caution.',
      type: 'danger',
      onConfirm: async () => {
        await API.delete(`/projects/${projectId}`);
        setProjects(prev => prev.filter(p => p.id !== projectId));
        if (selectedProject?.id === projectId) {
          setSelectedProject(null);
          setTasks([]);
        }
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const editTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo?.id || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      project: task.project
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setNewTask({ title: '', description: '', assignedTo: '', dueDate: '', project: '' });
  };

  if (loading) return <div className="bg-[#242424] min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return (
    <div className="bg-[image:var(--background-image-mesh-gradient)] bg-[#0a0a0c] min-h-screen text-white">
      <div className="glow-bg" />
      <AuthScreen onLogin={setUser} />
    </div>
  );

  return (
    <div className="bg-[image:var(--background-image-mesh-gradient)] bg-[#0a0a0c] h-screen overflow-hidden text-white font-sans selection:bg-[var(--color-brand-primary)] selection:text-white flex flex-col">
      <div className="glow-bg" />
      <Navbar user={user} onLogout={handleLogout} />

      <ConfirmModal 
        {...confirmConfig} 
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))} 
      />

      <div className="flex-1 flex overflow-hidden pt-24 px-6 gap-8 max-w-[1800px] mx-auto w-full">
        {/* Sidebar: Projects */}
        <aside className="w-80 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10">
          <GlassCard className="p-6 bg-[var(--color-glass-dark)]">
            <h2 className="text-xs font-black uppercase text-white/40 mb-6 tracking-widest flex items-center gap-2">
              <Briefcase size={14} /> Projects
            </h2>
            <div className="space-y-2">
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className={`group/btn w-full flex items-center justify-between p-4 rounded-xl transition-all border ${
                    selectedProject?.id === p.id 
                    ? 'bg-[var(--color-brand-primary)] border-transparent' 
                    : 'bg-white/5 border-transparent hover:bg-white/10 text-white/60'
                  }`}
                >
                  <span className="font-bold text-sm truncate">{p.name}</span>
                  <div className="flex items-center gap-1">
                    {user.role === 'ADMIN' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); editProject(p); }}
                          className={`p-1.5 rounded transition-colors ${selectedProject?.id === p.id ? 'hover:bg-white/20 text-white' : 'hover:bg-indigo-500/20 text-indigo-400'}`}
                        >
                          <Pencil size={12} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                          className={`p-1.5 rounded transition-colors ${selectedProject?.id === p.id ? 'hover:bg-white/20 text-white' : 'hover:bg-rose-500/20 text-rose-400'}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                    <ChevronRight size={16} className={selectedProject?.id === p.id ? 'opacity-100' : 'opacity-0'} />
                  </div>
                </button>
              ))}
            </div>

            {user.role === 'ADMIN' && (
              <form onSubmit={createProject} className="mt-8 pt-8 border-t border-[var(--color-glass-light)] space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-black text-white/40 uppercase">
                    {editingProject ? 'Edit Project' : 'Create Project'}
                  </p>
                  {editingProject && (
                    <button onClick={cancelEditProject} className="text-[10px] text-white/40 hover:text-rose-400 uppercase font-black">Cancel</button>
                  )}
                </div>
                <input 
                  placeholder="Title" required
                  className="w-full bg-white/5 border border-[var(--color-glass-light)] rounded-lg px-3 py-2 text-xs outline-none focus:border-[var(--color-brand-primary)]"
                  value={newProject.name}
                  onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                />
                <Button className="w-full text-xs py-2">
                  {editingProject ? 'Update Project' : 'Create'}
                </Button>
              </form>
            )}
          </GlassCard>
        </aside>

        {/* Main Content: Task Feed */}
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-10 px-2">
          {!selectedProject ? (
            <GlassCard className="h-full flex flex-col items-center justify-center p-20 text-white/20">
              <LayoutDashboard size={80} strokeWidth={1} className="mb-4" />
              <p className="text-xl font-black">Select a workspace to begin</p>
            </GlassCard>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-5xl font-black mb-2 tracking-tighter">{selectedProject.name}</h2>
                <p className="text-white/40">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map(t => (
                  <TaskCard 
                    key={t.id} 
                    task={t} 
                    onStatusChange={updateTaskStatus} 
                    onDelete={deleteTask}
                    onEdit={editTask}
                    isAdmin={user.role === 'ADMIN'}
                  />
                ))}
                {tasks.length === 0 && <p className="text-white/20 text-center col-span-full py-20 font-bold">No tasks found in this workspace</p>}
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar: Assign Task */}
        {user.role === 'ADMIN' && selectedProject && (
          <aside className="w-80 overflow-y-auto custom-scrollbar pb-10">
            <GlassCard className="p-6 border-[var(--color-brand-primary)] bg-[var(--color-glass-dark)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black uppercase text-indigo-400">
                  {editingTask ? 'Edit Task' : 'Assign Task'}
                </h3>
                {editingTask && (
                  <button onClick={cancelEdit} className="text-[10px] text-white/40 hover:text-rose-400 uppercase font-black">Cancel</button>
                )}
              </div>
              <form onSubmit={assignTask} className="space-y-3">
                <input 
                  placeholder="Task Title" required
                  className="w-full bg-white/5 border border-[var(--color-glass-light)] rounded-lg px-3 py-2 text-xs outline-none"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                />
                <textarea 
                  placeholder="Task Description"
                  className="w-full bg-white/5 border border-[var(--color-glass-light)] rounded-lg px-3 py-2 text-xs outline-none min-h-[80px] resize-none"
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                />
                <select 
                  required className="w-full bg-white/5 border border-[var(--color-glass-light)] rounded-lg px-3 py-2 text-xs"
                  value={newTask.assignedTo}
                  onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                >
                  <option value="" className="bg-[#1a1a1a] text-white">Assign To...</option>
                  {members.map(m => <option key={m.id} value={m.id} className="bg-[#1a1a1a] text-white">{m.name}</option>)}
                </select>
                <input 
                  type="date" required
                  className="w-full bg-white/5 border border-[var(--color-glass-light)] rounded-lg px-3 py-2 text-xs"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                <Button className="w-full text-xs">
                  {editingTask ? 'Update Task' : 'Assign Task'}
                </Button>
              </form>
            </GlassCard>
          </aside>
        )}
      </div>
    </div>
  );
}
