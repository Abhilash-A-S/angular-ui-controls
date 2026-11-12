import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Language } from '../models/language-model';

@Injectable({
  providedIn: 'root'
})
export class LibraryCommonService {
  public languageChangeHandle: Subject<Language> = new Subject();//Language change handle

  constructor() { }
  public setLanguageChange(changedLanguage: Language) {
    this.languageChangeHandle.next(changedLanguage);

  }
  public getLanguageChange(): Observable<Language> {
    return this.languageChangeHandle.asObservable();
  }
}
