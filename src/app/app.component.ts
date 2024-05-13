import { Component, OnDestroy , OnInit } from '@angular/core';
import { ProduitsService } from './Services/produits.service';
import { User } from './model/User';
import { AuthService } from './Services/auth.service';
import { Router, ActivatedRoute , NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import { CategoryService } from './Services/category.service';
import { Category } from './model/Category';
import { filter } from 'rxjs/operators';
import { CartService } from './Services/cart.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'ToutTech';
  electronicsData: any[] = [];
  loggedInUser: User | null = null;
  categories: Category[] = [];
  selectedCategory: any;
  showLoading: boolean = false;
  filteredProducts: any[] = [];
  searchTerm: string = '';
  isPopupVisible: boolean = false;
  itemCount: number = 0;


  showPopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  hidePopup(): void {
    this.isPopupVisible = false;
  }
  constructor( private dataService: ProduitsService, private authService: AuthService, private itemService: CategoryService, private router: Router, private route: ActivatedRoute , public cartService: CartService) {
    this.updateLoggedInUser();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showLoading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {

        setTimeout(() => {
          this.showLoading = false;
        }, 1000);
      }
      if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
      }
    });

  }

  ngOnInit() {
    this.cartService.getItemCount().subscribe(count => {
      this.itemCount = count;
    });
    this.dataService.getElectronics().subscribe((data: any) => {
      console.log('Received products data:', data);
      this.electronicsData = data;
    },
    (error) => {
      console.error('Failed to fetch products:', error);
    });
    this.itemService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.route.params.subscribe(params => {
      const categoryIndex = +params['id'];
      if (!isNaN(categoryIndex) && categoryIndex >= 0 && categoryIndex < this.electronicsData.length) {
        this.selectedCategory = this.electronicsData[categoryIndex];
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.searchTerm ="";
    });
  }
  getCartItemCount(): void {
    this.cartService.getItemCount().subscribe(count => {
      console.log('Item count:', count);
      this.itemCount = count;
    });
  }
  filterProducts(): void {
    console.log('Filtering products with search term:', this.searchTerm);
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = [];
    } else {

      this.filteredProducts = this.electronicsData
        .flatMap(category => category.subcategories.map((subcategory : any) => subcategory.products))
        .flat()
        .filter(product =>
          product.title &&
          product.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }
    console.log('Filtered products:', this.filteredProducts);
  }


  navigateToSubcategory(categoryId: number, subcategoryId: number): void {
    console.log('Navigating to subcategory with category ID:', categoryId, 'and subcategory ID:', subcategoryId);

    if (categoryId !== null && subcategoryId !== null) {
      console.log('Category ID:', categoryId);
      console.log('Subcategory ID:', subcategoryId);
      this.router.navigate(['Category', categoryId, 'subcategory', subcategoryId]);
    } else {
      console.error('Invalid category or subcategory ID');
    }
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }
  isSelectedCategory(category: Category): boolean {
    return this.selectedCategory && this.selectedCategory.id === category.id;
  }
  updateLoggedInUser(): void {
    this.authService.getLoggedInUser().subscribe(user => {
      this.loggedInUser = user;
    });
  }


  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  logout(): void {
    this.authService.logout();
    this.updateLoggedInUser();
    this.router.navigate(['/']);
  }
}
