import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaGoogle, FaGithub, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { loginUser, registerUser } from "@/Services/login";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ fullName: "", email: "", password: "" });
    setErrors({});
    setShowPassword(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = (isSignUpForm) => {
    const newErrors = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (isSignUpForm && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (isSignUpForm && formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    
    if (!validateForm(isSignUp)) return;

    setLoading(true);
    try {
      if (isSignUp) {
        await registerUser(formData);
      }
      const user = await loginUser({
        email: formData.email,
        password: formData.password
      });

      if (user?.statusCode === 200) {
        navigate("/");
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-900">
      {/* Visual Section */}
      <div className="relative hidden lg:block overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-96 h-96 rounded-full border-4 border-primary/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-4 border-secondary/20" />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col justify-center p-20">
          <motion.h1 
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isSignUp ? "Join Our Community" : "Welcome Back"}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isSignUp 
              ? "Craft your professional identity with AI-powered tools"
              : "Continue your journey to career success"}
          </motion.p>
        </div>
      </div>

      {/* Auth Section */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-gray-900">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "signin"}
              initial={{ rotateY: isSignUp ? 90 : -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: isSignUp ? -90 : 90, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="transform-style-preserve-3d"
            >
              <div className="backface-hidden">
                <div className="flex justify-between items-center mb-12">
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {isSignUp ? "Create Account" : "Welcome Back"}
                  </motion.h2>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {isSignUp ? (
                      <FaUser className="w-6 h-6 text-primary" />
                    ) : (
                      <FaLock className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="relative"
                    >
                      <input
                        type="text"
                        name="fullName"
                        placeholder=""
                        className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-primary outline-none peer"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                      <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm">
                        Full Name
                      </label>
                      {errors.fullName && (
                        <motion.span 
                          className="absolute right-4 top-4 text-white text-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {errors.fullName}
                        </motion.span>
                      )}
                    </motion.div>
                  )}

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder=""
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-primary outline-none peer"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm">
                      Email Address
                    </label>
                    {errors.email && (
                      <motion.span 
                        className="absolute right-4 top-4 text-red-400 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.email}
                      </motion.span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder=""
                      className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-primary outline-none peer pr-12"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-gray-400 hover:text-primary"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && (
                      <motion.span 
                        className="absolute right-4 top-4 text-red-400 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.password}
                      </motion.span>
                    )}
                  </div>

                  {isSignUp && (
                    <div className="flex gap-2 h-2">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            formData.password.length > i * 3 
                              ? i < 2 ? "bg-secondary" : "bg-primary"
                              : "bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex items-center justify-center gap-2 font-medium transition-all"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        {isSignUp ? "Get Started" : "Continue"}
                        <FaArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  {errors.general && (
                    <motion.div
                      className="p-3 text-center text-red-400 bg-red-400/10 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.general}
                    </motion.div>
                  )}

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-gray-900 text-gray-400 text-sm">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ y: -2 }}
                      type="button"
                      className="flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors"
                    >
                      <FaGoogle className="text-gray-400" />
                      <span className="text-gray-300">Google</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      type="button"
                      className="flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors"
                    >
                      <FaGithub className="text-gray-400" />
                      <span className="text-gray-300">GitHub</span>
                    </motion.button>
                  </div>

                  <p className="text-center text-gray-400">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-primary hover:underline"
                    >
                      {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                  </p>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthPage;