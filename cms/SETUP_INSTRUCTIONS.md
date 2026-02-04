# Quick Setup Instructions

## 1. Install Dependencies

```bash
cd cms
npm install
```

## 2. Set Admin Password (Optional)

Create a `.env.local` file in the `cms` directory:

```env
ADMIN_PASSWORD=your_secure_password_here
```

If not set, default password is `midas2024`.

## 3. Run Development Server

```bash
npm run dev
```

## 4. Access the Application

- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Default password: `midas2024` (or your custom password)

## 5. Start Managing Listings

1. Login to admin panel
2. Click "Add New Listing"
3. Fill in property details
4. Upload photos (drag & drop)
5. Save!

That's it! Your listings will automatically appear on the public site.
