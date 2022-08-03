import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';
import { faBan, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  mergeWith,
} from 'rxjs';
import { AdminService } from '../../shared/services/admin.service';
import { FormControl } from '@angular/forms';
import { FileData } from '../../shared/models/file-data.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { TMDBAdminSearchResult } from '../../shared/models/admin-tmdb-search-result.model';
import { NotificationsService } from '../../shared/services/notifications.service';
import { NotificationType } from '../../shared/models/notification.model';

@Component({
  selector: 'app-add-media-modal',
  templateUrl: './add-media-modal.component.html',
  animations: [
    trigger('onSelectedChange', [
      transition(':enter', [
        style({
          'max-height': 0,
          'padding-top': '0px',
          'padding-bottom': '0px',
        }),
        animate(
          '0.5s ease',
          style({
            'max-height': '48px',
            'padding-top': '5px',
            'padding-bottom': '5px',
          })
        ),
      ]),
    ]),
  ],
})
export class AddMediaModalComponent implements OnInit {
  @Input() addingMovie = true;

  private _selectedFile: FileData | null = null;

  searchCtrl = new FormControl('');

  localResults: FileData[] = [];
  tmdbResults: TMDBAdminSearchResult[] = [];

  constructor(
    private readonly modalService: ModalService,
    private readonly adminService: AdminService,
    private readonly notificationsService: NotificationsService
  ) {}

  searchIcon = faMagnifyingGlass;
  isOnline = new BehaviorSubject(false);
  banIcon = faBan;

  ngOnInit(): void {
    this.isOnline
      .pipe(
        mergeWith(
          this.searchCtrl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged()
          )
        )
      )
      .subscribe(() => this.search());
  }

  search() {
    if (this._selectedFile || !this.addingMovie) {
      if (this.searchCtrl.value) {
        this.adminService
          .tmdbSearch(
            this.searchCtrl.value || '',
            this.addingMovie ? 'movie' : 'tv'
          )
          .subscribe((results) => (this.tmdbResults = results));
      } else {
        this.tmdbResults = [];
      }
    } else {
      if (this.isOnline.value) {
        // this.adminService.onlineSearch(this.searchCtrl.value || '').subscribe();
      } else {
        this.adminService
          .localSearch(this.searchCtrl.value || '')
          .subscribe((files) => (this.localResults = files));
      }
    }
  }

  onAddMedia(tmdbMedia: TMDBAdminSearchResult) {
    if (this.selectedFile && this.addingMovie) {
      this.adminService
        .addMovie(tmdbMedia.TMDB_id, this.selectedFile?.path)
        .subscribe((media) => {
          this.notificationsService.push({
            type: NotificationType.Success,
            message: `Le film ${media.data.title} à été ajouté à la base de données`,
            lifetime: 3000,
          });
          this.close();
        });
    } else if (!this.addingMovie) {
      this.adminService.addTv(tmdbMedia.TMDB_id).subscribe((media) => {
        this.notificationsService.push({
          type: NotificationType.Success,
          message: `La série ${media.data.title} à été ajoutée à la base de données`,
          lifetime: 3000,
        });
        this.close();
      });
    }
  }

  get selectedFile() {
    return this._selectedFile;
  }

  set selectedFile(file: FileData | null) {
    this._selectedFile = file;
    this.searchCtrl.setValue('');
  }

  close() {
    this.modalService.close('add-media-modal');
  }

  get display(): boolean {
    return this.modalService.isDisplay('add-media-modal') || false;
  }
}
