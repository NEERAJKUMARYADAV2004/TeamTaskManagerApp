const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/:projectId', protect, async (req, res) => {
  try {
    let query = { project: req.params.projectId };
    if (req.user.role === 'MEMBER') {
      query.assignedTo = req.user._id;
    }
    const tasks = await Task.find(query).populate('assignedTo', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, restrictTo('ADMIN'), async (req, res) => {
  try {
    const task = await Task.create(req.body);
    const populatedTask = await task.populate('assignedTo', 'name');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/status', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role === 'MEMBER' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own tasks' });
    }

    if (req.body.status) task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Edit Task
router.patch('/:id', protect, restrictTo('ADMIN'), async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignedTo', 'name');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete Task
router.delete('/:id', protect, restrictTo('ADMIN'), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
