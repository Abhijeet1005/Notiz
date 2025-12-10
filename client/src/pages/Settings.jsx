import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, LogOut, User, Clock, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

import { useNavigate } from "react-router-dom"

const Settings = () => {
    const { user, logout } = useAuth()
    const { theme, setTheme, themes } = useTheme()
    const navigate = useNavigate()

    if (!user) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>

    return (
        <div className="container max-w-2xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    ← Back
                </Button>
                <h1 className="text-3xl font-bold">Profile & Settings</h1>
            </div>

            {/* Profile Info */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{user.username}</CardTitle>
                            <CardDescription className="text-sm font-medium flex items-center mt-1">
                                {user.email ? (
                                    <>
                                        {user.email}
                                        {user.isEmailVerified && <ShieldCheck className="h-3 w-3 ml-2 text-green-500" aria-label="Verified" />}
                                    </>
                                ) : (
                                    <span className="text-muted-foreground italic">No email linked</span>
                                )}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize the look and feel of Notiz.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={cn(
                                    "group relative flex flex-col items-center space-y-2 p-2 rounded-lg border-2 transition-all hover:bg-muted",
                                    theme === t.id ? "border-primary bg-muted" : "border-transparent"
                                )}
                            >
                                <div
                                    className="h-20 w-full rounded-md shadow-sm border"
                                    style={{ backgroundColor: t.color }}
                                >
                                    {/* Abstract representation of UI */}
                                    <div className="h-2 w-[80%] mx-auto mt-2 rounded-full bg-foreground/10 opacity-50" />
                                    <div className="h-2 w-[60%] mx-auto mt-1 rounded-full bg-foreground/20 opacity-30" />
                                </div>
                                <span className="text-sm font-medium">{t.name}</span>
                                {theme === t.id && (
                                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end">
                <Button variant="destructive" onClick={logout} className="w-full sm:w-auto">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}

export default Settings
