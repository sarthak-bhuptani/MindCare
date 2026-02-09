
import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse size={24} className="text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-serenity-500 to-calm-500 bg-clip-text text-transparent">
                Serene Mind
              </span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Supporting your mental wellbeing journey with compassion and understanding.
            </p>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-primary transition-colors">Resources</Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-primary transition-colors">Journal</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-primary transition-colors">AI Chat</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/resources" className="hover:text-primary transition-colors">Mental Health Articles</Link>
              </li>
              <li>
                <Link to="/breathing" className="hover:text-primary transition-colors">Breathing Exercises</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-primary transition-colors">Crisis Support</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-medium mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">
              For support or inquiries, reach out to us at:
              <br />
              <a href="mailto:mrsarthak825@gmail.com" className="text-primary hover:underline">
                mrsarthak825@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-sm text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Serene Mind. All rights reserved.</p>
          <p className="mt-1">
            This is a project created for educational purposes. For real mental health emergencies,
            please contact your local mental health crisis services.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
