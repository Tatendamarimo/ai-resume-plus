import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = React.useState({});
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchResumeInfo();
  }, []);

  const fetchResumeInfo = async () => {
    const response = await getResumeData(resume_id);
    dispatch(addResumeData(response.data));
  };

  // Download PDF (auto-scaled, multi-page)
  const HandleDownload = () => {
    const element = document.getElementById("resumePrint");

    const options = {
      margin: 10,
      filename: `Resume_${resume_id}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, logging: false, scrollY: -window.scrollY },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };

    html2pdf().set(options).from(element).save();
  };

  // Share PDF or fallback to URL
  const HandleShare = async () => {
    const element = document.getElementById("resumePrint");

    try {
      // Generate PDF as Blob
      const pdfBlob = await html2pdf().from(element).outputPdf('blob');
      const file = new File([pdfBlob], `Resume_${resume_id}.pdf`, { type: "application/pdf" });

      // Check if file sharing is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My AI-Generated Resume",
          text: "Check out my professional resume",
        });
        toast.success("Resume shared successfully!");
      } else {
        // Fallback to sharing URL
        await navigator.share({
          title: "My AI-Generated Resume",
          text: "Check out my professional resume",
          url: `${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`,
        });
        toast.success("Resume link shared successfully!");
      }
    } catch (err) {
      console.error("Share failed", err);
      toast.error("Sharing is not supported on this device/browser.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Header section (hidden in PDF) */}
      <div id="noPrint" className="w-full">
        <div className="px-4 py-8 md:py-12 lg:py-16 max-w-4xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your AI Resume is Ready!
            </h2>
            <p className="text-gray-600 md:text-lg">
              Download or share your professionally crafted resume
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-6 md:mt-10">
              <Button
                onClick={HandleDownload}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                Download PDF
              </Button>

              <Button
                variant="outline"
                className="w-full md:w-auto px-8 py-3 border-primary text-primary hover:bg-primary/10"
                onClick={HandleShare}
              >
                Share Resume
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume content (only this appears in PDF) */}
      <div className="w-full max-w-7xl px-4 pb-8 md:pb-12">
        <div
          id="resumePrint"
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
          style={{ minHeight: '297mm' }}
        >
          <div className="p-4 md:p-8">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewResume;
