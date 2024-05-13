import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../model/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) { }

  saveOrder(orderData: Order): Observable<Order> {
    orderData.id = this.generateUniqueId();
    return this.http.post<Order>(this.apiUrl, orderData);
  }
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }
  generateUniqueId(): number {
    return new Date().getTime();
  }
}
