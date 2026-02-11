import AitButton from '@/components/atoms/ait-button/aitButton';
import { enterOnlyNumericValue, validateImageFile } from '@/utils/common.util';
import { App, Col, Form, Row, Spin, Switch, Tooltip } from 'antd';
import { Label } from '../style';
import {
  InfoCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import AitUpload from '@/components/atoms/ait-upload';
import logger from '@/utils/logger';
import { getProductByIdService } from '../../../api/redeemPoints';
import { useEffect, useState } from 'react';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import AitSwitch from '@/components/atoms/ait-switch/aitSwitch';

function FreeProductForm({
  handleCancel,
  rowData,
  handleSubmit,
  isEdit = true,
  formLoading,
  setFormLoading,
}) {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState();
  const [showPOS, setShowPOS] = useState(true);
  const [productLoading, setProductLoading] = useState(false);
  const [callSubmitApi, setCallSubmitApi] = useState(false);
  const [valuesState, setValueState] = useState();

  const getProductById = async (type) => {
    setProductLoading(true);
    try {
      let payload = {
        id: productId,
      };
      const response = await getProductByIdService(payload);
      if (response?.data?.msg === 'success') {
        setProductData(response?.data);
        form.setFieldValue(
          'product_title',
          response?.data?.product_info?.title
        );
        if (type === 'submitApi') {
          setCallSubmitApi(true);
        }
      } else {
        notification.error({
          message: response?.data?.notification,
        });
        setProductLoading(false);
      }
    } catch (error) {
      logger(error.response.msg);
    } finally {
      setProductLoading(false);
      setFormLoading(false);
    }
  };

  const onFinish = (values) => {
    setFormLoading(true);
    if (!productData?.product_info?.title && !rowData?.product_title) {
      getProductById('submitApi');
    } else {
      setCallSubmitApi(true);
    }

    values.reward_id = rowData?.reward_id || rowData?.id;
    values.show_in_pos_four = values?.show_in_pos_four === true ? '1' : '0';
    if (isEdit) {
      values.reward_setting_id = rowData?.id;
    } else {
      values.shop_reward_points = rowData?.points;
    }

    setValueState({ ...values });
  };

  useEffect(() => {
    if (
      (productData?.product_info?.title || rowData?.product_title) &&
      callSubmitApi
    ) {
      valuesState.product_title =
        productData?.product_info?.title || rowData?.product_title;

      handleSubmit({ ...valuesState });
      setCallSubmitApi(false);
    }
  }, [callSubmitApi]);

  useEffect(() => {
    if (rowData && rowData !== null) {
      setShowPOS(parseFloat(rowData?.show_in_pos) > 0 ? true : false);

      const formValues = {
        product_id: rowData?.product_id || '',
        product_title: rowData?.product_title || '',
        points_to_claim: rowData?.points_to_claim || '',
        reward_heading: rowData?.language || 'Free Product(voucher)',
        heading_bottom_statement:
          rowData?.bottom_statement || 'Redeem {{POINTS}} points',
        show_in_pos_four: parseFloat(rowData?.show_in_pos) > 0 ? true : false,
        file: rowData?.reward_image || '',
        discount_amount:
          parseFloat(rowData?.discount_amount?.replace(/[^0-9.-]+/g, '')) || '',
      };

      form.setFieldsValue(formValues);
    }
  }, [rowData]);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
        onFinish={onFinish}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="product_id"
              rules={[{ required: true, message: 'Please enter product ID' }]}
            >
              <AitInputBox
                required
                search
                onSearch={() => getProductById()}
                label="Product ID"
                value={productId}
                placeholder="Enter product ID"
                onChange={(e) => setProductId(e.target.value)}
                // addonAfter={
                //   productLoading ? (
                //     <Spin indicator={<LoadingOutlined spin />} />
                //   ) : (
                //     <SearchOutlined
                //       onClick={() => getProductById()}
                //       loading={true}
                //     />
                //   )
                // }
                loading={productLoading}
                disabled={isEdit}
                onKeyPress={enterOnlyNumericValue}
              />

              {/* {productData &&
                parse(checkValidData(productData?.notification) || '')} */}
            </Form.Item>
            {/* <span
              type="link"
              style={{
                marginLeft: '5px',
                padding: '0px',
                display: 'flex',
                // marginTop: '2px',
                color: 'var(--ant-color-primary)',
                cursor: 'pointer',
              }}
              onClick={() => window.open('', '_blank', 'noopener,noreferrer')}
            >
              View Product
              <span style={{ marginTop: '4px', marginLeft: '4px' }}>
                <ReadMoreIcon />
              </span>
            </span> */}
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="product_title"
              rules={[
                { required: true, message: 'Please enter product title' },
              ]}
            >
              <AitInputBox
                required
                label="Product title"
                placeholder="Product title"
                value={productData?.product_info?.title || ''}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="points_to_claim"
              rules={[
                { required: true, message: 'Please enter points to claim' },
                {
                  validator: (_, value) => {
                    if (value === undefined || value === null || value === '') {
                      return Promise.resolve();
                    }

                    if (value <= 0) {
                      return Promise.reject(
                        new Error(
                          "Points to claim can't be zero or less than zero"
                        )
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <AitInputBox
                required
                label="Points to claim"
                placeholder="100"
                onKeyPress={enterOnlyNumericValue}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="reward_heading"
              // rules={[
              //   { required: true, message: 'Please enter reward title!' },
              // ]}
            >
              <AitInputBox
                label="Reward title"
                // required
                placeholder="Free Product(voucher)"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="heading_bottom_statement"
              // rules={[{ required: true, message: 'Please enter reward text!' }]}
            >
              <AitInputBox
                label="Reward text"
                // required
                rows={3}
                placeholder="Redeem {{POINTS}} points"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              //   label=""
              name="show_in_pos_four"
              valuePropName="checked"
            >
              <AitSwitch
                label="Show in POS"
                wrap="wrap"
                align="start"
                gap={6}
                lableTooltip="Enabling this setting makes the reward visible in Shopify POS"
                onChange={(checked) => setShowPOS(checked)}
                vertical={true}
                checked={showPOS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12}>
            <>
              <Label style={{ marginBottom: '10px' }}>Product image</Label>

              <Form.Item name="file" rules={[{ validator: validateImageFile }]}>
                <AitUpload
                  showImage
                  initalValue={rowData?.product_img}
                  onImageChange={(e) =>
                    form.setFieldsValue({
                      file: e,
                    })
                  }
                />
              </Form.Item>
            </>
          </Col>
          {isEdit && (
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item label="Discount (%)" name="discount_amount">
                <AitInputBox disabled />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={[12, 12]} justify={'center'}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={isEdit ? 'Update' : 'Save'}
              htmlType="submit"
              disabled={formLoading}
              loading={formLoading}
              block
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              title="Cancel"
              variant="filled"
              color="default"
              onClick={handleCancel}
              disabled={formLoading}
              block
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default FreeProductForm;
