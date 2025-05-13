import axios from "axios";
import * as cheerio from "cheerio"; // ✅ ESM-compatible import

export default async function handler(req, res) {
  const { keywords } = req.query;

  if (!keywords) {
    return res.status(400).json({ error: "Missing keywords" });
  }

  const searchUrl = `https://www.skillscommons.org/discover?query=${encodeURIComponent(keywords)}`;

  try {
    const { data: html } = await axios.get(searchUrl);
    const $ = cheerio.load(html);

    const results = [];

    $(".artifact-title").each((i, el) => {
      if (i >= 5) return;
      const title = $(el).text().trim();
      const link = "https://www.skillscommons.org" + $(el).find("a").attr("href");
      const description = $(el).next(".artifact-description").text().trim();
      results.push({ title, url: link, description });
    });

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({
      error: "Failed to scrape SkillsCommons search page",
      details: error.message
    });
  }
}
