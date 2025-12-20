import React from 'react';

type ProgressBarProps = {
  currentStep: 1 | 2 | 3 | 4;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];

  return (
    <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 px-4 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-full bg-[#1C1C1E]/60 backdrop-blur-[40px] border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={[
                'rounded-full transition-all duration-500 ease-out',
                step < currentStep
                  ? 'w-6 h-2 md:w-7 md:h-2.5 lg:w-8 lg:h-3 bg-[#FFD60A]'
                  : step === currentStep
                  ? 'w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 bg-[#FFD60A] shadow-[0_0_14px_rgba(255,214,10,0.5)]'
                  : 'w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 bg-[#666666]'
              ].join(' ')}
            />

            {index < steps.length - 1 && (
              <div
                className={[
                  'w-6 md:w-7 lg:w-8 h-px transition-all duration-500',
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
