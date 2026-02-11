import React from 'react';
import { Typography, Skeleton } from 'antd';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitTableList from '@/components/molecules/ait-table-list/aitTableList';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ExportOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { DnsInfoIcon } from '../../svg-icons';
import { StyledAlert } from './style';
import {
  confirmAsDoneDkimApi,
  validateDomainInstructionApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';

const { Text, Title, Paragraph, Link } = Typography;

const DMARCValue = `_dmarc TXT v=DMARC1; p=none; pct=100; rua=mailto:youremail@example.com`;

const DkimSettingDetailsTemplate = ({
  fromEmail,
  domainName = 'aitrillion.com',
  onUpdateClick,
  onValidateClick,
  dkimStatus = 1,
}) => {
  const dispatch = useDispatch();
  const {
    getDkimStatusData,
    getDkimStatusLoading,
    validateDomainInstructionLoading,
    confirmAsDoneDkimLoading,
  } = useSelector((state) => state.emailMarketingSettingsState);

  const loggedInUserDetailsState = useSelector(
    (state) => state.loggedInUserDetailsState
  );

  const { userDetails } = loggedInUserDetailsState;

  const statusOneDataSource = [
    {
      key: '1',
      status: 'active',
      fromEmail,
      domainName,
      onUpdateClick,
    },
  ];

  const statusOneTableColumns = [
    {
      title: 'Status',
      width: 70,
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <>
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        </>
      ),
    },
    {
      title: 'From email',
      width: 200,
      dataIndex: 'fromEmail',
      key: 'fromEmail',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Domain name',
      width: 150,
      dataIndex: 'domainName',
      key: 'domainName',
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: 'Action',
      width: 100,
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <AitButton
          type="link"
          padding={'0px'}
          title="Update"
          onClick={record.onUpdateClick}
        />
      ),
    },
  ];

  const renderDkimStatusOne = () => (
    <div style={{ marginBottom: 24 }}>
      <AitCard
        bodypadding={{
          xs: '5px 20px 20px 20px',
          sm: '5px 20px 20px 20px',
          md: '5px 24px 24px 24px',
        }}
      >
        <AitTableList
          rowKey="key"
          columns={statusOneTableColumns}
          dataSource={statusOneDataSource}
          pagination={false}
          scroll={{ y: 55 * 5 }}
        />
      </AitCard>
    </div>
  );

  const dnsColumns = [
    {
      title: 'Valid',
      dataIndex: 'valid',
      key: 'valid',
      width: 90,
      render: (valid) =>
        valid ? (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        ) : (
          <CloseCircleTwoTone twoToneColor="#ec3030 " />
        ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => type?.toUpperCase(),
    },
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      width: 200,
      render: (text) => <Text copyable={{ text }}>{text}</Text>,
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      width: 300,
      render: (text) => <Text copyable={{ text }}>{text}</Text>,
    },
  ];

  const dnsRecords = Object.values(
    getDkimStatusData?.dkimData?.db_dkim_response || {}
  ).map((record, index) => ({
    key: index,
    ...record,
  }));
  const renderDkimStatusTwo = () => (
    <div style={{ marginBottom: 24 }}>
      <AitCard
        bodypadding={{
          xs: '5px 20px 20px 20px',
          sm: '5px 20px 20px 20px',
          md: '5px 24px 24px 24px',
        }}
      >
        <AitTableList
          rowKey="key"
          columns={[
            {
              title: 'Status',
              width: 70,
              key: 'status',
              render: () => <CloseCircleTwoTone twoToneColor="#ec3030 " />,
            },
            {
              title: 'From email',
              width: 200,
              key: 'fromEmail',
              render: () => <Text>{fromEmail}</Text>,
            },
            {
              title: 'Domain name',
              width: 150,
              key: 'domainName',
              render: () => <Text>{domainName}</Text>,
            },
            {
              title: 'Action',
              width: 100,
              key: 'action',
              render: () => (
                <>
                  <AitButton
                    type="link"
                    padding={'0px'}
                    title="Update"
                    onClick={onUpdateClick}
                  />
                  {' | '}
                  <AitButton
                    type="link"
                    title="Validate"
                    padding={'0px'}
                    onClick={onValidateClick}
                  />
                </>
              ),
            },
          ]}
          dataSource={[{ key: 0 }]}
          pagination={false}
          scroll={{ y: 55 * 5 }}
        />
        <StyledAlert
          type="info"
          showIcon
          icon={<DnsInfoIcon />}
          message={
            <Text strong>
              DNS Record information for sending your email with your white
              label.
            </Text>
          }
          description={
            <Text>
              Copy the following DNS Records into your email domain hosting
              provider. Once done please click on validate button to verify.
            </Text>
          }
        />

        <AitTableList
          rowKey="key"
          columns={dnsColumns}
          dataSource={dnsRecords}
          pagination={false}
          loading={validateDomainInstructionLoading}
          style={{ marginTop: 16 }}
        />
      </AitCard>
    </div>
  );

  const handleConfirmasDone = () => {
    const payload = {
      act: 'update_dmarc_status',
    };
    dispatch(confirmAsDoneDkimApi(payload));
  };

  return (
    <div style={{ width: '100%' }}>
      {getDkimStatusLoading ? (
        <Skeleton
          active
          paragraph={{ rows: 4 }}
          title={false}
          style={{ marginBottom: 24 }}
        />
      ) : dkimStatus === '2' ? (
        renderDkimStatusTwo()
      ) : (
        renderDkimStatusOne()
      )}
      {/* DMARC Settings */}
      <AitCard
        bodypadding={{
          xs: '20px 20px 20px 20px',
          sm: '20px 20px 20px 20px',
          md: '24px 24px 24px 24px',
        }}
      >
        <Title level={4} type="primary">
          DMARC settings
        </Title>
        <Paragraph strong type="primary">
          <Title level={5}>
            Needed for the Google and Yahoo Email Authentication Changes in 2024{' '}
            <Link
              style={{ fontWeight: 500, fontSize: 16, lineHeight: 1.5 }}
              href="https://docs.aitrillion.com/portal/en/kb/articles/make-validate-the-dmarc-entry"
              target="_blank"
            >
              Learn more &nbsp;
              <ExportOutlined />
            </Link>
          </Title>
        </Paragraph>

        <Paragraph type="secondary">
          DMARC (Domain-based Message Authentication, Reporting & Conformance)
          is a standard that extends SPF and DKIM, empowering domain owners to
          establish policies for mailbox providers (such as Google or Microsoft)
          in the event of SPF and DKIM check failures.
        </Paragraph>

        <Paragraph style={{ marginTop: 30 }} type="primary">
          <strong>DMARC offers three primary policy configurations:</strong>
        </Paragraph>

        <Paragraph type="secondary">
          <strong>None:</strong> Signifies that emails should be treated
          normally even if DMARC fails. This is akin to not having a DMARC
          record, yet it allows leveraging DMARC's reporting features.
        </Paragraph>

        <Paragraph type="secondary">
          <strong>Quarantine:</strong> Specifies that emails failing the DMARC
          check should be directed to the spam folder upon delivery.
        </Paragraph>

        <Paragraph type="secondary">
          <strong>Reject:</strong> Indicates that emails failing the DMARC check
          should be bounced and not delivered to the recipient.
        </Paragraph>

        <Paragraph type="secondary">
          A recommended initial DMARC policy is provided below. Create a TXT
          record with a Host or Name of <Text code>_dmarc</Text> at your DNS
          provider and input the following value for the Value or Record. Be
          sure to replace the email address in the example with your own:
        </Paragraph>

        <Paragraph>
          <Text
            style={{ color: 'var(--ant-color-primary)' }}
            copyable={DMARCValue}
          >
            {DMARCValue}
          </Text>
        </Paragraph>

        <Paragraph type="secondary">
          Use the{' '}
          <Link href="https://mxtoolbox.com/dmarc.aspx" target="_blank">
            online tool <ExportOutlined />
          </Link>{' '}
          &nbsp;to validate your domain DMARC entry.
        </Paragraph>

        {userDetails?.dmarc_policy_update_status === '1' ? (
          <AitButton
            title="Confirmed as DONE"
            bgColor={'var(--color-green)'}
            variant="solid"
            color="#ffffff !important"
            loading={confirmAsDoneDkimLoading}
            style={{ marginTop: 16 }}
          />
        ) : (
          <AitButton
            title="Confirm as DONE"
            type="primary"
            variant="solid"
            color="#ffffff !important"
            loading={confirmAsDoneDkimLoading}
            onClick={() => {
              handleConfirmasDone();
            }}
            style={{ marginTop: 16 }}
          />
        )}
      </AitCard>
    </div>
  );
};

export default DkimSettingDetailsTemplate;
