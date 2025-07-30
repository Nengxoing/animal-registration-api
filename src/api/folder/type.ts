
export interface FolderPriceItem {
  amount: number;
  price: {
    id: number;
    name: string;
    price: string;
    type: string;
  };
  multiple: number | null;
  total?: string;
}

export interface FolderItem {
  no: number;
  id: number;
  code: string;
  name: string;
  officeId: number;
  status: string;
  createdAt: string;
  number: any[];
  folderPrice: FolderPriceItem[];
  totalAmount?: string;
  totalPrice?: string;
}

export interface FolderServiceResponse {
  result: FolderItem[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface AnimalExportPayload {
  folderId: number;
  animalQuantity: number;
  animalForSend: number;
}

export interface AnimalExportResponseData {
  exportId: number;
  folderId: number;
  exportedAmount: number;
  remainingAmount: number;
  createdAt: string;
  message: string;
}

export interface AnimalExportItem {
  id: number;
  folderId: number;
  animalQuantity: number;
  animalForSend: number;
  exportDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  folder?: {
    id: number;
    name: string;
    billNumber: string;
    company?: {
      name: string;
      businessCode: string;
    };
  };
}

export interface AnimalExportServiceResponse {
  result: AnimalExportItem[];
  totalCount: number;
  page: number;
  limit: number;
}