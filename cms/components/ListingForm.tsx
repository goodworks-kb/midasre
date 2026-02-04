'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Listing, ListingFormData } from '@/types/listing';

interface ListingFormProps {
  listing?: Listing;
}

export default function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const isEditing = !!listing;

  const [formData, setFormData] = useState<ListingFormData>({
    address: listing?.address || {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    price: listing?.price || 0,
    bedrooms: listing?.bedrooms || 0,
    bathrooms: listing?.bathrooms || 0,
    sqft: listing?.sqft || 0,
    propertyType: listing?.propertyType || 'House',
    description: listing?.description || '',
    status: listing?.status || 'Active',
    photos: listing?.photos || [],
    mlsNumber: listing?.mlsNumber || '',
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError('');

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.filename;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploadedFiles],
      }));
    } catch (err) {
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
  });

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing ? `/api/listings/${listing.id}` : '/api/listings';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save listing');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Failed to save listing. Please try again.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Property Information</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              required
              value={formData.address.street}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              required
              value={formData.address.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              required
              maxLength={2}
              value={formData.address.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value.toUpperCase() },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              required
              value={formData.address.zip}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, zip: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Type
            </label>
            <select
              required
              value={formData.propertyType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  propertyType: e.target.value as ListingFormData['propertyType'],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="House">House</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Land">Land</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input
              type="number"
              required
              min="0"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input
              type="number"
              required
              min="0"
              step="0.5"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 0 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Square Footage
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.sqft}
              onChange={(e) =>
                setFormData({ ...formData, sqft: parseInt(e.target.value) || 0 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              required
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ListingFormData['status'],
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              MLS Number (Optional)
            </label>
            <input
              type="text"
              value={formData.mlsNumber || ''}
              onChange={(e) =>
                setFormData({ ...formData, mlsNumber: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photos
          </label>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <p className="text-gray-600">Uploading...</p>
            ) : (
              <>
                <p className="text-gray-600">
                  {isDragActive
                    ? 'Drop images here'
                    : 'Drag & drop images here, or click to select'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  JPEG, PNG, WebP (max 10MB each)
                </p>
              </>
            )}
          </div>

          {formData.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Listing' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}
