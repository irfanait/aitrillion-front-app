import { Grid } from 'antd';
import { useState } from 'react';
import { StyleVerticalTabPane, StyleverticalTabs } from './style';
const { useBreakpoint } = Grid;

const AitVerticalTabs = ({
  tabItems,
  defaultActiveKey,
  slideWorlflowTabs,
  setSlideWorlflowTabs,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md; // true if screen width < 768px
  const [activeKey, setActiveKey] = useState(
    tabItems?.[defaultActiveKey]?.key || ''
  );

  const handleTabChange = (key) => {
    setActiveKey(key);
    if (isMobile) {
      setSlideWorlflowTabs(true);
    }
  };

  return (
    <>
      {
        <StyleverticalTabs
          isMobile={isMobile}
          tabPosition="left"
          activeKey={activeKey}
          onChange={handleTabChange}
          style={{ height: '100%' }}
          className={`${slideWorlflowTabs ? 'slide-workflow' : ''}`}
        >
          {tabItems.map((tab) => (
            <StyleVerticalTabPane tab={tab.label} key={tab.key}>
              {tab.content}
            </StyleVerticalTabPane>
          ))}
        </StyleverticalTabs>
      }
    </>
  );
};
export default AitVerticalTabs;
