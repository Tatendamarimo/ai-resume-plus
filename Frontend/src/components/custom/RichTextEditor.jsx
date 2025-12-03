import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "@/Services/AiModel";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";

const PROMPT = `Create a JSON object with the following fields:
    "position_Title": A string representing the job title.
    "experience": An array of strings, each representing a bullet point describing relevant experience for the given job title in html format.
For the Job Title "{positionTitle}", create a JSON object with the following fields:
The experience array should contain 5-7 bullet points. Each bullet point should be a concise description of a relevant skill, responsibility, or achievement.
IMPORTANT: Return ONLY valid JSON without any markdown formatting or code blocks. Only generate professional, legal, and ethical job descriptions.`;

// Content moderation - block inappropriate job titles
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

// Function to filter out sensitive information
const filterSensitiveInfo = (text) => {
  if (!text) return text;
  
  // Remove API keys patterns
  let filtered = text.replace(/[A-Za-z0-9_-]{30,}/g, '[REDACTED]');
  
  // Remove common API key prefixes
  filtered = filtered.replace(/sk-[A-Za-z0-9_-]+/gi, '[API_KEY_REDACTED]');
  filtered = filtered.replace(/AIza[A-Za-z0-9_-]+/gi, '[API_KEY_REDACTED]');
  filtered = filtered.replace(/gsk_[A-Za-z0-9_-]+/gi, '[API_KEY_REDACTED]');
  
  // Remove JWT tokens
  filtered = filtered.replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[TOKEN_REDACTED]');
  
  return filtered;
};

function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.experience[index]?.workSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    const jobTitle = resumeInfo?.experience[index]?.title;
    
    if (!jobTitle) {
      toast.warning("Please Add Position Title");
      return;
    }
    
    // Check for inappropriate content BEFORE making API call
    if (containsInappropriateContent(jobTitle)) {
      toast.error("Please enter a professional job title");
      return;
    }
    
    setLoading(true);
    try {
      const prompt = PROMPT.replace("{positionTitle}", jobTitle);
      
      const result = await AIChatSession.sendMessage(prompt);
      let responseText = result.response.text();
      
      // Clean up markdown formatting
      responseText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      // Filter sensitive information
      responseText = filterSensitiveInfo(responseText);
      
      // Check response for inappropriate content
      if (containsInappropriateContent(responseText)) {
        toast.error("Generated content is not appropriate. Please try a different job title.");
        setLoading(false);
        return;
      }
      
      console.log("Cleaned and filtered response:", responseText);
      
      const resp = JSON.parse(responseText);
      
      // Join the experience bullets and filter again
      let experienceHTML = resp.experience 
        ? resp.experience.join("") 
        : resp.experience_bullets?.join("") || "";
      
      experienceHTML = filterSensitiveInfo(experienceHTML);
      
      // Final check on the HTML content
      if (containsInappropriateContent(experienceHTML)) {
        toast.error("Generated content is not appropriate. Please try a different job title.");
        setLoading(false);
        return;
      }
      
      if (experienceHTML) {
        setValue(experienceHTML);
        toast.success("AI suggestions generated!");
      } else {
        toast.error("No experience data generated");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error(`AI Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e.target.value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;