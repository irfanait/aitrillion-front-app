import React, { useEffect, useRef, useState } from 'react';
import { List, Avatar, Spin, Typography, Flex } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getVisitedProductList } from '@/redux/apis/customers-api/customersApi';
import {
  StyleVisitedWrapper,
  StyleItemWrapper,
  StyleItemAvatar,
  StyleItemAvatarWarpper,
  StyleItemAvatarLine,
  StyleItemAvatarDot,
  StyleMetaWrapper,
} from './style';
import AitLink from '@/components/atoms/ait-link/aitLink';
import AitText from '@/components/atoms/ait-text/aitText';

const { Text } = Typography;
const { Item } = List;
const { Meta } = Item;

const CustomerDetailsVisitedProductTab = ({ customerId }) => {
  const dispatch = useDispatch();

  const { login_auth } = useSelector((s) => s.jwtState);
  const {
    visitedProducts,
    visitedProductsLoading,
    visitedProductsPage,
    visitedProductsTotalPages,
  } = useSelector((state) => state.customerDetailsState);

  const containerRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadMoreProducts(1);
  }, []);

  // LOAD NEXT PAGE FUNCTION
  const loadMoreProducts = async (page) => {
    if (loadingMore) return;
    if (visitedProductsTotalPages && page > visitedProductsTotalPages) return;

    setLoadingMore(true);

    await dispatch(
      getVisitedProductList({
        act: 'get_visited_product_list',
        key: customerId,
        currentPage: page,
        opencurrentPage: 1,
        shop_id: login_auth?.shop_id,
        shop_name: login_auth?.shop_name,
      })
    );
    setLoadingMore(false);
  };

  // INFINITE SCROLL HANDLER
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const reachedBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 100;

    if (reachedBottom && !loadingMore) {
      loadMoreProducts(visitedProductsPage + 1);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [visitedProducts, loadingMore]);

  return (
    <StyleVisitedWrapper ref={containerRef}>
      <List
        itemLayout="horizontal"
        dataSource={visitedProducts}
        renderItem={(item) => (
          <StyleItemWrapper>
            {/* IMAGE + TIMELINE DOT */}
            <StyleItemAvatarWarpper>
              <StyleItemAvatar size={50} src={item?.src} />
              {/* <StyleItemAvatarLine></StyleItemAvatarLine>
              <StyleItemAvatarDot></StyleItemAvatarDot> */}
            </StyleItemAvatarWarpper>

            {/* TEXTS */}
            <StyleMetaWrapper
              title={
                <AitLink
                  href={item?.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  weight={500}
                >
                  {item?.object_text}
                </AitLink>
              }
              description={
                <AitText type="secondary" size={13}>
                  {item?.visited_counts} times visited
                </AitText>
              }
            />

            {/* RIGHT SIDE DATE */}
            <AitText type="secondary" size={12} style={{ fontStyle: 'italic' }}>
              {item?.visited_date}
            </AitText>
          </StyleItemWrapper>
        )}
      />

      {/* LOADING SPINNER */}
      {(visitedProductsLoading || loadingMore) && (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <Spin />
        </div>
      )}

      {/* END MESSAGE */}
      {!visitedProductsLoading &&
        visitedProductsPage >= visitedProductsTotalPages && (
          <Flex justify="center">
            <AitText type="secondary" size={13}>
              No more products
            </AitText>
          </Flex>
        )}
    </StyleVisitedWrapper>
  );
};

export default CustomerDetailsVisitedProductTab;
