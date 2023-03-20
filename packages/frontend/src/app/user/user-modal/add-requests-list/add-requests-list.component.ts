import { Component, OnInit } from '@angular/core';
import { TMDBMicroSearchResult } from '../../../shared/models/micro-tmdb-search-result.model';
import { AuthService } from '../../../shared/services/auth.service';
import { TmdbService } from '../../../shared/services/tmdb.service';
import { FormControl } from '@angular/forms';
import { debounceTime, of, switchMap, tap } from 'rxjs';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from '../../../shared/services/users.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { NotificationType } from '../../../shared/models/notification.model';

@Component({
  selector: 'app-add-requests-list',
  templateUrl: './add-requests-list.component.html',
})
export class AddRequestsListComponent implements OnInit {
  requestedMedias: TMDBMicroSearchResult[] = [];
  tmdbSearchResults: TMDBMicroSearchResult[] = [];
  addingRequest = false;

  loading = false;

  searchCtrl = new FormControl('');

  addIcon = faPlusCircle;

  constructor(
    private readonly authService: AuthService,
    private readonly tmdbService: TmdbService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  requestMedia(media: TMDBMicroSearchResult) {
    this.usersService.requestMedia(media.TMDB_id, media.mediaType).subscribe({
      next: (media) => {
        this.requestedMedias.push(media);
        this.tmdbSearchResults = [];
        this.searchCtrl.setValue('');
        this.addingRequest = false;
        this.notificationsService.push({
          type: NotificationType.Success,
          message: `Votre demande d'ajout de ${media.original_title} a bien été prise en compte.`,
        });
      },
      error: () => {
        this.notificationsService.push({
          type: NotificationType.Error,
          message: `Une erreur est survenue lors de la demande d'ajout de ${media.original_title}.`,
        });
      },
    });
  }

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        tap(() => (this.loading = true)),
        debounceTime(500),
        switchMap((query) =>
          !!query ? this.tmdbService.search(query?.trim() || '') : of([]),
        ),
        tap(() => (this.loading = false)),
      )
      .subscribe((value) => (this.tmdbSearchResults = value));
    this.authService
      .onUserUpdated()
      .subscribe(
        (user) => (this.requestedMedias = user?.addRequestedMedias || []),
      );
  }
}
