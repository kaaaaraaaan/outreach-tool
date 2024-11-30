import React from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useClientStore } from '../store/clientStore';
import type { Client } from '../types';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  website: z.string().url('Must be a valid URL'),
  agencyId: z.string().optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export default function Clients() {
  const { clients, addClient } = useClientStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = (data: ClientForm) => {
    addClient({
      ...data,
      requestedAnchors: [],
    });
    setIsModalOpen(false);
    reset();
  };

  const columns = [
    { key: 'name' as const, label: 'Name', sortable: true },
    { key: 'website' as const, label: 'Website', sortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        onRowClick={setSelectedClient}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              {...register('website')}
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
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
              Add Client
            </button>
          </div>
        </form>
      </Modal>

      {selectedClient && (
        <Modal
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          title="Client Details"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Name</h4>
              <p>{selectedClient.name}</p>
            </div>
            <div>
              <h4 className="font-medium">Website</h4>
              <p>{selectedClient.website}</p>
            </div>
            <div>
              <h4 className="font-medium">Requested Anchors</h4>
              {selectedClient.requestedAnchors.length === 0 ? (
                <p className="text-gray-500">No anchors requested</p>
              ) : (
                <ul className="list-disc pl-5">
                  {selectedClient.requestedAnchors.map((anchor, index) => (
                    <li key={index}>
                      {anchor.anchor} → {anchor.destinationUrl}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}