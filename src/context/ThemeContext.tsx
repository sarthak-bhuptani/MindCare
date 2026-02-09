
import React, { createContext, useContext, useEffect, useState } from 'react';

type MoodTheme = 'Joyful' | 'Peaceful' | 'Stressed' | 'Low' | 'Neutral';

interface ThemeContextType {
    theme: MoodTheme;
    setTheme: (theme: MoodTheme) => void;
    updateThemeFromMood: (mood: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeConfig: Record<MoodTheme, { primary: string, secondary: string, background: string, accent: string, foreground: string }> = {
    Joyful: {
        primary: '45 100% 50%',
        secondary: '40 100% 45%',
        background: '45 100% 98%',
        accent: '45 100% 94%',
        foreground: '25 50% 20%'
    },
    Peaceful: {
        primary: '158 35% 45%',
        secondary: '165 35% 40%',
        background: '165 100% 98%',
        accent: '165 84% 94%',
        foreground: '165 50% 20%'
    },
    Neutral: {
        primary: '196 100% 46%',
        secondary: '175 84% 38%',
        background: '190 100% 98%',
        accent: '175 84% 94%',
        foreground: '200 50% 20%'
    },
    Stressed: {
        primary: '10 80% 60%',
        secondary: '0 70% 50%',
        background: '10 100% 98%',
        accent: '10 80% 94%',
        foreground: '0 50% 20%'
    },
    Low: {
        primary: '245 60% 65%',
        secondary: '260 60% 60%',
        background: '245 100% 99%',
        accent: '245 60% 94%',
        foreground: '245 40% 30%'
    }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<MoodTheme>(() => {
        return (localStorage.getItem('user-mood-theme') as MoodTheme) || 'Neutral';
    });

    const setTheme = (newTheme: MoodTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('user-mood-theme', newTheme);
    };

    const updateThemeFromMood = (moodLabel: string) => {
        console.log("Updating theme from mood:", moodLabel);
        const mood = moodLabel.toLowerCase();

        // Mapping user mood options to theme moods
        if (mood === 'great' || mood === 'joyful' || mood === 'happy') setTheme('Joyful');
        else if (mood === 'good' || mood === 'peaceful' || mood === 'calm') setTheme('Peaceful');
        else if (mood === 'okay' || mood === 'neutral') setTheme('Neutral');
        else if (mood === 'difficult' || mood === 'stressed' || mood === 'angry') setTheme('Stressed');
        else if (mood === 'low' || mood === 'sad' || mood === 'depressed') setTheme('Low');
        else setTheme('Neutral');
    };

    useEffect(() => {
        const root = document.documentElement;
        const colors = themeConfig[theme];

        // Apply colors to CSS variables
        root.style.setProperty('--primary', colors.primary);
        root.style.setProperty('--secondary', colors.secondary);
        root.style.setProperty('--background', colors.background);
        root.style.setProperty('--accent', colors.accent);
        root.style.setProperty('--foreground', colors.foreground);
        root.style.setProperty('--ring', colors.primary);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, updateThemeFromMood }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
