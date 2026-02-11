import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Tooltip } from 'antd';
//import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreateNewButtonStyle,
  ReuestforBasicSetupbtn,
  NavTitle,
  SidebarLogoWrapper,
  StyledMenu,
  StyledSider,
  ToggleSidebarbtnStyle,
  UpgradePlanbtn,
  MoreModues,
  CustomizeModulesButton,
  CustomizeModulesButtonWrapper,
} from './sidebarStyle';
import {
  buildMenuMaps,
  computeMenuSelection,
  findParentKeys,
  //findSelectedLeafKey,
  getAccessMap,
  RenderMenuItems,
} from '../helper';

//import { PlusCircleOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'; // Added icons for toggle
import CreateNewDrawer from '../components/molecules/create-new-drawer/createNewDrawer';
import CustomizeModulesModal from './CustomizeModulesModal';
import {
  AitrillionLogo,
  AitrillionLogoSmall,
  //EditModulesIcon,
  // FliptoggleIcon,
  MenuCloseIcon,
  OtherModulesIcon,
  PlusRoundCorenerIcon,
  // ToggleSidebarIcon
} from '../svg-icons';
import Link from 'next/link';
import { saveInterestedModulesApi } from '@/redux/apis/logged-in-user-apis/loggedInUserApis';

const { useBreakpoint } = Grid;

const Sidebar = ({
  toggleSidebar,
  collapsed,
  isDrawerOpen,
  onCloseDrawer,
  menuList,
  onMenuItemClick,
  is_V1_V2_object,
}) => {
  const router = useRouter();
  const screens = useBreakpoint();
  const dispatch = useDispatch();

  const jwtState = useSelector((state) => state?.jwtState);
  const login_auth = jwtState?.login_auth || {};
  //const { accessModuleWithMapping } = login_auth;

  const {
    userDetails,
    activeModulesLoading,
    activeModules,
    interestedModules,
    interestedModulesLoading,
    saveInterestedModulesLoading,
    saveInterestedModulesApiState,
  } = useSelector((state) => state?.loggedInUserDetailsState);

  const loggeInUserState = useSelector((state) => state.loggeInUserState);

  const shopType = login_auth?.shop_type?.toLowerCase() || 'shopify'; // need to pass in loginAuth

  const [createNewdrawerVisible, setCreateNewdrawerVisible] = useState(false);
  //const toggleCreateNewDrawer = () => {setCreateNewdrawerVisible(!createNewdrawerVisible)};
  const [otherOpenKeys, setOtherOpenKeys] = useState([]);
  const [showPinIcon, setShowPinIcon] = useState(false);
  const [pinnedModules, setPinnedModules] = useState([]);
  const [interested_modules, setInterested_modules] = useState([]);
  const [showtooltip, setShowtooltip] = useState(false);
  const [showEditModulesBtn, setShowEditModulesBtn] = useState(true);
  const [showSaveModulesBtn, setShowSaveModulesBtn] = useState(false);
  const [showOtherModules, setShowOtherModules] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState({});
  const [customizeModalVisible, setCustomizeModalVisible] = useState(false);
  const [saveChangesLoading, setSaveChangesLoading] = useState(false);

  const brandInsightsItem = useMemo(
    () => menuList.find((item) => item.id === 'brand_insights_module'),
    [menuList]
  );

  // build a menu list excluding brand insights and filtering membership v1/v2
  const filteredMenuList = useMemo(() => {
    const showNewMembershipMenus = login_auth?.show_membership_module_v2;

    return menuList.filter((item) => {
      // Exclude brand insights from modal lists
      if (item.id === 'brand_insights_module') return false;

      // Filter membership v1/v2 based on flag
      if (item?.id === 'membership-v2' && !showNewMembershipMenus) return false;
      if (item?.id === 'membership-v1' && showNewMembershipMenus) return false;

      return true;
    });
  }, [menuList, login_auth?.show_membership_module_v2]);

  // Ensure brand insights is not included in noModuleMenus / selectedModules / otherModulesBase
  const noModuleMenus = useMemo(
    () =>
      filteredMenuList.filter(
        (item) => !item.module_id && item.id !== 'cashback'
      ),
    [filteredMenuList]
  );
  // Cashback depends on Email Marketing (module_id '8') or Workflow Automation (module_id '11')
  // If either is active (in selectedModules), cashback goes in selectedModules
  // If both are in otherModules, cashback also goes in otherModules
  const isCashbackDependencyActive =
    activeModules?.includes('8') || activeModules?.includes('11');

  const selectedModules = useMemo(
    () =>
      filteredMenuList.filter((item) => {
        if (item.id === 'cashback' && item.module_id === '') {
          return isCashbackDependencyActive;
        }
        return activeModules?.includes(item.module_id);
      }),
    [filteredMenuList, activeModules, isCashbackDependencyActive]
  );
  const otherModulesBase = useMemo(
    () =>
      filteredMenuList.filter((item) => {
        if (item.id === 'cashback' && item.module_id === '') {
          return !isCashbackDependencyActive;
        }
        return item.module_id && !activeModules?.includes(item.module_id);
      }),
    [filteredMenuList, activeModules, isCashbackDependencyActive]
  );

  // Append Brand Insights at the end of otherModules but strip pin/unpin related fields
  const otherModules = useMemo(() => {
    if (!brandInsightsItem) return otherModulesBase;
    const brandCopy = { ...brandInsightsItem };
    // remove module pin/unpin related props so RenderMenuItems won't show pin controls
    delete brandCopy.module_id;
    brandCopy.isChecked = null;
    return [...otherModulesBase, brandCopy];
  }, [otherModulesBase, brandInsightsItem]);

  // Filter modules for the customize modal
  // Get all modules with module_id (both from selectedModules and otherModulesBase)
  // Include modules with empty string module_id (like cashback)
  const allModulesWithModuleId = useMemo(() => {
    const all = [...selectedModules, ...otherModulesBase].filter(
      (item) => item.module_id || item.module_id === ''
    );
    return all;
  }, [selectedModules, otherModulesBase, activeModules, interestedModules]);

  // Selected Modules = Active modules (installed) + Interested modules (user pinned) + Cashback (if dependencies active)
  // A module is in "Selected" if:
  // - It's in activeModules array (installed/activated) OR
  // - It's in interestedModules (user has pinned it) OR
  // - It's cashback and Email Marketing (module_id '8') is active
  const modalSelectedModules = useMemo(() => {
    const result = allModulesWithModuleId.filter((item) => {
      // Special case for cashback: include if Email Marketing or Workflow Automation is active
      if (item.id === 'cashback' && item.module_id === '') {
        return isCashbackDependencyActive;
      }

      const isActive = activeModules?.includes(item.module_id);
      const isInterested = interestedModules?.includes(item.value);
      return isActive || isInterested;
    });
    return result;
  }, [
    allModulesWithModuleId,
    activeModules,
    interestedModules,
    isCashbackDependencyActive,
  ]);

  // Other Modules = Not active AND not interested AND not cashback (when dependencies are active)
  const modalOtherModules = useMemo(() => {
    const result = allModulesWithModuleId.filter((item) => {
      // Special case for cashback: exclude if Email Marketing or Workflow Automation is active
      if (item.id === 'cashback' && item.module_id === '') {
        return !isCashbackDependencyActive;
      }

      const isActive = activeModules?.includes(item.module_id);
      const isInterested = interestedModules?.includes(item.value);
      return !isActive && !isInterested;
    });
    return result;
  }, [
    allModulesWithModuleId,
    activeModules,
    interestedModules,
    isCashbackDependencyActive,
  ]);

  const reOrderedModule = useMemo(
    () => [...noModuleMenus, ...selectedModules],
    [noModuleMenus, selectedModules]
  );
  const safeMenuList = useMemo(() => reOrderedModule || [], [reOrderedModule]);

  useEffect(() => {
    if (interestedModules) {
      setInterested_modules([...interestedModules]);
    }
  }, [interestedModules]);

  // Toggle individual pin
  const handleActiveModuleChange = (moduleId, checked, value, status) => {
    setShowSaveModulesBtn(true);
    setShowEditModulesBtn(false);
    setPinnedModules((prev) =>
      checked ? [...prev, moduleId] : prev.filter((id) => id !== moduleId)
    );
    if (checked) {
      if (status == '1' || status == undefined) {
        setShowtooltip(true);
        return;
      }
      if (!interested_modules.includes(value)) {
        const updated = [...interested_modules, value];
        setInterested_modules(updated);
      }
    } else {
      const updated = interested_modules.filter((item) => item !== value);
      setInterested_modules(updated);
    }
  };

  // Pin all selected modules
  const handlePinUnpinModules = () => {
    setShowPinIcon(!showPinIcon);
    const selectedIds = selectedModules.map((item) => item.module_id);
    setPinnedModules(selectedIds);
    setShowOtherModules(true);
  };

  const saveInterestedModules = () => {
    dispatch(
      saveInterestedModulesApi({
        act: 'quickSwttingsave',
        login_id: userDetails?.id,
        intrested_module: interested_modules,
      })
    );
  };

  useEffect(() => {
    if (saveInterestedModulesApiState === 'success') {
      setShowSaveModulesBtn(false);
      setShowEditModulesBtn(true);
      setShowPinIcon(false);
      // Close the customize modal when save is successful
      setCustomizeModalVisible(false);
    }
  }, [saveInterestedModulesApiState]);

  // Build accessMap once
  const accessMap = useMemo(
    () => getAccessMap(loggeInUserState?.planInfo),
    [loggeInUserState?.planInfo]
  );

  // compute selection whenever route or menu changes
  const { openKeys: computedOpen, selectedKeys: computedSelected } = useMemo(
    () => computeMenuSelection(safeMenuList, router.pathname),
    [safeMenuList, router.pathname]
  );

  // Also compute selection for otherModules
  const { openKeys: otherComputedOpen, selectedKeys: otherComputedSelected } =
    useMemo(
      () => computeMenuSelection(otherModules, router.pathname),
      [otherModules, router.pathname]
    );

  // keep them in state so user can open/close accordions too
  const [openKeys, setOpenKeys] = useState(computedOpen);
  const [selectedKey, setSelectedKey] = useState(computedSelected);

  // Add/remove body class based on collapsed state
  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [collapsed]);

  // sync when route/menu changes
  useEffect(() => {
    // setOpenKeys(computedOpen);
    // Merge selections from both main menu and otherModules
    const mergedSelected = [...computedSelected, ...otherComputedSelected];
    const mergedOpen = [...computedOpen, ...otherComputedOpen];

    // In vertical mode (collapsed), include parent keys in selectedKeys so they get highlighted
    if (collapsed) {
      setSelectedKey([...mergedOpen, ...mergedSelected]);
    } else {
      setOpenKeys(computedOpen);
      setSelectedKey(mergedSelected);
    }
  }, [
    computedOpen,
    computedSelected,
    otherComputedOpen,
    otherComputedSelected,
    collapsed,
  ]);

  // Update openKeys on route change
  useEffect(() => {
    const keys = findParentKeys(safeMenuList, router.pathname);
    if (keys?.length && !collapsed) {
      setOpenKeys(keys);
    }
    // Also open parent menus in otherModules if current route matches
    const otherModulesKeys = findParentKeys(otherModules, router.pathname);
    const hasOtherModulesSelection =
      otherComputedSelected?.length > 0 || otherModulesKeys?.length > 0;

    if (otherModulesKeys?.length) {
      setOtherOpenKeys(otherModulesKeys);
    } else {
      setOtherOpenKeys([]);
    }

    // Auto-expand "More Modules" section if there's an active item there
    if (hasOtherModulesSelection) {
      setShowOtherModules(true);
    }
  }, [
    router.pathname,
    safeMenuList,
    otherModules,
    collapsed,
    otherComputedSelected,
  ]);

  // Scroll active menu item to middle of sidebar after modules are rendered
  useEffect(() => {
    // Wait for DOM to fully render after modules update
    const timer = setTimeout(() => {
      // Try multiple selectors to find the active menu item
      let activeElement =
        document.querySelector('.ant-menu-item-selected') ||
        document.querySelector('.ant-menu-item-active') ||
        document.querySelector(
          '.ant-menu-item.menu-item-main.ant-menu-item-active'
        ) ||
        document.querySelector('li[class*="ant-menu-item"][class*="selected"]');

      if (activeElement) {
        // Get the scrollable sidebar children container
        const scrollableContainer = document.querySelector(
          '.ant-layout-sider-children'
        );

        if (scrollableContainer) {
          // Get positions using getBoundingClientRect for accurate positioning
          const containerRect = scrollableContainer.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();

          // Calculate the element's position relative to the container's current scroll
          const elementRelativeTop =
            elementRect.top - containerRect.top + scrollableContainer.scrollTop;

          // Calculate scroll position to center the element
          const containerHeight = scrollableContainer.clientHeight;
          const elementHeight = activeElement.offsetHeight;
          const scrollPosition =
            elementRelativeTop - containerHeight / 2 + elementHeight / 2;

          // Smooth scroll to position
          scrollableContainer.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          });
        }
      }
    }, 500); // Wait for menus to expand

    return () => clearTimeout(timer);
  }, [selectedModules, otherModules, selectedKey]);

  const mainMaps = useMemo(() => buildMenuMaps(safeMenuList), [safeMenuList]);
  const otherMaps = useMemo(() => buildMenuMaps(otherModules), [otherModules]);

  const handleAccordionChange = (
    nextKeys,
    prevKeys,
    setKeys,
    maps,
    menuList,
    router
  ) => {
    const openedKey = nextKeys.find((k) => !prevKeys.includes(k));
    const closedKey = prevKeys.find((k) => !nextKeys.includes(k));

    // get active route's parent chain (top -> bottom)
    const activeParentKeys = findParentKeys(menuList, router.pathname) || [];
    const activeTopParent = activeParentKeys[0] || null;

    // helper: remove keys and descendants
    const removeKeysAndDescendants = (keysArr, toRemoveSet) =>
      keysArr.filter((k) => {
        if (toRemoveSet.has(k)) return false;
        for (const rem of toRemoveSet) {
          if ((maps.descendantsMap[rem] || []).includes(k)) return false;
        }
        return true;
      });

    // OPENING
    if (openedKey) {
      const parent = maps.parentMap[openedKey] || null;
      const isTopLevel = !parent;

      // collect ancestors of openedKey
      const ancestors = [];
      let p = maps.parentMap[openedKey];
      while (p) {
        ancestors.unshift(p);
        p = maps.parentMap[p];
      }

      // siblings at same level (top-level if parent is null)
      const siblings = parent
        ? maps.childrenMap[parent] || []
        : Object.keys(maps.childrenMap).filter((k) => !maps.parentMap[k]);

      // remove siblings (except openedKey) and their descendants from prevKeys
      const toRemove = new Set(siblings.filter((k) => k !== openedKey));
      const kept = removeKeysAndDescendants(prevKeys, toRemove);

      // determine relationships to active chain
      const openedIsActiveTop = openedKey === activeTopParent;
      const openedIsInsideActiveChain = activeParentKeys.includes(openedKey);

      // check if we opened a different top-level sibling of active top parent
      const openedIsSiblingOfActiveTop =
        isTopLevel &&
        activeTopParent &&
        openedKey !== activeTopParent &&
        siblings.includes(activeTopParent);

      // base new keys: ancestors + openedKey + kept (non-sibling prev keys)
      let newKeys = [...ancestors, openedKey, ...kept];

      // RULES:
      // 1) If the opened key is the activeTopParent OR is inside the active chain,
      //    always add the activeParentKeys (allow reopening active chain).
      // 2) If we opened a top-level sibling of the active top parent, remove active chain.
      // 3) Otherwise (opened some unrelated key), do NOT auto-add active chain.
      if (openedIsActiveTop || openedIsInsideActiveChain) {
        newKeys.push(...activeParentKeys);
      } else if (openedIsSiblingOfActiveTop) {
        // ensure active chain is removed
        newKeys = newKeys.filter((k) => !activeParentKeys.includes(k));
      }

      setKeys(Array.from(new Set(newKeys)));
      return;
    }

    // CLOSING
    if (closedKey) {
      // remove the closed key and all descendants
      const toRemove = new Set([
        closedKey,
        ...(maps.descendantsMap[closedKey] || []),
      ]);

      // If user explicitly closed activeTopParent, remove active chain as well
      if (closedKey === activeTopParent) {
        (activeParentKeys || []).forEach((k) => toRemove.add(k));
      }

      const filtered = prevKeys.filter((k) => !toRemove.has(k));
      setKeys(filtered);
      return;
    }

    // fallback
    setKeys(nextKeys);
  };

  // Replace your handleOpenChange with this
  const handleOpenChange = (nextOpenKeys) => {
    // determine what changed
    const openedKey = nextOpenKeys.find((k) => !openKeys.includes(k));
    const closedKey = openKeys.find((k) => !nextOpenKeys.includes(k));
    const changedKey = openedKey || closedKey;

    // when pin mode is active, only allow keys from noModuleMenus to toggle
    if (showPinIcon) {
      const allowed = new Set(noModuleMenus.map((i) => i.nav)); // non-module allowed set
      // if no changedKey (rare) just ignore
      if (!changedKey) return;

      if (!allowed.has(changedKey)) {
        // block toggle for non-allowed keys
        return;
      }
      // else allow: fallthrough to normal handler
    }

    // normal behavior
    handleAccordionChange(
      nextOpenKeys,
      openKeys,
      setOpenKeys,
      mainMaps,
      safeMenuList,
      router
    );
  };

  // Replace your handleOtherOpenChange with this
  const handleOtherOpenChange = (nextOpenKeys) => {
    // determine what changed
    const openedKey = nextOpenKeys.find((k) => !otherOpenKeys.includes(k));
    const closedKey = otherOpenKeys.find((k) => !nextOpenKeys.includes(k));
    const changedKey = openedKey || closedKey;

    if (showPinIcon) {
      // allow only Brand Insights to toggle while in pin mode
      // replace 'brandinsight' with the actual nav key if different
      const BRAND_KEY = brandInsightsItem?.nav || 'brandinsight';

      // if there is no changedKey (some edge cases), ignore
      if (!changedKey) return;

      // allow only the brand key to open/close
      if (changedKey !== BRAND_KEY) {
        return; // block toggle for other otherModules entries
      }

      // if changedKey === BRAND_KEY -> allow toggle, fallthrough
    }

    // normal behavior
    handleAccordionChange(
      nextOpenKeys,
      otherOpenKeys,
      setOtherOpenKeys,
      otherMaps,
      otherModules,
      router
    );
  };

  const handleMainMenuItemClick = () => {
    setOtherOpenKeys([]); // Close all open menus in "other modules"
  };

  const handleOtherMenuItemClick = () => {
    setOpenKeys([]); // This will close all open menus in the main menu
  };

  if (!safeMenuList.length) {
    return (
      <div
        style={{
          height: '100vh',
          background: '#E6ECFD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#4A4A4A', fontSize: 13 }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <StyledSider
      width={!screens.xl ? 280 : 220}
      collapsedWidth={screens.xl ? 60 : 0}
      collapsed={collapsed}
    >
      {
        <>
          {
            <SidebarLogoWrapper collapsed={collapsed}>
              {!screens.xl ? (
                <>
                  {isDrawerOpen && (
                    <ToggleSidebarbtnStyle
                      variant="link"
                      type="text"
                      icon={<MenuCloseIcon color="#4A566B" />}
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
          {!screens.md && shopType === 'shopify' && (
            <div style={{ padding: '12px 15px 15px 15px' }}>
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
                  is_V1_V2_object={is_V1_V2_object}
                />
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
            </div>
          )}
        </>
      }
      {!collapsed && (
        <div key="modules-divider">
          <NavTitle>
            <div>MENU</div>
          </NavTitle>
        </div>
      )}

      {/* Main Menu */}
      <StyledMenu
        mode="inline"
        selectedKeys={selectedKey}
        style={{ background: '#E6ECFD' }}
        screens={screens}
        collapsed={collapsed}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        className="custom-menu"
        onClick={() => {
          if (onMenuItemClick) onMenuItemClick();
        }}
        overlayClassName="navbar-custom-dropdown"
      >
        {RenderMenuItems(
          login_auth,
          activeModulesLoading,
          activeModules,
          interestedModules,
          interestedModulesLoading,
          safeMenuList,
          accessMap,
          selectedKey,
          collapsed,
          screens,
          router,
          handlePinUnpinModules,
          showPinIcon,
          setShowPinIcon,
          pinnedModules,
          setPinnedModules,
          handleActiveModuleChange,
          showtooltip,
          setShowtooltip,
          showEditModulesBtn,
          setShowEditModulesBtn,
          showSaveModulesBtn,
          setShowSaveModulesBtn,
          interested_modules,
          setInterested_modules,
          noModuleMenus,
          selectedModules,
          otherModules,
          saveInterestedModules,
          saveInterestedModulesLoading,
          saveInterestedModulesApiState,
          handleMainMenuItemClick,
          tooltipVisible,
          setTooltipVisible,
          openKeys
        )}
      </StyledMenu>

      {/* More Modules Toggle and Slide-down */}
      {otherModules.length > 0 && (
        <>
          {
            <MoreModues
              collapsed={collapsed}
              onClick={() => {
                setShowOtherModules((prev) => !prev);
              }}
            >
              {collapsed ? (
                <Tooltip title="More modules" placement="right">
                  <span>
                    <OtherModulesIcon />
                  </span>
                </Tooltip>
              ) : (
                <>
                  <div>More Modules</div>
                  {showOtherModules ? (
                    <i className="more-modues-arrow-up more-modues-arrow"></i>
                  ) : (
                    <i className="more-modues-arrow"></i>
                  )}
                </>
              )}
            </MoreModues>
          }

          <div
            style={{
              // When collapsed, always show (for popup hover), otherwise respect showOtherModules
              maxHeight: collapsed || showOtherModules === true ? 'auto' : 0,
              overflow:
                collapsed || showOtherModules === true ? 'visible' : 'hidden',
              transition:
                'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1), overflow 0.3s cubic-bezier(0.4,0,0.2,1)',
              opacity: collapsed || showOtherModules === true ? 1 : 0,
              background: '#E6ECFD',
            }}
          >
            <StyledMenu
              mode="inline"
              selectedKeys={selectedKey}
              style={{ background: '#E6ECFD', border: 0 }}
              className="custom-menu other-modules-menu"
              screens={screens}
              collapsed={collapsed}
              openKeys={otherOpenKeys}
              onOpenChange={handleOtherOpenChange}
              overlayClassName="navbar-custom-dropdown"
            >
              {RenderMenuItems(
                login_auth,
                activeModulesLoading,
                activeModules,
                interestedModules,
                interestedModulesLoading,
                otherModules,
                accessMap,
                selectedKey,
                collapsed,
                screens,
                router,
                handlePinUnpinModules,
                showPinIcon,
                setShowPinIcon,
                pinnedModules,
                setPinnedModules,
                handleActiveModuleChange,
                showtooltip,
                setShowtooltip,
                showEditModulesBtn,
                setShowEditModulesBtn,
                showSaveModulesBtn,
                setShowSaveModulesBtn,
                interested_modules,
                setInterested_modules,
                noModuleMenus,
                selectedModules,
                otherModules,
                saveInterestedModules,
                saveInterestedModulesLoading,
                saveInterestedModulesApiState,
                handleOtherMenuItemClick,
                tooltipVisible,
                setTooltipVisible,
                otherOpenKeys
              )}
            </StyledMenu>
          </div>
        </>
      )}

      {/* Customize Modules Panel Button - Fixed at Bottom */}
      {!collapsed && (
        <CustomizeModulesButtonWrapper screens={screens}>
          <CustomizeModulesButton
            color="primary"
            variant="outlined"
            onClick={() => setCustomizeModalVisible(true)}
          >
            Customize modules panel
          </CustomizeModulesButton>
        </CustomizeModulesButtonWrapper>
      )}

      {/* Customize Modules Modal */}
      <CustomizeModulesModal
        visible={customizeModalVisible}
        setVisible={setCustomizeModalVisible}
        selectedModules={modalSelectedModules}
        otherModules={modalOtherModules}
        userDetails={userDetails}
        login_auth={login_auth}
        saveInterestedModulesLoading={saveInterestedModulesLoading}
        activeModules={activeModules}
        accessMap={accessMap}
        onSaveModules={(newSelected, newOthers, removedActiveModules) => {
          // Extract module values from selected modules
          // Keep a module if:
          // 1. It was already in interestedModules (preserve existing), OR
          // 2. It's NOT in activeModules (newly added interested module)
          const interestedModuleValues = newSelected
            .filter((module) => {
              if (!module.value) return false;

              const wasAlreadyInterested = interestedModules?.includes(
                module.value
              );
              const isActive = activeModules?.includes(module.module_id);

              // Keep if it was already interested OR if it's not active
              return wasAlreadyInterested || !isActive;
            })
            .map((module) => module.value);

          // Dispatch the save action
          dispatch(
            saveInterestedModulesApi({
              act: 'quickSwttingsave',
              login_id: userDetails?.id,
              intrested_module: interestedModuleValues,
              removed_active_modules: removedActiveModules,
            })
          );
        }}
      />
    </StyledSider>
  );
};

export default Sidebar;
