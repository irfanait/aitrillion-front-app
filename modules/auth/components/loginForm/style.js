import styled from "styled-components";
import { Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

export const FullHeightRow = styled(Row)({
  height: "100vh",
  background: "#f8f9fa",
  padding: "10px",
  overflow: "hidden",
});

export const LoginCol = styled(Col)({
  "@media (max-width: 768px)": {
    padding: "0 8px",
  },
});

export const LogoWrapper = styled("div")({
  textAlign: "center",
  marginBottom: "20px",
  "img":{
    marginLeft:'auto',
    marginRight:'auto'
  }
});

export const LoginContainer = styled("div")({
  background: "#fff",
  padding: "40px 40px 24px",
  borderRadius: "16px",
  border: "1px solid #d5e4f3",
  maxWidth: "100%",
  overflow: "hidden",
  "@media (max-width: 768px)": {
    padding: "24px",
  },
});

export const StyledTitle = styled(Title)({
  textAlign: "left",
  marginBottom: "8px",
});

export const StyledText = styled(Text)({
  display: "block",
  textAlign: "left",
  marginBottom: "16px",
});

export const FooterText = styled("div")({
  textAlign: "center",
  marginTop: "16px",
});

export const ErrorText = styled("div")({
  color: "red",
  fontSize: "12px",
});

export const FieldWrapper = styled("div")({
  marginBottom: "16px",
});
