import AitButton from '@/components/atoms/ait-button/aitButton';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import { App, Col, Divider, Flex, Form, Row, Space, Typography } from 'antd';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useEffect, useState } from 'react';
import CustomAitTable from '@/components/molecules/custom-ait-table';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import { convertToFormDataCustom } from '@/utils/common.util';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import { Editicon, ViewIcon } from '../../svg-icons';
import { AlertBox } from '../style';
import AitTabs from '@/components/atoms/ait-tabs/aitTabs';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import PopUpSetting from './popupSetting';
import PointReports from './pointReports';
import TierList from './tierList';
import CartWidgetPoint from './cartwidgetPoint';
import ShortcodeSetting from './shortcodeSetting';
import LoyaltyAIBox from './loyaltyAIBox';
import logger from '@/utils/logger';
import {
  changeLanguageSettingService,
  getLanguageSettingService,
  saveLanguageSettingService,
} from '../../api/settings';
import AitText from '@/components/atoms/ait-text/aitText';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Text } = Typography;

function LanguageSettingTamplate() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [apiData, setApiData] = useState();
  const [loading, setLoading] = useState(false);
  const [changeLanguageData, setChangeLanguageData] = useState();

  const getSettingData = async () => {
    setLoading(true);
    try {
      const response = await getLanguageSettingService();
      if (response?.data?.status === 'success') {
        const parsedData = JSON.parse(response.data.data);
        setApiData(parsedData);
        form.setFieldsValue(parsedData);
      }
    } catch (error) {
      logger(error?.response);
    }
    setLoading(false);
  };

  const updateSettingData = async (value) => {
    setLoading(true);
    try {
      let payload = convertToFormDataCustom({ loyaltylanguage: value });
      const response = await changeLanguageSettingService(payload);
      if (response?.data?.status === 'success') {
        if (response.data.language !== null) {
          const parsedData = JSON.parse(response.data.language);
          setChangeLanguageData(parsedData);
          form.setFieldsValue(parsedData);
        } else {
          setChangeLanguageData(apiData);
        }
      }
    } catch (error) {
      logger(error?.response);
    }
    setLoading(false);
  };

  const languageArr = [
    {
      label: 'Select language',
      value: 'Select language',
    },
    {
      label: 'English',
      value: 'English',
    },
    {
      label: 'Vietnamese',
      value: 'Vietnamese',
    },
    {
      label: 'Arabic',
      value: 'Arabic',
    },
    {
      label: 'French',
      value: 'French',
    },
    {
      label: 'German',
      value: 'German',
    },
    {
      label: 'Italian',
      value: 'Italian',
    },
    {
      label: 'Spanish',
      value: 'Spanish',
    },
    {
      label: 'Japanese',
      value: 'Japanese',
    },
    {
      label: 'Chinese',
      value: 'Chinese',
    },
  ];

  const onUpdateSetting = async (value) => {
    setLoading(true);
    try {
      let obj = {
        ...value,
      };

      const payload = convertToFormDataCustom(obj);
      const response = await saveLanguageSettingService(payload);
      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettingData();
  }, []);

  return (
    <>
      <AitPageHeader
        title="Language settings"
        buttonLabel="Update"
        buttonIcon=""
        disabled={loading}
        headerBtn
        hideButton
        headerBtnWithViewLink="View changes"
        onButtonClick={() => onUpdateSetting(form?.getFieldsValue())}
        subtitleRightTooltipTitle="New changes take up to 15 minutes to appear on your site, use this link to view them now."
      />

      <AitCard
        style={{
          marginBottom: '24px',
        }}
      >
        <AitText strong size={18} type="primary">
          Quickly translate your language settings
        </AitText>
        <div style={{ marginTop: 5 }}>
          <AitText type="secondary">
            You can easily update the language setting with a single click on
            your preferred language. Additionally, you can reset to the default
            language anytime you want.
          </AitText>
        </div>
        <>
          <Row gutter={24}>
            <Col span={24}>
              <AitAlert
                style={{ marginBottom: 10, marginTop: 15 }}
                type="warning"
                barfontsize="13"
                barpadding="8px 10px"
                justify="start"
                textAlign="left"
                border
                borderradius
                note
                block="block"
                color="var(--ant-color-text-default)"
                message="Ensure to save any changes made to
                  language settings. Kindly note that any customizations made to
                  the prior language will be lost if you switch to other
                  language settings."
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} style={{ marginTop: 8 }}>
              <AitSelectBox
                placeholder="Select language"
                options={languageArr}
                onChange={(e) => updateSettingData(e)}
              />
            </Col>
          </Row>
        </>
      </AitCard>

      <Form layout="vertical" form={form} onFinish={onUpdateSetting}>
        <Row gutter={[{ xs: 32, sm: 32, md: 32, lg: 50 }]}>
          <AitTabs
            tabspadding={{ xs: '0px 20px', sm: '0px 20px', md: '0px 24px' }}
            style={{ width: '100%' }}
            // defaultActiveKey={activeTab}
            // activeKey={activeTab}
            // onChange={(key) => {
            //   if (key) {
            //     setActiveTab(key);
            //   }
            // }}
            items={[
              {
                label: 'Popup settings',
                key: 'popupSetting',
                children: (
                  <AitCard
                    borderless
                    bordercolor="transparent"
                    token={{
                      colorBgContainer: 'transparent',
                      colorBorderSecondary: 'transparent',
                    }}
                  >
                    <PopUpSetting
                      apiData={changeLanguageData || apiData}
                      loading={loading}
                    />
                  </AitCard>
                ),
              },
              {
                label: 'Point reports',
                key: 'pointreportstab',
                children: (
                  <AitCard
                    borderless
                    bordercolor="transparent"
                    token={{
                      colorBgContainer: 'transparent',
                      colorBorderSecondary: 'transparent',
                    }}
                  >
                    <PointReports
                      apiData={changeLanguageData || apiData}
                      loading={loading}
                    />
                  </AitCard>
                ),
              },
              {
                label: 'Tier list',
                key: 'teirlisttab',
                children: (
                  <AitCard
                    borderless
                    bordercolor="transparent"
                    token={{
                      colorBgContainer: 'transparent',
                      colorBorderSecondary: 'transparent',
                    }}
                  >
                    <TierList
                      apiData={changeLanguageData || apiData}
                      loading={loading}
                    />
                  </AitCard>
                ),
              },
              {
                label: 'Cart widget point',
                key: 'cartwidgettab',
                children: (
                  <AitCard
                    borderless
                    bordercolor="transparent"
                    token={{
                      colorBgContainer: 'transparent',
                      colorBorderSecondary: 'transparent',
                    }}
                  >
                    <CartWidgetPoint
                      apiData={changeLanguageData || apiData}
                      loading={loading}
                    />
                  </AitCard>
                ),
              },
              {
                label: 'Shortcode settings for show points',
                key: 'shortcodetab',
                children: (
                  <AitCard
                    borderless
                    bordercolor="transparent"
                    token={{
                      colorBgContainer: 'transparent',
                      colorBorderSecondary: 'transparent',
                    }}
                  >
                    <ShortcodeSetting
                      apiData={changeLanguageData || apiData}
                      loading={loading}
                    />
                  </AitCard>
                ),
              },
              {
                label: 'Loyalty (AI box)',
                key: 'loyaltytab',
                children: (
                  <AitCard
                    borderless
                    bordercolor="transparent"
                    token={{
                      colorBgContainer: 'transparent',
                      colorBorderSecondary: 'transparent',
                    }}
                  >
                    <LoyaltyAIBox
                      apiData={changeLanguageData || apiData}
                      loading={loading}
                    />
                  </AitCard>
                ),
              },
            ]}
          />
          <Col span={24}>
            <Form.Item>
              <AitButton
                type="primary"
                title="Update"
                htmlType="submit"
                loading={loading}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default LanguageSettingTamplate;
