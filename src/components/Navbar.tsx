
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, BookHeart, MessageSquare, HeartPulse, Calendar, Wind, Gamepad2, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SOSModal } from "@/components/SOSModal";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon?: any }) => (
    <Link
      to={to}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
        isActive(to) ? "text-primary" : "text-muted-foreground"
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
      {isActive(to) && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
        />
      )}
    </Link>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
          "flex items-center gap-4 px-8 py-3 rounded-full",
          "border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl",
          scrolled
            ? "bg-white/70 dark:bg-black/70 w-full max-w-4xl py-2 px-6 translate-y-2 border-primary/20 shadow-primary/5"
            : "bg-white/30 dark:bg-black/30 w-full max-w-6xl"
        )}
      >
        <Link to="/" className="flex items-center space-x-2 shrink-0 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <HeartPulse size={24} className="text-primary" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:block">
            MindCare
          </span>
        </Link>

        {/* Flexible spacer to push items to the right on mobile */}
        <div className="flex-1 lg:hidden" />

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center px-4">
          {isAuthenticated ? (
            <>
              <NavItem to="/" icon={Calendar}>Home</NavItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary outline-none transition-colors">
                  Wellness Tools <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 w-56 rounded-2xl border border-primary/10 bg-background/80 backdrop-blur-xl shadow-2xl">
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer">
                    <Link to="/breathing" className="flex items-center gap-3 p-3 w-full">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Wind size={16} className="text-blue-500" />
                      </div>
                      <span className="font-medium text-foreground">Breathing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer">
                    <Link to="/journal" className="flex items-center gap-3 p-3 w-full">
                      <div className="p-1.5 bg-pink-100 dark:bg-pink-900/40 rounded-lg">
                        <BookHeart size={16} className="text-pink-500" />
                      </div>
                      <span className="font-medium text-foreground">Mood Journal</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 cursor-pointer">
                    <Link to="/mindgame" className="flex items-center gap-3 p-3 w-full">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <Gamepad2 size={16} className="text-purple-500" />
                      </div>
                      <span className="font-medium text-foreground">Mind Games</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NavItem to="/resources" icon={BookHeart}>Resources</NavItem>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/resources">Resources</NavItem>
            </div>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l pl-4 border-border/50">
              <SOSModal />
              <Link to="/chat">
                <Button size="sm" className="rounded-xl px-5 bg-gradient-to-r from-primary to-secondary hover:translate-y-[-1px] active:translate-y-[0px] transition-all text-white shadow-lg shadow-primary/10 border-none">
                  <MessageSquare size={16} className="mr-2" /> AI Chat
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                    <UserIcon size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl border border-primary/10 bg-background/80 backdrop-blur-xl shadow-2xl">
                  <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-primary/70 border-b border-primary/5 mb-2">
                    {user?.name}
                  </div>
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10 p-3 rounded-xl flex items-center gap-2 cursor-pointer transition-colors">
                    <LogOut size={16} /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-xl px-5">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-xl px-6 bg-primary text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-xl hover:bg-accent/50 transition-colors">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && (
            <div className="flex items-center gap-1 sm:gap-2">
              <SOSModal />
              <Link to="/chat">
                <Button size="icon" className="h-9 w-9 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/10">
                  <MessageSquare size={18} />
                </Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-9 w-9 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for focus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-4 right-4 z-40 lg:hidden p-5 rounded-[2.5rem] border border-white/20 bg-background/95 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto overflow-hidden"
            >
              <div className="flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-between px-2 mb-4">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Menu</span>
                  <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="h-10 w-10 rounded-2xl bg-primary/5 hover:bg-primary/10">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <Link to="/" className={cn("p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]", isActive("/") ? "bg-primary text-white" : "hover:bg-primary/5 text-muted-foreground")}>
                    <HeartPulse size={20} /> <span className="font-semibold">Home Dashboard</span>
                  </Link>
                  <Link to="/resources" className={cn("p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]", isActive("/resources") ? "bg-primary text-white" : "hover:bg-primary/5 text-muted-foreground")}>
                    <BookHeart size={20} /> <span className="font-semibold">Mindfulness Hub</span>
                  </Link>
                </div>

                {isAuthenticated ? (
                  <div className="mt-4 pt-4 border-t border-primary/10 flex flex-col gap-3">
                    <Link to="/chat" className="p-4 rounded-3xl bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-between shadow-xl shadow-primary/20">
                      <div className="flex items-center gap-3">
                        <MessageSquare size={20} /> <span className="font-bold text-lg">AI Therapy</span>
                      </div>
                      <div className="bg-white/20 p-1 px-2 rounded-lg text-[10px] font-bold uppercase tracking-tighter">Live</div>
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <Link to="/journal" className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex flex-col gap-2">
                        <BookHeart size={20} className="text-pink-500" /> <span className="text-xs font-bold">Journal</span>
                      </Link>
                      <Link to="/breathing" className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex flex-col gap-2">
                        <Wind size={20} className="text-blue-500" /> <span className="text-xs font-bold">Breathing</span>
                      </Link>
                    </div>

                    <div className="mt-4 p-4 rounded-3xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {user?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Active Member</p>
                          <p className="font-bold text-sm">{user?.name}</p>
                        </div>
                      </div>
                      <Button onClick={logout} variant="outline" className="w-full rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold">
                        <LogOut size={16} className="mr-2" /> End Session
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col gap-3">
                    <Link to="/register">
                      <Button className="w-full h-14 rounded-3xl bg-primary text-white font-bold text-lg shadow-2xl shadow-primary/30">
                        Join MindCare
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="ghost" className="w-full h-14 rounded-3xl border border-primary/10 font-semibold text-muted-foreground">
                        Sign In to Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
