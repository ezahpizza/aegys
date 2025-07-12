import { motion } from "framer-motion";
import { Code, Heart, Target} from "lucide-react";
import { FaBehance, FaLinkedin, FaGithub } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutDeveloper() {
  const navigate = useNavigate();

  const skills = [
    "React", "FastAPI", "UI/UX Design", "Machine Learning",
    "Database Design", "Full-Stack Development", "Data Science", "User-Centered Design"
  ];

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
            <Code className="h-4 w-4 mr-2" />
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
              Meet the Creator
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Passionate developer crafting solutions for real-world problems
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-midblu border-none text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-raspink">
                  <Code className="h-6 w-6" />
                  The Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  As a full-stack developer with a passion for solving real-world problems, 
                  I've always believed that the best applications are born from personal 
                  frustrations and genuine needs.
                </p>
                <p>
                  Aegys represents my commitment to creating technology that actually 
                  improves people's lives, not just adds to the digital noise.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-lavpink border-none text-midblck">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="h-6 w-6" />
                  My Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To bridge the gap between complex technology and simple, intuitive 
                  user experiences. I believe powerful software should feel effortless 
                  and delightful to use.
                </p>
                <p>
                  Every line of code I write is guided by empathy for the end user 
                  and a commitment to elegant solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-perspink border-none text-midblck">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  My Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To create a portfolio of applications that genuinely improve people's 
                  daily lives. Technology should be a helpful companion, not a source 
                  of frustration.
                </p>
                <p>
                  I envision a future where software is so intuitive and helpful that 
                  it becomes invisible - just working seamlessly in the background.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-raspink border-none text-white">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-midblu/40 rounded-md px-3 py-2 text-sm text-center">
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-midblck border-none text-white text-center">
            <CardContent className="py-8">
              <h2 className="text-2xl font-heading text-lavpink mb-4">
                Let's Connect
              </h2>
              <p className="text-lg mb-6 max-w-2xl mx-auto">
                I'm always interested in collaborating on meaningful projects 
                and connecting with fellow creators and innovators.
              </p>
              <div className="flex flex-wrap justify-center gap-4">

                 <a
                    href="mailto:prateekmsoa@gmail.com"
                    className="inline-flex items-center px-4 py-2 bg-lavpink hover:bg-perspink text-midblck font-heading rounded"
                  >
                    <IoMdMail className="h-4 w-4 mr-2" />
                    Email
                  </a>

                  <a href="https://github.com/ezahpizza" target="_blank" rel="noopener noreferrer">
                        <Button
                          className="bg-perspink hover:bg-lavpink text-midblck font-heading"
                        >
                          <FaGithub className="h-4 w-4 mr-2" />
                          GitHub
                        </Button>
                   </a>
                    
                  <a href="https://www.behance.net/prateekmohapat" target="_blank" rel="noopener noreferrer">
                      <Button
                        className="bg-magpink hover:bg-raspink text-white font-heading"
                      >
                        <FaBehance className="h-4 w-4 mr-2" />
                            Behance
                      </Button>
                  </a>

                  <a href="https://linkedin.com/in/prateekmp/" target="_blank" rel="noopener noreferrer">
                      <Button
                        className="bg-raspink hover:bg-magpink text-white font-heading"
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
