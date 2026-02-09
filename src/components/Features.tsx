
import { Brain, BookOpen, Calendar, MessageCircle, Heart, Gamepad2, Wind, BarChart, Leaf, Coffee, Flame } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Mental Health Assistant",
    description: "Talk to our AI chatbot for support, resources, and guidance on your mental health journey.",
    icon: <Brain className="h-10 w-10 text-primary" />,
    link: "/chat",
  },
  {
    title: "Comprehensive Resources",
    description: "Access a curated library of articles, videos, and guides on various mental health topics.",
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    link: "/resources",
  },
  {
    title: "Mood Journal",
    description: "Track your mood patterns over time to gain insights into your emotional wellbeing.",
    icon: <Calendar className="h-10 w-10 text-primary" />,
    link: "/journal",
  },
  {
    title: "Breathing Exercises",
    description: "Practice guided breathing techniques to reduce stress and anxiety in the moment.",
    icon: <Wind className="h-10 w-10 text-primary" />,
    link: "/breathing",
  },
  {
    title: "Mind Games",
    description: "Engage in memory games that provide a mental refresh and help improve cognitive function.",
    icon: <Gamepad2 className="h-10 w-10 text-primary" />,
    link: "/mindgame",
  },
  {
    title: "Progress Tracking",
    description: "Visualize your wellness journey with personalized statistics and progress reports.",
    icon: <BarChart className="h-10 w-10 text-primary" />,
    link: "/journal",
  },
  {
    title: "Meditation Sessions",
    description: "Explore guided meditation practices to cultivate mindfulness and inner peace.",
    icon: <Leaf className="h-10 w-10 text-primary" />,
    link: "/breathing",
  },
  {
    title: "Self-Care Rituals",
    description: "Discover personalized self-care routines to improve your daily wellbeing.",
    icon: <Coffee className="h-10 w-10 text-primary" />,
    link: "/resources",
  },
  {
    title: "Stress Management",
    description: "Learn effective techniques to identify and manage stress in your daily life.",
    icon: <Flame className="h-10 w-10 text-primary" />,
    link: "/breathing",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-accent/50 to-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Supporting Your Mental Wellbeing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore tools and resources designed to help you understand, manage, and improve your mental health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index} className="group">
              <Card className="h-full border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group-hover:border-primary/50 overflow-hidden">
                <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gradient-to-br from-accent/40 to-background/0 group-hover:scale-150 transition-all duration-500"></div>
                <CardHeader>
                  <div className="mb-4 transform transition-transform group-hover:scale-110 duration-300 relative z-10">
                    {feature.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors relative z-10">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80 relative z-10">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
