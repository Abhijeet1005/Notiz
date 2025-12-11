import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { ScrollArea } from "@/components/ui/scroll-area";

import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const TaskList = () => {
    const { tasks, loading, fetchTasks, clearCompletedTasks } = useTasks();

    useEffect(() => {
        fetchTasks();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-muted-foreground">Loading tasks...</div>;
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>No tasks for today.</p>
                <p className="text-sm">Add one above to get started!</p>
            </div>
        );
    }

    const completedCount = tasks.filter(t => t.isDone).length;

    return (
        <>

            <ScrollArea className="h-[calc(100vh-240px)] pr-4">
                <div className="space-y-3 pb-10">
                    {tasks.map(task => (
                        <TaskItem key={task._id} task={task} />
                    ))}
                </div>
            </ScrollArea>
        </>
    );
};

export default TaskList;
