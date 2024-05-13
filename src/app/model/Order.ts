import { CartItem } from "./CartItem";
import { PaymentDetails } from "./PayementDetails";

export class Order {
  id: number = 0;
  userId: number  = 0;
  userName: string = "";
  userEmail: string = "";
  address: string = "";
  phoneNumber: string = "";
  city: string = "";
  country: string = "";
  cartItems: CartItem[] = [];
  paymentMethod: string = "";
  paymentDetails: PaymentDetails | null = null;
}
