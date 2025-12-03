import React, { useState, useEffect } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion } from "framer-motion";

const PROMPT_TEMPLATE =
  "Job Title: {jobTitle}. Generate 3 professional summaries for different experience levels (Mid-Level, Senior, and Fresher) in 3-4 lines each. Format as JSON array with 'summary' and 'experience_level' fields.";

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGeneratedSuggestions, setAiGeneratedSuggestions] = useState(null);
  const { resume_id } = useParams();

  useEffect(() => {
    setSummary(resumeInfo?.summary || "");
  }, [resumeInfo?.summary]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    enanbledNext(false);
    enanbledPrev(false);
    setSummary(newValue);
    dispatch(addResumeData({ ...resumeInfo, summary: newValue }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!resume_id || loading) return;

    setLoading(true);
    try {
      await updateThisResume(resume_id, { data: { summary } });
      toast.success("Summary saved successfully");
      enanbledNext(true);
    } catch (error) {
      toast.error(`Save failed: ${error.message}`);
    } finally {
      setLoading(false);
      enanbledPrev(true);
    }
  };

  const generateAISummary = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.warning("Please add job title first");
      return;
    }

    setLoading(true);
    try {
      const prompt = PROMPT_TEMPLATE.replace("{jobTitle}", resumeInfo.jobTitle);
      const response = await AIChatSession.sendMessage(prompt);
      const suggestions = JSON.parse(response.response.text());

      if (Array.isArray(suggestions)) {
        setAiGeneratedSuggestions(suggestions);
        toast.success("Suggestions generated");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      toast.error(`AI Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    enanbledNext(false);
    enanbledPrev(false);
    setSummary(suggestion.summary);
    dispatch(addResumeData({ ...resumeInfo, summary: suggestion.summary }));
    toast.success("Summary updated");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl"
    >
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-full" />
        <div>
          <h2 className="text-3xl font-bold text-gray-100">
            Professional Summary
          </h2>
          <p className="text-gray-400 mt-1">
            Craft your career narrative
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <label className="block text-sm md:text-base font-medium text-gray-300">
              Career Summary
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={generateAISummary}
              size="sm"
              className="w-full md:w-auto gap-2 border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary hover:text-primary-foreground"
              disabled={loading}
            >
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm md:text-base">Generate AI Suggestions</span>
            </Button>
          </div>

          <Textarea
            name="summary"
            value={summary}
            onChange={handleInputChange}
            className="min-h-[150px] bg-gray-700 border-2 border-gray-600 focus:border-primary focus:ring-0 text-gray-100 rounded-xl transition-all hover:border-primary/50"
            placeholder="Example: Seasoned full-stack developer with 5+ years experience in agile environments..."
            required
          />
        </div>

        {/* Save Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="pt-4 md:pt-6 border-t border-gray-700"
        >
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-lg md:rounded-xl font-medium shadow-lg hover:shadow-primary/30"
          >
            {loading ? (
              <LoaderCircle className="animate-spin mr-2 w-5 h-5 md:w-6 md:h-6" />
            ) : null}
            Save Summary
          </Button>
        </motion.div>
      </form>

      {/* AI Suggestions */}
      {aiGeneratedSuggestions && (
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-700 space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-100">
            AI Suggestions
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {aiGeneratedSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-800 border-2 border-gray-700 hover:border-primary/50 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-1 md:mb-2">
                  <span className="text-xs md:text-sm font-medium text-secondary">
                    {suggestion.experience_level}
                  </span>
                </div>
                <p className="text-gray-300 text-sm md:text-base">
                  {suggestion.summary}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Summary;