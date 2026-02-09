
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RefreshCw, Wind, Clock, Shield, Moon, Leaf, Flame, Cloud, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  recommendedDuration: number;
  benefits: string[];
  icon: JSX.Element;
  color: string;
  variant: "calm" | "energize" | "focus" | "sleep" | "balance";
}

const breathingExercises: BreathingExercise[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Also known as square breathing, this technique is used by Navy SEALs to stay calm and focused under high-pressure situations. It involves four equal parts: inhale, hold, exhale, and hold again, creating a 'box' pattern that resets your nervous system.",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    recommendedDuration: 5,
    benefits: [
      "Reduces stress",
      "Improves concentration",
      "Helps manage anxiety",
      "Can be done anywhere",
    ],
    icon: <Shield className="h-8 w-8 text-serenity-500 mb-2" />,
    color: "serenity",
    variant: "focus",
  },
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "Developed by Dr. Andrew Weil, this 'natural tranquilizer' for the nervous system helps you fall asleep faster and manage emotional responses. By extending the exhale to double the length of the inhale, it forces your body to enter a state of deep relaxation.",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    recommendedDuration: 4,
    benefits: [
      "Helps with sleep",
      "Reduces anxiety",
      "Manages cravings",
      "Helps control emotional responses",
    ],
    icon: <Moon className="h-8 w-8 text-calm-500 mb-2" />,
    color: "calm",
    variant: "sleep",
  },
  {
    id: "deep",
    name: "Deep Breathing",
    description: "The most fundamental breathing technique. Diaphragmatic or 'belly' breathing encourages full oxygen exchange—that is, the beneficial trade of incoming oxygen for outgoing carbon dioxide. It counteracts the shallow chest breathing associated with stress.",
    inhale: 5,
    exhale: 5,
    recommendedDuration: 3,
    benefits: [
      "Activates relaxation response",
      "Lowers heart rate",
      "Helps with mindfulness",
      "Reduces tension",
    ],
    icon: <Wind className="h-8 w-8 text-warmth-500 mb-2" />,
    color: "warmth",
    variant: "calm",
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "Breathe at a steady rate of 5 to 6 breaths per minute to achieve heart-brain coherence. This resonant frequency balances the sympathetic and parasympathetic nervous systems, leading to a state of calm alertness and improved cardiovascular health.",
    inhale: 6,
    exhale: 6,
    recommendedDuration: 5,
    benefits: [
      "Balances nervous system",
      "Improves heart rate variability",
      "Reduces stress hormones",
      "Enhances focus and clarity",
    ],
    icon: <Heart className="h-8 w-8 text-warmth-500 mb-2" />,
    color: "warmth",
    variant: "balance",
  },
  {
    id: "stimulating",
    name: "Stimulating Breath",
    description: "Derived from yogic traditions (Bellows Breath), this is a quick-fire technique designed to increase vital energy and mental alertness. It's essentially 'caffeine for the lungs,' perfect for a mid-afternoon pick-me-up without the crash.",
    inhale: 1,
    exhale: 1,
    recommendedDuration: 2,
    benefits: [
      "Increases energy and alertness",
      "Strengthens respiratory system",
      "Clears nasal passages",
      "Enhances concentration",
    ],
    icon: <Flame className="h-8 w-8 text-warmth-500 mb-2" />,
    color: "warmth",
    variant: "energize",
  },
  {
    id: "alternate",
    name: "Alternate Nostril",
    description: "Nadi Shodhana is a powerful breathing practice that brings harmony to the two hemispheres of the brain. By alternating airflow between the left and right nostrils, it balances your logic and creativity while deeply soothing the mind.",
    inhale: 4,
    hold1: 2,
    exhale: 6,
    recommendedDuration: 5,
    benefits: [
      "Balances left and right brain hemispheres",
      "Brings mental clarity",
      "Reduces stress",
      "Improves focus",
    ],
    icon: <Wind className="h-8 w-8 text-serenity-500 mb-2" />,
    color: "serenity",
    variant: "balance",
  },
  {
    id: "diaphragmatic",
    name: "Diaphragmatic Breathing",
    description: "Focus on using the large muscle at the base of the lungs—the diaphragm. Shallow breathing uses only the upper chest, while diaphragmatic breathing draws air deep into the lungs, improving oxygen efficiency and lowering the physical effects of stress.",
    inhale: 4,
    hold1: 1,
    exhale: 6,
    recommendedDuration: 5,
    benefits: [
      "Strengthens the diaphragm",
      "Decreases oxygen demand",
      "Slows heart rate",
      "Reduces blood pressure",
    ],
    icon: <Cloud className="h-8 w-8 text-calm-500 mb-2" />,
    color: "calm",
    variant: "calm",
  },
  {
    id: "ujjayi",
    name: "Ujjayi Breath",
    description: "Known as the 'Ocean Breath' because of the soft whispering sound it creates in the back of the throat. This friction-based breathing warms the air before it enters the lungs and provides an anchor for the mind during meditation or yoga.",
    inhale: 5,
    exhale: 5,
    recommendedDuration: 6,
    benefits: [
      "Increases oxygen absorption",
      "Builds internal heat",
      "Calms the nervous system",
      "Improves concentration",
    ],
    icon: <Leaf className="h-8 w-8 text-serenity-500 mb-2" />,
    color: "serenity",
    variant: "focus",
  },
];

const Breathing = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(breathingExercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [activeTab, setActiveTab] = useState<"calm" | "energize" | "focus" | "sleep" | "balance" | "all">("all");

  const timerRef = useRef<number | null>(null);
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth });

  useEffect(() => {
    const handleResize = () => setScreenSize({ width: window.innerWidth });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenSize.width < 768;
  const maxSize = isMobile ? 220 : 280;
  const minSize = isMobile ? 80 : 100;

  // Calculate the current size based on the phase
  const calculateSize = () => {
    const { inhale, exhale } = selectedExercise;

    if (currentPhase === "inhale") {
      // Size increases during inhale
      const progress = 1 - timeRemaining / inhale;
      return minSize + progress * (maxSize - minSize);
    } else if (currentPhase === "exhale") {
      // Size decreases during exhale
      const progress = 1 - timeRemaining / exhale;
      return maxSize - progress * (maxSize - minSize);
    } else if (currentPhase === "hold1") {
      // Size stays at maximum during hold1
      return maxSize;
    } else {
      // Size stays at minimum during hold2
      return minSize;
    }
  };

  const circleSize = calculateSize();

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase("inhale");
    setTimeRemaining(selectedExercise.inhale);
    setCycleCount(0);
    setTotalTime(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetExercise = () => {
    stopExercise();
    setCurrentPhase("inhale");
    setTimeRemaining(selectedExercise.inhale);
    setCycleCount(0);
    setTotalTime(0);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as typeof activeTab);
    resetExercise();
  };

  const filteredExercises = activeTab === "all"
    ? breathingExercises
    : breathingExercises.filter(exercise => exercise.variant === activeTab);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Move to the next phase
            let nextPhase: "inhale" | "hold1" | "exhale" | "hold2";
            let nextTime: number;

            switch (currentPhase) {
              case "inhale":
                if (selectedExercise.hold1) {
                  nextPhase = "hold1";
                  nextTime = selectedExercise.hold1;
                } else {
                  nextPhase = "exhale";
                  nextTime = selectedExercise.exhale;
                }
                break;
              case "hold1":
                nextPhase = "exhale";
                nextTime = selectedExercise.exhale;
                break;
              case "exhale":
                if (selectedExercise.hold2) {
                  nextPhase = "hold2";
                  nextTime = selectedExercise.hold2;
                } else {
                  nextPhase = "inhale";
                  nextTime = selectedExercise.inhale;
                  // Completed one full cycle
                  setCycleCount((prevCount) => prevCount + 1);
                }
                break;
              case "hold2":
                nextPhase = "inhale";
                nextTime = selectedExercise.inhale;
                // Completed one full cycle
                setCycleCount((prevCount) => prevCount + 1);
                break;
              default:
                nextPhase = "inhale";
                nextTime = selectedExercise.inhale;
            }

            setCurrentPhase(nextPhase);
            return nextTime;
          }
          return prevTime - 1;
        });

        setTotalTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, currentPhase, selectedExercise]);

  // Reset when changing exercises
  useEffect(() => {
    resetExercise();
  }, [selectedExercise]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Get instruction text based on current phase
  const getInstructionText = () => {
    if (!isActive) return "Press start to begin";

    switch (currentPhase) {
      case "inhale":
        return "Breathe in...";
      case "hold1":
        return "Hold...";
      case "exhale":
        return "Breathe out...";
      case "hold2":
        return "Hold...";
      default:
        return "";
    }
  };

  const getExerciseColorClass = (color: string) => {
    switch (color) {
      case "serenity":
        return {
          border: "border-t-serenity-500",
          shadow: "shadow-serenity-500/10",
          text: "text-serenity-700 dark:text-serenity-300",
          bg: "from-serenity-100 to-serenity-50 dark:from-serenity-900/30 dark:to-serenity-800/20",
          selected: "bg-serenity-100 dark:bg-serenity-900/20"
        };
      case "calm":
        return {
          border: "border-t-calm-500",
          shadow: "shadow-calm-500/10",
          text: "text-calm-700 dark:text-calm-300",
          bg: "from-calm-100 to-calm-50 dark:from-calm-900/30 dark:to-calm-800/20",
          selected: "bg-calm-100 dark:bg-calm-900/20"
        };
      case "warmth":
        return {
          border: "border-t-warmth-500",
          shadow: "shadow-warmth-500/10",
          text: "text-warmth-700 dark:text-warmth-300",
          bg: "from-warmth-100 to-warmth-50 dark:from-warmth-900/30 dark:to-warmth-800/20",
          selected: "bg-warmth-100 dark:bg-warmth-900/20"
        };
      default:
        return {
          border: "border-t-primary",
          shadow: "shadow-primary/10",
          text: "text-primary",
          bg: "from-primary/10 to-primary/5 dark:from-primary/30 dark:to-primary/20",
          selected: "bg-primary/10"
        };
    }
  };

  const getPhaseColor = () => {
    const color = selectedExercise.color;

    switch (color) {
      case "serenity":
        return {
          inhale: "from-serenity-200/80 to-serenity-300/80 dark:from-serenity-700/80 dark:to-serenity-600/80",
          hold1: "from-serenity-300/80 to-serenity-400/80 dark:from-serenity-600/80 dark:to-serenity-500/80",
          exhale: "from-serenity-400/80 to-serenity-300/80 dark:from-serenity-500/80 dark:to-serenity-600/80",
          hold2: "from-serenity-300/80 to-serenity-200/80 dark:from-serenity-600/80 dark:to-serenity-700/80"
        };
      case "calm":
        return {
          inhale: "from-calm-200/80 to-calm-300/80 dark:from-calm-700/80 dark:to-calm-600/80",
          hold1: "from-calm-300/80 to-calm-400/80 dark:from-calm-600/80 dark:to-calm-500/80",
          exhale: "from-calm-400/80 to-calm-300/80 dark:from-calm-500/80 dark:to-calm-600/80",
          hold2: "from-calm-300/80 to-calm-200/80 dark:from-calm-600/80 dark:to-calm-700/80"
        };
      case "warmth":
        return {
          inhale: "from-warmth-200/80 to-warmth-300/80 dark:from-warmth-700/80 dark:to-warmth-600/80",
          hold1: "from-warmth-300/80 to-warmth-400/80 dark:from-warmth-600/80 dark:to-warmth-500/80",
          exhale: "from-warmth-400/80 to-warmth-300/80 dark:from-warmth-500/80 dark:to-warmth-600/80",
          hold2: "from-warmth-300/80 to-warmth-200/80 dark:from-warmth-600/80 dark:to-warmth-700/80"
        };
      default:
        return {
          inhale: "from-serenity-200 to-calm-200 dark:from-serenity-900 dark:to-calm-900",
          hold1: "from-calm-200 to-warmth-200 dark:from-calm-900 dark:to-warmth-900",
          exhale: "from-warmth-200 to-serenity-200 dark:from-warmth-900 dark:to-serenity-900",
          hold2: "from-serenity-200 to-warmth-200 dark:from-serenity-900 dark:to-warmth-900"
        };
    }
  };

  const colors = getPhaseColor();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-accent/20">
      <Navbar />
      <main className="flex-grow container px-4 sm:px-6 lg:px-8 pt-32 pb-8 md:pt-40 md:pb-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-serenity-600 via-calm-600 to-warmth-600 bg-clip-text text-transparent">
            Breathing Exercises
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Find your balance and reduce stress with guided breathing techniques.
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full mb-10 overflow-hidden">
          <TabsList className="w-full h-auto flex flex-wrap sm:flex-nowrap justify-center gap-1.5 p-1.5 bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-[1.25rem]">
            <TabsTrigger value="all" className="rounded-xl px-4 py-2 flex-grow sm:flex-grow-0">All</TabsTrigger>
            <TabsTrigger value="calm" className="rounded-xl px-4 py-2 flex-grow sm:flex-grow-0">Calm</TabsTrigger>
            <TabsTrigger value="focus" className="rounded-xl px-4 py-2 flex-grow sm:flex-grow-0">Focus</TabsTrigger>
            <TabsTrigger value="sleep" className="rounded-xl px-4 py-2 flex-grow sm:flex-grow-0">Sleep</TabsTrigger>
            <TabsTrigger value="energize" className="rounded-xl px-4 py-2 flex-grow sm:flex-grow-0">Energize</TabsTrigger>
            <TabsTrigger value="balance" className="rounded-xl px-4 py-2 flex-grow sm:flex-grow-0">Balance</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className={cn(
              "border-t-4 shadow-lg overflow-hidden",
              getExerciseColorClass(selectedExercise.color).border,
              getExerciseColorClass(selectedExercise.color).shadow
            )}>
              <CardHeader className={cn(
                "bg-gradient-to-b",
                getExerciseColorClass(selectedExercise.color).bg
              )}>
                <CardTitle className={getExerciseColorClass(selectedExercise.color).text}>
                  Select Exercise
                </CardTitle>
                <CardDescription>
                  Choose a breathing technique that fits your current needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent p-3 md:p-4">
                  <div className="grid grid-cols-1 gap-2 md:gap-3 mb-4">
                    {filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className={cn(
                          "cursor-pointer rounded-xl p-3 md:p-4 transition-all border",
                          selectedExercise.id === exercise.id
                            ? `border-primary/50 ${getExerciseColorClass(exercise.color).selected} shadow-sm`
                            : "hover:bg-accent/30 border-transparent"
                        )}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "p-2 rounded-xl flex-shrink-0",
                            `bg-${exercise.color}-100 dark:bg-${exercise.color}-900/30`
                          )}>
                            {exercise.icon}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm md:text-base truncate">{exercise.name}</h3>
                            <div className="flex items-center space-x-2 text-[10px] md:text-xs text-muted-foreground">
                              <span className="font-medium">{exercise.inhale}s - {exercise.hold1 || 0}s - {exercise.exhale}s</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                              <span className="capitalize font-bold text-primary/60">{exercise.variant}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-accent/20 backdrop-blur-sm p-4 md:p-6 border-t border-border/50">
                  <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-3">Composition</h4>

                  <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6">
                    <div className="bg-background/40 rounded-xl p-2 md:p-3 text-center border border-border/10">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">Inhale</p>
                      <p className="text-base md:text-lg font-black">{selectedExercise.inhale}s</p>
                    </div>

                    {selectedExercise.hold1 && (
                      <div className="bg-background/40 rounded-xl p-2 md:p-3 text-center border border-border/10">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Hold</p>
                        <p className="text-base md:text-lg font-black">{selectedExercise.hold1}s</p>
                      </div>
                    )}

                    <div className="bg-background/40 rounded-xl p-2 md:p-3 text-center border border-border/10">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">Exhale</p>
                      <p className="text-base md:text-lg font-black">{selectedExercise.exhale}s</p>
                    </div>

                    {selectedExercise.hold2 && (
                      <div className="bg-background/40 rounded-xl p-2 md:p-3 text-center border border-border/10">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground">Hold</p>
                        <p className="text-base md:text-lg font-black">{selectedExercise.hold2}s</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-primary mb-2">Physiological Benefits</h4>
                    <div className="flex flex-wrap gap-1.5 focus:outline-none">
                      {selectedExercise.benefits.map((benefit, index) => (
                        <div key={index} className="px-2 py-0.5 bg-primary/5 rounded-md text-[10px] text-muted-foreground font-medium border border-primary/5">
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className={cn(
              "h-full flex flex-col border-t-4 shadow-lg overflow-hidden",
              getExerciseColorClass(selectedExercise.color).border,
              getExerciseColorClass(selectedExercise.color).shadow
            )}>
              <CardHeader className={cn(
                "border-b border-border/30 bg-gradient-to-b",
                getExerciseColorClass(selectedExercise.color).bg
              )}>
                <CardTitle className={getExerciseColorClass(selectedExercise.color).text}>
                  {selectedExercise.name}
                </CardTitle>
                <CardDescription>
                  {selectedExercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 p-6 md:p-8">
                <div className="relative flex items-center justify-center w-full h-56 md:h-64">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-accent/30 animate-pulse-slow blur-md"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                      "w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full",
                      `bg-${selectedExercise.color}-500/5`,
                      "animate-pulse-slow blur-lg"
                    )}></div>
                  </div>
                  <div
                    className={cn(
                      "rounded-full bg-gradient-to-br",
                      colors[currentPhase],
                      "flex items-center justify-center transition-all duration-1000 shadow-xl relative z-10",
                      isActive && "animate-pulse-slow"
                    )}
                    style={{
                      width: `${circleSize}px`,
                      height: `${circleSize}px`,
                    }}
                  >
                    <div className="bg-background/80 dark:bg-background/20 backdrop-blur-md rounded-full w-14 h-14 md:w-20 md:h-20 flex items-center justify-center shadow-inner">
                      <p className="text-2xl md:text-3xl font-bold">{timeRemaining}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 w-full max-w-sm md:max-w-md">
                  <h3 className={cn(
                    "text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent italic",
                    `from-${selectedExercise.color}-500 to-${selectedExercise.color}-700 dark:from-${selectedExercise.color}-400 dark:to-${selectedExercise.color}-600`
                  )}>
                    {getInstructionText()}
                  </h3>

                  <div className="flex justify-center gap-3 md:gap-4">
                    <Button
                      size={isMobile ? "default" : "lg"}
                      onClick={isActive ? stopExercise : startExercise}
                      className={cn(
                        "rounded-xl px-8",
                        isActive
                          ? "bg-muted hover:bg-muted/80 shadow-lg text-foreground"
                          : `bg-gradient-to-r from-${selectedExercise.color}-500 to-${selectedExercise.color}-600 hover:from-${selectedExercise.color}-600 hover:to-${selectedExercise.color}-700 text-white shadow-lg`
                      )}
                    >
                      {isActive ? (
                        <>
                          <Pause className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Start
                        </>
                      )}
                    </Button>

                    <Button
                      size={isMobile ? "default" : "lg"}
                      variant="outline"
                      onClick={resetExercise}
                      disabled={!isActive && totalTime === 0}
                      className="rounded-xl border border-border/50 shadow-lg"
                    >
                      <RefreshCw className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Reset
                    </Button>
                  </div>

                  {(isActive || totalTime > 0) && (
                    <div className="grid grid-cols-2 gap-3 md:gap-4 text-sm text-muted-foreground mt-4">
                      <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-md border border-border/30">
                        <p className="text-[10px] uppercase tracking-wider font-bold">Total Time</p>
                        <p className="text-lg md:text-xl font-black text-foreground">{formatTime(totalTime)}</p>
                      </div>

                      <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-md border border-border/30">
                        <p className="text-[10px] uppercase tracking-wider font-bold">Cycles</p>
                        <p className="text-lg md:text-xl font-black text-foreground">{cycleCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Breathing;
