import React, { useState } from 'react';
import { authentication } from '../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Section from '../components/section';
import { getRandomNumber, isNumber } from '../utils/format';
import { useEffect } from 'react';
import { db } from '../firebase-config';
import { ref, onValue } from 'firebase/database';
import { toast } from 'alert';
import Button from '../components/buttonSubmit';

const VerifyAdminPhonePage = ({
  activeSection,
  setActiveSection,
  setPhone,
  sectionStylingClasses,
  setIsVerifyAdmin,
}) => {
  const [adminPhone, setAdminPhone] = useState('');
  const [phoneBtnLoader, setPhoneBtnLoader] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const ext = '+92';
  const showExtensionNumber = activeSection === 1;
  const isNumberCountValid = adminPhone.length === 10;
  const isNumberValid = isNumberCountValid;
  const completeNumber = ext.concat(adminPhone);

  useEffect(() => {
    localStorage.setItem('adminPhone', adminPhone);
  }, [adminPhone]);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {},
    });
  };

  useEffect(() => {
    const startCountRef = ref(db, 'adminUser');
    onValue(startCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setAdminList(data);
    });
  }, []);

  const handleVerifyPhoneSubmit = (e) => {
    setPhoneBtnLoader(true);
    e.preventDefault();
    if (!isNumberValid) {
      toast.error('Invalid Number: Number must be of 10 digits');
      return;
    }

    const randNumber = getRandomNumber(1000000000, 9999999999);
    const numberString = String(randNumber);
    setPhone(numberString);
    localStorage.setItem('phone', numberString);
    const isRealAdmin = adminList.includes(completeNumber);

    if (!isRealAdmin) {
      toast.error('Cannot verify as Admin');
      setIsVerifyAdmin(false);
      setPhoneBtnLoader(false);

      return;
    }

    if (isRealAdmin) {
      setIsVerifyAdmin(true);
    }

    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(authentication, completeNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setActiveSection((prev) => prev + 1);
        setPhoneBtnLoader(false);
        localStorage.setItem('activeSection', 2);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
        setPhoneBtnLoader(false);
      });
  };

  return (
    <>
      <Section
        title='ENTER Admin NUMBER'
        description='Verifying Admin Access with Phone Number'
        placeholder='9818******'
        inputType='tel'
        onSubmit={handleVerifyPhoneSubmit}
        value={adminPhone}
        setValue={setAdminPhone}
        buttonText={'Verify'}
        showCaution={activeSection === 1}
        showExtensionNumber={showExtensionNumber}
        stylingClass={sectionStylingClasses[activeSection]}
        setActiveSection={setActiveSection}
        previousSection={0}
        phoneBtnLoader={phoneBtnLoader}
      />
    </>
  );
};

export default VerifyAdminPhonePage;
