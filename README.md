# Anomaly Expense Tracker

A small full-stack expense tracker that allows users to record expenses in different currencies, convert them into a selected home currency, and view a running total.

## Features

- Add expenses with a title, amount, and currency
- View all recorded expenses
- Delete expenses
- Select a home currency
- Convert expenses into the selected home currency
- Display a running total in the home currency
- Frontend and backend validation
- Loading and error states
- Responsive layout using plain CSS

## Tech Stack

### Backend

- Node.js
- Express
- CORS
- JavaScript

### Frontend

- React
- Vite
- Plain CSS
- JavaScript

### Storage

Expenses are stored in memory using an array on the Express server.

No database is used, so expense data is lost when the backend server restarts.

## Project Structure

```text
expense_tracker/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── expense_form.jsx
│       │   ├── expense_list.jsx
│       │   └── currency_selector.jsx
│       └── services/
│           └── api.js
│
└── .gitignore
```

## Requirements

- Node.js 18+ recommended
- npm

## Running the Backend

Open a terminal and navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

## Running the Frontend

Open a second terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm start
```

The frontend runs on:

```text
http://localhost:5173
```

Make sure the backend is running before using the application.

## Backend API

### Health Check

```http
GET /
```

### Get Expenses

```http
GET /expenses
```

Returns all currently stored expenses.

### Add Expense

```http
POST /expenses
```

Example request body:

```json
{
  "title": "Lunch",
  "amount": 500,
  "currency": "NPR"
}
```

### Delete Expense

```http
DELETE /expenses/:id
```

Example:

```http
DELETE /expenses/1
```

### Currency Conversion

```http
GET /convert?from=USD&to=NPR&amount=100
```

The frontend calls this backend endpoint rather than calling the external exchange-rate service directly.

## Exchange Rate API

The backend uses the **Frankfurter API** for currency exchange rates.

Frankfurter does not require an API key, so no API-key configuration or environment variables are required for currency conversion.

The Express backend makes the external request and returns the converted result to the React frontend.

## Supported Currencies

- USD
- NPR
- EUR
- INR
- GBP

## Error Handling

The application handles errors at both the frontend and backend levels.

### Backend

The backend validates:

- Missing or empty titles
- Missing amounts
- Invalid amounts
- Unsupported currencies
- Invalid expense IDs
- Invalid conversion parameters

The currency conversion endpoint also handles:

- External API failures
- Unexpected API responses
- Request timeouts

### Frontend

The frontend provides:

- Form validation messages
- Loading states
- API error messages
- Conversion error messages
- Delete loading state
- Empty expense state

If the backend is unavailable, the frontend displays an appropriate API error instead of crashing.

## Assumptions

- Expenses only need to persist while the backend server is running.
- The supported currency list is intentionally limited to the currencies required by the application.
- Exchange rates are retrieved when conversions are required and may change over time.
- Live currency conversion requires network access.
- The frontend and backend are run locally during development.

## Possible Improvements

With additional development time, the application could be improved with:

- Persistent database storage
- Conversion-rate caching
- Better currency formatting and localization
- Automated frontend and backend tests
- More granular conversion error handling
- Environment-based configuration for the backend URL
- Historical exchange-rate support
- Expense categories and filtering
- Authentication and user-specific expense data

## Development Notes

The project intentionally keeps the architecture simple and uses React state and effects without introducing unnecessary state-management libraries.

The backend acts as the intermediary between the frontend and the external exchange-rate service.

