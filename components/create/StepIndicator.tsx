// components/create/StepIndicator.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Mail, MessageSquare, 
  Music, PenTool, Send, Check, Share2
} from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { icon: Mail, label: 'Phong bì & Tem' },
  { icon: MessageSquare, label: 'Lời nhắn & Ảnh' },
  { icon: Music, label: 'Nhạc & Chữ ký' },
  { icon: Share2, label: 'Tiện ích' },
  { icon: Send, label: 'Gửi' },
];

export default function StepIndicator({ currentStep, totalSteps = 5, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center">
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
                className="flex flex-col items-center gap-1.5"
              >
                <button
                  onClick={() => onStepClick && isCompleted && onStepClick(index + 1)}
                  disabled={!isCompleted}
                  className={`
                    relative rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isCompleted 
                      ? 'w-14 h-14 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white cursor-pointer hover:scale-110 hover:shadow-xl shadow-lg' 
                      : isCurrent 
                        ? 'w-16 h-16 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white ring-4 ring-amber-200/50 ring-offset-2 ring-offset-white cursor-default shadow-xl' 
                        : 'w-12 h-12 bg-gray-100 text-gray-400 cursor-not-allowed shadow-sm'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className={`${isCompleted ? 'w-7 h-7' : 'w-5 h-5'}`} strokeWidth={3} />
                  ) : (
                    <StepIcon className={isCurrent ? 'w-7 h-7' : 'w-5 h-5'} strokeWidth={isCurrent ? 2.5 : 1.5} />
                  )}
                  
                  {/* Glow effect for current step */}
                  {isCurrent && (
                    <motion.span 
                      className="absolute inset-0 rounded-full bg-amber-400/30"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </button>
                
                {/* Label - Gần icon hơn và rõ ràng hơn */}
                <span 
                  className={`
                    text-xs font-semibold transition-all whitespace-nowrap
                    ${isCurrent 
                      ? 'text-amber-700 font-bold' 
                      : isCompleted 
                        ? 'text-amber-700 hover:text-amber-900' 
                        : 'text-gray-400'
                    }
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
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
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
          <span className="text-sm font-medium text-amber-700">
            {steps[currentStep - 1]?.label}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
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
                    ? 'bg-amber-600 text-white' 
                    : isCurrent 
                      ? 'bg-amber-500 text-white' 
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
