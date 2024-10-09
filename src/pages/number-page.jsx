import React, { useState } from 'react';
import Section from '../components/section';
import { isNumber } from '../utils/format';
import { toast } from 'alert';
import { authentication } from '../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const NumberPage = ({
  activeSection,
  setActiveSection,
  phone,
  setPhone,
  sectionStylingClasses,
}) => {
  const ext = '+92';
  const showExtensionNumber = activeSection === 1;
  const isNumberCountValid = phone.length === 10;
  const isNumberValid = isNumberCountValid && isNumber(phone);
  const completeNumber = ext.concat(phone);
  const [phoneBtnLoader, setPhoneBtnLoader] = useState(false);

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA response:', response);
      },
    });
  };

  const handlePhoneSubmit = (e) => {
    setPhoneBtnLoader(true);

    e.preventDefault();
    if (!isNumberValid) {
      toast.error('Invalid Number: Number must be of 10 digits');
      return;
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

    localStorage.setItem('phone', phone);
  };

  return (
    <>
      <Section
        title='ENTER YOUR NUMBER'
        description="Whether you're creating a new score, or signing back in, let's start with your number"
        placeholder='9818******'
        inputType='tel'
        onSubmit={handlePhoneSubmit}
        value={phone}
        setValue={setPhone}
        buttonText={'Proceed'}
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

export default NumberPage;
