# ChurnIQ — Customer Churn Intelligence Platform

ChurnIQ is an end-to-end customer churn intelligence platform that combines **machine learning, FastAPI, and an interactive web dashboard** to identify customers at risk of churn and turn predictions into actionable retention decisions.

The platform is designed around a simple business objective:

> **Identify churn risk, quantify the potential revenue exposure, and prioritize customers for retention action.**

---

## 1. Project Overview

Customer churn is not only a prediction problem; it is also a business decision problem.

ChurnIQ addresses both sides by providing:

- Customer churn prediction
- Customer risk assessment
- High-risk customer identification
- Revenue-at-risk analysis
- Revenue exposure metrics
- Retention prioritization
- Interactive analytics
- FastAPI-based prediction services
- Dashboard and model/API status monitoring

The platform uses the **Telco Customer Churn** dataset containing **7,043 customer records**.

### Dataset Summary

| Metric | Value |
|---|---:|
| Total Customers | 7,043 |
| Churned Customers | 1,869 |
| Active Customers | 5,174 |
| Churn Rate | 26.54% |
| Active Rate | 73.46% |
| Average Monthly Charges | $64.76 |
| Average Tenure | 32.37 months |

---

## 2. Key Features

### Customer Intelligence Dashboard

The dashboard provides a high-level view of the customer base, including:

- Total customers
- Churned customers
- Active customers
- Overall churn rate
- Customer retention distribution
- Average monthly charges
- Average customer tenure

### Churn Prediction

Users can enter customer information and submit it to the trained machine learning model through the FastAPI prediction service.

The prediction workflow provides:

- Churn probability
- Risk level
- Retention recommendation

### High-Risk Customer Identification

ChurnIQ displays customers ranked according to predicted churn probability.

The risk table includes:

- Customer ID
- Churn probability
- Risk level
- Recommended retention action

### Business Analytics

The Analytics section converts model output into business intelligence.

It includes:

- Revenue Exposure
- High-Risk Customer Count
- Revenue Share at Risk
- Average Risk Customer Value
- Financial Risk analysis
- Monthly recurring revenue exposure
- Retention insights

The current analytics view identifies approximately:

- **1,515 high-risk customers**
- **$119,452.65 monthly revenue exposure**
- **26.2% revenue share at risk**
- **$78.85 average monthly value for risk customers**

### Settings and Service Monitoring

The Settings section provides visibility into:

- FastAPI service status
- Prediction model status
- Prediction threshold
- Dashboard refresh controls
- Prediction clearing

---

## 3. Technology Stack

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- Machine Learning model
- REST API

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- Responsive dashboard interface

### Data & Machine Learning

- Pandas
- NumPy
- Scikit-learn
- Joblib / model serialization as applicable

---

## 4. Project Architecture

The platform follows a frontend/backend architecture:

```text
                    ┌─────────────────────────┐
                    │       ChurnIQ UI        │
                    │   HTML / CSS / JS       │
                    └────────────┬────────────┘
                                 │
                                 │ HTTP / JSON
                                 ▼
                    ┌─────────────────────────┐
                    │       FastAPI API       │
                    │     Python Backend      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Churn Prediction      │
                    │   Machine Learning Model │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Customer Churn Data   │
                    │    Telco Dataset        │
                    └─────────────────────────┘
```

---

## 5. Main API Endpoints

The frontend communicates with the FastAPI backend using:

```text
http://127.0.0.1:8000
```

### Dashboard Summary

```http
GET /dashboard/summary
```

Returns the customer-level dashboard statistics.

### High-Risk Customers

```http
GET /dashboard/risk-customers
```

Returns customers identified as high risk for display in the dashboard.

### Churn Prediction

```http
POST /predict/
```

Receives customer information and returns the churn prediction result.

---

## 6. Running the Project Locally

### Step 1 — Open the project

Open the ChurnIQ project folder in VS Code or another development environment.

### Step 2 — Create a virtual environment

Windows PowerShell:

```powershell
python -m venv venv
```

### Step 3 — Activate the environment

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell prevents activation, use the appropriate execution-policy setting for your local environment.

### Step 4 — Install dependencies

```powershell
pip install -r requirements.txt
```

### Step 5 — Start FastAPI

From the project root:

```powershell
python -m uvicorn app.main:app --reload
```

The API should become available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive documentation is normally available at:

```text
http://127.0.0.1:8000/docs
```

### Step 6 — Open the frontend

Open the frontend through your preferred local web server.

If your project is configured to serve the frontend from FastAPI, use the corresponding application URL.

Otherwise, use a local development server for the `frontend` directory.

For example, from the frontend directory:

```powershell
python -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

---

## 7. Frontend API Configuration

The frontend currently uses:

```javascript
const API_BASE_URL = "http://127.0.0.1:8000";
```

If the backend is hosted somewhere else, update this value in:

```text
frontend/script.js
```

For local development, the default configuration should remain unchanged.

---

## 8. Prediction Workflow

The prediction workflow is:

```text
Customer Information
        │
        ▼
Frontend Validation
        │
        ▼
POST /predict/
        │
        ▼
FastAPI
        │
        ▼
Machine Learning Model
        │
        ▼
Churn Probability
        │
        ▼
Risk Level
        │
        ▼
Retention Recommendation
```

This allows the platform to move from raw customer attributes to a business-oriented retention decision.

---

## 9. Analytics Workflow

The analytics workflow combines churn risk and customer financial value.

```text
High-Risk Customers
        │
        ├── Churn Probability
        │
        └── Monthly Charges
                │
                ▼
       Revenue Exposure Analysis
                │
                ▼
       Revenue at Risk
                │
                ▼
       Retention Intelligence
```

The purpose is to identify not only **who is likely to churn**, but also **where churn could have the greatest financial impact**.

---

## 10. Dashboard Navigation

The application contains the following main areas:

### Dashboard

Provides the overall customer intelligence summary.

### Customers

Displays high-risk customers and their retention actions.

### Predictions

Provides individual customer churn-risk assessment.

### Analytics

Provides business-focused churn and revenue intelligence.

### Settings

Displays API/model status and dashboard controls.

---

## 11. Project Structure

A typical project structure is:

```text
ChurnIQ/
│
├── app/
│   ├── main.py
│   ├── ...
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── models/
│   └── ...
│
├── data/
│   └── ...
│
├── requirements.txt
├── README.md
└── ...
```

The exact contents may vary depending on the final local project structure.

---

## 12. Important Files

### `app/main.py`

Main FastAPI application entry point.

### `frontend/index.html`

Defines the ChurnIQ dashboard interface.

### `frontend/style.css`

Contains the dashboard styling and responsive layout.

### `frontend/script.js`

Handles:

- API communication
- Dashboard updates
- Customer risk loading
- Churn prediction
- Navigation
- Analytics
- Settings/API status

### `requirements.txt`

Contains the Python dependencies required to run the project.

---

## 13. Security Notes

Do not include sensitive credentials in the submitted project.

Before sharing the project, check that the following are excluded:

```text
.env
venv/
__pycache__/
*.pyc
```

If environment variables or API credentials are required, provide a safe example configuration instead.

---

## 14. Example Business Insight

A key objective of ChurnIQ is to translate model predictions into business decisions.

For example:

> **1,515 high-risk customers represent approximately $119,452.65 in monthly recurring revenue exposure.**

This type of insight allows a business team to move beyond a simple churn classification and focus retention resources on customers who represent meaningful financial exposure.

---

## 15. Project Objectives

ChurnIQ was developed to demonstrate practical skills across:

- Data analysis
- Machine learning
- Customer churn modeling
- Business intelligence
- REST API development
- FastAPI
- Frontend/backend integration
- Data-driven decision support
- Financial risk analysis
- Retention strategy

---

## 16. Future Improvements

Potential future enhancements include:

- Model performance monitoring
- Automated model retraining
- Customer segmentation
- Explainable AI using SHAP
- Historical churn trend analysis
- Automated retention campaigns
- Authentication and role-based access
- Cloud deployment
- Database-backed customer management
- Advanced model monitoring

---

## 17. Author

**ChurnIQ — Customer Churn Intelligence Platform**

Built as an end-to-end Data Science / Machine Learning / Business Intelligence project demonstrating the integration of machine learning predictions with an interactive business decision-support interface.

---

## 18. Final Note

ChurnIQ is designed around a practical business question:

> **Which customers are most likely to churn, how much revenue is exposed, and where should retention efforts be focused?**

By connecting machine learning predictions with financial and customer intelligence, the platform provides a more actionable approach to customer churn management.
