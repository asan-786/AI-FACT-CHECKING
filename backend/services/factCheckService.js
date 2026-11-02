const factCheckService = async (claim) => {

    const apiKey = process.env.FACT_CHECK_API_KEY;

    if (!apiKey) {
        throw new Error("Fact Check API key is missing");
    }

    const url =
        `https://factchecktools.googleapis.com/v1alpha1/claims:search` +
        `?query=${encodeURIComponent(claim)}` +
        `&languageCode=en-US` +
        `&pageSize=5` +
        `&key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();

        console.error("Google API error:", errorText);

        throw new Error("Fact Check API request failed");
    }

    const data = await response.json();

    // No fact-check results
    if (!data.claims || data.claims.length === 0) {
        return {
            found: false,
            message: "No matching fact-checks were found."
        };
    }

    // Convert Google response into our format
    const results = data.claims.flatMap((claimData) => {

        return claimData.claimReview.map((review) => {

            return {
                claim: claimData.text,

                claimant: claimData.claimant || "Unknown",

                verdict: review.textualRating || "Unknown",

                publisher: review.publisher?.name || "Unknown",

                title: review.title || "Untitled",

                url: review.url || "",

                reviewDate: review.reviewDate || null
            };

        });

    });

    return {
        found: true,
        searchedClaim: claim,
        results: results
    };
};

module.exports = factCheckService;