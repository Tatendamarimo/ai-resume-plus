import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { FiMenu, FiX, FiPlus, FiLogOut, FiUser, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function Header({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode === 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl"
          : "bg-gray-900/90 backdrop-blur-lg"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center"
            >
              <span className="text-xl font-bold text-white">R+</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ResumeAI+
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/about">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                About
              </Button>
            </Link>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-300 hover:bg-gray-800 hover:text-white px-5 py-3 rounded-xl border border-gray-700 hover:border-primary transition-all"
                >
                  <FiGrid className="mr-2" />
                  Dashboard
                </Button>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-xl transition-all shadow-xl hover:shadow-primary/40"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <FiPlus className="w-6 h-6" />
                      Create New
                    </span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </motion.div>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="px-5 py-3 rounded-xl flex items-center gap-2 border border-red-400/30 hover:border-red-400/50 bg-red-600/20 hover:bg-red-600/30 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </Button>
                {user.email && (
                  <div className="ml-4 flex items-center gap-3 text-sm text-gray-400 border-l border-gray-800 pl-4">
                    <FiUser className="w-6 h-6 text-primary" />
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {user.email.split("@")[0]}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/auth/sign-in">
                  <Button className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-3 rounded-xl shadow-xl hover:shadow-primary/40 transition-all">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="md:hidden p-3 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-7 w-7 text-gray-300" />
            ) : (
              <FiMenu className="h-7 w-7 text-gray-300" />
            )}
          </motion.button>
        </div>

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden py-6 space-y-4 border-t border-gray-800 mt-4 bg-gray-900/97 backdrop-blur-2xl"
            >
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  fullWidth
                  variant="ghost"
                  className="justify-start px-8 py-5 rounded-xl text-gray-300 hover:bg-gray-800 border border-gray-800 text-lg"
                >
                  About
                </Button>
              </Link>
              {user ? (
                <>
                  <Button
                    fullWidth
                    variant="ghost"
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="justify-start px-8 py-5 rounded-xl text-gray-300 hover:bg-gray-800 border border-gray-800 text-lg"
                  >
                    <FiGrid className="mr-3" />
                    Dashboard
                  </Button>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Button
                      fullWidth
                      onClick={() => {
                        navigate("/dashboard/create");
                        setMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-primary to-secondary justify-start px-8 py-5 rounded-xl shadow-xl text-lg"
                    >
                      <FiPlus className="w-6 h-6 mr-3" />
                      Create New
                    </Button>
                  </motion.div>
                  <Button
                    fullWidth
                    variant="destructive"
                    onClick={handleLogout}
                    className="justify-start px-8 py-5 rounded-xl border border-red-400/30 hover:border-red-400/50 bg-red-600/20 hover:bg-red-600/30 text-lg"
                  >
                    <FiLogOut className="w-6 h-6 mr-3" />
                    Logout
                  </Button>
                  {user.email && (
                    <div className="text-center pt-6">
                      <div className="inline-flex items-center gap-3 text-gray-400">
                        <FiUser className="w-7 h-7 text-primary" />
                        <span className="text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Link to="/auth/sign-in" className="block w-full">
                    <Button fullWidth className="bg-gradient-to-r from-primary to-secondary shadow-xl py-5 text-lg">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Header;