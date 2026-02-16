
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
    Activity,
    Brain,
    Calendar,
    Check,
    ChevronRight,
    HeartPulse,
    MessageSquare,
    Moon,
    Pencil,
    Plus,
    Trash2,
    X,
    Save,
    Zap,
    Sparkles,
    Sun,
    CloudRain,
    Clock,
    Layout,
    ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
    id: number;
    task: string;
    time: string;
    status: "pending" | "completed";
}

const Dashboard = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState("");
    const [insights, setInsights] = useState<any>(null);
    const [recommendation, setRecommendation] = useState({
        title: "5-Minute Breathing",
        desc: "Reduce stress and regain focus.",
        link: "/breathing",
        btnText: "Start Session"
    });

    const [dailyPlan, setDailyPlan] = useState<Task[]>([]);
    const [isEditingPlan, setIsEditingPlan] = useState(false);
    const [newTask, setNewTask] = useState("");
    const [newTaskTime, setNewTaskTime] = useState("");

    const generateMoodBasedPlan = (moodScore: number, challenges: string[], profileData: any) => {
        const role = profileData.role || "Friend";
        const moodLevel = moodScore >= 8 ? "high" : moodScore <= 4 ? "low" : "balanced";

        const pools = {
            morning: {
                low: ["Slow Stretching", "Hydration + Lemon", "Morning Light (2m)"],
                balanced: ["Mindful Coffee", "Goal Alignment", "10m Reading"],
                high: ["Power Workout", "Cold Exposure", "Strategy Planning"]
            },
            focus: {
                Student: ["Active Recall Session", "Note Synthesis", "Flashcard Review"],
                Professional: ["Priority Matrix Build", "Deep Work Sprint", "Client Sync Prep"],
                Caregiver: ["Empathy Practice", "Needs Assessment", "Organization Buffer"],
                Exploring: ["Creative Brainstorm", "Market Research", "Skill Tutorial"]
            },
            evening: {
                low: ["Cozy Reading", "Warm Bath", "Phone-free Zone"],
                balanced: ["Progress Log", "Tomorrow's Prep", "Light Stretching"],
                high: ["Network Outreach", "Future Planning", "Skill Mastery"]
            }
        };

        const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

        let plan: Task[] = [
            { id: 1, task: `Morning: ${pick(pools.morning[moodLevel as keyof typeof pools.morning])}`, time: "08:30 AM", status: "pending" },
            { id: 2, task: `Focus: ${pick((pools.focus as any)[role] || ["Main Task"])}`, time: "11:00 AM", status: "pending" },
            { id: 3, task: moodLevel === 'low' ? "Battery Re-charge: 10m Nap" : "Peak Performance: Bonus Challenge", time: "03:30 PM", status: "pending" },
            { id: 4, task: `Downtime: ${pick(pools.evening[moodLevel as keyof typeof pools.evening])}`, time: "09:00 PM", status: "pending" }
        ];

        if (challenges.includes("Anxiety")) plan.splice(2, 0, { id: 5, task: "Anxiety Rescue: 4-4-4 Breathing", time: "As Needed", status: "pending" });
        if (challenges.includes("Sleep")) plan.push({ id: 6, task: "Sleep Optimization: Relaxing Soak", time: "10:00 PM", status: "pending" });

        return plan;
    };

    const savePlan = (newPlan: Task[], mood: string) => {
        if (!user) return;
        setDailyPlan(newPlan);
        localStorage.setItem(`mindcare_daily_plan_${user.id}`, JSON.stringify({
            date: new Date().toDateString(),
            mood: mood,
            tasks: newPlan
        }));
    };

    const calculateStreak = (userId: string) => {
        try {
            const raw = localStorage.getItem(`mindcare_streaks_${userId}`);
            const streaks = raw ? JSON.parse(raw) : { count: 0, lastDate: "" };
            const today = new Date().toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();

            if (streaks.lastDate === today) return streaks.count;

            if (streaks.lastDate === yesterday) {
                const newCount = streaks.count + 1;
                localStorage.setItem(`mindcare_streaks_${userId}`, JSON.stringify({ count: newCount, lastDate: today }));
                return newCount;
            }

            // Reset or start new
            localStorage.setItem(`mindcare_streaks_${userId}`, JSON.stringify({ count: 1, lastDate: today }));
            return 1;
        } catch (e) {
            return 0;
        }
    };

    useEffect(() => {
        const hour = new Date().getHours();
        setGreeting(hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening");

        let sessionData: any = {};
        try {
            const raw = localStorage.getItem(`mindcare_session_${user?.id}`);
            if (raw) sessionData = JSON.parse(raw);
        } catch (e) { console.error(e); }

        let profileData: any = {};
        try {
            const raw = localStorage.getItem(`mindcare_profile_${user?.id}`);
            if (raw) profileData = JSON.parse(raw);
        } catch (e) { console.error(e); }

        const moodScoreValue = sessionData.moodScore !== undefined ? sessionData.moodScore : (profileData.mood || 5);

        // Granulated status mapping
        let moodLevelName = "Balanced";
        if (moodScoreValue <= 2) moodLevelName = "Deep Recovery";
        else if (moodScoreValue <= 4) moodLevelName = "Quiet";
        else if (moodScoreValue <= 6) moodLevelName = "Steady";
        else if (moodScoreValue <= 7) moodLevelName = "Balanced";
        else if (moodScoreValue <= 9) moodLevelName = "Active";
        else moodLevelName = "Peak";

        const challenges = profileData.challenges || [];

        let config = {
            advice: "Trust the process. You're doing great.",
            toolTitle: "Gratitude Journal",
            toolDesc: "Focus on the small wins of today.",
            btn: "Open Journal",
            color: "text-blue-500",
            bg: "from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100",
            icon: <Activity size={24} />
        };

        if (moodLevelName === "Deep Recovery") {
            config = {
                advice: "Peace above everything. Take a total reset day.",
                toolTitle: "Breathing Session",
                toolDesc: "Gentle 4-7-8 breathing to calm your system.",
                btn: "Start Breathing",
                color: "text-indigo-600",
                bg: "from-indigo-100 to-slate-100 dark:from-indigo-950/30 dark:to-slate-900/30 border-indigo-200",
                icon: <Moon size={24} />
            };
        } else if (moodLevelName === "Quiet") {
            config = {
                advice: "Low power mode is okay. Slow gestures only.",
                toolTitle: "Breathing Session",
                toolDesc: "Lower your stress with a quick break.",
                btn: "Start Breathing",
                color: "text-slate-500",
                bg: "from-slate-50 to-blue-50 dark:from-slate-900/20 dark:to-blue-900/10 border-slate-200",
                icon: <CloudRain size={24} />
            };
        } else if (moodLevelName === "Steady") {
            config = {
                advice: "Found your rhythm. Keep the pace consistent.",
                toolTitle: "Focus Journal",
                toolDesc: "Document your steady progress.",
                btn: "Open Journal",
                color: "text-emerald-500",
                bg: "from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-emerald-100",
                icon: <Activity size={24} />
            };
        } else if (moodLevelName === "Active") {
            config = {
                advice: "Energy is rising. Time for some dynamic work.",
                toolTitle: "Mind Game",
                toolDesc: "Sharpen your focus while energy is high.",
                btn: "Play Now",
                color: "text-cyan-500",
                bg: "from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border-cyan-100",
                icon: <Sparkles size={24} />
            };
        } else if (moodLevelName === "Peak") {
            config = {
                advice: "You're in flow! Make the most of this energy.",
                toolTitle: "Mind Game",
                toolDesc: "Test your peak focus and agility.",
                btn: "Play Now",
                color: "text-amber-500",
                bg: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200",
                icon: <Zap size={24} />
            };
        }

        const today = new Date().toDateString();
        let saved: any = null;
        try {
            const raw = localStorage.getItem(`mindcare_daily_plan_${user.id}`);
            if (raw) saved = JSON.parse(raw);
        } catch (e) { console.error(e); }

        let plan = [];
        if (saved && saved.date === today && saved.mood === moodLevelName) {
            plan = saved.tasks;
        } else {
            plan = generateMoodBasedPlan(moodScoreValue, challenges, profileData);
            savePlan(plan, moodLevelName);
        }

        setInsights({
            mood: moodLevelName,
            score: moodScoreValue,
            nickname: profileData.nickname || user?.name || "Friend",
            role: profileData.role,
            config,
            streak: calculateStreak(user.id)
        });
        setDailyPlan(plan);
        setRecommendation({
            title: config.toolTitle,
            desc: config.toolDesc,
            link: (moodLevelName === 'Peak' || moodLevelName === 'Active') ? '/mindgame' : (moodLevelName === 'Recovery' || moodLevelName === 'Quiet' || moodLevelName === 'Deep Recovery') ? '/breathing' : '/journal',
            btnText: config.btn
        });

    }, [user]);

    const toggleTask = (id: number) => {
        const newPlan = dailyPlan.map(t => t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t) as Task[];
        savePlan(newPlan, insights.mood);
    };

    const toggleEditMode = () => {
        if (isEditingPlan) savePlan(dailyPlan, insights.mood);
        setIsEditingPlan(!isEditingPlan);
    };

    const editActions = {
        delete: (id: number) => savePlan(dailyPlan.filter(t => t.id !== id), insights.mood),
        add: () => {
            if (!newTask) return;
            const newId = Math.max(0, ...dailyPlan.map(t => t.id)) + 1;
            savePlan([...dailyPlan, { id: newId, task: newTask, time: newTaskTime || "00:00", status: "pending" }], insights.mood);
            setNewTask(""); setNewTaskTime("");
        },
        update: (id: number, field: any, val: any) => setDailyPlan(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t)),
        regenerate: () => savePlan(generateMoodBasedPlan(insights.score, [], insights.insights?.profileData || {}), insights.mood)
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
            <Navbar />

            <main className="flex-grow container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

                {/* 01. Welcome Header */}
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            {greeting}, <span className="text-primary">{insights?.nickname}</span>
                        </h1>
                        <p className="text-muted-foreground mt-2 font-medium">Here is your daily wellness overview.</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap gap-3">
                        <div className="bg-card border border-border/50 px-5 py-3 rounded-2xl shadow-sm flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center ${insights?.config?.color}`}>
                                {insights?.config?.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-none mb-1">Status</p>
                                <p className="text-sm font-bold text-foreground">{insights?.mood}</p>
                            </div>
                        </div>

                        <div className="bg-card border border-border/50 px-5 py-4 rounded-2xl shadow-sm flex items-center gap-3 min-w-[100px]">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1 whitespace-nowrap">Pulse</p>
                                <div className="flex items-end gap-1">
                                    <span className="text-2xl font-black leading-none text-primary">{insights?.score}</span>
                                    <span className="text-[10px] font-bold text-slate-300 mb-0.5">/10</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary text-primary-foreground px-5 py-4 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><Zap size={22} strokeWidth={3} /></div>
                            <div>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider leading-none mb-1">Streak</p>
                                <p className="text-sm font-black italic">{insights?.streak || 1} Days</p>
                            </div>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Wellness Plan & Advice */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Mood Insight Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-8 rounded-[2rem] bg-gradient-to-r ${insights?.config?.bg} border border-border/40 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-sm`}
                        >
                            <div className={`p-4 rounded-2xl bg-background/80 shadow-sm ${insights?.config?.color}`}>
                                {insights?.config?.icon}
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-1">
                                <h3 className="text-xl md:text-2xl font-bold text-foreground">"{insights?.config?.advice}"</h3>
                                <p className="text-muted-foreground text-sm font-medium">
                                    Personalized for your <span className="text-primary font-bold">{insights?.mood}</span> mood.
                                </p>
                            </div>
                        </motion.div>

                        {/* Wellness Plan Card */}
                        <Card className="border-border/50 shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl flex items-center gap-2">
                                        <Calendar className="text-primary w-5 h-5" /> Wellness Plan
                                    </CardTitle>
                                    <CardDescription>Daily goals synced for a {insights?.role || "user"}.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={toggleEditMode}
                                        className={`rounded-xl font-bold text-xs gap-2 ${isEditingPlan ? 'bg-primary/10 text-primary' : ''}`}
                                    >
                                        {isEditingPlan ? <Save size={16} /> : <Pencil size={16} />}
                                        {isEditingPlan ? "Save" : "Edit"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {dailyPlan.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group"
                                        >
                                            <div className={`flex items-center p-5 rounded-2xl border transition-all duration-300 ${item.status === 'completed' && !isEditingPlan ? 'bg-secondary/40 border-transparent opacity-60' : 'bg-background border-border hover:border-primary/30'}`}>
                                                {!isEditingPlan ? (
                                                    <>
                                                        <div
                                                            onClick={() => toggleTask(item.id)}
                                                            className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center mr-4 cursor-pointer transition-all ${item.status === 'completed' ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary'}`}
                                                        >
                                                            {item.status === 'completed' && <Check size={18} strokeWidth={3} />}
                                                        </div>
                                                        <div className="flex-1 cursor-pointer" onClick={() => toggleTask(item.id)}>
                                                            <h4 className={`text-base font-semibold leading-tight break-words pr-2 ${item.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                                                {item.task}
                                                            </h4>
                                                            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                                                                <Clock size={12} /> {item.time}
                                                            </div>
                                                        </div>
                                                        {item.status === 'pending' && <Button variant="ghost" size="sm" onClick={() => toggleTask(item.id)} className="opacity-0 group-hover:opacity-100 font-bold text-xs text-primary">Done</Button>}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex-1 grid gap-3 mr-4">
                                                            <Input value={item.task} onChange={(e) => editActions.update(item.id, 'task', e.target.value)} className="h-10 text-sm font-semibold bg-secondary/30 border-none rounded-xl" />
                                                            <Input value={item.time} onChange={(e) => editActions.update(item.id, 'time', e.target.value)} className="h-8 text-[10px] w-32 bg-secondary/50 border-none rounded-lg font-bold uppercase px-3" />
                                                        </div>
                                                        <Button variant="ghost" size="icon" onClick={() => editActions.delete(item.id)} className="text-destructive hover:bg-destructive/10 rounded-xl h-12 w-12"><Trash2 size={18} /></Button>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {isEditingPlan && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 border-2 border-dashed border-border rounded-[1.5rem] bg-secondary/10 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <Input className="sm:col-span-2 rounded-xl h-11 border-none bg-background shadow-sm" placeholder="Goal name..." value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                                            <Input className="rounded-xl h-11 border-none bg-background shadow-sm" placeholder="Time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={editActions.regenerate} className="flex-1 rounded-xl font-bold h-11"><Sparkles size={16} className="mr-2 text-primary" /> AI Refresh</Button>
                                            <Button size="sm" className="flex-1 rounded-xl font-bold h-11" onClick={editActions.add} disabled={!newTask}><Plus size={18} className="mr-2" /> Add Goal</Button>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-8">

                        {/* Recommended Tool */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="border-border/50 shadow-lg rounded-[2rem] bg-card p-6 border-none">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><HeartPulse size={20} /></div>
                                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Priority Tool</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-foreground">{recommendation.title}</h3>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{recommendation.desc}</p>
                                    </div>
                                    <Link to={recommendation.link} className="block">
                                        <Button className="w-full h-12 rounded-xl font-bold gap-2 shadow-md hover:translate-y-[-2px] transition-transform">
                                            {recommendation.btnText} <ArrowUpRight size={18} />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-4">Daily Toolkit</h4>
                            <div className="grid gap-3">
                                <Link to="/journal" className="flex items-center justify-between p-5 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 hover:bg-card transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/20 text-pink-500 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all"><Moon size={20} /></div>
                                        <span className="font-bold">Journal</span>
                                    </div>
                                    <ChevronRight className="text-muted-foreground w-4 h-4" />
                                </Link>
                                <Link to="/chat" className="flex items-center justify-between p-5 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 hover:bg-card transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all"><MessageSquare size={20} /></div>
                                        <span className="font-bold">AI Support</span>
                                    </div>
                                    <ChevronRight className="text-muted-foreground w-4 h-4" />
                                </Link>
                                <Link to="/mindgame" className="flex items-center justify-between p-5 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 hover:bg-card transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all"><Brain size={20} /></div>
                                        <span className="font-bold">Mind Game</span>
                                    </div>
                                    <ChevronRight className="text-muted-foreground w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
