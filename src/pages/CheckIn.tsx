
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Brain, Coffee, Moon, Sun, ArrowRight, Activity, CloudRain, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

const CheckIn = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mood, setMood] = useState(5);
    const [sleep, setSleep] = useState(5);
    const [focus, setFocus] = useState("");

    const handleComplete = () => {
        // Save session data to localStorage to be read by Dashboard
        // Smart Pulse Calculation
        // Weight: Mood (60%), Sleep (40%)
        const smartPulse = Math.round((mood * 0.6) + (sleep * 0.4));

        const sessionData = {
            mood: mood >= 8 ? "Great" : mood >= 5 ? "Good" : "Low",
            moodScore: smartPulse, // Using Smart Pulse as the main score
            rawMood: mood,
            sleepScore: sleep,
            focus: focus || "General Wellness",
            timestamp: new Date().toISOString()
        };
        if (user) {
            localStorage.setItem(`mindcare_session_${user.id}`, JSON.stringify(sessionData));
        }

        navigate("/dashboard");
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const getMoodFeedback = (val: number) => {
        if (val <= 2) return { label: "Deep Recovery", emoji: "🌑", color: "text-indigo-500" };
        if (val <= 4) return { label: "Quiet Mode", emoji: "☁️", color: "text-slate-500" };
        if (val <= 6) return { label: "Steady Pace", emoji: "🌤️", color: "text-emerald-500" };
        if (val <= 7) return { label: "Balanced", emoji: "⚖️", color: "text-primary" };
        if (val <= 9) return { label: "Active Energy", emoji: "✨", color: "text-cyan-500" };
        return { label: "Peak Performance", emoji: "🔥", color: "text-amber-500" };
    };

    const feedback = getMoodFeedback(mood);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-lg space-y-8 relative z-10"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Daily Check-In</h1>
                    <p className="text-muted-foreground">Take a moment to center yourself before starting.</p>
                </div>

                <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-8 rounded-[2.5rem] shadow-2xl space-y-8">

                    {/* Mood Slider */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-2">
                            <span className="text-sm font-medium text-muted-foreground">Low Energy</span>
                            <span className="text-sm font-medium text-muted-foreground">High Energy</span>
                        </div>
                        <Slider
                            value={[mood]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={(val) => setMood(val[0])}
                            className="cursor-pointer"
                        />
                        <div className="text-center transition-all duration-300">
                            <span className="text-4xl block transform hover:scale-110 transition-transform">{feedback.emoji}</span>
                            <p className={`${feedback.color} font-black mt-2 text-sm uppercase tracking-widest`}>
                                {feedback.label}
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Sleep Slider */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
                                <Moon className="w-4 h-4 text-purple-500" /> Sleep Quality
                            </h3>
                            <span className="text-xs font-bold bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{sleep}/10</span>
                        </div>
                        <Slider
                            value={[sleep]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={(val) => setSleep(val[0])}
                            className="cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest px-1">
                            <span>Restless</span>
                            <span>Deep Sleep</span>
                        </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Focus Selection */}
                    <div className="space-y-4">
                        <h3 className="text-center font-medium">What is your focus right now?</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: "Relaxation", icon: Coffee, color: "text-orange-500" },
                                { id: "Focus", icon: Brain, color: "text-blue-500" },
                                { id: "Sleep", icon: Moon, color: "text-purple-500" },
                                { id: "Energy", icon: Activity, color: "text-green-500" },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setFocus(item.id)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${focus === item.id
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-transparent bg-secondary/50 hover:bg-secondary"
                                        }`}
                                >
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                    <span className="font-medium text-sm">{item.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
                        onClick={handleComplete}
                        disabled={!focus}
                    >
                        Continue to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckIn;
