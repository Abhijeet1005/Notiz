import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label" // We might need to add label component or just use standard label
import { Link } from 'react-router-dom';

// Simple Label component since we didn't install it yet, or just use html label
const FormLabel = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {children}
    </label>
);

const AuthForm = ({ type, onSubmit, loading, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'signup') {
            onSubmit(username, password, email);
        } else {
            onSubmit(username, password);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>{type === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
                    <CardDescription>
                        {type === 'login' ? 'Enter your credentials to access your tasks.' : 'Create an account to start organizing.'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <div className="space-y-2">
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input
                                id="username"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {type === 'signup' && (
                            <div className="space-y-2">
                                <FormLabel htmlFor="email">Email (Optional)</FormLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Loading...' : (type === 'login' ? 'Login' : 'Sign Up')}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            {type === 'login' ? (
                                <>Don't have an account? <Link to="/signup" className="underline">Sign up</Link></>
                            ) : (
                                <>Already have an account? <Link to="/login" className="underline">Login</Link></>
                            )}
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default AuthForm;
