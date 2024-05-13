import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProduitsService } from '../../Services/produits.service';
import { Product } from '../../model/Products';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  displayedProducts: Product[] = [];
  currentIndex: number = 0;
  interval: any;
  recommendedProducts: Product[] = [];

  constructor(private productService: ProduitsService) {}

  ngOnInit(): void {
    this.productService.getNewArrivals().subscribe((products) => {
      this.products = products;
      this.updateDisplayedProducts(this.products);
      this.startAutoSlide(this.products);
    });
    this.productService.getRecommendedProducts().subscribe((products) => {
      this.recommendedProducts = products;
      this.updateDisplayedProducts(this.recommendedProducts);
      this.startAutoSlide(this.recommendedProducts);
    });

  }

  nextSlide(products: Product[]) {
    if (this.currentIndex < products.length - 3) {
      this.currentIndex++;
      this.updateDisplayedProducts(products);
    }
  }

  prevSlide(products: Product[]) {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateDisplayedProducts(products);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startAutoSlide(products: Product[]): void {
    this.interval = setInterval(() => {
      this.nextSlide(products);
    }, 3000);
  }

  updateDisplayedProducts(products: Product[]) {
    this.displayedProducts = products.slice(
      this.currentIndex,
      this.currentIndex + 3
    );
  }

  trackMouseOver(productId: number): void {
    this.productService.updateClickCount(productId)
     
  }
}
