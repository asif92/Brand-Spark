import React, { useState } from 'react';
import Lottie from 'react-lottie';
import './score-display-page.css';
import * as animationData from '../../fireworks.json';
import html2canvas from 'html2canvas';
import FeedbackLoading from '../../components/feedback-loading';
import Button from '../../components/buttonSubmit';
import Loader from '../../components/Loader';
import { useScoreDisplayPage } from './hooks';

const ScoreDisplayPage = ({
  goToHomePage,
  data,
  error,
  isLoading,
  activeSection,
  setActiveSection,
  userData,
  isAdminView,
}) => {
  const [score, setScore] = useState('0');
  const {
    isStartAnalysisLoading,
    startAnalysisError,
    isFeedbackLoading,
    // feedbackError,
    feedbackData,
    isScoreLoading,
    // scoreError,
    userAnalysisResponse,
    isFeedbackComplete,
  } = useScoreDisplayPage({ userData, error, isLoading, setScore });

  const goToHome = () => {
    localStorage.clear();
    window.location.reload(true);
  };

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // if (isFeedbackComplete) {
  //   return (
  //     <div>
  //       <Loader />
  //     </div>
  //   );
  // }

  if (startAnalysisError) {
    return (
      <div style={{ width: '390px' }}>
        <p className='text-[20px]'>Error: {error?.message}</p>
        <Button
          btntype='submit'
          btnText={'Go to Home'}
          handleClick={goToHome}
          className='button'
          style={{ width: '100vw' }}
        />
      </div>
    );
  }

  // if (startAnalysisError) {
  //   return <div>Error: {startAnalysisError.message}</div>;
  // }
  // if (feedbackError) {
  //   return <div>Error: {feedbackError.message}</div>;
  // }
  // if (scoreError) {
  //   return <div>Error: {scoreError.message}</div>;
  // }

  const downloadImage = () => {
    const image = document.getElementById('capture');

    html2canvas(image).then(function (canvas) {
      const link = document.createElement('a');
      link.download = `${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  const handleViewHistory = () => {
    setActiveSection((prev) => prev + 2);
    localStorage.setItem('activeSection', 11);
  };

  const handleViewMore = () => {
    setActiveSection((prev) => prev + 1);
    localStorage.setItem('activeSection', 10);
  };

  if (!isFeedbackComplete) {
    return (
      <>
        <FeedbackLoading data={userAnalysisResponse} />
      </>
    );
  }

  return (
    <div
      id='capture'
      className=' App backgroundlineargradient container flex align-center justify-center'
    >
      <Lottie
        options={lottieOptions}
        height={450}
        width={350}
        style={{ position: 'absolute', top: 10 }}
      />

      <div className='container w-100 '>
        <div className='p-8'>
          <div className='flex text-container flex align-center justify-center'>
            <p className='sub-heading pt-12'>
              Welcome to the club {data?.firstname ?? ''}! You are a special person.
            </p>
            <div className='description-view'>
              <p className='description1'>You have a very good brand spark score.</p>
              <p className='description2'>A social credit score of</p>
              <p className='score'>{score ?? 0}</p> {/* data?.totalscore   */}
              <p className='description3'>
                Places you among the top 9% of the members of this platform
              </p>
              <p className='description2'></p>
            </div>
          </div>
        </div>

        <div className='score-button'>
          <Button
            btntype='submit'
            handleClick={handleViewHistory}
            btnText={'View History'}
            className='button'
          />

          <Button
            btntype='submit'
            btnText={'View More'}
            handleClick={handleViewMore}
            className='button ml-2'
            style={{ width: '100vw' }}
          />
        </div>

        <div className=' flex flex-row align-center justify-center mt-8  w-100'>
          <Button
            handleClick={downloadImage}
            btnText={'ScreenShot'}
            className=' underline text-xs pb-10 '
          />
          <br />
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplayPage;
