import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("app-theme") || "light"
    )

    useEffect(() => {
        const root = window.document.documentElement

        // Remove all previous theme classes
        root.classList.remove("light", "dark", "midnight", "sunset", "neon", "forest", "lavender")

        if (theme !== "light") {
            root.classList.add(theme)
        }

        // Save to local storage
        localStorage.setItem("app-theme", theme)
    }, [theme])

    const value = {
        theme,
        setTheme,
        themes: [
            { id: 'light', name: 'Light', color: '#ffffff' },
            { id: 'dark', name: 'Dark', color: '#0f172a' }, // Slate 900
            { id: 'midnight', name: 'Midnight', color: '#0b1120' }, // Deep Blue
            { id: 'sunset', name: 'Sunset', color: '#0c0a09' }, // Stone 950
            { id: 'neon', name: 'Neon', color: '#000000' }, // Pure Black
            { id: 'forest', name: 'Forest', color: '#052e16' }, // Green 950
            { id: 'lavender', name: 'Lavender', color: '#f3e8ff' }, // Purple 100
        ]
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
