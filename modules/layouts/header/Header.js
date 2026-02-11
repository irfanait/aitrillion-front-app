import React, { useEffect, useState } from 'react';
import { Button, Avatar, Grid } from 'antd';
import {
  MenuFoldOutlined,
  CloseOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  LanguageDropdownWrapper,
  CreateNewButtonStyle,
  ReuestforBasicSetupbtn,
  StyledAvtarButton,
  StyledHeader,
  StyleHeaderLeft,
  StyleHeaderRight,
  StyleModulesDrawerBtn,
  UpgradePlanbtn,
} from './headerStyle';
import ProfileDrawer from '../components/molecules/profile-drawer/profileDrawer';
import { getToken, handleLogout } from '@/utils/authHelpers';
import ModulesDrawer from '../components/molecules/modules-drawer/modulesDrawer';
import {
  LanguageDropdownIcon,
  AitrillionLogoBlack,
  FliptoggleIcon,
  MenuCloseIcon,
  MenuOpenIcon,
  ModuleIcon,
  PlusRoundCorenerIcon,
  SupportIcon,
  ToggleSidebarIcon,
} from '../svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setCollapsed } from '@/redux/layout-slice/layoutSlice';
import CreateNewDrawer from '../components/molecules/create-new-drawer/createNewDrawer';
import { useRouter } from 'next/router';
const { useBreakpoint } = Grid;
const token = getToken();

const AppHeader = ({
  toggleSidebar,
  collapsed,
  isDrawerOpen,
  onCloseDrawer,
  is_V1_V2_object,
}) => {
  const router = useRouter();
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const { login_auth } = useSelector((state) => state.jwtState);
  const { shop_owner, shop_type } = useSelector(
    (state) => state.jwtState?.login_auth
  );
  const shopType = shop_type?.toLowerCase() || 'shopify';
  const shopOwner = (shop_owner && shop_owner) || '';
  const shopOwnerArr = shopOwner.split(' ');

  let userInitials = '';
  if (shopOwnerArr.length > 0) {
    const firstInitial = shopOwnerArr[0]?.[0]?.toUpperCase() || 'F';
    const secondInitial = shopOwnerArr[1]?.[0]?.toUpperCase() || 'L';
    userInitials = `${firstInitial}${secondInitial}`;
  }
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [moduleDrawerVisible, setModuleDrawerVisible] = useState(false);

  useEffect(() => {
    const initTranslate = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            // includedLanguages: 'en,fr,de,es,hi',
            autoDisplay: false,
            layout:
              window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          'google_translate_element'
        );
      } else {
        // Try again until Google script is ready
        setTimeout(initTranslate, 1000);
      }
    };
    initTranslate();
  }, []);

  useEffect(() => {
    const hideBranding = () => {
      document
        .querySelectorAll(
          '.goog-logo-link, .goog-te-banner-frame, .goog-te-balloon-frame, #google_translate_element .goog-te-gadget span'
        )
        .forEach((el) => (el.style.display = 'none'));

      const iframe = document.querySelector('iframe.goog-te-menu-frame');
      if (iframe) {
        const innerDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        if (innerDoc) {
          const branding = innerDoc.querySelector(
            'a[href*="translate.google.com"]'
          );
          if (branding) branding.style.display = 'none';
        }
      }
    };

    const observer = new MutationObserver(hideBranding);
    observer.observe(document.body, { childList: true, subtree: true });

    hideBranding();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    #google_translate_element { display: inline-block; }
    .goog-te-gadget { 
    font-size: 0 !important;
    color: transparent !important;
    width: 32px;
    height: 32px; 
    }
    .goog-te-combo {
      background: #eaf2ff!important;
      border-radius: 6px !important;
      border: 1px solid #eaf2ff !important;
      height: 32px !important;
      width: 32px !important;
      cursor: pointer !important;
      font-size: 14px !important;
      padding: 2px 6px !important;
      color: #232e41 !important;
      line-height: normal;
      float: right;
      margin:0px 0px !important;
    }  
    .goog-logo-link,
    .goog-te-banner-frame,
    .goog-te-balloon-frame,
    .goog-te-gadget span {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
    }
    body > .skiptranslate { display: none !important; }
    body { top: 0 !important; }
  `;
    document.head.appendChild(style);
  }, []);

  const toggleProfileDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };
  const [createNewdrawerVisible, setCreateNewdrawerVisible] = useState(false);
  const toggleCreateNewDrawer = () => {
    setCreateNewdrawerVisible(!createNewdrawerVisible);
  };

  const toggleModulesDrawer = () => {
    setModuleDrawerVisible(!moduleDrawerVisible);
  };

  const renderSidebarToggleIcon = () => {
    if (!screens.xl) {
      return isDrawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
    } else {
      return collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
    }
  };

  return (
    <StyledHeader screens={screens}>
      {/* Left Section: Sidebar Toggle & Logo */}
      <StyleHeaderLeft screens={screens}>
        {!screens.xl ? (
          <>
            <Button
              variant="link"
              type="link"
              icon={!isDrawerOpen && <MenuOpenIcon />}
              onClick={isDrawerOpen ? onCloseDrawer : toggleSidebar}
            />
            <AitrillionLogoBlack />
          </>
        ) : (
          <Button
            type="text"
            icon={collapsed ? <MenuCloseIcon /> : <MenuOpenIcon />}
            onClick={() => dispatch(setCollapsed(!collapsed))}
            style={{
              width: 64,
              height: 64,
            }}
          />
        )}
      </StyleHeaderLeft>

      {/* Right Section */}

      <StyleHeaderRight screens={screens}>
        {screens?.md && (
          <>
            {/* <ReuestforBasicSetupbtn variant="solid">
          Request free basic setup
        </ReuestforBasicSetupbtn>*/}

            {login_auth?.shop_id > 1 &&
              login_auth?.is_available_upgrad_plan > 0 && (
                <UpgradePlanbtn
                  variant="solid"
                  onClick={() => router.push(`/popup?act=upgrade`)}
                >
                  {login_auth?.is_free_plan === 1
                    ? 'Upgrade to paid plan'
                    : 'Upgrade plan'}
                </UpgradePlanbtn>
              )}
          </>
        )}

        {!screens?.xs && shopType === 'shopify' && (
          <>
            <CreateNewButtonStyle
              color="#fff"
              type="primary"
              icon={<PlusRoundCorenerIcon />}
              block={true}
              onClick={() => setCreateNewdrawerVisible(true)}
            >
              Create new
            </CreateNewButtonStyle>
            <CreateNewDrawer
              createNewdrawerVisible={createNewdrawerVisible}
              setCreateNewdrawerVisible={setCreateNewdrawerVisible}
              is_V1_V2_object={is_V1_V2_object}
            />
          </>
        )}

        {/* 🌐 Language Dropdown */}
        <LanguageDropdownWrapper>
          <span className="language_dropdown_span">
            <LanguageDropdownIcon />
            <div id="google_translate_element" style={{ opacity: '0' }} />
          </span>
        </LanguageDropdownWrapper>

        {/* Grid/Menu Icon */}

        <StyleModulesDrawerBtn>
          <AitButton
            type="link"
            variant="link"
            color="#232E41"
            padding="0px 0px"
            icon={<ModuleIcon />}
            bordercolor={'transparent'}
            onClick={toggleModulesDrawer}
          />
        </StyleModulesDrawerBtn>

        <ModulesDrawer
          moduleDrawerVisible={moduleDrawerVisible}
          setModuleDrawerVisible={setModuleDrawerVisible}
          is_V1_V2_object={is_V1_V2_object}
        />

        {/* Profile Avatar */}
        <StyledAvtarButton>
          <Avatar
            style={{ backgroundColor: '#FFC107', color: '#fff' }}
            gap={0}
            size={32}
            onClick={toggleProfileDrawer}
          >
            {userInitials}
          </Avatar>
        </StyledAvtarButton>
        <ProfileDrawer
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
          handleLogout={handleLogout}
        />

        {/* Support Button */}
        {/* <StyleSupportBtn>
          <AitButton
            type="link"
            variant="link"
            href={`${process.env.NEXT_PUBLIC_APP_URL}/index/support?ai_v2=${token}`}
            icon={<SupportIcon />}
            padding="0px 0px"
          />
        </StyleSupportBtn> */}
      </StyleHeaderRight>
    </StyledHeader>
  );
};

export default AppHeader;
