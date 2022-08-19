import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { MediaWithType } from '../../shared/models/media.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-media-raw-list',
  templateUrl: './media-raw-list.component.html',
})
export class MediaRawListComponent implements OnInit, OnChanges {
  private _resize$ = new Subject<void>();
  mediasChunks: MediaWithType[][] = [];

  @Input() medias: MediaWithType[] = [];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this._resize$.next();
  }

  getLinesFromWidth(width: number): number {
    return width > 1200 ? 8 : width > 800 ? 6 : 4;
  }

  buildChunks(medias: MediaWithType[]): MediaWithType[][] {
    const perLines = this.getLinesFromWidth(window.innerWidth);
    const chunks = [];
    for (let i = 0; i < medias.length; i += perLines) {
      chunks.push(medias.slice(i, i + perLines));
    }
    return chunks;
  }

  ngOnInit(): void {
    this._resize$
      .pipe(debounceTime(50))
      .subscribe(() => (this.mediasChunks = this.buildChunks(this.medias)));
  }

  ngOnChanges() {
    this.mediasChunks = this.buildChunks(this.medias);
  }
}
