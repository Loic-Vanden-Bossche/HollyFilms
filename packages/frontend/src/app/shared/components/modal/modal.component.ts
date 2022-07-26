import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit {
  @ViewChild('content', { static: true }) content: ElementRef | undefined;

  @Input() id: string | null = null;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();
  private readonly element: any;

  display = false;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  @HostListener('window:keydown.esc', ['$event'])
  onEsc() {
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any): void {
    if (this.content?.nativeElement.contains(event.target) && this.display)
      this.close();
  }

  ngOnInit(): void {
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }

    document.body.appendChild(this.element);

    this.element.addEventListener(
      'click',
      (el: { target: { className: string } }) => {
        if (el.target.className === 'jw-modal') {
          this.close();
        }
      }
    );

    this.modalService.add(this);
  }

  ngOnDestroy(): void {
    if (this.id) {
      this.modalService.remove(this.id);
    }

    this.element.remove();
  }

  open(): void {
    setTimeout(() => {
      this.display = true;
      document.body.classList.add('modal-open');
    }, 0);
  }

  close(): void {
    this.closed.emit();
    this.display = false;
    document.body.classList.remove('modal-open');
  }
}
