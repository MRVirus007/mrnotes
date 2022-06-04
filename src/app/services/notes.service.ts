import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
const STORAGE_KEY = 'notes';
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private storageReady = new BehaviorSubject(false);
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.defineDriver(cordovaSQLiteDriver);
    await this.storage.create();
    this.storageReady.next(true);
  }

  getNotes() {
    return this.storageReady.pipe(
      // eslint-disable-next-line arrow-body-style
      filter(ready => ready), switchMap(_ => {
        return from(this.storage.get(STORAGE_KEY)) || of([]);
      })
    );
  }

  async addNote(note) {
    const storedNotes = await this.storage.get(STORAGE_KEY) || [];
    storedNotes.push(note);
    return this.storage.set(STORAGE_KEY, storedNotes);
  }

  async removeNote(index) {
    const storedNotes = await this.storage.get(STORAGE_KEY) || [];
    storedNotes.splice(index, 1);
    return this.storage.set(STORAGE_KEY, storedNotes);
  }

}
