import styled from 'styled-components';

export const LeftScrollableWrapper = styled.div`
  height: calc(100vh - 98px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px;

  @media (max-width: 768px) {
    height: auto;
    max-height: none;
    overflow-y: visible;
    padding-right: 0;
  }
`;

export const Bold = styled.span`
  font-weight: 700;
`;

export const RowItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  margin-bottom: 10px;
  line-height: 20px;
  column-gap: 16px;

  @media (max-width: 576px) {
    //  grid-template-columns: 1fr;
    row-gap: 4px;
    align-items: flex-start;
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
  gap: 6px;
  font-weight: 600;
  color: #4a4a4a;

  span.icon {
    color: #595959;
    display: flex;
    align-items: center;
  }
`;

export const ValueWrapper = styled.div`
  font-weight: 500;
  word-break: break-word;
`;

export const SectionPadding = styled.div`
  padding-top: 14px;
`;

export const CustomFieldsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;
