'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { get2faSecret, activate2fa, disable2fa } from './actions';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

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
  const [step, setStep] = useState(Steps.INITIAL);
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState('');

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

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await activate2fa(otp);

    if (response?.error) {
      toast({
        variant: 'destructive',
        title: response.message,
      });
      return;
    }
    toast({
      className: 'bg-green-500 text-white',
      title: 'Two-Factor Authentication has been enabled!',
    });
    setIsEnabled(true);
  };

  const handleDisable2faClick = async () => {
    await disable2fa();
    toast({
      className: 'bg-green-500 text-white',
      title: 'Two-Factor Authentication has been disabled!',
    });
    setStep(Steps.INITIAL);
    setIsEnabled(false);
  };

  return (
    <div>
      {!!isEnabled && (
        <Button onClick={handleDisable2faClick} variant='destructive'>
          Disable Two-Factor Authentication
        </Button>
      )}
      {!isEnabled && (
        <div>
          {step === Steps.INITIAL && (
            <Button onClick={handleEnableClick}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === Steps.SHOW_QR && (
            <div className='flex flex-col items-center gap-4'>
              <p className='text-muted-foreground py-2 text-xs'>
                Scan the QR code below in the Google Authenticator app to
                activate Two-Factor Authentication.
              </p>
              <QRCodeSVG value={code} />
              <div className='flex w-full flex-col gap-2'>
                <Button onClick={() => setStep(Steps.CONFIRM_CODE)}>
                  I have scanned the QR code
                </Button>
                <Button
                  onClick={() => setStep(Steps.INITIAL)}
                  variant='outline'
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          {step === Steps.CONFIRM_CODE && (
            <form onSubmit={handleOTPSubmit} className='flex flex-col gap-2'>
              <p className='text-muted-foreground text-xs'>
                Please enter the one-time passcode from the Google Authenticator
                app.
              </p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6} type='submit'>
                Submit and Activate
              </Button>
              <Button onClick={() => setStep(Steps.SHOW_QR)} variant='outline'>
                Cancel
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
