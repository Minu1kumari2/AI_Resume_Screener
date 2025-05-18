import React, { useState } from 'react';

function ResumeScreenerDashboard() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState(['']);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const addResumeField = () => {
    setResumes([...resumes, '']);
  };

  const handleResumeChange = (index, value) => {
    const newResumes = [...resumes];
    newResumes[index] = value;
    setResumes(newResumes);
  };

  const handleSubmit = async () => {
    setError('');
    setResults([]);

    if (!jobDescription.trim()) {
      setError('Job description is required');
      return;
    }
    if (resumes.some(r => !r.trim())) {
      setError('All resumes must have text');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/rank-resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          resumes: resumes
        })
      });
      if (!response.ok) {
        throw new Error('Backend error');
      }
      const data = await response.json();
      setResults(data.ranked_resumes);
    } catch (err) {
      setError('Something went wrong while sending data to the backend.');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Logo and Title */}
      <header style={styles.header}>
        <div style={styles.logo}>🤖</div>
        <h1 style={styles.title}>AI Resume Screener</h1>
      </header>

      {/* Job Description Input */}
      <section style={styles.section}>
        <label style={styles.label}><b>Job Description:</b></label><br />
        <textarea
          rows={4}
          style={styles.textarea}
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          placeholder="Enter job description here"
        />
      </section>

      {/* Resumes Input */}
      <section style={styles.section}>
        <label style={styles.label}><b>Resumes (text input):</b></label><br />
        {resumes.map((resume, i) => (
          <textarea
            key={i}
            rows={3}
            style={styles.textarea}
            value={resume}
            onChange={e => handleResumeChange(i, e.target.value)}
            placeholder={`Resume #${i + 1} text`}
          />
        ))}
        <button onClick={addResumeField} style={{...styles.button, ...styles.addButton}}>
          + Add Another Resume
        </button>
      </section>

      {/* Submit Button */}
      <section style={styles.section}>
        <button onClick={handleSubmit} style={styles.button}>
          Submit
        </button>
      </section>

      {/* Error Message */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Results Table */}
      {results.length > 0 && (
        <section style={styles.section}>
          <h3>Ranked Resumes</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Resume Index</th>
                <th style={styles.th}>Similarity Score</th>
                <th style={styles.th}>Resume Text</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, idx) => (
                <tr key={res.resume_index} style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>{res.resume_index}</td>
                  <td style={styles.td}>{res.similarity_score}</td>
                  <td style={styles.td}>{resumes[res.resume_index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: 'auto',
    padding: 30,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f7fc',
    borderRadius: 8,
    boxShadow: '0 0 15px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 40,
    marginRight: 15,
  },
  title: {
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    display: 'inline-block',
    color: '#222',
  },
  textarea: {
    width: '100%',
    fontSize: 14,
    padding: 10,
    borderRadius: 6,
    border: '1.5px solid #bbb',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 15,
    transition: 'background-color 0.3s ease',
  },
  addButton: {
    backgroundColor: '#28a745',
    marginTop: 10,
  },
  error: {
    color: '#cc0000',
    fontWeight: '600',
    marginTop: 10,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  tableHeaderRow: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  th: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  td: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    verticalAlign: 'top',
  },
  tableRowEven: {
    backgroundColor: '#f9fbff',
  },
  tableRowOdd: {
    backgroundColor: '#fff',
  }
};

export default ResumeScreenerDashboard;
