import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  faClapperboard,
  faSquareFull,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
})
export class LogoComponent {
  @Input() compact = false;

  gradiantClasses = ['bg-gradient-to-r', 'gradient-colors'];
  icon = faClapperboard;
  mask = faSquareFull;

  @ViewChild('logoContainer') logoContainer: ElementRef | null = null;
}
