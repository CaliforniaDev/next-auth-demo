'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { get2faSecret } from './actions';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';

type Props = {
  twoFactorEnabled: boolean;
};

enum Steps {
  INITIAL = 1,
  SHOW_QR = 2,
  CONFIRM_CODE = 3,
}

export default function TwoFactorAuthForm({ twoFactorEnabled }: Props) {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(twoFactorEnabled);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  const handleEnableClick = async () => {
    const response = await get2faSecret();

    if (response.error) {
      toast({
        variant: 'destructive',
        title: response.message,
      });
      return;
    }
    setStep(Steps.SHOW_QR);
    setCode(response.twoFactorSecret ?? '');
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
          {step === Steps.SHOW_QR && (
            <div className='flex flex-col gap-4 items-center'>
              <p className='text-muted-foreground py-2 text-xs'>
                Scan the QR code below in the Google Authenticator app to
                activate Two-Factor Authentication.
              </p>
              <QRCodeSVG value={code} />
              <div className='flex flex-col w-full gap-2'>
                <Button onClick={() => setStep(Steps.CONFIRM_CODE)}>I have scanned the QR code</Button>
                <Button onClick={() => setStep(Steps.INITIAL)} variant='outline'>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
