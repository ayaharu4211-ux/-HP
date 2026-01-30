
export type PageId = 'home' | 'about' | 'services' | 'portfolio' | 'careers' | 'contact';

export interface NavItem {
  label: string;
  href: PageId;
}

export interface ProfileItem {
  id: string;
  label: string;
  value: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  image: string;
  description: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  fullContent: string;
}

export interface NewsItem {
  id: string;
  date: string;
  category: string;
  title: string;
}

export interface JobItem {
  id: string;
  title: string;
  dept: string;
  location: string;
  salary: string;
}

export interface ElementStyle {
  fontSize?: number;
}

export interface CompanyData {
  companyName: string;
  logoUrl: string;
  hero: {
    title: string;
    subTitle: string;
    description: string;
    bgImage: string;
    btnText: string;
  };
  news: NewsItem[];
  newsLabels: { title: string; sub: string };
  services: ServiceDetail[];
  serviceLabels: { title: string; sub: string; allBtn: string; detailBtn: string };
  portfolio: PortfolioItem[];
  portfolioLabels: { title: string; sub: string };
  careers: {
    title: string;
    description: string;
    sectionTitle: string;
    sectionSub: string;
    applyBtn: string;
    bgImage: string;
    jobs: JobItem[];
  };
  about: {
    title: string;
    description: string;
    sectionTitle: string;
    items: ProfileItem[];
  };
  contact: {
    title: string;
    sub: string;
    desc: string;
    email: string;
    phone: string;
    address: string;
    lineQr: string;
    instagramQr: string;
    lineLabel: string;
    instagramLabel: string;
    emailLabel: string;
    phoneLabel: string;
    addressLabel: string;
  };
  styles: Record<string, ElementStyle>;
}
