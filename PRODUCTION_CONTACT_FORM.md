# Contact Form - Production Setup Guide

## How It Works in Production

On the live website (`midasre.gooworkskb.com`), the contact form submission system works automatically:

### ✅ What Works Automatically

1. **localStorage Sharing**: Since both the main website and admin panel are on the same domain (`midasre.gooworkskb.com`), they share localStorage automatically. Submissions appear in the admin panel immediately.

2. **Form Submission Flow**:
   - User submits contact form on main website
   - Submission is saved to localStorage
   - Email is sent via EmailJS (if configured)
   - Admin can view submission in admin panel

### 📧 Email Configuration (Optional but Recommended)

To receive email notifications when someone submits the contact form:

1. **Set up EmailJS** (free tier: 200 emails/month):
   - Follow instructions in `EMAILJS_SETUP.md`
   - Create `emailjs-config.js` file with your credentials
   - Add it to `index.html` before `script.js`:
     ```html
     <script src="emailjs-config.js"></script>
     <script src="script.js"></script>
     ```

2. **EmailJS Configuration File** (`emailjs-config.js`):
   ```javascript
   window.EMAILJS_SERVICE_ID = 'your_service_id';
   window.EMAILJS_TEMPLATE_ID = 'your_template_id';
   window.EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```

### 🔒 Security Note

**Important**: Do NOT commit `emailjs-config.js` to Git if it contains real credentials. Add it to `.gitignore`:

```
emailjs-config.js
```

Instead, create `emailjs-config.js` directly on your production server/hosting platform.

### 📊 Viewing Submissions

1. Go to `https://midasre.gooworkskb.com/admin/`
2. Login with admin password
3. Click "Contact Submissions" tab
4. All submissions will appear in a table

### 🔄 How Data Persists

- **localStorage**: Works automatically on same domain (production)
- **JSON File**: `data/contact-submissions.json` can be used for backup/export
- **Email**: Sent via EmailJS (if configured)

### ⚠️ Important Notes

1. **Same Domain Required**: Both main site and admin panel must be on the same domain for localStorage to work
   - ✅ `midasre.gooworkskb.com` (main site)
   - ✅ `midasre.gooworkskb.com/admin/` (admin panel)
   - ❌ Different domains won't share localStorage

2. **Browser Storage**: localStorage is per-browser. If you view admin panel in a different browser than where form was submitted, you won't see the submission.

3. **Clearing Browser Data**: If users clear their browser data, localStorage is cleared. This is why EmailJS is recommended for permanent record keeping.

### 🧪 Testing in Production

1. Submit a test form on the live website
2. Check admin panel - submission should appear immediately
3. Check email (if EmailJS configured) - should receive email notification

### 🐛 Troubleshooting

**Submissions not appearing in admin panel?**
- Make sure you're accessing admin panel on the same domain as the main site
- Check browser console for errors (F12)
- Try refreshing the admin panel
- Check if localStorage is enabled in browser settings

**Emails not sending?**
- Verify EmailJS is configured correctly
- Check browser console for EmailJS errors
- Verify EmailJS service is connected and active
- Check EmailJS dashboard for error logs

**Form not submitting?**
- Check browser console for JavaScript errors
- Verify all form fields are filled correctly
- Check if JavaScript is enabled in browser

### 📝 Next Steps

1. Set up EmailJS for email notifications (recommended)
2. Test form submission on production site
3. Verify submissions appear in admin panel
4. Set up regular backups of `data/contact-submissions.json` if needed
