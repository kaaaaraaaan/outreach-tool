import React from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useOutreachSiteStore } from '../store/outreachSiteStore';
import { useAuthStore } from '../store/authStore';
import type { OutreachSite } from '../types';

const outreachSiteSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  domainRating: z.number().min(0).max(100),
  price: z.number().min(0),
  traffic: z.number().min(0),
  linksAllowed: z.number().min(1),
  websiteType: z.string().min(1, 'Website type is required'),
  guidelines: z.string(),
});

type OutreachSiteForm = z.infer<typeof outreachSiteSchema>;

export default function OutreachSites() {
  const { sites, addSite } = useOutreachSiteStore();
  const user = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState<OutreachSite | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OutreachSiteForm>({
    resolver: zodResolver(outreachSiteSchema),
  });

  const onSubmit = (data: OutreachSiteForm) => {
    addSite({
      ...data,
      addedBy: user?.name || 'Unknown',
    });
    setIsModalOpen(false);
    reset();
  };

  const columns = [
    { key: 'domain' as const, label: 'Domain', sortable: true },
    { key: 'domainRating' as const, label: 'DR', sortable: true },
    { key: 'price' as const, label: 'Price', sortable: true },
    { key: 'traffic' as const, label: 'Traffic', sortable: true },
    { key: 'linksAllowed' as const, label: 'Links', sortable: true },
    { key: 'websiteType' as const, label: 'Type', sortable: true },
    { key: 'addedBy' as const, label: 'Added By', sortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Outreach Sites</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Site</span>
        </button>
      </div>

      <DataTable
        data={sites}
        columns={columns}
        onRowClick={setSelectedSite}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Outreach Site"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <input
              {...register('domain')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.domain && (
              <p className="mt-1 text-sm text-red-600">{errors.domain.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Domain Rating
              </label>
              <input
                {...register('domainRating', { valueAsNumber: true })}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Traffic
              </label>
              <input
                {...register('traffic', { valueAsNumber: true })}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Links Allowed
              </label>
              <input
                {...register('linksAllowed', { valueAsNumber: true })}
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website Type
            </label>
            <input
              {...register('websiteType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Guidelines
            </label>
            <textarea
              {...register('guidelines')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Site
            </button>
          </div>
        </form>
      </Modal>

      {selectedSite && (
        <Modal
          isOpen={!!selectedSite}
          onClose={() => setSelectedSite(null)}
          title="Site Details"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Domain</h4>
                <p>{selectedSite.domain}</p>
              </div>
              <div>
                <h4 className="font-medium">Domain Rating</h4>
                <p>{selectedSite.domainRating}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Price</h4>
                <p>${selectedSite.price}</p>
              </div>
              <div>
                <h4 className="font-medium">Traffic</h4>
                <p>{selectedSite.traffic}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium">Guidelines</h4>
              <p className="whitespace-pre-wrap">{selectedSite.guidelines}</p>
            </div>

            <div>
              <h4 className="font-medium">Added By</h4>
              <p>{selectedSite.addedBy}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}