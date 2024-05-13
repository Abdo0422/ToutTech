import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../model/CartItem';
import { Order } from '../../model/Order';
import { Router } from '@angular/router';
import { OrderService } from '../../Services/order.service';
import { AuthService } from '../../Services/auth.service';
import { User } from '../../model/User';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from '../../Services/cart.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { PaymentService } from '../../Services/payement.service';
import { PaymentDetails } from '../../model/PayementDetails';


@Component({
  selector: 'app-paiement',
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.css']
})
export class PaiementComponent implements OnInit {
  quantity: number = 1;
  cartItems: CartItem[] = [];
  selectedShippingOption: number | null = null;
  selectedPaymentMethod: string | null = null;
  cardNumber: string = "";
  expiryDate: string = "";
  cvv: string = "";
  showOnlinePayment: boolean = false;
  showCashPayment: boolean = false;
  formData: Order = new Order();
  loggedInUser: User | null = null;
  paymentDetails: PaymentDetails = new PaymentDetails();
  checkoutFormValid = false;
  paymentFormValid = false;
  isOrderFormComplete: boolean = false;
  isPaymentFormComplete: boolean = false;


  constructor(
    private router: Router,
    private orderService: OrderService,
    private userService: AuthService,
    private cartService: CartService,
    private paymentService: PaymentService,
    private authservice : AuthService
  ) { }

  paypalConfig: IPayPalConfig = {
    clientId: 'AQpX-JzadzVIAgt1XWlIyEGEHuPCi_CLthFTEVzTaRSzVfO2qbhAiFYliu_ZoP-jpsjRens1e9ac0pU0',
    currency: 'USD',
    createOrderOnClient: (data: any): ICreateOrderRequest => {
      return {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '10.00'
            },
            items: [
              {
                name: 'Item 1',
                quantity: '1',
                category: 'PHYSICAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: '10.00'
                }
              }
            ]
          }
        ]
      };
    }
  }

  onApprove(data: any) {
    console.log('Payment approved:', data);
  }

  onCancel() {
    console.log('Payment cancelled.');
  }

  onError(error: any) {
    console.error('Payment error:', error);
  }

  onSubmit() {
    this.authservice.getLoggedInUser().subscribe(
      loggedInUser => {
        if (loggedInUser) {
          this.formData.userId = loggedInUser.id;
          this.formData.userName = loggedInUser.username;
          this.formData.userEmail = loggedInUser.email;
          this.orderService.saveOrder(this.formData).subscribe(
            () => {
              console.log('Order saved successfully');
              this.isOrderFormComplete = true;
            },
            error => {
              console.error('Failed to save order:', error);
            }
          );
        } else {
          console.error('User is not logged in.');
        }
      },
      error => {
        console.error('Error getting logged-in user:', error);
      }
    );
  }
  processDebitCardPayment() {
    const paymentDetails = new PaymentDetails();
    paymentDetails.cardNumber = this.paymentDetails.cardNumber;
    paymentDetails.expiryDate = this.paymentDetails.expiryDate;
    paymentDetails.cvv = this.paymentDetails.cvv;

    this.paymentService.processPayment(paymentDetails).subscribe(
      () => {
        console.log('Payment successful');
        this.isPaymentFormComplete = true;
      },
      error => {
        console.error('Payment failed:', error);
      }
    );
  }


  combineSubmit(event: Event) {
    event.preventDefault();

    if (this.isOrderFormComplete && this.isPaymentFormComplete) {
      if (this.loggedInUser && this.loggedInUser.id) {
        const userCartItems = this.cartItems.filter(item => item.user_id === this.loggedInUser?.id);
        for (const cartItem of userCartItems) {
          this.cartService.deleteCartItem(cartItem.id).subscribe(
            () => {
              console.log(`Cart item with ID ${cartItem.id} deleted.`);
            },
            error => {
              console.error(`Failed to delete cart item with ID ${cartItem.id}:`, error);
            }
          );
        }
        this.router.navigate(['/thank-you']);
      } else {
        console.error('User not logged in or missing user ID.');
      }
    } else {
      console.error('Both forms must be complete before submitting.');
    }
  }


  ngOnInit(): void {
    this.userService.getLoggedInUser().pipe(
      map(user => {
        this.loggedInUser = user;
        if (user !== null && user !== undefined) {
          this.formData.userName = user.username;
          this.formData.userEmail = user.email;
        }
      }),
      catchError(error => {
        return of(null);
      })
    ).subscribe();
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCartItems().subscribe(
      (cartItems: CartItem[]) => {
        this.cartItems = cartItems;
        this.formData.cartItems = cartItems;
      },
      (error) => {
        console.error('Erreur lors du chargement des articles du panier:', error);
      }
    );
  }



  toggleOnlinePayment() {
    this.showOnlinePayment = !this.showOnlinePayment;
    if (this.showOnlinePayment) {
      this.showCashPayment = false;
    }
  }

  updateSelectedPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  payWithPayPal() {
    window.location.href = 'https://www.paypal.com';
  }

  calculateSubtotal() {
    let subtotal = 0;
    for (let item of this.cartItems) {
      subtotal += item.price;
    }
    return subtotal;
  }

  updateShippingCost(cost: number) {
    this.selectedShippingOption = cost;
  }

  calculateVAT() {
    const subtotal = this.calculateSubtotal();
    return parseFloat((subtotal * 0.1).toFixed(2));
  }

  calculateTotal() {
    const subtotal = this.calculateSubtotal();
    let total = subtotal;
    if (this.selectedShippingOption !== null) {
      total += this.selectedShippingOption;
    }
    total += this.calculateVAT();
    return parseFloat(total.toFixed(2));
  }
}
