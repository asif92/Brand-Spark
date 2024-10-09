import React from 'react';
import Button from '../components/buttonSubmit';

const HomePage = ({ isEnterClicked, setIsEnterClicked, setDisplayLoading, setActiveSection }) => {
  const handleClick = () => {
    setActiveSection((prev) => prev + 1);
    localStorage.setItem('activeSection', 1);
  };
  return (
    <div className={`split-screen ${isEnterClicked ? 'active' : ''}`}>
      <div className='flex justify-center pt-10 pb-10'>
        <div className='items-center'>
          <p className=' text-3xl text-center font-bold '>Brand Spark</p>
          <p className='px-10 text-center text-xs font-light '>world's first social credit score</p>
        </div>
      </div>
      <div className='flex'>
        <div
          onClick={() => {
            setIsEnterClicked(true);
            setTimeout(() => {
              setDisplayLoading(true);
              setTimeout(() => {
                setDisplayLoading(false);
                setActiveSection((prev) => prev + 3);
                localStorage.setItem('activeSection', 3);
              }, 3000);
            }, 1000);
          }}
          className='flex flex-auto flex-col items-center'
        >
          <img
            src='https://i.adfadsfasd.gif'
            alt='Your Gif'
            className=''
          />
          <p className='px-10 text-center text-xs  mt-8'>
            click on face to <a className='font-bold'>apply</a>
          </p>
        </div>
      </div>
      <div className='mt-16'>
        <Button
          handleClick={() => {
            handleClick();
          }}
          className='bigButton'
          btnText='Admin Login'
        />
      </div>
    </div>
  );
};

export default HomePage;
