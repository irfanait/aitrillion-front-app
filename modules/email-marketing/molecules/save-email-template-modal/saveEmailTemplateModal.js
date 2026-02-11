import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCheckboxButton from '@/components/atoms/ait-checkbox/aitCheckbox';
import { ButtonWrapper } from './style';
import { Field, Form, Formik } from 'formik';
import { templateSaveExitValidationSchema } from '../../utils/validation';
import { saveNewTemplateDataApi } from '@/redux/apis/stripo-api/stripoApi';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { notification } from 'antd';
import { saveEmailTemplateReset } from '@/redux/stripo-slices/stripo-slice';

const SaveEmailTemplateModal = ({
  visible,
  setVisible,
  saveAndExitInitialState,
  formikRef,
  setActionButtonType,
  onTitleChange,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    saveEmailTemplateState,
    saveEmailTemplateMessage,
    getDecodedUrlData,
  } = useSelector((state) => state.stripoState);

  const { email_data } = getDecodedUrlData;

  const [saveExitLoading, setSaveExitLoading] = useState(false);
  const [saveContinueLoading, setSaveContinueLoading] = useState(false);

  useEffect(() => {
    onTitleChange?.(formikRef?.current?.values?.title);
  }, [formikRef?.current?.values?.title]);

  // ------------------------------------------------------------------
  // 🔹 Common function to get Stripo HTML + CSS + compiled content
  // ------------------------------------------------------------------
  const getCompiledTemplate = async () =>
    new Promise((resolve, reject) => {
      if (!window.StripoApi) return reject('Stripo not ready');
      window.StripoApi.getTemplate((html, css) => {
        window.StripoApi.compileEmail((error, compiledHtml, ampHtml) => {
          if (error) return reject(error);
          resolve({
            html,
            css,
            content: ampHtml || compiledHtml,
          });
        });
      });
    });

  // ------------------------------------------------------------------
  // 🔹 Unified submit logic (buttonType: save_and_continue | save_and_exit)
  // ------------------------------------------------------------------

  const handleTemplateSave = async (values, buttonType) => {
    try {
      if (buttonType === 'save_and_continue') setSaveContinueLoading(true);
      else setSaveExitLoading(true);

      // 🚨 Safety check for Stripo
      if (!window.StripoApi) {
        console.warn('⚠️ Stripo not ready');
        setSaveContinueLoading(false);
        setSaveExitLoading(false);
        return;
      }
      setActionButtonType('');
      const { html, css, content } = await getCompiledTemplate();

      const payload = {
        title: values.title,
        subject: values.subject,
        customUtm: values.customUtm,
        utm_source: values.utm_source,
        utm_medium: values.utm_medium,
        utm_campaign: values.utm_campaign,
        utm_term: values.utm_term,
        utm_content: values.utm_content,
        action_type:
          router?.query?.type === 'campaign' &&
          router?.query?.type2 === 'createfromscratch'
            ? 'save_as_template'
            : router?.query?.type,
        act: 'save_new_template_data',
        change_only_template_name:
          router?.query?.type === 'campaign' &&
          router?.query?.type2 === 'createfromscratch'
            ? '0'
            : '',
        editorType:
          router?.query?.type === 'campaign' &&
          router?.query?.type2 === 'createfromscratch'
            ? 'campaign'
            : 'template',
        EmailNotificationfromEmail: getDecodedUrlData?.decoded_data || '',
        EmailNotificationfromName: email_data?.from_name || '',
        campaign_id: router?.query?.camp_id || '0',
        template_id: router?.query?.etid || '0',
        template_html: html,
        template_css: css,
        content,
      };

      setActionButtonType(buttonType);
      await dispatch(saveNewTemplateDataApi(payload));

      // 🧭 Optional: Immediate redirect if this is “Save & Exit” in createfromscratch flow
      if (
        buttonType === 'save_and_exit' &&
        router?.query?.type === 'campaign' &&
        router?.query?.type2 === 'createfromscratch' &&
        router?.query?.camp_id
      ) {
        const redirectUrl = `/email-marketing/campaign/${router?.query?.camp_id}/edit-campaign`;
        router.push(redirectUrl);
      }
    } catch (err) {
      notification.error({ message: 'Error saving template.' });
      setSaveContinueLoading(false);
      setSaveExitLoading(false);
    } finally {
      // ✅ Stop loading always
      setSaveContinueLoading(false);
      setSaveExitLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // 🔹 Handle button click (Save & Continue)
  // ------------------------------------------------------------------
  const handleSaveAndContinue = async (values, validateForm, setTouched) => {
    // start loading early
    setSaveContinueLoading(true);

    const formErrors = await validateForm();

    if (Object.keys(formErrors).length > 0) {
      // show validation errors and stop loading
      setTouched(
        Object.keys(formErrors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
      setSaveContinueLoading(false); // ✅ stop loading here
      return;
    }

    handleTemplateSave(values, 'save_and_continue');
  };

  // ------------------------------------------------------------------
  // 🔹 Handle button click (Save & Exit)
  // ------------------------------------------------------------------
  const handleSaveAndExit = async (values, validateForm, setTouched) => {
    setSaveExitLoading(true);

    const formErrors = await validateForm();
    if (Object.keys(formErrors).length > 0) {
      setTouched(
        Object.keys(formErrors).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
      setSaveExitLoading(false); // ✅ stop loading here too
      return;
    }

    handleTemplateSave(values, 'save_and_exit');
  };

  // ------------------------------------------------------------------
  // 🔹 Handle redirect after success
  // ------------------------------------------------------------------
  // useEffect(() => {
  //   if (saveEmailTemplateState === 'success') {
  //     notification.success({ message: saveEmailTemplateMessage });
  //     setSaveContinueLoading(false);
  //     setSaveExitLoading(false);
  //     setVisible(false);
  //     dispatch(saveEmailTemplateReset());

  //     // redirect if save_and_exit
  //     if (
  //       router?.query?.type === 'template' ||
  //       router?.query?.type === 'create-template'
  //     ) {
  //       router.push('/email-marketing/templates/list?tab=pre_made_template');
  //     }
  //   }
  // }, [saveEmailTemplateState]);

  return (
    <AitModal
      open={visible}
      setVisible={setVisible}
      title="Save email template"
      centered
      width={600}
    >
      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={saveAndExitInitialState}
        validationSchema={templateSaveExitValidationSchema}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          validateForm,
          setTouched,
        }) => (
          <Form>
            <div style={{ marginTop: 20 }}>
              <Row gutter={[0, 16]}>
                {/* Template name */}
                <Col span={24}>
                  <Field name="title">
                    {({ field, meta }) => (
                      <AitInputBox
                        {...field}
                        label="Template name"
                        required
                        placeholder="Template name"
                        error={meta.touched && !!meta.error}
                        errorMessage={meta.touched ? meta.error : ''}
                      />
                    )}
                  </Field>
                </Col>

                {/* Email subject */}
                <Col span={24}>
                  <Field name="subject">
                    {({ field, meta }) => (
                      <AitInputBox
                        {...field}
                        label="Email subject"
                        required
                        placeholder="Email subject"
                        error={meta.touched && !!meta.error}
                        errorMessage={meta.touched ? meta.error : ''}
                      />
                    )}
                  </Field>
                </Col>

                {/* Checkbox for custom UTM */}
                <Col span={24}>
                  <AitCheckboxButton
                    name="customUtm"
                    label="Custom UTM parameters"
                    onChange={() => {
                      setFieldValue('customUtm', !values.customUtm);
                    }}
                    value={values.customUtm}
                  />
                </Col>
              </Row>

              {values?.customUtm && (
                <Row gutter={[10, 16]}>
                  {[
                    'utm_source',
                    'utm_medium',
                    'utm_campaign',
                    'utm_term',
                    'utm_content',
                  ].map((utmKey) => (
                    <Col span={12} key={utmKey}>
                      <Field name={utmKey}>
                        {({ field, meta }) => (
                          <AitInputBox
                            {...field}
                            label={utmKey.replace('utm_', 'UTM ')}
                            required={
                              utmKey !== 'utm_term' && utmKey !== 'utm_content'
                            }
                            placeholder={utmKey.replace('utm_', 'UTM ')}
                            error={meta.touched && !!meta.error}
                            errorMessage={meta.touched ? meta.error : ''}
                          />
                        )}
                      </Field>
                    </Col>
                  ))}
                </Row>
              )}

              {/* Footer Buttons */}
              <ButtonWrapper
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                }}
              >
                <AitButton
                  title={
                    saveContinueLoading
                      ? 'Processing...'
                      : 'Save & continue edit'
                  }
                  type="primary"
                  loading={saveContinueLoading}
                  onClick={() =>
                    handleSaveAndContinue(values, validateForm, setTouched)
                  }
                  style={{ width: '100%' }}
                />
                <AitButton
                  title={saveExitLoading ? 'Processing...' : 'Save & exit'}
                  type="primary"
                  loading={saveExitLoading}
                  onClick={() =>
                    handleSaveAndExit(values, validateForm, setTouched)
                  }
                  style={{ width: '100%' }}
                />
                <AitButton
                  title="Cancel"
                  variant="outlined"
                  onClick={() => setVisible(false)}
                  style={{ width: '100%' }}
                />
              </ButtonWrapper>
            </div>
          </Form>
        )}
      </Formik>
    </AitModal>
  );
};

export default SaveEmailTemplateModal;
