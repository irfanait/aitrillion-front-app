import { Skeleton } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;

  width: 100%; // Full width for responsiveness
`;

export const StyledSkeletonInput = styled(Skeleton.Input)`
  width: 100%;
  max-width: 1000px; // Max width to avoid very large inputs
  margin-left: 8px;

  // Responsive styling
  @media (max-width: 1200px) {
    width: 80%; // 80% of the container width on medium screens
  }

  @media (max-width: 768px) {
    width: 90%; // 90% of the container width on small screens
  }

  @media (max-width: 480px) {
    width: 100%; // 100% width on extra small screens
  }
`;
