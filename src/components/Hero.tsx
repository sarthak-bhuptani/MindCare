
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, BookHeart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-40 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {isAuthenticated ? (
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Welcome back, {user?.name}
                </span>
              ) : (
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your journey to mental wellbeing starts here
                </span>
              )}
            </h1>
            <p className="text-lg mb-8 text-muted-foreground">
              MindCare provides resources, tools, and AI-powered support to help you navigate your mental health journey with compassion and understanding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:translate-y-[-2px] transition-transform text-white border-none shadow-lg shadow-primary/25">
                    <Link to="/journal">
                      <BookHeart className="mr-2 h-5 w-5" />
                      View Your Journal
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-secondary/20 hover:bg-secondary/5 rounded-2xl">
                    <Link to="/chat">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Conversation with Serene
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:translate-y-[-2px] transition-transform text-white border-none shadow-lg shadow-primary/25">
                    <Link to="/register">
                      Get Started Free
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-secondary/20 hover:bg-secondary/5 rounded-2xl">
                    <Link to="/login">
                      Login to Your Account
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="blob bg-gradient-to-br from-primary/40 to-secondary/40 w-[350px] h-[350px] mx-auto blob-animation flex items-center justify-center">
              <div className="glass-card p-8 w-64 transform rotate-[-6deg] animate-float relative z-10">
                <div className="bg-primary/20 w-full h-2 rounded-full mb-3"></div>
                <div className="bg-primary/10 w-3/4 h-2 rounded-full mb-3"></div>
                <div className="bg-primary/5 w-1/2 h-2 rounded-full"></div>
              </div>
              <div className="glass-card absolute bottom-4 right-8 p-6 w-56 transform rotate-[8deg] animate-float animation-delay-200 z-20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/30"></div>
                  <div className="flex-1">
                    <div className="bg-secondary/20 w-full h-2 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-secondary/10 w-full h-2 rounded-full mb-3"></div>
                <div className="bg-secondary/5 w-2/3 h-2 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
