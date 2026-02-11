import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { Card, Col, Row, Typography } from 'antd';
import { Field } from 'formik';
import React from 'react';
import HtmlPreviewer from '../../molecules/html-previewer/htmlPreviewer';
import { TemplatePreviewIcon } from '../../svg-icons';
import { useSelector } from 'react-redux';
import AitDropdownButton from '@/components/atoms/ait-dropdown-button/aitDropdownButton';
import { useRouter } from 'next/router';

const CreateABVersionAForm = (props) => {
  const {
    values,
    setFieldValue,
    errors,
    touched,
    handleClickTemplatePreview,
    handleTenplateListModalClick,
    // handleClickUseTemplateFromCreateAb,
  } = props;
  const router = useRouter();

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const { email_data } = campaignState?.createAbDecodedData;

  return (
    <div>
      <Row gutter={[30, 24]}>
        <Col xs={24} md={9}>
          <Field
            as={AitInputBox}
            name="variantA.EmailNotificationfromSubject"
            label="Subject"
            values={values.variantA.EmailNotificationfromSubject}
            onChange={(e) =>
              setFieldValue(
                'variantA.EmailNotificationfromSubject',
                e.target.value
              )
            }
            placeholder="Subject"
            required
            // error={Boolean(errors.variantA.EmailNotificationfromSubject)}
            // errorMessage={errors.variantA.EmailNotificationfromSubject || ''}
          />
          <div style={{ marginTop: '24px' }}>
            <Field
              as={AitInputBox}
              // addonAfter={emailCampaignData?.email_data?.domain_name}
              value={values.variantA.emailNotificationfromEmail}
              name="variantA.emailNotificationfromEmail"
              label="Sender's email address"
              placeholder="Email address"
              // error={
              //   touched.emailNotificationfromEmail &&
              //   !!errors.emailNotificationfromEmail
              // }
              // errorMessage={errors.variantA.emailNotificationfromEmail}
            />
          </div>
          <div style={{ marginTop: '24px' }}>
            <Field
              as={AitInputBox}
              name="variantA.emailNotificationfromName"
              label="Sender's name"
              placeholder="Enter Sender's name"
              value={values.variantA.emailNotificationfromName}
              error={
                touched.emailNotificationfromName &&
                !!errors.emailNotificationfromName
              }
              errorMessage={errors.emailNotificationfromName}
            />
          </div>
          <div style={{ marginTop: '24px' }}>
            <Field
              as={AitInputBox}
              name="variantA.emailNotificationfromReplyTo"
              value={values.variantA.emailNotificationfromReplyTo}
              required
              label="Reply to email*"
              placeholder="Enter Reply to email*"
              error={
                touched.emailNotificationfromReplyTo &&
                !!errors.emailNotificationfromReplyTo
              }
              errorMessage={errors.emailNotificationfromReplyTo}
            />
          </div>
        </Col>

        <Col xs={24} md={15}>
          <Card
            title={
              <div className="preview-header">
                <Typography.Text
                  type="primary"
                  style={{ fontSize: '18px' }}
                  strong
                >
                  Email preview
                </Typography.Text>
              </div>
            }
            extra={
              <div
                style={{
                  display: 'flex',
                  gap: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleClickTemplatePreview(
                      true,
                      values?.variantA?.email_content,
                      'variantA'
                    );
                  }}
                >
                  <TemplatePreviewIcon />
                </div>
                {email_data?.is_new_template === '1' && (
                  <AitDropdownButton
                    variant="outlined"
                    color="primary"
                    title={'Edit email'}
                    style={{
                      width: '100%',
                      color: '#1A73E8',
                      fontWeight: 500,
                    }}
                    onClick={() => {
                      router?.push(
                        `/email-marketing/templates/editorv2?type=campaign&type2=createAb&camp_id=${email_data?.['variantA']?.messageId ?? ''}&pcid=${router?.query?.id}`
                      );
                    }}
                    menuItems={[
                      {
                        key: 'change_template',
                        label: 'Change template',
                        onClick: () => {
                          handleTenplateListModalClick(true);
                        },
                      },
                    ]}
                  />
                )}
              </div>
            }
            bodyStyle={{ padding: 16, height: '400px' }}
          >
            <HtmlPreviewer htmlString={values?.variantA?.email_content} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateABVersionAForm;
