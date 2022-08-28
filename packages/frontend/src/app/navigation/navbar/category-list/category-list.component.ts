import { Component } from '@angular/core';
import { MediaCategory } from '../../../shared/models/media.model';
import { Router } from '@angular/router';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { CategoriesService } from '../../../shared/services/categories.service';

export type MediaCategoryAndSelected = MediaCategory & { selected: boolean };

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent {
  plusIcon = faPlusCircle;

  constructor(
    private readonly router: Router,
    private readonly categoriesService: CategoriesService
  ) {}

  get categories() {
    return this.categoriesService.categories;
  }

  onChangeCategory(category: MediaCategoryAndSelected) {
    if (category.selected) {
      this.categoriesService.removeFromSelectedCategories(category.name);
    } else {
      this.categoriesService.setSelectedCategory(category.name);
    }

    if (this.categoriesService.selectedCategories.length <= 0) {
      this.categoriesService.hideCategories();
    }

    this.router.navigate(['/category'], {
      queryParams: {
        names: this.categoriesService.selectedCategories.join(','),
      },
    });
  }

  onAppendCategory(event: MouseEvent, category: MediaCategoryAndSelected) {
    event.stopPropagation();
    event.preventDefault();
    this.categoriesService.appendSelectedCategories(category.name);
    this.router.navigate(['/category'], {
      queryParams: {
        names: this.categoriesService.selectedCategories.join(','),
      },
    });
  }
}
