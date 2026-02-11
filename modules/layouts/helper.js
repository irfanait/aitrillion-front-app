import React, { useEffect, useState } from 'react';
import { Menu, Divider, Typography, Tooltip, Checkbox, Skeleton } from 'antd';
import Link from 'next/link';
import { iconMapper } from './utils';
import { store } from '@/redux';
import {
  CreateNewPlusIcon,
  EditModulesIcon,
  AihubIcon,
  LockRestrictedIcon,
  PinIcon,
  PlusIcon,
  SaveModulesIcon,
} from './svg-icons';
import { StyleTag, StyleTagAihub } from './sidebar/sidebarStyle';
import { useRouter } from 'next/router';
import { aitAllModulesArray, token } from './utils/constants';
import {
  SelectedModuleWrappper,
  SelectedModuleLoad,
} from './sidebar/sidebarStyle';
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
//import Tooltip from '@/components/atoms/ait-tooltip/Tooltip';

const { Title } = Typography;

const ampAttr = (eventName) =>
  eventName ? { 'data-amp-event-name': eventName } : {};

const CreateButton = ({ item }) => (
  <Link
    href={item?.createButton?.href}
    {...ampAttr(item?.createButton?.eventName)}
    style={{ width: 18 }}
    className="create-button-link"
  >
    <CreateNewPlusIcon />
  </Link>
);

export const handleLockIconClick = (content, passedRouter) => {
  const url =
    content?.startsWith('/') || content?.startsWith('http')
      ? content
      : '/popup?act=upgrade';

  if (passedRouter && typeof passedRouter.push === 'function') {
    passedRouter.push(url);
  } else {
    window.location.href = url; // ✅ fallback navigation
  }
};

export const RenderMenuItems = (
  login_auth,
  activeModulesLoading,
  activeModules,
  interestedModules,
  interestedModulesLoading,
  items = [],
  accessMap = {},
  selectedKeys,
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
  onAnyMenuItemClick,
  tooltipVisible,
  setTooltipVisible,
  openKeys = []
) => {
  if (!items.length) {
    return null;
  }
  // const state = store.getState();
  // const { login_auth } = state.jwtState;

  const { accessModuleWithMapping } = login_auth || {};
  const shopId = login_auth?.shop_id || null;

  const isLoggedinMagentoAdmin =
    login_auth?.is_marketplace &&
    process.env.NEXT_PUBLIC_EVEREST_ADMIN_SHOP_ID == shopId
      ? 1
      : 0;
  const showNewMembershipMenus = login_auth?.show_membership_module_v2;
  const shopType = login_auth?.shop_type || null;
  const isEnableSuppressionDomain =
    login_auth?.is_enable_suppression_domain || null;
  const shopAllow = [160935, 154375, 155640];

  const menuNodes = [];

  // const lastSelectedModulesItem = selectedModules?.length > 0 ? selectedModules[selectedModules.length - 1].module_id : null;
  //  console.log('selectedModules', selectedModules);
  // console.log('lastSelectedModulesItem', lastSelectedModulesItem);

  // Filter out hidden modules from selectedModules to get truly visible modules
  const visibleSelectedModules =
    selectedModules?.filter((module) => {
      const rule = accessMap[module.ai_module_feature || module.module_feature];
      const isHidden = rule?.action === 'hide' && rule?.access === 'No';
      return !isHidden;
    }) || [];

  // Show skeleton only while actually loading modules
  const isActuallyLoading = activeModulesLoading || interestedModulesLoading;
  const hasVisibleModules =
    visibleSelectedModules && visibleSelectedModules.length > 0;
  const isMenuOpened = openKeys && openKeys.length > 0;

  // Show skeleton only during actual loading
  // Selected modules render independently and don't require parent menu expansion
  const shouldShowSkeleton = isActuallyLoading;

  items?.forEach((item) => {
    if (
      (shopType === 'magento' ||
        shopType === 'woocommerce' ||
        shopType === 'wix-nonecommerce') &&
      (item?.id === 'membership-v2' ||
        item?.id === 'membership-v1' ||
        item.id === 'formbuilder_module' ||
        item.id === 'loyalty-settings-general' ||
        item.id === 'product-recommendations-personalized')
    )
      return;

    if (
      shopType !== 'shopify' &&
      shopType !== 'woocommerce' &&
      (item.id === 'loyalty-product-reward-gallery' ||
        item.id === 'loyalty-product-reward-settings')
    )
      return;

    if (
      shopType !== 'shopify' &&
      (item.id === 'checkoutX' ||
        item.id === 'customer-account' ||
        item.id === 'affiliate_referral_offer')
    )
      return;

    if (item.id === 'all-sellers' && !isLoggedinMagentoAdmin) return;

    if (
      item.id === 'email-marketing-settings-general' &&
      !isEnableSuppressionDomain
    )
      return;

    if (item?.id === 'membership-v2' && !showNewMembershipMenus) return;
    if (item?.id === 'membership-v1' && showNewMembershipMenus) return;

    if (
      isLoggedinMagentoAdmin &&
      (shopType === 'woocommerce' || shopType === 'wix-nonecommerce') &&
      item.id === 'brand_insights_module'
    )
      return;

    if (
      item.id === 'cashback' &&
      (shopAllow.includes(!shopId) ||
        (process.env.NEXT_PUBLIC_APPLICATION_ENV !== 'production' &&
          shopType === 'woocommerce'))
    )
      return;

    if (item.id === 'checkoutX' && !login_auth?.is_allow_checkoutx) {
      item.ai_module_feature === 'thankyou_checkout_widgets';
    }

    const rule = accessMap[item.ai_module_feature || item.module_feature];
    const isHidden = rule?.action === 'hide' && rule?.access === 'No';
    const isRestricted = rule?.action === 'popup' && rule?.access === 'No';
    const isNewFeature = item.isNewFeature || false;
    const upgradeUrl = '/popup?act=upgrade';
    const hasSubMenu = item.subMenu || item.submenu;
    const children = item.subMenu || item.submenu;
    const icon = iconMapper[item.icon];

    // Check if this is the last non-module menu item (we'll use this later)
    const isLastNonModuleItem =
      noModuleMenus?.length > 0 &&
      item.id === noModuleMenus[noModuleMenus.length - 1]?.id;

    // If hidden and not the last non-module item, skip this item entirely
    if (isHidden && !isLastNonModuleItem) return null;

    // Show skeleton for module items while loading
    // Check for module_id (truthy) OR empty string (cashback case)
    const isModuleItem = item.module_id || item.module_id === '';
    if (!isHidden && isModuleItem && shouldShowSkeleton && !collapsed) {
      // menuNodes.push(
      //   <Menu.Item
      //     key={`skeleton-${item.id}`}
      //     disabled
      //     style={{ cursor: 'default', opacity: 0.6, padding: '8px 16px' }}
      //   >
      //     <Skeleton.Input
      //       active
      //       size="small"
      //       style={{ width: '100%', height: 24, minWidth: '100%' }}
      //     />
      //   </Menu.Item>
      // );
      //  console.log('original items skipped');
      return null; // Skip rendering the actual item
    }

    // Only render the menu item if it's not hidden
    if (!isHidden) {
      const isChecked = activeModules?.includes(item.module_id);
      //console.log('isChecked in helper:', isChecked);
      item.isChecked = isChecked;

      const moduleStatus = accessModuleWithMapping[item.module_id];

      //  if(activeModulesLoading || interestedModulesLoading) return <Skeleton active style={{background:'red'}}/>

      //console.log('pinnedModules', pinnedModules);

      if (hasSubMenu) {
        const menuTitle = (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <span style={{ flexGrow: 1 }}>{item.label}</span>
            {isNewFeature && (
              <StyleTag
                className={`new-menu-badge ${hasSubMenu ? 'new-menu-badge-has-sunmenu' : ''}`}
                color="#06B236"
              >
                NEW
              </StyleTag>
            )}
            {isRestricted && <LockRestrictedIcon />}
          </div>
        );

        menuNodes?.push(
          <Menu.SubMenu
            id={item.id}
            key={item.nav || item.module_id}
            {...ampAttr(item.eventName)}
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.label}</span>
                {isNewFeature &&
                  (item.id === 'aihub' ? (
                    <StyleTagAihub className="new-menu-badge ai-hub">
                      <AihubIcon />
                    </StyleTagAihub>
                  ) : (
                    <StyleTag className="new-menu-badge" color="#06B236">
                      NEW
                    </StyleTag>
                  ))}
                {isRestricted && <LockRestrictedIcon />}
                {(item?.module_id || item?.module_id === '') &&
                  item?.isChecked !== null &&
                  !isRestricted &&
                  showPinIcon && (
                    <Tooltip
                      title={
                        item.id === 'cashback' && item.module_id === ''
                          ? 'Cashback depends on Email & Workflow. Pinning disabled.'
                          : moduleStatus == '1'
                            ? 'Activated module cannot be unpinned'
                            : ''
                      }
                      placement="top"
                      trigger={'click'}
                      overlayClassName="navbar-custom-tooltip"
                      open={tooltipVisible[item.module_id]}
                      onOpenChange={() =>
                        setTooltipVisible((prev) => ({
                          ...prev,
                          [item.module_id]: true,
                        }))
                      }
                    >
                      <span
                        onClick={(e) => {
                          if (
                            moduleStatus == '1' ||
                            moduleStatus == undefined
                          ) {
                            e.stopPropagation();
                          }
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        <Checkbox
                          value={item.value}
                          id={`nav_menu_${item.value}`}
                          checked={
                            moduleStatus == '1'
                              ? true
                              : pinnedModules.includes(item.module_id)
                          }
                          disabled={
                            moduleStatus == '1' || moduleStatus == undefined
                          }
                          onChange={(e) => {
                            e.stopPropagation();
                            if (moduleStatus != '1' || moduleStatus != '') {
                              handleActiveModuleChange(
                                item.module_id,
                                e.target.checked,
                                item.value,
                                moduleStatus
                              );
                            }
                            if (
                              moduleStatus == '1' ||
                              moduleStatus == undefined
                            ) {
                              setTooltipVisible((prev) => ({
                                ...prev,
                                [item.module_id]: true, // Always show tooltip on toggle
                              }));
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          dataStatus={moduleStatus}
                          onMouseLeave={() => setTooltipVisible(false)}
                        >
                          <span
                            className={
                              pinnedModules.includes(item.module_id)
                                ? 'pin-checked'
                                : 'pin-unchecked'
                            }
                          >
                            <PinIcon />
                          </span>
                        </Checkbox>
                      </span>
                    </Tooltip>
                  )}
              </div>
            }
            icon={icon}
            className={`${isPathActive(item.href, router?.pathname) ? 'menu-item-main ant-menu-item-active' : 'menu-item-main'}
             ${(item?.module_id || item?.module_id === '') && showPinIcon ? 'has-pin-icon' : ''}
             ${isNewFeature ? 'new-feature-menu' : ''}
             ${isRestricted ? 'menu-locked' : ''}`}
            popupClassName={`${isRestricted ? 'menu-locked' : ''}`}
            expandIcon={isRestricted ? () => false : undefined}
            onTitleClick={(e) => {
              if (isRestricted) {
                e.domEvent.preventDefault();
                handleLockIconClick(upgradeUrl, router);
              }
              if (typeof onAnyMenuItemClick === 'function') {
                onAnyMenuItemClick();
              }
            }}
            style={{
              height: 'auto',
            }}
          >
            {!isRestricted &&
              RenderMenuItems(
                login_auth,
                activeModulesLoading,
                activeModules,
                interestedModules,
                interestedModulesLoading,
                children,
                accessMap,
                selectedKeys,
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
                activeModules,
                accessModuleWithMapping,
                noModuleMenus,
                selectedModules,
                otherModules,
                saveInterestedModules,
                saveInterestedModulesLoading,
                saveInterestedModulesApiState,
                onAnyMenuItemClick,
                tooltipVisible,
                setTooltipVisible,
                openKeys
              )}
          </Menu.SubMenu>
        );
      } else {
        const href = item.href || '#';
        //console.log('items in helper:', items);

        //  if(activeModuleStatus === false){
        //    inactiveMenuItems.push(item);
        //   console.log('inactiveMenuItems in helper:', inactiveMenuItems);
        //  }

        menuNodes.push(
          <Menu.Item
            id={item.id}
            key={item.nav || item.module_id}
            {...ampAttr(item.eventName)}
            icon={icon}
            className={`${isPathActive(item.href, router?.pathname) ? 'menu-item-main ant-menu-item-active' : 'menu-item-main'}
             ${item?.module_id && showPinIcon ? 'has-pin-icon' : ''}
             ${isNewFeature ? 'new-feature-menu' : ''}
             ${isRestricted ? 'menu-locked' : ''}
             `}
            style={{
              cursor: isRestricted ? 'pointer' : undefined,
              color: isRestricted ? '#888' : undefined,
              height: 'auto',
            }}
            onClick={(e) => {
              if (isRestricted) {
                e.domEvent.preventDefault();
                handleLockIconClick(upgradeUrl, router);
              }
              if (typeof onAnyMenuItemClick === 'function') {
                onAnyMenuItemClick(); // <-- This will close main menu openKeys when called from otherModules
              }
            }}
          >
            <Tooltip placement="right">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                className={item?.createButton && 'has-create-button'}
              >
                {isRestricted || (showPinIcon && item.module_id) ? (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexGrow: 1,
                      userSelect: 'none',
                    }}
                    className="menu-name"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href || '#'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexGrow: 1,
                    }}
                  >
                    <span className="menu-name">{item.label}</span>
                  </Link>
                )}
                {!isRestricted && item?.createButton && (
                  <CreateButton item={item} />
                )}
                {isNewFeature && (
                  <StyleTag className="new-menu-badge" color="#06B236">
                    NEW
                  </StyleTag>
                )}
                {isRestricted && <LockRestrictedIcon />}
                {(item?.module_id || item?.module_id === '') &&
                  item?.isChecked !== null &&
                  !isRestricted &&
                  showPinIcon && (
                    <Tooltip
                      title={
                        item.id === 'cashback' && item.module_id === ''
                          ? 'Cashback depends on Email & Workflow. Pinning disabled.'
                          : moduleStatus == '1'
                            ? 'Activated module cannot be unpinned'
                            : ''
                      }
                      placement="top"
                      trigger={'click'}
                      overlayClassName="navbar-custom-tooltip"
                      open={tooltipVisible[item.module_id]}
                      onOpenChange={() =>
                        setTooltipVisible((prev) => ({
                          ...prev,
                          [item.module_id]: true,
                        }))
                      }
                    >
                      <span
                        onClick={(e) => {
                          if (
                            moduleStatus == '1' ||
                            moduleStatus == undefined
                          ) {
                            e.stopPropagation();
                          }
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        <Checkbox
                          value={item.value}
                          id={`nav_menu_${item.value}`}
                          checked={
                            moduleStatus == '1'
                              ? true
                              : pinnedModules.includes(item.module_id)
                          }
                          disabled={
                            moduleStatus == '1' || moduleStatus == undefined
                          }
                          onChange={(e) => {
                            e.stopPropagation();
                            if (moduleStatus != '1' || moduleStatus != '') {
                              handleActiveModuleChange(
                                item.module_id,
                                e.target.checked,
                                item.value,
                                moduleStatus
                              );
                            }
                            if (
                              moduleStatus == '1' ||
                              moduleStatus == undefined
                            ) {
                              setTooltipVisible((prev) => ({
                                ...prev,
                                [item.module_id]: true, // Always show tooltip on toggle
                              }));
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          dataStatus={moduleStatus}
                          onMouseLeave={() => setTooltipVisible(false)}
                        >
                          <span
                            className={
                              pinnedModules.includes(item.module_id)
                                ? 'pin-checked'
                                : 'pin-unchecked'
                            }
                          >
                            <PinIcon />
                          </span>
                        </Checkbox>
                      </span>
                    </Tooltip>
                  )}
              </div>
            </Tooltip>
          </Menu.Item>
        );
      }
    } // End of if (!isHidden)

    // Whether the item was hidden or not, if it's the last non-module item, add "Selected Modules" section
    if (isLastNonModuleItem) {
      menuNodes.push(
        (screens?.xl ? !collapsed : true) && (
          <>
            <div key="modules-divider" id="selected_modules">
              <SelectedModuleWrappper>
                <div>Selected Modules</div>
              </SelectedModuleWrappper>
              <SelectedModuleLoad>
                {shouldShowSkeleton ? (
                  <>
                    <div className="no-module-selected">Loading modules...</div>
                  </>
                ) : visibleSelectedModules.length === 0 ? (
                  <div className="no-module-selected">No modules selected</div>
                ) : null}
              </SelectedModuleLoad>
            </div>
          </>
        )
      );
    }

    //   if (item.module_id === lastSelectedModulesItem) {
    //    // console.log('lastSelectedModulesItem');
    //   menuNodes.push(
    //     (screens?.xl ? !collapsed : true) && (
    //       <div key="other-divider" id='other_modules_nav'>
    //         <SelectedModuleWrappper>
    //           <div>
    //             More Modules
    //           </div>

    //         </SelectedModuleWrappper>
    //       </div>
    //     )
    //   );
    // }
  });

  return menuNodes;
};

export const getAccessMap = (accessControl = []) => {
  const map = {};
  accessControl.forEach(({ feature_key, action, content, access }) => {
    map[feature_key] = { action, content, access };
  });
  return map;
};

// // Helper to find ALL parent nav keys for openKeys
export const findParentKeys = (items, pathname, parents = []) => {
  // console.log('findParentKeys items:', items);
  // console.log('findParentKeys pathname:', pathname);
  for (let item of items) {
    if (pathname.includes(item.href?.split('?')[0])) {
      // console.log('yes');
      return [...parents, item.nav].filter(Boolean);
    }
    const children = item.subMenu || [];
    if (children.length) {
      const found = findParentKeys(children, pathname, [...parents, item.nav]);
      if (found.length) return found;
    }
  }
  return [];
};

// Helper to find ONLY the selected leaf key
export const findSelectedLeafKey = (items, pathname) => {
  for (let item of items) {
    const children = item.subMenu || [];
    if (pathname.includes(item?.href?.split('?')[0])) {
      return children.length ? null : item.nav;
    }
    const found = findSelectedLeafKey(children, pathname);
    if (found) return found;
  }
  return null;
};

/**
 * Helper to get the rule from accessMap for this item
 */
const getAccessRule = (item, accessMap) => {
  return accessMap[item.ai_module_feature || item.feature_id] || {};
};

/**
 * Recursively check restrictions for an item and its children
 */
export const checkRestrictions = (item, accessMap) => {
  const rule = getAccessRule(item, accessMap);
  const isSelfHidden = rule?.action === 'hide' && rule.access === 'No';
  const isSelfRestricted = rule?.action === 'popup' && rule.access === 'No';
  const upgradeUrl = rule?.content || '/popup?act=upgrade';

  // 🔥 If this node is hidden by itself, no need to look at children
  if (isSelfHidden) return { isHidden: true, isRestricted: false, upgradeUrl };

  // 🔥 Check all children recursively to see if they are also all restricted/hidden
  let allChildrenRestricted = true;
  if (item.subMenu || item.submenu) {
    const children = item.subMenu || item.submenu;
    for (const child of children) {
      const childResult = checkRestrictions(child, accessMap);
      if (!childResult.isHidden && !childResult.isRestricted) {
        allChildrenRestricted = false;
      }
    }
  }

  // 🔥 If this node is restricted, and all children are effectively locked too
  const isRestricted = isSelfRestricted && allChildrenRestricted;

  return { isHidden: false, isRestricted, upgradeUrl };
};

// --- Path utils
const normalizePath = (p = '') =>
  p.split('?')[0].split('#')[0].replace(/\/+$/, '');

// returns { score: number of equal leading segments, isPrefix: base ⊆ path }
const segmentCommonScore = (base = '', path = '') => {
  const b = normalizePath(base).split('/').filter(Boolean);
  const p = normalizePath(path).split('/').filter(Boolean);
  const n = Math.min(b.length, p.length);
  let i = 0;
  for (; i < n; i++) {
    if (b[i] !== p[i]) break;
  }
  return { score: i, isPrefix: i === b.length };
};

export const isPathActive = (href = '', pathname = '') => {
  if (!href || !pathname) return false;

  const base = normalizePath(href);
  const path = normalizePath(pathname);

  // 1️⃣ Exact match
  if (path === base) return true;

  const baseParts = base.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  // 2️⃣ If base ends with 'dashboard', only match exact path or query variations
  const lastSegment = baseParts.at(-1);
  if (lastSegment === 'dashboard') {
    // Allow ?query but not deeper paths
    return path.startsWith(base) && pathParts.length === baseParts.length;
  }

  // 3️⃣ Check same module parent (for list, create, edit, editor, etc.)
  const allowedVariants = [
    'list',
    'create',
    'edit',
    'details',
    'add',
    'new',
    'view',
    'editor',
    'editorv2',
  ];
  const parentPath = baseParts.slice(0, -1).join('/');
  const nextSegment = pathParts[baseParts.length];

  if (
    path.startsWith('/' + parentPath + '/') &&
    (allowedVariants.some((kw) => nextSegment?.toLowerCase().includes(kw)) ||
      baseParts.at(-1) === 'list')
  ) {
    return true;
  }

  // 4️⃣ Fallback exact folder match
  const { score, isPrefix } = segmentCommonScore(base, path);
  return isPrefix && score === baseParts.length;
};

// Compute selection based on best common-prefix score
export const computeMenuSelection = (items = [], pathname = '') => {
  //console.log('computeMenuSelection items:', items);
  // console.log('computeMenuSelection pathname:', pathname);
  const path = normalizePath(pathname);

  let best = { score: -1, bias: 0, parents: [], leaf: null };

  const consider = (item, parents, href) => {
    if (!href) return;
    const { score, isPrefix } = segmentCommonScore(href, path);
    if (score <= 0) return; // share no leading segment -> ignore

    // tie-break: prefer true prefixes a bit
    const bias = isPrefix ? 0.5 : 0;

    // prefer higher score; if equal, prefer with prefix bias
    if (score > best.score || (score === best.score && bias > best.bias)) {
      best.score = score;
      best.bias = bias;
      best.parents = parents;
      best.leaf = null; // set later by caller
    }
  };

  const walk = (nodes, parents = []) => {
    nodes.forEach((item) => {
      const children = item.subMenu || item.submenu || [];
      const href = item.href || '';
      consider(item, parents, href);

      if (children.length) {
        walk(children, [...parents, item.nav]);
      } else if (href) {
        // leaf — if this item is currently "best", set leaf key
        const { score, isPrefix } = segmentCommonScore(href, path);
        const bias = isPrefix ? 0.5 : 0;
        if (score > best.score || (score === best.score && bias > best.bias)) {
          best = { score, bias, parents, leaf: item.nav };
        }
      }
    });
  };

  walk(items);

  return {
    openKeys: best.score >= 1 ? best.parents : [],
    selectedKeys: best.score >= 1 && best.leaf ? [best.leaf] : [],
  };
};

// ✅ Collect all child keys recursively (for cleanup when a parent closes)
export const collectAllChildren = (item) => {
  if (!item.subMenu) return [];
  return item.subMenu.reduce(
    (acc, sub) => [...acc, sub.nav, ...collectAllChildren(sub)],
    []
  );
};

export const getAllChildKeys = (menuList, key) => {
  for (const item of menuList) {
    if (item.nav === key) return collectAllChildren(item);
    if (item.subMenu) {
      const found = getAllChildKeys(item.subMenu, key);
      if (found.length) return found;
    }
  }
  return [];
};

// ✅ Find direct siblings (for closing sibling menus)
export const getSiblingKeys = (menuList, key, parentKey = null) => {
  for (const item of menuList) {
    if (item.nav === parentKey && item.subMenu) {
      return item.subMenu.map((sub) => sub.nav);
    }
    if (item.subMenu) {
      const result = getSiblingKeys(item.subMenu, key, item.nav);
      if (result) return result;
    }
  }
  // top level
  return menuList.map((i) => i.nav);
};

// ✅ Find parent chain (exact menu hierarchy)
export const getParentChain = (items, key, chain = []) => {
  for (const item of items) {
    if (item.nav === key) return chain;
    if (item.subMenu) {
      const result = getParentChain(item.subMenu, key, [...chain, item.nav]);
      if (result.length) return result;
    }
  }
  return [];
};
// Build parent/children/descendants maps for fast lookup (call in useMemo)
export const buildMenuMaps = (menuList) => {
  const parentMap = {}; // child -> parent
  const childrenMap = {}; // parent -> [children]

  const walk = (items, parent = null) => {
    for (const it of items) {
      const key = it.nav;
      if (parent) parentMap[key] = parent;
      if (!childrenMap[key]) childrenMap[key] = [];
      if (parent) {
        if (!childrenMap[parent]) childrenMap[parent] = [];
        childrenMap[parent].push(key);
      }
      if (it.subMenu?.length) walk(it.subMenu, key);
    }
  };
  walk(menuList);

  // collect descendants for each key
  const descendantsMap = {};
  const collectDesc = (k) => {
    const kids = childrenMap[k] || [];
    const all = [...kids];
    for (const c of kids) all.push(...collectDesc(c));
    return all;
  };
  Object.keys(childrenMap).forEach((k) => {
    descendantsMap[k] = collectDesc(k);
  });

  return { parentMap, childrenMap, descendantsMap };
};
