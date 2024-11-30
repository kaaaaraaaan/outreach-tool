import React from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { useLinkMappingStore } from '../store/linkMappingStore';
import { useClientStore } from '../store/clientStore';
import { useOutreachSiteStore } from '../store/outreachSiteStore';
import type { LinkMapping } from '../types';

const linkMappingSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  mappedBy: z.string().min(1, 'Mapped by is required'),
  anchorText: z.string().min(1, 'Anchor text is required'),
  destinationUrl: z.string().url('Must be a valid URL'),
  googleDoc: z.string().url('Must be a valid URL'),
  approvedBy: z.string(),
  liveUrl: z.string().url('Must be a valid URL'),
  clientId: z.string().min(1, 'Client is required'),
  outreachSiteId: z.string().min(1, 'Outreach site is required'),
});

type LinkMappingForm = z.infer<typeof linkMappingSchema>;

export default function LinksMapping() {
  const { mappings, addMapping } = useLinkMappingStore();
  const { clients } = useClientStore();
  const { sites } = useOutreachSiteStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedMapping, setSelectedMapping] = React.useState<LinkMapping | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<LinkMappingForm>({
    resolver: zodResolver(linkMappingSchema),
  });

  const selectedClientId = watch('clientId');
  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const onSubmit = (data: LinkMappingForm) => {
    // Check if the outreach site has been used for this client
    const existingMapping = mappings.find(
      (m) => m.outreachSiteId === data.outreachSiteId && m.clientId === data.clientId
    );

    if (existingMapping) {
      alert('This outreach site has already been used for this client!');
      return;
    }

    addMapping(data);
    setIsModalOpen(false);
    reset();
  };

  const columns = [
    { key: 'domain' as const, label: 'Domain', sortable: true },
    { key: 'mappedBy' as const, label: 'Mapped By', sortable: true },
    { key: 'anchorText' as const, label: 'Anchor Text', sortable: true },
    { key: 'approvedBy' as const, label: 'Approved By', sortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Links Mapping</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Mapping</span>
        </button>
      </div>

      <DataTable
        data={mappings}
        columns={columns}
        onRowClick={setSelectedMapping}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Link Mapping"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client
            </label>
            <select
              {...register('clientId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Outreach Site
            </label>
            <select
              {...register('outreachSiteId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select an outreach site...</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.domain} (DR: {site.domainRating})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Anchor Text
            </label>
            <select
              {...register('anchorText')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select an anchor...</option>
              {selectedClient?.requestedAnchors.map((anchor, index) => (
                <option key={index} value={anchor.anchor}>
                  {anchor.anchor}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mapped By
              </label>
              <input
                {...register('mappedBy')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Approved By
              </label>
              <input
                {...register('approvedBy')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Google Doc URL
            </label>
            <input
              {...register('googleDoc')}
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Live URL
            </label>
            <input
              {...register('liveUrl')}
              type="url"
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
              Add Mapping
            </button>
          </div>
        </form>
      </Modal>

      {selectedMapping && (
        <Modal
          isOpen={!!selectedMapping}
          onClose={() => setSelectedMapping(null)}
          title="Mapping Details"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Domain</h4>
                <p>{selectedMapping.domain}</p>
              </div>
              <div>
                <h4 className="font-medium">Mapped By</h4>
                <p>{selectedMapping.mappedBy}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium">Anchor Text</h4>
              <p>{selectedMapping.anchorText}</p>
            </div>

            <div>
              <h4 className="font-medium">Destination URL</h4>
              <a
                href={selectedMapping.destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {selectedMapping.destinationUrl}
              </a>
            </div>

            <div>
              <h4 className="font-medium">Google Doc</h4>
              <a
                href={selectedMapping.googleDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {selectedMapping.googleDoc}
              </a>
            </div>

            <div>
              <h4 className="font-medium">Live URL</h4>
              <a
                href={selectedMapping.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {selectedMapping.liveUrl}
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}