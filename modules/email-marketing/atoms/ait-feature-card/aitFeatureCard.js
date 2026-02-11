import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { CardContainer, ContentWrapper, IconWrapper } from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';

const { Title, Text } = Typography;

const AitFeatureCard = ({
  icon,
  bgColor = '',
  title,
  description,
  buttonLabel,
  onButtonClick,
  buttonminwidth = 'auto',
}) => {
  return (
    <CardContainer>
      <Row gutter={[
    { xs: 0, sm: 10, md: 20 }, // horizontal gutter
    { xs: 10, sm: 15, md: 20 } // vertical gutter
  ]} justify={{ xs: 'start', md: 'space-between' }} align={'middle'} wrap={true}>
        <Col xs={{flex:'0 0 100%'}} lg={{flex:'auto'}}>
           <Row wrap={false}>
             <Col>
              <IconWrapper bgColor={bgColor}>{icon}</IconWrapper>
             </Col>
              <Col>
              <ContentWrapper>
                <Title type='primary' level={5} style={{ marginBottom: 4,fontWeight:500, lineHeight:'19px' }}>
                  {title}
                </Title>
                <Text type='secondary'>{description}</Text>
              </ContentWrapper>
             </Col>
           </Row>
        </Col>
        <Col xs={{flex:'0 0 100%'}} lg={{flex:'none'}} className='feature-right-section'>
           <AitButton    
               variant="outlined"   
               color="primary"     
              style={{               
                marginTop: 'auto', // Pushes button to bottom
                minWidth:buttonminwidth,
              }}
              onClick={onButtonClick}
              title={buttonLabel}
            />
        </Col>
      </Row>
    </CardContainer>
  );
};

export default AitFeatureCard;
