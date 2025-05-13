export default async function handler(request, response) {
  const { keywords } = request.query;

  if (!keywords) {
    return response.status(400).json({ error: "Missing keywords" });
  }

  try {
    const apiUrl = `https://www.skillscommons.org/rest/items/find?query=${encodeURIComponent(keywords)}&limit=5`;
    const skillsRes = await fetch(apiUrl);
    const data = await skillsRes.json();

    const results = data.map(item => ({
      title: item.name,
      url: item.handle,
      description: item.description || ""
    }));

    return response.status(200).json({ results });
  } catch (error) {
    return response.status(500).json({
      error: "Failed to fetch data from SkillsCommons",
      details: error.message
    });
  }
}
