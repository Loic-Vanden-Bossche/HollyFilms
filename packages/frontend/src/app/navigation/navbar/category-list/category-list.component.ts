import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MediaCategory } from '../../../shared/models/media.model';
import { Router } from '@angular/router';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export type MediaCategoryAndSelected = MediaCategory & { selected: boolean };

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent {
  @Input() categories: MediaCategoryAndSelected[] = [];
  @Output() close = new EventEmitter<void>();

  plusIcon = faPlusCircle;

  constructor(private readonly router: Router) {}

  getSelectedCategories(): string[] {
    return this.categories
      .filter((category) => category.selected)
      .map((category) => category.name);
  }

  onChangeCategory(category: MediaCategoryAndSelected) {
    if (!category.selected) {
      this.categories.forEach((c) => (c.selected = false));
    }
    category.selected = !category.selected;

    if (this.getSelectedCategories().length <= 0) {
      this.close.emit();
    }

    this.router.navigate(['/category'], {
      queryParams: { names: this.getSelectedCategories().join(',') },
    });
  }

  onAppendCategory(event: MouseEvent, category: MediaCategoryAndSelected) {
    event.stopPropagation();
    event.preventDefault();
    category.selected = true;
    this.router.navigate(['/category'], {
      queryParams: { names: this.getSelectedCategories().join(',') },
    });
  }
}
