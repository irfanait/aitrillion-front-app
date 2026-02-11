import styled from 'styled-components';

export const LoaderContainer = styled.div`
  position: relative;
  ${(props) =>
    props.padding &&
    `padding-top:${props.padding || '5px'};
  `}
`;

export const Overlay = styled.div`
  position: absolute;
  inset: 0; /* top:0 right:0 bottom:0 left:0 */
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;

  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.7);

  pointer-events: auto;
`;

export const LoaderContent = styled.div`
  position: relative;
  z-index: 1;

  ${(props) =>
    props.extraStyle &&
    `
     filter: blur(4px);  
     pointer-events: none; 
  `}
`;
