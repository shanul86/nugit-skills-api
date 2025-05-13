import axios from "axios";

export default async function handler(req, res) {
  const { keywords } = req.query;
  if (!keywords) {
    return res.status(400).json({ error: "Missing keywords" });
  }

  try {
    const url = `https://www.skillscommons.org/rest/items/find?query=${encodeURIComponent(keywords)}&limit=5`;
    const { data } = await axios.get(url);

    const results = data.map(item => ({
      title: item.name,
      url: item.handle,
      description: item.description || ""
    }));

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data", details: err.message });
  }
}

