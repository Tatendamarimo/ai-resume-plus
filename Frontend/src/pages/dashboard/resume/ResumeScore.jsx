import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { AIChatSession } from "@/Services/AiModel";
import { getResumeData } from "@/Services/resumeAPI";
import { motion } from "framer-motion";
import { toast } from "sonner";

function ResumeScore() {
    const { resume_id } = useParams();
    const [resumeData, setResumeData] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [scoreResult, setScoreResult] = useState(null);

    useEffect(() => {
        GetResumeInfo();
    }, []);

    const GetResumeInfo = async () => {
        try {
            const result = await getResumeData(resume_id);
            setResumeData(result.data.data);
        } catch (error) {
            // console.log(error);
        }
    };

    const calculateScore = async () => {
        if (!jobDescription) {
            toast.warning("Please add a job description");
            return;
        }
        setLoading(true);

        const prompt = `
      Role: ATS Expert.
      Task: Analyze the following Resume JSON against the Job Description.
      
      Resume: ${JSON.stringify(resumeData)}
      
      Job Description: ${jobDescription}
      
      Output JSON ONLY:
      {
        "score": number (0-100),
        "matchLevel": "High" | "Medium" | "Low",
        "missingKeywords": ["string"],
        "tips": ["string"]
      }
    `;

        try {
            const result = await AIChatSession.sendMessage(prompt);
            const responseText = result.response.text();
            const parsedResult = JSON.parse(responseText);
            setScoreResult(parsedResult);
        } catch (error) {
            toast.error("AI Analysis failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 md:px-20 lg:px-32">
            <h2 className="font-bold text-3xl text-gray-100">AI Resume Score & ATS Checker</h2>
            <p className="text-gray-400">Analyze your resume against a job description to check ATS compatibility.</p>

            <div className="my-20 flex flex-col items-center justify-center text-center">
                <div className="p-10 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl max-w-2xl w-full">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LoaderCircle className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-100 mb-4">Coming Soon!</h3>
                    <p className="text-gray-400 text-lg mb-8">
                        We are working hard to bring you the best AI-powered resume scoring and ATS checking experience.
                        Stay tuned for updates!
                    </p>
                    <Button
                        onClick={() => window.history.back()}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-100"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ResumeScore;
