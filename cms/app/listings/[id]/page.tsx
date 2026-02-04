import { getListingById } from '@/lib/storage';
import { notFound } from 'next/navigation';

export default function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = getListingById(params.id);

  if (!listing || listing.status !== 'Active') {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Midas Realty</h1>
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Listings
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {listing.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {listing.photos.map((photo, index) => (
                <div key={index} className="relative h-64 md:h-96">
                  <img
                    src={photo}
                    alt={`${listing.address.street} - Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Images Available</span>
            </div>
          )}

          <div className="p-6">
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${listing.price.toLocaleString()}
              </div>
              <div className="text-xl text-gray-700 mb-2">
                {listing.address.street}
              </div>
              <div className="text-gray-600">
                {listing.address.city}, {listing.address.state} {listing.address.zip}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
              <div>
                <div className="text-sm text-gray-500">Bedrooms</div>
                <div className="text-lg font-semibold">{listing.bedrooms}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Bathrooms</div>
                <div className="text-lg font-semibold">{listing.bathrooms}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Square Feet</div>
                <div className="text-lg font-semibold">
                  {listing.sqft.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="text-lg font-semibold">{listing.propertyType}</div>
              </div>
            </div>

            {listing.mlsNumber && (
              <div className="mb-6">
                <div className="text-sm text-gray-500">MLS Number</div>
                <div className="text-lg font-semibold">{listing.mlsNumber}</div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
