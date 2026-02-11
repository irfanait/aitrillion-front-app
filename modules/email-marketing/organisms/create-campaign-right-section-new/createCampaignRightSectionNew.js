import React from 'react';
import {
  AlertWrapper,
  ContentWrapper,
  Description,
  IconWrapper,
  OptionCard,
  PopularTag,
  ScrollContainer,
  StyledAlert,
  Title,
} from './style';
import { Col, Row, Typography } from 'antd';
import {
  ChoosePreMadeTemplateIcon,
  HtmlEditorIcon,
  MailIcon,
} from '../../svg-icons';
import { useSelector } from 'react-redux';
const { Title: AntTitle } = Typography;

const CreateCampaignRightSectionNew = (props) => {
  const {
    setChooseTemplateModalVisible,
    handleChoosePreMadeTemplate,
    handleChoosePreMadeTemplateonEdit,
    isEditMode,
    setVisible,
    setWasSubjectAutoFilled,
  } = props;

  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  return (
    <ScrollContainer>
      <ContentWrapper>
        <AntTitle level={5}>How would you like to design your email?</AntTitle>

        {isEditMode && (
          <AlertWrapper>
            <StyledAlert
              message={
                <Typography.Text>
                  Selecting a new template will permanently delete existing
                  content for your campaign. To avoid losing any work,
                  <Typography.Link
                    onClick={() => {
                      setVisible(false);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    return to your current template
                  </Typography.Link>
                </Typography.Text>
              }
              type="warning"
              showIcon
            />
          </AlertWrapper>
        )}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <OptionCard
              hoverable
              onClick={() => {
                if (!isEditMode) {
                  // ✅ mark subject as auto-fillable
                  setWasSubjectAutoFilled(true);
                  handleChoosePreMadeTemplate('pre-made-template');
                } else {
                  handleChoosePreMadeTemplateonEdit(
                    'pre_made_template_from_edit'
                  );
                }
              }}
              loading={campaignState?.sendEmailLoading}
            >
              <>
                <PopularTag>Popular</PopularTag>
                <IconWrapper>
                  <ChoosePreMadeTemplateIcon />
                </IconWrapper>
                <Title>Choose pre-made templates</Title>
                <Description>
                  Choose templates using drag-and-drop editor.
                </Description>
              </>
            </OptionCard>
          </Col>

          <Col span={24}>
            <OptionCard
              onClick={() => {
                if (isEditMode) {
                  setVisible(false);
                }
                setChooseTemplateModalVisible(true);
              }}
              hoverable
            >
              <IconWrapper>
                <MailIcon />
              </IconWrapper>
              <Title>Choose message template</Title>
              <Description>Use saved messages to send.</Description>
            </OptionCard>
          </Col>

          {/* <Col span={12}>
            <OptionCard
              onClick={() => {
                if (!isEditMode) {
                  setWasSubjectAutoFilled(true); // ✅ mark
                  handleChoosePreMadeTemplate('html_editor');
                } else {
                  handleChoosePreMadeTemplateonEdit('html_editor_from_edit');
                }
              }}
              loading={campaignState?.sendEmailLoading}
              hoverable
            >
              <IconWrapper>
                <HtmlEditorIcon />
              </IconWrapper>
              <Title>HTML editor</Title>
              <Description>Custom-code your email.</Description>
            </OptionCard>
          </Col> */}
        </Row>
      </ContentWrapper>
    </ScrollContainer>
  );
};

export default CreateCampaignRightSectionNew;
