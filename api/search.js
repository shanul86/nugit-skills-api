import axios from "axios";

export default async function handler(req, res) {
  const { keywords } = req.query;

  if (!keywords) {
    return res.status(400).json({ error: "Missing keywords" });
  }

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(keywords)}&limit=5`;
    const { data } = await axios.get(url);

    const results = data.docs.slice(0, 5).map((item) => ({
      title: item.title,
      author: item.author_name?.[0] || "Unknown",
      url: `https://openlibrary.org${item.key}`
    }));

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch from Open Library",
      details: error.message
    });
  }
}
