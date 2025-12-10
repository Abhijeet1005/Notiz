import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Save, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from '../api/axios';

const TaskItem = ({ task }) => {
    const { updateTask, deleteTask } = useTasks();
    const [isExpanded, setIsExpanded] = useState(false);
    const [details, setDetails] = useState(task.description || '');
    const [title, setTitle] = useState(task.title || '');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Sync details if task prop changes (e.g. from server)
    useEffect(() => {
        setDetails(task.description || '');
        setTitle(task.title || '');
    }, [task.description, task.title]);

    const handleToggleDone = () => {
        updateTask(task._id, { isDone: !task.isDone });
    };

    const handleSaveDetails = () => {
        updateTask(task._id, { description: details, title: title });
        setIsEditing(false);
        toast.success("Details saved successfully");
    };

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent expand
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(task._id);
            toast.success("Task deleted");
        }
    };

    return (
        <Card
            className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden cursor-pointer hover:shadow-md",
                isExpanded ? "ring-2 ring-primary" : "",
                task.isDone ? "opacity-60" : ""
            )}
            onClick={() => !isExpanded && setIsExpanded(true)}
        >
            <CardHeader className="flex flex-row items-center space-y-0 p-4 pb-2">
                <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                        checked={task.isDone}
                        onCheckedChange={handleToggleDone}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {isExpanded ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-lg h-auto p-1 -ml-1 border-transparent hover:border-input focus:border-primary transition-all"
                        />
                    ) : (
                        <span className={cn(
                            "font-medium text-lg transition-all",
                            task.isDone ? "line-through text-muted-foreground" : ""
                        )}>
                            {task.title}
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-1">
                    {isExpanded && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(false);
                            }}
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardHeader>

            {/* Expanded Content */}
            <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isExpanded ? "grid-rows-[1fr] opacity-100 p-4 pt-0" : "grid-rows-[0fr] opacity-0 p-0"
            )}>
                <div className="overflow-hidden">
                    <div className="mt-2 space-y-4">
                        <Textarea
                            placeholder="Add details..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="min-h-[100px] resize-none"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Image Gallery */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground block">
                                Images
                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {(task.images || []).map((img, index) => (
                                    <div
                                        key={index}
                                        className="relative group aspect-video bg-muted rounded-md overflow-hidden cursor-zoom-in"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImage(img);
                                        }}
                                    >
                                        <img src={img} alt="Task attachment" className="w-full h-full object-cover transition-transform hover:scale-105" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newImages = task.images.filter((_, i) => i !== index);
                                                updateTask(task._id, { images: newImages });
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}

                                <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer">
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                        <Upload className="h-6 w-6 mb-1" />
                                        <span className="text-xs">Add Image</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const files = Array.from(e.target.files);
                                                if (files.length === 0) return;

                                                const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

                                                try {
                                                    const newUrls = [];
                                                    for (const file of files) {
                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        const res = await api.post('/upload', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        newUrls.push(res.data.imageUrl);
                                                    }

                                                    updateTask(task._id, {
                                                        images: [...(task.images || []), ...newUrls]
                                                    });
                                                    toast.success("Images uploaded!", { id: toastId });
                                                } catch (error) {
                                                    console.error(error);
                                                    toast.error("Upload failed", { id: toastId });
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                            <Button
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveDetails();
                                }}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Details
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                    }}
                >
                    <div className="relative max-w-4xl max-h-screen w-full h-full flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Full screen view"
                            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                            }}
                        >
                            <span className="sr-only">Close</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default TaskItem;
