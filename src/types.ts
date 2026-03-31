export enum ServiceType {
  GRAPHIC_DESIGN = 'Graphic Design',
  VIDEO_EDITING = 'Video Editing',
  WEB_DEVELOPMENT = 'Web Development',
  META_MARKETING = 'Meta Marketing',
}

export interface WebDevFormData {
  projectName: string;
  clientName: string;
  contactInfo: string;
  goal: string;
  targetAudience: string;
  stylePreference: string;
  brandingGuideline: string;
  contentTypes: string;
  sectionCount: string;
  adminDashboard: string;
  specialFeatures: string;
  hostingStatus: string;
  management: string;
}

export interface PackageProposal {
  name: string;
  price: number;
  features: string[];
  description: string;
}

export interface AppState {
  step: 'service_selection' | 'web_dev_form' | 'ai_analysis' | 'package_selection' | 'contact_info';
  selectedService: ServiceType | null;
  formData: WebDevFormData | null;
  proposals: PackageProposal[] | null;
  selectedPackage: PackageProposal | 'custom' | null;
  customBudget?: number;
}
