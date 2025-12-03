import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaGoogle, FaGithub, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { loginUser, registerUser } from "@/Services/login";
import { useNavigate } from "react-router-dom";
import PasswordStrengthIndicator from "@/components/custom/PasswordStrengthIndicator";
import { toast } from "@/lib/toast";
import { validatePasswordStrength, validateEmail, validateFullName } from "@/lib/validation";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      acceptTerms: false,
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = (isSignUpForm) => {
    const newErrors = {};

    // Email validation
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (isSignUpForm) {
      const passwordValidation = validatePasswordStrength(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      // Full name validation
      const nameValidation = validateFullName(formData.fullName);
      if (!nameValidation.isValid) {
        newErrors.fullName = nameValidation.error;
      }
    } else {
      // For login, just check password is not empty
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (!validateForm(isSignUp)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(isSignUp ? "Creating your account..." : "Signing you in...");

    try {
      if (isSignUp) {
        await registerUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        toast.dismiss(loadingToast);
        toast.success("Account created successfully! Logging you in...");
      }

      const user = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (user?.statusCode === 200) {
        toast.dismiss(loadingToast);
        toast.success(`Welcome ${isSignUp ? 'aboard' : 'back'}! 🎉`);

        // Store remember me preference
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      toast.dismiss(loadingToast);

      // Handle specific error messages
      const errorMessage = error.message || "Something went wrong";

      if (errorMessage.includes("User not found")) {
        toast.error("No account found with this email");
        setErrors({ email: "Account not found" });
      } else if (errorMessage.includes("Invalid credentials")) {
        toast.error("Incorrect password");
        setErrors({ password: "Incorrect password" });
      } else if (errorMessage.includes("already registered")) {
        toast.error("An account with this email already exists");
        setErrors({ email: "Email already in use" });
      } else if (errorMessage.includes("locked")) {
        toast.error("Account temporarily locked due to too many failed attempts. Please try again later.");
      } else {
        toast.error(errorMessage);
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: "" }));
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

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <input
                        type="text"
                        name="fullName"
                        placeholder=" "
                        className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-700"
                          } focus:border-primary outline-none peer transition-colors`}
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                      <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm">
                        Full Name
                      </label>
                      {errors.fullName && (
                        <motion.p
                          className="text-red-400 text-xs mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {errors.fullName}
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder=" "
                      className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${errors.email ? "border-red-500" : "border-gray-700"
                        } focus:border-primary outline-none peer transition-colors`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm">
                      Email Address
                    </label>
                    {errors.email && (
                      <motion.p
                        className="text-red-400 text-xs mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder=" "
                      className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${errors.password ? "border-red-500" : "border-gray-700"
                        } focus:border-primary outline-none peer pr-12 transition-colors`}
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    {errors.password && (
                      <motion.p
                        className="text-red-400 text-xs mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  {isSignUp && (
                    <>
                      <PasswordStrengthIndicator
                        password={formData.password}
                        showRequirements={true}
                      />

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder=" "
                          className={`w-full px-4 py-3 bg-gray-800 text-white rounded-lg border ${errors.confirmPassword ? "border-red-500" : "border-gray-700"
                            } focus:border-primary outline-none peer pr-12 transition-colors`}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                        <label className="absolute left-4 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:text-sm">
                          Confirm Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-3 text-gray-400 hover:text-primary transition-colors"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmPassword && (
                          <motion.p
                            className="text-red-400 text-xs mt-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {errors.confirmPassword}
                          </motion.p>
                        )}
                      </motion.div>
                    </>
                  )}

                  {/* Remember Me / Forgot Password */}
                  {!isSignUp && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary focus:ring-offset-gray-900"
                        />
                        <span className="text-gray-400">Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => toast.info("Password reset feature coming soon!")}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}


                  {/* Submit Button */}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                      onClick={() => toast.info("Google sign-in coming soon!")}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-700 hover:border-primary/50 transition-colors"
                    >
                      <FaGoogle className="text-gray-400" />
                      <span className="text-gray-300">Google</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      type="button"
                      onClick={() => toast.info("GitHub sign-in coming soon!")}
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
                      className="text-primary hover:underline font-medium"
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