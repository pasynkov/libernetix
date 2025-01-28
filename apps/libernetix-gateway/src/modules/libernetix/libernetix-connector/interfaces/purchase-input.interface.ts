export interface PurchaseInputProduct {
  name: string;
  price: number;
}

export interface PurchaseInput {
  currency: string;
  email: string;
  products: PurchaseInputProduct[];
  successRedirect: string;
  failureRedirect: string;
}
