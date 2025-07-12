import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Target, Lightbulb, Rocket, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutAegis() {

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const navigate = useNavigate();

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

      <main className="flex-1 max-w-5xl w-full h-full mx-auto px-2 md:px-0 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-heading text-midblck">
              About Aegis
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Born from necessity, crafted with innovation. Your digital warranty guardian.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-midblu border-none text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-raspink">
                  <Lightbulb className="h-6 w-6" />
                  The Genesis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Necessity breeds innovation. Tired of losing warranties, forgetting expiry dates, 
                  and scrambling through paperwork when devices fail, Aegis was born from a simple 
                  frustration shared by millions.
                </p>
                <p>
                  We believed there had to be a better way to manage the digital chaos of modern 
                  warranty documents.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-lavpink border-none text-midblck">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To transform warranty management from a source of stress into a seamless, 
                  intelligent experience. We empower users to never lose another warranty, 
                  miss another deadline, or struggle with paperwork again.
                </p>
                <p>
                  Every feature is designed with one goal: making your life easier.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-perspink border-none text-midblck">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A world where warranty anxiety is extinct. Where every consumer feels 
                  confident and protected, knowing their purchases are safeguarded by 
                  intelligent, proactive technology.
                </p>
                <p>
                  We envision Aegis as the universal standard for warranty protection 
                  and consumer peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-raspink border-none text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Rocket className="h-6 w-6" />
                  Future Prospects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We're just getting started. Our roadmap includes AI-powered warranty 
                  optimization, direct integration with retailers, automated claim filing, 
                  and predictive maintenance alerts.
                </p>
                <p>
                  The future of warranty management is intelligent, proactive, and 
                  completely stress-free.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-midblck border-none text-white text-center">
            <CardContent className="py-8">
              <h2 className="text-2xl font-heading text-lavpink mb-4">
                Join the Revolution
              </h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                Experience the future of warranty management. Upload your first document 
                and discover how Aegis transforms chaos into clarity.
              </p>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-raspink hover:bg-magpink text-white font-heading text-lg px-8 py-3"
              >
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
