import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../model/Category';
import { Product } from '../model/Products';
import { map , catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:3000/electronics';

  constructor(private http: HttpClient) { }


  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }
  getProductsBySubcategoryId(subcategoryId: number): Observable<Product[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Product[]>(url).pipe(
      map((data: any[]) => {

        const products = data.flatMap(category => category.subcategories.find((subcategory : any) => subcategory.id === subcategoryId)?.products || []);
        return products;
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        throw 'Error occurred while fetching products';
      })
    );
  }

}

