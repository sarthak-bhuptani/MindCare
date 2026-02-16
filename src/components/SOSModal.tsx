
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Eye, MousePointer2, Volume2, Flower2, Heart, ArrowRight, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Phone, MapPin, Smile, Edit2, Save as SaveIcon, Map, FileText, Download, History, Hospital, Stethoscope, ShieldCheck } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const groundingSteps = [
    {
        title: "5 Things You See",
        description: "Look around you and identify 5 distinct objects in your current environment.",
        icon: <Eye className="w-12 h-12 text-blue-500" />,
        color: "bg-blue-500",
        instruction: "Take your time. Acknowledge each one silently."
    },
    {
        title: "4 Things You Feel",
        description: "Identify 4 things you can physically feel right now (e.g., your shirt, the chair, your hair).",
        icon: <MousePointer2 className="w-12 h-12 text-teal-500" />,
        color: "bg-teal-500",
        instruction: "Focus on the texture and sensation."
    },
    {
        title: "3 Things You Hear",
        description: "Listen closely. What are 3 sounds you can hear in your room or outside?",
        icon: <Volume2 className="w-12 h-12 text-purple-500" />,
        color: "bg-purple-500",
        instruction: "Try to find subtle sounds you usually ignore."
    },
    {
        title: "2 Things You Smell",
        description: "Try to identify 2 smells. If you can't smell anything, think of your 2 favorite scents.",
        icon: <Flower2 className="w-12 h-12 text-pink-500" />,
        color: "bg-pink-500",
        instruction: "Breathe in deeply through your nose."
    },
    {
        title: "1 Thing You Taste",
        description: "What is 1 thing you can taste? Or think of a taste you enjoy.",
        icon: <Heart className="h-12 w-12 text-red-500" />,
        color: "bg-red-500",
        instruction: "Notice any lingering taste or imagined flavor."
    }
];

interface SOSModalProps {
    externalOpen?: boolean;
    setExternalOpen?: (open: boolean) => void;
}

export const SOSModal = ({ externalOpen, setExternalOpen }: SOSModalProps) => {
    const { user } = useAuth();
    const [internalOpen, setInternalOpen] = useState(false);

    // Use external control if provided, otherwise internal
    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
    const setIsOpen = setExternalOpen || setInternalOpen;

    const [view, setView] = useState<"intro" | "grounding" | "plan" | "log">("intro");
    const [currentStep, setCurrentStep] = useState(0);

    const [safetyPlan, setSafetyPlan] = useState({
        contactName: "",
        contactPhone: "",
        safePlace: "",
        copingStrategy: ""
    });
    const [isEditingPlan, setIsEditingPlan] = useState(false);
    const [crisisIntensity, setCrisisIntensity] = useState(5);
    const [crisisTrigger, setCrisisTrigger] = useState("");

    useEffect(() => {
        if (isOpen && user) {
            const saved = localStorage.getItem(`mindcare_safety_plan_${user.id}`);
            if (saved) {
                setSafetyPlan(JSON.parse(saved));
            } else {
                setIsEditingPlan(true); // Default to edit if empty
            }
            setView("intro");
            setCurrentStep(0);
        }
    }, [isOpen, user]);

    const savePlan = () => {
        if (user) {
            localStorage.setItem(`mindcare_safety_plan_${user.id}`, JSON.stringify(safetyPlan));
            setIsEditingPlan(false);
        }
    };

    const handleNext = () => {
        if (currentStep < groundingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsOpen(false);
            setTimeout(() => {
                setView("intro");
                setCurrentStep(0);
            }, 500);
        }
    };

    const resetProgress = () => {
        setCurrentStep(0);
    };

    const handleLogCrisis = () => {
        if (!user) return;
        const newLog = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            intensity: crisisIntensity,
            trigger: crisisTrigger,
            duration: "Logged manually"
        };

        const existingLogs = JSON.parse(localStorage.getItem(`mindcare_crisis_logs_${user.id}`) || "[]");
        localStorage.setItem(`mindcare_crisis_logs_${user.id}`, JSON.stringify([newLog, ...existingLogs]));

        toast.success("Crisis logged. Stay strong.");
        setView("intro");
        setCrisisIntensity(5);
        setCrisisTrigger("");
    };

    const downloadLogs = () => {
        if (!user) return;
        const logs = JSON.parse(localStorage.getItem(`mindcare_crisis_logs_${user.id}`) || "[]");
        if (logs.length === 0) {
            toast.error("No logs to export.");
            return;
        }

        const text = logs.map((l: any) => `Date: ${l.date}\nIntensity: ${l.intensity}/10\nTrigger: ${l.trigger}\n------------------`).join("\n\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `crisis_logs_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Logs downloaded for your therapist.");
    };

    const openMap = (query: string) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl px-4 bg-red-600 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/20 font-bold border-none"
                >
                    <AlertTriangle size={16} className="mr-2" /> SOS
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 border-none rounded-[2.5rem] overflow-hidden bg-background/80 backdrop-blur-2xl shadow-3xl">
                <DialogTitle className="sr-only">SOS Support Module</DialogTitle>
                <div className="relative p-8 pt-12">
                    {/* Progress Bar */}
                    {/* Progress Bar - Only valid if viewing grounding steps */}
                    {view === "grounding" && (
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / groundingSteps.length) * 100}%` }}
                            />
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {view === "intro" && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="text-center space-y-6 py-8"
                            >
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                    <AlertTriangle className="w-10 h-10 text-red-600 animate-bounce" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-foreground mb-2">Breathe. You are safe.</h2>
                                    <p className="text-muted-foreground">Choose an option to help you through this moment.</p>
                                </div>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => setView("grounding")}
                                        size="lg"
                                        className="w-full rounded-2xl bg-red-600 hover:bg-red-700 text-white h-14 font-bold text-lg shadow-xl shadow-red-500/20"
                                    >
                                        Start Grounding Exercise
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            onClick={() => setView("plan")}
                                            variant="outline"
                                            size="lg"
                                            className="w-full rounded-2xl h-14 font-bold border-2 border-primary/10 hover:bg-primary/5 text-primary"
                                        >
                                            <ShieldCheck className="mr-2 w-5 h-5" /> Safety Plan
                                        </Button>
                                        <Button
                                            onClick={() => setView("log")}
                                            variant="outline"
                                            size="lg"
                                            className="w-full rounded-2xl h-14 font-bold border-2 border-primary/10 hover:bg-primary/5 text-primary"
                                        >
                                            <FileText className="mr-2 w-5 h-5" /> Log Crisis
                                        </Button>
                                    </div>
                                    <div className="pt-2 flex gap-2 justify-center">
                                        <Button variant="ghost" size="sm" onClick={() => openMap("hospitals+near+me")} className="text-xs text-muted-foreground hover:text-red-500"><Hospital className="mr-1 w-3 h-3" /> Hospitals</Button>
                                        <Button variant="ghost" size="sm" onClick={() => openMap("pharmacies+near+me")} className="text-xs text-muted-foreground hover:text-blue-500"><Stethoscope className="mr-1 w-3 h-3" /> Pharmacies</Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {view === "grounding" && (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center space-y-8 py-4"
                            >
                                <div className="flex justify-center">
                                    <div className={cn(
                                        "p-6 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-border/50 transition-transform duration-500",
                                        "scale-110"
                                    )}>
                                        {groundingSteps[currentStep].icon}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                                        Step {currentStep + 1} of 5
                                    </span>
                                    <h2 className="text-3xl font-bold text-foreground">
                                        {groundingSteps[currentStep].title}
                                    </h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {groundingSteps[currentStep].description}
                                    </p>
                                    <p className="text-sm font-medium text-primary italic">
                                        {groundingSteps[currentStep].instruction}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={resetProgress}
                                        variant="ghost"
                                        className="flex-1 h-14 rounded-2xl border border-border"
                                    >
                                        <RefreshCw className="mr-2 w-4 h-4" /> Reset
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        className="flex-[2] h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20"
                                    >
                                        {currentStep === groundingSteps.length - 1 ? "I feel better" : "Next Step"} <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                                <Button onClick={() => setView("intro")} variant="link" className="text-muted-foreground">Back to Menu</Button>
                            </motion.div>
                        )}

                        {view === "plan" && (
                            <motion.div
                                key="plan"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">My Safety Plan</h2>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => isEditingPlan ? savePlan() : setIsEditingPlan(true)}
                                        className="rounded-xl text-primary"
                                    >
                                        {isEditingPlan ? <SaveIcon size={18} className="mr-1" /> : <Edit2 size={18} className="mr-1" />}
                                        {isEditingPlan ? "Save" : "Edit"}
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-primary font-bold"><Phone size={14} /> Emergency Contact</Label>
                                        {isEditingPlan ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    placeholder="Name (e.g., Mom)"
                                                    value={safetyPlan.contactName}
                                                    onChange={(e) => setSafetyPlan({ ...safetyPlan, contactName: e.target.value })}
                                                    className="rounded-xl bg-white/50"
                                                />
                                                <Input
                                                    placeholder="Phone Number"
                                                    value={safetyPlan.contactPhone}
                                                    onChange={(e) => setSafetyPlan({ ...safetyPlan, contactPhone: e.target.value })}
                                                    className="rounded-xl bg-white/50"
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-lg">{safetyPlan.contactName || "No contact set"}</p>
                                                    <p className="text-sm opacity-70">{safetyPlan.contactPhone}</p>
                                                </div>
                                                {safetyPlan.contactPhone && (
                                                    <a href={`tel:${safetyPlan.contactPhone}`}>
                                                        <Button size="icon" className="rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20">
                                                            <Phone size={18} />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-primary font-bold"><MapPin size={14} /> Safe Place</Label>
                                        {isEditingPlan ? (
                                            <Input
                                                placeholder="Where can you go? (e.g., The Park)"
                                                value={safetyPlan.safePlace}
                                                onChange={(e) => setSafetyPlan({ ...safetyPlan, safePlace: e.target.value })}
                                                className="rounded-xl bg-white/50"
                                            />
                                        ) : (
                                            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                                                <p className="font-medium">{safetyPlan.safePlace || "No element saved"}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-primary font-bold"><Smile size={14} /> Coping Strategy</Label>
                                        {isEditingPlan ? (
                                            <Textarea
                                                placeholder="What calms you down? (e.g., Deep breathing, Music)"
                                                value={safetyPlan.copingStrategy}
                                                onChange={(e) => setSafetyPlan({ ...safetyPlan, copingStrategy: e.target.value })}
                                                className="rounded-xl bg-white/50 min-h-[80px]"
                                            />
                                        ) : (
                                            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
                                                <p className="font-medium">{safetyPlan.copingStrategy || "No strategy saved"}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Button onClick={() => setView("intro")} variant="ghost" className="w-full">Back to Options</Button>
                            </motion.div>
                        )}

                        {view === "log" && (
                            <motion.div
                                key="log"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6 text-left"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">Log Event</h2>
                                    <p className="text-sm text-muted-foreground">Record this moment to share with your professional support later.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Label className="font-bold">Intensity (1-10)</Label>
                                            <span className="font-bold text-primary">{crisisIntensity}</span>
                                        </div>
                                        <Slider
                                            value={[crisisIntensity]}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={(val) => setCrisisIntensity(val[0])}
                                            className="cursor-pointer"
                                        />
                                        <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                            <span>Manageable</span>
                                            <span>Severe</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="font-bold">What triggered this?</Label>
                                        <Textarea
                                            placeholder="Optional: What happened?"
                                            value={crisisTrigger}
                                            onChange={(e) => setCrisisTrigger(e.target.value)}
                                            className="rounded-xl bg-secondary/20 min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={downloadLogs} variant="outline" className="h-12 rounded-xl border-dashed border-2">
                                        <Download className="mr-2 w-4 h-4" /> Export All
                                    </Button>
                                    <Button onClick={handleLogCrisis} className="h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
                                        Save Log
                                    </Button>
                                </div>
                                <Button onClick={() => setView("intro")} variant="ghost" className="w-full">Cancel</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};
