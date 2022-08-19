import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _search = new BehaviorSubject('');
  private _clear = new Subject<void>();

  set search(query: string) {
    this._search.next(query.toLowerCase().trim());
  }

  get search() {
    return this._search.getValue();
  }

  clear() {
    this._search.next('');
  }

  clearControl() {
    this._clear.next();
  }

  onClearControl() {
    return this._clear.asObservable();
  }

  onChange() {
    return this._search.asObservable().pipe(debounceTime(300));
  }
}
