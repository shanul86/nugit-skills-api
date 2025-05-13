export default async function handler(req, res) {
  const { keywords } = req.query;

  if (!keywords) {
    return res.status(400).json({ error: "Missing keywords" });
  }

  try {
    const url = `https://www.skillscommons.org/rest/items/find?query=${encodeURIComponent(keywords)}&limit=5`;
    const response = await fetch(url);
    const data = await response.json();

    const results = data.map(item => ({
      title: item.name,
      url: item.handle,
      description: item.description || ""
    }));

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ error: "API fetch failed", details: error.message });
  }
}
