import { Component, OnInit } from '@angular/core';
import { ListType, MediaWithType } from '../../shared/models/media.model';
import { MediasService } from '../../shared/services/medias.service';
import { AuthService } from '../../shared/services/auth.service';
import { mergeWith, tap } from 'rxjs';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
})
export class MyListComponent implements OnInit {
  medias: MediaWithType[] = [];

  loading = true;
  noData = false;

  constructor(
    private readonly mediasService: MediasService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService
      .onUserChanged()
      .pipe(mergeWith(this.mediasService.onInListChanged()))
      .subscribe(() => {
        this.loading = true;
        this.mediasService
          .getAllMedias(ListType.INLIST)
          .pipe(
            tap(() => (this.loading = false)),
            tap((medias) => (this.noData = medias.length === 0)),
          )
          .subscribe((medias) => (this.medias = medias));
      });
  }
}
