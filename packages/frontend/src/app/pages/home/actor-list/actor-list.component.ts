import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Actor } from '../../../shared/models/actor.model';

@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
})
export class ActorListComponent {
  @Input() actors: Actor[] = [];

  @ViewChild('container') container: ElementRef | null = null;
}
