import React, { useEffect, useState } from 'react';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { Row, Col, notification, Typography } from 'antd';
const { Text } = Typography;
import { StyledFormWrapper, ButtonWrapper, StyleVideoWrapper } from './style';
import { BookOutlined } from '@ant-design/icons';


const VideoModal = ({ visible, setVisible }) => {
  useEffect(() => {
    let player;
    let ytApiLoaded = !!window.YT;

    function createPlayer() {
      player = new window.YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: 'SdrgjJCTen4',
        playerVars: {
          rel: 0,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
        },
      });
    }

    if (visible) {
      // Remove any previous iframe
      const ytDiv = document.getElementById('ytplayer');
      if (ytDiv) ytDiv.innerHTML = '';

      if (ytApiLoaded) {
        createPlayer();
      } else {
        // Load API if not loaded
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/player_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubePlayerAPIReady = () => {
          createPlayer();
        };
      }
    }

    return () => {
      // Destroy player when modal closes
      if (player && player.destroy) {
        player.destroy();
      }
      // Remove the iframe from the div
      const ytDiv = document.getElementById('ytplayer');
      if (ytDiv) ytDiv.innerHTML = '';
    };
  }, [visible]);

  return (
    <AitModal
      width={760}
      open={visible}
      footer={false}
      headerVisible={true}
      closeIconVisible={true}
      centered
      title="How to Setup Email Marketing"
      isHeaderAtCenter={true}
      setVisible={() => setVisible(false)}
      headerTitleLevel={3}
    >
      <StyleVideoWrapper>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text type="secondary" className="modal-subtitle">
              You just need to follow the video
            </Text>
          </Col>
          <Col span={24}>
            <div id="ytplayer" className="videoIframe"></div>
          </Col>
        </Row>
        <ButtonWrapper gutter={[16, 16]}>
          <Col span={24}>
            <AitButton
              title="Go to Knowledge Base"
              type="link"
              variant="outlined"
              color="primary"
              target="_blank"
              href="https://docs.aitrillion.com/portal/en/kb/articles/create-send-email-marketing-campaigns"
              icon={<BookOutlined />}
            />
          </Col>
        </ButtonWrapper>
      </StyleVideoWrapper>
    </AitModal>
  );
};

export default VideoModal;
