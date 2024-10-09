import React, { useState } from 'react';
import Section from '../components/section';
import { isFullNameValid } from '../utils/format';
import { toast } from 'alert';

const NamePage = ({
  activeSection,
  setActiveSection,
  setFirstName,
  setLastName,
  sectionStylingClasses,
}) => {
  const [name, setName] = useState('');

  const handleNameSubmit = (e) => {
    e.preventDefault();

    if (!isFullNameValid(name)) {
      toast.error('Please Enter Full Name');
      return;
    }

    const [firstName, lastName] = name.split(' ');
    setFirstName(firstName);
    setLastName(lastName);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);

    setActiveSection((prev) => prev + 1);
    localStorage.setItem('activeSection', 5);
  };

  return (
    <Section
      title='PLEASE ENTER YOUR FULL NAME'
      description='So we can uniquely identify you'
      placeholder='John Doe'
      inputType='text'
      onSubmit={handleNameSubmit}
      value={name}
      setValue={setName}
      buttonText={'Proceed'}
      stylingClass={sectionStylingClasses[activeSection]}
      setActiveSection={setActiveSection}
      previousSection={3}
    />
  );
};

export default NamePage;
