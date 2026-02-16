
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import LoginAvatar from "@/components/LoginAvatar";
import { API_ENDPOINTS } from "@/lib/api-config";
import { isOnboarded } from "@/lib/onboarding";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                if (isOnboarded()) {
                    navigate("/dashboard");
                } else {
                    navigate("/onboarding");
                }
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            toast.error("Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#fdfdfd] dark:bg-[#0a0a0a] overflow-hidden">
            <Navbar />

            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-calm-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-[60%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                >
                    {/* Left Side: Animated Avatar */}
                    <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-calm-500/5 rounded-[3rem] border border-calm-500/10 backdrop-blur-sm relative overflow-hidden grouporder-last lg:order-first">
                        <div className="absolute inset-0 bg-gradient-to-br from-calm-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10 scale-125">
                            <LoginAvatar isPasswordFocused={isPasswordFocused} />
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-12 relative z-10"
                        >
                            <h2 className="text-2xl font-bold text-calm-600 mb-2">Join MindCare</h2>
                            <p className="text-muted-foreground">The first step to a better you. <br /> Our avatar will guide you through.</p>
                        </motion.div>
                    </div>

                    {/* Right Side: Register Form */}
                    <div className="w-full">
                        <div className="mb-8 text-center lg:text-left lg:pl-4">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                Create Account
                            </h1>
                            <p className="text-muted-foreground mt-2">Start your personalized wellness journey today.</p>
                        </div>

                        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5">
                            <form onSubmit={handleRegister} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium ml-1">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="name"
                                            placeholder="John Doe"
                                            className="pl-12 h-14 bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium ml-1">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-12 h-14 bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium ml-1">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-12 h-14 bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setIsPasswordFocused(true)}
                                            onBlur={() => setIsPasswordFocused(false)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-serenity-500 to-calm-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold text-lg shadow-lg shadow-primary/20 mt-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating account...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            Get Started <ArrowRight size={20} />
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-8 text-center pt-6 border-t border-white/20 dark:border-white/10">
                                <p className="text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
                                        Welcome back
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
