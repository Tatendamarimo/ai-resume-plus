import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
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

function Education({ resumeInfo, enanbledNext }) {
  const [educationalList, setEducationalList] = React.useState(
    resumeInfo?.education || [{ ...formFields }]
  );
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

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
      className="p-4 md:p-6 rounded-xl lg:rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg md:shadow-2xl mt-6 md:mt-10"
    >
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="h-8 md:h-12 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-gray-100">Education History</h2>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Add your academic qualifications</p>
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
                  className="text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg focus:border-primary"
                />
              </div>

              {/* Degree & Major */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300">Degree</label>
                <Input
                  name="degree"
                  value={item.degree}
                  onChange={(e) => handleChange(e, index)}
                  className="text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg focus:border-primary"
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300">Major</label>
                <Input
                  name="major"
                  value={item.major}
                  onChange={(e) => handleChange(e, index)}
                  className="text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg focus:border-primary"
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
                  className="text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => handleChange(e, index)}
                  className="text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg focus:border-primary"
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
                    className="w-full md:w-32 text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg px-3 md:px-4 py-2 focus:border-primary"
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="GPA">GPA</option>
                    <option value="Percentage">Percentage</option>
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

              {/* Description */}
              <div className="col-span-full">
                <label className="block text-xs md:text-sm font-medium text-gray-300">Description</label>
                <Textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(e, index)}
                  className="text-sm md:text-base bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-lg focus:border-primary min-h-[100px] md:min-h-[120px]"
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