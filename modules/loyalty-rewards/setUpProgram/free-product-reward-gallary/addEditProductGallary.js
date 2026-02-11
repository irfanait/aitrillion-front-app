/* eslint-disable @next/next/no-img-element */
import AitButton from '@/components/atoms/ait-button/aitButton';
import AitUpload from '@/components/atoms/ait-upload';
import {
  convertToFormDataCustom,
  enterOnlyNumericValue,
  validateImageFile,
} from '@/utils/common.util';
import {
  LoadingOutlined,
  SearchOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { App, Col, Form, Input, Row, Spin, Switch } from 'antd';
import { getProductByIdService } from '../../api/redeemPoints';
import logger from '@/utils/logger';
import { useEffect, useState } from 'react';
import FullPageLoader from '@/components/atoms/ait-fullpage-loader';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import {
  addProductRewardService,
  editProductRewardService,
} from '../../api/freeProductRewardGallary';
import { IconWrapper, StyledCard, SubText, TextBlock, Title } from './style';
import { ReadMoreIcon } from '../../svg-icons';
import { useSelector } from 'react-redux';

function AddEditPrpductGallary({
  setModalState,
  getListData,
  editProductModal,
  setEditProductModal,
  setRowData,
  rowData,
}) {
  const jwtState = useSelector((state) => state);
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState();
  const [productLoading, setProductLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [productImg, setProductImg] = useState(false);
  const [callSubmitApi, setCallSubmitApi] = useState(false);
  const [valuesState, setValueState] = useState();
  const [showProductLink, setShowProductLink] = useState(false);

  console.log(
    'jwtState',
    `https://${jwtState?.jwtState?.login_auth?.shop_name}/products/${productData?.product_info?.title || rowData?.handle}`
  );

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
        setShowProductLink(true);
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

  const onHandleSubmit = async (value) => {
    try {
      let payload = convertToFormDataCustom(value);
      const response = editProductModal
        ? await editProductRewardService(payload)
        : await addProductRewardService(payload);
      if (response?.status === 'success') {
        notification.success({
          message: editProductModal
            ? 'Updated successfully'
            : response?.message,
        });
        setModalState(false);
        setEditProductModal(false);
        setRowData();
        getListData(1, 10, 'date_created', false);
      }
    } catch (error) {
      logger(error?.response);
    } finally {
      setFormLoading(false);
    }
  };

  const onFinish = async (values) => {
    setFormLoading(true);
    if (!productData?.product_info?.title && !rowData?.product_title) {
      getProductById('submitApi');
    } else {
      setCallSubmitApi(true);
    }
    values.reward_id = '4';
    values.shop_reward_points = '';
    if (editProductModal) {
      values.cost_to_redeem = '0';
      values.discount_amount = rowData?.discount_amount;
      values.reward_setting_id = rowData?.id;
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

      onHandleSubmit({ ...valuesState });
      setCallSubmitApi(false);
    }
  }, [callSubmitApi]);

  useEffect(() => {
    if (rowData?.id) {
      form.setFieldsValue({
        product_id: rowData?.product_id || '',
        product_title: rowData?.product_title || '',
        points_to_claim: rowData?.points_to_claim || '',
        heading_bottom_statement:
          rowData?.bottom_statement || 'Redeem {{POINTS}} points',
        reward_heading: rowData?.language || 'Free Product(voucher)',
        file: rowData?.reward_image,
        discount_amount: rowData?.discount_amount,
      });
      setProductId(rowData?.product_id);
    } else {
      form.setFieldsValue({
        heading_bottom_statement:
          rowData?.bottom_statement || 'Redeem {{POINTS}} points',
        reward_heading: rowData?.language || 'Free Product(voucher)',
      });
    }
  }, [rowData]);

  useEffect(() => {
    if (productId?.length === 0) {
      form.setFieldValue({
        product_id: '',
      });
      setShowProductLink(false);
    }
  }, [productId]);

  return (
    <>
      {editProductModal && (
        <StyledCard>
          <img
            src={`${process.env.NEXT_PUBLIC_APP_URL}/assets/loyalty/css/image/cr-free-product-voucher.png`}
            alt="icon"
            style={{ width: 60 }}
          />
          <TextBlock>
            <Title>Free product</Title>
            <SubText>A 100% discount off a specific product</SubText>
          </TextBlock>
        </StyledCard>
      )}
      <Form
        form={form}
        layout="vertical"
        initialValues={{}}
        onFinish={onFinish}
        style={{ marginTop: 10 }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="product_id"
              rules={[
                { required: true, message: 'Please enter the product ID' },
              ]}
              style={{ marginBottom: '10px' }}
            >
              <AitInputBox
                required
                search
                label="Product ID"
                value={productId}
                placeholder="Enter product ID"
                onChange={(e) => setProductId(e.target.value)}
                onSearch={() => getProductById()}
                loading={productLoading}
                onKeyPress={enterOnlyNumericValue}
                // addonAfter={<SearchOutlined onClick={() => getProductById()} />}
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

                disabled={editProductModal}
              />
            </Form.Item>
            {(editProductModal || showProductLink) && (
              <span
                type="link"
                style={{
                  marginLeft: '5px',
                  padding: '0px',
                  display: 'flex',
                  marginTop: '2px',
                  marginBottom: '20px',
                  color: 'var(--ant-color-primary)',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  window.open(
                    `https://${jwtState?.jwtState?.login_auth?.shop_name}/products/${productData?.product_info?.title || rowData?.handle}`,
                    '_blank',
                    'noopener,noreferrer'
                  )
                }
              >
                View Product
                <span
                  style={{
                    marginTop: '4px',
                    marginLeft: '4px',
                  }}
                >
                  <ReadMoreIcon />
                </span>
              </span>
            )}
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              label="Product title"
              name="product_title"
              rules={[
                { required: true, message: 'Please enter product title' },
              ]}
            >
              <AitInputBox
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
              ]}
            >
              <AitInputBox
                required
                label="Points to claim"
                placeholder="500"
                onKeyPress={enterOnlyNumericValue}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Form.Item
              name="reward_heading"
              // rules={[
              //   { required: true, message: 'Please enter reward heading!' },
              // ]}
            >
              <AitInputBox
                label="Reward heading"
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
              // rules={[
              //   {
              //     required: true,
              //     message: 'Please enter heading bottom statement!',
              //   },
              // ]}
            >
              <AitInputBox
                label="Heading's bottom statement"
                // required
                rows={3}
                placeholder="Redeem {{POINTS}} points"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            {editProductModal ? (
              <Form.Item name="discount_amount">
                <AitInputBox
                  label="Discount"
                  rows={3}
                  placeholder="Redeem {{POINTS}} points"
                  disabled={editProductModal}
                />
              </Form.Item>
            ) : (
              <Form.Item
                label="Product image"
                name="file"
                rules={[{ validator: validateImageFile }]}
              >
                <AitUpload
                  // showImage={productImg || rowData?.reward_image || false}
                  // showImage
                  initalValue={rowData?.reward_image || ''}
                  onImageChange={(e) => {
                    form.setFieldsValue({
                      file: e,
                    });
                    setProductImg(true);
                  }}
                />
              </Form.Item>
            )}
          </Col>
        </Row>

        {editProductModal && (
          <Row gutter={24}>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
              <Form.Item
                label="Product image"
                name="file"
                rules={[{ validator: validateImageFile }]}
              >
                <AitUpload
                  //  showImage={productImg || rowData?.reward_image || false}
                  // showImage={false}
                  initalValue={rowData?.reward_image || ''}
                  onImageChange={(e) => {
                    form.setFieldsValue({
                      file: e,
                    });
                    setProductImg(true);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={[12, 12]} justify={'center'}>
          <Col xs={24} sm={8} md={6}>
            <AitButton
              type="primary"
              title={editProductModal ? 'Update' : 'Save'}
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
              onClick={() => {
                setModalState(false);
                setEditProductModal(false);
                setRowData();
              }}
              disabled={formLoading}
              block
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default AddEditPrpductGallary;
