import React, { useState } from 'react';
import { Row, Col, Typography, Tooltip, Space, Spin, Flex, Grid } from 'antd';
import {
  DownloadOutlined,
  FileDoneOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  StyledTag,
  StyleTitleWrapper,
  StyleSubTitleWrapper,
  StyleSubTitle,
  StylePageHeader,
  CreateAbTag,
  FlexContainer,
  StyledText,
  StyledRightText,
  Container,
  Label,
} from './style';
import BackButton from '@/components/atoms/back-arrow/backButton';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import { useRouter } from 'next/router';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import Link from 'next/link';
import AitLink from '@/components/atoms/ait-link/aitLink';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const AitPageHeader = (props) => {
  const {
    title,
    subtitle,
    buttonLabel,
    onButtonClick = () => {},
    buttonIcon = <PlusOutlined />,
    hideButton = false,
    isReportTag = false,
    subtitleLink,
    hideSetupEmailCard = false,
    setHideSetupEmailCard = () => {},
    isBackButtonShow = false, // NEW PROP
    showhowToSetup = false,
    showhowToSetupModal = () => {},
    showhowHelpDoc = false,
    helpdoclink = '',
    bottomspacing,
    isAbTest = false,
    isShowSendTime = false,
    campaignSendtime = '',
    isAbDropdown = false,
    selectedVersionAB,
    handleBack = () => {},
    isAbTestCampaign = false,
    variantOptions,
    setSelectedVersionAB,
    handleVersionChange,
    variantIds,
    isSwitchButton = false,
    subtitleRightTooltipTitle = false,
    subtitleRightText = false,
    titlemargin,
    titlewrappermargin,
    isExportButton = false,
    handleExportCsv = () => {},
    exportCampaignCsvDataLoading = false,
    customPopup = null,
    checked,
    disabled = false,
    extraBtnArr = [],
    btnLoading = false,
    isSwitchLoading = false,
    headerBtn = false,
    headerBtnWithViewLink = false,
  } = props;

  const router = useRouter();
  const screens = useBreakpoint();
  const jwtState = useSelector((state) => state?.jwtState);
  const login_auth = jwtState?.login_auth || {};

  const initialBtns = [
    {
      btn: (
        <AitButton
          loading={btnLoading}
          title={buttonLabel}
          type="primary"
          icon={buttonIcon}
          onClick={onButtonClick}
          disabled={disabled}
        />
      ),
    },
  ];

  const btnArr = [...initialBtns, ...(extraBtnArr || [])]?.reverse();

  const viewChangesLink = login_auth?.no_cache_domain || '';

  let switchBtnStyle = {};
  if (isSwitchButton) {
    switchBtnStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    };
  }

  return (
    <StylePageHeader bottomspacing={bottomspacing}>
      <Row justify="space-between" align="middle" gutter={[16, 16]} wrap>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 17, flex: '1 1 auto' }}
        >
          <StyleTitleWrapper
            titlewrappermargin={titlewrappermargin}
            titlemargin={titlemargin}
          >
            {isBackButtonShow && <BackButton handleBack={handleBack} />}
            {isAbTest === 'true' && <CreateAbTag>A/B</CreateAbTag>}
            <Title
              className="page-heading"
              titlemargin={titlemargin}
              type="primary"
              style={{
                fontWeight: 500,
                letterSpacing: '-0.02em',
                // marginBottom: 10,
              }}
            >
              {title}
              {showhowToSetup && (
                <Tooltip placement="topLeft" title="Video">
                  <AitButton
                    variant="outlined"
                    color="primary"
                    padding={'0px'}
                    width={'25px'}
                    height={'25px'}
                    icon={<PlayCircleOutlined />}
                    onClick={showhowToSetupModal}
                  />
                </Tooltip>
              )}
              {showhowHelpDoc && (
                <Tooltip placement="topLeft" title="Help doc">
                  <AitButton
                    type="link"
                    variant="outlined"
                    color="primary"
                    padding={'0px'}
                    href={helpdoclink}
                    target="_blank"
                    style={{
                      width: '25px',
                      height: '25px',
                      flex: '0 0 25px',
                      padding: '0px',
                      border: '1px solid',
                    }}
                    icon={<FileDoneOutlined />}
                  />
                </Tooltip>
              )}
              {customPopup && (
                <span style={{ marginLeft: 8 }}>{customPopup}</span>
              )}
            </Title>
            {/* {isReportTag && <StyledTag color="blue">Report</StyledTag>}+{' '} */}
            {isReportTag && selectedVersionAB && (
              <StyledTag color="blue">
                {selectedVersionAB === 'ALL' && 'All'}
                {selectedVersionAB === 'A' && 'Version A'}
                {selectedVersionAB === 'B' && 'Version B'}
                {selectedVersionAB === 'WINNER' && 'Winner'}
              </StyledTag>
            )}
          </StyleTitleWrapper>
          {subtitle && (
            <StyleSubTitleWrapper>
              <StyleSubTitle screens={screens} type="secondary">
                {subtitle}
              </StyleSubTitle>
            </StyleSubTitleWrapper>
          )}

          {isShowSendTime && (
            <div style={{ marginTop: '10px' }}>
              <Text
                style={{ fontSize: 16, marginTop: '10px !important' }}
                // style={{ fontSize: 14, fontWeight: 500, marginTop: '10px' }}
                type="primary"
              >
                Campaign Sent -{' '}
                <Text style={{ fontSize: 14 }} type="secondary">
                  {campaignSendtime}
                </Text>
              </Text>
            </div>
          )}

          {hideSetupEmailCard == true && subtitleLink && (
            <Text style={{ marginLeft: 5 }}>
              <AitButton
                title={subtitleLink}
                variant="link"
                type="link"
                padding={'0px'}
                onClick={(e) => {
                  e.preventDefault();
                  setHideSetupEmailCard(false);
                }}
              />
            </Text>
          )}
        </Col>
        {(isSwitchButton || subtitleRightText) && (
          <Col xs={24} sm={{ flex: 'none' }}>
            <Flex vertical={true}>
              {isSwitchButton && (
                <Flex
                  gap={10}
                  justify={screens.sm ? 'end' : 'start'}
                  alignItems="center"
                >
                  <AitSwitch
                    label={buttonLabel}
                    onClick={onButtonClick}
                    value={checked}
                    loading={isSwitchLoading}
                  />
                </Flex>
              )}

              {subtitleRightText && (
                <Flex
                  gap={2}
                  justify={screens.sm ? 'end' : 'start'}
                  alignItems="center"
                  style={{ marginTop: '5px' }}
                >
                  <AitLink
                    size={13}
                    weight={500}
                    color="primary"
                    href={viewChangesLink}
                    target="_blank"
                  >
                    {subtitleRightText}
                  </AitLink>
                  <Tooltip placement="bottom" title={subtitleRightTooltipTitle}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </Flex>
              )}
            </Flex>
          </Col>
        )}

        {headerBtn && headerBtnWithViewLink && (
          <Col xs={24} sm={{ flex: 'none' }}>
            <Flex vertical={true}>
              {headerBtn && (
                <Flex
                  gap={10}
                  justify={screens.sm ? 'end' : 'start'}
                  style={{ textAlign: screens.sm ? 'end' : 'start' }}
                  alignItems="center"
                >
                  <AitButton
                    loading={btnLoading}
                    title={buttonLabel}
                    type="primary"
                    icon={buttonIcon}
                    onClick={onButtonClick}
                    disabled={disabled}
                  />
                </Flex>
              )}

              {headerBtnWithViewLink && (
                <Flex
                  gap={2}
                  justify={screens.sm ? 'end' : 'start'}
                  alignItems="center"
                  style={{ marginTop: '5px' }}
                >
                  <AitLink
                    size={13}
                    weight={500}
                    color="primary"
                    href={viewChangesLink}
                    target="_blank"
                  >
                    {headerBtnWithViewLink}
                  </AitLink>
                  <Tooltip placement="bottom" title={subtitleRightTooltipTitle}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </Flex>
              )}
            </Flex>
          </Col>
        )}

        {isExportButton && (
          <Col xs={{ span: 24 }} sm={{ flex: 'none' }}>
            <AitButton
              title={'Export campaign data'}
              type="link"
              icon={
                exportCampaignCsvDataLoading ? (
                  <Spin size="small" />
                ) : (
                  <DownloadOutlined />
                )
              }
              style={{ color: '#576F7C' }}
              onClick={handleExportCsv}
            />
          </Col>
        )}

        {
          !hideButton && (
            <Col xs={{ span: 24 }} sm={{ flex: 'none' }}>
              <Row gutter={[15, 15]}>
                {btnArr?.map((item, index) => (
                  <Col key={index}>{item?.btn}</Col>
                ))}
              </Row>
            </Col>
          )
          // <Col xs={{ span: 24 }} sm={{ flex: 'none' }}>
          //   <AitButton
          //     title={buttonLabel}
          //     type="primary"
          //     icon={buttonIcon}
          //     onClick={onButtonClick}
          //     disabled={disabled}
          //   />
          // </Col>
        }

        {isAbDropdown && isAbTestCampaign && (
          <Col xs={{ span: 24 }} sm={{ flex: 'none' }}>
            <AitSelectBox
              name="selectedVersionAB"
              placeholder="Select Version"
              options={variantOptions.map((opt) => ({
                label: opt.label,
                value: opt.key,
              }))}
              style={{ width: '200px' }}
              value={selectedVersionAB}
              defaultValue="ALL"
              onChange={(key) => {
                setSelectedVersionAB(key);
                // resolve the actual messageId
                const selected = variantOptions.find((opt) => opt.key === key);
                const resolvedId = selected?.value;
                // update router query with variant key instead of replacing campaign ID
                router.push(
                  {
                    pathname: `/email-marketing/campaign/${router.query.id}`,
                    query: {
                      ...router.query,
                      isAbTest: true,
                      variant: key, // keep parent campaign id, track selection in query
                    },
                  },
                  undefined,
                  { shallow: true }
                );
              }}
            />
          </Col>
        )}
      </Row>
    </StylePageHeader>
  );
};

export default AitPageHeader;
