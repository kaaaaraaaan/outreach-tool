import React from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useClientStore } from '../store/clientStore';
import { useLinkMappingStore } from '../store/linkMappingStore';
import type { Agency } from '../types';

const agencySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type AgencyForm = z.infer<typeof agencySchema>;

export default function Agencies() {
  const { clients } = useClientStore();
  const { mappings } = useLinkMappingStore();
  const [agencies, setAgencies] = React.useState<Agency[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedAgency, setSelectedAgency] = React.useState<Agency | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AgencyForm>({
    resolver: zodResolver(agencySchema),
  });

  const onSubmit = (data: AgencyForm) => {
    const newAgency: Agency = {
      id: crypto.randomUUID(),
      name: data.name,
      clients: [],
    };
    setAgencies([...agencies, newAgency]);
    setIsModalOpen(false);
    reset();
  };

  const columns = [
    { key: 'name' as const, label: 'Name', sortable: true },
    {
      key: 'clientCount' as const,
      label: 'Clients',
      sortable: true,
    },
  ];

  const agencyData = agencies.map((agency) => ({
    ...agency,
    clientCount: clients.filter((c) => c.agencyId === agency.id).length,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agencies</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Agency</span>
        </button>
      </div>

      <DataTable
        data={agencyData}
        columns={columns}
        onRowClick={setSelectedAgency}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Agency"
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
              Add Agency
            </button>
          </div>
        </form>
      </Modal>

      {selectedAgency && (
        <Modal
          isOpen={!!selectedAgency}
          onClose={() => setSelectedAgency(null)}
          title={`${selectedAgency.name} Details`}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Clients</h4>
              {clients.filter((c) => c.agencyId === selectedAgency.id).length === 0 ? (
                <p className="text-gray-500">No clients assigned</p>
              ) : (
                <ul className="list-disc pl-5">
                  {clients
                    .filter((c) => c.agencyId === selectedAgency.id)
                    .map((client) => (
                      <li key={client.id}>{client.name}</li>
                    ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="font-medium">Recent Links</h4>
              {mappings
                .filter((m) =>
                  clients
                    .filter((c) => c.agencyId === selectedAgency.id)
                    .some((c) => c.id === m.clientId)
                )
                .slice(0, 5)
                .map((mapping) => (
                  <div
                    key={mapping.id}
                    className="mt-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <p className="font-medium">{mapping.domain}</p>
                    <p className="text-sm text-gray-600">
                      {mapping.anchorText} → {mapping.destinationUrl}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}