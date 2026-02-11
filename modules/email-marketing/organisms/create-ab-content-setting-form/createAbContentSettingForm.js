import React from 'react';
import { Row, Col, Typography } from 'antd';
import { Field } from 'formik';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import {
  ColorBox,
  FieldGroup,
  InlineGroup,
  LabelText,
  PreviewCard,
  PreviewRow,
  PreviewTitle,
  SectionTitle,
  Wrapper,
} from './style';

const { Text } = Typography;

const CreateContentTestSettings = (props) => {
  const { values, setFieldValue, errors, touched, distriutionCounts } = props;

  return (
    <Wrapper>
      <Row gutter={[16, 16]}>
        {/* Left Side: Form Settings */}
        <Col xs={24} lg={12}>
          <SectionTitle level={5} type="primary">
            Content test settings
          </SectionTitle>

          {/* Winning Recipient Input */}
          <FieldGroup>
            <label style={{ marginBottom: 4, display: 'inline-block' }}>
              How many recipients should receive the winning version?
            </label>
            <Field
              as={AitInputBox}
              name="abtesting_win_percentage"
              value={values.abtesting_win_percentage}
              placeholder="25"
              addonAfter="Percentage (%)"
              type="number"
            />
          </FieldGroup>

          {/* Winning Criteria Inputs */}
          <FieldGroup>
            <Row>
              <Col span={24}>
                <label style={{ marginBottom: 4, display: 'inline-block' }}>
                  How should we determine the winning version?
                </label>
              </Col>
            </Row>
            <Row gutter={[30, 10]} justify={'space-between'}>
              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <InlineGroup>
                  <label>By</label>
                  <div style={{ width: '100%' }}>
                    <Field
                      as={AitSelectBox}
                      name="abtesting_win_percent_by"
                      value={values.abtesting_win_percent_by}
                      placeholder="select"
                      onChange={(value) => {
                        if (value) {
                          setFieldValue('abtesting_win_percent_by', value);
                        }
                      }}
                      options={[
                        {
                          value: 'click_rate',
                          label: 'Click rate',
                        },
                        {
                          value: 'open_rate',
                          label: 'Open rate',
                        },
                        {
                          value: 'total_sales',
                          label: 'Total sales',
                        },
                      ]}
                      // error={Boolean(error.error)}
                      // errorMessage={error.errorMessage || ''}
                      style={{ width: '100%' }}
                    />
                  </div>
                </InlineGroup>
              </Col>

              <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                <InlineGroup>
                  <label>after</label>
                  <Field
                    as={AitInputBox}
                    name="abtesting_time_in_number"
                    value={values.abtesting_time_in_number}
                    type="number"
                  />
                  <Field
                    as={AitSelectBox}
                    name="abtesting_time_in_dayhours"
                    value={values.abtesting_time_in_dayhours}
                    placeholder="select"
                    onChange={(value) => {
                      if (value) {
                        setFieldValue('abtesting_time_in_dayhours', value);
                      }
                    }}
                    options={[
                      {
                        label: 'hour(s)',
                        value: 'hour',
                      },
                      {
                        label: 'day(s)',
                        value: 'day',
                      },
                    ]}
                  />
                </InlineGroup>
              </Col>
            </Row>
          </FieldGroup>
        </Col>

        {/* Right Side: Email Distribution Preview */}
        <Col xs={24} lg={12}>
          <PreviewTitle level={5} type="primary">
            Email distribution preview
          </PreviewTitle>
          <PreviewCard>
            <PreviewRow>
              <LabelText>
                <ColorBox color="var(--ant-color-primary)" />
                Winner
              </LabelText>
              <Text type="secondary">{`${distriutionCounts?.winnerPercent ?? values?.abtesting_win_percentage}% (${distriutionCounts?.winnerGroupCount ?? ''} recipients)`}</Text>
            </PreviewRow>
            <PreviewRow>
              <LabelText>
                <ColorBox color="#e0e0e0" />
                Version A
              </LabelText>
              <Text type="secondary">
                {distriutionCounts?.versionAPercent &&
                distriutionCounts?.versionACount
                  ? `${distriutionCounts.versionAPercent}% (${distriutionCounts.versionACount})`
                  : ''}
              </Text>
            </PreviewRow>
            <PreviewRow>
              <LabelText>
                <ColorBox color="#e0e0e0" />
                Version B
              </LabelText>
              <Text type="secondary">
                {distriutionCounts?.versionBPercent &&
                distriutionCounts?.versionBCount
                  ? `${distriutionCounts.versionBPercent}% (${distriutionCounts.versionBCount})`
                  : ''}
              </Text>
            </PreviewRow>
          </PreviewCard>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default CreateContentTestSettings;
