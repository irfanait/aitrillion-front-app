import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Row, Col, Tooltip, Spin, App } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitText from '@/components/atoms/ait-text/aitText';
import { WebhookModalWrapper } from './style';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitLink from '@/components/atoms/ait-link/aitLink';
import {
  getWebhookModulesAndEventsService,
  sendTestEventService,
} from '../api';

function WebhookForm({ open, onCancel, onSave, webhook, saveLoading = false }) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [enableWebhook, setEnableWebhook] = useState(true);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [moduleEvents, setModuleEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [modulesData, setModulesData] = useState([]);
  const [eventKeyToTitleMap, setEventKeyToTitleMap] = useState({});
  const [eventTitleToKeyMap, setEventTitleToKeyMap] = useState({});
  const [testEventLoading, setTestEventLoading] = useState(false);

  // Helper function to extract error message from API response
  const getErrorMessage = (error) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.response?.data?.msg) {
      return error.response.data.msg;
    }
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };

  // Fetch modules and events data
  useEffect(() => {
    if (open) {
      fetchModulesAndEvents();
    } else {
      // Reset loading states when modal closes
      setTestEventLoading(false);
    }
  }, [open]);

  // Initialize form when webhook data changes
  useEffect(() => {
    if (
      open &&
      Object.keys(moduleEvents).length > 0 &&
      Object.keys(eventKeyToTitleMap).length > 0
    ) {
      if (webhook) {
        // Set form field values
        form.setFieldsValue({
          name: webhook.webhook_name || webhook.name,
          webhookUrl:
            webhook.endpoint || webhook.endpoint_url || webhook.webhookUrl,
        });

        // Set enable/disable status
        const isActive =
          webhook.enabled !== undefined
            ? webhook.enabled
            : webhook.is_active !== undefined
              ? webhook.is_active === 1
              : webhook.status !== undefined
                ? webhook.status
                : true;
        setEnableWebhook(isActive);

        // Parse webhook events (comma-separated event keys)
        const webhookEventsString =
          webhook.events || webhook.webhook_events || '';

        if (webhookEventsString) {
          const eventKeys = webhookEventsString
            .split(',')
            .map((key) => key.trim())
            .filter(Boolean);
          const eventTitles = eventKeys
            .map((key) => eventKeyToTitleMap[key])
            .filter(Boolean);

          // Group events by module
          const eventsByModule = {};
          Object.keys(moduleEvents).forEach((module) => {
            eventsByModule[module] = [];
          });

          modulesData.forEach((module) => {
            const moduleName = module.display_name;
            module.events.forEach((event) => {
              if (eventTitles.includes(event.event_title)) {
                eventsByModule[moduleName].push(event.event_title);
              }
            });
          });

          // Set selected modules (only those with events)
          const selectedMods = Object.keys(eventsByModule).filter(
            (module) => eventsByModule[module].length > 0
          );
          setSelectedModules(selectedMods);
          setSelectedEvents(eventsByModule);
        } else {
          // No events selected
          setSelectedModules([]);
          const emptyEvents = {};
          Object.keys(moduleEvents).forEach((module) => {
            emptyEvents[module] = [];
          });
          setSelectedEvents(emptyEvents);
        }
      } else {
        // Reset form for creating new webhook
        form.resetFields();
        setEnableWebhook(true);
        setSelectedModules([]);
        // Initialize empty arrays for each module
        const emptyEvents = {};
        Object.keys(moduleEvents).forEach((module) => {
          emptyEvents[module] = [];
        });
        setSelectedEvents(emptyEvents);
      }
    }
  }, [open, webhook, form, moduleEvents, eventKeyToTitleMap, modulesData]);

  const fetchModulesAndEvents = async () => {
    setLoading(true);
    try {
      // Get shop details from Redux state
      const shopId = jwtState?.login_auth?.shop_id || '';
      const shopName = jwtState?.login_auth?.shop_name || '';

      const payload = {
        shop_id: shopId,
        shop_name: shopName,
      };

      const response = await getWebhookModulesAndEventsService(payload);

      if (response.data && response.data.status === 'success') {
        const modulesData = response.data.data || [];
        setModulesData(modulesData);

        // Create bidirectional mapping between event keys and titles
        const keyToTitle = {};
        const titleToKey = {};

        // Transform API response to moduleEvents format
        const transformedModuleEvents = {};
        modulesData.forEach((module) => {
          const displayName = module.display_name;
          transformedModuleEvents[displayName] = module.events.map((event) => {
            keyToTitle[event.event_key] = event.event_title;
            titleToKey[event.event_title] = event.event_key;
            return event.event_title;
          });
        });

        setEventKeyToTitleMap(keyToTitle);
        setEventTitleToKeyMap(titleToKey);
        setModuleEvents(transformedModuleEvents);

        const initialSelectedEvents = {};
        Object.keys(transformedModuleEvents).forEach((module) => {
          initialSelectedEvents[module] = [];
        });
        setSelectedEvents(initialSelectedEvents);
      } else {
        notification.error({
          message: 'Failed to load modules and events',
        });
      }
    } catch (error) {
      notification.error({
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const webhookData = {
        ...values,
        status: enableWebhook,
        modules: selectedModules,
        selectedEvents: selectedEvents,
        eventTitleToKeyMap: eventTitleToKeyMap,
      };
      onSave(webhookData);
    });
  };

  const handleSendTestEvent = async () => {
    setTestEventLoading(true);
    try {
      // Validate webhook URL first
      const webhookUrl = form.getFieldValue('webhookUrl');
      if (!webhookUrl) {
        notification.warning({
          message: 'Please enter a webhook URL first',
        });
        setTestEventLoading(false);
        return;
      }

      const shopName = jwtState?.login_auth?.shop_name || '';

      const payload = {
        webhook_url: webhookUrl,
        shop_name: shopName,
      };

      const response = await sendTestEventService(payload);

      if (response.data && response.data.status === 'success') {
        notification.success({
          message: 'Test event sent successfully',
        });
      } else {
        notification.error({
          message: response.data?.message || 'Failed to send test event',
        });
      }
    } catch (error) {
      notification.error({
        message: error?.response?.data?.msg,
      });
    } finally {
      setTestEventLoading(false);
    }
  };

  const handleModuleChange = (module, checked) => {
    let newSelectedModules;
    if (checked) {
      newSelectedModules = [...selectedModules, module];
    } else {
      newSelectedModules = selectedModules.filter((m) => m !== module);
      // Clear events for unchecked module
      setSelectedEvents({
        ...selectedEvents,
        [module]: [],
      });
    }
    setSelectedModules(newSelectedModules);
  };

  const handleEventChange = (module, checkedValues) => {
    setSelectedEvents({
      ...selectedEvents,
      [module]: checkedValues,
    });
  };

  return (
    <WebhookModalWrapper>
      <div className="modal-header">
        <AitText type="secondary" size={14}>
          Webhooks let AiTrillion automatically send data to your app whenever
          selected events happen — like when a review is submitted or loyalty
          points are earned. <AitLink href="#"> View setup guide</AitLink>
        </AitText>
      </div>

      <Form form={form} layout="vertical" className="webhook-form">
        <AitCard>
          <AitText
            strong
            size={16}
            style={{ display: 'block', marginBottom: 16 }}
          >
            Webhook details
          </AitText>

          <div className="enable-webhook-row">
            <AitSwitch
              checked={enableWebhook}
              onChange={setEnableWebhook}
              label="Enable webhook"
            />
          </div>

          <Form.Item
            name="name"
            label="Webhook name"
            rules={[{ required: true, message: 'Please enter webhook name' }]}
          >
            <AitInputBox placeholder="Enter a name (e.g., Order Events)" />
          </Form.Item>

          <Form.Item
            name="webhookUrl"
            label={
              <>
                Webhook URL{' '}
                <Tooltip
                  placement="right"
                  title="Endpoint that will receive webhook payloads"
                >
                  <InfoCircleOutlined
                    style={{
                      marginLeft: '5px',
                      position: 'relative',
                    }}
                  />
                </Tooltip>
              </>
            }
            rules={[
              { required: true, message: 'Please enter webhook URL' },
              { type: 'url', message: 'Please enter a valid URL' },
            ]}
          >
            <AitInputBox placeholder="https://yourdomain.com/webhook-endpoint" />
          </Form.Item>
        </AitCard>

        <AitCard style={{ marginTop: '24px' }}>
          <AitText
            strong
            size={16}
            style={{ display: 'block', marginBottom: 8 }}
          >
            Select modules & events
          </AitText>
          <AitText
            type="secondary"
            size={13}
            style={{ display: 'block', marginBottom: 16 }}
          >
            Your endpoint will receive real-time updates for selected modules.
          </AitText>

          <div className="modules-section">
            {loading ? (
              <div className="desktop-loader">
                <Spin />
              </div>
            ) : (
              <>
                <div className="desktop-layout">
                  {/* Parent Module Checkboxes */}
                  <Row gutter={[{ sm: 24, md: 32 }, 0]}>
                    {Object.keys(moduleEvents).map((module) => (
                      <Col sm={8} key={module}>
                        <Checkbox
                          checked={selectedModules.includes(module)}
                          onChange={(e) =>
                            handleModuleChange(module, e.target.checked)
                          }
                        >
                          <AitText size={14} strong>
                            {module}
                          </AitText>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>

                  {/* Child Event Checkboxes in Grid */}
                  <div className="events-grid-container">
                    <Row gutter={[{ sm: 24, md: 32 }, 16]}>
                      {Object.keys(moduleEvents).map((module) => (
                        <Col sm={8} key={module}>
                          {selectedModules.includes(module) && (
                            <div className="module-events-grid">
                              <Checkbox.Group
                                value={selectedEvents[module] || []}
                                onChange={(values) =>
                                  handleEventChange(module, values)
                                }
                                style={{ width: '100%' }}
                              >
                                <Row gutter={[8, 8]}>
                                  {moduleEvents[module]?.map((event) => (
                                    <Col xs={24} key={event}>
                                      <Checkbox value={event}>
                                        <AitText size={13}>{event}</AitText>
                                      </Checkbox>
                                    </Col>
                                  ))}
                                </Row>
                              </Checkbox.Group>
                            </div>
                          )}
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>

                <div className="mobile-layout">
                  {Object.keys(moduleEvents).map((module) => (
                    <div className="module-block" key={module}>
                      <Checkbox
                        checked={selectedModules.includes(module)}
                        onChange={(e) =>
                          handleModuleChange(module, e.target.checked)
                        }
                      >
                        <AitText size={14} strong>
                          {module}
                        </AitText>
                      </Checkbox>
                      {selectedModules.includes(module) && (
                        <div className="module-events-mobile">
                          <Checkbox.Group
                            value={selectedEvents[module] || []}
                            onChange={(values) =>
                              handleEventChange(module, values)
                            }
                            style={{ width: '100%' }}
                          >
                            {moduleEvents[module]?.map((event) => (
                              <div key={event}>
                                <Checkbox value={event}>
                                  <AitText size={13}>{event}</AitText>
                                </Checkbox>
                              </div>
                            ))}
                          </Checkbox.Group>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </AitCard>

        <div className="modal-footer">
          <AitButton
            type="primary"
            title="Save configuration"
            onClick={handleSave}
            loading={saveLoading}
            disabled={testEventLoading || saveLoading}
          />
          <AitButton
            title="Send test event"
            onClick={handleSendTestEvent}
            style={{ marginLeft: 8 }}
            loading={testEventLoading}
            disabled={saveLoading || testEventLoading}
          />
          <AitButton
            title="Cancel"
            onClick={onCancel}
            style={{ marginLeft: 8 }}
            disabled={saveLoading || testEventLoading}
          />
        </div>
      </Form>
    </WebhookModalWrapper>
  );
}

export default WebhookForm;
