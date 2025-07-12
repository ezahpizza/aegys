import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, User, ArrowLeft } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_API_KEY,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Message sent successfully!",
          description: "Thank you for reaching out. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-magpink min-h-screen w-full font-body flex flex-col overflow-x-hidden overflow-y-scroll scroll-hidden">
      <header className="w-full py-2 px-6 bg-midblck flex items-center justify-between shadow">
        <button onClick={() => navigate('/')}>
          <img 
            src='/assets/aegys_logo_white.svg' 
            alt='aegys logo' 
            className="w-32 h-16 md:w-56 md:h-24 object-contain relative z-10"
          />
        </button>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-midblck bg-lavpink hover:bg-raspink font-body"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full h-full mx-auto px-2 md:px-0 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-heading text-midblck">
              Get in Touch
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Have questions, suggestions, or just want to say hello? I'd love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="bg-midblu border-none text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-raspink">
                  <MessageSquare className="h-6 w-6" />
                  Let's Talk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Whether you're experiencing issues with Aegys, have feature requests, 
                  or are interested in collaboration opportunities, I'm here to listen.
                </p>
                <p>
                  Your feedback drives improvement, and every message helps make Aegys 
                  better for everyone.
                </p>
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <IoMdMail className="h-5 w-5 text-lavpink" />
                    <span>Direct response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-lavpink" />
                    <span>Personal attention to every inquiry</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-lavpink border-none text-midblck">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-midblck/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white border-midblck/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-white border-midblck/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-white border-midblck/20 resize-none"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-raspink hover:bg-magpink text-white font-heading"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-midblck/80 border-none text-white text-center">
            <CardContent className="py-8">
              <h2 className="text-2xl font-heading text-lavpink mb-4">
                Other Ways to Connect
              </h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Prefer other communication channels? Find me on these platforms.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                    href="mailto:prateekmsoa@gmail.com"
                  >
                    <Button
                        className="border-lavpink text-lavpink hover:bg-lavpink hover:text-midblck"
                      >
                        <IoMdMail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                  </a>
                <a href="https://linkedin.com/in/prateekmp/" target="_blank" rel="noopener noreferrer">
                    <Button
                      className="border-lavpink text-lavpink hover:bg-lavpink hover:text-midblck"
                    >
                      <FaLinkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                    </Button>
                </a>

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
