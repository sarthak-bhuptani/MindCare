
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
          "pointer-events-auto transition-all duration-500 ease-in-out",
          "flex items-center gap-4 px-6 py-3 rounded-2xl",
          "border border-border/50 shadow-2xl backdrop-blur-xl",
          scrolled
            ? "bg-background/80 w-full max-w-5xl translate-y-2 border-primary/20"
            : "bg-background/40 w-full max-w-7xl"
        )}
      >
        <Link to="/" className="flex items-center space-x-2 shrink-0 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <HeartPulse size={24} className="text-primary" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
            MindCare
          </span>
        </Link>

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
            <div className="flex items-center gap-2">
              <SOSModal />
              <Link to="/chat">
                <Button size="icon" className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/10">
                  <MessageSquare size={18} />
                </Button>
              </Link>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={setIsOpen && (() => setIsOpen(!isOpen))} className="rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-28 left-4 right-4 z-40 lg:hidden p-4 rounded-3xl border border-primary/10 bg-background/80 backdrop-blur-2xl shadow-3xl pointer-events-auto"
          >
            <div className="flex flex-col gap-2">
              <Link to="/" className="p-4 rounded-2xl hover:bg-primary/10 flex items-center gap-3 transition-colors">
                <HeartPulse size={18} className="text-primary" /> <span className="font-medium">Home</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/chat" className="p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white flex items-center gap-3 shadow-lg shadow-primary/10">
                    <MessageSquare size={18} /> <span className="font-medium">AI Chat Chat</span>
                  </Link>
                  <Link to="/journal" className="p-4 rounded-2xl hover:bg-primary/10 flex items-center gap-3 transition-colors">
                    <BookHeart size={18} className="text-primary" /> <span className="font-medium">Mood Journal</span>
                  </Link>
                  <Link to="/breathing" className="p-4 rounded-2xl hover:bg-primary/10 flex items-center gap-3 transition-colors">
                    <Wind size={18} className="text-primary" /> <span className="font-medium">Breathing</span>
                  </Link>
                  <Link to="/mindgame" className="p-4 rounded-2xl hover:bg-primary/10 flex items-center gap-3 transition-colors">
                    <Gamepad2 size={18} className="text-primary" /> <span className="font-medium">Mind Games</span>
                  </Link>
                  <div className="border-t border-primary/5 mt-2 pt-2">
                    <div className="p-4 flex items-center gap-3 text-primary/70 font-bold text-xs uppercase tracking-widest">
                      <UserIcon size={18} /> {user?.name}
                    </div>
                    <button onClick={logout} className="w-full text-left p-4 rounded-2xl text-destructive hover:bg-destructive/10 flex items-center gap-3 transition-colors">
                      <LogOut size={18} /> <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/50">
                  <Link to="/login" className="p-3 rounded-2xl border border-border text-center">Login</Link>
                  <Link to="/register" className="p-3 rounded-2xl bg-primary text-white text-center font-medium">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
