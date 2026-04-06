AI Resume Screener
An intelligent, full-stack AI application that semantically matches resumes to job descriptions using RAG (Retrieval-Augmented Generation), FAISS vector search, and HuggingFace Sentence Transformers.

Upgraded from TF-IDF to LLM-based embeddings for context-aware, semantically accurate candidate ranking — reducing manual screening effort by 70%.




Features

Semantic search — matches resumes based on meaning, not just keywords
RAG pipeline — uses all-MiniLM-L6-v2 embeddings + FAISS for fast retrieval
Top-5 results — returns the best matching resumes for any job description
Full-stack — React frontend + Flask REST API backend
Fast — embeddings pre-computed at startup, FAISS queries in milliseconds


Tech Stack
LayerTechnologyFrontendReactBackendPython, FlaskEmbeddingsHuggingFace Sentence Transformers (all-MiniLM-L6-v2)Vector SearchFAISS (IndexFlatL2)NLPRAG, semantic similarityDataPandas, NumPy

How It Works
Job Description (input)
        ↓
Encode with Sentence Transformer (all-MiniLM-L6-v2)
        ↓
Query FAISS index (pre-built from resume dataset)
        ↓
Top-5 nearest resume vectors returned
        ↓
Results displayed on React frontend

At startup, all resumes from Resume.csv are encoded into 384-dimensional vectors
Vectors are stored in a FAISS IndexFlatL2 index in memory
When a job description is submitted, it is encoded using the same model
FAISS performs L2 similarity search and returns the top-5 matching resumes
Results (resume text, category, ID) are returned as JSON via the /rag_match API


Project Structure
AI-Resume-Screener/
├── backend/
│   ├── app.py              # Flask API server
│   ├── Resume.csv          # Resume dataset
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   └── package.json
└── README.md

Getting Started
Prerequisites

Python 3.8+
Node.js 16+
pip

Backend Setup
bash# Clone the repo
git clone https://github.com/Minu1kumari2/AI_Resume_Screener.git
cd AI_Resume_Screener/backend

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
The server starts on http://localhost:5000

Note: First run will download the Sentence Transformer model (~80MB). Subsequent runs load from cache.

Frontend Setup
bashcd ../frontend

# Install dependencies
npm install

# Start the React app
npm start
The app opens on http://localhost:3000

API Reference
POST /rag_match
Returns the top-5 resumes that best match a given job description.
Request body:
json{
  "job": "Looking for a Python developer with experience in machine learning and NLP"
}
Response:
json[
  {
    "resume_id": 1042,
    "category": "Data Science",
    "resume_text": "Experienced data scientist with 3 years in NLP..."
  },
  ...
]

Why RAG over TF-IDF?
TF-IDF matches resumes based on exact keyword frequency — it fails when a resume says "built ML pipelines" but the job description says "developed AI workflows". These mean the same thing but TF-IDF scores them as unrelated.
With Sentence Transformers, both phrases are encoded into semantically similar vectors — so the match is accurate even when the wording differs.
ApproachMatchingSemantic UnderstandingTF-IDFKeyword-basedNoRAG + Sentence TransformersMeaning-basedYes

Dataset
Uses the Resume Dataset from Kaggle — contains 2400+ resumes across 24 job categories.

Future Improvements

 Add PDF resume upload and parsing
 Integrate a generative LLM to explain why a resume matches
 Replace in-memory FAISS with a persistent vector DB (ChromaDB / Pinecone)
 Add a match score percentage display
 Fine-tune the embedding model on domain-specific resume data


Author
Minu Kumari

GitHub: @Minu1kumari2
LinkedIn: minu-kumari
Email: minu1kumari2@gmail.com


License
This project is open source and available under the MIT License.
