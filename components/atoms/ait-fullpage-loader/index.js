import React from 'react';
import { Skeleton, Spin } from 'antd';
import { LoaderContainer, LoaderContent, Overlay } from './style';

const FullPageLoader = ({
  loading,
  initalLoading,
  children,
  extraStyle = false,
  padding = false,
}) => {
  return (
    <div padding={padding}>
      {loading && (
        <Overlay extraStyle={extraStyle}>
          <Spin size="large" />
        </Overlay>
      )}
      <div extraStyle={extraStyle}>{children}</div>
    </div>
  );
};

export default FullPageLoader;
