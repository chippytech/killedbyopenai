export enum ProductType {
  MODEL = 'model',
  SERVICE = 'service'
}

export interface Product {
  name: string;
  description: string;
  dateClose: string;
  dateOpen: string;
  link: string;
  type: ProductType;
}

export type ProductWithSlug = Product & { slug: string };
