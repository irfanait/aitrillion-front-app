import React, { useEffect, useMemo, useState } from 'react';
import { App, List, Space } from 'antd';
import { SearchOutlined, InboxOutlined } from '@ant-design/icons';
import { AitModal } from '@/components/molecules/ait-modal/aitModal';
import { faToAntIcon } from '@/modules/customers/utils/segmentListIconMapper';
import {
  DeleteIcon,
  DescBox,
  IconBox,
  Item,
  ListWrap,
  SearchInput,
  TitleBox,
} from './style';
import AitConfirmationModal from '@/components/molecules/ait-confirmation-modal/aitConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSegmentApi } from '@/redux/apis/customers-api/customersApi';
import { deleteSegmentResetCustomerList } from '@/redux/customers-slice/all-customers-slices/all-customers-slice';

const MoreSegmentModal = ({
  visible,
  setVisible,
  overflow = [],
  handleSelectSegmentChip,
  selected,
  allSegments = [],
}) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const allCustomerState = useSelector((state) => state.allCustomersState);

  const { deleteSegmentApiState, deleteSegmentMessage, deleteSegmentLoading } =
    allCustomerState;

  const [search, setSearch] = useState('');
  const [deleteSegmentModalVisible, setDeleteSegmentModalVisible] =
    useState(false);
  const [selectedSegment, setSelectedSegment] = useState({});
  const [hideMoreModal, setHideMoreModal] = useState(false);

  useEffect(() => {
    if (deleteSegmentApiState === 'success') {
      notification.success({ message: deleteSegmentMessage });

      // Check if the deleted segment was the currently selected one
      const deletedSegmentId = selectedSegment?.id;
      const wasSelectedSegment = String(deletedSegmentId) === String(selected);

      setSelectedSegment({});
      setDeleteSegmentModalVisible(false);
      setHideMoreModal(false);

      // If the deleted segment was selected, reset to "All" segment
      if (wasSelectedSegment) {
        const allSegment = allSegments.find(
          (s) => String(s.title).toLowerCase() === 'all'
        );
        if (allSegment) {
          handleSelectSegmentChip(allSegment);
        }
        setVisible(false);
      }

      dispatch(deleteSegmentResetCustomerList());
    }
    if (deleteSegmentApiState === 'error') {
      notification.error({ message: deleteSegmentMessage });
      setHideMoreModal(false);
      dispatch(deleteSegmentResetCustomerList());
    }
  }, [
    deleteSegmentApiState,
    deleteSegmentMessage,
    selectedSegment?.id,
    selected,
    allSegments,
    handleSelectSegmentChip,
    setVisible,
    notification,
    dispatch,
  ]);

  const filtered = useMemo(() => {
    if (!search.trim()) return overflow;
    const q = search.toLowerCase();
    return overflow.filter(
      (s) =>
        String(s.title || '')
          .toLowerCase()
          .includes(q) ||
        String(s.description || '')
          .toLowerCase()
          .includes(q)
    );
  }, [overflow, search]);

  const handleDeleteSegment = () => {
    const payload = {
      act: 'delete_filter_segment',
      del_filter_id: selectedSegment?.id,
    };
    dispatch(deleteSegmentApi(payload));
  };

  const handleConfirmationClose = (visible) => {
    setDeleteSegmentModalVisible(visible);
    if (!visible) {
      // User cancelled - restore the more modal
      setHideMoreModal(false);
    }
  };

  return (
    <>
      <AitModal
        open={visible && !hideMoreModal}
        centered
        footer={false}
        headerVisible={true}
        closeIconVisible={true}
        width={750}
        title="More segments"
        setVisible={setVisible}
        destroyOnClose
        maskClosable
      >
        <SearchInput
          placeholder="Search segments"
          size="small"
          suffix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />

        <ListWrap>
          <List
            dataSource={filtered}
            split={false}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <InboxOutlined style={{ fontSize: 40, color: '#999' }} />
                  <p style={{ marginTop: 8, color: '#999' }}>
                    No data available
                  </p>
                </div>
              ),
            }}
            renderItem={(seg) => (
              <List.Item key={seg.id} style={{ padding: 0 }}>
                <Item
                  $active={selected === seg.id}
                  onClick={() => {
                    handleSelectSegmentChip(seg);
                    setVisible(false);
                  }}
                >
                  <Space align="start" size={12}>
                    <IconBox>
                      {faToAntIcon(seg.fa_icon_class || 'far fa-list-alt')}
                    </IconBox>
                    <div>
                      <TitleBox>{seg.title}</TitleBox>
                      {seg.description && <DescBox>{seg.description}</DescBox>}
                    </div>
                  </Space>

                  {String(seg.is_default) === '0' && (
                    <DeleteIcon
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering select
                        setSelectedSegment(seg);
                        setHideMoreModal(true);
                        setDeleteSegmentModalVisible(true);
                      }}
                    />
                  )}
                </Item>
              </List.Item>
            )}
          />
        </ListWrap>
      </AitModal>
      <AitConfirmationModal
        visible={deleteSegmentModalVisible}
        setVisible={handleConfirmationClose}
        description={
          String(selectedSegment?.id) === String(selected)
            ? "This segment is currently selected. Deleting it will reset the view to 'All' customers. Do you want to continue?"
            : 'Do you really want to delete this segment?'
        }
        onConfirm={handleDeleteSegment}
        confirmButtonLoading={deleteSegmentLoading}
      />
    </>
  );
};

export default MoreSegmentModal;
