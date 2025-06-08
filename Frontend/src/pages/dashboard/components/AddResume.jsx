// AddResume.jsx
import React from "react";
import { useState } from "react";
import { CopyPlus, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddResume() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumetitle, setResumetitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createResume = async () => {
    setLoading(true);
    if (!resumetitle.trim()) return;
    
    try {
      const { data } = await createNewResume({
        data: { title: resumetitle, themeColor: "#000000" }
      });
      navigate(`/dashboard/edit-resume/${data.resume._id}`);
    } finally {
      setLoading(false);
      setResumetitle("");
      setOpenDialog(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-8 h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/30 backdrop-blur-sm hover:border-primary/50 transition-all cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <div className="text-center space-y-4">
          <CopyPlus className="w-12 h-12 text-primary mx-auto" />
          <p className="text-gray-400">Create New Resume</p>
        </div>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-100">New Resume</DialogTitle>
            <DialogDescription className="text-gray-400">
              Start by naming your resume
            </DialogDescription>
          </DialogHeader>
          
          <Input
            className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-primary"
            placeholder="Senior Developer Resume"
            value={resumetitle}
            onChange={(e) => setResumetitle(e.target.value)}
          />
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={createResume}
              disabled={!resumetitle || loading}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {loading ? (
                <Loader className="animate-spin mr-2" />
              ) : null}
              Create Resume
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddResume;