import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Check, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI";
import { motion } from "framer-motion";

function ThemeColor({ resumeInfo }) {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState(resumeInfo?.themeColor || "#0A66C2");
  const { resume_id } = useParams();

  const colorGroups = [
    {
      name: "Primary Colors",
      colors: ["#0A66C2", "#3B82F6", "#6366F1", "#8B5CF6", "#D946EF", "#EC4899"]
    },
    {
      name: "Neutrals",
      colors: ["#0F172A", "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8"]
    },
    {
      name: "Accents",
      colors: ["#10B981", "#3B82F6", "#F43F5E", "#EF4444", "#F59E0B", "#D97706"]
    }
  ];

  const onColorSelect = async (color) => {
    setSelectedColor(color);
    dispatch(addResumeData({ ...resumeInfo, themeColor: color }));
    
    try {
      await updateThisResume(resume_id, { data: { themeColor: color } });
      toast.success("Theme updated", {
        icon: <Sparkles className="w-4 h-4 text-yellow-400" />
      });
    } catch (error) {
      toast.error("Update failed", {
        icon: <Sparkles className="w-4 h-4 text-red-400" />
      });
    }
  };

  const getRandomColor = () => {
    const allColors = colorGroups.flatMap(group => group.colors);
    const randomColor = allColors[Math.floor(Math.random() * allColors.length)];
    onColorSelect(randomColor);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="group flex items-center gap-2 relative">
          <div className="absolute inset-0 bg-primary/10 transition-opacity rounded-md" />
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="backdrop-blur-lg bg-white/95 dark:bg-gray-900/95 border border-gray-200/20 shadow-xl rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-primary">Color Palette</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={getRandomColor}
            className="text-xs gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Random
          </Button>
        </div>

        <div className="space-y-4">
          {colorGroups.map((group) => (
            <div key={group.name} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {group.name}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {group.colors.map((color) => (
                  <motion.div
                    key={color}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative h-8 w-8 rounded-lg cursor-pointer shadow-sm
                      ${selectedColor === color ? 'ring-2 ring-primary ring-offset-1' : ''}
                    `}
                    style={{ backgroundColor: color }}
                    onClick={() => onColorSelect(color)}
                  >
                    {selectedColor === color && (
                      <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div 
              className="h-8 w-8 rounded-lg border"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
              {selectedColor}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;