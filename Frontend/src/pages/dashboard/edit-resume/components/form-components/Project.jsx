import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import SimpeRichTextEditor from "@/components/custom/SimpeRichTextEditor";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion } from "framer-motion";

const formFields = {
  projectName: "",
  techStack: "",
  projectSummary: "",
};

function Project({ resumeInfo, setEnabledNext, setEnabledPrev }) {
  const [projectList, setProjectList] = useState(resumeInfo?.projects || []);
  const [loading, setLoading] = useState(false);
  const { resume_id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addResumeData({ ...resumeInfo, projects: projectList }));
  }, [projectList]);

  const addProject = () => {
    setProjectList([...projectList, formFields]);
  };

  const removeProject = (index) => {
    const list = [...projectList];
    const newList = list.filter((item, i) => i !== index);
    setProjectList(newList);
  };

  const handleChange = (e, index) => {
    setEnabledNext(false);
    setEnabledPrev(false);
    const { name, value } = e.target;
    const list = [...projectList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setProjectList(list);
  };

  const handleRichTextEditor = (value, name, index) => {
    const list = [...projectList];
    const newListData = {
      ...list[index],
      [name]: value,
    };
    list[index] = newListData;
    setProjectList(list);
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        projects: projectList,
      },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then(() => toast.success("Resume Updated"))
        .catch((error) => toast.error(`Error updating resume: ${error.message}`))
        .finally(() => {
          setEnabledNext(true);
          setEnabledPrev(true);
          setLoading(false);
        });
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
          <h2 className="text-3xl font-bold text-gray-100">Projects</h2>
          <p className="text-gray-400 mt-1">Showcase your technical work</p>
        </div>
      </div>

      <div className="space-y-6">
        {projectList?.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gray-800 rounded-xl border-2 border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-100">
                Project {index + 1}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeProject(index)}
                className="text-red-500 border-red-500/40 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Project Name</label>
                <Input
                  type="text"
                  name="projectName"
                  value={project?.projectName}
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Tech Stack</label>
                <Input
                  type="text"
                  name="techStack"
                  value={project?.techStack}
                  placeholder="React, Node.js, Express, MongoDB"
                  onChange={(e) => handleChange(e, index)}
                  className="bg-gray-700 border-2 border-gray-600 text-gray-100"
                />
              </div>

              <div className="col-span-full space-y-2">
                <SimpeRichTextEditor
                  index={index}
                  defaultValue={project?.projectSummary}
                  onRichTextEditorChange={(event) =>
                    handleRichTextEditor(event, "projectSummary", index)
                  }
                  resumeInfo={resumeInfo}
                />
              </div>
            </div>
          </motion.div>
        ))}

        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t border-gray-700">
          <Button
            onClick={addProject}
            variant="outline"
            className="border-primary/40 bg-gray-800 hover:bg-gray-700 text-primary gap-2"
          >
            + Add Project
          </Button>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
            >
              {loading ? (
                <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
              ) : null}
              Save Projects
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Project;