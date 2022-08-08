import { Component, OnInit } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';

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

  navButtons = [
    { name: 'Accueil', path: '/home' },
    { name: 'Films', path: '/movies' },
    { name: 'Séries', path: '/tvs' },
    { name: 'Ma liste', path: '/my-list' },
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
