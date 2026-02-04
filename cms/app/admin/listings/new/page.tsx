import ListingForm from '@/components/ListingForm';

export default function NewListingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Listing</h1>
      <ListingForm />
    </div>
  );
}
