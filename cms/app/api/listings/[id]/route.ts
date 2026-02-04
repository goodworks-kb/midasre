import { NextRequest, NextResponse } from 'next/server';
import { getListingById, saveListing, deleteListing } from '@/lib/storage';
import { ListingFormData } from '@/types/listing';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listing = getListingById(params.id);
  
  if (!listing) {
    return NextResponse.json(
      { error: 'Listing not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ listing });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listing = getListingById(params.id);
    
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    const data: ListingFormData = await request.json();
    
    const updatedListing = {
      ...listing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    saveListing(updatedListing);
    
    return NextResponse.json({ success: true, listing: updatedListing });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const success = deleteListing(params.id);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Listing not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true });
}
