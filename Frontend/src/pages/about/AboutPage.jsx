import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FiTarget, FiCpu, FiAward, FiArrowRight } from 'react-icons/fi';
import Header from '@/components/custom/Header';
import { useDispatch, useSelector } from 'react-redux';
import { startUser } from '@/Services/login';
import { addUserData } from '@/features/user/userFeatures';

const AboutPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.editUser.userData);

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Header user={user} />

            <div className="pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto mb-20"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Empowering Careers with AI
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                            We believe everyone deserves a resume that truly reflects their potential.
                            AI Resume Plus combines cutting-edge artificial intelligence with professional design
                            to help you land your dream job.
                        </p>
                        <Button
                            onClick={() => navigate('/auth/sign-in')}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 rounded-xl text-lg shadow-xl hover:shadow-primary/40 transition-all"
                        >
                            Build Your Resume Now <FiArrowRight className="ml-2" />
                        </Button>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                    >
                        <motion.div variants={itemVariants} className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors">
                            <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary">
                                <FiCpu className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">AI-Powered Writing</h3>
                            <p className="text-gray-400">
                                Struggling to find the right words? Our advanced AI generates professional summaries,
                                skills, and experience descriptions tailored to your industry.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                                <FiTarget className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">ATS Optimized</h3>
                            <p className="text-gray-400">
                                Beat the bots. Our templates are designed to be easily parsed by Applicant Tracking Systems,
                                ensuring your resume gets into human hands.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-primary/50 transition-colors">
                            <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6 text-pink-400">
                                <FiAward className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Professional Design</h3>
                            <p className="text-gray-400">
                                Stand out from the crowd with sleek, modern templates that look great on screens and paper.
                                Customize colors and fonts to match your personal brand.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Mission Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-8 md:p-16 border border-gray-800 text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
                            "To democratize access to professional career tools. We're building a future where
                            technology bridges the gap between talent and opportunity, making the job search
                            process fairer, faster, and more effective for everyone."
                        </p>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default AboutPage;
