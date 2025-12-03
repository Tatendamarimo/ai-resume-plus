import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/custom/RichTextEditor";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { motion } from "framer-motion";

const formFields = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: "",
  workSummary: "",
};

function Experience({ resumeInfo, enanbledNext, enanbledPrev }) {
  const [experienceList, setExperienceList] = React.useState(
    resumeInfo?.experience || []
  );
  const [loading, setLoading] = React.useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, experience: experienceList }));
  }, [experienceList]);

  const addExperience = () => {
    setExperienceList(prev => [...prev, formFields]);
  };

  const removeExperience = (index) => {
    setExperienceList(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e, index) => {
    enanbledNext(false);
    enanbledPrev(false);
    const { name, value } = e.target;
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...experienceList];
    list[index] = { ...list[index], [name]: value };
    setExperienceList(list);
  };

  const onSave = async () => {
    setLoading(true);
    try {
      await updateThisResume(resume_id, { data: { experience: experienceList } });
      toast.success("Experience saved successfully");
      enanbledNext(true);
      enanbledPrev(true);
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
          <h2 className="text-3xl font-bold text-gray-100">Work Experience</h2>
          <p className="text-gray-400 mt-1">Your professional journey</p>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {experienceList?.map((experience, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-3 md:p-4 bg-gray-800 rounded-lg md:rounded-xl border-2 border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-100">
                Experience {index + 1}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExperience(index)}
                className="text-red-500 border-red-500/40 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-gray-300">Position Title</label>
                <Input
                  name="title"
                  value={experience?.title}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-gray-300">Company Name</label>
                <Input
                  name="companyName"
                  value={experience?.companyName}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-gray-300">City</label>
                <Input
                  name="city"
                  value={experience?.city}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-gray-300">Country</label>
                <Input
                  name="state"
                  value={experience?.state}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-gray-300">Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={experience?.startDate}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs md:text-sm font-medium text-gray-300">End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  value={experience?.endDate}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                />
              </div>

              <div className="col-span-full space-y-2">
                <RichTextEditor
                  index={index}
                  defaultValue={experience?.workSummary}
                  onRichTextEditorChange={(value) =>
                    handleRichTextEditor(value, "workSummary", index)
                  }
                  resumeInfo={resumeInfo}
                />
              </div>
            </div>
          </motion.div>
        ))}

        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-700">
          <Button
            onClick={addExperience}
            variant="outline"
            className="w-full md:w-auto text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary"
          >
            + Add Experience
          </Button>

          <motion.div whileHover={{ scale: 1.02 }} className="w-full md:w-auto">
            <Button
              onClick={onSave}
              disabled={loading}
              className="w-full md:w-auto text-sm md:text-base px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-lg md:rounded-xl font-medium shadow-lg hover:shadow-primary/30"
            >
              {loading ? (
                <LoaderCircle className="animate-spin mr-2 w-5 h-5 md:w-6 md:h-6" />
              ) : null}
              Save Experience
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Experience;