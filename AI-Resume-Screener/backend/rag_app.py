from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)

print("Loading model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("Model loaded successfully")

print("Loading dataset...")
df = pd.read_csv("Resume.csv")
print(f"Dataset loaded successfully. Total rows: {len(df)}")

resume_texts = df["Resume_str"].fillna("").tolist()

print(f"Creating embeddings for {len(resume_texts)} resumes...")
resume_embeddings = model.encode(
    resume_texts,
    batch_size=32,
    show_progress_bar=True,
    convert_to_numpy=True
)
print("Embeddings created successfully")

dimension = resume_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(resume_embeddings.astype("float32"))

print("FAISS index ready")

@app.route("/rag_match", methods=["POST"])
def rag_match():
    try:
        data = request.get_json()
        job_desc = data.get("job", "").strip()

        if not job_desc:
            return jsonify({"error": "Job description is required"}), 400

        job_embedding = model.encode(
            [job_desc],
            convert_to_numpy=True
        ).astype("float32")

        distances, indices = index.search(job_embedding, 5)

        results = []

        for i in indices[0]:
            results.append({
                "resume_id": int(df.iloc[i]["ID"]) if "ID" in df.columns else i,
                "category": df.iloc[i]["Category"] if "Category" in df.columns else "Unknown",
                "resume_text": resume_texts[i][:500]
            })

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)