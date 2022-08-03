import { Component, Input } from '@angular/core';
import { TMDBAdminSearchResult } from '../../../shared/models/admin-tmdb-search-result.model';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tmdb-result',
  templateUrl: './tmdb-result.component.html',
})
export class TmdbResultComponent {
  @Input() tmdbMedia: TMDBAdminSearchResult | null = null;
  addIcon = faSquarePlus;
}
