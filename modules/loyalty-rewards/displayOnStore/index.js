import { useSelector } from 'react-redux';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import AitCard from '@/components/atoms/ait-card/aitCard';
import { Col, Row, Form, Typography, Tooltip, Spin, App } from 'antd';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import { useEffect, useMemo, useState } from 'react';
import ButtonTab from './buttonTab/ButtonTab';
import PopupTab from './popupTab/PopupTab';
import WidgetsTab from './widgetsTab/WidgetsTab';
import AitRowWrapper from '@/components/atoms/ait-row-wrapper/aitRowWrapper';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { InfoCircleOutlined, LockOutlined } from '@ant-design/icons';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitText from '@/components/atoms/ait-text/aitText';
import PageTab from './pageTab/PageTab';
import logger from '@/utils/logger';
import {
  getDisplayOnStoreService,
  saveDisplayOnStoreService,
} from '../api/displayOnStore';
import { convertToFormDataCustom } from '@/utils/common.util';
import { getAccessMap, handleLockIconClick } from '@/modules/layouts/helper';
import { LockRestrictedIcon } from '@/modules/layouts/svg-icons';
const { Title, Text } = Typography;
import { useRouter } from 'next/router';

function DisplayOnStoreTemplate() {
  const [form] = Form.useForm();
  const btnText = Form.useWatch('btn_text', form);
  const { notification } = App.useApp();
  const router = useRouter();
  const jwtState = useSelector((state) => state?.jwtState);
  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const [activeTab, setActiveTab] = useState('button');
  const rowPadding = { xs: 16, sm: 24, md: 24 };
  const [storeAPIData, setStoreAPIData] = useState();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [buttonTabState, setButtonTabState] = useState({
    position: 'left',
    percent: '0',
    lyt_btn_text_color: 'FFFFFF',
    lyt_btn_color: '15C0F5',
  });
  const [popupTabState, setPopupTabState] = useState({
    btn_text_color: 'FFFFFF',
    btn_color: '15C0F5',
    intro_header_text: '',
    left_title: '',
    intro_header_activity_heading: '',
    intro_footer_heading: '',
    help_text: '',
  });
  const [widgetsTabState, setWidgetsTabState] = useState({
    shortcode_btn_color: '',
    shortcode_btn_text_color: '',
  });
  const [pageTabState, setPageTabState] = useState({
    panel_widget_status: false,
  });

  const getStoreData = async () => {
    setLoading(true);
    try {
      const response = await getDisplayOnStoreService();
      if (response?.data?.status === 'success') {
        if (response?.data?.data === '') {
          setButtonTabState((prev) => ({
            ...prev,
            lyt_btn_color: 'FFFFFF',
            lyt_btn_text_color: '000000',
          }));
        } else {
          let apiRes = Object.fromEntries(
            Object.entries(response?.data?.data).filter(
              ([_, value]) =>
                value !== undefined &&
                value !== null &&
                value !== 'undefined' &&
                value !== 'null'
            )
          );

          setStoreAPIData(apiRes);
          form.setFieldsValue({
            ...apiRes,
            is_show_btn: apiRes.is_show_btn === '1' ? true : false,
            hide_btn_in_mobile:
              apiRes?.hide_btn_in_mobile === '1' ? true : false,
            panel_widget_status:
              apiRes?.panel_widget_status === '1' ? true : false,
            help_text: apiRes?.help_text || '',
          });

          setButtonTabState((prev) => ({
            ...prev,
            ...apiRes,
            btn_text: apiRes?.btn_text || 'Rewards',
            position: apiRes?.btn_position || 'left',
            percent: apiRes?.btn_vertical_position || '30',
            lyt_btn_color: apiRes?.lyt_btn_color,
            lyt_btn_text_color: apiRes?.lyt_btn_text_color,
          }));
          setPopupTabState((prev) => ({
            ...prev,
            ...apiRes,
            help_text: apiRes?.help_text || '',
          }));
          setWidgetsTabState((prev) => ({
            ...prev,
            ...apiRes,
            loyalty_earn_points_color_hidden: apiRes?.loyalty_earn_points_color,
          }));
          setPageTabState((prev) => ({
            ...prev,
            ...apiRes,
            panel_widget_status:
              apiRes?.panel_widget_status === '1' ? true : false,
          }));
        }
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (storeAPIData) {
      // Reset form fields to initial API values
      form.setFieldsValue({
        ...storeAPIData,
        is_show_btn: storeAPIData.is_show_btn === '1' ? true : false,
        hide_btn_in_mobile:
          storeAPIData?.hide_btn_in_mobile === '1' ? true : false,
        panel_widget_status:
          storeAPIData?.panel_widget_status === '1' ? true : false,
      });

      // Reset button tab state to initial values
      setButtonTabState({
        ...storeAPIData,
        btn_text: storeAPIData?.btn_text || 'Rewards',
        position: storeAPIData?.btn_position || 'left',
        percent: storeAPIData?.btn_vertical_position || '30',
        lyt_btn_color: storeAPIData?.lyt_btn_color || '15C0F5',
        lyt_btn_text_color: storeAPIData?.lyt_btn_text_color || 'FFFFFF',
      });

      // Reset popup tab state to initial values
      setPopupTabState({
        ...storeAPIData,
        btn_text_color: storeAPIData?.btn_text_color || 'FFFFFF',
        btn_color: storeAPIData?.btn_color || '15C0F5',
        intro_header_text: storeAPIData?.intro_header_text || '',
        left_title: storeAPIData?.left_title || '',
        intro_header_activity_heading:
          storeAPIData?.intro_header_activity_heading || '',
        intro_footer_heading: storeAPIData?.intro_footer_heading || '',
        help_text: storeAPIData?.help_text || '',
      });

      // Reset widgets tab state to initial values
      setWidgetsTabState({
        ...storeAPIData,
        shortcode_btn_color: storeAPIData?.shortcode_btn_color || '',
        shortcode_btn_text_color: storeAPIData?.shortcode_btn_text_color || '',
        loyalty_earn_points_color_hidden:
          storeAPIData?.loyalty_earn_points_color || '',
        loyalty_earn_points_coll_color:
          storeAPIData?.loyalty_earn_points_coll_color || '',
      });

      // Reset page tab state to initial values
      setPageTabState({
        ...storeAPIData,
        panel_widget_status:
          storeAPIData?.panel_widget_status === '1' ? true : false,
        panel_widget_shortcode: storeAPIData?.panel_widget_shortcode || '',
      });
    } else {
      // If no API data, reset to default values
      form.resetFields();
      setButtonTabState({
        position: 'left',
        percent: '0',
        lyt_btn_text_color: 'FFFFFF',
        lyt_btn_color: '15C0F5',
      });
      setPopupTabState({
        btn_text_color: 'FFFFFF',
        btn_color: '15C0F5',
        intro_header_text: '',
        left_title: '',
        intro_header_activity_heading: '',
        intro_footer_heading: '',
        help_text: '',
      });
      setWidgetsTabState({
        shortcode_btn_color: '',
        shortcode_btn_text_color: '',
      });
      setPageTabState({
        panel_widget_status: false,
      });
    }
  };

  const onHandleSaveSetting = async (value) => {
    setFormLoading(true);

    try {
      let obj = {
        ...value,
        btn_color: popupTabState?.btn_color,
        btn_text_color: popupTabState?.btn_text_color,
        lyt_btn_color: buttonTabState?.lyt_btn_color,
        lyt_btn_text_color: buttonTabState?.lyt_btn_text_color,
        shortcode_btn_color: popupTabState?.btn_color,
        shortcode_btn_text_color: popupTabState?.btn_text_color,
        loyalty_earn_points_color:
          widgetsTabState?.loyalty_earn_points_color_hidden,
        loyalty_earn_points_coll_color:
          widgetsTabState?.loyalty_earn_points_coll_color,
        sidebar_color: popupTabState?.btn_color,
        btn_position: buttonTabState?.position,
        btn_vertical_position: buttonTabState?.percent || '30',
        sidebar_menu_color: popupTabState?.btn_color,
        aio_popup_text_color: popupTabState?.btn_text_color,
        left_header_color: popupTabState?.btn_color,
        is_enable: '0',
        intro_header_background_color: popupTabState?.btn_color,
        notify_for_points: '1',
        notify_new_visitors: '1',
        prompt_for_referral: '1',
        is_show_btn: value?.is_show_btn === true ? '1' : '0',
        hide_btn_in_mobile: value?.hide_btn_in_mobile === true ? '1' : '0',
        is_displayrule: '0',
        panel_widget_status:
          pageTabState?.panel_widget_status === true ? '1' : '0',
        // aio_popup_text_color: '2c2e30',
        help_text: value?.help_text || popupTabState?.help_text || '',
      };

      // delete obj.btn_vertical_position;
      delete obj.enable_panal_shorcode;
      delete obj.btn_color1;
      // delete obj.btn_position;
      // delete obj.loyalty_earn_points_color;
      delete obj.loyalty_earn_points_color_hidden;

      let payload = convertToFormDataCustom(obj);

      const response = await saveDisplayOnStoreService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
      } else {
        notification.error({
          message: response?.data?.msg,
        });
        setFormLoading(false);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    getStoreData();
  }, []);

  // Build accessMap once
  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

  const tabItems = [
    {
      label: 'Button',
      key: 'button',
    },
    {
      label: 'Popup',
      key: 'popup',
    },
    {
      label: 'Widgets',
      key: 'widgets',
      ai_module_feature: 'loyalty_rewards_cart_redeem_widget',
    },
    {
      label: 'Page',
      key: 'page',
      ai_module_feature: 'loyalty_rewards_page',
    },
  ];

  const finalTabItems =
    jwtState?.login_auth?.shop_type === 'woocommerce'
      ? tabItems.filter((item) => !['widgets', 'page'].includes(item.key))
      : tabItems;

  const tabItemsWithAccess = finalTabItems.map((item) => {
    const rule = accessMap?.[item.ai_module_feature] || {};
    const isHidden = rule?.action === 'hide' && rule?.access === 'No';
    const isRestricted = rule?.action === 'popup' && rule.access === 'No';
    const upgradeUrl = rule?.content || '/popup?act=upgrade';

    if (isHidden) return null;

    return {
      ...item,
      isRestricted, // 👈 important
      label: isRestricted ? (
        <div
          className="module-locked"
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={(e) => {
            e.stopPropagation(); // 👈 prevents tab activation
            handleLockIconClick(upgradeUrl, router);
          }}
        >
          {item.label}
          <LockRestrictedIcon marginleft={5} />
        </div>
      ) : (
        item.label
      ),
    };
  });

  return (
    <>
      <AitPageHeader title="Display on store" hideButton />
      <Row gutter={[{ xs: 32, sm: 32, md: 32, lg: 50 }]}>
        <AitCard
          hascustomheader={true}
          headerpadding={{ xs: '0px 16px 0px 16px;', md: '0px 25px 0px 25px' }}
          custombodypadding={{ xs: '0px', md: '0px' }}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
          }}
          customheaderleft={
            <AitTabs
              destroyInactiveTabPane={false}
              width="100%"
              defaultActiveKey={activeTab}
              activeKey={activeTab}
              onChange={(key) => {
                const clickedTab = tabItemsWithAccess.find(
                  (item) => item.key === key
                );

                // 🚫 stop restricted tabs from becoming active
                if (clickedTab?.isRestricted) {
                  return;
                }

                setActiveTab(key);
              }}
              items={tabItemsWithAccess}
              // accessMap={accessMap}
            />
          }
        >
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
            <Form form={form} layout="vertical" onFinish={onHandleSaveSetting}>
              {/* {activeTab === 'button' && ( */}
              <ButtonTab
                activeTab={activeTab}
                rowPadding={rowPadding}
                storeAPIData={storeAPIData}
                buttonTabState={buttonTabState}
                setButtonTabState={setButtonTabState}
                btnText={btnText}
              />
              {/* )} */}
              {/* {activeTab === 'popup' && ( */}
              <PopupTab
                activeTabs={activeTab}
                rowPadding={rowPadding}
                popupTabState={popupTabState}
                setPopupTabState={setPopupTabState}
              />
              {/* )} */}
              {/* {activeTab === 'widgets' && ( */}
              <WidgetsTab
                activeTab={activeTab}
                rowPadding={rowPadding}
                setWidgetsTabState={setWidgetsTabState}
                widgetsTabState={widgetsTabState}
              />
              {/* )} */}
              {/* {activeTab === 'page' && ( */}
              <PageTab
                activeTab={activeTab}
                rowPadding={rowPadding}
                setPageTabState={setPageTabState}
                pageTabState={pageTabState}
              />
              {/* )} */}

              <Row gutter={0}>
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  style={{ borderTop: '1px solid #f0f0f0' }}
                >
                  <AitRowWrapper padding={{ xs: 16, sm: 24, md: 24 }}>
                    <Row gutter={[15, 15]} style={{ marginTop: 15 }}>
                      <Col span={24}>
                        <AitText type="secondary" size={13} lineheight={16}>
                          New changes take up to 15 minutes to appear on your
                          site, use this link to view them now.{' '}
                          <AitLink
                            size={13}
                            weight={500}
                            color="primary"
                            href={jwtState?.login_auth?.no_cache_domain}
                            target="_blank"
                          >
                            View changes{' '}
                            <Tooltip
                              placement="bottom"
                              title={
                                'Clicking this link will open your store in a new tab where you can see the changes you made to the button.'
                              }
                            >
                              <InfoCircleOutlined />
                            </Tooltip>
                          </AitLink>
                        </AitText>
                      </Col>
                      <Col span={12}>
                        <AitButton
                          type="primary"
                          title="Save"
                          htmlType="submit"
                          block
                          loading={formLoading}
                        />
                      </Col>
                      <Col span={12}>
                        <AitButton
                          onClick={handleCancel}
                          title="Cancel"
                          variant="filled"
                          color="default"
                          block
                          disabled={formLoading}
                        />
                      </Col>
                    </Row>
                  </AitRowWrapper>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={16}
                  style={{ borderTop: '1px solid #f0f0f0' }}
                ></Col>
              </Row>
            </Form>
          )}
        </AitCard>
      </Row>
    </>
  );
}

export default DisplayOnStoreTemplate;
