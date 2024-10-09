import React, { useState, useEffect, useRef } from 'react';

import Lottie from 'react-lottie';
import * as animationData from '../searching.json';
import * as NewAnimationData from '../landscape.json';

const TypingText = ({ text, style, duration = 3000 }) => {
  const [displayText, setDisplayText] = useState('');
  const textRef = useRef();
  const animationFrameRef = useRef();

  useEffect(() => {
    let animationStartTime = null;

    const animateText = (timestamp) => {
      if (!animationStartTime) animationStartTime = timestamp;
      const progress = timestamp - animationStartTime;
      const charIndex = Math.floor((progress / duration) * text.length);

      if (charIndex < text.length) {
        setDisplayText(text.substring(0, charIndex + 1));
        animationFrameRef.current = requestAnimationFrame(animateText);
      } else {
        setDisplayText(text);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateText);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [text, duration]);

  useEffect(() => {
    if (displayText === text && textRef.current) {
      textRef.current.scrollLeft = textRef.current.scrollWidth;
    }
  }, [displayText, text]);

  return (
    <p ref={textRef} style={style}>
      {displayText}
    </p>
  );
};

const CheckEligibilityPage = ({ onEligibilityChecked }) => {
  const [socialScore, setSocialScore] = useState(701);
  const [showNewContent, setShowNewContent] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const newDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NewAnimationData, // Assuming you have imported the new animation data
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewContent(true);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className='AppExtra backgroundlineargradient'>
      {showNewContent ? (
        <div style={styles.textContainer}>
          <TypingText style={styles.subHeading} text="we've been able to identify you" />
          <div style={styles.descriptionView}>
            <TypingText style={styles.description} text='checking eligibility to join Brand Spark' />
          </div>
          <Lottie options={newDefaultOptions} height={500} width={400} />
        </div>
      ) : (
        <div style={styles.textContainer}>
          <TypingText style={styles.subHeading} text='searching the web for your profile' />
          <div style={styles.descriptionView}>
            <TypingText
              style={styles.description}
              text='learning from millions of data points and building connections'
            />
          </div>
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      )}
    </div>
  );
};

export default CheckEligibilityPage;

const styles = {
  textContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50px',
  },
  subHeading: {
    color: 'white',
    opacity: 1,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 28,
    lineHeight: 1,
    textAlign: 'center',
    marginTop: -20,
    padding: 24,
    display: 'inline-flex',
  },
  descriptionView: {
    marginTop: -24,
    display: 'inline-flex',
  },
  description: {
    color: 'white',
    fontFamily: 'Montserrat',
    fontSize: 14,
    lineHeight: 1.5,
    textAlign: 'left',
    padding: 24,
    marginBottom: 16,
  },
};
