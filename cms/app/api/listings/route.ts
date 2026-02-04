import { NextRequest, NextResponse } from 'next/server';
import { getAllListings, getActiveListings, saveListing, deleteListing, generateId } from '@/lib/storage';
import { Listing, ListingFormData } from '@/types/listing';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  if (status === 'active') {
    return NextResponse.json({ listings: getActiveListings() });
  }
  
  return NextResponse.json({ listings: getAllListings() });
}

export async function POST(request: NextRequest) {
  try {
    const data: ListingFormData = await request.json();
    
    const listing: Listing = {
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    saveListing(listing);
    
    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
