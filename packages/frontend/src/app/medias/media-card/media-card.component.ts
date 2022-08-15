import { Component, Input } from '@angular/core';
import { MediaWithType } from '../../shared/models/media.model';

export type Position = 'left' | 'center' | 'right';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
})
export class MediaCardComponent {
  @Input() media: MediaWithType | null = null;

  overview = '';
  position: Position = 'center';
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

  onShowMore(pos: Position) {
    this.position = pos;
    this.showMore = true;
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
