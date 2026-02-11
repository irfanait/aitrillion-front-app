import React, { useState } from 'react';
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
import {
  ChoosePreMadeTemplateIcon,
  HtmlEditorIcon,
  MailIcon,
} from '../../svg-icons';
import { Col, Row, Typography } from 'antd';
import ChooseTemplateModal from '../../molecules/choose-template-modal/chooseTemplateModal';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
const { Title: AntTitle } = Typography;

const CreateCampaignRightSection = (props) => {
  const {
    handleShowTemplatePreview,
    handleChoosePreMadeTemplate,
    handleChoosePreMadeTemplateonEdit,
    setVisible,
  } = props;
  const router = useRouter();
  const isEditMode = !!router.query.id;
  const campaignState = useSelector(
    (state) => state.emailMarketingCampaignState
  );

  const [chooseTemplateModalVisible, setChooseTemplateModalVisible] =
    useState(false);

  return (
    <>
      <ScrollContainer>
        <ContentWrapper>
          <AntTitle level={5}>
            How would you like to design your email?
          </AntTitle>
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
                  if (isEditMode) {
                    handleChoosePreMadeTemplateonEdit(
                      'pre_made_template_from_edit'
                    );
                  } else {
                    handleChoosePreMadeTemplate('pre-made-template');
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

            <Col span={12}>
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

            <Col span={12}>
              <OptionCard hoverable>
                <IconWrapper>
                  <HtmlEditorIcon />
                </IconWrapper>
                <Title>HTML editor</Title>
                <Description>Custom-code your email.</Description>
              </OptionCard>
            </Col>
          </Row>
        </ContentWrapper>
      </ScrollContainer>
      <ChooseTemplateModal
        visible={chooseTemplateModalVisible}
        setVisible={setChooseTemplateModalVisible}
        handleShowTemplatePreview={handleShowTemplatePreview}
      />
    </>
  );
};

export default CreateCampaignRightSection;
