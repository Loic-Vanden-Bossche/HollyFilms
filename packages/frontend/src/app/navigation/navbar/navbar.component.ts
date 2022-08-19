import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MediasService } from '../../shared/services/medias.service';
import { MediaCategoryAndSelected } from './category-list/category-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';

export class NavBarButton {
  name = '';
  path?: string;
  action: () => void = () => void 0;

  constructor(name: string, path?: string, action?: () => void) {
    this.name = name;
    this.path = path;
    if (action) {
      this.action = action;
    }
  }
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  animations: [
    trigger('onDeploy', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)',
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 1,
            transform: 'translateY(0%)',
          })
        ),
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0%)',
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 0,
            transform: 'translateY(-100%)',
          })
        ),
      ]),
    ]),
  ],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChildren('searchInput') searchInput: QueryList<
    ElementRef<HTMLInputElement>
  > | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly searchService: SearchService,
    private readonly mediasService: MediasService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  searchCtrl = new FormControl('');
  showSearchBar = false;
  showCategories = false;
  categories: MediaCategoryAndSelected[] = [];

  navButtons: NavBarButton[] = [
    new NavBarButton('Accueil', '/home'),
    new NavBarButton('Ma liste', '/my-list'),
    new NavBarButton(
      'Categories',
      undefined,
      () => (this.showCategories = !this.showCategories)
    ),
  ];

  searchIcon = faMagnifyingGlass;

  ngAfterViewInit() {
    this.searchInput?.changes.subscribe((list: QueryList<ElementRef>) => {
      if (list.length > 0) {
        list.first.nativeElement.focus();
      }
    });
  }

  ngOnInit() {
    let retrievedCategoryNames: string[] = [];
    if (this.router.url.startsWith('/category')) {
      retrievedCategoryNames =
        this.route.snapshot.queryParamMap.get('names')?.split(',') || [];
    }
    this.mediasService.getCategories().subscribe((categories) => {
      this.categories = categories.map((category) => ({
        ...category,
        selected: retrievedCategoryNames.includes(category.name),
      }));

      if (retrievedCategoryNames.length > 0) {
        this.showCategories = true;
      }
    });

    this.searchService
      .onChange()
      .pipe(
        tap((query) => {
          if (query) {
            this.resetSelectedCategories();
            this.showCategories = false;
          }
        })
      )
      .subscribe((query) =>
        this.searchCtrl.setValue(query, { emitEvent: false })
      );
    this.searchCtrl.valueChanges.subscribe((query) =>
      this.onSearch(query || '')
    );

    if (this.authService.isAdmin) {
      this.navButtons.push(new NavBarButton('Admin', '/admin'));
    }
  }

  resetSelectedCategories() {
    this.categories.forEach((category) => (category.selected = false));
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  showSearch() {
    this.showSearchBar = !this.showSearchBar;
  }

  onSubmit(event: SubmitEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.onSearch(this.searchCtrl.value || '');
  }

  onSearch(query: string) {
    this.searchService.search = query;
  }
}
