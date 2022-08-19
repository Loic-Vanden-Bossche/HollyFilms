import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import {animate, style, transition, trigger} from "@angular/animations";

export class NavBarButton {
  name: string = '';
  path?: string;
  action: () => void = () => {};

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
    trigger('onSearchBar', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        }),
        animate(
          '0.5s ease',
          style({
            opacity: 1,
            transform: 'translateY(0%)'
          })
        ),
      ]),
    ]),

  ]
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChildren('searchInput') searchInput: QueryList<ElementRef<HTMLInputElement>> | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly searchService: SearchService
  ) {}

  searchCtrl = new FormControl('');
  showSearchBar = false;

  navButtons: NavBarButton[] = [
    new NavBarButton('Accueil', '/home'),
    new NavBarButton('Ma liste', '/my-list'),
    new NavBarButton('Categories', undefined, () => console.log('TEST') ),
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
    this.searchService
      .onChange()
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

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  showSearch() {
    this.showSearchBar = !this.showSearchBar;
    this.searchCtrl
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
