// components/create/StepIndicator.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  LayoutTemplate, Mail, MessageSquare, Image, 
  Music, PenTool, Send, Check 
} from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { icon: LayoutTemplate, label: 'Mẫu thiệp' },
  { icon: Mail, label: 'Phong bì' },
  { icon: MessageSquare, label: 'Lời nhắn' },
  { icon: Image, label: 'Ảnh' },
  { icon: Music, label: 'Nhạc' },
  { icon: PenTool, label: 'Chữ ký' },
  { icon: Send, label: 'Gửi' },
];

export default function StepIndicator({ currentStep, totalSteps = 7 }: StepIndicatorProps) {
  return (
    <div className="w-full py-6 px-4">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          const isUpcoming = index > currentStep - 1;

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300 shadow-lg
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                      : isCurrent 
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white ring-4 ring-rose-200' 
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                  
                  {/* Pulse animation for current step */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-30" />
                  )}
                </div>
                
                {/* Label */}
                <span 
                  className={`
                    mt-2 text-xs font-medium transition-colors
                    ${isCurrent ? 'text-rose-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                  `}
                >
                  {step.label}
                </span>
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="w-12 lg:w-20 h-1 mx-2 rounded-full overflow-hidden bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Bước {currentStep} / {totalSteps}
          </span>
          <span className="text-sm font-medium text-rose-600">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
          />
        </div>

        {/* Step Icons Row */}
        <div className="flex justify-between mt-3">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStep - 1;
            const isCurrent = index === currentStep - 1;

            return (
              <div
                key={index}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
