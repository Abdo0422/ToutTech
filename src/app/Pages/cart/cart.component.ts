import { Component } from '@angular/core';
import { CartService } from '../../Services/cart.service';
import { CartItem } from '../../model/CartItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  quantity: number = 1;
  cartItems: CartItem[] = [];

  constructor(private router: Router,private cartService: CartService)  {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });
  }
  validerCommande() {
    this.router.navigate(['/Paiement'], { state: { cartItems: this.cartItems } });
  }
 calculateSubtotal(): number {
    let subtotal = 0;
    for (let item of this.cartItems) {
      subtotal += item.price * item.quantity;
    }
    return subtotal;
  }
  calculateTotal(item: any): number {
    return item.price * item.quantity;
  }

  increase(item: any) {
    item.quantity++;
  }

  decrease(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
    }
  }
  updateCart() {
    this.cartItems.forEach(item => {
      this.cartService.updateCartItem(item).subscribe(updatedItem => {
        console.log('Item updated:', updatedItem);
        window.location.reload();
      });
    });
  }
  deleteItem(index: number) {
    const itemId = this.cartItems[index].id;
    this.cartService.deleteCartItem(itemId).subscribe(() => {
      this.cartItems.splice(index, 1);
      window.location.reload();
    });
  }
}

