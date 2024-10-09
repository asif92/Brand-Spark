import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubCard from '../components/sub-card';
import Button from '../components/buttonSubmit';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, '0');
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      .toString()
      .padStart(2, '0');

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [calculateTimeLeft]);

  return (
    <div className='text-2xl font-bold mt-2'>
      {timeLeft.days}d {timeLeft.hours}hrs {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

const ViewMorePage = () => {
  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const targetDate = currentDate.getTime();

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userid');
  const getData = async (userId) => {
    setIsLoading(true);
    const url = `/api/User/${userId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getData(userId);
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render error state if there was an error fetching data
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.scoreResponseDTO) {
    return <div>Data not available.</div>;
  }

  return (
    <div className='apperance-none'>
      <div className=' App backgroundlineargradient container'>
        <div className='card mt-4 h-28 w-96 flex flex-coloumn justify-center'>
          <div className=' text-sm '>
            A Brand Spark defines your social standing. Subscores display your level of authentic
            accomplishment in each aspect.{' '}
          </div>
        </div>
        <div className='card h-60 w-96 mt-4'>
          <p className='text-xl mt-4 font-bold'>
            {data.firstName} {data.lastName}
          </p>
          <p className='text-sm font-light'>{data.occupation}</p>
          <div className=' items-center text-4xl font-bold mt-2'>
            {data.scoreResponseDTO.totalscore !== null ? data.scoreResponseDTO.totalscore : '0'}
          </div>

          <div className=''>
            <div className=' flex flex-row  justify-evenly mt-4 '>
              <SubCard value={data.scoreResponseDTO.communityscore} label={'Community'} />
              <SubCard value={data.scoreResponseDTO.leagalscore} label={'Legal'} />
              <SubCard value={data.scoreResponseDTO.influencescore} label={'Influence'} />
            </div>

            <div className=' flex flex-row  justify-evenly mt-4'>
              <SubCard value={data.scoreResponseDTO.educationscore} label={'Education'} />
              <SubCard value={data.scoreResponseDTO.financescore} label={'Finance'} />
              <SubCard value={data.scoreResponseDTO.networkscore} label={'Network'} />
            </div>
          </div>
        </div>

        <div className=' w-96 mt-8 '>
          <div className='text-sm'>
            To see real time analytics, use discoverability heatmap, and get access to exclusive
            networks in
          </div>
          <CountdownTimer targetDate={targetDate} />
          <Button btntype='submit' btnText='App Waitlist' className='bigButton mt-8 ' />
        </div>
      </div>
    </div>
  );
};

export default ViewMorePage;
