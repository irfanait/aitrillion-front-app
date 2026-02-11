import React, { useEffect, useMemo, useState } from 'react';
import { Button, Grid } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  CreateNewButtonStyle,
  ReuestforBasicSetupbtn,
  NavTitle,
  SidebarLogoWrapper,
  StyledMenu,
  StyledSider,
  ToggleSidebarbtnStyle,
  UpgradePlanbtn,
} from './sidebarStyle';
import {
  findParentKeys,
  findSelectedLeafKey,
  getAccessMap,
  RenderMenuItems,
} from '../helper';

import { PlusCircleOutlined } from '@ant-design/icons';
import CreateNewDrawer from '../components/molecules/create-new-drawer/createNewDrawer';
import {
  AitrillionLogo,
  AitrillionLogoSmall,
  EditModulesIcon,
  FliptoggleIcon,
  MenuCloseIcon,
  PlusRoundCorenerIcon,
  ToggleSidebarIcon,
} from '../svg-icons';
import Link from 'next/link';

const { useBreakpoint } = Grid;

const Sidebar = ({
  toggleSidebar,
  collapsed,
  isDrawerOpen,
  onCloseDrawer,
  menuList,
  onMenuItemClick,
  activeModules,
  accessModuleWithMapping,
}) => {
  const userDetails = useSelector(
    (state) => state.loggedInUserDetailsState?.userDetails
  );

  const loggeInUserState = useSelector((state) => state.loggeInUserState);
  const shopType = userDetails?.shop_type?.toLowerCase() || 'shopify'; // need to pass in loginAuth
  const router = useRouter();
  const screens = useBreakpoint();
  const [createNewdrawerVisible, setCreateNewdrawerVisible] = useState(false);
  const toggleCreateNewDrawer = () => {
    setCreateNewdrawerVisible(!createNewdrawerVisible);
  };
  const [showPinIcon, setShowPinIcon] = useState(false);

  // Ensure menuList is always an array
  const safeMenuList = menuList || [];

  // Build accessMap once
  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

  // Set initial openKeys on load
  const [openKeys, setOpenKeys] = useState(() => {
    const keys = findParentKeys(safeMenuList, router.pathname);
    return keys.length ? keys : [];
  });

  // Update openKeys on route change
  useEffect(() => {
    const keys = findParentKeys(safeMenuList, router.pathname);
    if (keys?.length) {
      setOpenKeys(keys);
    }
  }, [router.pathname, safeMenuList]);

  // Memoized selectedKey to only highlight leaf
  const selectedKey = useMemo(() => {
    const key = findSelectedLeafKey(safeMenuList, router.pathname);
    return key ? [key] : [];
  }, [router.pathname, safeMenuList]);

  // Accordion open change for only 1 top-level open
  const topLevelKeys = useMemo(
    () => safeMenuList.map((item) => item.nav),
    [safeMenuList]
  );

  const handleOpenChange = (keys) => {
    // Handle closing of top levels
    const openTopLevelsNow = keys.filter((k) => topLevelKeys.includes(k));
    const wasOpenTopLevels = openKeys.filter((k) => topLevelKeys.includes(k));
    const closedTopLevels = wasOpenTopLevels.filter(
      (k) => !openTopLevelsNow.includes(k)
    );

    if (closedTopLevels.length) {
      const newOpenKeys = keys.filter(
        (k) =>
          !closedTopLevels.some(
            (closed) => k === closed || k.startsWith(closed)
          )
      );
      setOpenKeys(newOpenKeys);
      return;
    }

    // Accordion: allow only one top level open
    if (openTopLevelsNow.length > 1) {
      const latestTopLevel = openTopLevelsNow[openTopLevelsNow.length - 1];
      const newOpenKeys = keys.filter(
        (k) => !topLevelKeys.includes(k) || k === latestTopLevel
      );
      setOpenKeys(newOpenKeys);
      return;
    }

    setOpenKeys(keys);
  };

  // 🔹 Defensive: always render hooks first, then optionally early return
  if (!menuList.length) {
    return null;
  }

  const handlePinUnpinModules = () => {
    setShowPinIcon(!showPinIcon);
  };

  //console.log('collapsed', collapsed);
  //console.log('isDrawerOpen', isDrawerOpen);

  return (
    <StyledSider
      width={screens.xl ? 220 : 280}
      collapsedWidth={screens.xl ? 60 : 0}
      collapsed={collapsed}
    >
      {shopType === 'shopify' && (
        <>
          {
            <SidebarLogoWrapper collapsed={collapsed}>
              {!screens.xl ? (
                <>
                  {isDrawerOpen && (
                    <ToggleSidebarbtnStyle
                      variant="link"
                      type="text"
                      icon={<MenuCloseIcon color="#fff" />}
                      onClick={isDrawerOpen ? onCloseDrawer : toggleSidebar}
                    ></ToggleSidebarbtnStyle>
                  )}
                  <Link href={process.env.NEXT_PUBLIC_APP_URL}>
                    <AitrillionLogo />
                  </Link>
                </>
              ) : collapsed ? (
                <Link href={process.env.NEXT_PUBLIC_APP_URL}>
                  <AitrillionLogoSmall />
                </Link>
              ) : (
                <Link href={process.env.NEXT_PUBLIC_APP_URL}>
                  <AitrillionLogo />
                </Link>
              )}
            </SidebarLogoWrapper>
          }
          {!screens.md && (
            <div style={{ padding: '12px 15px 6px 15px' }}>
              <>
                <CreateNewButtonStyle
                  color="#fff"
                  type="primary"
                  icon={<PlusRoundCorenerIcon />}
                  onClick={() => setCreateNewdrawerVisible(true)}
                  block={true}
                >
                  Create new
                </CreateNewButtonStyle>

                <CreateNewDrawer
                  createNewdrawerVisible={createNewdrawerVisible}
                  setCreateNewdrawerVisible={setCreateNewdrawerVisible}
                />
              </>
            </div>
          )}
          {/* {!screens?.md && 
            <div style={{ padding: '6px 15px 6px 15px' }}>
              <ReuestforBasicSetupbtn variant="solid" block={true}>
                Request free basic setup
              </ReuestforBasicSetupbtn>

              <UpgradePlanbtn variant="solid" block={true}>
                Upgrade plan
              </UpgradePlanbtn> 
             </div>
            } */}
        </>
      )}
      <div key="modules-divider">
        <NavTitle>
          <div>MENU</div>
        </NavTitle>
      </div>

      {/* Main Menu */}
      <StyledMenu
        mode="inline"
        selectedKeys={selectedKey}
        style={{ background: '#000923' }}
        screens={screens}
        collapsed={collapsed}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        className="custom-menu"
        onClick={() => {
          if (onMenuItemClick) onMenuItemClick();
        }}
      >
        {RenderMenuItems(
          safeMenuList,
          accessMap,
          selectedKey,
          collapsed,
          screens,
          router,
          handlePinUnpinModules,
          showPinIcon,
          setShowPinIcon,
          activeModules,
          accessModuleWithMapping
        )}
      </StyledMenu>
    </StyledSider>
  );
};

export default Sidebar;
