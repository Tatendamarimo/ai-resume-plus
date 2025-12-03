import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';

const PasswordStrengthIndicator = ({ password = '', showRequirements = false }) => {
  const requirements = [
    { id: 1, text: "At least 8 characters", met: password.length >= 8 },
    { id: 2, text: "Contains a number", met: /\d/.test(password) },
    { id: 3, text: "Contains a special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { id: 4, text: "Contains uppercase & lowercase", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  ];

  const strength = requirements.filter(r => r.met).length;
  const strengthColor = 
    strength === 0 ? "bg-gray-700" :
    strength <= 2 ? "bg-red-500" :
    strength === 3 ? "bg-yellow-500" :
    "bg-green-500";

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${strengthColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="space-y-1">
          {requirements.map((req) => (
            <div key={req.id} className="flex items-center gap-2 text-xs">
              {req.met ? (
                <FiCheck className="text-green-500" />
              ) : (
                <FiX className="text-gray-500" />
              )}
              <span className={req.met ? "text-gray-300" : "text-gray-500"}>
                {req.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
