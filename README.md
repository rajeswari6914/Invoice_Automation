# Invoice Automation System with Email Notification

## Overview
This project is an **Invoice Management System** that enables users to manage invoices and send automated email reminders to clients with overdue payments.The system uses **React.js** for the frontend, **Google OAuth** for authentication, and **Zapier Webhooks** for sending email notifications.

---

## Features
- **Secure Login**: Authenticate users using Google OAuth 2.0.
- **Invoice Management**: Fetch and display invoices, highlighting overdue ones.
- **Automated Email Notification**: Send email reminders to clients with overdue invoices using Zapier.
- **Responsive Design**: Clean and user-friendly interface built with React and CSS.

---

## Tech Stack
| Component       | Technology                  |
|------------------|-----------------------------|
| Backend          | node.js                     |
| Frontend         | React.js, CSS              |
| Authentication   | Google OAuth 2.0           |
| Email Service    | Zapier Webhooks            |


---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/rajeswari6914/Invoice_Automation.git
cd invoice-automation
```
### 2. Backend Setup
#### 2.1Navigate to the backend directory:
```bash
cd backend
```
#### 2.2 Install dependencies:
```bash
npm install
```
#### 2.3 Create a .env file in the root directory and add:
```bash
GOOGLE_CLIENT_ID=your-google-client-id
ZAPIER_WEBHOOK_URL=your-zapier-webhook-url
```
- Replace `your-google-client-id` with your Google OAuth Client ID.
- Replace `your-zapier-webhook-url` with your Zapier webhook URL.
  
#### Start the backend server:
```bash
node app.js
```
The backend will run on http://localhost:5000.
### 3. Frontend Setup
#### 3.1 Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```
#### 3.2 Install dependencies:
```bash
npm install
```
#### 3.3 Create a .env file in the frontend directory and add:
```bash
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```
Replace `your-google-client-id` with your Google OAuth `Client ID.`
#### 3.4 Start the frontend:
```bash
npm start
```
- The app will be available at http://localhost:3000.


### 4. Running the Application
1. Run the Backend First:
   - Start the backend server by navigating to the backend directory and running `node app.js.`
2. Run the Frontend:
   - Open a new terminal, navigate to the frontend directory, and `run npm start.`
3. Login:
   - Use Google OAuth to log in and access the application features.
### 5. How It Works
1. Google OAuth Login
    - Users authenticate securely via their Google account using OAuth 2.0.
      ![image](https://github.com/user-attachments/assets/bea35cea-a90b-497e-89dc-44326fc8b5ad)

2. Invoice Management
    - The app fetches and displays a list of invoices.
    - Overdue invoices are highlighted for easy identification.
      ![image](https://github.com/user-attachments/assets/bdbffe47-f6ce-4099-9182-94b4d48eaa90)

3. Email Notification
    - On triggering the email function, the app sends a POST request to the Zapier webhook.
    - Zapier processes the request and sends email notifications to overdue clients.
      ![image](https://github.com/user-attachments/assets/d6028074-e047-47d4-b96e-41f455a1aed7)

 - Sample Payload
```bash
{
  "client": "John Doe",
  "email": "john.doe@example.com",
  "amount": 150,
  "dueDate": "2024-12-20",
  "subject": "Invoice Due Reminder",
  "message": "Dear John Doe, your invoice of $150 is overdue. Please make the payment at the earliest."
}
```




