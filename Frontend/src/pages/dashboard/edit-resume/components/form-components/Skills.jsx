import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { LoaderCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion } from "framer-motion";


const starStyles = {
  itemShapes: Star,
  activeFillColor: '#ff4757',
  inactiveFillColor: '#2d2d2d',
  itemStrokeWidth: 1,
  activeStrokeColor: '#ff4757',
  inactiveStrokeColor: '#404040'
};

function Skills({ resumeInfo, enanbledNext }) {
  const [loading, setLoading] = React.useState(false);
  const [skillsList, setSkillsList] = React.useState(
    resumeInfo?.skills || [{ name: "", rating: 0 }]
  );
  const dispatch = useDispatch();
  const { resume_id } = useParams();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, skills: skillsList }));
  }, [skillsList]);

  const AddNewSkills = () => {
    setSkillsList(prev => [...prev, { name: "", rating: 0 }]);
  };

  const RemoveSkills = () => {
    setSkillsList(prev => prev.slice(0, -1));
  };

  const handleChange = (index, key, value) => {
    const updatedSkills = skillsList.map((skill, i) =>
      i === index ? { ...skill, [key]: value } : skill
    );
    setSkillsList(updatedSkills);
  };

  const onSave = async () => {
    setLoading(true);
    try {
      await updateThisResume(resume_id, { data: { skills: skillsList } });
      toast.success("Skills saved successfully");
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
          <h2 className="text-3xl font-bold text-gray-100">Professional Skills</h2>
          <p className="text-gray-400 mt-1">Highlight your core competencies</p>
        </div>
      </div>

      <div className="space-y-6">
        {skillsList.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col md:flex-row gap-4 items-center p-4 bg-gray-800 rounded-xl border-2 border-gray-700"
          >
            <div className="w-full md:w-2/3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Name
              </label>
              <Input
                className="w-full bg-gray-700 border-2 border-gray-600 text-gray-100 rounded-xl focus:border-primary"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>

            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proficiency
              </label>
              <Rating
                style={{ maxWidth: 140 }}
                value={item.rating}
                onChange={(v) => handleChange(index, "rating", v)}
                itemStyles={starStyles}
              />
            </div>
          </motion.div>
        ))}

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t border-gray-700">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={AddNewSkills}
              className="border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary gap-2"
            >
              + Add Skill
            </Button>
            <Button
              variant="outline"
              onClick={RemoveSkills}
              className="border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary gap-2"
            >
              - Remove
            </Button>
          </div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground w-full md:w-auto"
            >
              {loading ? (
                <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
              ) : null}
              Save Skills
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Skills;