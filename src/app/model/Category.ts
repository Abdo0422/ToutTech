import { Subcategory } from "./Subcategory";

export class Category {
  id: number = 0;
  category: string = "";
  subcategories: Subcategory[] = [];
}
