import { Listing } from '@/types/listing';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LISTINGS_FILE = path.join(DATA_DIR, 'listings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize listings file if it doesn't exist
if (!fs.existsSync(LISTINGS_FILE)) {
  fs.writeFileSync(LISTINGS_FILE, JSON.stringify([], null, 2));
}

export function getAllListings(): Listing[] {
  try {
    const fileContents = fs.readFileSync(LISTINGS_FILE, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading listings:', error);
    return [];
  }
}

export function getListingById(id: string): Listing | null {
  const listings = getAllListings();
  return listings.find(listing => listing.id === id) || null;
}

export function getActiveListings(): Listing[] {
  const listings = getAllListings();
  return listings.filter(listing => listing.status === 'Active');
}

export function saveListing(listing: Listing): void {
  const listings = getAllListings();
  const index = listings.findIndex(l => l.id === listing.id);
  
  if (index >= 0) {
    listings[index] = listing;
  } else {
    listings.push(listing);
  }
  
  fs.writeFileSync(LISTINGS_FILE, JSON.stringify(listings, null, 2));
}

export function deleteListing(id: string): boolean {
  const listings = getAllListings();
  const filtered = listings.filter(l => l.id !== id);
  
  if (filtered.length === listings.length) {
    return false; // Listing not found
  }
  
  fs.writeFileSync(LISTINGS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
