# Batch Import Guide for OneKey MLS

## Overview

The batch import feature allows you to upload multiple properties at once from a CSV file exported from OneKey MLS.

## Supported File Formats

- **CSV (.csv)** - Comma-separated values
- **Excel files** - Must be saved as CSV first (File → Save As → CSV UTF-8)

## Converting Excel to CSV

If you have an Excel file (.xlsx) from OneKey MLS:

1. Open the Excel file
2. Go to **File → Save As**
3. Choose **CSV (Comma delimited) (*.csv)** or **CSV UTF-8 (Comma delimited) (*.csv)**
4. Save the file
5. Upload the CSV file in the admin panel

## How to Use

### Step 1: Export from OneKey MLS

Export your property listings from OneKey MLS as CSV or JSON.

### Step 2: Prepare Your File

#### CSV Format

Your CSV file should have a header row with column names, followed by data rows:

```csv
Street Address,City,State,Zip,Price,Bedrooms,Bathrooms,Square Feet,Property Type,Status,Description,MLS Number,Images
123 Main St,Flushing,NY,11355,$850000,4,3,2500,House,For Sale,Beautiful home...,MLS123,image1.jpg,image2.jpg
456 Oak Ave,Flushing,NY,11355,$1200000,5,4,3200,Condo,For Sale,Spacious condo...,MLS456,image3.jpg
```

**Important Notes:**
- Use commas to separate columns
- If a field contains commas, wrap it in quotes: `"123 Main St, Apt 4B"`
- Images should be comma-separated: `image1.jpg,image2.jpg,image3.jpg`
- Make sure the file is saved as UTF-8 encoding if it contains special characters

### Step 3: Upload in Admin Panel

1. Go to Admin Panel → Click "Batch Import" button
2. Select your CSV or JSON file
3. Review the preview (shows how many properties will be imported)
4. Click "Import All Properties"
5. Wait for import to complete
6. View results and check imported properties

## Field Mapping

The system automatically maps common MLS field names to our property format:

### Address Fields
- `Street`, `Street Address`, `Address`, `Property Address`
- `City`, `Property City`
- `State`, `Property State`, `ST`
- `Zip`, `Zip Code`, `Postal Code`

### Property Details
- `Price`, `List Price`, `Sale Price`, `Asking Price`
- `Bedrooms`, `Beds`, `Total Bedrooms`
- `Bathrooms`, `Baths`, `Total Bathrooms`
- `Square Feet`, `Sqft`, `Square Footage`, `Living Area`
- `Property Type`, `Prop Type`, `Type`
- `Category`, `Property Category` (residential/commercial)
- `Status`, `Listing Status`, `Sale Status`

### Additional Fields
- `Year Built`, `Year`, `Built`
- `Lot Size`, `Lot Sqft`
- `Description`, `Remarks`, `Public Remarks`, `Listing Remarks`
- `MLS Number`, `MLS`, `Listing ID`, `MLS ID`

### Images
- `Images`, `Photos`, `Photo URLs` (comma-separated or JSON array)
- `Image`, `Main Image`, `Primary Photo`, `Photo URL` (single image)

## Image Handling

### Multiple Images

**CSV:** Separate image URLs with commas
```csv
Images
image1.jpg,image2.jpg,image3.jpg
```

**JSON:** Use an array
```json
{
  "Images": ["image1.jpg", "image2.jpg", "image3.jpg"]
}
```

### Single Image

The first image becomes the main/featured image automatically.

## Auto-Detection

The system automatically:
- **Detects category** (residential vs commercial) based on property type
- **Maps status** (For Sale, For Rent, Sold) from various status formats
- **Handles missing fields** with sensible defaults
- **Parses addresses** from full address strings if separate fields aren't available

## Tips

1. **Images**: Make sure image URLs/paths are accessible. Use full URLs (https://...) or relative paths (images/listings/...)
2. **Required Fields**: At minimum, include address (street + city) and price
3. **Preview**: Always review the preview before importing
4. **Backup**: The system adds to existing properties, so your current listings won't be deleted
5. **Large Files**: For very large files (100+ properties), the import may take a few moments

## Troubleshooting

**"No valid properties found"**
- Check that your file has data rows (not just headers)
- Verify field names match common MLS formats
- Ensure at least address fields are present

**"Error parsing file"**
- Check for proper comma separation
- Ensure quoted values use double quotes: `"Value with, comma"`
- Verify file encoding is UTF-8 (especially if you have special characters)
- Make sure there are no extra commas at the end of rows
- Check that the header row matches the data rows (same number of columns)

**Images not showing**
- Verify image URLs are correct and accessible
- Check that image paths are relative to your site root or full URLs
- Ensure image file extensions are correct (.jpg, .png, etc.)

## Example CSV Template

```csv
Street Address,City,State,Zip,Price,Bedrooms,Bathrooms,Square Feet,Property Type,Status,Description,MLS Number,Images
123 Main Street,Flushing,NY,11355,$850000,4,3,2500,House,For Sale,"Beautiful 4-bedroom home in Flushing",MLS123456,https://example.com/image1.jpg,https://example.com/image2.jpg
456 Oak Avenue,Flushing,NY,11355,$1200000,5,4,3200,Condo,For Sale,"Spacious condo with great views",MLS789012,https://example.com/image3.jpg
```

## Example JSON Template

```json
[
  {
    "Street Address": "123 Main Street",
    "City": "Flushing",
    "State": "NY",
    "Zip": "11355",
    "Price": "$850000",
    "Bedrooms": 4,
    "Bathrooms": 3,
    "Square Feet": "2500",
    "Property Type": "House",
    "Status": "For Sale",
    "Description": "Beautiful 4-bedroom home in Flushing",
    "MLS Number": "MLS123456",
    "Images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }
]
```
