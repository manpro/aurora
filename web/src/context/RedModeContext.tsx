"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type RedModeContextType = {
    isRedMode: boolean;
    toggleRedMode: () => void;
};

const RedModeContext = createContext<RedModeContextType | undefined>(undefined);

export function RedModeProvider({ children }: { children: React.ReactNode }) {
    const [isRedMode, setIsRedMode] = useState(false);

    // Initialize from local storage or default to false
    useEffect(() => {
        const stored = localStorage.getItem("aurora-red-mode");
        if (stored) {
            setIsRedMode(JSON.parse(stored));
        }
    }, []);

    // Update body class and local storage when mode changes
    useEffect(() => {
        if (isRedMode) {
            document.documentElement.classList.add("red-mode");
        } else {
            document.documentElement.classList.remove("red-mode");
        }
        localStorage.setItem("aurora-red-mode", JSON.stringify(isRedMode));
    }, [isRedMode]);

    const toggleRedMode = () => setIsRedMode((prev) => !prev);

    return (
        <RedModeContext.Provider value={{ isRedMode, toggleRedMode }}>
            {children}
        </RedModeContext.Provider>
    );
}

export function useRedMode() {
    const context = useContext(RedModeContext);
    if (context === undefined) {
        throw new Error("useRedMode must be used within a RedModeProvider");
    }
    return context;
}
