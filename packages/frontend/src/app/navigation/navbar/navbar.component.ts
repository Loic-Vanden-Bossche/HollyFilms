import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';

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
})
export class NavbarComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly searchService: SearchService
  ) {}

  searchCtrl = new FormControl('');
  showSearchBar = true;

  navButtons: NavBarButton[] = [
    new NavBarButton('Accueil', '/home'),
    new NavBarButton('Ma liste', '/my-list'),
    new NavBarButton('Categories', undefined, () => console.log('TEST') ),
  ];

  searchIcon = faMagnifyingGlass;

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

  onSubmit(event: SubmitEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.onSearch(this.searchCtrl.value || '');
  }

  onSearch(query: string) {
    this.searchService.search = query;
  }
}
