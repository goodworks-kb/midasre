# EmailJS Setup Guide - Free Automated Email Sending

## Overview

EmailJS allows you to send emails directly from your website without a backend server. It has a **free tier** that includes **200 emails per month**, which should be sufficient for most real estate websites.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" (it's free)
3. Create an account with your email

## Step 2: Add Email Service

1. After logging in, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your preferred email provider)
4. Connect your Gmail account (`midasrealtyonline@gmail.com`)
5. Click **Create Service**
6. **Copy the Service ID** (you'll need this)

## Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Template Name:** Contact Form Submission

**Subject:** New Contact Form Submission from {{from_name}}

**Content:**
```
New Contact Form Submission

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Date: {{date}}

Message:
{{message}}

---
This email was sent from the Midas Realty contact form.
```

4. Click **Save**
5. **Copy the Template ID** (you'll need this)

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Find **Public Key** section
3. **Copy your Public Key**

## Step 5: Add Configuration to Your Website

Add these configuration variables to your `script.js` file. You can add them at the top of the file:

```javascript
// EmailJS Configuration
window.EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
window.EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
window.EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

**OR** create a separate config file (`emailjs-config.js`) and include it before `script.js`:

```javascript
// emailjs-config.js
window.EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
window.EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
window.EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

Then in `index.html`, add:
```html
<script src="emailjs-config.js"></script>
<script src="script.js"></script>
```

## Step 6: Initialize EmailJS

The EmailJS SDK is already included in `index.html`. The code will automatically use EmailJS if the configuration variables are set.

## Testing

1. Submit the contact form on your website
2. Check your email (`midasrealtyonline@gmail.com`)
3. You should receive the email automatically!

## Free Tier Limits

- **200 emails per month** (free)
- **2 email services** (free)
- **2 email templates** (free)

If you need more:
- **Paid plans start at $15/month** for 1,000 emails/month
- But 200/month should be plenty for a real estate website

## Security Note

The Public Key is safe to expose in your frontend code. EmailJS uses it to identify your account, but it doesn't grant full access. Your email service credentials are stored securely on EmailJS's servers.

## Troubleshooting

**Emails not sending?**
- Check browser console for errors
- Verify all three configuration variables are set correctly
- Make sure EmailJS service is connected properly
- Check EmailJS dashboard for error logs

**Fallback behavior:**
- If EmailJS is not configured, the form will fall back to opening the user's email client (mailto link)
- Submissions are still saved to the admin panel regardless

## Alternative: Formspree (Another Free Option)

If you prefer a simpler solution:
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up (free tier: 50 submissions/month)
3. Create a form
4. Update your contact form to submit to Formspree's endpoint

This requires changing the form action, but is even simpler than EmailJS.
