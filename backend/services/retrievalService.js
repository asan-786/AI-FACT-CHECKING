const factCheckService = require("./factCheckService");
// const searchService = require("./searchService");
const wikidataService = require("./wikidataService");

const retrievalService = async (claim) => {
  console.log("Starting evidence retrieval...");

  // Step 1: Google Fact Check
  const factCheckResults = await factCheckService(claim);

  if (
    factCheckResults.found &&
    factCheckResults.results.length > 0
  ) {
    console.log("Existing fact-checks found.");

    return {
      source: "google-fact-check",
      evidence: factCheckResults.results
    };
  }

  // Step 2: Wikipedia
//   console.log("No existing fact-check found.");
//   console.log("Searching Wikipedia...");

//   const wikipediaResults = await searchService(claim);

//   return {
//     source: "wikipedia",
//     evidence: wikipediaResults
//   };
// };


 console.log(
    "No existing fact-check found."
  );

  console.log(
    "Searching Wikidata..."
  );

  const wikidataResults =
    await wikidataService(claim);

  if (wikidataResults.length > 0) {
    return {
      source: "wikidata",
      evidence: wikidataResults
    };
  }

    return {
    source: "none",
    evidence: [],
    message:
      "No reliable evidence was retrieved."
  };
};

module.exports = retrievalService;