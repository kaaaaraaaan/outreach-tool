export type User = {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'agency' | 'outreach_manager';
};

export type RequestedAnchor = {
  id: string;
  text: string;
  url: string;
};

export type Client = {
  id: string;
  name: string;
  website: string;
  agencyId?: string;
  requestedAnchors: RequestedAnchor[];
};

export type OutreachSite = {
  id: string;
  domain: string;
  domainRating: number;
  price: number;
  traffic: number;
  linksAllowed: number;
  websiteType: string;
  guidelines: string;
  addedAt: Date;
  addedBy: string;
};

export type LinkMapping = {
  id: string;
  clientId: string;
  outreachSiteId: string;
  domain: string;
  anchorText: string;
  destinationUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  createdAt: Date;
};

export type Agency = {
  id: string;
  name: string;
  clients: string[];
};
