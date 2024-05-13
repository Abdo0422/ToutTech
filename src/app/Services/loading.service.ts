import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  get isLoading(): BehaviorSubject<boolean> {
    return this._isLoading;
  }
  setLoading(isLoading: boolean) {
    this.isLoading.next(isLoading);
  }
}
