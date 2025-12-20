import React from 'react';

type ProgressBarProps = {
  currentStep: 1 | 2 | 3 | 4;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={[
                'rounded-full transition-all duration-500 ease-out',
                step < currentStep
                  ? 'w-6 h-2 bg-[#FFD60A]'
                  : step === currentStep
                  ? 'w-3 h-3 bg-[#FFD60A] shadow-[0_0_12px_rgba(255,214,10,0.4)]'
                  : 'w-2 h-2 bg-[#666666]'
              ].join(' ')}
            />

            {index < steps.length - 1 && (
              <div
                className={[
                  'w-6 h-px transition-all duration-500',
                  step < currentStep ? 'bg-[#FFD60A]/60' : 'bg-[#666666]/40',
                ].join(' ')}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
