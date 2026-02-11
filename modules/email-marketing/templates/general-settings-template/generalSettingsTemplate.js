import MainWrapper from '@/components/atoms/main-wrapper/mainWrapper';
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import React, { useEffect } from 'react';
import { LayoutContainer, LinkStyle, StyleTitleWrap, TitleStyle } from './style';
import SettingsToggleCard from '../../molecules/settings-toggle-card/settingsToggleCard';
import { App, Space, Tooltip, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmailSettings,
  updateEmailSettingApi,
} from '@/redux/apis/email-marketing-apis/emailMarketingApis';
import { emailSettingsConfig } from '../../utils/constants';
import { updateEmailSettingsReset } from '@/redux/email-marketing-slices/settingsSlice/settingsSlice';
import GeneralSettingsDomainSaperationTemplate from '../general-settings-domain-saperation-template/generalSettingsDomainSaperationTemplate';
import { decodeJWTToken } from '@/utils/authHelpers';
import { HelpDocSvgIcon } from '../../svg-icons';

const GeneralSettingsTemplate = () => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const { userDetails } = useSelector(
    (state) => state.loggedInUserDetailsState
  );

  const { shop_id = '' } = userDetails || {};
  const {
    settings,
    loadingMap,
    updateEmailSettingssApiState,
    updateEmailSettingssMessage,
  } = useSelector((state) => state.emailMarketingSettingsState);

  useEffect(() => {
    if (!shop_id) return;
    dispatch(
      fetchEmailSettings({
        act: 'get_email_marketing_status',
        shop_id: shop_id,
      })
    );
    decodeJWTToken();
  }, [shop_id]);

  useEffect(() => {
    if (updateEmailSettingssApiState === 'success') {
      notification.success({
        message: updateEmailSettingssMessage,
      });
      dispatch(updateEmailSettingsReset());
    }
    if (updateEmailSettingssApiState === 'error') {
      notification.error({
        message: updateEmailSettingssMessage,
      });
      dispatch(updateEmailSettingsReset());
    }
  }, [updateEmailSettingssApiState]);

  const handleToggle = (key, act, checkedValue) => {
    dispatch(
      updateEmailSettingApi({
        act,
        shop_id,
        [key]: checkedValue ? 1 : 0,
      })
    );
  };

  return (
    <>
      <LayoutContainer>
        {/*StickyAlertWrapper*/}
        <MainWrapper>
          <AitPageHeader
            title="General settings"
            subtitle="Manage all email marketing settings from here."
            hideButton
          />
          <Space direction="vertical" style={{ width: '100%' }}>
            {emailSettingsConfig.map(({ key, title, description, kb_link, act }) => {
              const checked = settings?.[key] === '1' || settings?.[key] === 1;
              return (
                <SettingsToggleCard
                  key={key}
                  title={title}
                  titlemargin={'2px 0px 10px 0px'}
                  description={description}
                  kb_link={kb_link}
                  checked={checked}
                  loading={!!loadingMap?.[key]}
                  onChange={(checked) => handleToggle(key, act, checked)}
                />
              );
            })}
          </Space>
          <div style={{marginTop:24, marginBottom:24}}>
              <StyleTitleWrap level={4} color="primary"><TitleStyle>Domain suppression  <Tooltip placement="right" title="Help doc">
               <LinkStyle target='_blank' href="https://docs.aitrillion.com/portal/en/kb/articles/block-customers-in-aitrillion-by-domain-or-import-customers-as-inactive#Introduction"><HelpDocSvgIcon/></LinkStyle>
              </Tooltip></TitleStyle>              
             
                </StyleTitleWrap>
              <Typography.Text type="secondary">Mark customers inactive based on their domain appear in the email such as (@domain.com)</Typography.Text>
               <div style={{marginTop:24}}>
                <GeneralSettingsDomainSaperationTemplate/>
               </div>           
          </div>           
        </MainWrapper>
      </LayoutContainer>    
    </>
  );
};

export default GeneralSettingsTemplate;
