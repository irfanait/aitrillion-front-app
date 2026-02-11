import React, { useEffect, useState } from 'react';
import { LayoutContainer } from './style';
import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { App, Col, Divider, Row, Space, Spin, Typography } from 'antd';
import { Field, Form, Formik } from 'formik';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDkimStatusApi,
  getLanguageSettingApi,
  startGuideApi,
  usageRestrictionApi,
  validateDomainInstructionApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { saveDkimValidationSchema } from '../../utils/validation';
import DkimSettingDetailsTemplate from '../dkim-setting-details-template/dkimSettingDetailsTemplate';
import {
  startGuideReset,
  usageEmailSettingReset,
  validateDomainInstructionReset,
} from '@/redux/email-marketing-slices/settingsSlice/settingsSlice';
import { useRouter } from 'next/router';
import { setAccessModuleWithMappingState } from '@/redux/logged-in-user-details-slice/jwtSlice';
const { Link, Paragraph } = Typography;

const DkimSettingTemplate = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { notification } = App.useApp();
  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );

  const { login_auth, accessModuleWithMappingState } = useSelector(
    (state) => state.jwtState
  );
  const accessModuleWithMapping = login_auth?.accessModuleWithMapping || null;

  const { shop_id = '' } = userDetails || {};
  const {
    usageRestirictionApiState,
    usageRestirictionLoading,
    usageRestirictionData,
    startGuideApiState,
    startGuideData,
    startGuideMessage,
    startGuideLoading,
    getDkimStatusData,
    getDkimStatusApiState,
    getDkimStatusLoading,
    validateDomainInstructionApiState,
    validateDomainInstructionData,
    validateDomainInstructionMessage,
  } = useSelector((state) => state.emailMarketingSettingsState);
  const data = useSelector((state) => state.emailMarketingSettingsState);

  const { dkimData } = getDkimStatusData;

  //.................

  //.................
  const mappedInitialValues = {
    fromEmail: dkimData?.from_email || login_auth?.email,
    fromName:
      dkimData?.from_name ||
      login_auth?.first_name + ' ' + login_auth?.last_name,
    replyTo: dkimData?.reply_to || login_auth?.email,
    companyAddress: dkimData?.address || '', // API key is "address"
    replace_replayto_inallplace: false, // Assuming default, not provided by API
    city: dkimData?.city || '',
    state: dkimData?.state || '',
    zipCode: dkimData?.pin || '', // API key is "pin"
    country: dkimData?.country || '',
  };

  const [formData, setFormData] = useState(mappedInitialValues);
  const [dkimStatus, setDkimStatus] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dkimStatusLoading, setDkimStatusLoading] = useState(true);

  useEffect(() => {
    dispatch(getDkimStatusApi({ act: 'get_dkim_status' }))
      .unwrap()
      .then(() => setDkimStatusLoading(false))
      .catch(() => setDkimStatusLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (router?.query?.campaignId) {
      setIsEditing(true);
    }
  }, [router?.query]);

  useEffect(() => {
    if (getDkimStatusApiState === 'success') {
      setIsEditing(false);
      setDkimStatus(dkimData?.dkim_status);
    }
  }, [getDkimStatusApiState]);

  useEffect(() => {
    // dispatch when we have the mapping object and dkimStatus is known (allow '0' or '1')
    //  console.log('DKIM dispatch check', { accessModuleWithMapping, dkimStatus });
    if (dkimStatus == 1) {
      dispatch(
        setAccessModuleWithMappingState({
          dkimStatus,
        })
      );
    }
  }, [dispatch, dkimStatus]);

  useEffect(() => {
    if (usageRestirictionApiState === 'success') {
      if (usageRestirictionData?.is_limit_available === 0) {
        router.push(`/popup?act=upgrade`);
      }

      saveStartGuide();
      dispatch(usageEmailSettingReset());
    }
  }, [usageRestirictionApiState]);

  useEffect(() => {
    if (startGuideApiState === 'success') {
      if (router?.query?.campaignId) {
        router.push(
          `/email-marketing/campaign/${router?.query?.campaignId}/edit-campaign`
        );
      }

      notification.success({
        message: startGuideMessage,
      });

      setIsEditing(false);
      setDkimStatus(startGuideData?.dkim_status);
      dispatch(startGuideReset());
      dispatch(getDkimStatusApi({ act: 'get_dkim_status' }));
    }

    if (startGuideApiState === 'error') {
      notification.error({
        message: startGuideMessage,
      });
      dispatch(startGuideReset());
    }
  }, [startGuideApiState]);

  useEffect(() => {
    if (validateDomainInstructionApiState === 'success') {
      if (validateDomainInstructionData?.sendGridDNSArr) {
        dispatch(validateDomainInstructionReset());
        handleValidateDomain();
      }

      if (validateDomainInstructionData?.status === 0) {
        notification.error({
          message: validateDomainInstructionMessage,
        });
      }
    }

    if (validateDomainInstructionApiState === false) {
      if (
        validateDomainInstructionData?.status === 0 &&
        validateDomainInstructionData?.dkim_status === 2
      ) {
        notification.error({
          message: validateDomainInstructionMessage,
        });
      }
      // status === 1 ==> success
      //
    }
  }, [validateDomainInstructionApiState]);

  const handleSubmit = (values) => {
    setFormData(values);
    const payload = {
      act: 'get_usage_restriction',
      act_module: 'get_activate_module_by_id',
      login_id: userDetails?.id,
      shop_id: shop_id,
      selected_current: '8', // this will be confirm with the subhash sir
    };
    dispatch(usageRestrictionApi(payload));
  };

  const saveStartGuide = () => {
    const startGuidePayload = {
      act: 'saveEmailData',
      FromName: formData?.fromName,
      FromEmail: formData?.fromEmail,
      ReplyTo: formData?.replyTo,
      address: formData?.companyAddress, // match field name from Formik
      country: formData?.country,
      state: formData?.state,
      city: formData?.city,
      postalCode: formData?.zipCode,
      replace_replayto_inallplace: formData?.replace_replayto_inallplace,
    };

    dispatch(startGuideApi(startGuidePayload));
  };

  const handleValidateDomainInstruction = () => {
    const payload = {
      act: 'validate_domain_instruction',
      fromEmail: dkimData?.from_email || '',
      fromName: dkimData?.from_name || '',
      email: dkimData?.from_email || '',
    };

    dispatch(validateDomainInstructionApi(payload));
  };

  const handleValidateDomain = () => {
    const payload = {
      act: 'validate_domain',
      email: dkimData?.from_email || '',
    };
    dispatch(validateDomainInstructionApi(payload));
  };

  return (
    <LayoutContainer>
      {/*StickyAlertWrapper*/}
      <MainWrapper>
        <AitPageHeader title="DKIM settings" hideButton />
        <div style={{ width: '100%' }}>
          {getDkimStatusLoading ? (
            <div
              style={{
                textAlign: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '40px 0',
              }}
            >
              <Spin size="large" />
              <div style={{ marginTop: 8 }}>Checking DKIM status...</div>
            </div>
          ) : !dkimStatus || dkimStatus === '0' || isEditing ? (
            <Formik
              initialValues={mappedInitialValues}
              enableReinitialize
              validationSchema={saveDkimValidationSchema}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <AitCard
                    bodypadding={{
                      xs: '20px',
                      sm: '20px 24px',
                      md: '24px',
                    }}
                    style={{
                      borderRadius: '10px',
                      background: '#fff',
                      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                    }}
                  >
                    <>
                      <Paragraph type="default">
                        This page allows you to set up your dedicated sending
                        domain for use on AiTrillion.
                      </Paragraph>
                      <Paragraph type="default">
                        Adding your own domain decreases the chances of your
                        campaigns and automated emails ending up in a spam
                        folder.
                      </Paragraph>
                      <Row>
                        <Col xs={24} md={19}>
                          <Paragraph type="secondary">
                            You're required to include your contact information,
                            including a physical mailing address, inside every
                            promotional email you send in order to comply with
                            anti-spam laws such as{' '}
                            <Link
                              target="_blank"
                              href="https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business"
                            >
                              CAN-SPAM
                            </Link>{' '}
                            and{' '}
                            <Link
                              target="_blank"
                              href="https://en.wikipedia.org/wiki/CASL"
                            >
                              CASL
                            </Link>
                            .
                          </Paragraph>
                        </Col>
                      </Row>

                      <Row
                        gutter={[16, 24]}
                        style={{ marginBottom: 24, marginTop: 20 }}
                      >
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="From email address"
                            name="fromEmail"
                            placeholder="From email address"
                            error={touched.fromEmail && !!errors.fromEmail}
                            errorMessage={touched.fromEmail && errors.fromEmail}
                            required
                          />
                        </Col>
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="From name"
                            name="fromName"
                            placeholder="From name"
                            error={touched.fromName && !!errors.fromName}
                            errorMessage={touched.fromName && errors.fromName}
                            required
                          />
                        </Col>
                      </Row>

                      {/* Second Row: Reply To and Company Address */}
                      <Row gutter={[16, 24]} style={{ marginBottom: 0 }}>
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="Reply to"
                            name="replyTo"
                            placeholder="Reply to"
                            error={touched.replyTo && !!errors.replyTo}
                            errorMessage={touched.replyTo && errors.replyTo}
                            required
                          />
                        </Col>
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="Company address"
                            name="companyAddress"
                            placeholder="Company address"
                          />
                        </Col>
                      </Row>

                      {/* Checkbox */}
                      <Row style={{ marginTop: 24 }}>
                        <Col span={24}>
                          <Field
                            as={AitCheckboxButton}
                            checked={values.replace_replayto_inallplace}
                            name="replace_replayto_inallplace"
                            onChange={(e) =>
                              setFieldValue(
                                'replace_replayto_inallplace',
                                e.target.checked
                              )
                            }
                            label='Set as "Reply to" email'
                          />
                        </Col>
                      </Row>

                      {/* Divider */}
                      <Divider
                        style={{
                          margin: '10px 0px 24px 0px',
                          backgroundColor: '#e9f0ff',
                        }}
                      />

                      {/* Third Row: City & State */}
                      <Row gutter={[16, 24]} style={{ marginBottom: 24 }}>
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="City"
                            name="city"
                            placeholder="City"
                          />
                        </Col>
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="State"
                            name="state"
                            placeholder="State"
                          />
                        </Col>
                      </Row>

                      {/* Fourth Row: Zip Code & Country */}
                      <Row gutter={[16, 24]} style={{ marginBottom: 10 }}>
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="Zip code"
                            name="zipCode"
                            placeholder="Zip Code"
                          />
                        </Col>
                        <Col xs={24} md={7}>
                          <Field
                            as={AitInputBox}
                            label="Country"
                            name="country"
                            placeholder="Country"
                          />
                        </Col>
                      </Row>
                    </>
                  </AitCard>

                  <Row style={{ marginTop: 24 }}>
                    <Col
                      xs={24}
                      md={7}
                      style={{ display: 'flex', gap: '10px' }}
                    >
                      <AitButton
                        title={dkimStatus === '0' ? 'Save' : 'Update'}
                        type="primary"
                        htmlType="Submit"
                        loading={usageRestirictionLoading || startGuideLoading}
                      />
                      {isEditing && (
                        <AitButton
                          title="Cancel"
                          variant="filled"
                          color="default"
                          onClick={() => {
                            setDkimStatus('1');
                            setIsEditing(false);
                            dispatch(
                              getDkimStatusApi({ act: 'get_dkim_status' })
                            );
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          ) : (
            <DkimSettingDetailsTemplate
              fromEmail={dkimData?.from_email}
              domainName={dkimData?.domain_name}
              onUpdateClick={() => setIsEditing(true)}
              onValidateClick={() => handleValidateDomainInstruction()}
              dkimStatus={dkimStatus}
            />
          )}
        </div>
      </MainWrapper>
    </LayoutContainer>
  );
};

export default DkimSettingTemplate;
