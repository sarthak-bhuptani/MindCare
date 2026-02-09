
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Link as LinkIcon, ArrowRight } from "lucide-react";

const resourceArticles = [
  {
    title: "Understanding Anxiety Disorders",
    description: "Learn about the different types of anxiety disorders, their symptoms, causes, and treatment options.",
    category: "Understanding Mental Health",
    readTime: "10 min read",
  },
  {
    title: "Cognitive Behavioral Therapy Techniques",
    description: "Explore practical cognitive behavioral therapy (CBT) techniques you can use to manage negative thought patterns.",
    category: "Therapy Approaches",
    readTime: "12 min read",
  },
  {
    title: "The Science of Meditation and Mindfulness",
    description: "Discover the research-backed benefits of regular meditation and mindfulness practice for mental health.",
    category: "Mindfulness",
    readTime: "8 min read",
  },
  {
    title: "Building Resilience in Difficult Times",
    description: "Learn strategies to build emotional resilience and cope with life's challenges and setbacks.",
    category: "Coping Skills",
    readTime: "9 min read",
  },
  {
    title: "Sleep and Mental Health Connection",
    description: "Understand the crucial relationship between sleep quality and mental wellbeing, with tips for better sleep.",
    category: "Lifestyle Factors",
    readTime: "7 min read",
  },
  {
    title: "Supporting a Loved One with Depression",
    description: "Guidance on how to provide effective support to friends or family members experiencing depression.",
    category: "Supporting Others",
    readTime: "11 min read",
  },
];

const externalResources = [
  {
    title: "National Alliance on Mental Illness",
    url: "https://www.nami.org",
  },
  {
    title: "Mental Health America",
    url: "https://www.mhanational.org",
  },
  {
    title: "International Association for Suicide Prevention",
    url: "https://www.iasp.info",
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container px-4 sm:px-6 lg:px-8 pt-32 pb-8 md:pt-40 md:pb-12">
        <section className="mb-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-4">Mental Health Resources</h1>
            <p className="text-muted-foreground text-lg">
              Access our collection of informative articles, tools, and external resources to support your mental wellbeing journey.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceArticles.map((article, index) => (
              <Card key={index} className="border border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <p className="text-xs text-primary font-medium mb-1">{article.category}</p>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80">
                    {article.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{article.readTime}</p>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <LinkIcon className="mr-2 h-6 w-6 text-primary" />
            External Resources
          </h2>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
            <p className="mb-4 text-muted-foreground">
              These trusted external resources provide additional support, information, and crisis services.
            </p>
            <ul className="space-y-4">
              {externalResources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-background rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.url}</p>
                    </div>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-serenity-50 dark:bg-serenity-900/30 border border-serenity-100 dark:border-serenity-800 rounded-lg">
              <h3 className="font-medium text-serenity-800 dark:text-serenity-200">Crisis Support</h3>
              <p className="text-sm text-serenity-700 dark:text-serenity-300 mt-1">
                If you're experiencing a mental health crisis or having thoughts of suicide, please reach out immediately to a crisis helpline or emergency services in your area.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
