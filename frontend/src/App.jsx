// import { useState } from "react";

// function App() {

//   const [claim, setClaim] = useState("");
//   const [listening, setListening] = useState(false);
//   const [result, setResult] = useState(null);

//   const startListening = () => {

//     const SpeechRecognition =
//       window.SpeechRecognition ||
//       window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech recognition is not supported in this browser.");
//       return;
//     }

//     const recognition = new SpeechRecognition();

//     recognition.lang = "en-IN";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => {
//       setListening(true);
//     };

//     recognition.onresult = (event) => {

//       const speechText =
//         event.results[0][0].transcript;

//       setClaim(speechText);
//     };

//     recognition.onend = () => {
//       setListening(false);
//     };

//     recognition.onerror = (event) => {

//       console.log("Speech error:", event.error);

//       setListening(false);
//     };

//     recognition.start();
//   };


//   const checkFact = async () => {

//     if (!claim.trim()) {
//       alert("Please speak a claim first.");
//       return;
//     }

//     try {

//       const response = await fetch(
//         "http://localhost:5000/api/fact-check",
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json"
//           },

//           body: JSON.stringify({
//             claim: claim
//           })
//         }
//       );

//       const data = await response.json();

//       setResult(data);

//     } catch (error) {

//       console.log("Error:", error);

//       alert("Unable to connect to backend.");

//     }
//   };


//   return (

//     <div>

//       <h1>AI Fact Checker</h1>


//       <button onClick={startListening}>

//         {listening
//           ? "🎤 Listening..."
//           : "🎤 Speak"}

//       </button>


//       <h2>Your Claim</h2>

//       <p>
//         {claim ||
//           "Speak something and your claim will appear here."}
//       </p>


//       <button onClick={checkFact}>
//         🔍 Check Fact
//       </button>

// {result && (
//     <div>

//         <h2>Fact Check Results</h2>

//         {!result.found && (
//             <p>{result.message}</p>
//         )}

//         {result.found &&
//             result.results.map((item, index) => (

//                 <div key={index}>

//                     <h3>
//                         {item.verdict}
//                     </h3>

//                     <p>
//                         <strong>Claim:</strong>{" "}
//                         {item.claim}
//                     </p>

//                     <p>
//                         <strong>Publisher:</strong>{" "}
//                         {item.publisher}
//                     </p>

//                     <p>
//                         <strong>Title:</strong>{" "}
//                         {item.title}
//                     </p>

//                     <p>
//                         <strong>Rating:</strong>{" "}
//                         {item.verdict}
//                     </p>

//                     <p>
//                         <strong>Date:</strong>{" "}
//                         {item.reviewDate}
//                     </p>

//                     <a
//                         href={item.url}
//                         target="_blank"
//                         rel="noreferrer"
//                     >
//                         Read Fact Check
//                     </a>

//                     <hr />

//                 </div>

//             ))
//         }

//     </div>
// )}

//     </div>

//   );
// }

// export default App;






import { useState } from "react";

function App() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Speech recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;

      console.log("Speech:", speechText);

      setClaim(speechText);
    };

    recognition.onerror = (event) => {
      console.error("Speech error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  // Fact check
  const checkFact = async () => {
    if (!claim.trim()) {
      alert("Please enter or speak a claim.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("Sending claim:", claim);

      const response = await fetch(
        "https://ai-fact-checking.onrender.com/api/fact-check",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            claim: claim,
          }),
        }
      );

      console.log("Backend status:", response.status);

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Fact check request failed."
        );
      }

      setResult(data);

    } catch (error) {
      console.error("Fact check error:", error);

      setError(
        error.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111318",
        color: "white",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "48px",
            marginBottom: "30px",
          }}
        >
          AI Fact Checker
        </h1>

        {/* Speak button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={startListening}
            disabled={listening}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {listening ? "🎙️ Listening..." : "🎤 Speak"}
          </button>
        </div>

        {/* Claim */}
        <div style={{ marginTop: "30px" }}>
          <h2>Your Claim</h2>

          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Enter your claim..."
            rows="4"
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "18px",
              boxSizing: "border-box",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Check button */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={checkFact}
            disabled={loading}
            style={{
              padding: "12px 25px",
              fontSize: "18px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Checking..." : "🔍 Check Fact"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#5c2020",
              borderRadius: "8px",
            }}
          >
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ marginTop: "40px" }}>
            <h2>Fact Check Results</h2>

            {/* Claim */}
            <div
              style={{
                padding: "20px",
                marginTop: "20px",
                background: "#1c1f26",
                borderRadius: "10px",
              }}
            >
              <h3>Claim</h3>

              <p style={{ fontSize: "18px" }}>
                {result.claim}
              </p>
            </div>

            {/* Source */}
            <div
              style={{
                padding: "20px",
                marginTop: "15px",
                background: "#1c1f26",
                borderRadius: "10px",
              }}
            >
              <h3>Evidence Source</h3>

              <p>
                {result.source || "Unknown"}
              </p>
            </div>

            {/* Evidence */}
            <h3 style={{ marginTop: "30px" }}>
              Evidence
            </h3>

            {result.evidence &&
            result.evidence.length > 0 ? (
              result.evidence.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: "#1c1f26",
                    padding: "20px",
                    marginBottom: "15px",
                    borderRadius: "10px",
                  }}
                >
                  <h3>
                    {item.title ||
                      item.claim ||
                      "Evidence"}
                  </h3>

                  {item.text && (
                    <p>
                      {item.text}
                    </p>
                  )}

                  {item.verdict && (
                    <p>
                      <strong>Verdict:</strong>{" "}
                      {item.verdict}
                    </p>
                  )}

                  {item.publisher && (
                    <p>
                      <strong>Publisher:</strong>{" "}
                      {item.publisher}
                    </p>
                  )}

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#61dafb",
                      }}
                    >
                      View Source
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: "20px",
                  background: "#1c1f26",
                  borderRadius: "10px",
                }}
              >
                <p>
                  No evidence was retrieved for this
                  claim.
                </p>

                {result.source === "wikipedia" && (
                  <p>
                    Wikipedia temporarily rate-limited
                    the request. Please try again later.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;