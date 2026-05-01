import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';
import { Plus, Briefcase, ListTodo, Users } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forms
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '' });
  const [users, setUsers] = useState([]); // For assignment

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    fetchProjects();
    if (user.role === 'ADMIN') fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchTasks(selectedProject.id);
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
      if (data.length > 0 && !selectedProject) setSelectedProject(data[0]);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchTasks = async (projectId) => {
    try {
      const { data } = await api.get(`/tasks/${projectId}`);
      setTasks(data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/auth/me'); // Simple way to get all users if API allowed, but for MVP we might just need to fetch users
      // Note: Backend doesn't have list users, so we'll mock or just assume admin knows.
      // Let's add an endpoint if needed, but for MVP we can skip user listing or add a dummy list.
      setUsers([user]); // Placeholder
    } catch (err) { console.error(err); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/projects', newProject);
      setProjects([...projects, data]);
      setNewProject({ name: '', description: '' });
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/tasks', { ...newTask, projectId: selectedProject.id });
      setTasks([...tasks, data]);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    } catch (err) { alert(err.response?.data?.error || 'Update failed'); }
  };

  if (loading) return <div className="p-10 text-center text-slate-400">Loading workspace...</div>;

  return (
    <div className="flex h-[calc(100vh-73px)] bg-slate-950 overflow-hidden">
      {/* Sidebar: Projects */}
      <aside className="w-72 bg-slate-900/50 border-r border-slate-800 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={14} /> Projects
          </h2>
          {user.role === 'ADMIN' && (
            <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
              <Plus size={18} />
            </button>
          )}
        </div>

        <div className="space-y-2 mb-8">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                selectedProject?.id === p.id 
                  ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400 font-semibold' 
                  : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {user.role === 'ADMIN' && (
          <form onSubmit={handleCreateProject} className="space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400">New Project</h3>
            <input
              placeholder="Project Name"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <button type="submit" className="w-full bg-slate-800 hover:bg-indigo-600 text-white text-xs py-2 rounded-lg transition-all">
              Create Project
            </button>
          </form>
        )}
      </aside>

      {/* Main Content: Tasks */}
      <main className="flex-1 overflow-y-auto p-8">
        {!selectedProject ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <ListTodo size={48} className="mb-4 opacity-20" />
            <p>Select a project to view tasks</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h2>
                <p className="text-slate-400 max-w-2xl">{selectedProject.description}</p>
              </div>
              
              {user.role === 'ADMIN' && (
                <div className="flex gap-3">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-lg flex items-center gap-2 text-indigo-400 text-sm">
                    <Users size={16} /> Admin Access
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map(t => (
                <TaskCard 
                  key={t.id} 
                  task={t} 
                  onStatusChange={handleStatusChange} 
                  isAdmin={user.role === 'ADMIN'} 
                />
              ))}

              {user.role === 'ADMIN' && (
                <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center min-h-[200px]">
                  <form onSubmit={handleCreateTask} className="w-full space-y-3">
                    <input
                      placeholder="Task Title"
                      required
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20">
                        Add Task
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
