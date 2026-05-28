export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface SocialLink {
  platform: string;
  href: string;
  ariaLabel: string;
}
