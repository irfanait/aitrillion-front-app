/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import AitPageHeader from '@/components/molecules/ait-page-header/aitPageHeader';
import {
  AlertBox,
  HelperText,
  Label,
  TextContainer,
  TierIconStyle,
} from './style';
import AitCard from '@/components/atoms/ait-card/aitCard';
import {
  App,
  Col,
  Collapse,
  ColorPicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import AitUpload from '@/components/atoms/ait-upload';
import {
  ArrowLeftOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import TextEditor from '@/components/atoms/ait-text-editer';
import {
  convertToFormDataCustom,
  enterOnlyNumericValue,
  validateImageFile,
} from '@/utils/common.util';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import AitButton from '@/components/atoms/ait-button/aitButton';
import {
  saveTierRemoteService,
  updateTierRemoteService,
} from '../../api/vipProgram';
import logger from '@/utils/logger';
import { ModalAlertIcon } from '../../svg-icons';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitCollapse from '@/components/molecules/ait-collapse/aitCollapse';
import AitAlert from '@/components/atoms/ait-alert/aitAlert';

const { Panel } = Collapse;

const { Text, Title } = Typography;

function CreateTierTamplate({
  form,
  vipProgramData,
  getVipProgramData,
  setTierCreateModal,
  rowData,
  setDefualtLogo,
  defaultlogo,
  onCancel,
  setRowData,
  state,
  setState,
}) {
  const router = useRouter();
  const { notification } = App.useApp();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  // const [state, setState] = useState({
  //   customerpointearn: '',
  //   customer_bonus: '',
  //   customer_bithday: '',
  //   enable_tier_additional_benifits: false,
  //   hide_point_graph: false,
  //   hide_point_bar: false,
  //   tierdescription: '',
  //   customer_tag,
  // });

  // const handleNavigate = () => {
  //   router.push(moduleRoute?.loyalty_rewards?.vip_program);
  // };

  function rgbToHex(r, g, b) {
    return (
      '#' +
      r.toString(16).padStart(2, '0') +
      g.toString(16).padStart(2, '0') +
      b.toString(16).padStart(2, '0')
    );
  }

  const onSubmitTier = async (values) => {
    setLoading(true);
    let hexColor = '';
    if (form.getFieldValue('tier_color')?.metaColor) {
      const { r, g, b } = form.getFieldValue('tier_color')?.metaColor;
      hexColor = rgbToHex(r, g, b);
    } else {
      hexColor = form.getFieldValue('tier_color');
    }

    try {
      values.tier_color = hexColor;
      values.tierlogo = form.getFieldValue('tierlogo');
      values.tierdescription = form.getFieldValue('tierdescription');
      values.tier_email_cont = form.getFieldValue('tier_email_cont');
      values.enable_tier_additional_benifits =
        values?.enable_tier_additional_benifits === true
          ? '1'
          : values?.enable_tier_additional_benifits === false
            ? '0'
            : form.getFieldValue('enable_tier_additional_benifits') === true
              ? '1'
              : '0';
      values.hide_point_bar =
        values?.hide_point_bar === true
          ? '1'
          : values?.hide_point_bar === true
            ? '0'
            : form.getFieldValue('hide_point_bar') === true
              ? '1'
              : '0';
      values.hide_point_graph =
        values?.hide_point_graph === true
          ? '1'
          : values?.hide_point_graph === true
            ? '0'
            : form.getFieldValue('hide_point_graph') === true
              ? '1'
              : '0';
      values.tieremailenable =
        values?.tieremailenable === true
          ? '1'
          : values?.tieremailenable === true
            ? '0'
            : form.getFieldValue('tieremailenable') === true
              ? '1'
              : '0';
      values.pointlimit =
        vipProgramData?.lyt_milestone_setting?.milestone_type === 'tag_based'
          ? rowData?.id
            ? rowData?.auto_upgrade
            : vipProgramData?.new_tier_level_for_tag_base
          : values?.pointlimit;
      values.tierAchievedDescription = '';
      values.customer_bithday = form.getFieldValue('customer_bithday');
      values.customer_bonus = form.getFieldValue('customer_bonus');
      values.customerpointearn = state?.customerpointearn;

      if (!values.tierlogo && defaultlogo === '') {
        notification.error({
          message: 'Please upload tier logo or select a default logo.',
        });
        return;
      }

      if (defaultlogo !== '') {
        values.defaultlogo = defaultlogo;
      }

      if (rowData?.id) {
        values.id = rowData?.id;
      }

      let payload = convertToFormDataCustom(values);

      const response = rowData?.id
        ? await updateTierRemoteService(payload)
        : await saveTierRemoteService(payload);

      if (response?.data?.status === 'success') {
        notification.success({
          message: response?.data?.msg,
        });
        setTierCreateModal(false);
        getVipProgramData();
      } else {
        notification.error({
          message: response?.data?.msg,
        });
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (rowData?.id && rowData !== undefined) {
      const formValues = {
        tiername: rowData?.tier_name || '',
        tierdescription: rowData?.tier_description || undefined,
        pointlimit: rowData?.auto_upgrade || '',
        tier_color: rowData?.tier_color || '#FFFFFF',
        tierlogo: rowData?.tier_logo || '',
        customerpointearn: rowData?.customer_point || '',
        customer_tag: rowData?.customer_tag || '',
        customer_bonus: rowData?.customer_bonus || '',
        minimum_cart_amt_text: rowData?.minimum_cart_amt_text || '',
        customer_bithday: rowData?.birthday_point || '',
        tiernameemail: rowData?.tier_email_sub || '',
        enable_tier_additional_benifits:
          parseFloat(rowData?.enable_tier_additional_benifits) > 0
            ? true
            : false,
        hide_point_graph:
          parseFloat(rowData?.hide_point_graph) > 0 ? true : false,
        hide_point_bar: parseFloat(rowData?.hide_point_bar) > 0 ? true : false,
      };

      setState({
        ...state,
        customer_bonus: rowData?.customer_bonus || '',
        customer_bithday: rowData?.birthday_point || '',
        customerpointearn: rowData?.customer_point || '',
        customer_tag: rowData?.customer_tag || '',
        enable_tier_additional_benifits:
          parseFloat(rowData?.enable_tier_additional_benifits) > 0
            ? true
            : false || true,
        hide_point_graph:
          parseFloat(rowData?.hide_point_graph) > 0 ? true : false,
        hide_point_bar: parseFloat(rowData?.hide_point_bar) > 0 ? true : false,
        tierdescription: rowData?.tier_description || undefined,
      });

      form.setFieldsValue(formValues);
    } else if (
      vipProgramData?.lyt_milestone_setting?.milestone_type === 'tag_based'
    ) {
      const formValues = {
        pointlimit: vipProgramData?.new_tier_level_for_tag_base,
      };
      form.setFieldsValue(formValues);
    }
  }, [rowData]);

  console.log('IMAGE FORMAT', process.env.NEXT_PUBLIC_IMAGE_FORMAT);

  return (
    <>
      {/* <AitPageHeader
        title="Create new tier"
        subtitle="Increase your average customer lifetime value with a tier-based program."
        buttonLabel="Back"
        hideButton
        buttonIcon={<ArrowLeftOutlined />}
        onButtonClick={handleNavigate} */}
      {/* /> */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmitTier}
        initialValues={{
          enable_tier_additional_benifits:
            parseFloat(rowData?.enable_tier_additional_benifits) > 0
              ? true
              : false,
          hide_point_graph:
            parseFloat(rowData?.hide_point_graph) > 0 ? true : false,
          hide_point_bar:
            parseFloat(rowData?.hide_point_bar) > 0 ? true : false,
        }}
      >
        <AitCard title={'Display'}>
          <Row gutter={24}>
            {' '}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="tiername"
                rules={[{ required: true, message: 'Please enter tier name' }]}
              >
                <AitInputBox
                  required
                  label="Tier name"
                  placeholder="Tier name"
                  labelSubText="This is the name of the tier that is visible to your customers"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Label>Tier description</Label>
              <Form.Item
                name="tierdescription"
                rules={
                  state?.tierdescription === undefined
                    ? [
                        {
                          required: true,
                          message: 'Please enter tier description',
                        },
                      ]
                    : []
                }
              >
                <TextEditor
                  initialValue={
                    state?.tierdescription === ''
                      ? false
                      : state?.tierdescription
                  }
                  onChangeValue={(value) => {
                    setState({
                      ...state,
                      tierdescription: value,
                    });

                    form.setFieldValue('tierdescription', value);
                  }}
                  style={{ position: 'relative', zIndex: 0 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            {' '}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="pointlimit"
                rules={
                  vipProgramData?.lyt_milestone_setting?.milestone_type !==
                  'tag_based'
                    ? [
                        {
                          required: true,
                          message: 'This field is requierd',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const minValue =
                              vipProgramData?.new_tier_level_for_tag_base;

                            if (!value) {
                              return Promise.resolve(); // ignore empty, handled by 'required'
                            }

                            if (value < minValue && !rowData?.id) {
                              return Promise.reject(
                                new Error(
                                  `Value must be greater than the last tier milestone value ${minValue}`
                                )
                              );
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]
                    : []
                }
              >
                <AitInputBox
                  label={
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                    'points'
                      ? ' Milestone to achieve this tier'
                      : vipProgramData?.lyt_milestone_setting
                            ?.milestone_type === 'amount'
                        ? 'Spent to achieve this tier'
                        : 'Tier Level'
                  }
                  placeholder="1000"
                  onKeyPress={enterOnlyNumericValue}
                  readOnly={
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                    'tag_based'
                  }
                  required={
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                    'amount'
                  }
                  disabled={
                    vipProgramData?.lyt_milestone_setting?.milestone_type ===
                      'tag_based' ||
                    parseFloat(rowData?.total_customers_count) > 0
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Label>
                Tier color{' '}
                <Tooltip placement="right" title="(Use color code without #)">
                  <InfoCircleOutlined
                    style={{
                      marginLeft: '2px',
                      position: 'relative',
                      //   top: '1px',
                    }}
                  />
                </Tooltip>
              </Label>
              <Form.Item name="tier_color">
                <ColorPicker defaultValue="#FFFFFF" size="large" showText />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            {' '}
            <Col xs={24} sm={24}>
              <Label>
                Tier icon{' '}
                <Tooltip
                  placement="right"
                  title="1MB file size limit, recommended dimension are 300X300 px"
                >
                  <InfoCircleOutlined
                    style={{
                      marginLeft: '2px',
                      position: 'relative',
                      //   top: '1px',
                    }}
                  />
                </Tooltip>
              </Label>
              <HelperText>Upload your own icon</HelperText>
              <Form.Item
                name="tierlogo"
                style={{ marginBottom: 20 }}
                rules={[{ validator: validateImageFile }]}
              >
                <AitUpload
                  onImageChange={(e) =>
                    form.setFieldsValue({
                      tierlogo: e,
                    })
                  }
                  // showImage={false}
                  imageStyle={{
                    width: '46px',
                    height: '46px',
                    padding: 3,
                    boxShadow: '0px 0px 3px #576f7c30',
                    border: '1px solid #fff',
                    borderRadius: 4,
                  }}
                  extraStyle={{
                    // height: '40px',
                    left: '12px',
                    bottom: '5px',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Text strong style={{ paddingLeft: 50 }}>
            Or
          </Text>
          <Row gutter={24} style={{ marginTop: 10 }}>
            {' '}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Label>Choose an exisiting icon</Label>
              <Form.Item style={{ marginBottom: 0 }}>
                <Flex>
                  <Space size="middle">
                    {rowData?.id && rowData?.tier_logo !== '' && (
                      <TierIconStyle>
                        <img
                          src={`https://aitrillion-app-data-dev1.s3.amazonaws.com/${rowData?.tier_logo}`}
                          alt="icon"
                        />
                      </TierIconStyle>
                    )}
                    <TierIconStyle>
                      <img
                        onClick={() =>
                          setDefualtLogo('assets/loyalty/images/bronze.svg')
                        }
                        src="https://aitrillion-app-data-dev1.s3.amazonaws.com/assets/loyalty/images/bronze.svg?v=1.6"
                        alt="icon"
                        style={{
                          borderColor:
                            defaultlogo === 'assets/loyalty/images/bronze.svg'
                              ? 'var(--ant-color-primary)'
                              : '#fff',
                        }}
                      />
                    </TierIconStyle>
                    <TierIconStyle>
                      <img
                        onClick={() =>
                          setDefualtLogo('assets/loyalty/images/silver.svg')
                        }
                        src="https://aitrillion-app-data-dev1.s3.amazonaws.com/assets/loyalty/images/silver.svg?v=1.6"
                        alt="icon"
                        style={{
                          borderColor:
                            defaultlogo === 'assets/loyalty/images/silver.svg'
                              ? 'var(--ant-color-primary)'
                              : '#fff',
                        }}
                      />
                    </TierIconStyle>
                    <TierIconStyle>
                      <img
                        onClick={() =>
                          setDefualtLogo('assets/loyalty/images/gold.svg')
                        }
                        src="https://aitrillion-app-data-dev1.s3.amazonaws.com/assets/loyalty/images/gold.svg?v=1.6"
                        alt="icon"
                        style={{
                          borderColor:
                            defaultlogo === 'assets/loyalty/images/gold.svg'
                              ? 'var(--ant-color-primary)'
                              : '#fff',
                        }}
                      />
                    </TierIconStyle>
                  </Space>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
        </AitCard>

        <AitCard
          margintop="24px"
          bodypadding={{
            xs: '20px 24px 0px 20px',
            sm: '20px 24px 0px 20px',
            md: '24px 24px 0px 24px',
          }}
          title={'Tier settings'}
        >
          <Row gutter={24}>
            {' '}
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="customerpointearn"
                label="Set earning ratio"
                valuePropName="customerpointearn"
                // rules={[{ required: true, message: 'This field is required' }]}
                tooltip={{
                  title:
                    'You can choose to give more points to your VIP customers.',
                  icon: <InfoCircleOutlined />,
                  placement: 'top',
                }}
                rules={[
                  // { required: true, message: 'Please input points to claim' },
                  {
                    validator: (_, value) => {
                      if (
                        state?.customerpointearn === undefined ||
                        state?.customerpointearn === ''
                      ) {
                        return Promise.resolve();
                      }
                      if (
                        isNaN(state?.customerpointearn) ||
                        Number(state?.customerpointearn) <= 0
                      ) {
                        return Promise.reject(
                          'Earning ratio must be greater than 0'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Flex gap={20} align="center">
                  <Text>1 Point =</Text>
                  <div style={{ flex: '1 1 auto' }}>
                    <AitInputBox
                      value={state?.customerpointearn}
                      onChange={(e) => {
                        setState({
                          ...state,
                          customerpointearn: e?.target?.value,
                        });
                      }}
                      placeholder="1.5"
                      onKeyPress={enterOnlyNumericValue}
                      addonAfter="Point"
                    />
                  </div>
                </Flex>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                name="customer_tag"
                label="Add tag"
                rules={[{ required: true, message: 'This field is requierd' }]}
                tooltip={{
                  title:
                    'A new customer with this tag will be automatically assigned to this tier.',
                  icon: <InfoCircleOutlined />,
                  placement: 'top',
                }}
              >
                <AitInputBox
                  required
                  placeholder="Gold"
                  value={state?.customer_tag}
                  onChange={(e) => {
                    setState({
                      ...state,
                      customer_tag: e?.target?.value,
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </AitCard>
        <AitCollapse
          style={{
            marginTop: 24,
            marginBottom: 24,
            border: '1px solid #f0f0f0',
          }}
          bordered={false}
          colorBgContainer="transparent"
          itemSpacing="0px"
          firstItemTopspacing="0px"
          firstItemBottomspacing="0px"
          headerLeftRightTopSpacing="0px"
          itemHeaderPadding={{
            xs: '15px 20px',
            sm: '15px 20px',
            md: '15px 24px',
          }}
          collapseIconTopSpacing="0px"
          collapseIconBotSpacing="0px"
          borderTop="none"
          borderBottom="none"
          firstitemtopborder="none"
          itemBodyPadding={{ xs: '20px', sm: '20px', md: '24px' }}
          headericonalign="center"
          expandIcon={<DownOutlined />}
          panels={[
            {
              title: 'Additional benefits',
              key: '1',
              children: (
                <>
                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="customer_bonus"
                        // rules={[
                        //   { required: true, message: 'This field is required' },
                        // ]}
                      >
                        <AitInputBox
                          label="One-time bonus points"
                          labelSubText="Give additional points on achieving this tier."
                          // required
                          onKeyPress={enterOnlyNumericValue}
                          style={{ width: '100%' }}
                          placeholder="0"
                          onChange={(e) =>
                            setState({
                              ...state,
                              customer_bonus: e?.target?.value,
                            })
                          }
                          value={state?.customer_bonus}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Form.Item
                        name="customer_bithday"
                        // rules={[
                        //   { required: true, message: 'This field is required' },
                        // ]}
                      >
                        <AitInputBox
                          // required
                          placeholder="0"
                          label="Birthday points"
                          labelSubText="Offer additional points on your customer's birthday."
                          onKeyPress={enterOnlyNumericValue}
                          style={{ width: '100%' }}
                          onChange={(e) =>
                            setState({
                              ...state,
                              customer_bithday: e?.target?.value,
                            })
                          }
                          value={state?.customer_bithday}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Label>
                        Showcase the advantages of tier benefits on the store
                        front
                      </Label>
                      <HelperText>
                        If tier benefits visibility are disabled, customers
                        won't be able to see them, but they will still receive
                        those benefits.
                      </HelperText>
                      <Form.Item name="enable_tier_additional_benifits">
                        <Switch
                          onChange={(checked) =>
                            setState({
                              ...state,
                              enable_tier_additional_benifits: checked,
                            })
                          }
                          checked={state?.enable_tier_additional_benifits}
                        />
                      </Form.Item>
                    </Col>
                    {vipProgramData?.lyt_milestone_setting?.milestone_type !==
                      'tag_based' && (
                      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                          label="Hide next tier needed points graph"
                          name="hide_point_graph"
                        >
                          <Switch
                            onChange={(checked) =>
                              setState({
                                ...state,
                                hide_point_graph: checked,
                              })
                            }
                            checked={state?.hide_point_graph}
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                  {vipProgramData?.lyt_milestone_setting?.milestone_type !==
                    'tag_based' && (
                    <Form.Item
                      label="Hide next tier needed points bar"
                      name="hide_point_bar"
                    >
                      <Switch
                        onChange={(checked) =>
                          setState({
                            ...state,
                            hide_point_bar: checked,
                          })
                        }
                        checked={state?.hide_point_bar}
                      />
                    </Form.Item>
                  )}
                </>
              ),
            },
          ]}
        ></AitCollapse>

        {vipProgramData?.lyt_milestone_setting?.is_prev_tier === '1' && (
          <AitCard
            style={{
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              marginBottom: 15,
            }}
            title={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 500 }}>Email notification</span>
                <Form.Item name="tieremailenable">
                  <Switch checked={enabled} onChange={setEnabled} />
                </Form.Item>
              </div>
            }
          >
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
              message="This email will get triggered automatically when the customer upgrades/downgrades to this tier. So keep the email content accordingly."
              style={{ marginBottom: 12 }}
            />
            <Text type="secondary">
              Notify customers about their Tier upgrade via email.
            </Text>

            {enabled && (
              <>
                <Row style={{ marginTop: 10 }}>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Form.Item
                      // label="Subject"
                      name="tiernameemail"
                      rules={[
                        { required: true, message: 'This field is requierd' },
                      ]}
                    >
                      <AitInputBox
                        label="Subject"
                        required
                        placeholder="Tier name"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Label>Email body </Label>
                    <Form.Item name="tier_email_cont">
                      <TextEditor
                        initialValue={decodeURIComponent(
                          rowData?.tier_email_cont
                        )}
                        onChangeValue={(value) =>
                          form.setFieldValue('tier_email_cont', value)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </AitCard>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <AitButton
            type="primary"
            title={rowData?.id ? 'Update' : 'Create'}
            htmlType="submit"
            disabled={loading}
            loading={loading}
          />
          {/* <AitButton
            title="Cancel"
            variant="filled"
            color="default"
            disabled={loading}
            onClick={() => {
              setDefualtLogo('');
              setState({
                customerpointearn: '',
                enable_tier_additional_benifits: false,
                hide_point_graph: false,
                hide_point_bar: false,
                customer_tag: '',
                tierdescription: '',
              });
              setRowData(undefined);
              setTierCreateModal(false);
              form.setFieldsValue({
                customer_bonus: '',
                customer_bithday: '',
                tiername: '',
                tierdescription: '',
                customerpointearn: '',
                customer_tag: '',
                tier_color: '#FFFFFF',
              });
            }}
          /> */}
          <AitButton
            title="Cancel"
            variant="filled"
            color="default"
            disabled={loading}
            onClick={() => {
              form.resetFields();

              setDefualtLogo('');

              setState({
                customerpointearn: '',
                enable_tier_additional_benifits: false,
                hide_point_graph: false,
                hide_point_bar: false,
                customer_tag: '',
                tierdescription: '',
                customer_bonus: '',
                customer_bithday: '',
              });

              setRowData(undefined);
              setTierCreateModal(false);
            }}
          />
        </div>
      </Form>
    </>
  );
}

export default CreateTierTamplate;
