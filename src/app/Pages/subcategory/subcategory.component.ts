import { AuthService } from '../../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../Services/category.service';
import { Category } from '../../model/Category';
import { ActivatedRoute } from '@angular/router';
import { Subcategory } from '../../model/Subcategory';
import { ProduitsService } from '../../Services/produits.service';
import { CartService } from '../../Services/cart.service';
import { Product } from '../../model/Products';
import { CartItem } from '../../model/CartItem';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent implements OnInit {
  plusCherSelected: boolean = false;
  moinsCherSelected: boolean = false;
  enStockSelected: boolean = false;
  epuiseSelected: boolean = false;
  products: any[] = [];
  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  subcategoryId: number = 0;
  categoryName: string = '';
  subcategoryName: string = '';
  categoryId: number = 0;

  constructor(private authservice: AuthService ,private route: ActivatedRoute, private dataService: CategoryService , private productService: ProduitsService ,private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryIdParam = params.get('categoryId');
      this.categoryId = categoryIdParam !== null ? +categoryIdParam : 0;
      const subcategoryIdParam = params.get('subcategoryId');
      this.subcategoryId = subcategoryIdParam !== null ? +subcategoryIdParam : 0;
      this.fetchCategoryName();
      this.fetchSubcategoryName();
      this.fetchProductsBySubcategoryId(this.subcategoryId);
    });
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


  fetchCategoryName(): void {
    this.productService.getCategoryName(this.categoryId).subscribe(
      categoryName => {
        this.categoryName = categoryName;
        console.log('Category Name:', categoryName);
      },
      error => {
        console.error('Error fetching category name:', error);
      }
    );
  }


  fetchSubcategoryName(): void {
    this.productService.getSubcategoryName(this.subcategoryId).subscribe(
      subcategoryName => {
        this.subcategoryName = subcategoryName;
        console.log('Subcategory Name:', subcategoryName);
      },
      error => {
        console.error('Error fetching subcategory name:', error);
      }
    );
  }
  fetchProductsBySubcategoryId(subcategoryId: number): void {
    this.dataService.getProductsBySubcategoryId(subcategoryId).subscribe(
      products => {
        this.products = products;
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  selectOption(option: string) {
    if (option === 'plusCher') {
      this.plusCherSelected = true;
      this.moinsCherSelected = false;
    } else{
      this.plusCherSelected = false;
      this.moinsCherSelected = true;
    }
    this.sortProducts();
  }

  toggleStockFilter(option: string, isChecked: boolean) {
    if (option === 'enStock') {
      this.enStockSelected = isChecked;
    } else if (option === 'epuise') {
      this.epuiseSelected = isChecked;
    }
    this.filterProducts();
  }
  sortProducts() {
    if (this.plusCherSelected) {
      this.products.sort((a, b) => b.price - a.price);
    } else if (this.moinsCherSelected) {
      this.products.sort((a, b) => a.price - b.price);
    }

  }
  filterProducts() {

    this.products = this.products.filter(product => {
      if (this.enStockSelected && product.quantity <= 0) {
        return false;
      }
      if (this.epuiseSelected && product.quantity > 0) {
        return false;
      }
      return true
      
    });

  }
  isLoggedIn(): boolean {
    return this.authservice.isAuthenticated();
  }
}
