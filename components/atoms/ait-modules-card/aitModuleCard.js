// atoms/StatCard.tsx
import { Card, Typography } from 'antd';
import Link from 'next/link';
import { StyleModuleCard, StyleModuleCardText } from './style';
import { LockRestrictedIcon } from '@/modules/layouts/svg-icons';
import { handleLockIconClick } from '@/modules/layouts/helper';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

const AitModulesCard = ({
  upgradeUrl,
  isRestricted = false,
  id,
  icon,
  label,
  link,
  status,
  padding,
  height,
  bodyheight,
  bodytextalign,
  bodyfontsize,
  bodylineheight,
  iconwidth,
  iconheight,
  boxshadow,
}) => {
  const router = useRouter();
  return (
    <StyleModuleCard
      className={status == '1' ? '' : 'module-disabled'}
      boxshadow={boxshadow}
      iconwidth={iconwidth}
      iconheight={iconheight}
      hoverable
      bodyfontsize
      styles={{
        body: {
          padding: padding ? padding : '24px',
          height: bodyheight ? bodyheight : 'auto',
          textAlign: bodytextalign ? bodytextalign : 'left',
        },
      }}
      style={{ height: height ? height : 'auto' }}
    >
      {isRestricted ? (
        <div onClick={() => handleLockIconClick(upgradeUrl, router)}>
          <div className="module-locked">
            <LockRestrictedIcon />
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 11,
              }}
            >
              <div>{icon}</div>
              <StyleModuleCardText
                bodyfontsize={bodyfontsize}
                bodylineheight={bodylineheight}
                type="secondary"
              >
                {label}
              </StyleModuleCardText>
            </div>
          </div>
        </div>
      ) : (
        <Link href={link}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 11,
            }}
          >
            <div>{icon}</div>
            <StyleModuleCardText
              bodyfontsize={bodyfontsize}
              bodylineheight={bodylineheight}
              type="secondary"
            >
              {label}
            </StyleModuleCardText>
          </div>
        </Link>
      )}
    </StyleModuleCard>
  );
};

export default AitModulesCard;
