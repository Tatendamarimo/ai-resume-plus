import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { AIChatSession } from "@/Services/AiModel";
import { motion } from "framer-motion";

const formFields = {
  universityName: "",
  degree: "",
  major: "",
  grade: "",
  gradeType: "GPA",
  startDate: "",
  endDate: "",
  description: "",
};

const AI_PROMPT = `Generate a professional education description for a resume based on the following:
Degree: {degree}
Major: {major}
University: {universityName}

Return ONLY a valid JSON object with this structure:
{
  "description": "A 2-3 sentence professional description highlighting relevant coursework, achievements, and skills gained during this education. Make it specific to the degree and major."
}

IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. DO NOT include any inappropriate or unprofessional content.`;

// Content moderation
const BLOCKED_KEYWORDS = [
  'robber', 'thief', 'burglar', 'criminal', 'scammer', 'fraud',
  'sex worker', 'prostitute', 'escort', 'stripper',
  'drug dealer', 'smuggler', 'hitman', 'assassin',
  'hacker', 'terrorist', 'trafficker', 'pimp',
  'killer', 'murderer', 'gangster', 'mafia'
];

const containsInappropriateContent = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return BLOCKED_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

function Education({ resumeInfo, enanbledNext }) {
  const [educationalList, setEducationalList] = useState(
    resumeInfo?.education || [{ ...formFields }]
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({});

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, education: educationalList }));
  }, [educationalList]);

  const AddNewEducation = () => {
    setEducationalList(prev => [...prev, { ...formFields }]);
  };

  const RemoveEducation = () => {
    setEducationalList(prev => prev.slice(0, -1));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setEducationalList(prev => prev.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    ));
  };

  const generateAIDescription = async (index) => {
    const education = educationalList[index];

    // Validation
    if (!education.degree || !education.major) {
      toast.warning("Please fill in Degree and Major first");
      return;
    }

    // Content moderation
    if (containsInappropriateContent(education.degree) ||
      containsInappropriateContent(education.major) ||
      containsInappropriateContent(education.universityName)) {
      toast.error("Please enter professional education details");
      return;
    }

    setAiLoading(prev => ({ ...prev, [index]: true }));

    try {
      const prompt = AI_PROMPT
        .replace("{degree}", education.degree)
        .replace("{major}", education.major)
        .replace("{universityName}", education.universityName || "your university");

      const result = await AIChatSession.sendMessage(prompt);
      let responseText = result.response.text();

      // Parse JSON response
      const parsedResponse = JSON.parse(responseText);

      if (parsedResponse.description) {
        // Final content check
        if (containsInappropriateContent(parsedResponse.description)) {
          toast.error("Generated content is not appropriate. Please try different details.");
          return;
        }

        // Update the description
        setEducationalList(prev => prev.map((item, i) =>
          i === index ? { ...item, description: parsedResponse.description } : item
        ));
        toast.success("Description generated!");
      } else {
        toast.error("Invalid response format");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error(`AI Error: ${error.message}`);
    } finally {
      setAiLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const onSave = async () => {
    if (educationalList.length === 0) {
      return toast.error("Please add at least one education entry");
    }

    setLoading(true);
    try {
      await updateThisResume(resume_id, { data: { education: educationalList } });
      toast.success("Education details saved successfully");
    } catch (error) {
      toast.error(`Save failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl mt-10"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-full" />
        <div>
          <h2 className="text-3xl font-bold text-gray-100">Education History</h2>
          <p className="text-gray-400 mt-1">Add your academic qualifications</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {educationalList.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-3 md:p-4 bg-gray-800 rounded-lg md:rounded-xl border-2 border-gray-700 space-y-3 md:space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* University Name */}
              <div className="col-span-full">
                <label className="block text-xs md:text-sm font-medium text-gray-300">University Name</label>
                <Input
                  name="universityName"
                  value={item.universityName}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              {/* Degree & Major */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300">Degree</label>
                <Input
                  name="degree"
                  value={item.degree}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300">Major</label>
                <Input
                  name="major"
                  value={item.major}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              {/* Dates */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={item.startDate}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              {/* Grade */}
              <div className="col-span-full">
                <label className="block text-xs md:text-sm font-medium text-gray-300">Grade</label>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                  <select
                    name="gradeType"
                    value={item.gradeType}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full md:w-32 bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl px-4 py-2 focus:border-primary"
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Classification">Classification</option>
                  </select>
                  <Input
                    type="text"
                    name="grade"
                    value={item.grade}
                    onChange={(e) => handleChange(e, index)}
                    className="text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg focus:border-primary flex-1"
                  />
                </div>
              </div>

              {/* Description with AI Button */}
              <div className="col-span-full">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs md:text-sm font-medium text-gray-300">Description</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => generateAIDescription(index)}
                    disabled={aiLoading[index]}
                    className="gap-2 border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary text-xs md:text-sm"
                  >
                    {aiLoading[index] ? (
                      <LoaderCircle className="animate-spin h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
                    )}
                    Generate from AI
                  </Button>
                </div>
                <Textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary min-h-[120px]"
                  placeholder="E.g., Completed coursework in Data Structures, Algorithms, and Machine Learning..."
                />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Buttons Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={AddNewEducation}
              className="w-full md:w-auto text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary"
            >
              + Add Education
            </Button>
            <Button
              variant="outline"
              onClick={RemoveEducation}
              className="w-full md:w-auto text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary"
            >
              - Remove
            </Button>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} className="w-full md:w-auto">
            <Button
              onClick={onSave}
              disabled={loading}
              className="w-full md:w-auto text-sm md:text-base px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
            >
              {loading ? (
                <LoaderCircle className="animate-spin mr-2 h-4 w-4 md:h-5 md:w-5" />
              ) : null}
              Save Education
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Education;