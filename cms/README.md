# Midas Realty CMS

A simple content management system for managing property listings, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Admin Panel**: Secure login and dashboard for managing listings
- **CRUD Operations**: Create, read, update, and delete property listings
- **Image Upload**: Drag-and-drop photo uploads with preview
- **Public Listings**: Beautiful public-facing page showing active listings
- **Listing Details**: Full detail pages with photo galleries
- **JSON Storage**: Simple file-based storage (easy to migrate to database later)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Dropzone** (for image uploads)

## Setup Instructions

### 1. Install Dependencies

```bash
cd cms
npm install
```

### 2. Set Admin Password (Optional)

Create a `.env.local` file in the `cms` directory:

```env
ADMIN_PASSWORD=your_secure_password_here
```

If not set, the default password is `midas2024`.

### 3. Create Required Directories

The app will automatically create the `data` directory and `public/listings` directory when you first run it, but you can create them manually:

```bash
mkdir -p data
mkdir -p public/listings
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at:
- **Public Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

### 5. Login to Admin Panel

1. Navigate to http://localhost:3000/admin/login
2. Enter the admin password (default: `midas2024` or your custom password from `.env.local`)
3. You'll be redirected to the admin dashboard

## Usage

### Adding a New Listing

1. Click "Add New Listing" button in the admin dashboard
2. Fill in all required fields:
   - Address (street, city, state, zip)
   - Price
   - Bedrooms, Bathrooms, Square Footage
   - Property Type (House, Condo, Townhouse, Land)
   - Description
   - Status (Active, Pending, Sold)
   - MLS Number (optional)
3. Upload photos by dragging and dropping or clicking to select
4. Click "Create Listing"

### Editing a Listing

1. Click "Edit" next to any listing in the admin dashboard
2. Modify any fields as needed
3. Add or remove photos
4. Click "Update Listing"

### Deleting a Listing

1. Click "Delete" next to any listing in the admin dashboard
2. Confirm the deletion

### Viewing Public Listings

- Navigate to http://localhost:3000 to see all active listings
- Click on any listing to see full details and photo gallery

## File Structure

```
cms/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── login/          # Login page
│   │   ├── listings/       # Listing management
│   │   └── page.tsx        # Admin dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication
│   │   ├── listings/       # Listing CRUD
│   │   └── upload/         # Image upload
│   ├── listings/           # Public listing pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   └── ListingForm.tsx     # Reusable listing form
├── lib/
│   ├── auth.ts             # Authentication utilities
│   └── storage.ts           # JSON file storage
├── types/
│   └── listing.ts          # TypeScript types
├── data/
│   └── listings.json        # Listing data (auto-created)
└── public/
    └── listings/            # Uploaded images
```

## Data Storage

Listings are stored in `data/listings.json`. This is a simple JSON file that's easy to:
- Backup
- Migrate to a database later
- Edit manually if needed

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Set these in your production environment:

- `ADMIN_PASSWORD`: Your secure admin password
- `NODE_ENV`: Set to `production`

### Database Migration

To migrate from JSON to a database:

1. Export current listings from `data/listings.json`
2. Import into your chosen database
3. Update `lib/storage.ts` to use database queries instead of file operations
4. The API routes will continue to work without changes

## Security Notes

- The current authentication is simple password-based (suitable for small teams)
- For production with multiple users, consider implementing:
  - NextAuth.js for proper authentication
  - User roles and permissions
  - Rate limiting on API routes
  - File upload size limits
  - Image validation and sanitization

## Troubleshooting

### Images not uploading
- Ensure `public/listings` directory exists and is writable
- Check file size limits (default is 10MB per image)

### Can't login
- Check that `.env.local` has the correct `ADMIN_PASSWORD` if you set one
- Default password is `midas2024`

### Listings not saving
- Ensure `data` directory exists and is writable
- Check console for error messages

## Support

For issues or questions, check the code comments or create an issue in the repository.
