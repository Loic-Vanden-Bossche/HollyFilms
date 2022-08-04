import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _search = new BehaviorSubject('');

  set search(query: string) {
    this._search.next(query.toLowerCase().trim());
  }

  get search() {
    return this._search.getValue();
  }

  clear() {
    this._search.next('');
  }

  onChange() {
    return this._search.asObservable().pipe(debounceTime(300));
  }
}
