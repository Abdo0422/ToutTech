import { Component ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../Services/category.service';
import { Category } from '../../model/Category';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category = new Category();

  constructor(private itemService: CategoryService , private router :Router) { }

  ngOnInit(): void {
    this.itemService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log(categories)
    });
  }
  navigateToSubcategory(categoryId: number, subcategoryId: number): void {
    this.router.navigate(['Category', categoryId, 'subcategory', subcategoryId]);
  }
  onSelectCategory(category: Category): void {
    this.selectedCategory = category;
  }
  isSelectedCategory(category: Category): boolean {
    return this.selectedCategory && this.selectedCategory.id === category.id;
  }


}
