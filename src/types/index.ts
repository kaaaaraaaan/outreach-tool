export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'agency' | 'outreach_manager';
}

export interface Client {
  id: string;
  name: string;
  website: string;
  agencyId?: string;
  requestedAnchors: Array<{
    anchor: string;
    destinationUrl: string;
  }>;
}

export interface OutreachSite {
  id: string;
  domain: string;
  domainRating: number;
  price: number;
  traffic: number;
  linksAllowed: number;
  websiteType: string;
  guidelines: string;
  addedBy: string;
  addedAt: Date;
}

export interface LinkMapping {
  id: string;
  domain: string;
  mappedBy: string;
  anchorText: string;
  destinationUrl: string;
  googleDoc: string;
  approvedBy: string;
  liveUrl: string;
  clientId: string;
  outreachSiteId: string;
}

export interface Agency {
  id: string;
  name: string;
  clients: Client[];
}