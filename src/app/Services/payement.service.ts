import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaymentDetails } from '../model/PayementDetails';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  processPayment(paymentDetails: PaymentDetails): Observable<any> { 
    return this.http.post<any>(`${this.apiUrl}/processPayment`, paymentDetails)
      .pipe(
        catchError(error => {
          return throwError('Payment failed. Please try again later.');
        })
      );
  }
}
