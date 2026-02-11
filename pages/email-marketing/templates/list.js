import React from 'react';
import TemplateListTemplate from '@/modules/email-marketing/templates/template-list-template/templateListTemplate';

export default function Page() {
  return (
    <>
      <TemplateListTemplate
        disableAutoFetch={false} // ✅ allow full data loading on main page
        defaultType="aiTemplate" // ✅ explicitly set first type
        defaultTab="pre_made_template" // (optional)
      />
    </>
  );
}
