import React, { useEffect, useState } from 'react';
import {
  Bar,
  DateRangeNotice,
  FullWidthButton,
  Label,
  MenuHeader,
  MenuBody,
  MenuWrap,
} from './style';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { DatePicker, Col, Row, Dropdown, Form } from 'antd';
import AitSelectBox from '@/components/atoms/ait-select-box/aitSelect';
import moment from 'moment';
import { CalendarOutlined } from '@ant-design/icons';

const DashboardFilters = ({
  filterState,
  setFilterState,
  data,
  activeTab,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [dateState, setDateState] = useState(false);

  const handleApply = () => {
    form.submit();

    if (form?.getFieldValue()?.fromDate && form?.getFieldValue()?.toDate) {
      setOpen(false);
    }

    // setOpen(false);
  };

  const handleFinish = (values) => {
    setDateState(true);
    setFilterState({
      ...filterState,
      fromDate: values.fromDate?.format('YYYY-MM-DD'),
      toDate: values.toDate?.format('YYYY-MM-DD'),
      calling: true,
      customDateFilter: true,
    });
    setOpen(false);
  };

  const getDateRangeFromValue = (value) => {
    setDateState(false);
    const today = moment().startOf('day');
    let fromDate;

    switch (value) {
      case 'today':
        fromDate = today.clone();
        break;
      case 'yesterday':
        fromDate = today.clone().subtract(1, 'day');
        break;
      case 'lstwk':
        fromDate = today.clone().subtract(7, 'days');
        break;
      case 'lst30':
        fromDate = today.clone().subtract(30, 'days');
        break;
      case 'lst60':
        fromDate = today.clone().subtract(60, 'days');
        break;
      case 'lst90':
        fromDate = today.clone().subtract(90, 'days');
        break;
      case 'lst180':
        fromDate = today.clone().subtract(180, 'days');
        break;
      case 'lstyr':
        fromDate = today.clone().subtract(365, 'days');
        break;
      default:
        fromDate = null;
    }

    setFilterState({
      ...filterState,
      selectDay: value,
      fromDate: fromDate?.format('YYYY-MM-DD') || null,
      toDate: today.format('YYYY-MM-DD'),
      calling: true,
      customDateFilter: false,
    });
    form.resetFields();
  };

  const menuContent = (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <MenuWrap>
        <MenuHeader>
          <span>Custom date</span>
        </MenuHeader>
        <MenuBody>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Label>From</Label>
            </Col>
            <Col span={12}>
              <Label>To</Label>
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Form.Item
                name="fromDate"
                rules={[{ required: true, message: 'Please select from date' }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  // disabledDate={(current) =>
                  //   current && current.isAfter(new Date())
                  // }
                  disabledDate={(current) => {
                    const to = form.getFieldValue('toDate');
                    if (!to) return current && current.isAfter(new Date());
                    return (
                      current &&
                      (current.isAfter(new Date()) || current.isAfter(to))
                    );
                  }}
                  placeholder="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toDate"
                rules={[{ required: true, message: 'Please select to date' }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  // disabledDate={(current) =>
                  //   current && current.isAfter(new Date())
                  // }
                  disabledDate={(current) => {
                    const from = form.getFieldValue('fromDate');
                    if (!from) return current && current.isAfter(new Date());
                    return (
                      current &&
                      (current.isAfter(new Date()) || current.isBefore(from))
                    );
                  }}
                  placeholder="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <AitButton
                color="primary"
                variant="outlined"
                onClick={handleApply}
                disabled={loading}
                title="Apply"
                block
              />
            </Col>
          </Row>
        </MenuBody>
      </MenuWrap>
    </Form>
  );

  const filterItems = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'lstwk', label: 'Past 7 days' },
    { value: 'lst30', label: 'Past 30 days' },
    { value: 'lst60', label: 'Past 60 days' },
    { value: 'lst90', label: 'Past 90 days' },
    { value: 'lst180', label: 'Past 180 days' },
    { value: 'lstyr', label: 'Past 365 days' },
  ];

  useEffect(() => {
    if (activeTab === 'analytics') {
      setFilterState({
        ...filterState,
        selectDay: filterState?.selectDay,
      });
    } else {
      setFilterState({
        ...filterState,
        selectDay: filterState?.selectDay,
      });
    }
  }, [activeTab]);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={{ flex: 'none' }}>
          <AitSelectBox
            disabled={loading}
            options={filterItems}
            style={{ width: '100%', minWidth: '140px' }}
            value={filterState?.selectDay}
            onChange={getDateRangeFromValue}
            showSearch={false}
            allowClear={false}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={{ flex: 'none' }}>
          {/* Replace dropdownRender with popupRender */}
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            popupRender={() => menuContent} // Use popupRender here instead of dropdownRender
            open={open}
            onOpenChange={setOpen}
            style={{ width: '100%', minWidth: '140px' }}
          >
            <AitButton
              title={
                dateState && filterState.fromDate && filterState.toDate
                  ? `${moment(filterState.fromDate).format('DD-MM-YYYY')} - ${moment(filterState.toDate).format('DD-MM-YYYY')}`
                  : 'Custom date'
              }
              color="default"
              variant="outlined"
              fontweight="400"
              styleinput={true}
              icon={<CalendarOutlined />}
              block
            />
          </Dropdown>
        </Col>
        <Col xs={24} sm={{ flex: 'none' }}>
          <AitButton
            title="Reset"
            color="primary"
            variant="outlined"
            block
            onClick={() =>
              setFilterState({
                ...filterState,
                selectDay: activeTab === 'analytics' ? 'lst30' : 'lstwk',
                fromDate: '',
                toDate: '',
                calling: true,
                customDateFilter: false,
              })
            }
            disabled={
              filterState?.fromDate === '' &&
              filterState?.toDate === '' &&
              filterState?.selectDay ===
                (activeTab === 'analytics' ? 'lst30' : 'lstwk')
            }
          />
        </Col>
      </Row>

      {/* {(data?.first_activity_date || activeTab === 'analytics') && (
        <Row>
          <Col xs={24} sm={{ flex: 'none' }}>
            <DateRangeNotice>
              The report includes data starting from the first loyalty activity
              date: {data?.first_activity_date}
            </DateRangeNotice>
          </Col>
        </Row>
      )} */}
    </>
  );
};

export default DashboardFilters;
