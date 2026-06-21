# Breast Cancer Risk Assessment Tool

> AI-powered web application that predicts breast cancer risk using 11 clinical parameters with 73% F1-score and 85% recall.

---

## Overview

This project is a full-stack machine learning web application that helps assess breast cancer risk based on clinical parameters. Users enter patient information and 11 medical factors, and the system provides an instant risk prediction with a downloadable PDF medical report.

**Key Objective:** Make breast cancer risk assessment accessible, fast, and free for everyone.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔮 **Risk Prediction** | Predicts breast cancer risk using 11 clinical parameters |
| 📊 **11 Parameters** | Age, tumour size, lymph nodes, stages, hormone status |
| 📄 **PDF Reports** | Generates professional medical reports automatically |
| ⚡ **Fast Response** | Results in under 5 seconds |
| 🔒 **No Login Required** | 100% free, zero friction user experience |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, CSS3 (Glassmorphism) |
| **Backend** | Flask, Python, REST APIs |
| **Machine Learning** | scikit-learn, Pandas, NumPy, Joblib |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **PDF Generation** | jsPDF |
| **Version Control** | Git, GitHub |

---

##  How It Works

┌─────────────────────────────────────────────────────────────┐
│ Step 1: Patient Information │
│ Name, Age, Contact Number, Address │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Clinical Parameters (11 Factors) │
│ • Age & Tumour Size • Lymph Nodes │
│ • Race & Marital Status • T, N, 6th Stages │
│ • Estrogen & Progesterone Status │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: AI Risk Assessment │
│ • 73% F1-Score, 85% Recall │
│ • Sub-5 second response time │
│ • Confidence score with prediction │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: PDF Medical Report │
│ • Professional formatted report │
│ • Downloadable & printable │
└─────────────────────────────────────────────────────────────┘


---

##  11 Clinical Parameters

| # | Parameter | Description |
|---|-----------|-------------|
| 1 | Age | Patient's age |
| 2 | Tumour Size | Size in millimeters |
| 3 | Nodes Examined | Lymph nodes checked |
| 4 | Nodes Positive | Nodes with cancer cells |
| 5 | Race | Ethnic background |
| 6 | Marital Status | Married/Single/etc. |
| 7 | T Stage | Tumour size and spread |
| 8 | N Stage | Lymph node involvement |
| 9 | 6th Stage | Overall cancer stage |
| 10 | Estrogen Status | Hormone receptor status |
| 11 | Progesterone Status | Hormone receptor status |

---

##  Model Performance

| Metric | Value |
|--------|-------|
| **F1-Score** | 73% |
| **Recall** | 85% |
| **Accuracy** | 79% |

> *In medical AI, recall is prioritized to minimize false negatives. Missing a cancer case is worse than a false alarm.*

---

##  Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | [breast-cancer-detection.vercel.app](https://breast-cancer-detection-ritik-vishwakarma-s-projects.vercel.app) |
| **Backend API** | [breast-candetector.onrender.com](https://breast-cancer-detection-gthe.onrender.com) |
| **API Health** | [breast-candetector.onrender.com/api/health](https://breast-cancer-detection-gthe.onrender.com/api/health) |

---

##  Project Structure
Breast_Cancer_Detection/
├── backend/
│ ├── app.py # Flask main application
│ ├── routes/ # API routes
│ │ ├── predict.py # Prediction endpoint
│ │ └── patient.py # Patient data endpoint
│ ├── services/ # Business logic
│ │ ├── ml_services.py # ML model loading & prediction
│ │ └── logger.py # Logging configuration
│ └── requirements.txt # Python dependencies
├── frontend/
│ ├── src/
│ │ ├── pages/ # React pages
│ │ │ ├── Home.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Predict.jsx
│ │ │ ├── Patientform.jsx
│ │ │ └── Result.jsx
│ │ ├── services/ # API services
│ │ │ └── api.js
│ │ └── styles/ # CSS files
│ │ └── App.css
│ ├── public/
│ └── package.json
├── artifacts/
│ ├── model.pkl # Trained ML model
│ └── preprocessor.pkl # Data preprocessor
├── users.json # User data storage
├── patients.json # Patient data storage
└── README.md
