import styled from 'styled-components';

export const ModalBody = styled.div`
  text-align: center;
  padding: 24px;

  .icon {
    font-size: 40px;
    color: #fa8c16; // Ant Design orange
    margin-bottom: 16px;
  }

  .message {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
`;
