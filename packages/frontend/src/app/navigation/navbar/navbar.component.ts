import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private readonly authService: AuthService) {}

  searchCtrl = new FormControl('');
  showSearchBar = true;

  navButtons = [
    { name: 'Accueil', path: '/home' },
    { name: 'Films', path: '/movies' },
    { name: 'Séries', path: '/tvs' },
    { name: 'Ma liste', path: '/my-list' },
  ];

  searchIcon = faMagnifyingGlass;

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  onSubmit(event: SubmitEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.onSearch();
  }

  onSearch() {
    this.showSearchBar = !this.showSearchBar;

    if (this.searchCtrl.value) {
      this.triggerSearch();
    }
  }

  triggerSearch() {
    console.log(this.searchCtrl.value);
    this.searchCtrl.setValue('');
  }
}
