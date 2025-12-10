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
            {completedCount > 0 && (
                <div className="flex justify-end mb-2 pr-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCompletedTasks}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Completed ({completedCount})
                    </Button>
                </div>
            )}
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
