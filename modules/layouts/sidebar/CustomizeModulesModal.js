import React, { useState, useEffect, useRef } from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { Row, Col, Flex, Divider, Tooltip } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import AitText from '@/components/atoms/ait-text/aitText';
import { iconMapper } from '../utils';
import {
  ModuleListContainer,
  ModuleColumn,
  ModuleColumnTitle,
  ModuleItem,
  ModuleIconWrapper,
  ModuleName,
  ButtonContainer,
  ActionIcon,
  NoMoreModuleWrapper,
} from './CustomizeModulesModalStyle';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { getAccessRule } from '@/utils/common.util';

const CustomizeModulesModal = ({
  visible,
  setVisible,
  selectedModules,
  otherModules,
  userDetails,
  login_auth,
  saveInterestedModulesLoading,
  onSaveModules,
  activeModules,
  accessMap,
}) => {
  const [selected, setSelected] = useState([]);
  const [others, setOthers] = useState([]);
  const [removedActiveModules, setRemovedActiveModules] = useState([]);
  const prevVisibleRef = useRef(false);

  const shopType = login_auth?.shop_type?.toLowerCase() || 'shopify';

  // Filter modules based on shop type
  const filterModulesByShopType = (modules) => {
    if (!modules) return [];

    return modules.filter((item) => {
      // Check if module is hidden using getAccessRule
      const moduleFeature = item?.ai_module_feature || item?.module_feature;
      if (moduleFeature && accessMap) {
        const { isHidden } = getAccessRule(accessMap, moduleFeature);
        if (isHidden) {
          return false;
        }
      }

      // Filter for WooCommerce: exclude membership (12), formbuilder (13), customer-account (18)
      if (shopType === 'woocommerce') {
        if (
          item?.module_id === '12' || // membership-v1 and membership-v2
          item?.module_id === '13' || // formbuilder_module
          item?.module_id === '18' || // customer-account
          item?.module_id === '19' // CheckoutX
        ) {
          return false;
        }
      }

      // Filter for non-Shopify shops: exclude customer-account (18) and CheckoutX (19)
      if (
        shopType !== 'shopify' &&
        (item?.module_id === '18' || item?.module_id === '19')
      ) {
        return false;
      }

      return true;
    });
  };

  useEffect(() => {
    const isOpening = visible && !prevVisibleRef.current;

    if (isOpening) {
      setSelected(filterModulesByShopType(selectedModules || []));
      setOthers(filterModulesByShopType(otherModules || []));
      setRemovedActiveModules([]);
    }

    prevVisibleRef.current = visible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, selectedModules, otherModules, shopType]);

  // Check if module can be moved and get tooltip message
  const getModuleMovableInfo = (module) => {
    // Check if it's cashback with empty module_id
    // Cashback is restricted to move as it is dependent on Email and Workflow.
    if (module.id === 'cashback' && module.module_id === '') {
      return {
        isMovable: false,
        tooltip:
          'Cashback is restricted to move as it is dependent on Email and Workflow.',
      };
    }

    // All other modules can be moved
    return {
      isMovable: true,
      tooltip: null,
    };
  };

  // Handle adding module to selected (plus icon click)
  const handleAddToSelected = (module) => {
    const { isMovable } = getModuleMovableInfo(module);
    if (!isMovable) return;

    // console.log(`➕ Adding ${module.label} to selected`);

    // If this module was previously removed from active modules, remove it from removedActiveModules
    const isActiveModule = activeModules?.includes(module.module_id);
    if (isActiveModule) {
      setRemovedActiveModules((prev) =>
        prev.filter((val) => val !== module.value)
      );
    }

    // Remove from others
    const newOthers = others.filter((item) => item.id !== module.id);

    // Add to top of selected list
    const newSelected = [module, ...selected];

    // console.log(`  - New selected count: ${newSelected.length}`);
    // console.log(`  - New others count: ${newOthers.length}`);

    setOthers(newOthers);
    setSelected(newSelected);
  };

  // Handle removing module from selected (minus icon click)
  const handleRemoveFromSelected = (module) => {
    const { isMovable } = getModuleMovableInfo(module);
    if (!isMovable) return;

    // console.log(`➖ Removing ${module.label} from selected`);

    // Check if this module has status 1 (is active/installed)
    const isActiveModule = activeModules?.includes(module.module_id);

    if (isActiveModule) {
      // Add to removedActiveModules array if it's an active module being removed
      setRemovedActiveModules((prev) => {
        if (!prev.includes(module.value)) {
          return [...prev, module.value];
        }
        return prev;
      });
    }

    // Remove from selected
    const newSelected = selected.filter((item) => item.id !== module.id);

    // Add to top of others list (same behavior as adding to selected)
    const newOthers = [module, ...others];

    // console.log(`  - New selected count: ${newSelected.length}`);
    // console.log(`  - New others count: ${newOthers.length}`);

    setSelected(newSelected);
    setOthers(newOthers);
  };

  const handleSave = () => {
    // console.log('💾 Modal handleSave - selected:', selected.map(m => m.label));
    // console.log('💾 Modal handleSave - others:', others.map(m => m.label));
    // console.log('💾 Modal handleSave - selected count:', selected.length);
    // console.log('💾 Modal handleSave - others count:', others.length);
    // console.log('💾 Modal handleSave - removedActiveModules:', removedActiveModules);
    if (onSaveModules) {
      onSaveModules(selected, others, removedActiveModules);
      // Don't close modal immediately - let the parent component handle it after successful save
    }
  };

  const renderModuleItem = (module, index, listType) => {
    const icon =
      iconMapper[module.icon] ||
      iconMapper[module.id] ||
      iconMapper[module.nav];

    const { isMovable, tooltip } = getModuleMovableInfo(module);
    const isOtherModule = listType === 'others';

    const actionIcon = isOtherModule ? (
      <ActionIcon
        onClick={() => isMovable && handleAddToSelected(module)}
        disabled={!isMovable}
        className={!isMovable ? 'disabled' : ''}
      >
        <PlusOutlined />
      </ActionIcon>
    ) : (
      <ActionIcon
        onClick={() => isMovable && handleRemoveFromSelected(module)}
        disabled={!isMovable}
        className={!isMovable ? 'disabled' : ''}
      >
        <MinusOutlined />
      </ActionIcon>
    );

    const classNames = [
      !isMovable && 'non-movable',
      listType === 'selected' && 'selected-module',
    ]
      .filter(Boolean)
      .join(' ');

    const moduleItem = (
      <ModuleItem
        key={module.id}
        className={classNames}
        style={{
          opacity: isMovable ? 1 : 0.6,
        }}
      >
        <Flex align="center" gap={10} justify="space-between">
          <Flex
            align="center"
            gap={10}
            style={{ maxWidth: 'calc(100% - 26px)' }}
          >
            <Flex align="center" justify="center">
              <ModuleIconWrapper>{icon}</ModuleIconWrapper>
            </Flex>
            <ModuleName>
              {module.label || module.title || module.nav}
            </ModuleName>
          </Flex>
          {actionIcon}
        </Flex>
      </ModuleItem>
    );

    // Wrap with tooltip if not movable
    if (!isMovable && tooltip) {
      return (
        <Tooltip key={module.id} title={tooltip} placement="top">
          {moduleItem}
        </Tooltip>
      );
    }

    return moduleItem;
  };

  const handleClose = () => {
    // console.log('🟡 Closing modal via handleClose');
    setVisible(false);
  };

  return (
    <AitModal
      width={570}
      open={visible}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      centered
      title="Customize modules panel"
      isHeaderAtCenter={true}
      setVisible={handleClose}
      onCancel={handleClose}
      destroyOnClose={false}
      headerTitleLevel={3}
    >
      <ModuleListContainer>
        <AitText type="secondary" size={13} bottommargin={16}>
          Use “+” to add modules to the selection, and “–” to remove them.
        </AitText>

        <Divider style={{ marginTop: 10, marginBottom: 15 }} />

        <div style={{ width: '100%' }}>
          <Flex>
            {/* LEFT COLUMN - selected Modules with + icons */}
            <Flex
              flex={'0 0 calc(50% - 15px)'}
              align="start"
              wrap={true}
              style={{ overflowX: 'hidden', alignContent: 'start' }}
            >
              <ModuleColumnTitle>
                <AitText size={12} bottommargin={12} strong type="secondary">
                  Selected Modules
                </AitText>
              </ModuleColumnTitle>
              <ModuleColumn>
                <div className="module-list">
                  {selected.map((module, index) =>
                    renderModuleItem(module, index, 'selected')
                  )}
                  {selected.length === 0 && (
                    <div
                      style={{
                        padding: '20px 20px',
                        textAlign: 'center',
                        color: '#999',
                        background: 'white',
                        borderRadius: 8,
                        border: '2px dashed #e5e7eb',
                      }}
                    >
                      No selected modules
                    </div>
                  )}
                </div>
              </ModuleColumn>
            </Flex>

            <Flex flex={'1 1 auto'}>
              <Divider
                type="vertical"
                style={{
                  marginLeft: 15,
                  marginRight: 15,
                  height: 'calc(100% - 24px)',
                }}
              />
            </Flex>

            {/* RIGHT COLUMN - more Modules with - icons */}
            <Flex
              flex={'0 0 calc(50% - 15px)'}
              align="start"
              wrap={true}
              style={{ overflowX: 'hidden', alignContent: 'start' }}
            >
              <ModuleColumnTitle>
                <AitText size={12} bottommargin={12} strong type="secondary">
                  More Modules
                </AitText>
              </ModuleColumnTitle>
              <ModuleColumn>
                <div className="module-list">
                  {others.map((module, index) =>
                    renderModuleItem(module, index, 'others')
                  )}
                  {others.length === 0 && (
                    <NoMoreModuleWrapper>No more modules</NoMoreModuleWrapper>
                  )}
                </div>
              </ModuleColumn>
            </Flex>
          </Flex>
        </div>

        <ButtonContainer>
          <Flex justify="center" gap={10}>
            {/* <CancelButton onClick={() => setVisible(false)}>
              Cancel
            </CancelButton> */}
            <AitButton
              title="Save changes"
              onClick={handleSave}
              variant="solid"
              color="primary"
              loading={saveInterestedModulesLoading}
              disabled={saveInterestedModulesLoading}
              style={{ width: 160 }}
            />
          </Flex>
        </ButtonContainer>
      </ModuleListContainer>
    </AitModal>
  );
};

export default CustomizeModulesModal;
