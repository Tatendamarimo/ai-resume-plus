import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { AIChatSession } from "@/Services/AiModel";
import { getResumeData } from "@/Services/resumeAPI";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function InterviewPrep() {
    const { resume_id } = useParams();
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [openAnswer, setOpenAnswer] = useState(null);

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

    const generateQuestions = async () => {
        setLoading(true);
        try {
            const prompt = `
      Role: Senior Interviewer.
      Task: Generate 5 interview questions based on the following Resume JSON.
      
      Resume: ${JSON.stringify(resumeData)}
      
      Output JSON ONLY:
      [
        {
          "question": "string",
          "type": "Technical" | "Behavioral" | "Situational",
          "suggestedAnswer": "string (STAR format)"
        }
      ]
    `;
            /*
            const result = await AIChatSession.sendMessage(prompt);
            const responseText = result.response.text();
            const parsedResult = JSON.parse(responseText);
            setQuestions(parsedResult);
            */
            // console.log("Simulating AI call...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            setQuestions([
                {
                    question: "Test Question?",
                    type: "Technical",
                    suggestedAnswer: "Test Answer"
                }
            ]);
        } catch (error) {
            toast.error("AI Generation failed. Please try again.");
            console.error("Error generating questions:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 md:px-20 lg:px-32">
            <h2 className="font-bold text-3xl text-gray-100">AI Interview Prep</h2>
            <p className="text-gray-400">Practice with questions tailored to your specific resume and experience.</p>

            <div className="my-20 flex flex-col items-center justify-center text-center">
                <div className="p-10 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl max-w-2xl w-full">
                    <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lightbulb className="w-10 h-10 text-secondary animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-100 mb-4">Coming Soon!</h3>
                    <p className="text-gray-400 text-lg mb-8">
                        We are building an intelligent interview preparation tool to help you ace your next interview.
                        Check back soon!
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

export default InterviewPrep;
