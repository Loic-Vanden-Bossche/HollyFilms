import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  faMagnifyingGlass,
  faRightFromBracket,
  faUserGear,
} from '@fortawesome/free-solid-svg-icons';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { SearchService } from '../../shared/services/search.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';
import { UsersService } from '../../shared/services/users.service';
import { CategoriesService } from '../../shared/services/categories.service';

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
    private readonly usersService: UsersService,
    private readonly route: ActivatedRoute,
    private readonly notificationsService: NotificationsService,
    private readonly router: Router,
    private readonly categoriesService: CategoriesService
  ) {}

  searchCtrl = new FormControl('');
  showSearchBar = false;

  navButtons: NavBarButton[] = [
    new NavBarButton('Accueil', '/home'),
    new NavBarButton('Ma liste', '/my-list'),
    new NavBarButton('Categories', undefined, () => {
      if (this.categoriesService.isShowingCategories) {
        this.categoriesService.hideCategories();
      } else {
        this.categoriesService.showCategories();
      }
    }),
  ];

  defaultProfilePictureUrl = 'assets/img/avatar-blank.png';
  profilePictureUrl = this.defaultProfilePictureUrl;

  searchIcon = faMagnifyingGlass;
  userGearIcon = faUserGear;
  logoutIcon = faRightFromBracket;

  get isShowingCategories() {
    return this.categoriesService.isShowingCategories;
  }

  ngAfterViewInit() {
    this.searchInput?.changes.subscribe((list: QueryList<ElementRef>) => {
      if (list.length > 0) {
        list.first.nativeElement.focus();
      }
    });
  }

  ngOnInit() {
    this.authService
      .onUserUpdated()
      .subscribe(
        (user) =>
          (this.profilePictureUrl = user?.picture
            ? this.usersService.getProfilePictureUrl(user.picture)
            : this.defaultProfilePictureUrl)
      );

    if (this.isAuthenticated) {
      let retrievedCategoryNames: string[] = [];
      if (this.router.url.startsWith('/category')) {
        retrievedCategoryNames =
          this.route.snapshot.queryParamMap.get('names')?.split(',') || [];
      }

      this.categoriesService.selectedCategories = retrievedCategoryNames;
      this.categoriesService.getCategories().subscribe((categories) => {
        this.categoriesService.categories = categories;
        if (retrievedCategoryNames.length > 0) {
          this.categoriesService.showCategories();
        }
      });
    }

    this.searchService
      .onClearControl()
      .subscribe(() => this.searchCtrl.setValue('', { emitEvent: false }));

    this.searchService
      .onChange()
      .pipe(skip(1))
      .subscribe((query) => {
        this.searchCtrl.setValue(query, { emitEvent: false });

        if (this.router.url.startsWith('/admin')) return;

        if (query) {
          this.router.navigate(['/search'], {
            queryParams: { q: query },
            queryParamsHandling: 'merge',
          });
        } else {
          this.router.navigate(['/home']);
        }
      });

    this.searchCtrl.valueChanges.subscribe((query) =>
      this.onSearch(query || '')
    );

    if (this.authService.isAdmin) {
      this.navButtons.push(new NavBarButton('Admin', '/admin'));
    }
  }

  openUserModal() {
    this.router.navigate([], {
      queryParams: {
        userAccount: true,
      },
      queryParamsHandling: 'merge',
    });
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  showSearch() {
    this.showSearchBar = !this.showSearchBar;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
      this.notificationsService.push({
        type: NotificationType.Neutral,
        message: 'Vous êtes maintenant déconnecté',
      });
    });
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
