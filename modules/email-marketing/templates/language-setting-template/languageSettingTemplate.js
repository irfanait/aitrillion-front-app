import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Row, Col, Typography, Skeleton, App, Spin } from 'antd';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEmailLanguageSettingApi,
  updateEmailLanguageSettings,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { LayoutContainer } from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';

const { Title } = Typography;

const LanguageSettingTemplate = () => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );
  const { shop_id = '' } = userDetails || {};

  const {
    getEmailLanguageSettingData,
    getEmailLanguageSettingLoading,
    updateEmailSettingLoading,
    updateEmailSettingApiState,
    updateEmailSettingMessage,
  } = useSelector((state) => state.emailMarketingSettingsState);

  // ✅ Fetch data
  useEffect(() => {
    if (shop_id) {
      dispatch(
        getEmailLanguageSettingApi({
          act: 'get_email_language',
          shop_id,
        })
      );
    }
  }, [shop_id]);

  // ✅ Watch for success from Redux
  useEffect(() => {
    if (updateEmailSettingApiState === 'success') {
      notification.success({
        message: updateEmailSettingMessage || 'Updated successfully!',
      });
    } else if (updateEmailSettingApiState === 'error') {
      notification.error({
        message: updateEmailSettingMessage || 'Something went wrong',
      });
    }
  }, [updateEmailSettingApiState, updateEmailSettingMessage]);

  // ✅ New initial values matching API keys
  const initialValues = {
    heading: getEmailLanguageSettingData?.heading || 'Personalize your inbox',
    note:
      getEmailLanguageSettingData?.note ||
      'Note: If you don’t check any type of communication, you’ll receive our emails.',
    select_communication_text:
      getEmailLanguageSettingData?.select_communication_text ||
      'Select the type of communication you would like to unsubscribe.',
    communication_type_1:
      getEmailLanguageSettingData?.communication_type_1 ||
      'Marketing email campaigns',
    communication_type_2:
      getEmailLanguageSettingData?.communication_type_2 || 'Transaction emails',
    communication_type_3:
      getEmailLanguageSettingData?.communication_type_3 || 'Review emails',
    communication_type_all:
      getEmailLanguageSettingData?.communication_type_all || 'All of the above',
    no_option_selected_err:
      getEmailLanguageSettingData?.no_option_selected_err ||
      'Please select at least one option to proceed with unsubscribing.',
    unsubscribe_btn_text:
      getEmailLanguageSettingData?.unsubscribe_btn_text || 'Unsubscribe Me',
    saving: getEmailLanguageSettingData?.saving || 'Saving...',
    redirection_link_text:
      getEmailLanguageSettingData?.redirection_link_text ||
      'Return to our website',
    you_are_unsubscribed:
      getEmailLanguageSettingData?.you_are_unsubscribed ||
      'You are now unsubscribed',
    unsubscribe_success_msg:
      getEmailLanguageSettingData?.unsubscribe_success_msg ||
      'Your preferences have been updated successfully.',
    unsubscribe_error_msg:
      getEmailLanguageSettingData?.unsubscribe_error_msg ||
      'Something went wrong.',
    invalid_customer:
      getEmailLanguageSettingData?.invalid_customer || 'Invalid customer.',
  };

  // ✅ Arrow function to handle form submit
  const handleUpdateEmailLanguageSettings = (values) => {
    const payload = {
      act: 'save_email_language',
      shop_id,
      language_json: values,
    };

    dispatch(updateEmailLanguageSettings(payload));
  };

  return (
    <LayoutContainer>
      <MainWrapper>
        <AitPageHeader title="Language settings" hideButton />
        <AitCard>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => {
              handleUpdateEmailLanguageSettings(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Title level={4} style={{ marginBottom: '20px' }}>
                      Email unsubscribe language setting
                    </Title>
                  </Col>
                </Row>

                {getEmailLanguageSettingLoading ? (
                  <Spin />
                ) : (
                  <Row gutter={[24, 24]}>
                    <Col xs={24}>
                      <Field
                        as={AitInputBox}
                        name="heading"
                        label="Personalize your inbox"
                        placeholder="Personalize your inbox"
                      />
                    </Col>

                    <Col xs={24}>
                      <Field
                        as={AitInputBox}
                        name="note"
                        label="Note text"
                        placeholder="Note text"
                      />
                    </Col>

                    <Col xs={24}>
                      <Field
                        as={AitInputBox}
                        name="select_communication_text"
                        label="Select the type of communication you would like to unsubscribe."
                        placeholder="Select communication text"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="communication_type_1"
                        label="Marketing email campaigns"
                        placeholder="Marketing email campaigns"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="communication_type_2"
                        label="Transaction emails"
                        placeholder="Transaction emails"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="communication_type_3"
                        label="Review emails"
                        placeholder="Review emails"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="communication_type_all"
                        label="All of the above"
                        placeholder="All of the above"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="no_option_selected_err"
                        label="Error message (Please select at least one option)"
                        placeholder="Error message"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="unsubscribe_btn_text"
                        label="Unsubscribe Me"
                        placeholder="Unsubscribe Me"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="saving"
                        label="Saving..."
                        placeholder="Saving..."
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="redirection_link_text"
                        label="Return to our website"
                        placeholder="Return to our website"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="you_are_unsubscribed"
                        label="You are now unsubscribed"
                        placeholder="You are now unsubscribed"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="unsubscribe_success_msg"
                        label="Unsubscribe success message"
                        placeholder="Success message"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="unsubscribe_error_msg"
                        label="Error message (Something went wrong)"
                        placeholder="Error message"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <Field
                        as={AitInputBox}
                        name="invalid_customer"
                        label="Error message (Invalid customer)"
                        placeholder="Invalid customer"
                      />
                    </Col>

                    <Col xs={24}>
                      <AitButton
                        htmlType="submit"
                        title="Update"
                        type="primary"
                        loading={updateEmailSettingLoading}
                      />
                    </Col>
                  </Row>
                )}
              </Form>
            )}
          </Formik>
        </AitCard>
      </MainWrapper>
    </LayoutContainer>
  );
};

export default LanguageSettingTemplate;
