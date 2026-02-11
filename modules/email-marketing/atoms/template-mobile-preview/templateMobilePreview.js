import React from 'react';
import { PhoneFrame, PreviewIframe } from './style';

const TemplateMobilePreview = (props) => {
  const { htmlString } = props;
  return (
    <>
      <PhoneFrame>
        <PreviewIframe title="Mobile Email" srcDoc={htmlString} />
      </PhoneFrame>
    </>
  );
};

export default TemplateMobilePreview;
