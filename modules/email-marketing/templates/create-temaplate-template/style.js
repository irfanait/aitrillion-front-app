import styled from 'styled-components';

// Styled components
export const NotificationZone = styled.div`
  // position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
`;

export const LoaderWrapper = styled.div`
  display: none; /* default hidden */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;

  img {
    width: 80px;
    height: 80px;
  }
`;

export const EditorWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  height: 100vh;
  overflow: hidden;
`;

export const SettingsContainer = styled.div`
  width: 400px;
  border-right: 1px solid #ddd;
  background: #f9f9f9;
  overflow-y: auto;
  height: 100vh;
`;

export const PreviewContainer = styled.div`
  flex: 1;
  background: #f6f6f6;
  height: 100vh;
  overflow-y: auto;
`;
export const SkeletonDiv = styled.div`
  position: absolute; /* ✅ overlay over entire editor */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoaderOverlay = styled.div`
  position: absolute; /* ✅ overlay doesn't push layout */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Fade animation */
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;

  /* ✅ Allow clicks to pass through when invisible */
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
`;

export const LoaderContent = styled.div`
  .stripoContainerLoader {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
