import React from 'react';
import { Switch, Typography, Row, Col, Tooltip } from 'antd';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import Link from 'next/link';
import { HelpDocSvgIcon } from '../../svg-icons';
import { LinkStyle, StyleTitleWrap, TitleStyle } from './style';

const { Title, Text } = Typography;

const SettingsToggleCard = ({
  title = '',
  description = '',
  kb_link = '',
  checked = false,
  onChange = () => {},
  loading = false,
  disabled = false,
  titlemargin
}) => {
  return (
    <AitCard
      bodypadding={{
        xs: '20px',
        sm: '20px 24px',
        md: '24px',
      }}
      style={{
        borderRadius: '10px',
        background: '#fff',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      }}
    >
      <Row gutter={15} style={{ flexWrap: 'nowrap'}}>
        <Col flex={'0 0 33px'}>
          <AitSwitch
            checked={checked}
            onChange={onChange}
            loading={loading}
            disabled={disabled}
            style={{marginTop:5}}
          />
        </Col>

        <Col flex={'auto'}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <StyleTitleWrap level={5} type='primary' titlemargin={titlemargin}>
              <TitleStyle>{title} {kb_link && <Tooltip placement="right" title="Help doc">
                  <LinkStyle href={kb_link} target='_blank'><HelpDocSvgIcon/></LinkStyle>
                </Tooltip>}</TitleStyle>
               
            </StyleTitleWrap>
            {description && <Text type="secondary" style={{lineHeight:'20px'}}>{description}</Text>}
          </div>
        </Col>
      </Row>
    </AitCard>
  );
};

export default SettingsToggleCard;
