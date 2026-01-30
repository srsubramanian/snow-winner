# ServiceNow Change Ticket Compliance Dashboard

A web application for the controls team to review ServiceNow change tickets pending approval, surface compliance issues, and show how to fix them.

## Tech Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend:** Python + FastAPI
- **Data:** Mock APIs with pre-canned responses

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173

## Features

- View list of change tickets with compliance status
- Filter by status, priority, compliance level, and assignee
- Sort by date, priority, or compliance status
- Detailed view showing validation checklist
- Compliance badges (green/yellow/red) indicating ticket health

## Validation Rules

1. **Required Fields** - All mandatory fields must be filled
2. **Approval Chain** - Must have at least one approver assigned
3. **Testing Evidence** - Must have test results or evidence attached
4. **Change Window** - Must specify a valid change window
5. **Rollback Plan** - Must document rollback procedure

## Compliance Status Logic

- **Green (Compliant):** All 5 rules pass
- **Yellow (Warning):** 1-2 rules fail (warnings only)
- **Red (Non-compliant):** 3+ rules fail or any critical error

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List all tickets (with filters) |
| GET | `/api/tickets/{id}` | Get single ticket detail |
| GET | `/api/stats` | Dashboard summary stats |
