import { Component, Input } from '@angular/core';
import { ShowcaseMedia } from '../../../../shared/models/media.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-showcase-media-content',
  templateUrl: './showcase-media-content.component.html',
  animations: [
    trigger('animCardContent', [
      transition(':enter', [
        style({
          transform: 'translateX(50%) translateY(-10px) scale(0.9)',
          opacity: 0,
        }),
        animate(
          '1s 300ms ease',
          style({
            transform: 'translateX(0) translateY(0) scale(1)',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({
          transform: 'translateX(0) translateY(0) scale(1)',
          opacity: 1,
        }),
        animate(
          '1s ease',
          style({
            transform: 'translateX(50%) translateY(-10px) scale(0.9)',
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class ShowcaseMediaContentComponent {
  @Input() media: ShowcaseMedia | null = null;

  constructor(private readonly router: Router) {}

  get isFrench() {
    return this.media?.audioLangAvailable?.includes('fre');
  }

  watchMovie() {
    this.router.navigate(['/home'], {
      queryParams: { mediaId: this.media?._id },
    });
  }

  get isEnglish() {
    return this.media?.audioLangAvailable?.includes('eng');
  }
}
