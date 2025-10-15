// ResumeCard.jsx
import { FaEye, FaEdit, FaTrashAlt, FaSpinner } from "react-icons/fa";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteThisResume } from "@/Services/resumeAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ResumeCard({ resume, refreshData }) {
  const [loading, setLoading] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteThisResume(resume._id);
      toast.success("Resume deleted successfully");
      refreshData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative h-full min-h-[300px] bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-primary/50 transition-all overflow-hidden"
    >
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {resume.title}
          </h3>
          <p className="text-sm text-gray-400">
            Last modified: {new Date(resume.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex justify-between mt-6 border-t border-gray-700 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/dashboard/view-resume/${resume._id}`)}
            className="text-gray-400 hover:text-primary"
          >
            <FaEye className="mr-2" /> Preview
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/dashboard/edit-resume/${resume._id}`)}
              className="text-gray-400 hover:text-secondary"
            >
              <FaEdit className="mr-2" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenAlert(true)}
              className="text-gray-400 hover:text-red-500"
            >
              <FaTrashAlt className="mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-100">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete "{resume.title}" and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-700 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

export default ResumeCard;