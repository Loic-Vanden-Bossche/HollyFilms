import { Injectable } from '@angular/core';
import { MediaCategoryAndSelected } from '../../navigation/navbar/category-list/category-list.component';
import { MediasService } from './medias.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private _selectedCategories: string[] = [];
  private _categories: MediaCategoryAndSelected[] = [];
  private _showingCategories = false;

  get categories() {
    return this._categories;
  }

  set categories(categories: MediaCategoryAndSelected[]) {
    this._categories = categories;
  }

  get selectedCategories() {
    return this._selectedCategories;
  }

  set selectedCategories(categoryNames: string[]) {
    this._selectedCategories = categoryNames;
    this.setSelectedCategories();
  }

  get isShowingCategories() {
    return this._showingCategories;
  }

  constructor(private readonly mediasService: MediasService) {}

  hideCategories() {
    this._showingCategories = false;
  }

  showCategories() {
    if (this._categories.length === 0) {
      this.getCategories().subscribe((categories) => {
        this._categories = categories;
        this._showingCategories = true;
      });
    }
    this._showingCategories = true;
  }

  getCategories() {
    return this.mediasService.getCategories().pipe(
      map((categories) =>
        categories.map((category) => ({
          ...category,
          selected: this._selectedCategories.includes(category.name),
        }))
      )
    );
  }

  appendSelectedCategories(categoryName: string) {
    this._selectedCategories.push(categoryName);
    this.setSelectedCategories();
  }

  removeFromSelectedCategories(categoryName: string) {
    this._selectedCategories = this._selectedCategories.filter(
      (name) => name !== categoryName
    );
    this.setSelectedCategories();
  }

  setSelectedCategory(categoryName: string) {
    this._selectedCategories = [categoryName];
    this.setSelectedCategories();
  }

  resetSelectedCategories() {
    this.selectedCategories = [];
  }

  setSelectedCategories() {
    this._categories = this._categories.map((category) => ({
      ...category,
      selected: this._selectedCategories.includes(category.name),
    }));
  }
}
