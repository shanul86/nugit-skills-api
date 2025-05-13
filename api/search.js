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

    console.log("Fetched HTML:\n", html.slice(0, 1000));

    const $ = cheerio.load(html);
    const results = [];

    $("div.media").each((i, el) => {
      const anchor = $(el).find("h4.title a");
      const title = anchor.text().trim();
      const href = anchor.attr("href");
      const url = href?.startsWith("http") ? href : "https://library.skillscommons.org" + href;
      const description = $(el).find("p.description").text().trim();

      if (title && href) {
        results.push({ title, url, description });
      }

      if (results.length >= 5) return false;
    });

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to scrape SkillsCommons",
      details: error.message
    });
  }
}
