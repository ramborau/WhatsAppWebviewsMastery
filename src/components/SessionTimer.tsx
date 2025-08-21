import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

interface SessionTimerProps {
  onExpired: () => void;
  currentStep?: 'seats' | 'food' | 'payment';
}

export function SessionTimer({ onExpired, currentStep = 'seats' }: SessionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const steps = [
    { id: 'seats', label: 'Select Seat', icon: currentStep === 'seats' ? Circle : CheckCircle2 },
    { id: 'food', label: 'Grab Food', icon: currentStep === 'food' ? Circle : (currentStep === 'payment' ? CheckCircle2 : Circle) },
    { id: 'payment', label: 'Pay Securely', icon: currentStep === 'payment' ? Circle : Circle }
  ];

  const getStepStatus = (stepId: string) => {
    if (stepId === 'seats' && (currentStep === 'food' || currentStep === 'payment')) return 'completed';
    if (stepId === 'food' && currentStep === 'payment') return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="hidden lg:flex items-center justify-between bg-booking-primary text-white py-2 px-4 text-sm font-medium">
      {/* Steps Timeline */}
      <div className="flex items-center gap-3">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center gap-1">
                {status === 'completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : status === 'current' ? (
                  <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                ) : (
                  <Circle className="w-4 h-4 text-white/50" />
                )}
                <span className={`text-xs ${status === 'pending' ? 'text-white/70' : 'text-white'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${status === 'completed' ? 'bg-white' : 'bg-white/30'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Timer */}
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        <span>Session expires in: {minutes}:{seconds.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}