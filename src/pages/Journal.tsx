
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Calendar as CalendarIcon, Trash2, Pencil, Save, Brain, LineChart as LineChartIcon, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface JournalEntry {
  id: string;
  date: Date;
  mood: string;
  content: string;
  tags: string[];
  sentiment?: {
    score: number;
    label: string;
    analysis: string;
  };
}

import { API_ENDPOINTS } from "@/lib/api-config";

const moodOptions = ["Great", "Good", "Okay", "Low", "Difficult"];

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const { updateThemeFromMood } = useTheme();

  const [newEntry, setNewEntry] = useState<Omit<JournalEntry, "id">>({
    date: new Date(),
    mood: "Good",
    content: "",
    tags: [],
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState("");

  // Fetch entries from backend
  const fetchEntries = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.JOURNAL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      // Convert date strings back to Date objects
      const formattedData = data.map((entry: any) => ({
        ...entry,
        id: entry._id, // MongoDB uses _id
        date: new Date(entry.date)
      }));
      setEntries(formattedData);

      // Update theme from latest entry
      if (formattedData.length > 0) {
        const latestMood = formattedData[0].sentiment?.label || formattedData[0].mood;
        updateThemeFromMood(latestMood);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Failed to load journal entries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [token]);

  const handleAddEntry = async () => {
    if (!newEntry.content.trim()) {
      toast.error("Please write something in your journal entry");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.JOURNAL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newEntry),
      });

      if (response.ok) {
        toast.success("Journal entry saved successfully");
        const savedEntry = await response.json();

        // Refresh list and update theme immediately
        fetchEntries();
        if (savedEntry.sentiment?.label) {
          updateThemeFromMood(savedEntry.sentiment.label);
        }

        setNewEntry({
          date: new Date(),
          mood: "Good",
          content: "",
          tags: [],
        });
      } else {
        throw new Error("Failed to save entry");
      }
    } catch (error) {
      toast.error("Error saving entry to database");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.JOURNAL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== id));
        toast.success("Journal entry deleted");
      }
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  const handleEditEntry = async (entry: JournalEntry) => {
    if (editingId === entry.id) {
      try {
        const response = await fetch(`${API_ENDPOINTS.JOURNAL}/${entry.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: entry.content }),
        });

        if (response.ok) {
          setEditingId(null);
          toast.success("Entry updated");
        }
      } catch (error) {
        toast.error("Failed to update entry");
      }
    } else {
      setEditingId(entry.id);
    }
  };

  const handleUpdateContent = (id: string, content: string) => {
    setEntries(entries.map(entry =>
      entry.id === id ? { ...entry, content } : entry
    ));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newEntry.tags.includes(newTag.trim())) {
      setNewEntry({
        ...newEntry,
        tags: [...newEntry.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const entriesForSelectedDate = entries.filter(entry =>
    format(entry.date, "yyyy-MM-dd") === format(selectedDate || new Date(), "yyyy-MM-dd")
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container px-4 sm:px-6 lg:px-8 pt-32 pb-8 md:pt-40 md:pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight bg-gradient-to-r from-serenity-600 to-calm-600 bg-clip-text text-transparent">
          Mood Journal
        </h1>

        <Tabs defaultValue="new" className="space-y-6">
          <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
            <TabsList className="w-full sm:w-auto inline-flex bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-1 gap-1">
              <TabsTrigger value="new" className="flex items-center flex-1 sm:flex-none py-2.5 px-6 whitespace-nowrap rounded-xl">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Entry
              </TabsTrigger>
              <TabsTrigger value="view" className="flex-1 sm:flex-none py-2.5 px-6 whitespace-nowrap rounded-xl">Journal Entries</TabsTrigger>
              <TabsTrigger value="insights" className="flex-1 sm:flex-none py-2.5 px-6 whitespace-nowrap rounded-xl">
                <TrendingUp className="mr-2 h-4 w-4" />
                AI Insights
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Card */}
              <Card className="lg:col-span-2 border-white/20 dark:border-white/10 shadow-xl bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="text-primary h-5 w-5" />
                    Mood Trends Analysis
                  </CardTitle>
                  <CardDescription>Visualizing your emotional journey over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[...entries].reverse()}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#81c784" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#81c784" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(date, 'MMM d')}
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis domain={[0, 1]} hide />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-xl">
                                <p className="text-xs font-bold text-muted-foreground mb-1">{format(data.date, 'PPPP')}</p>
                                <p className="text-sm font-bold text-primary">{data.sentiment?.label || data.mood}</p>
                                <p className="text-[10px] text-muted-foreground mt-1 max-w-[150px] leading-tight">{data.sentiment?.analysis}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sentiment.score"
                        stroke="#81c784"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <div className="space-y-6">
                <Card className="border-white/20 dark:border-white/10 shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2rem]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Brain className="text-purple-500 h-4 w-4" />
                      Mood Aura
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="text-4xl font-bold bg-gradient-to-br from-serenity-600 to-calm-600 bg-clip-text text-transparent">
                        {entries.length > 0 ? entries[0].sentiment?.label || entries[0].mood : "N/A"}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center px-4">
                        Based on your most recent entry, your mental state is primarily {entries[0]?.sentiment?.label.toLowerCase() || 'calm'}.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/20 dark:border-white/10 shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2rem]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Info className="text-blue-500 h-4 w-4" />
                      AI Insight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs leading-relaxed text-foreground/80 lowercase italic">
                      "{entries[0]?.sentiment?.analysis || "Start journaling to see AI-powered emotional analysis and tips."}"
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="new">
            <Card className="border-white/20 dark:border-white/10 shadow-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-white/20 dark:bg-black/10 border-b border-white/10">
                <CardTitle className="text-2xl font-bold">New Reflection</CardTitle>
                <CardDescription>
                  Your thoughts, amplified by AI insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newEntry.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEntry.date ? format(newEntry.date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEntry.date}
                        onSelect={(date) => setNewEntry({ ...newEntry, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">How are you feeling today?</label>
                  <Select
                    value={newEntry.mood}
                    onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((mood) => (
                        <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Journal Entry</label>
                  <Textarea
                    placeholder="Write your thoughts here..."
                    className="min-h-[200px]"
                    value={newEntry.content}
                    onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  {newEntry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newEntry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddEntry}>Save Entry</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="view">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    // Highlight dates with entries
                    modifiers={{
                      hasEntry: entries.map(entry => new Date(entry.date)),
                    }}
                    modifiersClassNames={{
                      hasEntry: "bg-primary text-primary-foreground",
                    }}
                  />
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-4">
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </h3>

                {entriesForSelectedDate.length === 0 ? (
                  <div className="bg-muted p-8 rounded-lg text-center">
                    <p className="text-muted-foreground">No entries for this date.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entriesForSelectedDate.map((entry) => (
                      <Card key={entry.id} className="border-white/20 dark:border-white/10 shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden group hover:shadow-primary/5 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between bg-white/20 dark:bg-black/10">
                          <div className="flex items-center gap-4">
                            <div className="bg-white/50 dark:bg-black/20 p-2 rounded-xl text-center min-w-[60px]">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">{format(entry.date, "MMM")}</p>
                              <p className="text-xl font-bold leading-none">{format(entry.date, "d")}</p>
                            </div>
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {entry.mood}
                                {entry.sentiment && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] rounded-lg border-none py-0 px-2 h-5">
                                    {entry.sentiment.label}
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-xs">{format(entry.date, "h:mm a")}</CardDescription>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl"
                              onClick={() => handleEditEntry(entry)}
                            >
                              {editingId === entry.id ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          {editingId === entry.id ? (
                            <Textarea
                              value={entry.content}
                              onChange={(e) => handleUpdateContent(entry.id, e.target.value)}
                              className="min-h-[120px] bg-white/50 dark:bg-black/20 border-white/20 rounded-2xl p-4"
                            />
                          ) : (
                            <div className="space-y-4">
                              <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{entry.content}</p>

                              {entry.sentiment && (
                                <div className="p-4 bg-primary/5 rounded-[1.5rem] border border-primary/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Brain className="h-3 w-3 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Sentiment Analysis</span>
                                  </div>
                                  <p className="text-sm italic text-muted-foreground leading-snug lowercase">
                                    "{entry.sentiment.analysis}"
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                              {entry.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-white/50 dark:bg-black/20 text-muted-foreground rounded-full text-[10px] font-medium border border-white/20"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Journal;
