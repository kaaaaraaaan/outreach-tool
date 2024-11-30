import React from 'react';
import DataTable from '../components/DataTable';
import { useOutreachSiteStore } from '../store/outreachSiteStore';
import { useLinkMappingStore } from '../store/linkMappingStore';
import { useClientStore } from '../store/clientStore';

export default function Database() {
  const { sites } = useOutreachSiteStore();
  const { mappings } = useLinkMappingStore();
  const { clients } = useClientStore();

  const data = sites.map((site) => {
    const siteLinks = mappings.filter((m) => m.outreachSiteId === site.id);
    const linkedClients = siteLinks.map((link) =>
      clients.find((c) => c.id === link.clientId)
    );

    return {
      id: site.id,
      domain: site.domain,
      domainRating: site.domainRating,
      usageCount: siteLinks.length,
      clients: linkedClients
        .filter((c): c is NonNullable<typeof c> => c !== undefined)
        .map((c) => c.name)
        .join(', '),
    };
  });

  const columns = [
    { key: 'domain' as const, label: 'Domain', sortable: true },
    { key: 'domainRating' as const, label: 'DR', sortable: true },
    { key: 'usageCount' as const, label: 'Usage Count', sortable: true },
    { key: 'clients' as const, label: 'Used By Clients', sortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Database</h1>
      </div>

      <DataTable data={data} columns={columns} />
    </div>
  );
}