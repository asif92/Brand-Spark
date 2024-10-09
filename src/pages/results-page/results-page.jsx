import React, { useState, useEffect } from 'react';
import './results-page.css';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/buttonSubmit';
import { getRandomNumber } from '../../utils/format';
export default function ResultsPage({
  setActiveSection,
  setShouldStartTimer,
  setDisplayCheckingEligibility,
}) {
  //Setup
  const { content, userId } = useParams();
  console.log(content, 'content', userId, 'id');
  const user = {
    id: userId,
  };
  const [education, setEducation] = useState([]);
  const [legal, setlegal] = useState([]);
  const [finance, setFinance] = useState([]);
  const [occupation, setocuupation] = useState([]);
  const [influance, setInfluance] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [userScore, setUserScore] = useState([]);
  const isVerifyAdmin = localStorage.getItem('adminPhone') ?? false;

  const params = useParams();
  const getUserId = localStorage.getItem('userid'); //183;
  // const getUserId = params.userId;
  //End Setup

  //UserInfo API
  const getUserInfo = () => {
    axios
      .get(
        `/api/User/${getUserId}`
      )
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err.message));
  };

  const [userProfilePicture, setUserProfilePicture] = useState('');
  //End UserInfo

  //UseScore API
  const getUserScore = () => {
    axios
      .get(
        `/api/Scores?userId=${getUserId}`
      )
      .then((res) => {
        setUserScore(res.data);
        const profilePictureUrl = res.data.userProfilePicture;
        setUserProfilePicture(profilePictureUrl);
        if (Array.isArray(res.data.wordCloud)) {
          // Extract words from the API response
          const words = res.data.wordCloud.map((word) => ({
            text: word,
          }));
          setWordCloudData(words);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const [wordCloudData, setWordCloudData] = useState([]);
  // End UserScore

  //Influence API
  const getInfluance = () => {
    axios
      .get(
        `/api/Scores/Influence?userId=${getUserId}`
      )
      .then((res) => {
        setInfluance(res.data);
      })
      .catch((err) => console.log(err.message));
  };
  //End Influence

  //Occupation API
  const getOccupation = () => {
    axios
      .get(
        `/api/Scores/Occupation?userId=${getUserId}`
      )
      .then((res) => {
        setocuupation(res.data);
      })
      .catch((err) => console.log(err.message));
  };
  //End Occupation

  //Education API
  const getEducation = () => {
    axios
      .get(
        `/api/Scores/Education?userId=${getUserId}`
      )
      .then((res) => {
        setEducation(res.data);
      })
      .catch((err) => console.log(err.message));
  };
  //End Education

  useEffect(() => {
    getEducation();
    // getFinance();
    getInfluance();
    // getLegal();
    getNetwork();
    getOccupation();
    getUserInfo();
    getUserScore();

    // let interval = setTimeout(() => setIsLoading(false), 1000);
    // return () => clearInterval(interval);
  }, []);
  console.log(userScore);

  // Description
  //import from API
  //even initial text is only the first 4 lines from description in getScoreAPI. if you dont split here, then response will be 500 words.
  const initialText = userInfo?.scoreResponseDTO?.description ?? '';
  const [showFullText, setShowFullText] = useState(false);

  const sentences = initialText.match(/[^.!?]+[.!?]+/g);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };
  // End Description

  // Occupation Modal
  const [isOccupationModalOpen, setIsOccupationModalOpen] = useState(false);

  const openOCModal = () => {
    setIsOccupationModalOpen(true);
  };

  const closeOCModal = () => {
    setIsOccupationModalOpen(false);
  };
  //End Occupation

  //Education Modal
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  const openEDModal = () => {
    setIsEducationModalOpen(true);
  };

  const closeEDModal = () => {
    setIsEducationModalOpen(false);
  };
  //End Education

  //Network
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  const openNWModal = () => {
    setIsNetworkModalOpen(true);
  };

  const closeNWModal = () => {
    setIsNetworkModalOpen(false);
  };

  const [network, setNetwork] = useState([]);
  // End Network

  const getNetwork = () => {
    axios
      .get(
        // `/api/Network/Influence?userId=${getUserId}`
        `/api/Scores/Network?userId=${getUserId}`
      )
      .then((res) => {
        setNetwork(res.data);
      })
      .catch((err) => {
        console.log(err.message);
        setTimeout(() => {}, 2000);
      });
  };

  useEffect(() => {
    getNetwork();

    // setIsLoading(true);
    // const interval = setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);

  const handleRestart = () => {
    setDisplayCheckingEligibility(true);
    setShouldStartTimer(false);
    const randNumber = getRandomNumber(1000000000, 9999999999);
    const numberString = String(randNumber);
    localStorage.setItem('phone', numberString);
    setActiveSection((prev) => prev - 6);
    localStorage.setItem('activeSection', 4);
  };
  const handleGoToHome = () => {
    setActiveSection((prev) => prev - 10);
    localStorage.setItem('activeSection', 0);
  };

  return (
    <div className='AppExtra backgroundlineargradient ParentDiv flex flex-col items-center '>
      <div className=''>
        <div className=' mt-8'>
          <div className=''>
            <p className='text-2xl items-left'>
              Hey,{' '}
              <span className='font-bold'>
                {userInfo?.firstName} {userInfo?.lastName}
              </span>
            </p>
            <p className='text-xs font-light text-gray-500'>Brand Spark found this about you..</p>
          </div>

          <div className='AppGlass  flex items-center justify-center my-6  gap-x-4 '>
            <img
              src={userProfilePicture}
              style={{ objectFit: 'contain', height: '150px', borderRadius: '1rem' }}
              alt='Description of the image' // Provide alt text for accessibility
            />
            <div className='my-2'>
              <p className='text-6xl font-bold '>{userInfo?.scoreResponseDTO?.totalscore}</p>
              <p className='text-xs mt-4'>you're in the top 0.001% of Brand Spark users</p>
            </div>
          </div>

          <div className='card'>
            <div className='flex flex-row py-8 px-4 justify-evenly'>
              <div>
                <p className='text-xs'>{influance?.instagramfollowers}</p>
                <p className='text-xs font-bold'>Followers</p>
              </div>
              <div>
                <p className='text-xs'>{influance?.onlinearticlementions}</p>
                <p className='text-xs font-bold'>Mentions</p>
              </div>
              <div>
                <p className='text-xs'>
                  {influance?.awardsachievements
                    ? influance.awardsachievements[0]
                        .split('\n')
                        .filter((item) => item.trim().length > 0).length
                    : 0}
                </p>
                <p className='text-xs font-bold'>Awards</p>
              </div>
              <div>
                <p className='text-xs'>
                  {influance?.articlesentiment !== undefined
                    ? parseFloat(influance.articlesentiment).toFixed(3)
                    : ''}{' '}
                  Positive
                </p>
                <p className='text-xs font-bold'>Sentiment</p>
              </div>
            </div>
            <div className=' flex flex-row px-4 justify-evenly'>
              <div>
                <p className='text-xs'>Finance</p>
                <p className='text-xs font-bold'>Top Score</p>
              </div>
              <div>
                <p className='text-xs'>720</p>
                <p className='text-xs font-bold'>Base</p>
              </div>
              <div>
                <p className='text-xs'>33.33</p>
                <p className='text-xs font-bold'>Enhanced</p>
              </div>
              <div>
                <p className='text-xs'>12,334,554</p>
                <p className='text-xs font-bold'>Est. Reach</p>
              </div>
            </div>
          </div>

          <div className='flex flex-row justify-between my-6 gap-x-2'>
            <div className='AppGlassB p-4' onClick={openOCModal}>
              <div className='text-xs'>
                <span className='font-bold'>Occupation</span>: {occupation[0]?.role}
                <div>
                  {occupation[0]?.currentcompanies
                    .split(',')
                    .filter((item) => item.trim() !== '')
                    .map((item, index) => (
                      <p key={index} className=''>
                        {item}
                      </p>
                    ))}
                </div>
              </div>
            </div>
            {isOccupationModalOpen && (
              <div className='overlay' onClick={closeOCModal}>
                <div className='modal-content'>
                  <div className='py-6 text-xs '>
                    <div>
                      <span className='font-bold'>Category</span> {occupation[0]?.category || 'N/A'}
                    </div>
                    <div>
                      <span className='font-bold'>Est. Revenue p.a.</span>{' '}
                      {occupation[0]?.annualRevenue || 'N/A'}
                    </div>
                    <div>
                      <span className='font-bold'>Est. Valuation</span>{' '}
                      {occupation[0]?.valuation || 'Estimating...'}
                    </div>
                    <div className='my-2'>
                      <span className='font-bold'>Other Facts</span>:
                      <div className='font-light text-gray-300' style={{ textJustify: 'auto' }}>
                        {occupation[0]?.facts
                          ? occupation[0]?.facts
                          : `Facts are being collected for ${
                              occupation[0]?.currentcompanies || 'the company'
                            }`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className='AppGlassB p-4' onClick={openEDModal}>
              <div className='text-xs'>
                <p className='font-bold'>Education</p>
                {education?.colleges?.[0]}
              </div>
            </div>
            {isEducationModalOpen && (
              <div className='overlay' onClick={closeEDModal}>
                <div className='modal-content'>
                  <div className='py-6 text-xs '>
                    <div>
                      <span className='font-bold'>School</span>
                      {education?.colleges &&
                        education.colleges.slice(1).find((item) => item.includes('School'))}
                    </div>
                    <div>
                      <span className='font-bold'>College</span>
                      {education?.colleges?.[0]}
                    </div>
                    <div>
                      <span className='font-bold'>Degree</span>
                      {education?.degrees?.[0]}
                    </div>
                    <div>
                      <span className='font-bold'>Acceptance Rate</span>
                      {education[0]?.acceptancerateorrank}
                    </div>
                    {/* <div className='my-2'>
                                <span className='font-bold'>Other Facts</span>: <p>--</p>
                            </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='text-xs mt-4'>
            {showFullText
              ? sentences?.map((sentence, index) => <p key={index}>{sentence}</p>)
              : sentences?.slice(0, 2).map((sentence, index) => <p key={index}>{sentence}</p>)}

            <button onClick={toggleShowFullText} style={{ fontSize: '10px', color: 'gray' }}>
              {showFullText ? 'Show Less' : 'Read More'}
            </button>
          </div>

          <div className='w-full py-4'>
            <p className='text-base font-bold'>Background</p>

            <div className=' mt-6  text-xs flex flex-row justify-evenly gap-x-2 px-2'>
              <div className='w-1/2 border align-center rounded-lg border-gray-700 p-4'>
                <tr>Current Role 2</tr>
                <tr>Past Role 1</tr>
                <tr>Past Role 2</tr>
                <tr>Past Role 3</tr>
              </div>
              <div className='w-1/2 border align-center rounded-lg border-gray-700 p-4'>
                <tr>Current Company 2</tr>
                <tr>Past company</tr>
                <tr>Past company</tr>
                <tr>Past company</tr>
              </div>
            </div>
          </div>

          <div className='w-full py-4'>
            <p className='text-base font-bold'>Key Skills & Interests</p>
            <div className='flex flex-wrap align-center gap-y-2 mt-4 px-2'>
              {wordCloudData.slice(0, 10).map((data, index) => (
                <div
                  key={index}
                  className='text-xs text-center border rounded-full border-gray-700 p-1 px-2 text-gray-300 font-light'
                >
                  {data.text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              className='text-xs p-2 mx-8 my-6 border rounded-lg border-gray-700'
              onClick={openNWModal}
            >
              View Network
            </div>

            {isNetworkModalOpen && network?.top15_MutualData && (
              <div className='overlay' onClick={closeNWModal}>
                <div className='modal-content p-2'>
                  {network?.top15_MutualData && (
                    <ul className='flex flex-wrap justify-between overflow-y-scroll'>
                      {network.top15_MutualData.map((url, index) => (
                        <li className='flex flex-col  w-1/3 mb-4' key={index}>
                          <span className='text-center font-bold'>{url.full_name}</span>
                          <span className='text-center font-light'>{url.category}</span>
                          <span className='text-center  font-light'>
                            Followers: {url.follower_count}
                          </span>
                          <span className='text-center text-gray-500'>@{url.username}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='flex w-full justify-evenly px-4'>
        {isVerifyAdmin && (
          <Button
            btntype='submit'
            handleClick={handleRestart}
            btnText={'Restart'}
            className='button'
          />
        )}

        <Button
          btntype='submit'
          handleClick={handleGoToHome}
          btnText={'Go to Home'}
          className='button'
        />
      </div>
    </div>
  );
}
