import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './App.css';
import Lottie from 'react-lottie';
// import CheckingEligibility from './screens/calculatingScore';
import abstract from './abstract.json';
import * as animationData from './loading.json';
// import ViewMore from './screens/viewMore';
import HomePage from './pages/home-page';
import NumberPage from './pages/number-page';
import NamePage from './pages/name-page';
import OccupationPage from './pages/occupation-page';
import UsernamePage from './pages/username-page';
import EmailPage from './pages/email-page';
import ScoreDisplayPage from './pages/score-display-page';
import ViewMorePage from './pages/view-more-page';
import CheckEligibilityPage from './pages/check-eligibility-page';
import VerifyAdminOTPPage from './pages/verify-admin-otp-page';
import VerifyAdminPhonePage from './pages/verify-admin-phone-page';
import { Toaster } from 'alert';
import Button from './components/buttonSubmit';
import ResultsPage from './pages/results-page/results-page';
import ViewHistory from './pages/transaction-page.jsx';


const App = () => {
  const sectionStylingClasses = [
    'section-0', // Default styling class for the first section (you can define a default class)
    'section-1', // Styling class for the second section
    'section-2', // Styling class for the third section
    'section-3',
    'section-4',
    'section-5',
    'section-6',
    'section-7',
  ];

  const [activeSection, setActiveSection] = useState(0);

  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState(''); //make all as one
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);

  const [username, setUsername] = useState('');
  const [isEnterClicked, setIsEnterClicked] = useState(false);
  const [displayLoading, setDisplayLoading] = useState(false);
  const touchStartX = useRef(null);
  const [displayCheckingEligibility, setDisplayCheckingEligibility] = useState(true);
  const [shouldStartTimer, setShouldStartTimer] = useState(false);
  const [activeSectionFromStorage, setActiveSectionFromStorage] = useState();

  useEffect(() => {
    setActiveSectionFromStorage(localStorage.getItem("activeSection") ? localStorage.getItem("activeSection") : 0)
  }, [activeSection])




  const userData = {
    name: `${firstName} ${lastName}`,
    email,
    occupation,
    social_media_id: username,
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchDistance = touchEndX - touchStartX.current;

    if (touchDistance > 100 && activeSection > 0) {
      // If the swipe distance is greater than 100px and not on the first section,
      // go back to the previous section.
      setActiveSection((prev) => prev - 1);
    }
  };

  useEffect(() => {
    // Add the touch event listeners when the component mounts
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSection]); // Re-add the event listeners whenever the activeSection changes

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const LoadingScreen = () =>
    displayLoading && (
      <div className={` loading-screen ${displayLoading ? 'visible' : ''}`}>
        <Lottie options={defaultOptions} height={'60%'} width={'100%'} />
      </div>
    );

  const goToHomePage = () => {
    setActiveSection((prev) => prev + 2);
  };

  const goToHome = () => {
    localStorage.clear()
    window.location.reload(true);
  };

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyAdmin, setIsVerifyAdmin] = useState(false);

  useEffect(() => {
    if (displayCheckingEligibility && shouldStartTimer) {
      // Display the CheckingEligibility component for 15 seconds
      const timer = setTimeout(() => {
        setDisplayCheckingEligibility(false);
        setActiveSection(9);
        localStorage.setItem('activeSection', 9);

        // BODY OF API
        const postData = async () => {
          setIsLoading(true);
          const options = {
            method: 'POST',
            url: '/api/User',
            headers: {
              Accept: 'text/plain',
              'Content-Type': 'application/json',
            },
            data: {
              email: localStorage.getItem("email"),
              firstName: localStorage.getItem("firstName"),
              lastName: localStorage.getItem("lastName"),
              socialMedia: localStorage.getItem("username") ?? null,
              phone: localStorage.getItem("phone"),
              occupation: localStorage.getItem("occupation"),
            },
          };
          try {
            const response = await axios.request(options);
            setData(response.data);
            localStorage.setItem('userid', `${response.data.id}`);
            localStorage.setItem('processId', `${response.data.processid}`);

            setTimeout(() => {
              setIsLoading(false);
            }, [5000]);
          } catch (error) {
            localStorage.clear()
            setError(error);
            setIsLoading(false);
          }
        };
        postData();
      }, 15000);

      // Clean up the timer when the component unmounts or when the displayCheckingEligibility state changes
      return () => {
        clearTimeout(timer);
      };
    }
  }, [displayCheckingEligibility, shouldStartTimer, firstName, lastName, email, phone, occupation]); //username

  const sections = [
    <HomePage
      isEnterClicked={isEnterClicked}
      setIsEnterClicked={setIsEnterClicked}
      setDisplayLoading={setDisplayLoading}
      setActiveSection={setActiveSection}
    />,
    <VerifyAdminPhonePage
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      setPhone={setPhone}
      sectionStylingClasses={sectionStylingClasses}
      setIsVerifyAdmin={setIsVerifyAdmin}
    />,
    <VerifyAdminOTPPage
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      sectionStylingClasses={sectionStylingClasses}
      setIsAdminView={setIsAdminView}
      isVerifyAdmin={isVerifyAdmin}
    />,
    <NumberPage
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      phone={phone}
      setPhone={setPhone}
      sectionStylingClasses={sectionStylingClasses}
    />,
    <NamePage
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      setFirstName={setFirstName}
      setLastName={setLastName}
      sectionStylingClasses={sectionStylingClasses}
    />,
    <OccupationPage
      occupation={occupation}
      setOccupation={setOccupation}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      sectionStylingClasses={sectionStylingClasses}
    />,
    <UsernamePage
      username={username}
      setUsername={setUsername}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      sectionStylingClasses={sectionStylingClasses}
    />,
    <EmailPage
      email={email}
      setEmail={setEmail}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      setShouldStartTimer={setShouldStartTimer}
      sectionStylingClasses={sectionStylingClasses}
    />,
    shouldStartTimer && displayCheckingEligibility && (
      <CheckEligibilityPage key='checkingEligibility' />
    ),
    <ScoreDisplayPage
      key='scoreDisplay'
      goToHomePage={goToHomePage}
      data={data}
      error={error}
      isLoading={isLoading}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      userData={userData}
      isAdminView={isAdminView}
    />,

    <ResultsPage setActiveSection={setActiveSection} setShouldStartTimer={setShouldStartTimer} setDisplayCheckingEligibility={setDisplayCheckingEligibility} />,
    <ViewHistory setActiveSection={setActiveSection} setShouldStartTimer={setShouldStartTimer} setDisplayCheckingEligibility={setDisplayCheckingEligibility} />,
  ];

  console.log(displayCheckingEligibility, "shpelr")
  if (error) {
    return (
      <div>
        <p>
          Error: {error.message}
        </p>
        <Button
          btntype='submit'
          btnText={'Go to Home'}
          handleClick={goToHome}
          className='button'
          style={{ width: '100vw' }}
        />
      </div>);
  }


  return (
    <div>
      <Toaster position='top-right' />
      <SwitchTransition>
        <CSSTransition
          key={activeSection}
          timeout={100}
          classNames={'slide'}
          // unmountOnExit
          appear
        >
          <div className='flex align-center justify-center'>
            {displayLoading ? <LoadingScreen /> : sections[activeSectionFromStorage ?? activeSection]}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default App;
