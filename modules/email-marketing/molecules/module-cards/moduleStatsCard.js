import AitModulesCard from '@/components/atoms/ait-modules-card/aitModuleCard';
import { Col, Row, Grid } from 'antd';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
const { useBreakpoint } = Grid;

const ModuleStatsCard = ({ data = [], accessMap = {} }) => {
  const { login_auth } = useSelector((state) => state.jwtState);

  const screens = useBreakpoint();
  // chunkArray helper
  const chunkArray = (arr, size) =>
    Array.isArray(arr)
      ? arr.reduce(
          (acc, _, i) =>
            i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc,
          []
        )
      : [];

  const chunks = chunkArray(data, 5);

  return (
    <>
      <Row gutter={[14, 14]} style={{ marginBottom: 24 }} wrap>
        {data.map(
          ({ id, label, icon, link, status, ai_module_feature }, index) => {
            if (id === 19 && !login_auth?.is_allow_checkoutx) {
              ai_module_feature = 'thankyou_checkout_widgets';
            }

            const rule =
              accessMap?.[ai_module_feature || item.module_feature] || {};
            const isHidden = rule?.action === 'hide' && rule?.access === 'No';
            const isRestricted =
              rule?.action === 'popup' && rule.access === 'No';
            const upgradeUrl = rule?.content || '/popup?act=upgrade';

            if (isHidden) return null;

            return (
              <Col
                key={index}
                xs={12}
                sm={12}
                md={8}
                lg={{ flex: '20%' }} // 5 per row
                xl={{ flex: '20%' }}
                xxl={{ flex: '20%' }}
              >
                <AitModulesCard
                  upgradeUrl={upgradeUrl}
                  isRestricted={isRestricted}
                  id={id}
                  label={label}
                  icon={icon}
                  link={link}
                  status={status}
                  padding={'13px 8px'}
                  height={'100%'}
                  bodyheight={'100%'}
                  bodytextalign="center"
                  bodyfontsize={'13px'}
                  bodylineheight={'18px'}
                  iconwidth={'42px'}
                  iconheight={'42px'}
                  boxshadow={'0px 2.55154px 3.8273px rgb(132 145 176 / 19%)'}
                />
              </Col>
            );
          }
        )}
      </Row>
    </>
  );
};

export default ModuleStatsCard;
