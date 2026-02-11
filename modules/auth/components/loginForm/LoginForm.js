import React, { useEffect } from 'react';
import {
  Button,
  Checkbox,
  Typography,
  Divider,
  Row,
  Col,
  notification,
} from 'antd';
import { GoogleOutlined, FacebookFilled } from '@ant-design/icons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import {
  FullHeightRow,
  LoginCol,
  LogoWrapper,
  LoginContainer,
  StyledTitle,
  StyledText,
  FooterText,
  FieldWrapper,
} from './style';
import { loginValidationSchema } from '../../utils/validation';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useDispatch, useSelector } from 'react-redux';
import { loginReset, loginUser, saveToken } from '../../authSlices/authSlice';
import { setUserLogin } from '@/utils/authHelpers';
import { App } from 'antd';

const { Text } = Typography;

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const loggeInUserState = useSelector((state) => state.loggeInUserState);

  const initialValues = {
    email: '',
    password: '',
    module: 1,
    remember: false,
  };

  useEffect(() => {
    if (loggeInUserState.apiState === 'success') {
      const { email, password } = loggeInUserState?.loginPayload;
      const formData = new FormData();
      formData.append('act', 'login');
      formData.append('platform', 'react');
      formData.append('email', email);
      formData.append('password', password);
      formData.append('source_page', 'login');
      formData.append('ai_auth_token', loggeInUserState?.data?.token);

      if (
        loggeInUserState?.data?.max_attempt === true ||
        loggeInUserState?.data?.auth === false
      ) {
        notification.error({
          message: loggeInUserState.message,
        });
      } else {
        dispatch(saveToken(formData));
      }
    }

    if (loggeInUserState.apiState === 'error') {
      notification.error({
        message: loggeInUserState.message,
      });

      dispatch(loginReset());
    }
  }, [loggeInUserState.apiState]);

  useEffect(() => {
    if (loggeInUserState?.saveTokenState === 'success') {
      notification.success({ message: 'Login successful' });
      // localStorage.setItem('auth_token', data?.ai_auth_token);
      setUserLogin(loggeInUserState?.saveTokenData);
      router.push('/');
      dispatch(loginReset());
    }

    if (loggeInUserState?.saveTokenState === 'error') {
      notification.error({ message: 'Token save failed' });
      dispatch(loginReset());
    }
  }, [loggeInUserState?.saveTokenState]);

  const handleSubmit = (values) => {
    const payload = {
      email: values.email,
      module: 1,
      password: values.password,
    };
    dispatch(loginUser(payload));
  };

  return (
    <FullHeightRow justify="center" align="middle">
      <LoginCol xs={22} sm={16} md={12} lg={8} xl={8}>
        <LogoWrapper>
          <Image
            src="/AiTrillion-App-logo.png"
            alt="Logo"
            height={50}
            width={150}
          />
        </LogoWrapper>

        <LoginContainer>
          <StyledTitle level={3}>Sign in</StyledTitle>
          <StyledText>
            Don't have an account? <a href="/register">Register</a>
          </StyledText>

          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
              setFieldValue,
            }) => (
              <Form>
                <FieldWrapper>
                  <Field
                    as={AitInputBox}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={touched.email && !!errors.email}
                    errorMessage={errors.email}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <Field
                    as={AitInputBox}
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    passwordInput
                    required
                    error={touched.password && !!errors.password}
                    errorMessage={errors.password}
                    style={{ padding: '8px 12px' }}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <Row justify="space-between">
                    <Field
                      as={Checkbox}
                      checked={values.remember}
                      onChange={(e) =>
                        setFieldValue('remember', e.target.checked)
                      }
                    >
                      Remember me
                    </Field>
                    <a href="/forgot-password">Forgot your password?</a>
                  </Row>
                </FieldWrapper>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    loggeInUserState.apiState === 'pending' ||
                    loggeInUserState?.saveTokenState === 'pending'
                  }
                  block
                >
                  Sign in
                </Button>
              </Form>
            )}
          </Formik>

          <Divider>Or continue with</Divider>

          <Row gutter={16} justify="center">
            <Col span={12}>
              <Button
                block
                icon={<GoogleOutlined />}
                style={{ background: '#DB4437', color: '#fff' }}
              >
                Google
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                icon={<FacebookFilled />}
                style={{ background: '#1877F2', color: '#fff' }}
              >
                Facebook
              </Button>
            </Col>
          </Row>
        </LoginContainer>

        <FooterText>
          <Text>
            Join your hands with AiTrillion <a href="#">Become a partner</a>
          </Text>
        </FooterText>
      </LoginCol>
    </FullHeightRow>
  );
};

export default LoginForm;
