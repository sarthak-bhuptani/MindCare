
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ArrowUp, Info, HeartPulse, Mic, MicOff, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";
import { sendMessage } from "@/services/chatService";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    content: "Hi there! I'm Serene, your mental health assistant. How can I support you today?",
    isUser: false,
    timestamp: new Date(),
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Could not hear you. Please try again.");
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info("Listening... Speak now.");
      } else {
        toast.error("Speech recognition not supported in this browser.");
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      content: textToSend.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Convert messages to format expected by API
      const apiMessages = messages
        .concat(userMessage)
        .map((msg) => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        }));

      const response = await sendMessage(apiMessages as any);

      const botMessage: Message = {
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Auto-speak response if it was a voice message or speech is active
      if (textOverride || isSpeaking) {
        speakText(response);
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container px-4 sm:px-6 lg:px-8 pt-24 pb-4 md:pt-40 md:pb-12 h-[calc(100dvh-5rem)] md:h-auto flex flex-col">
        <div className="flex-grow bg-card/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden h-full md:h-[calc(100vh-12rem)]">
          <div className="bg-white/40 dark:bg-black/20 p-4 border-b border-white/20 dark:border-white/10 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <HeartPulse size={20} className="text-primary" />
              </div>
              <h1 className="text-lg font-bold">Serene AI</h1>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Info size={18} />
            </Button>
          </div>

          <div className="flex-grow p-4 md:p-6 overflow-y-auto bg-transparent scrollbar-thin">
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-primary p-2">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 md:p-6 bg-white/40 dark:bg-black/20 border-t border-white/20 dark:border-white/10 backdrop-blur-md">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3">

                {/* Voice Interaction Controls */}
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "destructive" : "secondary"}
                  className={`h-14 w-14 rounded-[1.25rem] shrink-0 transition-all ${isListening ? "animate-pulse" : ""}`}
                >
                  {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                </Button>

                {isSpeaking && (
                  <Button
                    onClick={stopSpeaking}
                    variant="ghost"
                    className="h-14 w-14 rounded-[1.25rem] shrink-0 text-primary animate-pulse"
                  >
                    <Volume2 size={24} />
                  </Button>
                )}

                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "Type or speak..."}
                  className="resize-none min-h-[56px] py-4 bg-white/50 dark:bg-black/40 border-white/30 dark:border-white/10 rounded-[1.25rem] focus:ring-2 focus:ring-primary/20 transition-all scrollbar-none"
                  disabled={isLoading || isListening}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="bg-primary text-white h-14 w-14 rounded-[1.25rem] shadow-lg shadow-primary/20 shrink-0"
                >
                  {isLoading ? (
                    <ArrowUp size={24} className="animate-bounce" />
                  ) : (
                    <Send size={24} />
                  )}
                </Button>
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-3 text-center px-4">
                Serene AI is here to listen and help, but it's not a medical professional. If you're in crisis, please seek immediate help.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
