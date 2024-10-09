import React from 'react';
import { CircularProgress } from '@material-ui/core';

const FeedbackLoading = ({ data }) => {
  return (
    <>
      <div className='mt-24'>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            width: '390px',
          }}
        >
          <div style={{ position: 'relative' }}>
            <CircularProgress
              variant='determinate'
              value={data?.percentage_complete ?? 0}
              size={200}
            />
          </div>
          <h1 style={{ position: 'absolute', fontSize: 'large', fontWeight: '700' }}>
            {data?.percentage_complete ?? 0} %
          </h1>
        </div>
      </div>
      <div style={{ fontSize: 'large', fontWeight: '700', margin: '20px' }}>
        Status: {data?.status ?? ''}
      </div>
      <hr />
      <br />
      <div style={{ fontSize: 'large', fontWeight: '500', margin: '20px' }}>
        Current Step: {data?.current_step ?? ''}
      </div>
    </>
  );
};

export default FeedbackLoading;
