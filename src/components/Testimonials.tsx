
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Arjun Sharma",
    role: "Student",
    content: "The AI chat feature helped me understand my anxiety better. It's like having a supportive friend available whenever I need to talk.",
    avatar: "AS",
  },
  {
    name: "Priya Patel",
    role: "Teacher",
    content: "I use the breathing exercises during my breaks at work. They've made a noticeable difference in my stress levels throughout the day.",
    avatar: "PP",
  },
  {
    name: "Vikram Singh",
    role: "Healthcare Worker",
    content: "The mood journal helped me identify patterns in my emotional wellbeing that I hadn't noticed before. It's been invaluable.",
    avatar: "VS",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how Serene Mind has supported people on their mental wellbeing journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarFallback className="bg-muted">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-center mb-4 italic">"{testimonial.content}"</p>
                <div className="text-center">
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
