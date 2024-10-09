const SubCard = ({ value, label }) => {
  return (
    <div className='w-33'>
      <div className='text-xs'>{value ?? '0'}</div>
      <div className='text-sm'>{label}</div>
    </div>
  );
};

export default SubCard;
