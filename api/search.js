import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { keywords } = req.query;

  if (!keywords) {
    return res.status(400).json({ error: "Missing keywords" });
  }

  const searchUrl = `https://www.oercommons.org/search?f.keyword=${encodeURIComponent(keywords)}`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(html);
    const results = [];

    $(".search-result").each((i, el) => {
      if (i >= 5) return false;

      const title = $(el).find(".result-title a").text().trim();
      const url = "https://www.oercommons.org" + $(el).find(".result-title a").attr("href");
      const description = $(el).find(".discovery-card-description").text().trim();

      if (title && url) {
        results.push({ title, url, description });
      }
    });

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to scrape OER Commons",
      details: err.message
    });
  }
}
