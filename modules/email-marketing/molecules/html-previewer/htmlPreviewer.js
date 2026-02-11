import { useEffect, useState } from 'react';

const HtmlPreviewer = ({ htmlString }) => {
  const [iframeSrc, setIframeSrc] = useState(null);

  useEffect(() => {
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              background-color: #fff;
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          ${htmlString}
        </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setIframeSrc(url);

    return () => URL.revokeObjectURL(url);
  }, [htmlString]);

  return (
    <iframe
      src={iframeSrc}
      title="HTML Preview"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  );
};

export default HtmlPreviewer;
