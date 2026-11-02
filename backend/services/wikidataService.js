const wikidataService = async (claim) => {
  try {
    console.log("Searching Wikidata for:", claim);

    const searchUrl =
      "https://www.wikidata.org/w/api.php" +
      `?action=wbsearchentities` +
      `&search=${encodeURIComponent(claim)}` +
      `&language=en` +
      `&format=json` +
      `&limit=5`;

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent":
          "AI-Fact-Checker/1.0 (Fact-checking student project)"
      }
    });

    console.log("Wikidata status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Wikidata API error:",
        errorText
      );

      return [];
    }

    const data = await response.json();

    if (!data.search || data.search.length === 0) {
      console.log("No Wikidata results found.");
      return [];
    }

    const evidence = data.search.map((item) => ({
      title: item.label || "",
      text: item.description || "",
      publisher: "Wikidata",
      url:
        item.concepturi ||
        `https://www.wikidata.org/wiki/${item.id}`
    }));

    console.log(
      `Wikidata found ${evidence.length} results.`
    );

    return evidence;

  } catch (error) {
    console.error(
      "Wikidata search error:",
      error
    );

    return [];
  }
};

module.exports = wikidataService;