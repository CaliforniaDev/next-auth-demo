'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
  twoFactorEnabled: boolean;
};

enum Steps {
  INITIAL = 1,
  SHOW_QR = 2,
  CONFIRM_CODE = 3,
}

export default function TwoFactorAuthForm({ twoFactorEnabled }: Props) {
  const [isEnabled, setIsEnabled] = useState(twoFactorEnabled);
  const [step, setStep] = useState(1);

  const handleEnableClick = async () => {
    setStep(2);
  };

  return (
    <div>
      {!isEnabled && (
        <div>
          {step === Steps.INITIAL && (
            <Button onClick={handleEnableClick}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === Steps.SHOW_QR && <div>Display QR Code</div>}
        </div>
      )}
    </div>
  );
}
