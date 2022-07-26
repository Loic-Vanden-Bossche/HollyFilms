import { Injectable } from '@angular/core';
import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: ModalComponent[] = [];

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter((x) => x.id !== id);
  }

  open(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal?.open();
  }

  close(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal?.close();
  }

  isDisplay(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    return modal?.display;
  }
}
