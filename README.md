# 🫁 Asthma and TB Risk Prediction 

## 📜 Description
This project builds an **AI-powered screening tool** to predict **asthma** and **tuberculosis (TB)** risk using **cough sound spectrograms** and **clinical features**. It includes:

---

## 🎯 Purpose
Respiratory diseases like **asthma** and **Tuberculosis** cause serious health challenges worldwide, especially in low-resource settings. Manual diagnosis can be slow, subjective, or inaccessible. This project aims to:
✅ Automate preliminary screening  
✅ Combine cough audio + clinical data for better accuracy  
✅ Provide an easy-to-use web interface  
✅ Demonstrate a complete AI workflow from training to frontend

---

## 🗂️ Repository Structure

```bash
TB_PROJ/
│
├── backend/
│   └── main.py
│
├── frontend/
│   ├── node_modules/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.ts
│
├── training/
│   ├── cough_only/
│   ├── sounds/
│   ├── spectograms/
│   ├── test.csv
│   ├── train.csv
│   ├── disease_predictor.h5
│   └── training.ipynb
│   
├── venv/
│
├── .gitignore
├── LICENSE
├── README.md
└── requirements.txt
            
```

---

## Dataset Link

We used the Respiratory Sounds dataset available on Kaggle:  
🔗 [https://www.kaggle.com/competitions/airs-ai-in-respiratory-sounds/data](https://www.kaggle.com/competitions/airs-ai-in-respiratory-sounds/data)

---


## Steps to Execute the Project

### 1. Setup Environment

a. **Create a virtual environment:**

```bash
python -m venv venv
```

b. **Activate your virtual environment:**

- **Windows:**
```bash
.venv\Scripts\activate
```

---

### 2. Install Dependencies

c. **Install from `requirements.txt`:**

```bash
pip install -r requirements.txt
```

---

### 3. Train the Model

d. **Run the Jupyter notebook from `training` folder** :

```bash
jupyter notebook training.ipynb
```

This will train the model and save it as `h5 format`.

---

## Backend Execution Steps

a. **Run Flask backend server:**

```bash
python backend/main.py
```

---

## Frontend Execution Steps

a. **Install frontend dependencies:**

```bash
npm install 
```

b. **Fix vulnerabilities (optional but recommended):**

```bash
npm audit fix
```

c. **Run the React frontend:**

```bash
npm run dev
```

---