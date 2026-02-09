
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

export const SOSModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(-1); // -1 is the initial "Panic" state

    const handleNext = () => {
        if (currentStep < groundingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsOpen(false);
            setTimeout(() => setCurrentStep(-1), 500);
        }
    };

    const resetProgress = () => {
        setCurrentStep(-1);
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
                <div className="relative p-8 pt-12">
                    {/* Progress Bar */}
                    {currentStep >= 0 && (
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / groundingSteps.length) * 100}%` }}
                            />
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {currentStep === -1 ? (
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
                                    <p className="text-muted-foreground">Let's ground your senses. This will take 1 minute.</p>
                                </div>
                                <Button
                                    onClick={() => setCurrentStep(0)}
                                    size="lg"
                                    className="w-full rounded-2xl bg-red-600 hover:bg-red-700 text-white h-14 font-bold text-lg shadow-xl shadow-red-500/20"
                                >
                                    Start Grounding Exercise
                                </Button>
                            </motion.div>
                        ) : (
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
};
