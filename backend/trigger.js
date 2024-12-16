const nodemailer = require('nodemailer');
const axios = require('axios'); // For HTTP requests to trigger Zapier webhook

// Mock data for invoices, including overdue ones
const invoices = [
  { id: 1, amount: 100, dueDate: '2024-12-10', recipient: 'Client A', email: 'clienta@example.com', clientId: 'clientA01', zapierId: 'zapierA01', paid: false },
  { id: 2, amount: 200, dueDate: '2024-12-15', recipient: 'Client B', email: 'clientb@example.com', clientId: 'clientB01', zapierId: 'zapierB01', paid: true },
  { id: 3, amount: 150, dueDate: '2024-12-05', recipient: 'Client C', email: 'clientc@example.com', clientId: 'clientC01', zapierId: 'zapierC01', paid: false },
  { id: 4, amount: 300, dueDate: '2024-12-20', recipient: 'Client D', email: 'clientd@example.com', clientId: 'clientD01', zapierId: 'zapierD01', paid: false },
  { id: 5, amount: 250, dueDate: '2024-11-30', recipient: 'Client E', email: 'visarapu.rajeswari.21cse@bmu.edu.in', clientId: 'clientE01', zapierId: 'zapierE01', paid: true },
];

// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail or other SMTP service
  auth: {
    user: 'rajeswari6914@gmail.com', // Replace with your email
    pass: 'etri mhhy hldu cgbj', // Replace with your email app-specific password
  },
});

// Function to send reminder emails to overdue clients
async function sendEmailToOverdueClients() {
  try {
    console.log('Sending email reminders to overdue clients...');
    
    // Get overdue invoices
    const overdueInvoices = invoices.filter(invoice => new Date(invoice.dueDate) < new Date() && !invoice.paid);
    
    for (let invoice of overdueInvoices) {
      const mailOptions = {
        from: 'rajeswari6914@gmail.com', // Sender address
        to: invoice.email, // Recipient email
        subject: `Reminder: Invoice #${invoice.id} Overdue`, // Subject of the email
        text: `Dear ${invoice.recipient},\n\nThis is a reminder that your invoice #${invoice.id} of amount ${invoice.amount} is overdue. Please make the payment as soon as possible.\n\nThank you.`, // Email body
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log(`Sent reminder to ${invoice.email}`);
    }

    return { success: true, message: 'All overdue reminders sent successfully.' };
  } catch (error) {
    console.error('Error sending reminders:', error);
    return { success: false, message: 'Error sending overdue reminders.' };
  }
}

// Function to trigger Zapier webhook
async function triggerZapierWebhook() {
  const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/21018642/2sg8eyf/'; // Replace with your Zapier Webhook URL

  const data = {
    message: 'Overdue invoices reminder emails triggered',
    invoices: invoices.filter(invoice => new Date(invoice.dueDate) < new Date() && !invoice.paid),
  };

  try {
    const response = await axios.post(zapierWebhookUrl, data);
    console.log('Zapier Triggered:', response.data);
  } catch (error) {
    console.error('Error triggering Zapier:', error.message);
  }
}

module.exports = { sendEmailToOverdueClients, triggerZapierWebhook };
