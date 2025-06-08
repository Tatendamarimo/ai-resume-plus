import Header from "@/components/custom/Header";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaGithub, 
  FaMagic, 
  FaRocket, 
  FaShieldAlt,
  FaRegChartBar,
  FaCloudDownloadAlt
} from "react-icons/fa";
import { 
  FiCheckCircle, 
  FiEdit3, 
  FiDownload, 
  FiCode,
  FiZap
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleExternalLink = () => {
    window.open("");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await startUser();
        response.statusCode === 200 
          ? dispatch(addUserData(response.data))
          : dispatch(addUserData(null));
      } catch (error) {
        console.error("Auth error:", error.message);
        dispatch(addUserData(null));
      }
    };
    fetchUser();
  }, [dispatch]);

  const handleAuthRedirect = () => {
    user ? navigate("/dashboard") : navigate("/auth/sign-in");
  };

  return (
    <>
      <Header user={user} />
      
      {/* Cyberpunk-style Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20 bg-grid-white/5 [mask-image:linear-gradient(transparent,black)]">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </div>

        <div className="relative px-6 mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <span className="block mb-4">AI-Powered</span>
              <span className="block typewriter-effect">Resume+</span>
            </h1>
            
            <p className="max-w-3xl mx-auto mt-8 text-xl text-gray-300">
               Our AI handles the heavy lifting while you focus on storytelling
            </p>

            <div className="flex flex-col gap-4 mt-12 sm:flex-row sm:justify-center">
              <Button
                size="xl"
                onClick={handleAuthRedirect}
                className="group gap-3 transition-all hover:scale-105 bg-gradient-to-r from-primary to-secondary"
              >
                <FiZap className="w-6 h-6 transition-transform group-hover:rotate-12" />
                Get Started
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                className="gap-3 border-2 border-primary/50 bg-background/20 backdrop-blur-sm hover:border-primary"
              >
                <FaCloudDownloadAlt className="w-6 h-6 text-primary" />
                See Examples
              </Button>
            </div>
          </div>

          {/* Holographic Feature Cards */}
          <div className="grid gap-6 mt-24 md:grid-cols-3">
            {[
              {
                icon: <FaMagic className="w-8 h-8" />,
                title: "Neural Optimization",
                desc: "Our intuitive process makes resume building simple and effective"
              },
              {
                icon: <FaRegChartBar className="w-8 h-8" />,
                title: "Real-Time Analytics",
                desc: "Live ATS score tracking & improvements"
              },
              {
                icon: <FaShieldAlt className="w-8 h-8" />,
                title: "Privacy First",
                desc: "End-to-end encrypted resume processing"
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="relative p-8 overflow-hidden rounded-2xl bg-background/10 backdrop-blur-lg border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="mb-6 text-primary">{feature.icon}</div>
                  <h3 className="mb-2 text-2xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 bg-gray-900">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold md:text-5xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Interactive Builder Preview
            </h2>
            <p className="mt-6 text-xl text-gray-400">
              Experience the future of resume building with our real-time AI editor
            </p>
          </div>

          {/* 3D Card Effect Container */}
          <div className="relative mt-16 group perspective-1000">
            <div className="relative preserve-3d group-hover:rotate-x-12 group-hover:rotate-y-12 transition-transform duration-500">
              <div className="p-1 bg-gradient-to-br from-primary to-secondary rounded-2xl">
                <div className="p-8 bg-gray-900 rounded-xl">
                  <div className="flex gap-6">
                    {/* Left Panel */}
                    <div className="flex-1 space-y-6 text-left">
                      <div className="h-12 bg-gray-800 rounded-lg animate-pulse" />
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-800 rounded-full w-3/4" />
                        <div className="h-4 bg-gray-800 rounded-full w-1/2" />
                      </div>
                      <div className="grid gap-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-6 bg-gray-800 rounded-full" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Right Panel */}
                    <div className="flex-1 border-l border-gray-800 pl-6">
                      <div className="mb-6 h-9 bg-gray-800 rounded-lg w-2/3" />
                      <div className="space-y-4">
                        <div className="h-24 bg-gray-800 rounded-lg" />
                        <div className="h-24 bg-gray-800 rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glowing Footer */}
      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="px-6 py-12 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resume</h3>
              <p className="text-gray-400">
                Next-generation resume optimization powered by AI
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" onClick={handleExternalLink}>
                  <FaGithub className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {[
              { title: "Product", links: ["Features", "Templates", "API", "Pricing"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security"] }
            ].map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Button variant="link" className="text-gray-400 hover:text-primary">
                        {link}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 mt-12 border-t border-gray-800">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-center text-gray-400">
                © 2025 AIResume+ All rights reserved.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Button variant="link" className="text-gray-400 hover:text-primary">
                  Privacy Policy
                </Button>
                <Button variant="link" className="text-gray-400 hover:text-primary">
                  Terms of Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;