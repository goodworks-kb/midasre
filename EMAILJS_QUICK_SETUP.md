# EmailJS Quick Setup Guide

## ⚡ Quick Setup (5-10 minutes)

### Step 1: Create EmailJS Account
1. Go to **[https://www.emailjs.com/](https://www.emailjs.com/)**
2. Click **"Sign Up"** (it's free - 200 emails/month)
3. Sign up with your email (or use Google/GitHub)

### Step 2: Add Gmail Service
1. After logging in, click **"Email Services"** in the left menu
2. Click **"Add New Service"**
3. Select **"Gmail"**
4. Click **"Connect Account"** and sign in with `midasrealtyonline@gmail.com`
5. Click **"Create Service"**
6. **Copy the Service ID** (looks like `service_xxxxxxx`) - you'll need this!

### Step 3: Create Email Template
1. Click **"Email Templates"** in the left menu
2. Click **"Create New Template"**
3. Fill in:
   - **Template Name:** `Contact Form Submission`
   - **Subject:** `New Contact Form Submission from {{from_name}}`
   - **Content:** Copy and paste this:
   ```
   New Contact Form Submission from Midas Realty Website
   
   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   Date: {{date}}
   
   Message:
   {{message}}
   
   ---
   This email was sent from the Midas Realty contact form.
   ```
4. Click **"Save"**
5. **Copy the Template ID** (looks like `template_xxxxxxx`) - you'll need this!

### Step 4: Get Your Public Key
1. Click **"Account"** → **"General"** in the left menu
2. Scroll down to **"API Keys"** section
3. Find **"Public Key"**
4. **Copy the Public Key** (looks like `xxxxxxxxxxxxxxxxxxxx`) - you'll need this!

### Step 5: Add Credentials to Website
1. Open the file `emailjs-config.js` in your project
2. Replace these three values:
   ```javascript
   window.EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID_HERE';      // Paste Service ID here
   window.EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID_HERE';   // Paste Template ID here
   window.EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';     // Paste Public Key here
   ```
3. Save the file

### Step 6: Deploy to Production
1. **Important:** The `emailjs-config.js` file is in `.gitignore` (for security)
2. You need to manually upload it to your production server
3. Or create it directly on GitHub Pages by:
   - Going to your GitHub repo
   - Clicking "Add file" → "Create new file"
   - Name it `emailjs-config.js`
   - Paste your credentials
   - Commit directly to `master` branch

### Step 7: Test It!
1. Go to your website: `https://midasre.goodworkskb.com/`
2. Submit the contact form
3. Check your email (`midasrealtyonline@gmail.com`)
4. You should receive the email within seconds!

## ✅ That's It!

Once configured, every contact form submission will automatically send an email to `midasrealtyonline@gmail.com`.

## 🔒 Security Note

The `emailjs-config.js` file contains your Public Key (which is safe to expose) but it's in `.gitignore` to keep your repo clean. You can commit it if you want - the Public Key is designed to be public.

## 🆘 Troubleshooting

**Not receiving emails?**
- Check spam folder
- Verify all three credentials are correct in `emailjs-config.js`
- Check browser console (F12) for errors
- Go to EmailJS dashboard → Logs to see if emails are being sent

**Getting errors?**
- Make sure `emailjs-config.js` is loaded before `script.js` in `index.html`
- Verify EmailJS SDK is loaded (check Network tab)
- Check that all three variables are set correctly

## 📧 Free Tier Limits

- **200 emails per month** (free)
- **2 email services** (free)
- **2 email templates** (free)

This should be plenty for a real estate website!
