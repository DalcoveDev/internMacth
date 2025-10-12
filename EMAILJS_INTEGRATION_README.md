# EmailJS Integration for Contact Form

This document explains how to set up EmailJS to enable the contact form to send real emails instead of using the simulated submission.

## Overview

The contact form in `src/pages/Contact.tsx` has been updated to use EmailJS, a service that allows sending emails directly from the client-side using JavaScript. This eliminates the need for a backend server to handle email sending.

## Prerequisites

1. Node.js and npm installed
2. The project dependencies installed (`npm install`)
3. An email account you want to use for sending emails (Gmail, Outlook, etc.)

## Installation

EmailJS has already been installed in the project:
- `@emailjs/browser` - The EmailJS browser SDK

If you need to reinstall it:
```bash
npm install @emailjs/browser
```

## Setup Instructions

### 1. Create an EmailJS Account

1. Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### 2. Set Up Your Email Service

1. After logging in, go to the "Email Services" section
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication process to connect your email account
5. Once connected, note down the Service ID (you'll need this later)

### 3. Create an Email Template

1. Go to the "Email Templates" section
2. Click "Create New Template"
3. Design your email template. Include these variables in your template:
   - `{{name}}` - The sender's name
   - `{{email}}` - The sender's email address
   - `{{subject}}` - The email subject
   - `{{message}}` - The message content
4. Save the template and note down the Template ID

### 4. Get Your Public Key

1. Click on your profile icon in the top right
2. Select "Account" from the dropdown
3. Find your "Public Key" in the API Keys section

### 5. Configure Environment Variables

Update the `.env` file in the project root with your EmailJS credentials:

```env
VITE_API_URL=https://yourdomain.com/api
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the placeholder values with your actual EmailJS credentials.

### 6. Verify the Implementation

The contact form implementation in `src/pages/Contact.tsx` uses a utility function from `src/utils/emailConfig.ts` to load and validate the EmailJS configuration.

The form will:
- Check if EmailJS is properly configured
- Display an error message if not configured
- Send emails using EmailJS when properly configured
- Show success or error messages based on the result

## How It Works

1. When a user submits the contact form, the `handleSubmit` function is called
2. The function checks if EmailJS is properly configured using environment variables
3. If configured, it uses the EmailJS SDK to send the form data as an email
4. The result is displayed to the user (success or error message)

## Form Field Mapping

The EmailJS template should use these variable names to match the form fields:
- `name` - Full Name field
- `email` - Email Address field
- `subject` - Subject field
- `message` - Message field

## Testing

1. Start the development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out the form with test data
4. Submit the form
5. Check your email to confirm receipt

## Troubleshooting

### Common Issues

1. **Emails not sending**: 
   - Verify all environment variables are correctly set
   - Check that your EmailJS service is properly connected
   - Ensure your template variables match the form field names

2. **Configuration error message**:
   - Check that all three environment variables are set in `.env`
   - Verify that the values are not the placeholder values

3. **CORS or authentication errors**:
   - Ensure your EmailJS account is properly set up
   - Check that your service is correctly connected to your email provider

### Debugging

Check the browser console for any error messages from EmailJS. The implementation logs both success and error responses to the console.

## Security Notes

- The Public Key used by EmailJS is safe to expose in client-side code
- For production use, consider implementing additional security measures like:
  - Rate limiting
  - CAPTCHA
  - Email validation

## Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS React Examples](https://www.emailjs.com/docs/examples/reactjs/)