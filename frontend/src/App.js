import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import './App.css'; // For additional styling (optional)

const App = () => {
  
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const mockInvoices = [
    { id: 1, amount: 100, dueDate: '2024-12-10', recipient: 'Client A', email: 'clienta@example.com', clientId: 'clientA01', zapierId: 'zapierA01', paid: false },
    { id: 2, amount: 200, dueDate: '2024-12-15', recipient: 'Client B', email: 'clientb@example.com', clientId: 'clientB01', zapierId: 'zapierB01', paid: false },
    { id: 3, amount: 150, dueDate: '2024-12-05', recipient: 'Client C', email: 'clientc@example.com', clientId: 'clientC01', zapierId: 'zapierC01', paid: false },
    { id: 4, amount: 300, dueDate: '2024-12-20', recipient: 'Client D', email: 'clientd@example.com', clientId: 'clientD01', zapierId: 'zapierD01', paid: false },
    { id: 5, amount: 250, dueDate: '2024-11-30', recipient: 'Client E', email: 'visarapu.rajeswari.21cse@bmu.edu.in', clientId: 'clientE01', zapierId: 'zapierE01', paid: true },
  ];

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUser({ name: decodedToken.name, email: decodedToken.email, token });
  };

  const handleLogout = () => {
    setUser(null);
    setInvoices([]);
  };

  const getInvoices = () => {
    setInvoices(mockInvoices);
  };

  const sendEmailsToDueClients = async () => {
    const overdueInvoices = invoices.filter((invoice) => new Date(invoice.dueDate) < new Date());
    if (overdueInvoices.length === 0) {
      alert("No overdue invoices to send emails to.");
      return;
    }

    try {
      for (const invoice of overdueInvoices) {
        const emailData = {
          client: invoice.client,
          amount: invoice.amount,
          dueDate: invoice.dueDate,
          email: invoice.email,
          subject: `Invoice Due: ${invoice.client}`,
          message: `Dear ${invoice.client},\n\nYour invoice of $${invoice.amount} is due on ${invoice.dueDate}. Please make the payment as soon as possible.\n\nBest regards,\nYour Company`,
        };

        const response = await axios.post("https://hooks.zapier.com/hooks/catch/21018642/2sg8eyf/", emailData);
        if (response.status === 200) {
          console.log(`Email sent successfully to ${invoice.client}`);
        }
      }

      alert("Emails sent to overdue clients!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("EMAIL SENT SUCCESSFULLY");
    }
  };
  
  return (
    <div className="app-container">
      {!user ? (
        <div className="login-container">
          <h1>Welcome to Invoice Manager</h1>
          <p>Please log in to access your invoices.</p>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log("Login Failed")}
          />
        </div>
      ) : (
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>Welcome, {user.name}</h1>
            <p>Email: {user.email}</p>
            <div className="action-buttons">
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
              <button onClick={getInvoices} className="btn btn-fetch">Fetch Invoices</button>
              <button onClick={sendEmailsToDueClients} className="btn btn-email">Send Emails to Due Clients</button>
            </div>
          </header>
          <main>
            <h2>Due Invoices</h2>
            {invoices.length > 0 ? (
              <ul className="invoice-list">
                {invoices.map((invoice) => (
                  <li key={invoice.id} className="invoice-item">
                    <div className="invoice-details">
                      <strong>{invoice.client}</strong>
                      <p>Amount: ${invoice.amount}</p>
                      <p>Due Date: {invoice.dueDate}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No invoices to display. Click "Fetch Invoices" to load data.</p>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;


