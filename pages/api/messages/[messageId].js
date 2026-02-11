export default async function handler(req, res) {
  const { messageId } = req.query;
  const { token, shopId } = req.headers;

  if (!messageId || !token || !shopId) {
    return res.status(400).json({ error: 'Missing required params' });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}api/etemplate/?act=get_message_detail&page=load_template_data&shop_id=${shopId}&message_id=${messageId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );

    const data = await response.json();

    return res.status(200).json({
      html: data.templateData.template_html,
      css: data.templateData.template_css,
      shop_logo_url: data.templateData.shop_logo_url,
      domain_url: data.templateData.domain_url,
      templateData: data.templateData,
    });
  } catch (err) {
    console.error('Message Fetch Error:', err.message);
    return res
      .status(500)
      .json({ error: 'Failed to load template by message ID' });
  }
}
