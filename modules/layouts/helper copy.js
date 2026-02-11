import React, { useEffect, useState } from 'react';
import { Menu, Divider, Typography, Tooltip } from 'antd';
import Link from 'next/link';
import { iconMapper } from './utils';
import { store } from '@/redux';
import {
  CreateNewPlusIcon,
  EditModulesIcon,
  LockRestrictedIcon,
  PlusIcon,
} from './svg-icons';
import { aitAllModulesArray, token } from './utils/constants';
import { SelectedModuleWrappper } from './sidebar/sidebarStyle';

const { Title } = Typography;

const CreateButton = ({ item }) => (
  <Link
    href={item?.createButton?.href}
    style={{ width: 18 }}
    className="create-button-link"
  >
    <CreateNewPlusIcon />
  </Link>
);

const PinUnpinModule = ({
  item,
  accessModuleWithMapping,
  handleCheckActiveModuleChange,
  isPinChecked,
  setIsPinChecked,
}) => {
  // status: accessModuleWithMapping[item.module_id],
  //   value:item.value,
  //  module_id:item.module_id,
  //   input_id: `nav_menu_${item.value}`,
  //   isChecked,

  useEffect(() => {
    setIsPinChecked(item.isChecked);
    //console.log('isChecked in PinUnpinModule:', isChecked);
  }, [item.isChecked]);

  return (
    <span className="pin_unpin_btn">
      <input
        type="checkbox"
        name="checkActiveModule"
        data-status={accessModuleWithMapping[item.module_id]}
        value={item?.value || ''}
        id={`nav_menu_${item.value}`}
        checked={isPinChecked}
        onChange={handleCheckActiveModuleChange}
      />
      <label htmlFor={`nav_menu_${item.value}`} className="pinModule"></label>
    </span>
  );
};
export const RenderMenuItems = (
  items = [],
  accessMap = {},
  selectedKeys,
  collapsed,
  screens,
  router,
  handlePinUnpinModules,
  showPinIcon,
  setShowPinIcon,
  activeModules,
  accessModuleWithMapping
) => {
  const state = store.getState();
  const { login_auth } = state.jwtState;
  const shopId = login_auth?.shop_id || null;

  const isLoggedinMagentoAdmin =
    login_auth?.is_marketplace &&
    process.env.NEXT_PUBLIC_EVEREST_ADMIN_SHOP_ID == shopId
      ? 1
      : 0;
  const showNewMembershipMenus = login_auth?.show_membership_module_v2;
  const shopType = login_auth?.shop_type?.toLowerCase() || null;
  const isEnableSuppressionDomain =
    login_auth?.is_enable_suppression_domain || null;
  const shopAllow = [160935, 154375, 155640];
  const [isPinChecked, setIsPinChecked] = useState(false);

  const menuNodes = [];

  const handleLockIconClick = (content) => {
    const url = content || '/popup?act=upgrade';
    router?.push(url);
  };

  const handleCheckActiveModuleChange = (e) => {
    // const { value, checked } = e.target;
    setIsPinChecked(e.target.checked);
    console.log('Checkbox is now:', e.target.checked ? 'Checked' : 'Unchecked');
    // handlePinUnpinModules(value, checked);
  };

  const newItems = [];
  let reOrderedModule = Array.isArray(activeModules)
    ? checkActiveModules(items, activeModules, accessModuleWithMapping)
    : {};
  if (Array.isArray(activeModules)) {
    newItems?.push(...reOrderedModule.items);
  }
  //console.log('reOrderedModule', reOrderedModule);
  const lastItem =
    reOrderedModule?.selecteModules?.length > 0
      ? reOrderedModule.selecteModules[
          reOrderedModule.selecteModules.length - 1
        ].module_id
      : null;

  newItems?.forEach((item) => {
    if (
      (shopType === 'magento' || shopType === 'woocommerce') &&
      (item?.id === 'membership-v2' ||
        item?.id === 'membership-v1' ||
        item.id === 'formbuilder_module' ||
        item.id === 'loyalty-settings-general' ||
        item.id === 'product-recommendations-personalized')
    )
      return;

    if (
      (shopType !== 'shopify' || shopType !== 'woocommerce') &&
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

    if (shopType !== 'woocommerce' && item.id === 'brand_insights_module')
      return;

    if (item.id === 'all-sellers' && !isLoggedinMagentoAdmin) return;

    if (
      item.id === 'email-marketing-settings-general' &&
      !isEnableSuppressionDomain
    )
      return;

    if (item?.id === 'membership-v2' && !showNewMembershipMenus) return;
    if (item?.id === 'membership-v1' && showNewMembershipMenus) return;

    if (item.id === 'brand_insights_module' && isLoggedinMagentoAdmin) return;

    if (
      item.id === 'cashback' &&
      (shopAllow.includes(!shopId) ||
        (process.env.NEXT_PUBLIC_APPLICATION_ENV !== 'production' &&
          shopType === 'woocommerce'))
    )
      return;

    const rule = accessMap[item.ai_module_feature || item.module_feature];
    const isHidden = rule?.action === 'hide' && rule.access === 'No';
    const isRestricted = rule?.action === 'popup' && rule.access === 'No';
    const upgradeUrl = '/popup?act=upgrade';
    const hasSubMenu = item.subMenu || item.submenu;
    const children = item.subMenu || item.submenu;
    const icon = iconMapper[item.icon];

    if (isHidden) return null;

    const isChecked = activeModules?.includes(item.module_id);
    //console.log('isChecked in helper:', isChecked);
    item.isChecked = isChecked;

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
          {isRestricted && <LockRestrictedIcon />}
        </div>
      );

      menuNodes?.push(
        <Menu.SubMenu
          id={item.id}
          key={item.nav}
          title={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{item.label}</span>
              {isRestricted && <LockRestrictedIcon />}
              {item?.module_id && item?.isChecked !== null && showPinIcon && (
                <PinUnpinModule
                  item={item}
                  accessModuleWithMapping={accessModuleWithMapping}
                  handleCheckActiveModuleChange={handleCheckActiveModuleChange}
                  isPinChecked={isPinChecked}
                  setIsPinChecked={setIsPinChecked}
                />
              )}
            </div>
          }
          icon={icon}
          className={`${router?.pathname === selectedKeys ? 'menu-item-main ant-menu-item-active' : 'menu-item-main'} 
             ${item?.module_id && showPinIcon ? 'has-pin-icon' : ''}`}
          expandIcon={isRestricted ? () => false : undefined}
          onTitleClick={(e) => {
            if (isRestricted) {
              e.domEvent.preventDefault();
              handleLockIconClick(upgradeUrl);
            }
          }}
        >
          {!isRestricted &&
            RenderMenuItems(
              children,
              accessMap,
              selectedKeys,
              collapsed,
              screens,
              router,
              handlePinUnpinModules,
              showPinIcon,
              setShowPinIcon,
              activeModules,
              accessModuleWithMapping
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
          key={item.nav}
          icon={icon}
          className={`${router?.pathname === item.href ? 'menu-item-main ant-menu-item-active' : 'menu-item-main'} 
             ${item?.module_id && showPinIcon ? 'has-pin-icon' : ''}`}
          style={{
            cursor: isRestricted ? 'pointer' : undefined,
            color: isRestricted ? '#888' : undefined,
          }}
          onClick={(e) => {
            if (isRestricted) {
              e.domEvent.preventDefault();
              handleLockIconClick(upgradeUrl);
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
              {isRestricted ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                    userSelect: 'none',
                  }}
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
                  <span>{item.label}</span>
                </Link>
              )}
              {!isRestricted && item?.createButton && (
                <CreateButton item={item} />
              )}
              {isRestricted && <LockRestrictedIcon />}
              {item?.module_id && item?.isChecked !== null && showPinIcon && (
                <PinUnpinModule
                  item={item}
                  accessModuleWithMapping={accessModuleWithMapping}
                  handleCheckActiveModuleChange={handleCheckActiveModuleChange}
                  isPinChecked={isPinChecked}
                  setIsPinChecked={setIsPinChecked}
                />
              )}
            </div>
          </Tooltip>
        </Menu.Item>
      );
    }

    // 🔥 Inject Divider + Title after 'reports'
    if (item.id === 'reports') {
      menuNodes.push(
        (screens?.xl ? !collapsed : true) && (
          <div key="selected-modules-divider" id="selected_modules">
            <SelectedModuleWrappper>
              <div>Selected Modules</div>
              <button type="button" onClick={handlePinUnpinModules}>
                <EditModulesIcon />
              </button>
            </SelectedModuleWrappper>
          </div>
        )
      );
    }
    if (item.module_id === lastItem) {
      menuNodes.push(
        (screens?.xl ? !collapsed : true) && (
          <div key="other-modules-divider" id="other_modules_nav">
            <SelectedModuleWrappper>
              <div>More Modules</div>
            </SelectedModuleWrappper>
          </div>
        )
      );
    }
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
  for (let item of items) {
    if (pathname.includes(item.href?.split('?')[0])) {
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

export const checkActiveModules = (
  items,
  activeModules,
  accessModuleWithMapping
) => {
  if (!activeModules) return [];

  // Collect all checked modules in one array
  const notModules = items.filter(
    (item) => !item.module_id && item.id !== 'cashback'
  );
  const selecteModules = items.filter((item) =>
    activeModules.includes(item.module_id)
  );
  const inactiveModules = items.filter(
    (item) => !activeModules.includes(item.module_id) && item.module_id
  );

  items = [...notModules, ...selecteModules, ...inactiveModules];

  //const pinHtml = pinModuleIconObj.map(obj => obj.html).join('');

  const reOrderedModule = {
    notModules: notModules,
    selecteModules: selecteModules,
    inactiveModules: inactiveModules,
    items: items,
  };

  return reOrderedModule;

  // const isChecked = activeModules.includes(item.module_id);

  //const pinModuleIcon = items.map((item) => {
  //   const isChecked = activeModules.includes(item.module_id);
  //   const pinModuleIcon = {
  //     status: accessModuleWithMapping[item.module_id],
  //     value:item.value,
  //     module_id:item.module_id,
  //     input_id: `nav_menu_${item.value}`,
  //     isChecked,
  //     html: `
  //       <span class="pin_unpin_btn">
  //         <input type="checkbox" name="moduleradio" data-status="${accessModuleWithMapping[item.module_id]}" value="${item.value}" id="nav_menu_${item.value}" ${isChecked ? 'checked' : ''}/>
  //         <label for="nav_menu_${item.value}" class="pinModule"></label>
  //       </span>
  //     `
  //   };
  //   return pinModuleIcon;
  // });
  return items;
};
