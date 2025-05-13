import axios from "axios";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { keywords } = req.query;

  if (!keywords) {
    return res.status(400).json({ error: "Missing keywords" });
  }

  const searchUrl = `https://library.skillscommons.org/search?query=${encodeURIComponent(keywords)}`;

  try {
    const { data: html } = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(html);
    const results = [];

    $(".media-body").each((i, el) => {
      if (i >= 5) return;
      const title = $(el).find(".title a").text().trim();
      const url = "https://library.skillscommons.org" + $(el).find(".title a").attr("href");
      const description = $(el).find(".description").text().trim();
      results.push({ title, url, description });
    });

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to scrape SkillsCommons library site",
      details: error.message
    });
  }
}
