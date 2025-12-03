import React from "react";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion } from "framer-motion";

function PersonalDetails({ resumeInfo, enanbledNext }) {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: resumeInfo?.firstName || "",
    lastName: resumeInfo?.lastName || "",
    jobTitle: resumeInfo?.jobTitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
  });

  const handleInputChange = (e) => {
    enanbledNext(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSave = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await updateThisResume(resume_id, {
        data: {
          firstName: e.target.firstName.value,
          lastName: e.target.lastName.value,
          jobTitle: e.target.jobTitle.value,
          address: e.target.address.value,
          phone: e.target.phone.value,
          email: e.target.email.value,
        },
      });
      toast.success("Personal details updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      enanbledNext(true);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-full" />
        <div>
          <h2 className="text-3xl font-bold text-gray-100">Personal Profile</h2>
          <p className="text-gray-400 mt-1">Basic information for your resume</p>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Column */}
          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="bg-gray-700 border-2 border-gray-600 focus:border-primary focus:ring-0 h-12 text-gray-100 rounded-xl transition-all group-hover:border-primary/50"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Title
              </label>
              <Input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="bg-gray-700 border-2 border-gray-600 focus:border-primary focus:ring-0 h-12 text-gray-100 rounded-xl transition-all group-hover:border-primary/50"
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-gray-700 border-2 border-gray-600 focus:border-primary focus:ring-0 h-12 text-gray-100 rounded-xl transition-all group-hover:border-primary/50"
                required
              />
            </div>
          </div>

          {/* Second Column */}
          <div className="space-y-6">
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="bg-gray-700 border-2 border-gray-600 focus:border-primary focus:ring-0 h-12 text-gray-100 rounded-xl transition-all group-hover:border-primary/50"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="bg-gray-700 border-2 border-gray-600 focus:border-primary focus:ring-0 h-12 text-gray-100 rounded-xl transition-all group-hover:border-primary/50"
                required
              />
            </div>

            <div className="relative group">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-700 border-2 border-gray-600 focus:border-primary focus:ring-0 h-12 text-gray-100 rounded-xl transition-all group-hover:border-primary/50"
                required
              />
            </div>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="pt-6 border-t border-gray-700"
        >
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl font-medium text-lg shadow-lg hover:shadow-primary/30 transition-all"
          >
            {loading ? (
              <LoaderCircle className="animate-spin mr-2 w-6 h-6" />
            ) : null}
            Update Profile
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}

export default PersonalDetails;