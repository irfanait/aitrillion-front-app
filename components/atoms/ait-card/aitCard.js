import React from 'react';
// atoms/StatCard.tsx
import { Card, ConfigProvider, Typography, Grid } from 'antd';
import { AitCardWrapper } from './style';
const { useBreakpoint } = Grid;

const { Title, Text } = Typography;
const AitCard = ({
  children,
  title,
  titlefontsize,
  margintop,
  borderless,
  bodypadding,
  headerpadding,
  hastabs,
  extra,
  hascustomheader,
  customheaderright,
  customheaderleft,
  custombodypadding,
  headercolreverse,
  headerborderradius,
  token = { colorBgContainer: '#fff', colorBorderSecondary: '#f0f0f0' },
  cardheadernowrap = false,
  ...rest
}) => {
  const screens = useBreakpoint();

  return (
    <>
      <ConfigProvider
        theme={{
          token: token,
          components: {
            Card: {},
          },
        }}
      >
        <AitCardWrapper
          hascustomheader={hascustomheader}
          customheaderleft={customheaderleft}
          hastabs={hastabs}
          customheaderright={customheaderright}
          title={title}
          titlefontsize={titlefontsize}
          margintop={margintop}
          borderless={borderless}
          headerborderradius={headerborderradius}
          headerpadding={headerpadding}
          bodypadding={bodypadding}
          custombodypadding={custombodypadding}
          headercolreverse={headercolreverse}
          extra={extra}
          screens={screens}
          cardheadernowrap={cardheadernowrap}
          {...rest}
        >
          {hascustomheader ? (
            <>
              <div className="custom-card-header">
                <div className="custom-card-header-left">
                  {customheaderleft}
                </div>
                {customheaderright && (
                  <div className="custom-card-header-right">
                    {customheaderright}
                  </div>
                )}
              </div>
              <div className="custom-card-body">{children}</div>
            </>
          ) : (
            children
          )}
        </AitCardWrapper>
      </ConfigProvider>
    </>
  );
};

export default AitCard;
