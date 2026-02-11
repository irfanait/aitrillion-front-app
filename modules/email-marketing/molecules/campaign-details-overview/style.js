const { default: styled } = require('styled-components');

export const StyledColoredDot = styled.span`
  display: inline-block;
  width: 8px; // Adjust size as needed
  height: 8px; // Adjust size as needed
  border-radius: 50%; // Makes it a circle
  background-color: ${(props) => props.color}; // Use props for dynamic color
  margin-left: 4px; // Spacing from the text
  vertical-align: middle; // Aligns the dot with the text
`;
