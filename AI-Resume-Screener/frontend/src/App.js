import React, { useState } from "react";

function App() {
  const [job, setJob] = useState("");
  const [results, setResults] = useState([]);

  const searchResumes = async () => {
    if (!job.trim()) {
      alert("Please enter a job description");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/rag_match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ job })
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setResults(data);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "1000px", margin: "auto" }}>
      <h1>AI Resume Screener - RAG Version</h1>

      <textarea
        rows="8"
        placeholder="Enter Job Description"
        value={job}
        onChange={(e) => setJob(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "100%" }}
      />

      <br /><br />

      <button onClick={searchResumes} style={{ padding: "10px 20px" }}>
        Find Candidates
      </button>

      <h2 style={{ marginTop: "30px" }}>Top Matching Resumes</h2>

      {results.map((r, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
            backgroundColor: "#f9f9f9"
          }}
        >
          <p><strong>Resume ID:</strong> {r.resume_id}</p>
          <p><strong>Category:</strong> {r.category}</p>
          <p><strong>Resume Preview:</strong></p>
          <p>{r.resume_text}</p>
        </div>
      ))}
    </div>
  );
}

export default App;