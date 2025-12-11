import { useState } from 'react';
import TaskList from '../components/TaskList';
import EmailVerification from '../components/EmailVerification';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const Dashboard = () => {
    const { addTask, tasks, clearCompletedTasks } = useTasks();
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
                <h1 className="text-3xl font-bold tracking-tight">Your Notes</h1>
                <div className="flex items-center gap-2">
                    <div className="text-muted-foreground mr-2">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    {tasks.filter(t => t.isDone).length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={clearCompletedTasks}
                            className="h-8"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear Completed ({tasks.filter(t => t.isDone).length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} className="flex gap-2">
                <Input
                    placeholder="Add a new note..."
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
