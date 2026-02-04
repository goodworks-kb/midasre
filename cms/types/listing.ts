export interface Listing {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: 'House' | 'Condo' | 'Townhouse' | 'Land';
  description: string;
  status: 'Active' | 'Pending' | 'Sold';
  photos: string[];
  mlsNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFormData {
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: 'House' | 'Condo' | 'Townhouse' | 'Land';
  description: string;
  status: 'Active' | 'Pending' | 'Sold';
  photos: string[];
  mlsNumber?: string;
}
