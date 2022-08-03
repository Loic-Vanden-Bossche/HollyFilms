import { Component, Input } from '@angular/core';
import { TMDBAdminSearchResult } from '../../../shared/models/admin-tmdb-search-result.model';

@Component({
  selector: 'app-tmdb-result',
  templateUrl: './tmdb-result.component.html',
})
export class TmdbResultComponent {
  @Input() tmdbMedia: TMDBAdminSearchResult | null = null;
}
