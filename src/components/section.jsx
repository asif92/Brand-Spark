import Button from './buttonSubmit';
import React, { useState, useEffect } from 'react';
import Inputbox from './inputBox';
import { signInWithPhoneNumber } from 'firebase/auth';
import { authentication } from '../firebase-config';

const Section = ({
  title,
  description,
  placeholder,
  inputType,
  onSubmit,
  value,
  setValue,
  buttonText,
  showCaution,
  stylingClass,
  showExtensionNumber,
  setActiveSection,
  previousSection,
  resendOtpButtonShow,
  isRealAdmin,
  phoneBtnLoader,
  verifyOtpBtnLoader,
}) => {
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(false);

  const handleBackButton = () => {
    setActiveSection((prev) => prev - 1);
    localStorage.setItem('activeSection', previousSection);
  };
  const phoneNumber = isRealAdmin
    ? localStorage.getItem('adminPhone')
    : localStorage.getItem('phone');

  const handleResendOTPButton = () => {
    handleStart();
    const appVerifier = window.recaptchaVerifier;
    const ext = '+91';
    const completeNumber = ext.concat(phoneNumber);

    signInWithPhoneNumber(authentication, completeNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        // setActiveSection((prev) => prev + 1);
        // localStorage.setItem('activeSection', 2);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let interval;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      setIsActive(false);
      setSeconds(60);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleStart = () => {
    setIsActive(true);
  };

  return (
    <div
      className={`App backgroundlineargradient ParentDiv flex flex-col items-center justify-center ${stylingClass}`}
    >
      <div className='flex align-center justify-center'>
        <p className='title'>{title}</p>
        <p className=' w-80 mt-4 description'>{description}</p>
      </div>

      <form onSubmit={onSubmit} className=' mt-8 '>
        <div className='inline-flex flex-row w-screen items-center justify-center '>
          {showExtensionNumber && (
            <div className='text-gray mr-2'>
              <p className='extensionNumber'>+91</p>
            </div>
          )}

          <div className=' w-80 mb-2'>
            <Inputbox
              name={title.toLowerCase()}
              type={inputType}
              className=' bg-transparent border tracking-widest input'
              placeholder={placeholder}
              max={10}
              placeholderTextColor='gray'
              handleChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </div>
        </div>
      </form>

      <div className='w-80 mt-24 '>
        <Button
          loading={phoneBtnLoader ? phoneBtnLoader : verifyOtpBtnLoader ? verifyOtpBtnLoader : null}
          btntype='submit'
          handleClick={onSubmit}
          btnText={buttonText}
          className='bigButton '
        />
      </div>
      {resendOtpButtonShow ? (
        <div className='w-80 mt-2'>
          <Button
            btntype='submit'
            handleClick={!isActive ? handleResendOTPButton : null}
            btnText={seconds && isActive ? seconds : 'Resend OTP'}
            className='bigButton '
          />
        </div>
      ) : null}
      {showCaution && (
        <p className='w-80 caution pb-100 '>
          By signing up you agree to our <span className='font-bold'>terms & conditions.</span> See
          how we use your data in our <span className='font-bold'>privacy policy.</span>
        </p>
      )}
      <div className='w-80 mt-20'>
        <Button
          btntype='submit'
          btnText={'Back'}
          handleClick={handleBackButton}
          className='bigButton'
        />
      </div>
    </div>
  );
};

export default Section;
