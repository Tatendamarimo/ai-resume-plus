import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileText, Sparkles } from "lucide-react";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = React.useState([]);
  const navigate = useNavigate();

  const fetchAllResumeData = async () => {
    try {
      const resumes = await getAllResumeData();
      setResumeList(resumes.data);
    } catch (error) {
      console.error("Dashboard error:", error.message);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 px-6 pb-6 md:pt-20 md:px-10 md:pb-10 lg:px-16 lg:pb-16 xl:px-24 xl:pb-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Resumes
          </h2>
          <p className="mt-3 text-gray-400 text-lg">
            Craft your next career-winning resume with AI precision
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AddResume />
          </motion.div>

          {/* Cover Letter Generator Card */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => navigate('/cover-letter')}
            className="cursor-pointer group"
          >
            <div className="h-[280px] p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-gray-800 to-gray-900 hover:border-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative p-4 bg-gradient-to-r from-primary to-secondary rounded-full">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 justify-center">
                  Cover Letter Generator
                  <Sparkles className="w-5 h-5 text-secondary" />
                </h3>
                <p className="text-gray-400 mt-2 text-sm">
                  Create AI-powered cover letters instantly
                </p>
              </div>

              <div className="mt-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
                Try Now! →
              </div>
            </div>
          </motion.div>

          {resumeList.map((resume, index) => (
            <motion.div
              key={resume._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 2) * 0.1 }}
            >
              <ResumeCard
                resume={resume}
                refreshData={fetchAllResumeData}
                className="hover:scale-[1.02] transition-transform"
              />
            </motion.div>
          ))}
        </div>

        {resumeList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-gray-400"
          >
            <p className="text-lg">No resumes found. Start by creating a new one!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;