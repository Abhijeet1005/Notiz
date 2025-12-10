import { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching tasks", err);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (title, date) => {
        try {
            const res = await api.post('/tasks', { title, date });
            setTasks([res.data, ...tasks]);
        } catch (err) {
            console.error("Error adding task", err);
        }
    };

    const updateTask = async (id, updates) => {
        try {
            // Optimistic update
            setTasks(tasks.map(task => task._id === id ? { ...task, ...updates } : task));

            await api.put(`/tasks/${id}`, updates);
        } catch (err) {
            console.error("Error updating task", err);
            fetchTasks(); // Revert on error
        }
    };

    const deleteTask = async (id) => {
        try {
            // Optimistic update
            setTasks(tasks.filter(task => task._id !== id));

            await api.delete(`/tasks/${id}`);
        } catch (err) {
            console.error("Error deleting task", err);
            fetchTasks(); // Revert on error
        }
    };

    const clearCompletedTasks = async () => {
        try {
            // Optimistic update
            setTasks(tasks.filter(task => !task.isDone));
            await api.delete('/tasks/completed');
        } catch (err) {
            console.error("Error clearing completed tasks", err);
            fetchTasks();
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, loading, fetchTasks, addTask, updateTask, deleteTask, clearCompletedTasks }}>
            {children}
        </TaskContext.Provider>
    );
};
