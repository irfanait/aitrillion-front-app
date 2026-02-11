import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Space, Upload, message, Image, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import AitButton from '../ait-button/aitButton';
import { checkValidData } from '@/utils/common.util';
import {
  ErrorText,
  Label,
  Wrapper,
  FieldWrapper,
  LabelRow,
  HelperText,
  SubHelperText,
  StylerightContent,
} from './style';

const AitUpload = ({
  label = '',
  labelFontSize = '14px',
  labelFontWeight = '500',
  labelSpacingBottom,
  required = false,
  helperText = '', // ✅ New prop for helper text
  labelIcon = null, // ✅ New prop
  tooltipText = '', // Optional tooltip content
  labelSubText = false,
  onImageChange,
  initalValue,
  style = false,
  rest,
  imgwidth = '39px',
  imgheight = '39px',
  imageStyle = {
    borderRadius: '4px',
    objectFit: 'cover',
    height: imgheight ? imgheight : '100px',
    width: imgwidth ? imgwidth : '100px',
    border: '1px solid #ddd',
  },
  extraStyle,
  referAFriend = false,
  showImage = true,
  align = 'start',
  showpreviewicononly = true,
  onResetValue = false,
}) => {
  const [imageFile, setImageFile] = useState(null);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const handleChange = (info) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      setImageFile(info?.file?.originFileObj);
      onImageChange(info.file.originFileObj);
    }
  };

  const handleDelete = () => {
    setImageFile(null);
    onImageChange(null);
    if (onResetValue) {
      onResetValue();
    }
  };

  return (
    <>
      {label && (
        <>
          <LabelRow>
            <Label
              labelFontSize={labelFontSize}
              labelFontWeight={labelFontWeight}
              labelSpacingBottom={labelSpacingBottom}
            >
              {label}
            </Label>
            {labelIcon && (
              <Tooltip title={tooltipText} className="label-tooltip">
                <span
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {labelIcon}
                </span>
              </Tooltip>
            )}
            {required && (
              <span
                className="field-required"
                style={{ position: 'relative', top: '-2px' }}
              >
                *
              </span>
            )}
          </LabelRow>
          {labelSubText && <SubHelperText>{labelSubText || ''}</SubHelperText>}
        </>
      )}
      <div
        style={
          referAFriend
            ? {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: align ? align : 'center',
              }
            : {
                display: 'flex',
                margin: 0,
                padding: 0,
                alignItems: align ? align : 'center',
              }
        }
      >
        <Upload
          name="file"
          listType="picture"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          // accept="image/*"
          maxCount={1}
          {...rest}
        >
          <Button icon={<UploadOutlined />} style={style || { height: 39 }}>
            Choose File
          </Button>
        </Upload>

        <StylerightContent
          showpreviewicononly={showpreviewicononly}
          style={{
            ...extraStyle,
            position: 'relative',
            display: referAFriend ? 'flex' : 'inline-block',
            marginTop: referAFriend ? '20px' : 'auto',
            alignItems: referAFriend ? 'center' : '',
            marginBottom: 'auto',
            fontSize: 12,
            lineHeight: 1,
            //  overflow: 'hidden',
            //  textOverflow: 'ellipsis',
            maxWidth: '100%',
            whiteSpace: showImage ? 'normal' : 'nowrap',
            borderRadius: '4px',
            height: showImage ? (imgheight ? imgheight : '39px') : '',
            width: showImage ? (imgwidth ? imgwidth : '39px') : '',
            left: '10px',
          }}
        >
          {showImage ? (
            <Image
              src={imageFile ? URL.createObjectURL(imageFile) : initalValue}
              alt={imageFile && 'Uploaded Preview'}
              style={imageFile || initalValue ? imageStyle : {}}
            />
          ) : (
            <span>{imageFile?.name || initalValue}</span>
          )}
          {referAFriend && (
            <div style={{ marginLeft: '20px' }}>
              <p
                style={{
                  color: 'var(--ant-color-text-default)',
                  fontSize: '12px',
                  lineHeight: '15px',
                  letterSpacing: '-0.01em',
                  fontWeight: '400',
                  fontStyle: 'normal',
                  fontFamily: 'Roboto',
                  marginTop: '5px',
                  marginBottom: '10px',
                }}
              >
                Ensure the image dimensions are 240px, the size is up to 5MB,
                and it is in .png or .jpg format.
              </p>

              <AitButton
                color="default"
                variant="filled"
                title="Reset"
                onClick={() => handleDelete()}
              />
            </div>
          )}
        </StylerightContent>
      </div>
    </>
  );
};

export default AitUpload;
