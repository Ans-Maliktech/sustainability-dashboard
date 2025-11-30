Syntropy Sustainability Dashboard

Enterprise-grade environmental intelligence platform.
Designed to streamline sustainability reporting through automated ETL pipelines, SQL warehousing, and real-time impact visualization.

🚀 System Capabilities

1. Automated Ingestion Engine (ETL)

Drag-and-Drop Parsing: Custom Node.js engine ingests raw Excel (.xlsx) datasets.

Smart Validation: Automatically rejects invalid formats and prevents database corruption.

Atomic Transactions: Uses SQL TRUNCATE + BULK INSERT to ensure data consistency.

2. The "Syntropy" Visualization Layer

Real-time Aggregation: Backend logic instantly sums metrics (Carbon, Water, Energy) across thousands of rows.

Dynamic Trend Analysis: Line charts automatically map time-series data to visualize impact trajectories.

Dark Mode UI: Professional, high-contrast interface designed for executive presentations and lobby kiosks.

3. "Live Loop" Kiosk Mode

Auto-Refresh Protocol: The dashboard polls the server every 30 seconds to fetch new data without page reloads.

Zero-Touch Operation: Designed to run 24/7 on unmanned displays.

🛠️ Technical Architecture

Component

Technology

Role

Frontend

React + Vite

High-performance SPA with instant state updates.

Styling

Tailwind CSS

Utility-first styling for a scalable, responsive UI.

Backend

Node.js + Express

RESTful API handling data processing and routing.

Database

MySQL (Sequelize)

Relational storage for structured metric data.

Visuals

Chart.js

Canvas-based rendering for 60fps animations.

📸 Deployment & Usage

Prerequisites

Node.js (v18+)

MySQL Server (Local or Cloud)

Installation

# 1. Clone the Repository
git clone [https://github.com/Ans-Maliktech/sustainability-dashboard.git](https://github.com/Ans-Maliktech/sustainability-dashboard.git)

# 2. Install Dependencies
cd server && npm install
cd ../client && npm install

# 3. Configure Database
# Create a .env file in /server with your DB credentials.

# 4. Launch System
npm run dev


🛡️ Security & Administration

Protected Routes: Administrative features are locked behind the /admin gateway.

Sanitized Inputs: Backend protects against common injection attacks during file upload.

© 2025 Syntropy Tech. All Rights Reserved.
Building Order from Chaos.


---

### **Step 2: Push it "All the Way"**

Now that you have saved the file (`Ctrl + S`), let's send it to GitHub.

Run these commands in your VS Code terminal (Root folder):

```bash
git add .


(Stages the new README and any other changes)

git commit -m "Official rebranding to Syntropy Tech + Documentation"


(Saves the snapshot)

git push
** Developed by SyntropyTech **
