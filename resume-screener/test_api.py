import requests

url = 'http://127.0.0.1:5000/rank-resumes'

data = {
    "job_description": "Looking for a data scientist skilled in NLP, Python, and machine learning.",
    "resumes": [
        "Alice has experience in NLP, machine learning, and Python development.",
        "Bob is a backend developer with Java and Spring Boot experience.",
        "Carol works in frontend development using React and JavaScript."
    ]
}

response = requests.post(url, json=data)
print(response.json())
