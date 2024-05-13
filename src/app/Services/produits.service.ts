import { Category } from '../model/Category';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/Products';
import { map , catchError ,flatMap } from 'rxjs/operators';
import { Observable ,throwError , of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getElectronics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/electronics`);
  }

  getNewArrivals(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/electronics`).pipe(
      map((data: any[]) => {
        if (!Array.isArray(data)) {
          console.error("Data received is not an array:", data);
          return [];
        }
        const allProducts: Product[] = [];
        data.forEach((category: any ) => {
          if (category && category.subcategories) {
            category.subcategories.forEach((subcategory: any )=> {
              if (subcategory && subcategory.products) {
                allProducts.push(...subcategory.products);
              } else {
                console.error("Subcategory or its products are undefined:", subcategory);
              }
            });
          } else {
            console.error("Category or its subcategories are undefined:", category);
          }
        });
        return allProducts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      })
    );
  }

  getRecommendedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/electronics`).pipe(
      map((data: any[]) => {
        if (!Array.isArray(data)) {
          console.error("Data received is not an array:", data);
          return [];
        }
        const recommendedProducts: Product[] = [];
        data.forEach(category => {
          if (category && category.subcategories) {
            category.subcategories.forEach((subcategory: any) => {
              if (subcategory && subcategory.products) {
                const recommendedInSubcategory = subcategory.products.filter((product: any) => product.clickcount > 0);
                recommendedProducts.push(...recommendedInSubcategory);
              } else {
                console.error("Subcategory or its products are undefined:", subcategory);
              }
            });
          } else {
            console.error("Category or its subcategories are undefined:", category);
          }
        });

        return recommendedProducts.sort((a, b) => b.clickcount - a.clickcount);
      }),
      catchError((error) => {
        console.error("Failed to get recommended products:", error);
        return throwError(error);
      })
    );
  }
  updateClickCount(productId: number): Observable<any> {
    return this.http.get<any>('http://localhost:3000/electronics').pipe(
      map((data: any) => {
        const product = data.find((item: any) => item.id === productId);
        if (product) {
          return product.id;
        } else {
          throw new Error('Product not found');
        }
      }),
      map((productId: number) => {
        return this.http.post<any>(`http://localhost:3000/electronics/${productId}/increment-click`, {});
      })
    );
  }

  getCategoryName(categoryId: number): Observable<string> {
    const url = `${this.baseUrl}/electronics`;
    return this.http.get<Category[]>(url).pipe(
      map((data: Category[]) => {
        console.log('Data from server:', data);
        const category = data.find(cat =>
          cat.subcategories.some((subcat: any) =>
            subcat.products.some((product: any) => product.id_cat === categoryId)
          )
        );
        console.log('Filtered category:', category);
        return category ? category.category : '';
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Error occurred while fetching category name');
      })
    );
  }


  getSubcategoryName(subcategoryId: number): Observable<string> {
    const url = `${this.baseUrl}/electronics`;
    return this.http.get<any[]>(url)
      .pipe(
        map((data: any[]) => {
          const subcategory = data
            .flatMap(category => category.subcategories)
            .find(subcat => subcat.id === subcategoryId);
          return subcategory ? subcategory.name : '';
        }),
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return '';
        })
      );
  }
  getProductById(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/electronics`;
    return this.http.get<Product[]>(url)
      .pipe(
        map((data: any[]) => {
          return data
            .flatMap(category => category.subcategories)
            .flatMap(subcategory => subcategory.products)
            .find(product => product.id === productId);
        }),
        catchError((error: any) => {
          console.error('An error occurred:', error);
          return [];
        })
      );
  }
  getSimilarProducts(productId: number): Observable<any[]> {
    const url = `${this.baseUrl}/electronics`;
    return this.http.get<Category[]>(url).pipe(
      map((data: Category[]) => {
        console.log('Data from server:', data);
        const category = data.find(cat =>
          cat.subcategories.some((subcat: any) =>
            subcat.products.some((product: any) => product.id_cat === productId)
          )
        );
        console.log('Filtered category:', category);
        return category ? category.subcategories.map(subcat => subcat.products.filter(product => product.id_cat === productId)).flat() : [];
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError('Error occurred while fetching category name');
      })
    );
  }

}
