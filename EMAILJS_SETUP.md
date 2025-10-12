# EmailJS Setup Instructions

To enable the contact form to send real emails, you need to set up an EmailJS account and configure the service. Follow these steps:

## 1. Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## 2. Set Up Your Email Service

1. After logging in, click on "Email Services" in the dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Connect your email account by following the authentication process
5. Note down the Service ID (you'll need this later)

## 3. Create an Email Template

1. Go to "Email Templates" in the dashboard
2. Click "Create New Template"
3. Design your email template with the following variables:
   - `{{name}}` - for the sender's name
   - `{{email}}` - for the sender's email
   - `{{subject}}` - for the email subject
   - `{{message}}` - for the message content
4. Save the template and note down the Template ID

## 4. Get Your Public Key

1. Click on your profile icon in the top right corner
2. Select "Account" from the dropdown menu
3. Find your "Public Key" in the API Keys section

## 5. Update the Contact Form Code

In `src/pages/Contact.tsx`, replace the placeholder values with your actual EmailJS credentials:

```typescript
// Replace these values with your actual EmailJS credentials
const serviceId = 'YOUR_SERVICE_ID';      // Your EmailJS Service ID
const templateId = 'YOUR_TEMPLATE_ID';    // Your EmailJS Template ID
const publicKey = 'YOUR_PUBLIC_KEY';      // Your EmailJS Public Key
```

## 6. Test the Contact Form

1. Save all changes
2. Run your application
3. Navigate to the Contact page
4. Fill out the form and submit it
5. Check your email to confirm receipt

## Troubleshooting

If emails are not being sent:

1. Check that all credentials are correctly entered
2. Ensure your email service is properly connected
3. Verify that your template variables match the form field names
4. Check the browser console for any error messages
5. Make sure you're using the correct field names in your template:
   - `name` for the name field
   - `email` for the email field
   - `subject` for the subject field
   - `message` for the message field

For more detailed documentation, visit: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)