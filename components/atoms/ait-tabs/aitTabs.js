// atoms/StatCard.tsx
import { StyledTabs } from './style';

const AitTabs = ({
  activeKey,
  onChange,
  items,
  defaultActiveKey,
  headerpadding,
  hascustomheader,
  pills,
  tabspadding = { xs: '0px 0px', sm: '0px 0px', md: '0px 0px' },
  ...rest
}) => (
  <StyledTabs
    destroyInactiveTabPane={false}
    activeKey={activeKey}
    defaultActiveKey="1"
    items={items}
    onChange={onChange}
    headerpadding={headerpadding}
    hascustomheader={hascustomheader}
    pills={pills}
    tabspadding={tabspadding}
    {...rest}
  />
);

export default AitTabs;
