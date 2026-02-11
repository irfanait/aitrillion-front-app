import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';

const BackButton = ({ marginTop, color, handleBack }) => {
  const router = useRouter();

  // const handleBack = () => {
  //   if (window.history.length > 1) {
  //     router.back();
  //   } else {
  //     router.push('/'); // or any fallback route
  //   }
  // };

  return (
    <div style={{ color: color }}>
      <ArrowLeftOutlined
        style={{ fontSize: 18, cursor: 'pointer', marginTop: marginTop }}
        onClick={handleBack}
      />
    </div>
  );
};

export default BackButton;
