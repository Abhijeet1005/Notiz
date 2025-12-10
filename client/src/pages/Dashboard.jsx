import { useState } from 'react';
import TaskList from '../components/TaskList';
import EmailVerification from '../components/EmailVerification';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const Dashboard = () => {
    const { addTask } = useTasks();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        addTask(newTaskTitle, new Date());
        setNewTaskTitle('');
    };

    return (
        <div className="container max-w-2xl mx-auto space-y-6">
            <EmailVerification />
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Today's Tasks</h1>
                <div className="text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} className="flex gap-2">
                <Input
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </form>

            <TaskList />
        </div>
    );
};

export default Dashboard;
