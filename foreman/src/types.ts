export interface TakeoffMarker {
  id: string;
  x: number;
  y: number;
  type: 'outlet' | 'breaker' | 'pipe' | 'junction_box' | 'cable_run';
  label: string;
  price: number;
}

export interface EstimatorItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export interface SupplierItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  stockStatus: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  category: string;
}
