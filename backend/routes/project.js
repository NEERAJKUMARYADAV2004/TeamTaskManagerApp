const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'MEMBER') {
      const assignedTasks = await Task.find({ assignedTo: req.user._id }).select('project');
      const projectIds = [...new Set(assignedTasks.map(t => t.project.toString()))];
      query = { _id: { $in: projectIds } };
    }
    const projects = await Project.find(query).populate('admin', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, restrictTo('ADMIN'), async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, admin: req.user._id });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete Project
router.delete('/:id', protect, restrictTo('ADMIN'), async (req, res) => {
  try {
    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.id });
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project and all associated tasks deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Edit Project
router.patch('/:id', protect, restrictTo('ADMIN'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
