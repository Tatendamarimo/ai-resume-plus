import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Loader2 } from "lucide-react";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getResumeData(resume_id)
      .then((data) => {
        dispatch(addResumeData(data.data));
      })
      .finally(() => setLoading(false));
  }, [resume_id, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 lg:p-12">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 h-full"
        >
          {/* Dark Theme Form Section */}
          <motion.div
            className="rounded-2xl bg-gray-900/50 backdrop-blur-lg border border-gray-700 shadow-2xl p-6 md:p-8"
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Edit Resume
              </h2>
              <p className="text-gray-400 mt-2">
                Modify your professional details
              </p>
            </div>
            <ResumeForm />
          </motion.div>

          {/* White Theme Preview Section */}
          <motion.div
            className="rounded-2xl bg-white border border-gray-200 shadow-2xl p-6 md:p-8"
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Live Preview
              </h2>
              <p className="text-black mt-2">
                Real-time updates as you edit
              </p>
            </div>
            <PreviewPage />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default EditResume;