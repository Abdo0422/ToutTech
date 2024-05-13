import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CartItem } from '../model/CartItem';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];
  private itemCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public itemCount$: Observable<number> = this.itemCountSubject.asObservable();
  private baseUrl = 'http://localhost:3000/cartitems';

  constructor(private http: HttpClient, private authService: AuthService) { }

  addToCart(product: CartItem): Observable<CartItem> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          product.user_id = userId;
          return this.getCartItems().pipe(
            switchMap((cart: CartItem[]) => {
              const existingItem = cart.find(item => item.product_id === product.product_id);
              if (existingItem) {
                existingItem.quantity += product.quantity;
                return this.updateCartItem(existingItem);
              } else {
                return this.http.post<CartItem>(this.baseUrl, product);
              }
            }),
            catchError(error => {
              throw 'Error in addToCart operation: ' + error;
            })
          );
        } else {
          throw 'User not logged in';
        }
      })
    );
  }

  updateCartItem(item: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/${item.id}`, item);
  }

  getCartItems(): Observable<CartItem[]> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.http.get<CartItem[]>(`${this.baseUrl}?user_id=${userId}`);
        } else {
          throw 'User not logged in';
        }
      }),
      catchError(error => {
        throw 'Error in getCartItems operation: ' + error;
      })
    );
  }

  getItemCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.authService.getUserId().subscribe(userId => {
        if (userId) {
          this.http.get<CartItem[]>(`${this.baseUrl}?user_id=${userId}`).subscribe(items => {
            observer.next(items.length);
            observer.complete();
          });
        }
      });
    });
  }

  deleteCartItem(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }

  generateUniqueId(): number {
    return new Date().getTime();
  }
  clearCartItemsOnServer(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}?userId=${userId}`);
  }
}
