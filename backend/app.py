from flask import Flask
from flask_cors import CORS
import os
from routes.predict import predict_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(predict_bp, url_prefix='/api/predict')

@app.route('/')
def home():
    return {'status': 'ok', 'message': 'Breast Cancer Prediction API'}

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)