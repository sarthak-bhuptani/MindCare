
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookHeart, MessageSquare, HeartPulse, Calendar, Wind, Gamepad2, LogOut, User as UserIcon, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
              <NavItem to="/dashboard" icon={Calendar}>Dashboard</NavItem>
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
                  <DropdownMenuItem asChild className="p-3 rounded-xl flex items-center gap-2 cursor-pointer transition-colors focus:bg-primary/10">
                    <Link to="/profile">
                      <UserIcon size={16} /> Profile & Settings
                    </Link>
                  </DropdownMenuItem>
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
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden pointer-events-auto"
            />
            <motion.div
              key="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-sm bg-background shadow-2xl border-l border-border/50 flex flex-col overflow-hidden lg:hidden pointer-events-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50 backdrop-blur-xl">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-secondary">
                  <X size={24} />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/"}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]",
                      isActive("/dashboard") || isActive("/") ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-secondary/50 hover:bg-secondary text-foreground"
                    )}
                  >
                    <HeartPulse size={20} />
                    <span className="font-bold text-base">Home</span>
                  </Link>

                  <Link
                    to="/resources"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "p-4 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98]",
                      isActive("/resources") ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-secondary/50 hover:bg-secondary text-foreground"
                    )}
                  >
                    <BookHeart size={20} />
                    <span className="font-bold text-base">Mindfulness Hub</span>
                  </Link>
                </div>

                {isAuthenticated ? (
                  <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in duration-500 delay-100 fill-mode-both">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Wellness Tools</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Link to="/journal" onClick={() => setIsOpen(false)} className="p-4 rounded-3xl bg-pink-50 dark:bg-pink-950/30 border border-pink-100 dark:border-pink-900/50 flex flex-col gap-3 active:scale-95 transition-transform">
                          <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 dark:text-pink-400">
                            <BookHeart size={18} />
                          </div>
                          <span className="font-bold text-xs">Journal</span>
                        </Link>
                        <Link to="/breathing" onClick={() => setIsOpen(false)} className="p-4 rounded-3xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 flex flex-col gap-3 active:scale-95 transition-transform">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Wind size={18} />
                          </div>
                          <span className="font-bold text-xs">Breathing</span>
                        </Link>
                        <Link to="/mindgame" onClick={() => setIsOpen(false)} className="col-span-2 p-4 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex items-center justify-between active:scale-95 transition-transform">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                              <Gamepad2 size={18} />
                            </div>
                            <span className="font-bold text-xs">Mind Games</span>
                          </div>
                          <ArrowRight size={16} className="text-purple-400" />
                        </Link>
                      </div>
                    </div>

                    <Link to="/chat" onClick={() => setIsOpen(false)} className="p-5 rounded-[2rem] bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-base leading-tight">AI Therapist</h3>
                          <p className="text-xs text-blue-100 font-medium">Always here to listen</p>
                        </div>
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md group-hover:bg-white/30 transition-colors">
                        Live
                      </div>
                    </Link>

                    <div className="mt-auto pt-6 border-t border-border/50">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-lg">
                          {user?.name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Signed In</p>
                          <p className="font-bold text-base truncate">{user?.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Link to="/profile" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full h-11 rounded-xl border-primary/20 hover:bg-primary/5 font-bold">
                            <UserIcon size={16} className="mr-2 text-primary" /> Profile
                          </Button>
                        </Link>
                        <Button onClick={() => { logout(); setIsOpen(false); }} variant="outline" className="w-full h-11 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 font-bold">
                          <LogOut size={16} className="mr-2" /> Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto space-y-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                    <div className="p-6 rounded-[2.5rem] bg-secondary/30 border border-border/50 text-center space-y-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary mb-2">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Start your journey</h3>
                        <p className="text-muted-foreground text-xs font-medium mt-1">Join thousands of others finding their peace.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          <Button className="w-full h-12 rounded-xl font-bold text-base shadow-xl shadow-primary/20">Sign Up Free</Button>
                        </Link>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full h-12 rounded-xl font-bold">Log In</Button>
                        </Link>
                      </div>
                    </div>
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
