export const checkValidData = (data) => {
  return data || '-';
};
export const checkValidCount = (data) => {
  return <>{data || 0}</>;
};

export function commasFormatter(data) {
  return data.join(', ');
}

export const textFormatter = (data) => {
  return data && data?.charAt(0)?.toUpperCase() + data.slice(1);
};

export function enterOnlyNumericValue(e) {
  const ASCIICode = e.which ? e.which : e.keyCode;
  const keyCode = e.charCode;
  if (
    (ASCIICode > 31 && ASCIICode > 57) ||
    keyCode === 43 ||
    keyCode === 42 ||
    keyCode === 45 ||
    keyCode === 47 ||
    keyCode === 33 ||
    keyCode === 35 ||
    keyCode === 36 ||
    keyCode === 37 ||
    keyCode === 38 ||
    keyCode === 44 ||
    keyCode === 40 ||
    keyCode === 41 ||
    keyCode === 39 ||
    keyCode === 34 ||
    keyCode === 32
  ) {
    e.preventDefault();
  }
}

export const convertToFormDataCustom = (obj, formData = new FormData()) => {
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];
    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, value);
    }
  }
  return formData;
};

export const convertToFormDataCustoms = (
  obj,
  formData = new FormData(),
  arrayKeyName = null
) => {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];

    // ✅ If value is an array
    if (Array.isArray(value)) {
      const keyName = arrayKeyName ? `${arrayKeyName}[]` : `${key}[]`;
      value.forEach((item) => formData.append(keyName, item));
    } else {
      // ✅ Normal key-value
      formData.append(key, value);
    }
  }

  return formData;
};

export const nameFormatter = (firstName, lastName) => {
  return <>{firstName ? ` ${firstName} ${' '} ${lastName}` : '-'}</>;
};

export const currencyFormatter = (value, type) => {
  return (
    <>
      {value
        ? Number(value)?.toLocaleString(type === 'INR' ? `en-IN` : `en-US`, {
            currency: `${type}`,
          })
        : '$ 0.00'}
    </>
  );
};

export const getAccessRule = (accessMap, moduleFeature) => {
  const rule = accessMap?.[moduleFeature] || {};
  const isHidden = rule?.action === 'hide' && rule?.access === 'No';
  const isRestricted = rule?.action === 'popup' && rule?.access === 'No';
  const upgradeUrl = rule?.content || '/popup?act=upgrade';

  return {
    rule,
    isHidden,
    isRestricted,
    upgradeUrl,
  };
};

const decodeHtmlEntities = (str) => {
  if (!str) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

const removeBetween = (str, start, end) => {
  const regex = new RegExp(`${start}.*?${end}`, 'g');
  return str.replace(regex, '');
};

export const getCurrencyByMoneyFormat = (money_format) => {
  if (!money_format) return '$';
  let clean = money_format?.replace(/<\/?[^>]+(>|$)/g, '');
  clean = decodeHtmlEntities(clean);
  clean = removeBetween(clean, '{{', '}}');
  return clean ? clean?.trim() : '$';
};

export const navigateWithParam = (data, router, pathname) => {
  const searchParams = new URLSearchParams(data).toString();

  if (pathname) {
    router.push(`${pathname}?${searchParams}`);
  } else {
    router.push(pathname);
  }
};

export function decodeQueryData(data) {
  return JSON.parse(
    `{"${decodeURI(data)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace('?', '')}"}`
  );
}

export const validateImageFile = (_, value) => {
  if (!value) {
    return Promise.resolve();
  }

  if (
    value !== 'assets/loyalty/images/bronze.svg' &&
    value !== 'assets/loyalty/images/silver.svg' &&
    value !== 'assets/loyalty/images/gold.svg'
  ) {
    const allowedTypes = 'image/jpeg,image/jpg,image/png'.split(',');
    if (value) {
      const fileName = value?.name || value?.split('?')[0];
      if (!/\.(png|jpg|jpeg)$/i.test(fileName)) {
        return Promise.reject(
          new Error('Only JPG and PNG images are allowed.')
        );
      }
      if (value.size && value.size > 1048576) {
        return Promise.reject(new Error('Image must be less than 1MB.'));
      }
      return Promise.resolve();
    }
    if (typeof value === 'string') {
      const extension = value.split('.').pop().toLowerCase();
      const extMapping = {
        jpg: 'image/jpg',
        jpeg: 'image/jpeg',
        png: 'image/png',
      };

      if (!allowedTypes.includes(extMapping[extension])) {
        return Promise.reject(
          new Error('Only JPG and PNG images are allowed.')
        );
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  } else {
    return Promise.resolve();
  }
};
