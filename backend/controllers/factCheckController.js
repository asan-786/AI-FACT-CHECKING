// const factCheckService = require("../services/factCheckService");

// const checkFact = async (req, res) => {
//     try {
//         const { claim } = req.body;

//         if (!claim) {
//             return res.status(400).json({
//                 message: "Claim is required"
//             });
//         }

//         console.log("Received claim:", claim);

//         const result = await factCheckService(claim);

//         res.json(result);

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Something went wrong"
//         });
//     }
// };

// module.exports = {
//     checkFact
// };







const retrievalService = require("../services/retrievalService");

const checkFact = async (req, res) => {
    try {
        const { claim } = req.body;

        if (!claim || !claim.trim()) {
            return res.status(400).json({
                message: "Claim is required"
            });
        }

        console.log("Received claim:", claim);

        const result = await retrievalService(claim);

        res.json({
            claim: claim,
            ...result
        });

    } catch (error) {
        console.error("Fact check error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    checkFact
};