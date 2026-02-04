import { getListingById } from '@/lib/storage';
import { notFound } from 'next/navigation';
import ListingForm from '@/components/ListingForm';

export default function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = getListingById(params.id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Listing</h1>
      <ListingForm listing={listing} />
    </div>
  );
}
