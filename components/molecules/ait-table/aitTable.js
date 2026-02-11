import React, { useState } from 'react';
import { Table, Row, Col, App } from 'antd';
import { Header, TableOnlyWrapper, TableWrapper } from './style';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import AitDatePicker from '@/components/atoms/ait-date-picker/aitDatePicker';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { validateDates } from '@/modules/email-marketing/utils/validation';
import { InboxOutlined } from '@ant-design/icons';

const AitTable = ({
  heading,
  extraHeader,
  showFilters = true,
  showResetButton = true,
  showSearchButton = true,
  showSearchInput = true,
  onSearch,
  searchInputLabel = 'Campaign',
  onDateChange,
  resetFilters,
  loading = false,
  searchPlaceholder = 'Search...',
  marginleft,
  marginright,
  scrollwidth,
  filterheaderbottomspace,
  paginationbottomspace,
  ...rest
}) => {
  const { notification } = App.useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const isFiltered = !!(searchTerm || startDate || endDate);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // triggerDateChange(date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // triggerDateChange(startDate, date);
  };

  const triggerDateChange = (start, end) => {
    if (onDateChange) onDateChange([start, end]);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    // if (onSearch) onSearch('');
    // if (onDateChange) onDateChange([null, null]);

    resetFilters();
  };

  const hasData = (rest?.dataSource?.length || 0) > 0;

  return (
    <TableWrapper
      scrollwidth={scrollwidth}
      marginleft={marginleft}
      marginright={marginright}
    >
      <Header filterheaderbottomspace={filterheaderbottomspace}>
        {/* <div className="top-row">
          {heading && <h3>{heading}</h3>}
          {extraHeader}
        </div> */}
        {showFilters && (
          <Row gutter={[16, 8]} align="bottom" className="filter-row">
            {showSearchInput && (
              <Col xs={24} sm={12} md={6}>
                <AitInputBox
                  placeholder={searchPlaceholder}
                  label="Campaign"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{ height: 40 }}
                />
              </Col>
            )}
            <Col xs={24} sm={12} md={5}>
              <AitDatePicker
                label="From date"
                name="fromDate"
                value={startDate}
                onChange={handleStartDateChange}
                placeholder="From date"
                style={{ height: 40 }}
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <AitDatePicker
                label="To date"
                name="toDate"
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="To date"
                style={{ height: 40 }}
              />
            </Col>
            {showSearchButton && (
              <Col xs={12} sm={6} md={4}>
                <AitButton
                  title="Search"
                  type="primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    const error = validateDates(startDate, endDate);
                    if (error) {
                      notification.error({
                        message: error,
                        placement: 'top',
                      });
                      return;
                    }
                    if (onSearch) onSearch(searchTerm);
                    if (onDateChange) onDateChange([startDate, endDate]);
                  }}
                />
              </Col>
            )}
            {showResetButton && isFiltered && (
              <Col xs={12} sm={6} md={4}>
                <AitButton
                  title="Reset"
                  variant="outlined"
                  color="primary"
                  style={{ width: '100%' }}
                  onClick={handleResetFilters}
                />
              </Col>
            )}
          </Row>
        )}
      </Header>

      <TableOnlyWrapper
        paginationbottomspace={paginationbottomspace}
        marginleft={marginleft}
        marginright={marginright}
      >
        <Table
          rowKey={(record) => {
            record.id || record.key;
          }}
          loading={loading}
          locale={{
            emptyText: loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <span style={{ fontSize: 16, color: '#666' }}>Loading...</span>
              </div>
            ) : !hasData ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <InboxOutlined style={{ fontSize: 40, color: '#999' }} />
                <p style={{ marginTop: 8 }}>No data available</p>
              </div>
            ) : null,
          }}
          {...rest}
          onChange={rest.onChange}
        />
      </TableOnlyWrapper>
    </TableWrapper>
  );
};

export default AitTable;
