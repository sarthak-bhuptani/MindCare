import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_ENDPOINTS.AUTH}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("OTP sent! Please check your email.");
                setStep(2);
            } else {
                toast.error(data.message || "Failed to send OTP");
            }
        } catch (error) {
            toast.error("Failed to connect to server");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_ENDPOINTS.AUTH}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Password reset successfully! Please login.");
                navigate("/login");
            } else {
                toast.error(data.message || "Failed to reset password");
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
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-calm-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Reset Password
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {step === 1 ? "Enter your email to receive a reset code." : "Enter the code and your new password."}
                        </p>
                    </div>

                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5">
                        {step === 1 ? (
                            <form onSubmit={handleSendOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium ml-1">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            className="pl-12 h-14 bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg leading-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-serenity-500 to-calm-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            Send Reset Code <ArrowRight size={20} />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-sm font-medium ml-1">Verification Code</Label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            className="pl-12 h-14 bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-sm font-medium ml-1">New Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-12 h-14 bg-white/50 dark:bg-black/20 border-white/40 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-serenity-500 to-calm-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Resetting...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            Reset Password <ArrowRight size={20} />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        )}

                        <div className="mt-8 text-center pt-6 border-t border-white/20 dark:border-white/10">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{" "}
                                <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">
                                    Back to login
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
