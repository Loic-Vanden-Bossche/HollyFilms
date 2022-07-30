import { Component, Input, OnInit } from '@angular/core';
import { MediaWithType } from '../../../shared/models/media.model';
import { fromEvent, sampleTime } from 'rxjs';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
})
export class MediaCardComponent implements OnInit {
  @Input() media: MediaWithType | null = null;

  overview = '';
  position: 'left' | 'center' | 'right' = 'center';
  positionClasses: string[] = [];

  private _showMore = false;

  getPositionClasses() {
    switch (this.position) {
      case 'left':
        return [];
      case 'right':
        return ['-translate-x-2/3'];
      case 'center':
        return ['-translate-x-1/3'];
    }
  }

  ngOnInit() {
    fromEvent(document.body, 'mousemove')
      .pipe(sampleTime(500))
      .subscribe((e: any) => {
        const XPosition = e.pageX;
        if (XPosition < document.body.getBoundingClientRect().width / 3) {
          this.position = 'left';
        } else if (
          XPosition >
          (document.body.getBoundingClientRect().width / 3) * 2
        ) {
          this.position = 'right';
        } else {
          this.position = 'center';
        }
      });
  }

  set showMore(value: boolean) {
    if (value) {
      this.positionClasses = this.getPositionClasses();
    }

    this._showMore = value;
  }

  get showMore() {
    return this._showMore;
  }
}
