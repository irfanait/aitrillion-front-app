import React from 'react';
import { useSelector } from 'react-redux';
import AitCard from '@/components/atoms/ait-card/aitCard';
import AitRadioButton from '@/components/atoms/ait-radio-button/aitRadioButton';
import AitInputBox from '@/components/atoms/AitInputBox/AitInputBox';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Typography, Col, Dropdown, Row, Grid, Tooltip } from 'antd';
import {
  StyledDropdown,
  StyledFieldPopover,
  StyledFieldPopoverInner,
  ColumnWarpper,
} from './style';
import { toSentenceCase } from '../../utils/helper';
const { Title } = Typography;
const { useBreakpoint } = Grid;

const FieldPopover = (props) => {
  const triggerRef = React.useRef(null);
  const collapsed = useSelector((state) => state?.layoutState?.collapsed);
  const screens = useBreakpoint();

  // Conditional overlay padding based on screen size and collapsed state
  const getOverlayStyle = () => {
    if (screens.xl) {
      // Desktop (>= 1200px)
      return {
        padding: collapsed ? '0px 32px 0px 72px' : '0px 30px 0px 245px',
        // insetInlineStart: '0px !important',
      };
    } else if (screens.md) {
      // Tablet (>= 768px)
      return {
        padding: '0px 30px 0px 25px',
        // insetInlineStart: '0px !important',
      };
    } else {
      // Mobile (< 768px)
      return {
        padding: '0px 22px 0px 16px',
        // insetInlineStart: '0px !important',
      };
    }
  };
  // const [fixedPos, setFixedPos] = React.useState(null);
  const {
    filteredGroupedFilters,
    fieldPopoverVisible,
    setFieldPopoverVisible,
    setSearchInput,
    searchInput,
    selectedField,
    handleFieldSelect = () => {},
    children,
  } = props;

  const handleSelect = (field) => {
    setFieldPopoverVisible(false); // <-- CLOSE DROPDOWN
    handleFieldSelect(field); // <-- TELL PARENT TO CREATE CHIP + OPEN OPERATOR
  };
  const onOpenChange = (open) => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
    }
    setFieldPopoverVisible(open);
  };

  return (
    <StyledDropdown
      open={fieldPopoverVisible}
      onOpenChange={onOpenChange}
      placement="bottom"
      autoAdjustOverflow={false}
      getPopupContainer={() => document.body}
      trigger={['click']}
      destroyOnHidden={true}
      overlayClassName="field-popover-overlay"
      overlayStyle={getOverlayStyle()}
      overlay={
        <StyledFieldPopover collapsed={collapsed}>
          <AitCard
            headerpadding={{
              xs: '10px 16px',
              sm: '10px 20px',
              md: '10px 24px',
            }}
            custombodypadding={{
              xs: '16px 16px',
              sm: '20px 20px',
              md: '24px 24px',
            }}
            hascustomheader={true}
            customheaderleft={
              <Title
                style={{ marginTop: 'auto', marginBottom: 'auto' }}
                type="primary"
                level={5}
              >
                Segment filters
              </Title>
            }
            customheaderright={
              <Row gutter={[20, 20]}>
                <Col xs={{ span: 24 }} sm={{ span: 'auto' }}>
                  <>
                    <AitInputBox
                      placeholder={'Search by filter name'}
                      suffix={
                        <SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      }
                      style={{ height: 40, width: 250 }}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </>
                </Col>
              </Row>
            }
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
              width: '100%',
              // display: 'flex',
              //flexDirection: 'column',
            }}
          >
            <StyledFieldPopoverInner>
              <ColumnWarpper>
                {Object.entries(filteredGroupedFilters).length > 0 ? (
                  Object.entries(filteredGroupedFilters).map(
                    ([groupTitle, fields]) => (
                      <div
                        key={groupTitle}
                        style={{
                          display: 'inline-block',
                          width: '100%',
                          marginBottom: 30,
                          // breakInside: 'avoid',
                        }}
                      >
                        <Title
                          level={5}
                          style={{
                            borderBottom:
                              '1px solid var(--ant-bottom-border-title)',
                            paddingBottom: '10px',
                          }}
                        >
                          {toSentenceCase(groupTitle)}
                          {groupTitle.toLowerCase() === 'smart popup' && (
                            <Tooltip
                              title="Popup submission details are available from 11 Oct 2022, so filter can be work if you put the date above 11 Oct 2022."
                              placement="right"
                            >
                              <ExclamationCircleOutlined
                                style={{
                                  marginLeft: '6px',
                                  cursor: 'pointer',
                                  color: 'var(--ant-color-text-secondary)',
                                  fontSize: '14px',
                                }}
                              />
                            </Tooltip>
                          )}
                        </Title>
                        {fields.map((field) => (
                          <div key={field.id}>
                            <AitRadioButton
                              marginbottom={8}
                              name="fieldSelect"
                              options={[
                                {
                                  label: toSentenceCase(field.field_name),
                                  value: field.id,
                                },
                              ]}
                              value={selectedField?.id}
                              onChange={() => handleSelect(field)}
                            />
                          </div>
                        ))}
                      </div>
                    )
                  )
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    No matching filters found
                  </div>
                )}
              </ColumnWarpper>
            </StyledFieldPopoverInner>
          </AitCard>
        </StyledFieldPopover>
      }
    >
      {children}
    </StyledDropdown>
  );
};

export default FieldPopover;
