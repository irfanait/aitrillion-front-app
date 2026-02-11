import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import {
  App,
  Col,
  Flex,
  Form,
  Row,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useEffect, useState } from 'react';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import { checkValidData, enterOnlyNumericValue } from '@/utils/common.util';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { Editicon, ViewIcon } from '../../svg-icons';
import logger from '@/utils/logger';
import {
  getEmailSettingService,
  saveEmailSettingService,
} from '../../api/settings';
import { useRouter } from 'next/router';
import AitText from '@/components/atoms/ait-text/aitText';
import { useSelector } from 'react-redux';

const { Text } = Typography;

function EmailSettingTamplate() {
  const jwtState = useSelector((state) => state?.jwtState);
  const router = useRouter();
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [emailState, setEmailState] = useState('aitrillion');
  const [settingData, setSettingData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tamplateList, setTamplateList] = useState([]);
  const [dkimEmailLoading, setDKIMloading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailTypeData, setEmailTypeData] = useState();

  const handleViewDetails = (id) => {
    let temp = tamplateList?.find((item) => item?.value === id);

    window.open(
      `${process.env.NEXT_PUBLIC_SITE_URL}/templatev2?type=editor&redirect_to=loyalty&etid=${temp?.encoded_id}`
    );
    // window.open(
    //   `/email-marketing/templates/editorv2?type=loyalty&etid=${temp?.encoded_id}`,
    //   '_blank'
    // );

    // https://ai-dev.aitrillion.com/templatev2?type=editor&redirect_to=loyalty&etid=Qq-fVBcgtJ2ydPDLeqzkNF34-mL915KfV0Dv1Ww2yCY
  };

  settingData?.enable_point_expiry_month;

  const getMailValidator = (tableData) => (rowId) => ({
    validator(_, value) {
      const firstRowId = tableData[0]?.id;
      const lastRowId = tableData[tableData.length - 1]?.id;

      const firstValue = form.getFieldValue(`mail_sent_day_ago-${firstRowId}`);
      const lastValue = form.getFieldValue(`mail_sent_day_ago-${lastRowId}`);

      const maxAllowed = Number(settingData?.enable_point_expiry_month);

      if (value === undefined || value === '') {
        return Promise.reject(new Error('This field is required'));
      }

      if (!/^\d+$/.test(String(value))) {
        return Promise.reject(
          new Error('Only whole numbers are allowed (no decimals)')
        );
      }
      if (Number(value) <= 0) {
        return Promise.reject(new Error('Value must be greater than 0'));
      }

      if (maxAllowed && Number(value) > maxAllowed) {
        return Promise.reject(
          new Error(
            `As points expire within ${maxAllowed} days, reminder notifications cannot be set beyond this period.`
          )
        );
      }

      if (
        firstValue !== undefined &&
        lastValue !== undefined &&
        Number(firstValue) <= Number(lastValue)
      ) {
        if (rowId === firstRowId) {
          return Promise.reject(
            new Error(
              'First reminder days must be greater than final reminder days'
            )
          );
        }
        if (rowId === lastRowId) {
          return Promise.reject(
            new Error(
              'Final reminder days must be less than first reminder days'
            )
          );
        }
      }

      return Promise.resolve();
    },
  });

  const coloms = [
    {
      title: 'Status',
      dataIndex: 'username',
      key: 'customer-name',
      width: 120,
      sorter: false,
      sortValue: 'reward_id',
      render: (cell, row) => (
        <Form.Item
          initialValue={row?.status === '1' ? true : false}
          name={`status-${row?.id}`}
        >
          <AitSwitch />
        </Form.Item>
      ),
    },
    {
      title: 'Email type',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      sorter: false,
      sortValue: 'first_name',
      render: (cell, row) => (
        <Form.Item>{checkValidData(row?.email_type)}</Form.Item>
      ),
    },
    // {
    //   title: 'Email Days ago',
    //   dataIndex: 'email',
    //   key: 'email',
    //   width: 320,
    //
    //   sorter: false,
    //   sortValue: 'decoded_email',
    //   render: (cell, row) => (
    //     <Form.Item
    //       key={`mail-${row.id}`}
    //       name={`mail_sent_day_ago-${row.id}`}
    //       initialValue={row?.mail_sent_day_ago}
    //       rules={[validateFirstGreaterThanLast]}
    //     >
    //       <AitInputBox />
    //     </Form.Item>
    //   ),
    // },
    {
      title: 'Email days ago',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (cell, row) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          // key={`mail-${row.id}`}
          initialValue={row?.mail_sent_day_ago}
          name={`mail_sent_day_ago-${row.id}`}
          rules={[getMailValidator(tableData)(row.id)]}
        >
          <AitInputBox
            onChange={() => {
              const firstRowId = tableData[0]?.id;
              const lastRowId = tableData[tableData.length - 1]?.id;

              // Only last row change triggers first row validation
              if (row.id === lastRowId) {
                form.validateFields([`mail_sent_day_ago-${firstRowId}`]);
              }
            }}
          />
        </Form.Item>
      ),
    },

    {
      title: 'Email template',
      dataIndex: 'email',
      key: 'email',
      width: 400,
      sorter: false,
      sortValue: 'discount_amount',
      render: (cell, row) => (
        <Form.Item
          style={{ marginBottom: 0 }}
          initialValue={row?.template_id}
          name={`template_id-${row?.id}`}
        >
          <AitSelectBox options={tamplateList} />
        </Form.Item>
      ),
    },
    {
      title: '',
      dataIndex: 'email',
      width: 100,
      key: 'email',
      fixed: 'right',
      sorter: false,
      sortValue: 'discount_amount',
      render(cell, row) {
        return (
          <Form.Item>
            <Flex>
              <Space>
                <Tooltip placement="top" title="Tamplate preview">
                  <span onClick={() => handleViewDetails(row?.template_id)}>
                    <ViewIcon />
                  </span>
                </Tooltip>
                <Tooltip placement="top" title="Tamplate edit">
                  <span onClick={() => handleViewDetails(row?.template_id)}>
                    <Editicon
                      onClick={() => handleViewDetails(row?.template_id)}
                    />
                  </span>
                </Tooltip>
              </Space>
            </Flex>
          </Form.Item>
        );
      },
    },
  ];

  const onHandleSaveDKIMSetting = async (value) => {
    setEmailLoading(true);
    try {
      let payload = {
        act: 'save_dkim_email_setting',
        from_email_dkim_name:
          value?.from_email_dkim_name || settingData?.from_email_dkim_name,
        from_email_dkim_username:
          value?.from_email_dkim_username ||
          settingData?.from_email_dkim_username,
        loyalty_email_from_dkim: emailState,
      };
      const response = await saveEmailSettingService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: 'Setting has been updated successfully.',
        });
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
      setEmailLoading(false);
    } finally {
      setEmailLoading(false);
    }
  };

  function mergePayload(original, formValues) {
    const output = structuredClone(original);
    Object.entries(formValues).forEach(([key, value]) => {
      const [field, id] = key.split('-');
      const targetKey = Object.keys(output).find((k) => output[k]?.id === id);
      if (targetKey) {
        const val = isNaN(Number(value)) ? value : Number(value);
        output[targetKey][field] = val?.toString();
      }
    });
    return output;
  }

  const getEmailSettingData = async () => {
    setLoading(true);
    try {
      let payload = { act: 'get_email_setting' };

      const res = await getEmailSettingService({
        act: 'get_lyt_exp_reminder_email_tempalte_list',
        category: 'Loyalty point expire',
      });

      if (res?.data?.status === 'success') {
        let arr = res?.data?.templatelist?.map((item) => {
          return {
            label: item?.title,
            value: item?.id,
            encoded_id: item?.encoded_id,
          };
        });
        setTamplateList(arr);
      }
      const response = await getEmailSettingService(payload);
      if (response?.data?.status === 'success') {
        const arr = [];

        for (const key in response?.data?.data) {
          arr.push({ key, ...response?.data?.data[key] });
        }
        arr.sort((a, b) => Number(a.id) - Number(b.id));
        setEmailTypeData(response?.data?.data);
        setTableData(arr);
        setSettingData(response?.data?.lytSettings);
        setEmailState(
          response?.data?.lytSettings?.loyalty_email_from_dkim || 'aitrillion'
        );
      }
    } catch (error) {
      logger(error?.response);
    }
    setLoading(false);
  };

  const onHandleSaveEmailSetting = async (value) => {
    setDKIMloading(true);
    try {
      let payload = {
        act: 'save_email_setting',
        ...mergePayload(emailTypeData, value),
      };
      const response = await saveEmailSettingService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: 'Email setting has been updated successfully.',
        });
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
      setDKIMloading(false);
    } finally {
      setDKIMloading(false);
    }
  };

  useEffect(() => {
    getEmailSettingData();
  }, []);

  return (
    <>
      <AitPageHeader
        title="Point expiry email settings"
        // subtitle="General settings for loyalty program."
        hideButton
      />
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // full viewport height
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          {' '}
          <AitCard
            style={{
              boxSizing: 'border-box',
              marginBottom: '24px',
            }}
            bodypadding={{
              xs: '20px',
              sm: '20px 24px',
              md: '24px',
            }}
          >
            <Form
              initialValues={{
                from_email_dkim_name: settingData?.from_email_dkim_name,
                from_email_dkim_username: settingData?.from_email_dkim_username,
                review_from_emailid: settingData?.review_from_emailid,
              }}
              onFinish={onHandleSaveDKIMSetting}
            >
              <AitText strong size={18} type="primary">
                From email setting
              </AitText>
              <>
                <Row gutter={24} style={{ marginTop: 24 }}>
                  <Col xs={24} sm={24} md={24} lg={12}>
                    <AitRadioButton
                      marginbottom={0}
                      isRowCol
                      gap={0}
                      value={emailState}
                      onChange={(e) => {
                        setEmailState(e.target.value);
                      }}
                      options={[
                        {
                          label: `Aitrillion Email`,
                          helpertext: (
                            <div style={{ marginTop: 15 }}>
                              {emailState === 'aitrillion' && (
                                <Form.Item name="review_from_emailid">
                                  <AitInputBox
                                    label="Email Address"
                                    // style={{ width: 800 }}
                                    disabled
                                  />
                                </Form.Item>
                              )}
                            </div>
                          ),
                          value: 'aitrillion',
                          colSpan: 24,
                        },
                        {
                          label: `Use your own custom domain`,
                          helpertext: (
                            <div>
                              {emailState === 'dkim' && (
                                <div
                                  style={{
                                    fontWeight: 400,
                                    color: '#666',
                                    fontSize: 13,
                                    marginTop: 15,
                                  }}
                                >
                                  {parseFloat(settingData?.isValidDkim) ===
                                  1 ? (
                                    <>
                                      {' '}
                                      <Form.Item name="from_email_dkim_name">
                                        <AitInputBox label="From name" />
                                      </Form.Item>
                                      <Form.Item
                                        name="from_email_dkim_username"
                                        style={{ marginBottom: 0 }}
                                      >
                                        <AitInputBox
                                          label="Email Address"
                                          addonAfter={`@${settingData?.dkim_domain_name}`}
                                        />
                                      </Form.Item>
                                    </>
                                  ) : (
                                    <AitButton
                                      variant="outlined"
                                      color="primary"
                                      title="Setup DKIM"
                                      // htmlType="submit"
                                      onClick={() => {
                                        if (
                                          jwtState?.login_auth
                                            ?.is_enable_email_marketing_v2 ===
                                          '1'
                                        ) {
                                          router.push(
                                            `${window?.location?.origin}/email-marketing/settings/dkimsetting`
                                          );
                                        } else {
                                          window.location.replace(
                                            `${process.env.NEXT_PUBLIC_APP_URL}/index/dkimsetting`
                                          );
                                        }
                                      }}
                                    />
                                  )}
                                  {/* <Form.Item name="from_email_dkim_username">
                                    <AitInputBox
                                      label="Email Address"
                                      // addonAfter="@aitrillion.com"
                                    />{' '}
                                  </Form.Item> */}
                                </div>
                              )}
                            </div>
                          ),
                          value: 'dkim',
                          colSpan: 24,
                        },
                      ]}
                    />
                  </Col>
                </Row>
              </>
              <div style={{ marginTop: 24, paddingLeft: 25 }}>
                <AitButton
                  type="primary"
                  title="Save"
                  htmlType="submit"
                  // loading={dkimEmailLoading}
                  loading={emailLoading}
                  disabled={
                    emailState === 'dkim' &&
                    settingData?.loyalty_email_from_dkim === null
                  }
                />
              </div>
            </Form>
          </AitCard>
          <AitCard
            style={{
              boxSizing: 'border-box',
              marginBottom: '24px',
            }}
            bodypadding={{
              xs: '5px 20px 20px 20px',
              sm: '5px 20px 20px 20px',
              md: '5px 24px 24px 24px',
            }}
          >
            <Form onFinish={onHandleSaveEmailSetting} form={form}>
              <CustomAitTable
                verticalScrollminHeight={100}
                tableData={tableData}
                columns={coloms}
                pagination={false}
              />
              <AitButton
                style={{ marginTop: 24 }}
                type="primary"
                title="Save"
                htmlType="submit"
                // loading={emailLoading}
                loading={dkimEmailLoading}
              />
            </Form>
          </AitCard>
        </>
      )}
    </>
  );
}

export default EmailSettingTamplate;
