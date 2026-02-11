import React, { useState } from "react";
import { Row, Col, Typography, Grid, Space, Radio, Flex } from "antd";
import Image from "next/image";
import { InnerCollapseWrapper, CollapseWrapper,AdvanceSetupContainer } from "./style";
import AitButton from "@/components/atoms/ait-button/aitButton";
import { getToken } from "@/utils/authHelpers";
import { CloseCircleOutlined, DownCircleFilled } from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Title, Text, Link } = Typography;
const { Panel } = InnerCollapseWrapper;

//const token = getToken();


const SetupCard = (
  {
  showCloseIcon, 
  hideSetupEmailCard, 
  setHideSetupEmailCard, 
  disableCollapse, 
  setupCardTitle, 
  setupSubTitle, 
  setupStepsData, 
  rightcontent, 
  setClickedKey, 
  clickedKey,
  activeKey, 
  setActiveKey,
  handlePanelClick,
  screens
}) => {
  const [showAdvanceChildren, setShowAdvanceChildren] = useState(false);

  return (
      <CollapseWrapper
                  screens={screens}
                  collapsible={disableCollapse}//pass 'disabled' to disable collapse
                  defaultActiveKey={['1']}
                  style={{ marginBottom: 16 }}
                  bordered={false}
                >
                  <Panel
                    key="1"
                    header={
                      <Row
                        align={{ xs: 'top', sm: 'middle' }}
                        justify={'space-between'}
                      >
                        <Col xs={24} sm={20}>
                          <Title
                            className="outer-collapse-title"
                            level={4}
                            type="primary"
                            style={{ fontWeight: 500, marginBottom: '0px' }}
                          >
                            {setupCardTitle}
                          </Title>
                          {setupSubTitle}
                        </Col>
                        <Col xs={24} sm={4} style={{ textAlign: 'right' }}>
                          {showCloseIcon && <AitButton
                            padding={'0px'}
                            type="link"
                            className="close-panel-btn"
                            icon={<CloseCircleOutlined />}
                            onClick={() => {
                              setHideSetupEmailCard(false);
                            }}
                          />}
                        </Col>
                      </Row>
                    }
                  >
                  <Row gutter={24}>
                    <Col xs={24} md={12}>
                      <InnerCollapseWrapper
                        accordion
                        activeKey={activeKey}
                        expandIconPosition="left"
                        bordered={false}
                      >
                        {setupStepsData.map((step) => {
                          if (step.id === "advance-setup") {
                            // Render as a clickable div, not a panel
                            return (
                              <AdvanceSetupContainer
                                key={step.key}
                                className={showAdvanceChildren ? "color-primary" : ""}
                                onClick={() => {
                                  setShowAdvanceChildren((prev) => !prev);
                                  setActiveKey(null); // Close all panels before AdvanceSetupContainer
                                }}
                              >
                                <Flex align="middle" gap={10}>
                                  <DownCircleFilled style={{ fontSize: 25 }} />
                                  <Title
                                    className={showAdvanceChildren ? "color-primary" : ""}
                                    type={showAdvanceChildren ? "color-primary" : "primary"}
                                    level={5}
                                    style={{ margin: 0 }}
                                  >
                                    {step.title}
                                  </Title>
                                </Flex>
                                {step.description && (
                                  <Text type="secondary">{step.description}</Text>
                                )}
                              </AdvanceSetupContainer>
                            );
                          }
                          // Render normal panels
                          return (
                            <Panel
                              key={step.key}
                              header={
                                <div onClick={() => {
                                  handlePanelClick(step.key);
                                  setShowAdvanceChildren(false)}
                                  }>
                                  <Title level={5}>{step.title}</Title>
                                </div>
                              }
                            >
                            
                              <Row gutter={[0, 10]}>
                                {!screens?.xl && 
                                  <Col xs={24} md={12}>
                                    {rightcontent}
                                  </Col>
                                }
                                <Col
                                  span={24}
                                  style={{ paddingTop: !screens?.xl ? "5px" : "10px" }}
                                >
                                  <Text type="secondary">{step.description}</Text>
                                </Col>

                                <Col span={24}>
                                  <Link
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontWeight: 500 }}
                                    href={step.guideUrl}
                                  >
                                    {step.guideText}
                                  </Link>
                                </Col>

                                <Col span={24}>
                                  <AitButton
                                    title={step.btnText}
                                    type="primary"
                                    variant="link"
                                    href={step.btnUrl}
                                  />
                                </Col>
                              </Row>
                            </Panel>
                          );
                        })}

                        {/* Render advance-setup children as panels if showAdvanceChildren is true */}
                        {setupStepsData
                          .find((step) => step.id === "advance-setup")?.children &&
                          showAdvanceChildren &&
                          setupStepsData
                            .find((step) => step.id === "advance-setup")
                            .children.map((child) => (
                              <Panel
                                key={child.key}
                                header={
                                  <div onClick={() => handlePanelClick(child.key)}>
                                    <Title level={5}>{child.title}</Title>
                                  </div>
                                }
                              >
                                <Row gutter={[0, 10]}>
                                  {!screens?.xl && (
                                    <Col span={24} style={{ paddingTop: "10px" }}>
                                      <Link href={child.rightUrl}>
                                        <Image
                                          src={child.img}
                                          alt={child.title}
                                          width={600}
                                          height={400}
                                          style={{ width: "100%", height: "auto" }}
                                          unoptimized
                                          preview={false}
                                        />
                                      </Link>
                                    </Col>
                                  )}

                                  <Col
                                    span={24}
                                    style={{ paddingTop: !screens?.xl ? "5px" : "10px" }}
                                  >
                                    <Text type="secondary">{child.description}</Text>
                                  </Col>

                                  <Col span={24}>
                                    <Link
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontWeight: 500 }}
                                      href={child.guideUrl}
                                    >
                                      {child.guideText}
                                    </Link>
                                  </Col>

                                  <Col span={24}>
                                    <AitButton
                                      title={child.btnText}
                                      type="primary"
                                      variant="link"
                                      href={child.btnUrl}
                                    />
                                  </Col>
                                </Row>
                              </Panel>
                            ))}
                      </InnerCollapseWrapper>
                    </Col>

                    {screens?.xl && (
                      <Col xs={24} md={12}>
                        {rightcontent}
                      </Col>
                    )}
                  </Row>
                  </Panel>
                </CollapseWrapper>
    
  );
};

export default SetupCard;
