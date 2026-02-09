
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCcw,
  Brain,
  Search,
  CheckCircle2,
  ArrowRight,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

// --- GAME HUB TYPES ---
type GameId = "memory" | "painter" | "words" | "none";

interface GameInfo {
  id: GameId;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
}

const games: GameInfo[] = [
  {
    id: "memory",
    title: "Memory Match",
    description: "Classic pattern matching to anchor focus.",
    icon: <Brain className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-600",
    benefits: ["Improve focus", "Short-term memory", "Mental clarity"]
  },
  {
    id: "painter",
    title: "Light Painter",
    description: "Draw with glowing trails that fade.",
    icon: <Palette className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-600",
    benefits: ["Creative flow", "No-judgment art", "Relaxation"]
  },
  {
    id: "words",
    title: "Affirmation Search",
    description: "Find positivity hidden in noise.",
    icon: <Search className="w-6 h-6" />,
    color: "from-pink-400 to-rose-500",
    benefits: ["Positive self-talk", "Pattern recognition", "Calmness"]
  }
];

// --- 1. MEMORY MATCH ---
const MemoryMatch = () => {
  const emojis = ["🌸", "🌻", "🌹", "🍀", "🌈", "🌟", "🦋", "🐢"];
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const init = useCallback(() => {
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((e, idx) => ({ id: idx, emoji: e }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  }, []);

  useEffect(() => { init(); }, [init]);

  const handleClick = (idx: number) => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      if (cards[newFlipped[0]].emoji === cards[newFlipped[1]].emoji) {
        setMatched(prev => [...prev, ...newFlipped]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) toast.success("Mind Cleared!");
      } else setTimeout(() => setFlipped([]), 800);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center bg-primary/5 p-3 rounded-2xl border border-primary/10 max-w-sm mx-auto">
        <Badge variant="secondary" className="px-3 py-1 rounded-lg text-xs font-bold">Moves: {moves}</Badge>
        <Button onClick={init} variant="ghost" size="sm" className="rounded-lg h-8 text-xs"><RotateCcw size={14} className="mr-1" /> Reset</Button>
      </div>
      <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
        {cards.map((c, i) => (
          <motion.div key={i} whileHover={{ scale: 1.05 }} onClick={() => handleClick(i)} className={cn("aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-500 shadow-md", flipped.includes(i) || matched.includes(i) ? "bg-white dark:bg-white/10 rotate-0 border border-primary/20" : "bg-gradient-to-br from-primary to-secondary rotate-180")}>
            {(flipped.includes(i) || matched.includes(i)) ? c.emoji : ""}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- 2. LIGHT PAINTER ---
const LightPainter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#00eeff");
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let points: any[] = [];
    const resize = () => { canvas.width = canvas.parentElement!.clientWidth; canvas.height = canvas.parentElement!.clientHeight; };
    resize();
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points = points.filter(p => p.age > 0);
      points.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.age / 2, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.globalAlpha = p.age / 40; ctx.fill(); p.age -= 0.5;
      });
      requestAnimationFrame(animate);
    };
    const move = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      points.push({ x, y, age: 40, color });
    };
    canvas.addEventListener('mousemove', move); canvas.addEventListener('touchmove', move);
    const id = requestAnimationFrame(animate);
    return () => { canvas.removeEventListener('mousemove', move); canvas.removeEventListener('touchmove', move); cancelAnimationFrame(id); };
  }, [color]);
  return (
    <div className="space-y-4 max-w-md mx-auto w-full">
      <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10">
        <div className="flex gap-2">{["#00eeff", "#ff00ff", "#00ff88", "#ffcc00"].map(c => <button key={c} onClick={() => setColor(c)} className={cn("w-6 h-6 rounded-full border-2", color === c ? "border-white" : "border-transparent")} style={{ backgroundColor: c }} />)}</div>
        <p className="text-[10px] text-muted-foreground mr-2 uppercase tracking-widest font-bold">Paint Area</p>
      </div>
      <div className="h-[300px] bg-black rounded-3xl overflow-hidden border-2 border-gray-800 shadow-2xl"><canvas ref={canvasRef} className="w-full h-full" /></div>
    </div>
  );
};

// --- 3. AFFIRMATION SEARCH ---
const AffirmationSearch = () => {
  const words = ["PEACE", "CALM", "LOVE", "HEAL", "GROW", "JOY", "HOPE"];
  const [grid, setGrid] = useState<string[][]>([]);
  const [selected, setSelected] = useState<[number, number][]>([]);
  const [found, setFound] = useState<string[]>([]);
  const generate = useCallback(() => {
    const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const g = Array(10).fill(null).map(() => Array(10).fill(null).map(() => c[Math.floor(Math.random() * 26)]));
    words.forEach((w, i) => { const r = i; const s = Math.floor(Math.random() * (10 - w.length)); for (let j = 0; j < w.length; j++) g[r][s + j] = w[j]; });
    setGrid(g); setFound([]); setSelected([]);
  }, []);
  useEffect(() => { generate(); }, [generate]);
  const toggle = (r: number, c: number) => {
    const is = selected.some(([rx, cx]) => rx === r && cx === c);
    const next = is ? selected.filter(([rx, cx]) => !(rx === r && cx === c)) : [...selected, [r, c] as [number, number]];
    setSelected(next);
    const t = next.map(([rx, cx]) => grid[rx][cx]).join("");
    words.forEach(w => { if (t === w && !found.includes(w)) { setFound([...found, w]); toast.success(w); setSelected([]); } });
  };
  return (
    <div className="space-y-4 max-w-md mx-auto w-full">
      <div className="flex flex-wrap gap-1.5 justify-center">{words.map(w => <Badge key={w} className={cn("rounded-md px-2 py-0.5 text-[9px] uppercase font-bold", found.includes(w) ? "bg-green-500" : "bg-muted opacity-50")}>{w}</Badge>)}</div>
      <div className="grid grid-cols-10 gap-0.5 p-2 bg-white/20 rounded-2xl border border-white/20">
        {grid.map((row, r) => row.map((char, c) => <div key={`${r}-${c}`} onClick={() => toggle(r, c)} className={cn("aspect-square flex items-center justify-center rounded-md text-[10px] font-black cursor-pointer select-none", selected.some(([rx, cx]) => rx === r && cx === c) ? "bg-primary text-white" : "bg-white/10 hover:bg-white/20")}>{char}</div>))}
      </div>
    </div>
  );
};

const MindGame = () => {
  const [selectedGame, setSelectedGame] = useState<GameId>("none");

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd] dark:bg-[#050505] overflow-hidden">
      <Navbar />

      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-[120px] blob-animation" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-200 dark:bg-cyan-900/20 rounded-full blur-[120px] blob-animation-slow" />
      </div>

      <main className="flex-grow container px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pt-28 relative z-10">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {selectedGame === "none" ? (
              <motion.div
                key="hub"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Hero section */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] tracking-widest uppercase"
                  >
                    Cognitive Refinement
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black tracking-tight leading-none italic"
                  >
                    MIND <span className="text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.1)]">GAMES</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed"
                  >
                    Immersive exercises designed to <span className="text-foreground border-b-2 border-primary/30">quiet the mind</span> and heighten focus.
                  </motion.p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {games.map((g, idx) => (
                    <motion.div
                      key={g.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.1) }}
                    >
                      <Card
                        className="group relative cursor-pointer border border-white/40 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20"
                        onClick={() => setSelectedGame(g.id)}
                      >
                        {/* Hover glow effect */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                          g.color
                        )} />

                        <CardHeader className="p-6 pb-2">
                          <div className="relative mb-4 w-fit">
                            <div className={cn(
                              "absolute inset-0 blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500",
                              g.color.split(' ').pop()
                            )} />
                            <div className={cn(
                              "relative w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg group-hover:rotate-12 transition-transform duration-500",
                              g.color
                            )}>
                              {g.icon}
                            </div>
                          </div>

                          <CardTitle className="text-xl font-black tracking-tight mb-1 uppercase italic">{g.title}</CardTitle>
                          <CardDescription className="text-xs leading-relaxed text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                            {g.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 pt-0">
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {g.benefits.map(b => (
                              <Badge key={b} variant="secondary" className="px-2 py-0.5 rounded-full bg-primary/5 text-primary/70 font-bold text-[8px] uppercase tracking-wider border-none">
                                {b}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 text-primary font-black text-xs group-hover:gap-3 transition-all">
                            LAUNCH <ArrowRight size={14} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="game-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-3xl mx-auto space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedGame("none")}
                    className="rounded-2xl h-12 px-8 text-sm font-black bg-primary/5 hover:bg-primary/10 border border-primary/10 shadow-xl transition-all hover:-translate-x-2"
                  >
                    <X size={16} className="mr-2" /> SHUTDOWN MODULE
                  </Button>

                  <div className="text-center md:text-right space-y-0.5">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent italic leading-tight">
                      {games.find(g => g.id === selectedGame)?.title}
                    </h2>
                    <p className="text-muted-foreground font-bold tracking-[0.2em] uppercase text-[10px]">Active Session Protocol</p>
                  </div>
                </div>

                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-[100px] border border-white/20 rounded-[2rem] p-4 md:p-8 shadow-xl min-h-[400px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {selectedGame === "memory" && <MemoryMatch key="memory" />}
                    {selectedGame === "painter" && <LightPainter key="painter" />}
                    {selectedGame === "words" && <AffirmationSearch key="words" />}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MindGame;
