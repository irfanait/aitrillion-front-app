import React, { useState } from 'react';
import { Spin } from 'antd';
import NextImage from 'next/image';
import {
  CardWrapper,
  ImageWrapper,
  OverlayButtons,
  ActionButton,
  NameWrapper,
  StyledTagWrapper,
  StyledTag,
  IconButton,
  IconsRow,
} from './style';
import { Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const TemplateCard = ({
  imageUrl,
  token,
  name,
  showNewTag = true,
  handleOpenEditorClick,
  item,
  handleUseTemplateClick,
  handleTemplatePreview,
  handleSendCmapaignClick,
  handleUseNowTemplateClick,
  getTemplatePreview,
  previewButtonLoading,
  activeTab,
  handleDeleteTemplate,
  handleUseNowcCampaignFromSavedTab,
}) => {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <CardWrapper>
      <ImageWrapper>
        {showNewTag && (
          <StyledTagWrapper>
            <StyledTag color="green">NEW EDITOR</StyledTag>
          </StyledTagWrapper>
        )}
        {imageLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f5f6f8',
              zIndex: 1,
            }}
          >
            <Spin size="small" />
          </div>
        )}

        <NextImage
          src={imageUrl}
          alt={name}
          layout="fill"
          objectFit="cover"
          sizes="100%"
          onLoadingComplete={() => setImageLoading(false)}
        />
        <OverlayButtons className="hover-actions">
          {router?.query?.tab !== 'saved' && (
            <ActionButton
              type="primary"
              title="Use template"
              onClick={() => {
                // handleOpenEditorClick(
                //   'create_use_template_with_campaign',
                //   campaignState?.sendEmailData?.encoded_key_id
                // );
                handleUseTemplateClick(item?.id);
              }}
              style={{ width: '131px' }}
            />
          )}
          {(router?.pathname === '/email-marketing/campaign/create-campaign' ||
            router?.pathname ===
              '/email-marketing/campaign/[id]/edit-campaign' ||
            router?.pathname === '/email-marketing/campaign/[id]/createAB') &&
            router?.query?.tab === 'saved' && (
              <ActionButton
                type="primary"
                varient="outlined"
                title="Use now"
                onClick={() => {
                  handleUseNowTemplateClick(item?.id);
                }}
                style={{ width: '131px' }}
              />
            )}
          <ActionButton
            varient="outlined"
            title="Preview"
            style={{ width: '131px' }}
            onClick={() => {
              getTemplatePreview(item?.id);
            }}
            loading={previewButtonLoading}
          />
          {/* shortly commented */}

          {!router?.pathname ===
            '/email-marketing/campaign/create-campaign' && (
            <ActionButton
              type="primary"
              title="Send campaign"
              onClick={() => {
                handleSendCmapaignClick(item, true);
              }}
              style={{ width: '131px' }}
            />
          )}
          {router?.pathname === '/email-marketing/templates/list' && (
            <ActionButton
              type="primary"
              title="Send campaign"
              onClick={() => {
                handleSendCmapaignClick(item, true);
              }}
              style={{ width: '131px' }}
            />
          )}
          {activeTab === 'saved' &&
            router?.pathname === '/email-marketing/templates/list' && (
              <IconsRow>
                <Tooltip title="Copy">
                  <IconButton onClick={() => handleUseTemplateClick(item?.id)}>
                    <CopyOutlined style={{ fontSize: 14, color: '#171717' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => {
                      // window.open(
                      //   `${process.env.NEXT_PUBLIC_APP_URL}/templatev2?type=editor&type2=template&etid=${item?.id}&ai_v2=${token}`,
                      //   '_self'
                      // );
                      router.push(
                        `/email-marketing/templates/editorv2?type=template&etid=${item?.id}`
                      );
                    }}
                  >
                    <EditOutlined style={{ fontSize: 14, color: '#171717' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDeleteTemplate(item)}>
                    <DeleteOutlined
                      style={{ fontSize: 14, color: '#171717' }}
                    />
                  </IconButton>
                </Tooltip>
              </IconsRow>
            )}
        </OverlayButtons>
      </ImageWrapper>
      <Tooltip title={name}>
        <NameWrapper>{name}</NameWrapper>
      </Tooltip>
    </CardWrapper>
  );
};

export default TemplateCard;
