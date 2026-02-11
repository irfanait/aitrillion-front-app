export default async function handler(req, res) {
  const { id } = req.query;
  const { token, shopId } = req.headers;

  if (!id || !token || !shopId) {
    return res.status(400).json({ error: 'Missing required params' });
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}api/template/?act=gettemplatedata&page=load_template_data&shop_id=${shopId}&etid=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();

    return res.status(200).json({
      html: data.templateData.html,
      css: data.templateData.css,
      shop_logo_url: data.templateData.shop_logo_url,
      domain_url: data.templateData.domain_url,
      templateData: data.templateData,
    });
  } catch (err) {
    console.error('Template Fetch Error:', err.message);
    return res.status(500).json({ error: 'Failed to load template' });
  }
}
