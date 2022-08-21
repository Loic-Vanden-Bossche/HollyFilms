import { Component, Input } from '@angular/core';
import { TMDBMicroSearchResult } from '../../../shared/models/micro-tmdb-search-result.model';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tmdb-result',
  templateUrl: './tmdb-result.component.html',
})
export class TmdbResultComponent {
  @Input() tmdbMedia: TMDBMicroSearchResult | null = null;
  addIcon = faSquarePlus;
}
