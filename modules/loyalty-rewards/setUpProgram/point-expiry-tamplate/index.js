import React, { useEffect, useState } from 'react';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import {
  Form,
  Switch,
  Button,
  Divider,
  Row,
  Col,
  Flex,
  Space,
  Spin,
  App,
} from 'antd';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import {
  AlertBox,
  DescriptionText,
  FooterCard,
  FooterTextSub,
  FooterTextTitle,
  LabelText,
  TitleText,
} from './style';
import { ModalAlertIcon } from '../../svg-icons';
import AitButton from '@/components/atoms/ait-button/aitButton';
import logger from '@/utils/logger';
import {
  getPointExpiryDataService,
  updatePointExpiryStatusService,
} from '../../api/pointExpiry';
import { useSelector } from 'react-redux';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import moment from 'moment';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { useRouter } from 'next/router';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

function PointExpiryTamplate({ settings, expireDate }) {
  const router = useRouter();
  const jwtState = useSelector((state) => state?.jwtState);
  const { notification } = App.useApp();
  const [pointExpiryEnabled, setPointExpiryEnabled] = useState(true);
  const [popupEnabled, setPopupEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState();
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [daysValue, setDaysValue] = useState();

  const getPointExpiryData = async () => {
    setLoading(true);
    try {
      const response = await getPointExpiryDataService({});
      if (response?.data?.status === 'success') {
        setApiData(response?.data);
        setDaysValue(response?.data?.enable_point_expiry_month);
        setPointExpiryEnabled(
          response?.data?.enable_point_expiry === '1' ? true : false
        );
        setPopupEnabled(
          response?.data?.show_reward_point_expiry_date === '1' ? true : false
        );
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  const updatePointExpiryStatus = async (type) => {
    setStatusUpdateLoading(true);
    try {
      let payload = {
        expiryMonth: apiData?.point_expiration_start_from
          ? apiData?.enable_point_expiry_month
          : 90,
        enableExpiry:
          type === 'module'
            ? apiData?.enable_point_expiry === '1'
              ? 0
              : 1
            : apiData?.enable_point_expiry,
        showRewardPointExpiryDate:
          type !== 'module'
            ? apiData?.show_reward_point_expiry_date === '1'
              ? 0
              : 1
            : apiData?.show_reward_point_expiry_date,
        alertshowexpirymonthinput: apiData?.alert_before_point_expiry_date || 0,
        alertshowexpirymonthinputtext:
          apiData?.alert_message_for_point_expiry_date || '',
        alertshowexpirymonthtodayinputtext:
          apiData?.alert_message_for_point_expiry_today,
        expiry_date: apiData?.point_expiration_start_from || '',
        act: 'store_customer_point_expiry',
        shop_id: jwtState?.login_auth?.shop_id || '',
      };
      const response = await updatePointExpiryStatusService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        if (type === 'module') {
          setPointExpiryEnabled(
            apiData?.enable_point_expiry === '1' ? false : true
          );
          setApiData((prev) => ({
            ...prev,
            enable_point_expiry:
              apiData?.enable_point_expiry === '1' ? '0' : '1',
          }));
        } else {
          setPopupEnabled(
            apiData?.show_reward_point_expiry_date === '1' ? false : true
          );
          setApiData((prev) => ({
            ...prev,
            show_reward_point_expiry_date:
              apiData?.show_reward_point_expiry_date === '1' ? '0' : '1',
          }));
        }
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const onFinish = async (value) => {
    setFormLoading(true);

    try {
      let payload = {
        expiryMonth: value?.expiry_date || 0,
        enableExpiry: apiData?.enable_point_expiry,
        showRewardPointExpiryDate: apiData?.show_reward_point_expiry_date,
        alertshowexpirymonthinput: value?.alertshowexpirymonthinput || 0,
        alertshowexpirymonthinputtext:
          value?.alertshowexpirymonthinputtext || '',
        alertshowexpirymonthtodayinputtext:
          value?.alertshowexpirymonthtodayinputtext,
        expiry_date: apiData?.point_expiration_start_from || '',
        act: 'store_customer_point_expiry',
        shop_id: jwtState?.login_auth?.shop_id || '',
      };
      const response = await updatePointExpiryStatusService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });

        setApiData((prev) => ({
          ...prev,
          enable_point_expiry_month: value?.expiry_date || '',
          alert_before_point_expiry_date:
            value?.alertshowexpirymonthinput || '',
          alert_message_for_point_expiry_date:
            value?.alertshowexpirymonthinputtext || '',
          alert_message_for_point_expiry_today:
            value?.alertshowexpirymonthtodayinputtext,
        }));
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    getPointExpiryData();
  }, []);

  return (
    <>
      <AitPageHeader
        title="Points expiry"
        subtitle="Points expiration allows you to automatically expire points earned by customers according to the schedule you specified."
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
        <FullPageLoader loading={statusUpdateLoading}>
          <AitCard bodypadding={{ md: '24px 24px ', xs: '20px 20px' }}>
            <TitleText>
              Point expiry is{' '}
              {`${apiData?.enable_point_expiry === '1' ? 'enabled' : 'disabled'}`}
            </TitleText>
            {apiData?.point_expiration_start_from !== '' &&
              apiData?.point_expiration_start_from !== '0000-00-00' &&
              apiData?.enable_point_expiry === '1' && (
                <DescriptionText>
                  You enabled point expiry on{' '}
                  <b>
                    {apiData?.point_expiration_start_from
                      ? moment(apiData?.point_expiration_start_from).format(
                          'MMMM Do YYYY'
                        )
                      : moment()?.format('MMMM Do YYYY')}
                  </b>
                  .
                </DescriptionText>
              )}

            <DescriptionText>
              Customer points will start to expire in {daysValue} days from the
              point expiry program start date. After this date, all unredeemed
              points will expire on a rolling basis for customers who have not
              placed orders for {daysValue} days or more.
            </DescriptionText>

            <Form layout="vertical" onFinish={onFinish}>
              {/* Enable / Disable Switch */}
              <Form.Item style={{ marginBottom: 10 }}>
                <Flex>
                  <Space size="small">
                    <AitSwitch
                      checked={pointExpiryEnabled}
                      onChange={() => updatePointExpiryStatus('module')}
                    />
                    <LabelText>Enable or disable point expiry</LabelText>
                  </Space>
                </Flex>
              </Form.Item>

              {pointExpiryEnabled && (
                <>
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="expiry_date"
                        initialValue={apiData?.enable_point_expiry_month || 90}
                      >
                        <AitInputBox
                          label="Expire points after (in days)"
                          placeholder="Enter days (e.g., 90)"
                          // defaultValue={90}
                          onChange={(e) => setDaysValue(e?.target?.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <AitAlert
                        type="warning"
                        justify="start"
                        //hascustomicon={false}
                        barfontsize="13"
                        barpadding="8px 10px"
                        alignicon="start"
                        textAlign="left"
                        icontopspacing="2"
                        border
                        borderradius
                        showIcon
                        color="var(--ant-color-text-default)"
                        message="Expire points after above specified day(s) from the customer’s last order."
                        style={{ marginBottom: 16 }}
                      />
                    </Col>
                  </Row>

                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <AitAlert
                        type="info"
                        justify="start"
                        //hascustomicon={false}
                        barfontsize="13"
                        barpadding="8px 10px"
                        alignicon="start"
                        textAlign="left"
                        icontopspacing="2"
                        border={false}
                        borderradius
                        showIcon={false}
                        bgcolor="#f8f8f8"
                        color="var(--ant-color-text-default)"
                        message={
                          <>
                            <Button
                              type="link"
                              style={{ padding: '0px ', fontSize: '12px' }}
                              onClick={() =>
                                window.open(
                                  'https://docs.aitrillion.com/portal/en/kb/articles/configure-loyalty-points-expiry#h_8328136749',
                                  '_blank',
                                  'noopener,noreferrer'
                                )
                              }
                            >
                              Click here
                            </Button>{' '}
                            to learn about changing the expiry period.
                          </>
                        }
                        style={{ marginBottom: 16 }}
                      />
                    </Col>
                  </Row>

                  {/* Loyalty Point Expiry Pop-up */}
                  <Form.Item style={{ marginBottom: 10, marginTop: 24 }}>
                    <Flex>
                      <Space size="small">
                        <AitSwitch
                          checked={popupEnabled}
                          // onChange={setPopupEnabled}
                          onChange={() => updatePointExpiryStatus('popup')}
                        />
                        <LabelText>
                          Show loyalty point expiry days to customers on the
                          storefront loyalty pop-up
                        </LabelText>
                      </Space>
                    </Flex>
                  </Form.Item>

                  {popupEnabled && (
                    <>
                      <Row gutter={[24, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="alertshowexpirymonthinput"
                            initialValue={
                              apiData?.alert_before_point_expiry_date
                            }
                          >
                            <AitInputBox
                              label="Display remaining days before points expire on the loyalty popup"
                              placeholder="1"
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[24, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="alertshowexpirymonthinputtext"
                            initialValue={
                              apiData?.alert_message_for_point_expiry_date
                            }
                          >
                            <AitInputBox
                              label="Message for expiring points before point expiry date"
                              placeholder="Your loyalty points are set to expire in {{points_expiry_days}} day(s). Redeem them or make a new purchase to keep them active."
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={[24, 16]}>
                        <Col xs={24} sm={12}>
                          <Form.Item
                            name="alertshowexpirymonthtodayinputtext"
                            initialValue={
                              apiData?.alert_message_for_point_expiry_today
                            }
                          >
                            <AitInputBox
                              label="Message for same-day point expiry"
                              placeholder="Your loyalty points are set to expire today. Redeem them or make a new purchase to keep them active."
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}
                  <AitButton
                    loading={formLoading}
                    disabled={formLoading}
                    type="primary"
                    size="large"
                    title="Update"
                    htmlType="submit"
                  />
                </>
              )}
            </Form>

            {/* Footer Section */}
            {pointExpiryEnabled && (
              <FooterCard bodypadding={{ md: '16px' }}>
                <Flex
                  justify="space-between"
                  align="center"
                  wrap="wrap"
                  gap={12}
                >
                  <div>
                    <FooterTextTitle>
                      Want to send point expiry reminder email?
                    </FooterTextTitle>
                    <FooterTextSub>
                      Set up automated email reminders to notify your customers
                      before their points expire.
                    </FooterTextSub>
                  </div>

                  <Button
                    type="default"
                    size="large"
                    style={{ color: 'var(--ant-color-primary)' }}
                    onClick={() =>
                      router.push(moduleRoute?.loyalty_rewards?.email_settings)
                    }
                  >
                    Click to setup
                  </Button>
                </Flex>
              </FooterCard>
            )}
          </AitCard>
        </FullPageLoader>
      )}
    </>
  );
}

export default PointExpiryTamplate;
