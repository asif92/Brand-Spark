import axios from 'axios';
import { useState, useRef, useEffect } from 'react';

export const useScoreDisplayPage = ({ userData, error, isLoading, setScore }) => {
  const userId = localStorage.getItem('userid');
  const processid = localStorage.getItem('processId');


  const processId = useRef('');

  const [userAnalysisResponse, setUserAnalysisResponse] = useState("");

  const [isFirstCall, setIsFirstCall] = useState(true);
  const [isStartAnalysisLoading, setIsStartAnalysisLoading] = useState(false);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(true);

  const [feedbackData, setFeedbackData] = useState(null);
  const [startAnalysisError, setStartAnalysisError] = useState(null);
  const [feedbackError, setFeedbackError] = useState(null);
  const [isFeedbackComplete, setIsFeedbackComplete] = useState(false)

  const [scoreData, setScoreData] = useState(null);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState(null);


  const getAnalysis = async () => {

    const userid = localStorage.getItem('userid');
    const procesid = localStorage.getItem('processId');

    const url = `/api/User/AnalysisStatus?id=${userid}&process_id=${procesid}`;

    const options = {
      method: 'GET',
      url: url,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    try {
      // if (!!(feedbackError?.message ?? '')) return;
      const response = await axios.request(options);
      setUserAnalysisResponse(response.data)
      // setFeedbackData(response.data);
      if ((response?.data?.percentage_complete ?? 0) >= 100) {
        setIsFeedbackComplete(true)
      }
      //   setIsFeedbackComplete(true)
      //   setScoreData(JSON.stringify(response?.data))
      // setTimeout(() => {
      //   setIsAnalysisLoading(false)
      // }, 1000)
      // }

    } catch (error) {
      console.log(error.response.data, "error")
      setStartAnalysisError(error)


    }
  };

  useEffect(() => {
    if (localStorage.getItem("activeSection") == 9) {

      const intervalId = setInterval(() => {
        getAnalysis()
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, []);


  useEffect(() => {
    if (processid && userId) {
      getAnalysis()
    }
  }, [processid, userId])
  useEffect(() => {
    if (!!error || isLoading) return;

    const userDataPayload = { ...userData, userid: Number(userId) };
    // initiateAnalysis(userDataPayload);
  }, [userData, userId, error, isLoading]);

  useEffect(() => {
    if (!!startAnalysisError || isStartAnalysisLoading) return;
    if (!processId.current || !userId) return

    if (isFirstCall) {
      if (!isStartAnalysisLoading)
        // getFeedback({ process_id: processId.current, userid: Number(userId) });
        setIsFirstCall(false)
    }

    const intervalId = setInterval(() => {
      // if (!isStartAnalysisLoading)
      // getFeedback({ process_id: processId.current, userid: Number(userId) });
    }, 10000)

    if ((!!feedbackError || (feedbackData?.info?.percentage_complete ?? 0) >= 100) && !isFeedbackLoading) {
      clearTimeout(intervalId)
    }

  }, [userData, processId, isFirstCall, isStartAnalysisLoading, startAnalysisError, isFeedbackLoading, userId]);

  useEffect(() => {
    if (!!feedbackError || isFeedbackLoading) return;
    const scorePayload = { data: scoreData, process_id: processId.current };
    // getScore(scorePayload);
  }, [scoreData, processId, feedbackError, isFeedbackLoading]);


  return {
    isStartAnalysisLoading,
    startAnalysisError,
    isFeedbackLoading,
    feedbackError,
    feedbackData,
    userAnalysisResponse,
    isScoreLoading,
    scoreError,
    isFeedbackComplete
  };
};
