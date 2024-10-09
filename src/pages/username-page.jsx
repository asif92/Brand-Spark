import React from 'react';
import Section from '../components/section';

const UsernamePage = ({
  username,
  setUsername,
  activeSection,
  setActiveSection,
  sectionStylingClasses,
}) => {
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    setActiveSection((prev) => prev + 1);
    localStorage.setItem('username', username.startsWith('@') ? username : `@${username}`);
    localStorage.setItem('activeSection', 7);
  };

  return (
    <Section
      title='ENTER ONE USERNAME'
      description='Please enter one from Linkedin or Instagram'
      placeholder='@username'
      inputType='text'
      onSubmit={handleUsernameSubmit}
      value={username.startsWith('@') ? username : `@${username}`}
      setValue={setUsername}
      buttonText={'Proceed'}
      stylingClass={sectionStylingClasses[activeSection]}
      setActiveSection={setActiveSection}
      previousSection={5}
    />
  );
};

export default UsernamePage;
