
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    User,
    Settings,
    Bell,
    Palette,
    Download,
    LogOut,
    Shield,
    Moon,
    Sun,
    Laptop,
    Smartphone,
    CheckCircle2,
    FileText
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { API_ENDPOINTS } from "@/lib/api-config";

const Profile = () => {
    const { user, logout, token } = useAuth();
    const { moodTheme, setMoodTheme, mode, setMode } = useTheme();

    // Mapping UI names to internal MoodThemes
    const themeMap: Record<string, "Joyful" | "Peaceful" | "Neutral" | "Stressed" | "Low"> = {
        "ocean": "Neutral",
        "forest": "Peaceful",
        "sunset": "Joyful",
        "berry": "Stressed",
        "royal": "Low"
    };

    // Inverse map for UI state
    const getUiThemeName = (mt: string) => {
        return Object.keys(themeMap).find(key => themeMap[key] === mt) || "ocean";
    };

    const [uiColorTheme, setUiColorTheme] = useState(getUiThemeName(moodTheme));

    const handleThemeChange = (id: string) => {
        setUiColorTheme(id);
        const mapped = themeMap[id];
        if (mapped) setMoodTheme(mapped);
    };

    // Sync if context updates externally
    useEffect(() => {
        setUiColorTheme(getUiThemeName(moodTheme));
    }, [moodTheme]);

    const [notifications, setNotifications] = useState({
        dailyCheckIn: true,
        journalReminders: false,
        achievements: true,
        marketing: false
    });
    const [reminderTime, setReminderTime] = useState("09:00");

    const [profileData, setProfileData] = useState({
        nickname: user?.name || "",
        email: user?.email || "",
        bio: "Mental wellness explorer.",
    });

    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        // Load settings from localStorage if available
        const savedSettings = localStorage.getItem(`mindcare_settings_${user?.id}`);
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setNotifications(parsed.notifications || notifications);
            // Removed colorTheme and reminderTime from here as they are now managed by context or directly
            setReminderTime(parsed.reminderTime || "09:00");
        }
    }, [user]);

    const handleSaveSettings = () => {
        if (user) {
            localStorage.setItem(`mindcare_settings_${user.id}`, JSON.stringify({
                notifications,
                // Removed colorTheme from here as it's now managed by context
                reminderTime
            }));
            toast.success("Settings saved successfully.");
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically call an API endpoint to update user profile
        // For now, we'll simulate a success
        toast.success("Profile updated successfully.");
    };

    const generatePDF = async () => {
        setIsExporting(true);
        toast.info("Generating your monthly summary...");

        try {
            // Create a temporary element to render the report
            const reportElement = document.createElement("div");
            reportElement.style.position = "absolute";
            reportElement.style.left = "-9999px";
            reportElement.style.top = "0";
            reportElement.style.width = "800px";
            reportElement.style.padding = "40px";
            reportElement.style.backgroundColor = "#ffffff";
            reportElement.style.color = "#000000";
            reportElement.style.fontFamily = "Arial, sans-serif";

            // Fetch Journal Entries for Mock Data or Actual Data
            // Ideally, fetch real data here. Using dummy content for the structure:
            const today = new Date();
            const monthName = today.toLocaleString('default', { month: 'long' });

            reportElement.innerHTML = `
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #3b82f6; margin-bottom: 10px;">MindCare Monthly Report</h1>
                    <h3 style="color: #64748b;">Summary for ${monthName} ${today.getFullYear()}</h3>
                    <p>Prepared for: <strong>${user?.name}</strong></p>
                </div>
                
                <div style="margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
                    <h2 style="color: #1e293b;">Overview</h2>
                    <p>This month, you have consistently engaged with your mental wellness tools. Here is a snapshot of your journey.</p>
                    <ul style="list-style: none; padding: 0; margin-top: 15px;">
                        <li style="margin-bottom: 8px;"><strong>📅 Days Active:</strong> 12 Days</li>
                        <li style="margin-bottom: 8px;"><strong>📝 Journal Entries:</strong> 8 Entries</li>
                        <li style="margin-bottom: 8px;"><strong>🔥 Current Streak:</strong> 5 Days</li>
                    </ul>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="color: #1e293b;">Mood Analysis</h2>
                    <p>Your dominant mood this month was <strong>Balanced</strong>.</p>
                    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #10b981;">60%</div>
                            <div style="font-size: 12px; color: #64748b;">Good</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">30%</div>
                            <div style="font-size: 12px; color: #64748b;">Neutral</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 24px; font-weight: bold; color: #ef4444;">10%</div>
                            <div style="font-size: 12px; color: #64748b;">Difficult</div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8;">
                    <p>Generated by MindCare AI • Confidential Personal Record</p>
                </div>
            `;

            document.body.appendChild(reportElement);

            const canvas = await html2canvas(reportElement);
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`MindCare_Summary_${monthName}_${today.getFullYear()}.pdf`);

            document.body.removeChild(reportElement);
            toast.success("Report downloaded successfully.");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate PDF.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow container px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-4 border-background shadow-xl">
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center text-white">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-bold">{user?.name}</h1>
                            <p className="text-muted-foreground">{user?.email}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Free Plan</span>
                                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Early Adopter</span>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="w-full md:w-auto grid grid-cols-2 md:grid-cols-4 h-14 p-1 rounded-2xl bg-secondary/30">
                            <TabsTrigger value="profile" className="rounded-xl h-12">Profile</TabsTrigger>
                            <TabsTrigger value="appearance" className="rounded-xl h-12">Appearance</TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-xl h-12">Notifications</TabsTrigger>
                            <TabsTrigger value="data" className="rounded-xl h-12">Data & Privacy</TabsTrigger>
                        </TabsList>

                        {/* PROFILE TAB */}
                        <TabsContent value="profile">
                            <Card className="border-border/50 shadow-lg rounded-3xl overflow-hidden">
                                <CardHeader className="bg-secondary/10 border-b border-border/50">
                                    <CardTitle className="flex items-center gap-2"><User size={20} /> Personal Information</CardTitle>
                                    <CardDescription>Manage your public profile and account details.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="sname">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={profileData.nickname}
                                                    onChange={(e) => setProfileData({ ...profileData, nickname: e.target.value })}
                                                    className="rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    disabled
                                                    className="rounded-xl bg-muted"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Input
                                                id="bio"
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button type="submit" className="rounded-xl font-bold">Save Changes</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* APPEARANCE TAB */}
                        <TabsContent value="appearance">
                            <Card className="border-border/50 shadow-lg rounded-3xl overflow-hidden">
                                <CardHeader className="bg-secondary/10 border-b border-border/50">
                                    <CardTitle className="flex items-center gap-2"><Palette size={20} /> Appearance</CardTitle>
                                    <CardDescription>Customize how MindCare looks for you.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-8">

                                    <div className="space-y-4">
                                        <Label className="text-base">Color Theme</Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                            {[
                                                { id: "ocean", name: "Ocean", class: "bg-cyan-500" },
                                                { id: "forest", name: "Forest", class: "bg-emerald-500" },
                                                { id: "sunset", name: "Sunset", class: "bg-orange-400" },
                                                { id: "berry", name: "Berry", class: "bg-rose-500" },
                                                { id: "royal", name: "Royal", class: "bg-indigo-500" },
                                            ].map((t) => (
                                                <div
                                                    key={t.id}
                                                    onClick={() => handleThemeChange(t.id)}
                                                    className={`cursor-pointer rounded-2xl border-2 p-1 transition-all ${uiColorTheme === t.id ? "border-primary scale-105 shadow-md" : "border-transparent hover:scale-105"}`}
                                                >
                                                    <div className={`h-20 rounded-xl ${t.class} flex items-center justify-center text-white font-bold opacity-80 hover:opacity-100 transition-opacity`}>
                                                        {uiColorTheme === t.id && <CheckCircle2 size={24} />}
                                                    </div>
                                                    <p className="text-center text-xs font-bold mt-2">{t.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <Label className="text-base">Mode</Label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Button
                                                variant={mode === "light" ? "default" : "outline"}
                                                className="h-auto py-4 flex-col gap-2 rounded-2xl transition-all"
                                                onClick={() => setMode("light")}
                                            >
                                                <Sun size={24} />
                                                Light
                                            </Button>
                                            <Button
                                                variant={mode === "dark" ? "default" : "outline"}
                                                className="h-auto py-4 flex-col gap-2 rounded-2xl transition-all"
                                                onClick={() => setMode("dark")}
                                            >
                                                <Moon size={24} />
                                                Dark
                                            </Button>
                                            <Button
                                                variant={mode === "system" ? "default" : "outline"}
                                                className="h-auto py-4 flex-col gap-2 rounded-2xl transition-all"
                                                onClick={() => setMode("system")}
                                            >
                                                <Laptop size={24} />
                                                System
                                            </Button>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* NOTIFICATIONS TAB */}
                        <TabsContent value="notifications">
                            <Card className="border-border/50 shadow-lg rounded-3xl overflow-hidden">
                                <CardHeader className="bg-secondary/10 border-b border-border/50">
                                    <CardTitle className="flex items-center gap-2"><Bell size={20} /> Notification Settings</CardTitle>
                                    <CardDescription>Manage how we communicate with you.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">

                                    <div className="flex items-center justify-between space-x-2 p-4 rounded-2xl bg-secondary/20">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-bold">Daily Check-In Reminder</Label>
                                            <p className="text-xs text-muted-foreground">Receive a nudge to log your mood.</p>
                                        </div>
                                        <Switch
                                            checked={notifications.dailyCheckIn}
                                            onCheckedChange={(c) => setNotifications({ ...notifications, dailyCheckIn: c })}
                                        />
                                    </div>

                                    {notifications.dailyCheckIn && (
                                        <div className="flex items-center gap-4 pl-4 animate-in slide-in-from-top-2 fade-in">
                                            <Label>Reminder Time:</Label>
                                            <Input
                                                type="time"
                                                value={reminderTime}
                                                onChange={(e) => setReminderTime(e.target.value)}
                                                className="w-32 rounded-xl"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between space-x-2 p-4 rounded-2xl bg-secondary/20">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-bold">Achievement Unlocks</Label>
                                            <p className="text-xs text-muted-foreground">Get notified when you hit a streak or milestone.</p>
                                        </div>
                                        <Switch
                                            checked={notifications.achievements}
                                            onCheckedChange={(c) => setNotifications({ ...notifications, achievements: c })}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button onClick={handleSaveSettings} className="rounded-xl font-bold">Save Preferences</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* DATA TAB */}
                        <TabsContent value="data">
                            <Card className="border-border/50 shadow-lg rounded-3xl overflow-hidden">
                                <CardHeader className="bg-secondary/10 border-b border-border/50">
                                    <CardTitle className="flex items-center gap-2"><Shield size={20} /> Data & Privacy</CardTitle>
                                    <CardDescription>Control your personal data and account access.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-8">

                                    <div className="space-y-4">
                                        <h3 className="font-bold flex items-center gap-2"><FileText size={18} /> Export Data</h3>
                                        <p className="text-sm text-muted-foreground">Download a summary of your monthly progress, suitable for sharing with a healthcare provider.</p>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto rounded-xl border-dashed border-2 h-12"
                                            onClick={generatePDF}
                                            disabled={isExporting}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            {isExporting ? "Generating Report..." : "Download Monthly PDF Report"}
                                        </Button>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="font-bold text-destructive flex items-center gap-2"><LogOut size={18} /> Danger Zone</h3>
                                        <p className="text-sm text-muted-foreground">Sign out of your account on this device.</p>
                                        <Button
                                            variant="destructive"
                                            className="w-full sm:w-auto rounded-xl h-12 font-bold bg-red-100 text-red-600 hover:bg-red-200 shadow-none border border-red-200"
                                            onClick={logout}
                                        >
                                            Log Out Safely
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
