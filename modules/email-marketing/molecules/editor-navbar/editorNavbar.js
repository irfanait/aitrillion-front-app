import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Space, Tooltip, Typography } from 'antd';

import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  CodeArrowsSvgIcon,
  EditorV2EditIcon,
  RedoIcon,
  TemplatePreviewIcon,
  UndoIcon,
} from '../../svg-icons';
import { Actions, BreadcrumbText, NavbarWrapper } from './style';
import { useSelector } from 'react-redux';
import AitDropdownButton from '@/components/atoms/ait-dropdown-button/aitDropdownButton';
import { useRouter } from 'next/router';
const { Text, Title } = Typography;

const EditorNavbar = (props) => {
  const {
    handleSave,
    templateName,
    handleSaveAndExitClickwhenCampId,
    handleCompileTemplate,
    handleDiscardAndBack,
    loading,
  } = props;

  const [localName, setLocalName] = useState(templateName);

  useEffect(() => {
    setLocalName(templateName);
  }, [templateName]);

  const router = useRouter();
  const {
    templateData,
    saveEmailTemplateLoading,
    templateDataByCampaignId,
    getDecodedUrlData,
  } = useSelector((state) => state.stripoState);

  const { email_data } = getDecodedUrlData;

  const isCreateNew =
    router?.query?.type2 === 'createfromscratch' ||
    router?.query?.type === 'create-template';

  return (
    <NavbarWrapper>
      {/* Left side - breadcrumb */}
      <Col>
        <Space>
          {(router?.query?.camp_id &&
            router?.query?.type === 'campaign' &&
            router?.query?.type2 === 'edit-email') ||
          router?.query?.type2 === 'createfromscratch' ||
          router?.query?.type2 === 'createAb' ||
          router?.query?.type2 === 'use-now' ||
          router?.query?.type2 === 'use_template_create_campaign' ||
          router?.query?.type2 === 'change-template' ? (
            <Breadcrumb>
              <Breadcrumb.Item>
                <BreadcrumbText>
                  <AitButton
                    href="/email-marketing/campaign/list"
                    type="link"
                    color="default"
                    title={
                      <Text strong style={{ margin: 0 }}>
                        Campaign
                      </Text>
                    }
                  />
                </BreadcrumbText>
              </Breadcrumb.Item>

              <Breadcrumb.Item>
                <BreadcrumbText>
                  <Text strong style={{ margin: 0 }}>
                    {router?.query?.c_name ||
                      templateDataByCampaignId?.templateData?.campaign_name ||
                      email_data?.campaign_name ||
                      ''}
                  </Text>
                </BreadcrumbText>
              </Breadcrumb.Item>
            </Breadcrumb>
          ) : (
            !isCreateNew && (
              <Text strong>
                {router?.query?.c_name ??
                  templateData?.templateRow?.title ??
                  templateName ??
                  ''}
              </Text>
            )
          )}

          {router?.query?.type !== 'campaign' && (
            <Tooltip title="Edit template name">
              <AitButton
                type="text"
                icon={<EditorV2EditIcon />}
                onClick={handleSave}
                style={{ padding: 0 }}
                className="edit_btn"
              />
            </Tooltip>
          )}
        </Space>
      </Col>

      {/* Right side - actions */}
      <Actions size="middle">
        <Tooltip title="Undo">
          <AitButton
            id="undoButton"
            icon={<UndoIcon />}
            padding={'0px 2px'}
            className="icon_btn"
            disabled={loading}
          />
        </Tooltip>
        <Tooltip title="Redo">
          <AitButton
            id="redoButton"
            icon={<RedoIcon />}
            padding={'0px 2px'}
            className="icon_btn"
            disabled={loading}
          />
        </Tooltip>
        <Tooltip title="Code View">
          <AitButton
            id="codeEditor"
            icon={<CodeArrowsSvgIcon />}
            padding={'0px 2px'}
            className="icon_btn"
            disabled={loading}
          />
        </Tooltip>
        <Tooltip title="Preview">
          <AitButton
            color="default"
            variant="outlined"
            icon={<TemplatePreviewIcon />}
            onClick={() => handleCompileTemplate('preview')}
            padding={'0px 2px'}
            className="icon_btn"
            disabled={loading}
          />
        </Tooltip>

        <AitButton
          variant="outlined"
          color="primary"
          title="Send test"
          disabled={loading}
          onClick={() => handleCompileTemplate('send_test')}
        />
        <AitButton
          type="danger"
          color="danger"
          variant="outlined"
          title="Discard & back"
          onClick={() => {
            handleDiscardAndBack(true);
          }}
          disabled={loading}
        />
        {router?.query?.type === 'template' ||
        (router?.query?.type === 'campaign' &&
          router?.query?.type2 === 'createfromscratch') ? (
          <AitDropdownButton
            variant="outlined"
            color="primary"
            title={saveEmailTemplateLoading ? 'Processing...' : 'Save & exit'}
            style={{
              width: '100%',
              color: '#1A73E8',
              fontWeight: 500,
            }}
            menuItems={[
              {
                key: 'save_as_template',
                label: 'Save as template',
                onClick: () => {
                  // if (router?.query?.type !== 'campaign') {
                  handleSave();
                  // }
                },
              },

              {
                key: 'change_template',
                label: 'Change template',
                onClick: () => {
                  router?.push('/email-marketing/templates/list');
                },
              },
            ]}
            loading={saveEmailTemplateLoading}
            onClick={() => {
              if (router?.query?.type !== 'campaign') {
                handleSave();
              } else {
                handleSaveAndExitClickwhenCampId();
              }
            }}
            disabled={loading}
          />
        ) : (
          <AitButton
            color="primary"
            variant="outlined"
            title={saveEmailTemplateLoading ? 'Processing...' : 'Save & exit'}
            loading={saveEmailTemplateLoading}
            onClick={() => {
              if (router?.query?.type !== 'campaign') {
                handleSave();
              } else {
                handleSaveAndExitClickwhenCampId();
              }
            }}
            disabled={loading}
          />
        )}
      </Actions>
    </NavbarWrapper>
  );
};
export default EditorNavbar;
