export interface BusinessCard {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  image: string; // base64 encoded image
  createdAt: string;
  address?: string;
  website?: string;
  social?: string;
  industry?: string;
}

export enum AppView {
  LIST = 'list',
  SCANNER = 'scanner',
  FORM = 'form',
}