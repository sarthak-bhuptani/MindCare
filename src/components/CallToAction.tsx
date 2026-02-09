
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CallToAction = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-serenity-100/50 to-calm-100/50 dark:from-serenity-900/30 dark:to-calm-900/30 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-background/70 backdrop-blur-md border border-border rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="text-center max-w-3xl mx-auto">
            {isAuthenticated ? (
              <>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Continue your journey to wellbeing</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your personalized mental health assistant and journal are ready for you.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-serenity-500 to-calm-500 hover:from-serenity-600 hover:to-calm-600 text-white">
                    <Link to="/journal">
                      Go to Your Dashboard
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to start your mental wellbeing journey?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join Serene Mind today and get access to AI-powered support, mood tracking, and guided exercises.
                </p>
                <Button asChild size="lg" className="bg-gradient-to-r from-serenity-500 to-calm-500 hover:from-serenity-600 hover:to-calm-600 text-white">
                  <Link to="/register">
                    <Heart className="mr-2 h-5 w-5" />
                    Sign Up for Free
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
