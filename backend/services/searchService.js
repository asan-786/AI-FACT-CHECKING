const searchService = async (claim) => {
  try {
    console.log("Searching Wikipedia for:", claim);

    const searchUrl =
      "https://en.wikipedia.org/w/rest.php/v1/search/page" +
      `?q=${encodeURIComponent(claim)}` +
      "&limit=3";

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Api-User-Agent":
          "AI-Fact-Checker/1.0 (mailto:asanali94163@gmail.com)"
      }
    });

    console.log("Wikipedia status:", response.status);

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");

      console.log(
        "Wikipedia rate limit reached.",
        retryAfter
          ? `Retry after ${retryAfter} seconds`
          : "Please wait before trying again."
      );

      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Wikipedia API response:", errorText);

      return [];
    }

    const data = await response.json();

    if (!data.pages || data.pages.length === 0) {
      console.log("No Wikipedia results found.");
      return [];
    }

    console.log(
      `Wikipedia found ${data.pages.length} results.`
    );

    return data.pages.map((page) => ({
      title: page.title || "",
      text: page.description || "",
      publisher: "Wikipedia",
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
        page.title
      )}`
    }));

  } catch (error) {
    console.error("Wikipedia search error:", error);
    return [];
  }
};

module.exports = searchService;