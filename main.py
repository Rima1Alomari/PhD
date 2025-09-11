from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load model (ضع pkl في نفس المجلد)
vectorizer = joblib.load('tfidf_vectorizer.pkl')
model = joblib.load('lr_model.pkl')

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    features = vectorizer.transform([url])
    prediction = model.predict(features)[0]
    prob = model.predict_proba(features)[0][1] * 100  # Phishing probability
    return jsonify({
        'prediction': 'phishing' if prediction == 1 else 'legit',
        'probability': prob
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
