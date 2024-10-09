export const isNumber = (number) =>
  typeof number === Number || !(typeof number === String || isNaN(number));

export const isFullNameValid = (name) => {
  const regex = /^[a-zA-Z]+ [a-zA-Z]+$/;
  return regex.test(name);
};

export const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};


export const getRandomNumber = (min, max) => {
  return   Math.floor(Math.random() * (max - min + 1)) + min
}