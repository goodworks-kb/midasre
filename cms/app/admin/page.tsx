import { getAllListings } from '@/lib/storage';
import Link from 'next/link';

export default function AdminDashboard() {
  const listings = getAllListings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
        <Link
          href="/admin/listings/new"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
        >
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No listings yet.</p>
          <Link
            href="/admin/listings/new"
            className="text-primary hover:underline"
          >
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {listing.photos.length > 0 ? (
                        <img
                          className="h-12 w-12 rounded object-cover"
                          src={listing.photos[0]}
                          alt={listing.address.street}
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {listing.address.street}
                        </div>
                        <div className="text-sm text-gray-500">
                          {listing.address.city}, {listing.address.state} {listing.address.zip}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${listing.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {listing.bedrooms} bed / {listing.bathrooms} bath / {listing.sqft.toLocaleString()} sqft
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        listing.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : listing.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/listings/${listing.id}`}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      Edit
                    </Link>
                    <DeleteButton listingId={listing.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DeleteButton({ listingId }: { listingId: string }) {
  return (
    <form
      action={`/admin/listings/${listingId}/delete`}
      method="POST"
      className="inline"
    >
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm('Are you sure you want to delete this listing?')) {
            e.preventDefault();
          }
        }}
        className="text-red-600 hover:text-red-900"
      >
        Delete
      </button>
    </form>
  );
}
