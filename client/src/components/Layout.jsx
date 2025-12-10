import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="mr-4 flex">
                        <a className="mr-6 flex items-center space-x-2" href="/">
                            <span className="hidden font-bold sm:inline-block">Notiz</span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-2">
                        <a href="/settings" className="flex items-center space-x-2 mr-2 hover:bg-accent rounded-full pl-2 pr-3 py-1 transition-colors group">
                            <Button variant="ghost" size="icon" className="group-hover:text-primary rounded-full">
                                <User className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium hidden md:block">
                                {user?.username}
                            </span>
                        </a>
                    </div>
                </div>
            </header>
            <main className="container py-6">
                {children}
            </main>
        </div>
    );
};

export default Layout;
