
import React, { createContext, useContext, useEffect, useState } from 'react';

type MoodTheme = 'Joyful' | 'Peaceful' | 'Stressed' | 'Low' | 'Neutral';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    moodTheme: MoodTheme;
    setMoodTheme: (theme: MoodTheme) => void;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    updateThemeFromMood: (mood: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// HSL Values: Primary, Secondary, Background, Accent, Foreground
const themeConfig: Record<MoodTheme, {
    primary: string, secondary: string,
    backgroundLight: string, backgroundDark: string,
    accent: string,
    foregroundLight: string, foregroundDark: string
}> = {
    Joyful: {
        primary: '45 100% 50%',
        secondary: '40 100% 45%',
        backgroundLight: '45 100% 98%',
        backgroundDark: '45 20% 10%',
        accent: '45 100% 94%',
        foregroundLight: '25 50% 20%',
        foregroundDark: '45 100% 95%'
    },
    Peaceful: {
        primary: '158 35% 45%',
        secondary: '165 35% 40%',
        backgroundLight: '165 100% 98%',
        backgroundDark: '165 30% 10%',
        accent: '165 84% 94%',
        foregroundLight: '165 50% 20%',
        foregroundDark: '165 50% 95%'
    },
    Neutral: {
        primary: '196 100% 46%',
        secondary: '175 84% 38%',
        backgroundLight: '190 100% 98%',
        backgroundDark: '200 30% 10%',
        accent: '175 84% 94%',
        foregroundLight: '200 50% 20%',
        foregroundDark: '200 50% 95%'
    },
    Stressed: {
        primary: '10 80% 60%',
        secondary: '0 70% 50%',
        backgroundLight: '10 100% 98%',
        backgroundDark: '0 30% 10%',
        accent: '10 80% 94%',
        foregroundLight: '0 50% 20%',
        foregroundDark: '0 50% 95%'
    },
    Low: {
        primary: '245 60% 65%',
        secondary: '260 60% 60%',
        backgroundLight: '245 100% 99%',
        backgroundDark: '245 30% 10%',
        accent: '245 60% 94%',
        foregroundLight: '245 40% 30%',
        foregroundDark: '245 40% 95%'
    }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [moodTheme, setMoodTheme] = useState<MoodTheme>(() => {
        return (localStorage.getItem('user-mood-theme') as MoodTheme) || 'Neutral';
    });

    const [mode, setMode] = useState<ThemeMode>(() => {
        return (localStorage.getItem('theme-mode') as ThemeMode) || 'system';
    });

    const updateThemeFromMood = (moodLabel: string) => {
        const mood = moodLabel.toLowerCase();
        if (mood === 'great' || mood === 'joyful' || mood === 'happy') setMoodTheme('Joyful');
        else if (mood === 'good' || mood === 'peaceful' || mood === 'calm') setMoodTheme('Peaceful');
        else if (mood === 'okay' || mood === 'neutral') setMoodTheme('Neutral');
        else if (mood === 'difficult' || mood === 'stressed' || mood === 'angry') setMoodTheme('Stressed');
        else if (mood === 'low' || mood === 'sad' || mood === 'depressed') setMoodTheme('Low');
        else setMoodTheme('Neutral');
    };

    // Effect for Dark/Light Mode Class
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (mode === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(mode);
        }
        localStorage.setItem('theme-mode', mode);
    }, [mode]);

    // Effect for CSS Variables (Colors)
    useEffect(() => {
        const root = document.documentElement;
        const colors = themeConfig[moodTheme];
        const isDark = root.classList.contains('dark');

        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--secondary', colors.secondary);

        // Dynamically set background/foreground based on current resolved mode
        // Note: This simple check might desync if system mode changes without reload, but 'mode' effect handles class.
        // To be reactive to class changes is hard in React without observer.
        // Instead, we trust 'mode' state mostly, or use a media query listener for system.

        // Better approach: Set CSS variables for both, and let CSS handle it? 
        // No, we are injecting values. Let's just use the current 'mode' state helper
        let currentMode = mode;
        if (mode === 'system') {
            currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (currentMode === 'dark') {
            root.style.setProperty('--background', colors.backgroundDark);
            root.style.setProperty('--foreground', colors.foregroundDark);
        } else {
            root.style.setProperty('--background', colors.backgroundLight);
            root.style.setProperty('--foreground', colors.foregroundLight);
        }

        root.style.setProperty('--accent', colors.accent);
        root.style.setProperty('--ring', colors.primary);

        localStorage.setItem('user-mood-theme', moodTheme);
    }, [moodTheme, mode]);

    return (
        <ThemeContext.Provider value={{ moodTheme, setMoodTheme, mode, setMode, updateThemeFromMood }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
