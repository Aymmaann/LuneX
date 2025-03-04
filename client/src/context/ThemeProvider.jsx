import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const hasSetTheme = localStorage.getItem("theme-initialized");
        if (!hasSetTheme) {
            localStorage.setItem("theme", "dark");
            localStorage.setItem("theme-initialized", "true");
            return "dark";
        }
        return localStorage.getItem("theme") || "dark";
    });
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};