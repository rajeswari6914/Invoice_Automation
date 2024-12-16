const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser');
const { sendEmailToOverdueClients } = require('./trigger'); // Import the function to send emails

// Mock Invoices Data
const invoices = [
  { id: 1, amount: 100, dueDate: '2024-12-10', recipient: 'Client A', email: 'clienta@example.com', clientId: 'clientA01', zapierId: 'zapierA01', paid: false },
  { id: 2, amount: 200, dueDate: '2024-12-15', recipient: 'Client B', email: 'clientb@example.com', clientId: 'clientB01', zapierId: 'zapierB01', paid: false },
  { id: 3, amount: 150, dueDate: '2024-12-05', recipient: 'Client C', email: 'clientc@example.com', clientId: 'clientC01', zapierId: 'zapierC01', paid: false },
  { id: 4, amount: 300, dueDate: '2024-12-20', recipient: 'Client D', email: 'clientd@example.com', clientId: 'clientD01', zapierId: 'zapierD01', paid: false },
  { id: 5, amount: 250, dueDate: '2024-11-30', recipient: 'Client E', email: 'visarapu.rajeswari.21cse@bmu.edu.in', clientId: 'clientE01', zapierId: 'zapierE01', paid: true },
];

// Express setup
const app = express();
const port = 5000;

// Middleware setup
app.use(bodyParser.json());  // To parse JSON request body
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: '623077210535-p5840ajm4rs63munfqegs50r7fh20nb6.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Function to fetch invoices for the user
function getInvoicesForUser(userId) {
  return invoices;  // Return all invoices for now (could be filtered for a specific user)
}

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Invoice Automation System!');
});

// Google authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/dashboard');
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/google');
  }

  const userId = req.user.id;
  const userInvoices = getInvoicesForUser(userId);
  const overdueInvoices = userInvoices.filter(invoice => new Date(invoice.dueDate) < new Date() && !invoice.paid);

  res.send(`
    <html>
      <head>
        <title>Invoice Dashboard</title>
        <script>
          function sendReminder() {
            fetch('/send-email-reminder', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: '${userId}' })  // You can include any other data you need
            })
            .then(response => response.json())
            .then(data => {
              alert(data.message);  // Show success message
            })
            .catch(error => {
              alert('Error sending reminder: ' + error.message);
            });
          }
        </script>
      </head>
      <body>
        <h1>Welcome, ${req.user.displayName}</h1>
        <h2>Your Invoices</h2>
        <h3>All Invoices</h3>
        <ul>
          ${userInvoices.map(invoice => `
            <li>Invoice ID: ${invoice.id}, Amount: ${invoice.amount}, Due Date: ${invoice.dueDate}, Recipient: ${invoice.recipient}</li>
          `).join('')}
        </ul>
        <h3>Overdue Invoices</h3>
        <ul>
          ${overdueInvoices.map(invoice => `
            <li>Invoice ID: ${invoice.id}, Amount: ${invoice.amount}, Due Date: ${invoice.dueDate}, Recipient: ${invoice.recipient}</li>
          `).join('')}
        </ul>
        <button onclick="sendReminder()">Send Overdue Email Reminder</button>
        <br><br>
        <button onclick="window.location.href='/logout'">Logout</button>
      </body>
    </html>
  `);
});

// POST route to send email reminders
app.post('/send-email-reminder', async (req, res) => {
  try {
    const result = await sendEmailToOverdueClients();
    if (result.success) {
      res.status(200).json({ message: 'Overdue reminders sent successfully!' });
    } else {
      res.status(500).json({ message: 'Failed to send reminders.' });
    }
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
