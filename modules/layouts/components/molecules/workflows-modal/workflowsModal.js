import React, { useEffect, useState } from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { assetPrefix } from '@/utils/helper';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  ButtonWrapper,
  UseTemplateBtn,
  WorkflowBottomWrapper,
  WorkflowContent,
  WorkflowContentWrapper,
  WorkflowImgWrapper,
  WorkflowText,
  WorkflowTitle,
} from './style';
import { useDispatch, useSelector } from 'react-redux';
import { copyWelcomeWorkflowApi } from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { Typography, Image, Flex, Divider, Grid } from 'antd';
import AitVerticalTabs from '@/modules/layouts/components/atoms/ait-vertical-tabs/aitVerticalTabs';
import {
  AdvanceWorkflowIcon,
  BrowseIcon,
  CreateIcon,
  CrossSellIcon,
  CustomerReactivationIcon,
  NewsletterWorkflowIcon,
  ReminderIcon,
  ReplenishmentIcon,
  SmileIcon,
  WelcomeWorkflowIcon,
  WinbackIcon,
  WorkflowCartIcon,
} from '@/modules/layouts/svg-icons';
import { token } from '@/modules/layouts/utils/constants';
import { LeftOutlined } from '@ant-design/icons';
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;
const getImagePath = (filename) =>
  `${assetPrefix}assets/workflow-templates/${filename}`;

const WorkflowsModal = ({ popupVisible, setPopupVisible }) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md; // true if screen width < 768px
  const dispatch = useDispatch();
  const { copyWelcomeWorkflowLoading } = useSelector(
    (state) => state.emailMarketingDashboardState
  );
  const [copyWokflowModalOpen, setCopyWokflowModalOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const [slideWorlflowTabs, setSlideWorlflowTabs] = useState(false);

  const handleCopyWelcomeWorkflow = (workflowId) => {
    const params = {
      act: 'copy_workflow',
      workflow_id: workflowId,
    };
    if (workflowId) {
      dispatch(copyWelcomeWorkflowApi(params));
    }
  };

  const handleCopyWorkflow = (id) => {
    setCopyWokflowModalOpen(true);
    if (id) {
      setWorkflowId(id);
    }
  };

  const tabItems = [
    {
      key: 'keytop',
      label: (
        <>
          {' '}
          <Title
            level={5}
            type="primary"
            style={{ textAlign: 'left', marginTop: 15 }}
          >
            All templates
          </Title>
          <Divider style={{ marginBottom: 5, marginTop: 15 }} />
        </>
      ),
      content: '',
    },
    {
      key: '1',
      label: (
        <Flex gap={10} align="center">
          <WelcomeWorkflowIcon />
          Welcome email (standard)
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Welcome email (standard)
          </WorkflowTitle>
          <WorkflowText type="secondary">
            Delight new customers with a personalized welcome email. Engage,
            inform, and express appreciation for their choice. Send a welcome
            message when the customer signs up at the store.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Welcome email (standard).svg')}
              alt="Welcome email (standard)"
              style={{ maxWidth: '100%', width: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1974)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1700)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '2',
      label: (
        <Flex gap={10} align="center">
          <AdvanceWorkflowIcon /> Welcome email (Advance)
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Welcome email (Advance)
          </WorkflowTitle>
          <WorkflowText type="secondary">
            This Workflow eng1700ages and inform them with a sequence of
            personalized emails, setting the stage for a successful customer
            journey from the very beginning.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Welcome email (advance).svg')}
              alt="Welcome email (Advance)"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1975)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1701)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '3',
      label: (
        <Flex gap={10} align="center">
          <NewsletterWorkflowIcon /> Newsletter followup email
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Newsletter followup email
          </WorkflowTitle>
          <WorkflowText type="secondary">
            Maximize engagement with our Newsletter Follow-up Email Workflow.
            Automatically send an offer email if the customer subscribed to the
            newsletter.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Newsletter followup email.svg')}
              alt="Newsletter followup email"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1976)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1703)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '4',
      label: (
        <Flex gap={10} align="center">
          <WinbackIcon /> Customer winback (signup)
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Customer winback (signup)
          </WorkflowTitle>
          <WorkflowText type="secondary">
            This workflow sends personalized emails offering exclusive
            incentives and promotions, reigniting their interest and encouraging
            them to return to your brand.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Customer winback (signup).svg')}
              alt="Customer winback (signup)"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1994)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1706)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '5',
      label: (
        <Flex gap={10} align="center">
          <CrossSellIcon /> Product cross-sell
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Product cross-sell
          </WorkflowTitle>
          <WorkflowText type="secondary">
            Boost sales and customer satisfaction with our Product Cross-Sell
            Email Workflow. Send different product promotion messages on order
            completion.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Product cross-sell.svg')}
              alt="Product cross-sell"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1984)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1705)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '6',
      label: (
        <Flex gap={10} align="center">
          <BrowseIcon /> Site browse abandonment
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Site browse abandonment
          </WorkflowTitle>
          <WorkflowText type="secondary">
            Recover lost sales and encourage browsing customers to return with
            our Browse abandonment workflow. send emails featuring recently
            viewed items, enticing them to complete their purchase.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Site browse abandonment.svg')}
              alt="Site browse abandonment"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1983)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1711)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '7',
      label: (
        <Flex gap={10} align="center">
          <WorkflowCartIcon /> Abandoned cart & checkout
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            Abandoned cart & checkout
          </WorkflowTitle>
          <WorkflowText type="secondary">
            Recover lost sales with our abandoned cart & checkout email
            workflow. Automatically send a series of persuasive emails to
            customers who left items in their carts or checkout.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Abandoned cart & checkout.svg')}
              alt="Abandoned cart & checkout"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1977)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1704)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '8',
      label: (
        <Flex gap={10} align="center">
          <ReplenishmentIcon /> Replenishment reminder
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Replenishment reminder
          </WorkflowTitle>
          <WorkflowText type="secondary">
            This workflow sends timely reminders to restock their items, making
            it convenient for them to reorder and increasing customer
            satisfaction and loyalty.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Replenishment reminder.svg')}
              alt="Replenishment reminder"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1979)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1707)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '9',
      label: (
        <Flex gap={10} align="center">
          <SmileIcon /> Order thank you
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Order thank you
          </WorkflowTitle>
          <WorkflowText type="secondary">
            This workflow sends personalized emails expressing gratitude for
            their purchase and encouraging them to reach out for any assistance,
            ensuring a positive post-purchase experience.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Order thank you.svg')}
              alt="Order thank you"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1980)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1708)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '10',
      label: (
        <Flex gap={10} align="center">
          <ReminderIcon /> Loyalty points reminder
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Loyalty points reminder
          </WorkflowTitle>
          <WorkflowText type="secondary">
            This workflow sends timely emails to members, notifying them of
            their accumulated points, enticing them to redeem rewards, and
            fostering ongoing loyalty to your brand.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Loyalty points reminder.svg')}
              alt="Loyalty points reminder"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1981)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1709)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
    {
      key: '11',
      label: (
        <Flex gap={10} align="center">
          <CustomerReactivationIcon /> Customer reactivation
        </Flex>
      ),
      content: (
        <WorkflowContent>
          <WorkflowTitle level={5} type="primary">
            {isMobile && (
              <LeftOutlined
                onClick={() => {
                  setSlideWorlflowTabs(false);
                }}
              />
            )}{' '}
            Customer reactivation
          </WorkflowTitle>
          <WorkflowText type="secondary">
            This workflow send enticing emails featuring exclusive offers and
            highlighting best-selling products, rekindling their interest and
            motivating them to make a new purchase.
          </WorkflowText>
          <WorkflowImgWrapper>
            <Image
              src={getImagePath('Customer reactivation.svg')}
              alt="Customer reactivation"
              style={{ maxWidth: '100%' }}
              preview={false}
            />
          </WorkflowImgWrapper>
          <ButtonWrapper>
            {process.env.NEXT_PUBLIC_APPLICATION_ENV === 'production' ? (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1982)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            ) : (
              <UseTemplateBtn
                onClick={() => handleCopyWorkflow(1710)}
                title="Use template"
                variant="solid"
                color="primary"
              />
            )}
          </ButtonWrapper>
        </WorkflowContent>
      ),
    },
  ];

  // Inside your page/component

  return (
    <AitModal
      width={878}
      open={popupVisible}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      centered
      title="Workflow"
      setVisible={() => setPopupVisible(false)}
      headerTitleLevel={4}
      modalcontentpadding="20px 0px 0px 0px"
      headerPadding="0px 25px 0px 25px"
      closeiconspaceright="25px"
      modalcontainerradius="0px 0px 8px 8px"
    >
      <Divider style={{ marginBottom: 0, marginTop: 20 }} />

      <WorkflowContentWrapper>
        <AitVerticalTabs
          slideWorlflowTabs={slideWorlflowTabs}
          setSlideWorlflowTabs={setSlideWorlflowTabs}
          defaultActiveKey={isMobile ? null : '1'}
          tabItems={tabItems}
        />
        <WorkflowBottomWrapper
          isMobile={isMobile}
          className={`${slideWorlflowTabs ? 'slide-workflow-btn' : ''}`}
        >
          <AitButton
            title="Create from scratch"
            icon={<CreateIcon />}
            type="link"
            className="ant-btn ant-btn-default ant-btn-color-primary ant-btn-variant-outlined"
            href={`${process.env.NEXT_PUBLIC_APP_URL}/workflowv1/createworkflow?ai_v2=${token}`}
          />
        </WorkflowBottomWrapper>
      </WorkflowContentWrapper>

      <AitConfirmationModal
        visible={copyWokflowModalOpen}
        setVisible={setCopyWokflowModalOpen}
        confirmText="Yes, use it!"
        description="This workflow will be copied to your account"
        onConfirm={() => {
          handleCopyWelcomeWorkflow(workflowId);
        }}
        confirmButtonLoading={copyWelcomeWorkflowLoading}
      />
    </AitModal>
  );
};

export default WorkflowsModal;
