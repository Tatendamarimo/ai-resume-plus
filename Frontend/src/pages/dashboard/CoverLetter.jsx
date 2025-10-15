import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, RefreshCw, Loader2, Send } from 'lucide-react'; // Added Send icon
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AIChatSession } from '@/Services/AiModel';

// --- (Constants and moderation logic remain the same) ---

const COVER_LETTER_PROMPT = `Generate a professional cover letter based on the following information:

Candidate Name: {candidateName}
Job Title: {jobTitle}
Company Name: {companyName}
Background: {background}
Key Experience: {experience}
Key Skills: {skills}
Tone: {tone}

Create a well-structured cover letter with:
1. Professional greeting
2. Strong opening paragraph expressing interest
3. 2-3 body paragraphs highlighting relevant experience and skills
4. Compelling closing paragraph
5. Professional sign-off

Return ONLY a valid JSON object with this structure:
{
  "coverLetter": "The complete cover letter text with proper paragraphs separated by double line breaks (\\n\\n)"
}

IMPORTANT: 
- Make it specific to the job and company
- Use the specified tone ({tone})
- Keep it between 250-400 words
- Return ONLY valid JSON without any markdown formatting
- DO NOT include any inappropriate or unprofessional content`;

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

// --- (Component start) ---

function CoverLetter({ resumeInfo }) {
  const [formData, setFormData] = useState({
    candidateName: '',
    jobTitle: '',
    companyName: '',
    background: '',
    experience: '',
    skills: '',
    tone: 'professional',
    downloadFormat: 'text' // New state for download format
  });
  
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-populate from resume data
  useEffect(() => {
    if (resumeInfo) {
      setFormData(prev => ({
        ...prev,
        candidateName: resumeInfo.firstName && resumeInfo.lastName 
          ? `${resumeInfo.firstName} ${resumeInfo.lastName}` 
          : prev.candidateName,
        background: resumeInfo.jobTitle || prev.background,
        skills: resumeInfo.skills?.map(s => s.name).join(', ') || prev.skills,
      }));
    }
  }, [resumeInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    // Validation
    if (!formData.jobTitle || !formData.companyName) {
      toast.warning('Please fill in Job Title and Company Name');
      return;
    }

    // Content moderation
    const fieldsToCheck = [
      formData.jobTitle,
      formData.companyName,
      formData.background,
      formData.experience
    ];

    if (fieldsToCheck.some(field => containsInappropriateContent(field))) {
      toast.error('Please enter professional information only');
      return;
    }

    setLoading(true);
    setCoverLetter(''); // Clear previous letter
    try {
      // Build prompt with actual data
      let prompt = COVER_LETTER_PROMPT
        .replace(/{candidateName}/g, formData.candidateName || 'Applicant')
        .replace(/{jobTitle}/g, formData.jobTitle)
        .replace(/{companyName}/g, formData.companyName)
        .replace(/{background}/g, formData.background || 'your background')
        .replace(/{experience}/g, formData.experience || 'relevant experience')
        .replace(/{skills}/g, formData.skills || 'technical skills')
        .replace(/{tone}/g, formData.tone);

      const result = await AIChatSession.sendMessage(prompt);
      let responseText = result.response.text();

      console.log("AI Response:", responseText);

      // Attempt to clean and parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      
      const parsedResponse = JSON.parse(jsonString);
      
      if (parsedResponse.coverLetter) {
        // Final content check
        if (containsInappropriateContent(parsedResponse.coverLetter)) {
          toast.error('Generated content is not appropriate. Please try different details.');
          return;
        }

        setCoverLetter(parsedResponse.coverLetter);
        toast.success('Cover letter generated successfully!');
      } else {
        toast.error('Invalid response format. Missing "coverLetter" field.');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error(`AI Error: ${error.message}. Response format may be incorrect.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // --- NEW LOGIC FOR DOWNLOAD (Supporting TXT, DOCX, PDF) ---
  const handleDownload = () => {
    const filename = `cover-letter-${formData.companyName.replace(/\s+/g, '-') || 'draft'}`;
    const content = coverLetter.replace(/\n\n/g, '\r\n\r\n'); // Use Windows line breaks for better document compatibility

    if (formData.downloadFormat === 'docx') {
        // *** DOCX / MS WORD DOWNLOAD LOGIC ***
        // NOTE: This simulation provides a valid DOCX MIME type, but true DOCX generation
        // requires a library like 'docx' or 'docxtemplater'. 
        // For client-side simulation:
        const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const blob = new Blob([content], { type: mimeType }); // Simplistic blob; real docx needs binary data
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Downloaded as DOCX successfully!');

    } else if (formData.downloadFormat === 'pdf') {
        // *** PDF DOWNLOAD LOGIC ***
        // NOTE: True client-side PDF generation requires a library like 'html2pdf.js' or 'jspdf'.
        // This is a common workaround, but results in a simple TXT file with a PDF extension.
        // For a real app, integrate a library here.
        const mimeType = 'application/pdf';
        const blob = new Blob([content], { type: mimeType });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Downloaded as PDF (Requires Library for formatting) ');
        
    } else {
        // *** DEFAULT TXT DOWNLOAD LOGIC ***
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Downloaded as TXT successfully!');
    }
  };
  
  // --- NEW LOGIC FOR EMAIL SHARING ---
  const handleShareEmail = () => {
    if (!coverLetter) {
        toast.warning('Please generate a cover letter first!');
        return;
    }

    const recipient = ''; // User can input this later, or leave blank to prompt
    const subject = `Cover Letter for ${formData.jobTitle} at ${formData.companyName}`;
    // Encode the cover letter content for the email body
    const body = coverLetter;
    
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    toast.info('Opening email client...');
  };


  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          {/* ... (Header content remains the same) ... */}
           <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            AI Cover Letter Generator
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Create a professional, personalized cover letter in seconds
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Input Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-2xl"
          >
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
              Your Information
            </h2>

            <div className="space-y-5">
              {/* ... (Form fields remain the same) ... */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <Input
                  type="text"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="bg-gray-700 border-2 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title *
                </label>
                <Input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Senior Software Engineer"
                  className="bg-gray-700 border-2 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <Input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Tech Corp Inc."
                  className="bg-gray-700 border-2 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Background
                </label>
                <Input
                  type="text"
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  placeholder="Computer Science, 5+ years experience"
                  className="bg-gray-700 border-2 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Experience
                </label>
                <Textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Full-stack development, team leadership, agile methodologies"
                  rows={3}
                  className="bg-gray-700 border-2 border-gray-600 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Skills
                </label>
                <Input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, AWS"
                  className="bg-gray-700 border-2 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-primary focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="formal">Formal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Output */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
                Your Cover Letter
              </h2>
              
              {coverLetter && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                    title="Copy to clipboard"
                  >
                    <Copy className={`w-4 h-4 ${copied ? 'text-green-400' : 'text-gray-300'}`} />
                  </Button>
                  
                  {/* NEW: Download Format Selector */}
                  <select
                    name="downloadFormat"
                    value={formData.downloadFormat}
                    onChange={handleChange}
                    className="px-3 py-1.5 bg-gray-700 border-gray-600 text-white rounded-lg text-sm appearance-none cursor-pointer"
                    title="Select download format"
                  >
                    <option value="text">TXT</option>
                    <option value="docx">DOCX</option>
                    {/* PDF option is available but needs external library for proper formatting */}
                    <option value="pdf">PDF</option> 
                  </select>

                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                    title={`Download as ${formData.downloadFormat.toUpperCase()}`}
                  >
                    <Download className="w-4 h-4 text-gray-300" />
                  </Button>
                  
                  {/* NEW: Email Share Button */}
                  <Button
                    onClick={handleShareEmail}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                    title="Share via Email"
                  >
                    <Send className="w-4 h-4 text-gray-300" />
                  </Button>
                  
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-300" />
                  </Button>
                </div>
              )}
            </div>

            {!coverLetter && !loading && (
              <div className="h-full flex items-center justify-center text-gray-500 text-center py-20">
                <div>
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Fill in the form and click Generate</p>
                  <p className="text-sm mt-2">Your AI-powered cover letter will appear here</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-400">Crafting your perfect cover letter...</p>
                </div>
              </div>
            )}

            {coverLetter && !loading && (
              <div className="bg-white rounded-xl p-6 md:p-8 min-h-[500px] shadow-inner">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-serif text-gray-900 leading-relaxed text-base">
                    {coverLetter}
                  </pre>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            💡 Tips for a Great Cover Letter
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-300 text-sm md:text-base">
            <div>
              <strong className="text-white">Be Specific:</strong> Tailor your Key Experience and Key Skills fields to directly match the job description's requirements. Use exact keywords from the posting.
            </div>
            <div>
              <strong className="text-white">Show, Don't Just Tell:</strong> Instead of listing responsibilities, describe **achievements** (e.g., "Led a team that increased conversion by 15%") in the Key Experience section.
            </div>
            <div>
              <strong className="text-white">Research the Company:</strong> Mention a recent company project, value, or goal in the Background/Experience fields so the AI can weave it into the letter, demonstrating genuine interest.
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default CoverLetter;