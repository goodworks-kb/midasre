import { getActiveListings } from '@/lib/storage';
import Link from 'next/link';

export default function HomePage() {
  const listings = getActiveListings();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Midas Realty</h1>
            <Link
              href="/admin/login"
              className="text-gray-600 hover:text-gray-900"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Properties
          </h2>
          <p className="text-gray-600">
            Browse our selection of premium real estate listings
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No active listings at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {listing.photos.length > 0 ? (
                  <img
                    src={listing.photos[0]}
                    alt={listing.address.street}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${listing.price.toLocaleString()}
                  </div>
                  <div className="text-gray-600 mb-2">
                    {listing.address.street}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    {listing.address.city}, {listing.address.state} {listing.address.zip}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{listing.bedrooms} bed</span>
                    <span>{listing.bathrooms} bath</span>
                    <span>{listing.sqft.toLocaleString()} sqft</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded">
                      {listing.propertyType}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
