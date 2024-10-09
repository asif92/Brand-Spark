import React, { useState } from 'react';
import Section from '../components/section';
import { isNumber } from '../utils/format';
import { toast } from 'alert';

const VerifyAdminOTPPage = ({
  activeSection,
  setActiveSection,
  sectionStylingClasses,
  setIsAdminView,
  isVerifyAdmin,
}) => {
  const [adminOtp, setAdminOtp] = useState('');
  const [verifyOtpBtnLoader, setVerifyOtpBtnLoader] = useState(false);

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    verifyOtp(adminOtp);
  };

  const verifyOtp = (otp) => {
    if (otp.length === 6) {
      setVerifyOtpBtnLoader(true);

      let confirmationResult = window.confirmationResult;
      confirmationResult
        .confirm(otp)
        .then((result) => {
          toast.success('Authorized!');
          setIsAdminView(true);
          setVerifyOtpBtnLoader(false);

          setActiveSection((prev) => prev + 2);
          localStorage.setItem('activeSection', 4);
        })
        .catch((error) => {
          setVerifyOtpBtnLoader(false);

          toast.error('Cannot verify OTP');
          console.log(error);
        });
    }
  };

  return (
    <>
      <Section
        title='Verify OTP'
        description='Verifying OTP'
        onSubmit={handleVerifyOtpSubmit}
        value={adminOtp}
        setValue={setAdminOtp}
        buttonText={'Verify'}
        stylingClass={sectionStylingClasses[activeSection]}
        setActiveSection={setActiveSection}
        previousSection={isVerifyAdmin ? 1 : 3}
        resendOtpButtonShow={true}
        isRealAdmin={isVerifyAdmin}
        verifyOtpBtnLoader={verifyOtpBtnLoader}
      />
    </>
  );
};

export default VerifyAdminOTPPage;
