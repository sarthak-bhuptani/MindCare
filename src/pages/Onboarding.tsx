
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
    ArrowRight,
    Check,
    Sparkles,
    AlertTriangle,
    Heart,
    Brain,
    Moon,
    Sun,
    User,
    ArrowLeft,
    ChevronRight,
    Star,
    ShieldCheck,
    Cloud,
    Smile,
    Zap,
    MessageSquare,
    Activity,
    X,
    Clock,
    Flame,
    Compass,
    Target,
    Bell,
    Coffee,
    BookOpen,
    Briefcase,
    Wind
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { setOnboarded } from "@/lib/onboarding";
import { useAuth } from "@/hooks/useAuth";
import { SOSModal } from "@/components/SOSModal";

type Step = "welcome" | "safety" | "vibe" | "motivation" | "commitment" | "preferences" | "goals" | "complete";

const Onboarding = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>("welcome");
    const [direction, setDirection] = useState(1);
    const [isSOSOpen, setIsSOSOpen] = useState(false);

    const [formData, setFormData] = useState({
        nickname: "",
        ageGroup: "",
        role: "",
        mood: 5,
        challenges: [] as string[],
        motivation: "",
        commitment: "",
        notifications: "moderate",
        morningPerson: true,
        relaxation: "",
    });

    const steps: Step[] = ["welcome", "safety", "vibe", "motivation", "commitment", "preferences", "goals", "complete"];
    const stepIndex = steps.indexOf(currentStep);

    const handleNext = (nextStep: Step) => {
        setDirection(1);
        setCurrentStep(nextStep);
    };

    const handleBack = (prevStep: Step) => {
        setDirection(-1);
        setCurrentStep(prevStep);
    };

    const updateForm = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const toggleSelection = (key: "challenges", item: string) => {
        setFormData((prev) => {
            const list = prev[key];
            return list.includes(item)
                ? { ...prev, [key]: list.filter((i) => i !== item) }
                : { ...prev, [key]: [...list, item] };
        });
    };

    const finishOnboarding = () => {
        if (user) {
            localStorage.setItem(`mindcare_profile_${user.id}`, JSON.stringify(formData));
        }
        setOnboarded();
        toast.success("Welcome to MindCare!");
        navigate("/dashboard");
    };

    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 10 : -10,
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            y: direction > 0 ? -10 : 10,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#030712] flex flex-col font-sans selection:bg-primary/10">
            <Navbar />

            {/* Subtle Gradient Fog */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-[-20%] left-[-10%] w-full h-[600px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] w-full h-[600px] bg-gradient-to-t from-blue-500/5 to-transparent blur-3xl" />
            </div>

            <main className="flex-grow flex items-center justify-center p-4 relative z-10 pt-24 pb-12">
                <div className="w-full max-w-md">

                    {/* Minimal Progress */}
                    <div className="mb-10 px-4">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <span>Step {stepIndex + 1} of {steps.length}</span>
                            <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800/40 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                initial={false}
                                animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                                className="h-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="wait" custom={direction}>
                        {currentStep === "welcome" && (
                            <motion.div key="welcome" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">Welcome, friend.</h1>
                                    <p className="text-sm text-slate-500 font-medium">Let's get to know you better. It's quick!</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What should we call you?</Label>
                                        <Input
                                            placeholder="Your nickname"
                                            value={formData.nickname}
                                            onChange={(e) => updateForm("nickname", e.target.value)}
                                            className="h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border-none px-4 font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What do you do mainly?</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Student", "Professional", "Caregiver", "Exploring"].map((role) => (
                                                <button
                                                    key={role}
                                                    onClick={() => updateForm("role", role)}
                                                    className={`h-11 rounded-xl border-2 transition-all font-bold text-xs ${formData.role === role ? "border-primary bg-primary/5 text-primary" : "border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:border-slate-100"}`}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">How old are you?</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {["<18", "18-24", "25-34", "35-50", "50+"].map((age) => (
                                                <button
                                                    key={age}
                                                    onClick={() => updateForm("ageGroup", age)}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${formData.ageGroup === age ? "bg-primary text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-500"}`}
                                                >
                                                    {age}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        size="lg"
                                        onClick={() => handleNext("safety")}
                                        disabled={!formData.nickname || !formData.role || !formData.ageGroup}
                                        className="w-full h-12 rounded-xl text-sm font-bold shadow-md shadow-primary/10"
                                    >
                                        Continue <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "safety" && (
                            <motion.div key="safety" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-8">
                                <div className="text-center space-y-4">
                                    <div className="w-14 h-14 bg-red-100 dark:bg-red-950 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <h1 className="text-xl font-black">Safety First.</h1>
                                    <p className="text-slate-500 text-xs font-medium italic">"Your well-being is our absolute priority."</p>
                                </div>

                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleNext("vibe")}
                                        className="w-full p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:bg-slate-50 transition-all"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-bold text-sm">I'm feeling okay</h3>
                                            <p className="text-slate-400 text-[10px]">Proceed to personalizing your dashboard</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><ChevronRight size={16} /></div>
                                    </button>

                                    <button
                                        onClick={() => setIsSOSOpen(true)}
                                        className="w-full p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20 flex items-center justify-between group hover:bg-red-100 transition-all"
                                    >
                                        <div className="text-left text-red-600 dark:text-red-400">
                                            <h3 className="font-bold text-sm">I need help now</h3>
                                            <p className="opacity-70 text-[10px]">Access clinical support and helplines</p>
                                        </div>
                                        <AlertTriangle size={18} />
                                    </button>
                                </div>
                                <div className="flex justify-center">
                                    <Button variant="ghost" onClick={() => handleBack("welcome")} className="text-slate-400 text-xs font-bold hover:text-slate-600">Back</Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "vibe" && (
                            <motion.div key="vibe" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-black italic">How are you feeling right now?</h1>
                                    <p className="text-sm text-slate-500 font-medium">Slide the bar to match your mood.</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 p-6 rounded-3xl shadow-sm space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center px-4">
                                            {[
                                                { label: "Low", icon: <Wind className="w-8 h-8" />, range: [1, 4] },
                                                { label: "Steady", icon: <Activity className="w-8 h-8" />, range: [5, 7] },
                                                { label: "Peak", icon: <Flame className="w-8 h-8" />, range: [8, 10] }
                                            ].map((item, i) => {
                                                const isActive = (i === 0 && formData.mood <= 4) ||
                                                    (i === 1 && formData.mood > 4 && formData.mood < 8) ||
                                                    (i === 2 && formData.mood >= 8);
                                                return (
                                                    <div key={item.label} className="text-center space-y-2">
                                                        <div className={`transition-all duration-500 flex justify-center ${isActive ? "text-primary opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "text-slate-300 opacity-20 scale-90"}`}>
                                                            {item.icon}
                                                        </div>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-slate-200"}`}>{item.label}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Slider
                                            value={[formData.mood]}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={(val) => updateForm("mood", val[0])}
                                            className="px-2"
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What's on your mind today? (Pick any)</Label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {[
                                                { tag: "Studies", icon: <BookOpen size={12} /> },
                                                { tag: "Career", icon: <Briefcase size={12} /> },
                                                { tag: "Heart", icon: <Heart size={12} /> },
                                                { tag: "Sleep", icon: <Moon size={12} /> },
                                                { tag: "Peace", icon: <Wind size={12} /> },
                                                { tag: "Mindset", icon: <Brain size={12} /> },
                                                { tag: "Growth", icon: <Sparkles size={12} /> },
                                                { tag: "Routine", icon: <Clock size={12} /> }
                                            ].map((item) => (
                                                <button
                                                    key={item.tag}
                                                    onClick={() => toggleSelection("challenges", item.tag)}
                                                    className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-2 ${formData.challenges.includes(item.tag) ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-slate-50 dark:border-slate-800 bg-slate-50 text-slate-400"}`}
                                                >
                                                    {item.icon}
                                                    {item.tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <Button variant="ghost" onClick={() => handleBack("safety")} className="text-slate-400 text-xs font-bold">Back</Button>
                                        <Button size="lg" onClick={() => handleNext("motivation")} className="h-12 px-10 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Next</Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "motivation" && (
                            <motion.div key="motivation" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-black">Why are you here?</h1>
                                    <p className="text-sm text-slate-500 font-medium font-serif italic text-pretty">"knowing your goal helps us help you."</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: "peace", label: "I want Peace", icon: <Cloud size={18} className="text-sky-500" /> },
                                        { id: "energy", label: "I want Energy", icon: <Zap size={18} className="text-amber-500" /> },
                                        { id: "focus", label: "I want Focus", icon: <Target size={18} className="text-indigo-500" /> },
                                        { id: "heart", label: "I want Healing", icon: <Heart size={18} className="text-rose-500" /> }
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => updateForm("motivation", m.id)}
                                            className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${formData.motivation === m.id ? "border-primary bg-primary/5 text-primary" : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 hover:bg-slate-50"}`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center shrink-0">{m.icon}</div>
                                            <span className="font-bold text-sm">{m.label}</span>
                                            {formData.motivation === m.id && <Check className="ml-auto w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="ghost" onClick={() => handleBack("vibe")} className="text-slate-400 text-xs font-bold">Back</Button>
                                    <Button size="lg" disabled={!formData.motivation} onClick={() => handleNext("commitment")} className="h-11 px-8 rounded-xl font-bold shadow-lg shadow-primary/10 text-sm">Next</Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "commitment" && (
                            <motion.div key="commitment" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-black">How much time do you have?</h1>
                                    <p className="text-sm text-slate-500 font-medium">We can adapt to your schedule.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: "micro", label: "5-10 Mins", desc: "Quick & Easy" },
                                        { id: "midi", label: "15-20 Mins", desc: "Good Balance" },
                                        { id: "deep", label: "30+ Mins", desc: "Deep Dive" },
                                        { id: "flux", label: "I'm not sure", desc: "Flexible" }
                                    ].map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => updateForm("commitment", c.id)}
                                            className={`p-6 rounded-[1.5rem] border-2 text-center transition-all ${formData.commitment === c.id ? "border-primary bg-primary/5 text-primary" : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400"}`}
                                        >
                                            <Clock size={16} className={`mx-auto mb-2 ${formData.commitment === c.id ? 'text-primary' : 'text-slate-300'}`} />
                                            <h3 className="font-bold text-xs">{c.label}</h3>
                                            <p className="text-[9px] text-slate-400 mt-1 opacity-60 leading-tight">{c.desc}</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="ghost" onClick={() => handleBack("motivation")} className="text-slate-400 text-xs font-bold">Back</Button>
                                    <Button size="lg" disabled={!formData.commitment} onClick={() => handleNext("preferences")} className="h-11 px-8 rounded-xl font-bold text-sm">Next</Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "preferences" && (
                            <motion.div key="preferences" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-black">How should we help you?</h1>
                                    <p className="text-sm text-slate-500 font-medium italic text-balance font-serif">"Setting things up just for you."</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 p-6 rounded-3xl space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 pt-2"><Bell size={12} /> Nudges & Reminders</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {["Low", "Moderate", "Active"].map((n) => (
                                                <button
                                                    key={n}
                                                    onClick={() => updateForm("notifications", n.toLowerCase())}
                                                    className={`py-2 rounded-xl text-[11px] font-bold border-2 transition-all ${formData.notifications === n.toLowerCase() ? "border-primary bg-primary/5 text-primary" : "border-slate-50 dark:border-slate-800 bg-slate-50 text-slate-400"}`}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2"><Coffee size={12} /> When are you most active?</Label>
                                        <div className="flex gap-2">
                                            {[
                                                { label: "Morning Lark", val: true, icon: <Sun size={14} /> },
                                                { label: "Night Owl", val: false, icon: <Moon size={14} /> }
                                            ].map((t) => (
                                                <button
                                                    key={t.label}
                                                    onClick={() => updateForm("morningPerson", t.val)}
                                                    className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.morningPerson === t.val ? "border-primary bg-primary/5 text-primary" : "border-slate-50 dark:border-slate-800 bg-slate-50 text-slate-400"}`}
                                                >
                                                    {t.icon}
                                                    <span className="text-[10px] font-bold uppercase tracking-tight">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <Button variant="ghost" onClick={() => handleBack("commitment")} className="text-slate-400 text-xs font-bold">Back</Button>
                                        <Button size="lg" onClick={() => handleNext("goals")} className="h-11 px-8 rounded-xl font-bold text-sm">Continue</Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "goals" && (
                            <motion.div key="goals" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="space-y-6">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-black italic">What helps you relax best?</h1>
                                    <p className="text-sm text-slate-500 font-medium">Pick the one that sounds best to you.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: "breathing", title: "Breathing", icon: <Brain />, color: "bg-blue-500" },
                                        { id: "journal", title: "Journaling", icon: <Moon />, color: "bg-pink-500" },
                                        { id: "chat", title: "Chatting", icon: <Smile />, color: "bg-emerald-500" },
                                        { id: "game", title: "Playing Games", icon: <Zap />, color: "bg-amber-500" }
                                    ].map((tool) => (
                                        <button
                                            key={tool.id}
                                            onClick={() => updateForm("relaxation", tool.id)}
                                            className={`p-6 rounded-[2rem] border-2 text-center transition-all ${formData.relaxation === tool.id ? "border-primary bg-primary/5" : "border-slate-50 dark:border-slate-800 bg-white"}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${formData.relaxation === tool.id ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}>
                                                {tool.icon}
                                            </div>
                                            <h3 className={`text-[11px] font-black uppercase tracking-tight ${formData.relaxation === tool.id ? "text-primary" : "text-slate-500"}`}>{tool.title}</h3>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button variant="ghost" onClick={() => handleBack("preferences")} className="text-slate-400 text-xs font-bold">Back</Button>
                                    <Button size="lg" disabled={!formData.relaxation} onClick={() => handleNext("complete")} className="h-11 px-8 rounded-xl font-bold text-sm">Almost there</Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === "complete" && (
                            <motion.div key="complete" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" className="text-center space-y-10">
                                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-20 h-20 bg-primary/10 rounded-[2rem] mx-auto flex items-center justify-center border-2 border-primary/10 shadow-sm relative">
                                    <Star className="w-10 h-10 text-primary fill-primary" />
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-4px] border border-dashed border-primary/20 rounded-full" />
                                </motion.div>

                                <div className="space-y-1">
                                    <h1 className="text-3xl font-black font-serif italic">Pure Sync.</h1>
                                    <p className="text-slate-400 text-xs font-medium">"Your space is ready for your unique journey."</p>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-100 p-8 rounded-[2rem] text-left space-y-6 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-[-20%] right-[-10%] opacity-[0.03] text-primary rotate-12"><Star size={200} /></div>
                                    {[
                                        { k: "Individual", v: formData.nickname, icon: <User size={14} className="text-slate-300" /> },
                                        { k: "Primary Goal", v: formData.motivation, icon: <Target size={14} className="text-slate-300" /> },
                                        { k: "Daily Rhythm", v: formData.commitment, icon: <Clock size={14} className="text-slate-300" /> }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center group relative z-10 border-b border-slate-50 dark:border-slate-800/50 pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                {item.icon}
                                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] group-hover:text-primary transition-colors">{item.k}</span>
                                            </div>
                                            <span className="font-bold text-sm capitalize text-slate-700 dark:text-slate-200">{item.v}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button size="lg" onClick={finishOnboarding} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
                                    Enter MindCare <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Full Feature SOS Modal - Hidden Trigger, controlled by "I need help now" button */}
            <div className="hidden">
                <SOSModal externalOpen={isSOSOpen} setExternalOpen={setIsSOSOpen} />
            </div>
        </div>
    );
};

export default Onboarding;
