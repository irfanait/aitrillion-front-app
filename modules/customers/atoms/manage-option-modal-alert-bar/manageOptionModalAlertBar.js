import React from 'react';
import { LimitAlert } from '../custom-field-alert-bar/style';



const ManageOptionModalAlertBar = () => {
  return (
    <>
      <LimitAlert
        message={
          <>
            {/* This wrapper breaks AntD's internal centering */}
            <div
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'flex-start',
              }}
            >
              {/* LEFT TEXT */}
              <div
                style={{
                  fontSize: '14px',
                  color: '#4A566B',
                  flexGrow: 1,
                  textAlign: 'left',
                }}
              >
                If any updates are made to the options, please ensure to update
                the corresponding fields on the newsletter signup popup
                accordingly.
              </div>
            </div>
          </>
        }
        banner
        bgcolor="#FFF5EB"
        color="#4A566B"
        iconcolor="#ffda38ff"
      />
    </>
  );
};

export default ManageOptionModalAlertBar;
