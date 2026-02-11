import styled from 'styled-components';

export const ModuleListContainer = styled.div`
  padding: 0;
`;

export const ModuleColumn = styled.div`
  border-radius: 8px;
  padding: 0px 0px 16px 0px;
  min-height: 300px;
  max-height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding-right: 10px;

  .module-list {
    display: flex;
    flex-direction: column;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
  }
`;

export const ModuleColumnTitle = styled.div`
  letter-spacing: 0.3px;
  text-transform: uppercase;
  padding-left: 10px;
`;

export const ModuleItem = styled.div`
  background: white;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #fff;
  transition: all 0.2s ease;
  user-select: none;
  margin-bottom: 8px;

  &:hover {
    border-color: #eaebed;
    box-shadow: 0px 0px 4px 0px #eaebedcc;
  }

  &.non-movable {
    background: #f9fafb;
    border-color: #fff;

    &:hover {
      border-color: #e5e7eb;
      box-shadow: none;
    }
  }

  &.selected-module {
    background: #f0f5ff;
    border-color: #d6e4ff;
  }
`;

export const ActionIcon = styled.div`
  cursor: pointer;
  color: ${(props) => (props.disabled ? '#d1d5db' : '#5078e1')};
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.disabled ? '#e5e7eb' : '#5078e1')};
  background: ${(props) => (props.disabled ? 'transparent' : 'white')};
  transition: all 0.2s ease;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  flex: 0 0 16px;

  &:hover {
    background: ${(props) => (props.disabled ? 'transparent' : '#f0f5ff')};
    border-color: ${(props) => (props.disabled ? '#e5e7eb' : '#3d5fc4')};
    color: ${(props) => (props.disabled ? '#d1d5db' : '#3d5fc4')};
  }

  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'scale(0.95)')};
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const ModuleIconWrapper = styled.div`
  width: 18px;
  // height: 28px;

  svg {
    //  width: 20px;
    // height: 20px;
  }
`;

export const ModuleName = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: var(--ant-color-text-default);
  flex: 1;
  white-space: nowrap;
  //overflow: hidden;
  //text-overflow: ellipsis;
  //max-width: 84%;
`;

export const ButtonContainer = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background: white;
  color: #4a566b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #5078e1;
    color: #5078e1;
  }
`;

export const NoMoreModuleWrapper = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: var(--ant-color-text-secondary);
  background: #ffffff;
  border-radius: 8px;
  border: 2px dashed #e5e7eb;
  opacity: 0.5;
`;
