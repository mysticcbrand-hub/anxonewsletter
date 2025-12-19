import AnimatedBackground from '@/components/AnimatedBackground';
import MinimalNewsletter from '@/components/MinimalNewsletter';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import { useState } from 'react';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<string>('email');

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <ExitIntentPopup currentStep={currentStep} />
      <main>
        <MinimalNewsletter onStepChange={setCurrentStep} />
      </main>
    </div>
  );
};

export default Index;
