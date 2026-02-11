import {
  Input,
  Button,
  Row,
  Col,
  Switch,
  Tooltip,
  Table,
  Empty,
  Grid,
  Popover,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  FilterFilled,
} from '@ant-design/icons';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitTableList from '../ait-table-list/aitTableList';
import AitButton from '@/components/atoms/ait-button/aitButton';
import { useEffect, useState } from 'react';
import { TableOnlyWrapper, TableWrapper } from './style';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { navigateWithParam } from '@/utils/common.util';
import { moduleRoute } from '@/modules/layouts/routeControl/route';
import AitRowWrapper from '@/components/atoms/ait-row-wrapper/aitRowWrapper';
import AitText from '@/components/atoms/ait-text/aitText';
const { useBreakpoint } = Grid;

function CustomAitTable({
  columns,
  tableData = [],
  rowKey = 'id',
  currentPage = 1,
  pageSize = 10,
  totalRecords = 0,
  setCurrentPage,
  setPageSize,
  onSearch,
  buttons = [],
  search = false,
  switchBtn = false,
  switchBtnValue = '',
  loading = false,
  setSortValue,
  setSortOrder,
  pagination = true,
  searchPlaceholder = '',
  marginleft,
  marginright,
  scrollwidth,
  btn = true,
  verticalScrollHeight,
  verticalScrollminHeight = 300,
  isCard = false,
  title = '',
  bodycellpadddingtopbottom,
  headerbgcolor,
  filterPopover = false,
  filterContent = null,
  showTotalCount = true,
  searchValue = '',
  popoverExtraClassName = false,
  rest,
}) {
  const screens = useBreakpoint();
  const [selected, setSelected] = useState('all');
  const [param, setParam] = useState({});
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchVal, setSearchVal] = useState();

  const goToPage = (pageNo, size) => {
    const newParams = { ...param };
    if (pageNo) {
      newParams.page = pageNo;
    }
    if (size) {
      newParams.pageSize = size;
    }
    if (router?.route === moduleRoute?.loyalty_rewards?.discount_report) {
      navigateWithParam(newParams, router, router?.route);
    }
  };

  const handleToggle = (value) => {
    setSelected(value);
    switchBtnValue(value);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (!sorter.order) return;

    const backendField = sorter.column?.sortValue || '-';
    const order = sorter.order === 'ascend' ? 'asc' : 'desc';

    setSortValue(backendField);
    setSortOrder(order);
    let obj = { sortVal: backendField, order: order };

    const newParams = { ...param, ...obj };
    if (router?.route === moduleRoute?.loyalty_rewards?.discount_report) {
      navigateWithParam(newParams, router, router?.route);
    }
  };

  useEffect(() => {
    if (searchParams) {
      setParam(Object.fromEntries(searchParams.entries()));
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchVal(searchValue);
  }, [searchValue]);

  return (
    <>
      <TableWrapper
        scrollwidth={scrollwidth}
        marginleft={marginleft}
        marginright={marginright}
        verticalScrollminHeight={verticalScrollminHeight}
        bodycellpadddingtopbottom={bodycellpadddingtopbottom}
        headerbgcolor={headerbgcolor}
      >
        {isCard ? (
          <AitCard
            bodypadding={{
              xs: '1px 20px 10px 20px',
              sm: '1px 20px 10px 20px',
              md: '1px 24px 10px 24px',
            }}
            title={
              <>
                {title && title}
                {(search || buttons?.length > 0) && (
                  <Row
                    justify="space-between"
                    align="middle"
                    gutter={[12, 10]}
                    style={{ marginBottom: 10 }}
                  >
                    {showTotalCount && (
                      <Col xs={24} sm={24} md={{ span: 'auto', flex: 'none' }}>
                        <AitText size={18} type="primary" strong>
                          Total{' '}
                          <span style={{ color: 'var(--ant-color-primary)' }}>
                            {totalRecords}
                          </span>
                        </AitText>
                      </Col>
                    )}
                    {(search || buttons?.length > 0 || filterPopover) && (
                      <>
                        {search && (
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={{ span: 'auto', flex: 'none' }}
                            style={
                              screens?.lg
                                ? { marginLeft: 'auto', marginRight: 0 }
                                : {}
                            }
                          >
                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                              }}
                            >
                              <Tooltip
                                placement="topLeft"
                                title={`Search by ${searchPlaceholder || ''}`}
                              >
                                <AitInputBox
                                  block
                                  style={{
                                    width: screens?.lg ? '300px' : '100%',
                                    maxWidth: '100%',
                                  }}
                                  size="large"
                                  allowClear
                                  value={searchVal}
                                  prefix={<SearchOutlined />}
                                  placeholder="Type 3 or more characters"
                                  onChange={(e) => {
                                    if (onSearch) {
                                      onSearch(e.target.value);
                                      setSearchVal(e.target.value);
                                    }
                                  }}
                                />
                              </Tooltip>
                            </div>
                          </Col>
                        )}

                        {buttons?.length > 0 &&
                          buttons?.map((button, index) => (
                            <Col
                              key={index}
                              xs={24}
                              sm={12}
                              md={{ span: 'auto', flex: 'none' }}
                              style={
                                !search && screens?.md
                                  ? { marginLeft: 'auto', marginRight: 0 }
                                  : {}
                              }
                            >
                              {btn ? (
                                <AitButton
                                  block
                                  loading={button?.loading}
                                  disabled={button?.loading || button?.disabled}
                                  type={button?.type || 'default'}
                                  title={button?.title}
                                  icon={button?.icon}
                                  onClick={button?.onClick}
                                  textColor="#fff"
                                  style={{ color: 'var(--ant-color-primary' }}
                                />
                              ) : (
                                button?.field
                              )}
                            </Col>
                          ))}
                      </>
                    )}

                    {switchBtn && (
                      <Col xs={24} sm={12} md={{ span: 'auto', flex: 'none' }}>
                        <Button.Group>
                          <Button
                            type={selected === 'all' ? 'primary' : 'default'}
                            onClick={() => handleToggle('all')}
                          >
                            Created
                          </Button>
                          <Button
                            type={selected === 'used' ? 'primary' : 'default'}
                            onClick={() => handleToggle('used')}
                          >
                            Used
                          </Button>
                        </Button.Group>
                      </Col>
                    )}
                    {filterPopover && (
                      <Col
                        xs={12}
                        sm={12}
                        md={{ span: 'auto', flex: 'none' }}
                        className={popoverExtraClassName || ''}
                      >
                        <Popover
                          content={
                            filterContent ? (
                              filterContent(() => setFilterPopoverOpen(false))
                            ) : (
                              <div style={{ padding: '12px' }}>
                                Filter content goes here
                              </div>
                            )
                          }
                          title=""
                          trigger="click"
                          open={filterPopoverOpen}
                          onOpenChange={(visible) =>
                            setFilterPopoverOpen(visible)
                          }
                          placement={screens?.xs ? 'bottom' : 'bottomRight'}
                          getPopupContainer={(trigger) => document.body}
                          overlayStyle={{
                            maxWidth: screens?.xs
                              ? 'calc(100vw - 24px)'
                              : '400px',
                            zIndex: 1050,
                          }}
                          overlayInnerStyle={{
                            padding: 0,
                          }}
                        >
                          <Button
                            block
                            size="large"
                            icon={<FilterOutlined />}
                            style={{ minWidth: '40px' }}
                          >
                            Filters
                          </Button>
                        </Popover>
                      </Col>
                    )}
                  </Row>
                )}
              </>
            }
          >
            <TableOnlyWrapper
              marginleft={marginleft}
              marginright={marginright}
              verticalScrollminHeight={verticalScrollminHeight}
            >
              <Table
                onChange={handleTableChange}
                rowKey={rowKey}
                dataSource={tableData}
                columns={columns}
                loading={loading}
                locale={{
                  emptyText: loading ? null : (
                    <Empty
                      description="No data available"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
                pagination={
                  pagination && {
                    current: parseFloat(param?.page) || currentPage,
                    pageSize: parseFloat(param?.pageSize) || pageSize,
                    total: totalRecords,
                    showSizeChanger: true,
                    showTotal: false,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    locale: {
                      items_per_page: '/ page',
                    },
                    onChange: (page, size) => {
                      setCurrentPage(page);
                      setPageSize(size);
                      goToPage(page, size);
                    },
                    onShowSizeChange: (current, size) => {
                      setCurrentPage(1);
                      setPageSize(size);
                    },
                  }
                }
                scroll={{
                  x: 'max-content',
                  y: verticalScrollHeight ? verticalScrollHeight : 400,
                }}
                {...rest}
              />
            </TableOnlyWrapper>
          </AitCard>
        ) : (
          <>
            {' '}
            <Row
              justify="space-between"
              align="middle"
              gutter={[12, 10]}
              style={{ marginBottom: 10 }}
            >
              {showTotalCount && (
                <Col xs={24} sm={24} md={{ span: 'auto', flex: 'none' }}>
                  <AitText size={18} type="primary" strong>
                    Total{' '}
                    <span style={{ color: 'var(--ant-color-primary)' }}>
                      {totalRecords}
                    </span>
                  </AitText>
                </Col>
              )}
              {(search || buttons?.length > 0 || filterPopover) && (
                <>
                  {search && (
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={{ span: 'auto', flex: 'none' }}
                      style={
                        screens?.lg
                          ? { marginLeft: 'auto', marginRight: 0 }
                          : {}
                      }
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <Tooltip
                          placement="topLeft"
                          title={`Search by ${searchPlaceholder || ''}`}
                        >
                          <AitInputBox
                            block
                            style={{
                              width: screens?.lg ? '300px' : '100%',
                              maxWidth: '100%',
                            }}
                            size="large"
                            allowClear
                            value={searchVal}
                            prefix={<SearchOutlined />}
                            placeholder="Type 3 or more characters"
                            onChange={(e) => {
                              if (onSearch) {
                                onSearch(e.target.value);
                                setSearchVal(e.target.value);
                              }
                            }}
                          />
                        </Tooltip>
                      </div>
                    </Col>
                  )}

                  {buttons?.length > 0 &&
                    buttons?.map((button, index) => (
                      <Col
                        key={index}
                        xs={24}
                        sm={12}
                        md={{ span: 'auto', flex: 'none' }}
                        style={
                          !search && screens?.md
                            ? { marginLeft: 'auto', marginRight: 0 }
                            : {}
                        }
                      >
                        {btn ? (
                          <AitButton
                            block
                            loading={button?.loading}
                            disabled={button?.loading || button?.disabled}
                            type={button?.type || 'default'}
                            title={button?.title}
                            icon={button?.icon}
                            onClick={button?.onClick}
                            textColor="#fff"
                            style={{ color: 'var(--ant-color-primary' }}
                          />
                        ) : (
                          button?.field
                        )}
                      </Col>
                    ))}
                </>
              )}

              {switchBtn && (
                <Col xs={24} sm={12} md={{ span: 'auto', flex: 'none' }}>
                  <Button.Group>
                    <Button
                      type={selected === 'all' ? 'primary' : 'default'}
                      onClick={() => handleToggle('all')}
                    >
                      Created
                    </Button>
                    <Button
                      type={selected === 'used' ? 'primary' : 'default'}
                      onClick={() => handleToggle('used')}
                    >
                      Used
                    </Button>
                  </Button.Group>
                </Col>
              )}
              {filterPopover && (
                <Col xs={24} sm={12} md={{ span: 'auto', flex: 'none' }}>
                  <Popover
                    content={
                      filterContent ? (
                        filterContent(() => setFilterPopoverOpen(false))
                      ) : (
                        <div style={{ padding: '12px' }}>
                          Filter content goes here
                        </div>
                      )
                    }
                    title=""
                    trigger="click"
                    open={filterPopoverOpen}
                    onOpenChange={(visible) => setFilterPopoverOpen(visible)}
                    placement={screens?.xs ? 'bottom' : 'bottomRight'}
                    getPopupContainer={(trigger) => document.body}
                    overlayStyle={{
                      maxWidth: screens?.xs ? 'calc(100vw - 24px)' : '400px',
                      zIndex: 1050,
                    }}
                    overlayInnerStyle={{
                      padding: 0,
                    }}
                  >
                    <Button
                      block
                      size="large"
                      icon={<FilterOutlined />}
                      style={{ minWidth: '40px' }}
                    >
                      Filters
                    </Button>
                  </Popover>
                </Col>
              )}
            </Row>
            <TableOnlyWrapper marginleft={marginleft} marginright={marginright}>
              <Table
                onChange={handleTableChange}
                rowKey={rowKey}
                dataSource={tableData}
                columns={columns}
                loading={loading}
                locale={{
                  emptyText: loading ? null : (
                    <Empty
                      description="No data available"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ),
                }}
                pagination={
                  pagination && {
                    current: parseFloat(param?.page) || currentPage,
                    pageSize: parseFloat(param?.pageSize) || pageSize,
                    total: totalRecords,
                    showSizeChanger: true,
                    showTotal: false,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    locale: {
                      items_per_page: '/ page',
                    },
                    onChange: (page, size) => {
                      setCurrentPage(page);
                      setPageSize(size);
                      goToPage(page, size);
                    },
                    onShowSizeChange: (current, size) => {
                      setCurrentPage(1);
                      setPageSize(size);
                    },
                  }
                }
                scroll={{
                  x: 'max-content',
                  y: verticalScrollHeight ? verticalScrollHeight : 400,
                }}
                {...rest}
              />
            </TableOnlyWrapper>
          </>
        )}
      </TableWrapper>
    </>
  );
}

export default CustomAitTable;
