import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  App,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Typography,
  Upload,
} from 'antd';
import { HelperText, Label } from '../style';
import { ModalAlertIcon } from '../../../svg-icons';
import { useEffect, useState } from 'react';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEarnPointsListData,
  earnPointsData,
} from '../../../redux/earnPoints/earnPointsSlice';
import {
  saveActivitiesService,
  updateActivitiesService,
} from '../../../api/earnPoints';
import logger from '@/utils/logger';
import AitUpload from '@/components/atoms/ait-upload';
import {
  enterOnlyNumericValue,
  getCurrencyByMoneyFormat,
  validateImageFile,
} from '@/utils/common.util';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { StyledRadio } from '@/components/atoms/ait-radio-button/style';
import AitRowWrapper from '@/components/atoms/ait-row-wrapper/aitRowWrapper';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import AitText from '@/components/atoms/ait-text/aitText';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Text } = Typography;

function SocialEngagementsForm({
  setIsModalOpen,
  rowData,
  activityId,
  handleCancel,
  updateActivityData,
}) {
  const jwtState = useSelector((state) => state?.jwtState);
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState('givepoints');
  const { notification } = App.useApp();
  const dispatch = useDispatch();
  const activitiesData = useSelector(earnPointsData);
  const [loading, setLoading] = useState(false);

  const activityTypeObj = {
    17: {
      name: 'Instagram username',
      placeholder: 'Instagram profile username',
    },
    18: {
      name: 'Twitter  username',
      placeholder: 'Twitter profile username',
    },
    19: {
      name: 'Facebook username',
      placeholder: 'Facebook profile username',
    },
    20: {
      name: 'Pinterest username',
      placeholder: 'Pinterest profile username',
    },
    21: {
      name: 'Facebook link',
      placeholder: jwtState?.login_auth?.domain,
    },
    22: {
      name: 'Twitter  username',
      placeholder: 'Twitter profile username',
    },
  };

  const handleRadioChange = (e) => {
    setSelectedType(e.target.value);
  };

  const obj = {
    17: {
      points: 'insta_points',
      language: 'follow_on_instagram',
      panel_msg: 'insta_panel_text',
      display_notification: 'insta_block_text',
      username: 'insta_username',
      campNameAndPlace: 'Follow on Instagram',
      desValue:
        'Earn {{points}} reward points when you follow us on Instagram.',
      rewardText:
        'Earned {{points}} reward points by following us on Instagram.',
    },
    18: {
      points: 'twitter_points',
      language: 'follow_on_twitter',
      panel_msg: 'twitter_panel_text',
      display_notification: 'twitter_block_text',
      username: 'twitter_username',
      campNameAndPlace: 'Follow on Twitter',
      desValue: 'Earn {{points}} reward points when you follow us on Twitter.',
      rewardText: 'Earned {{points}} reward points by following us on Twitter.',
    },
    19: {
      points: 'fb_points',
      language: 'follow_on_facebook',
      panel_msg: 'fb_panel_text',
      display_notification: 'fb_block_text',
      username: 'fb_username',
      campNameAndPlace: 'Follow On Facebook',
      desValue: 'Earn {{points}} reward points when you follow us on Facebook',
      rewardText:
        'Earned {{points}} reward points by following us on Facebook.',
    },
    20: {
      points: 'pin_points',
      language: 'follow_on_pinterest',
      panel_msg: 'pin_panel_text',
      display_notification: 'pin_block_text',
      username: 'pin_username',
      campNameAndPlace: 'Follow on Pinterest',
      desValue:
        'Earn {{points}} reward points when you follow us on Pinterest.',
      rewardText:
        'Earned {{points}} reward points by following us on Pinterest.',
    },
    21: {
      points: 'points',
      language: 'facebook_share',
      panel_msg: 'panel_msg',
      display_notification: 'display_notification',
      username: 'facebook_share_link',
      campNameAndPlace: 'Facebook share',
      desValue: 'Earn {{points}} reward points when you share us on Facebook.',
      rewardText:
        'You earned {{points}} reward points for sharing us on Facebook.',
    },
    22: {
      points: 'points',
      language: 'facebook_share_on_thank_you',
      panel_msg: 'panel_msg',
      display_notification: 'display_notification',
      activityOfferType: 'activityOfferType',
      popupImage: 'popup_banner_image',
      campNameAndPlace: 'Facebook share on thank you',
      desValue:
        'Earn {{points}} reward points when you share thank you page on Facebook.',
      rewardText:
        'Earned {{points}} reward points when you share thank you page on Facebook.',
    },
  };

  const handleActivityUpdate = async (value) => {
    setLoading(true);
    value[obj[activityId].language] = value?.language;
    value[obj[activityId].points] =
      value?.activity_sub_type === 'freeproduct' ? '0' : value?.points;
    value[obj[activityId].panel_msg] = value?.panel_msg;
    value[obj[activityId].display_notification] = value?.display_notification;
    value.rule_id = activityId;

    if (activityId === '22') {
      value[obj[activityId].activityOfferType] = value?.activity_sub_type;
      value[obj[activityId].popupImage] = value?.popupImage;
      value.discount_amount_type =
        value?.activity_sub_type === 'discount'
          ? value?.discount_amount_type
          : rowData?.discount_type;

      value.discount_amount =
        value?.activity_sub_type === 'discount' ? value?.discount_amount : '0';

      delete value.activity_sub_type;
      delete value.popupImage;
    }

    if (activityId !== '22') {
      value[obj[activityId].username] = value?.username;
    }

    if (activityId !== '21') {
      delete value.language;
    }

    if (activityId !== '21' && activityId !== '22') {
      delete value.display_notification;
      delete value.panel_msg;
      delete value.points;
    }
    delete value.username;

    const formData = new FormData();
    for (const key in value) {
      if (value[key] !== undefined) {
        formData.append(key, value[key]);
      }
    }
    try {
      const response = rowData.hasOwnProperty('id')
        ? await updateActivitiesService(formData)
        : await saveActivitiesService(formData);
      if (response?.status === 'success') {
        let updatedFields = {
          status: rowData.hasOwnProperty('id') ? rowData?.status : '1',
          points:
            value[obj[activityId].points] === undefined
              ? rowData?.points
              : value[obj[activityId].points] || 0,
        };
        const updated = updateActivityData(
          activitiesData,
          activityId,
          updatedFields
        );
        dispatch(addEarnPointsListData(updated));
        notification.success({
          message: 'Activity updated successfully',
        });
        setIsModalOpen(false);
      } else {
        notification.success({
          message: response?.msg,
        });
      }
    } catch (error) {
      logger(error);
      notification.error({
        message: error?.response?.msg,
      });
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (rowData !== null) {
      let initalValObj = {
        points: rowData.insta_points || rowData?.points || '',
        language: rowData?.language || obj[activityId]?.campNameAndPlace || '',
        panel_msg: rowData?.panel_msg || obj[activityId]?.desValue || '',
        display_notification:
          rowData?.display_notification || obj[activityId]?.rewardText || '',
        username:
          rowData?.username ||
          rowData?.facebook_share_link ||
          parseFloat(activityId) === 21
            ? jwtState?.login_auth?.domain
            : '',
        activity_sub_type: rowData?.activity_sub_type || 'givepoints',
        productId: rowData?.free_product_ids
          ? JSON.parse(rowData?.free_product_ids)?.productId
          : '',
        variantId: rowData?.free_product_ids
          ? JSON.parse(rowData?.free_product_ids)?.variantId
          : '',
        discount_amount_type: rowData?.discount_type || 'flat',
        popupImage: rowData?.banner_image,
        discount_amount: rowData?.discount_amount || '',
      };

      form.setFieldsValue(initalValObj);

      setSelectedType(rowData?.activity_sub_type || 'givepoints');
    }
  }, [rowData]);

  return (
    <>
      <AitAlert
        type="warning"
        justify="start"
        //hascustomicon={false}
        barfontsize="13"
        barpadding="8px 10px"
        alignicon="start"
        textAlign="left"
        icontopspacing="2"
        border
        borderradius
        showIcon
        color="var(--ant-color-text-default)"
        message="You can change text in different languages."
        style={{ marginBottom: 24 }}
      />
      {activityId === '22' && (
        <AitAlert
          type="info"
          barfontsize="13"
          barpadding="8px 10px"
          justify="start"
          bgcolor="#f8f8f8"
          border={false}
          borderradius
          hidedefaulticon
          message={
            <>
              <Button
                type="link"
                style={{ padding: '0px ', fontSize: '12px' }}
                onClick={() =>
                  window.open(
                    'https://docs.aitrillion.com/portal/en/kb/articles/add-a-thank-you-widget-to-share-on-facebook#Introduction',
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                Click here
              </Button>{' '}
              to set up Facebook sharing on the Thank You page.
            </>
          }
          style={{ marginBottom: 24 }}
        />
      )}
      <Form form={form} layout="vertical" onFinish={handleActivityUpdate}>
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12}>
            {activityId === '22' ? (
              <>
                <Form.Item
                  label="Earning type"
                  name="activity_sub_type"
                  // rules={[{ required: true ,message:'Please enter '}]}
                >
                  <Radio.Group
                    value={selectedType}
                    onChange={handleRadioChange}
                  >
                    <StyledRadio value="givepoints">
                      <span>Points</span>
                    </StyledRadio>

                    <StyledRadio value="discount">
                      <span>
                        Discount code
                        {/* (
                        {getCurrencyByMoneyFormat(
                          jwtState?.login_auth?.money_format
                        )}
                        %) */}
                      </span>
                    </StyledRadio>

                    <StyledRadio value="freeproduct">
                      <span>Free product</span>
                    </StyledRadio>
                  </Radio.Group>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="points"
                  rules={[{ required: true, message: 'Please enter points' }]}
                  label="Points awarded"
                >
                  <AitInputBox placeholder="20" />
                </Form.Item>
              </>
            )}
          </Col>
          <Col xs={24} sm={12} md={12} lg={12}>
            {activityId === '22' ? (
              <div>
                {selectedType !== 'freeproduct' && (
                  <Label level={5}>Earning value</Label>
                )}

                <Row gutter={[24, 24]}>
                  {selectedType === 'givepoints' ? (
                    <>
                      {' '}
                      <Col xs={24}>
                        <Form.Item
                          name="points"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter earning value',
                            },
                            {
                              validator: (_, value) => {
                                if (!value) return Promise.resolve();

                                if (Number(value) <= 0) {
                                  return Promise.reject(
                                    'Earning value must be greater than 0'
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <AitInputBox
                            placeholder="1"
                            onKeyPress={enterOnlyNumericValue}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : selectedType === 'discount' ? (
                    <>
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                          name="discount_amount"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter discount amount',
                            },
                            {
                              validator: (_, value) => {
                                if (!value) return Promise.resolve();

                                if (Number(value) <= 0) {
                                  return Promise.reject(
                                    'Discount amount must be greater than 0'
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <AitInputBox
                            onKeyPress={enterOnlyNumericValue}
                            placeholder="1"
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={12} md={12} lg={12}>
                        <Form.Item
                          name="discount_amount_type"
                          rules={[
                            {
                              required: true,
                              message: 'Please select discount type',
                            },
                          ]}
                        >
                          <AitSelectBox
                            defaultValue={'flat'}
                            options={[
                              {
                                label: getCurrencyByMoneyFormat(
                                  jwtState?.login_auth?.money_format
                                ),
                                value: 'flat',
                              },
                              { label: '%', value: 'percentage' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : (
                    <>
                      <Col span={24}>
                        <Flex>
                          <Form.Item name="productId">
                            <AitInputBox
                              label="Product Id"
                              onKeyPress={enterOnlyNumericValue}
                              min={0}
                              placeholder="Product Id"
                            />
                          </Form.Item>
                          <div
                            style={{
                              minWidth: '40px',
                              textAlign: 'center',
                              marginBottom: '24px',
                              alignSelf: 'end',
                              height: '40px',
                              display: 'inline-flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <AitText>or</AitText>
                          </div>

                          <Form.Item name="variantId">
                            <AitInputBox
                              label="Variant Id"
                              onKeyPress={enterOnlyNumericValue}
                              min={0}
                              placeholder="Variant Id"
                            />
                          </Form.Item>
                        </Flex>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            ) : (
              <>
                <Form.Item
                  name="language"
                  rules={[
                    { required: true, message: 'Please enter campaign name' },
                  ]}
                >
                  <AitInputBox
                    label="Campaign name"
                    required={true}
                    labelIcon={<InfoCircleOutlined />}
                    tooltipText="The name as it will appear on your store."
                    placeholder={obj[activityId]?.campNameAndPlace}
                  />
                </Form.Item>
              </>
            )}
          </Col>
        </Row>
        {activityId === '22' && (
          <Row gutter={24}>
            {/* <Col xs={24} sm={12} md={12} lg={12}>
              <>
                <Label style={{ marginBottom: '10px' }}>
                  Campaign name
                  {
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#8090ad',
                        marginLeft: '5px',
                      }}
                    >
                      (The name as it will appear on your store.)
                    </span>
                  }
                </Label>
                <Form.Item name="language" rules={[{ required: true }]}>
                  <Input placeholder="Create an account" />
                </Form.Item>
              </>
            </Col> */}
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item name="display_notification">
                <AitInputBox
                  textArea
                  label="Reward text"
                  labelSubText="Your customers will see this when they receive points."
                  rows={3}
                  placeholder={obj[activityId]?.rewardText}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item name="panel_msg">
                <AitInputBox
                  textArea
                  label="Description"
                  labelSubText="Your customers will see this description on your store."
                  rows={3}
                  placeholder={obj[activityId]?.desValue}
                />
              </Form.Item>
            </Col>
          </Row>
        )}
        <Row gutter={24}>
          {activityId === '22' ? (
            <Col xs={24} sm={12} md={12} lg={12}>
              <>
                <Form.Item
                  name="language"
                  rules={[
                    { required: true, message: 'Please enter campaign name' },
                  ]}
                >
                  <AitInputBox
                    label="Campaign name"
                    required={true}
                    labelSubText=" The name as it will appear on your store."
                    placeholder={obj[activityId]?.campNameAndPlace}
                  />
                </Form.Item>
              </>
            </Col>
          ) : (
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item name="display_notification">
                <AitInputBox
                  textArea
                  label="Reward text"
                  labelSubText="Your customers will see this when they receive points."
                  rows={3}
                  placeholder={obj[activityId]?.rewardText}
                />
              </Form.Item>
            </Col>
          )}

          {activityId === '22' ? (
            <Col xs={24} sm={12} md={12} lg={12} style={{ marginTop: 2 }}>
              <>
                <Form.Item
                  name="popupImage"
                  rules={[{ validator: validateImageFile }]}
                >
                  <AitUpload
                    align="start"
                    label="Popup banner image"
                    labelSubText="Image size should be 450 X 250"
                    initalValue={rowData?.banner_image || ''}
                    onImageChange={(e) =>
                      form.setFieldsValue({
                        popupImage: e,
                      })
                    }
                    // style={{ width: '150px', height: 40 }}
                  />
                </Form.Item>
              </>
            </Col>
          ) : (
            <Col xs={24} sm={12} md={12} lg={12}>
              <Form.Item name="panel_msg">
                <AitInputBox
                  textArea
                  label="Description"
                  labelSubText="Your customers will see this description on your store."
                  rows={3}
                  placeholder={obj[activityId]?.desValue}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        {activityId !== '22' && (
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please enter username' }]}
                >
                  <AitInputBox
                    label={activityTypeObj[activityId]?.name}
                    rows={3}
                    placeholder={activityTypeObj[activityId]?.placeholder}
                  />
                </Form.Item>
              </>
            </Col>
          </Row>
        )}
        <Row gutter={[12, 12]} justify={'center'}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={rowData.hasOwnProperty('id') ? 'Update' : 'Save'}
              htmlType="submit"
              disabled={loading}
              loading={loading}
              block
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              title="Cancel"
              variant="filled"
              color="default"
              onClick={handleCancel}
              disabled={loading}
              block
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default SocialEngagementsForm;
