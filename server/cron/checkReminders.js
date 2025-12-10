const cron = require('node-cron');
const Task = require('../models/Task');
const { sendEmail } = require('../utils/email');

const checkReminders = () => {
    // Schedule to run every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running reminder check...');
        try {
            const now = new Date();

            // Find tasks where reminderDate is in the past (or now), 
            // reminderSent is false, 
            // and the task is not done (optional, but good UX)
            // Populate user to get email
            const tasks = await Task.find({
                reminderDate: { $lte: now },
                reminderSent: false,
                isDone: false
            }).populate('user', 'email username');

            for (const task of tasks) {
                if (task.user && task.user.email) {
                    console.log(`Sending reminder for task: ${task.title} to ${task.user.email}`);

                    const sent = await sendEmail(
                        task.user.email,
                        `Reminder: ${task.title}`,
                        `Hi ${task.user.username},\n\nAccept a gentle reminder for your task: "${task.title}".\n\nTask Description: ${task.description || 'No description'}\n\nGood luck!\n\n- Notiz App`
                    );

                    if (sent) {
                        task.reminderSent = true;
                        await task.save();
                    }
                }
            }
        } catch (error) {
            console.error('Error in reminder cron:', error);
        }
    });
};

module.exports = checkReminders;
