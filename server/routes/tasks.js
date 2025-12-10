const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// @route   GET api/tasks
// @desc    Get all users tasks
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ date: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks
// @desc    Add new task
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description, date } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            date,
            user: req.user.id
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description, isDone, date, images } = req.body;

    // Build task object
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description !== undefined) taskFields.description = description;
    if (isDone !== undefined) taskFields.isDone = isDone;
    if (date) taskFields.date = date;
    if (images) taskFields.images = images;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Detect removed images
        if (images) {
            const oldImages = task.images || [];
            const newImages = images;

            const removedImages = oldImages.filter(img => !newImages.includes(img));

            for (const imgUrl of removedImages) {
                const { deleteFromCloudinary } = require('../utils/cloudinary');
                await deleteFromCloudinary(imgUrl);
            }
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Delete all images
        if (task.images && task.images.length > 0) {
            const { deleteFromCloudinary } = require('../utils/cloudinary');
            for (const imgUrl of task.images) {
                await deleteFromCloudinary(imgUrl);
            }
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/completed
// @desc    Delete all completed tasks
// @access  Private
router.delete('/completed', auth, async (req, res) => {
    try {
        // Find tasks to be deleted to handle images
        const completedTasks = await Task.find({ user: req.user.id, isDone: true });

        // Delete images from Cloudinary
        const { deleteFromCloudinary } = require('../utils/cloudinary');
        for (const task of completedTasks) {
            if (task.images && task.images.length > 0) {
                for (const imgUrl of task.images) {
                    await deleteFromCloudinary(imgUrl);
                }
            }
        }

        // Delete tasks from DB
        await Task.deleteMany({ user: req.user.id, isDone: true });

        res.json({ msg: 'Completed tasks removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
