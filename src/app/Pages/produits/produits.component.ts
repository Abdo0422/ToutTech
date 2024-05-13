import { Component, Input , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProduitsService } from '../../Services/produits.service';
import { CartService } from '../../Services/cart.service';
import { Product } from '../../model/Products';
import { CartItem } from '../../model/CartItem';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit{
  @Input() value: number = 0;

  increase() {
    this.value++;
  }

  decrease() {
    if (this.value > 0) {
      this.value--;
    }
  }
  product: any;
  categoryName: string = '';
  subcategoryName: string = '';
  similarProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProduitsService,
    private cartService: CartService,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.productService.getProductById(productId).subscribe(
        (data) => {
          this.product = data;
          this.fetchCategoryName(this.product.id_cat);
          this.fetchSubcategoryName(this.product.id_subcat);
          this.fetchSimilarProducts(this.product.id_cat);
        },
        (error) => {
          console.error('Error fetching product:', error);
        }
      );
    });
  }

  fetchCategoryName(productId: number) {
    this.productService.getCategoryName(productId).subscribe(
      (categoryName: string) => {
        console.log('Category Name:', categoryName);
        this.categoryName = categoryName;
      },
      (error) => {
        console.error('Error fetching category name:', error);
      }
    );
  }

  fetchSubcategoryName(productId: number) {
    this.productService.getSubcategoryName(productId).subscribe(
      (subcategoryName: string) => {
        this.subcategoryName = subcategoryName;
      },
      (error) => {
        console.error('Error fetching subcategory name:', error);
      }
    );
  }
  fetchSimilarProducts(categoryId: number) {
    this.productService.getSimilarProducts(categoryId).subscribe(
      (similarProducts: any[]) => {
        console.log('Similar products:', similarProducts);
        this.similarProducts = similarProducts.filter(product => product.id !== this.product.id);
        console.log('Filtered similar products:', this.similarProducts);
      },
      (error) => {
        console.error('Error fetching similar products:', error);
      }
    );
  }
  addToCart(productId: number) {
    this.productService.getProductById(productId).subscribe((product: Product) => {
      this.authservice.getUserId().subscribe(userId => {
        const cartItem: CartItem = {
          id: this.cartService.generateUniqueId(),
          product_id: product.id,
          name: product.title,
          price: product.price,
          quantity: 1,
          image: product.image,
          user_id: userId ?? 0
        };
        this.cartService.addToCart(cartItem).subscribe(
          () => {
            window.location.reload();
          }
        );
      });
    });
  }

  isLoggedIn(): boolean {
    return this.authservice.isAuthenticated();
  }
}
