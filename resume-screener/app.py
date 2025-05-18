from flask import Flask, request, jsonify
from flask_cors import CORS 
import pickle
import string
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)
def simple_preprocess(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = text.split()
    return ' '.join(tokens)

# Load saved vectorizer once on startup
with open('tfidf_vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

@app.route('/rank-resumes', methods=['POST'])
def rank_resumes():
    data = request.json
    resumes = data.get('resumes', [])
    job_description = data.get('job_description', '')

    if not resumes or not job_description:
        return jsonify({'error': 'Please provide resumes and job_description'}), 400

    preprocessed_resumes = [simple_preprocess(r) for r in resumes]
    preprocessed_jd = simple_preprocess(job_description)

    # Use transform, not fit_transform
    vectors = vectorizer.transform(preprocessed_resumes + [preprocessed_jd])

    similarity_scores = cosine_similarity(vectors[-1], vectors[:-1]).flatten()

    ranked_indices = similarity_scores.argsort()[::-1]

    ranked_resumes = []
    for idx in ranked_indices:
        ranked_resumes.append({
            'resume_index': int(idx),  # Convert numpy int64 to int for JSON serialization
            'similarity_score': round(float(similarity_scores[idx]), 4)
        })

    return jsonify({'ranked_resumes': ranked_resumes})

@app.route('/test', methods=['GET'])
def test():
    return "API is working!"

if __name__ == '__main__':
    app.run(debug=True)
