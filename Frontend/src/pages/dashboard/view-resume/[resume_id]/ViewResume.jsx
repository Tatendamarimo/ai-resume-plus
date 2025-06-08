import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";

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

  const HandleDownload = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
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
              
              <RWebShare
                data={{
                  text: "Check out my professional resume",
                  url: `${import.meta.env.VITE_BASE_URL}/dashboard/view-resume/${resume_id}`,
                  title: "My AI-Generated Resume",
                }}
                onClick={() => toast.success("Resume shared successfully!")}
              >
                <Button 
                  variant="outline"
                  className="w-full md:w-auto px-8 py-3 border-primary text-primary hover:bg-primary/10"
                >
                  Share Resume
                </Button>
              </RWebShare>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 pb-8 md:pb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none border border-gray-200 print:border-0">
          <div className="p-4 md:p-8 print:p-0" style={{ minHeight: '297mm' }}>
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewResume;