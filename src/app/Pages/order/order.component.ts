import { Component, OnInit } from '@angular/core';
import { Order } from '../../model/Order';
import { OrderService } from '../../Services/order.service';
import { CartItem } from '../../model/CartItem';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  isPopupOpen: boolean = false;
  selectedCartItems: CartItem[] = [];


  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
      },
      error => {
        console.error('Error loading orders:', error);
      }
    );
  }
  showCartItemDetails(cartItems: CartItem[]) {
    this.selectedCartItems = cartItems;
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }
}
