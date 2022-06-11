/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController} from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  public notes: Note[] = [];
  readonly dbName: string = 'notes_db';
  readonly dbTable: string = 'notes';
  private dbInstance: SQLiteObject;
  constructor(private platform: Platform, private sqlite: SQLite,public toastController: ToastController) {
    this.databaseConn();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async presentToastResult(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  // Create SQLite database
  databaseConn() {
    this.platform.ready().then(() => {
      this.sqlite.create({
          name: this.dbName,
          location: 'default'
        }).then((sqLite: SQLiteObject) => {
          this.dbInstance = sqLite;
          sqLite.executeSql(`
              CREATE TABLE IF NOT EXISTS ${this.dbTable} (
                note_id INTEGER PRIMARY KEY, 
                title nvarchar(255) null,
                content ntext null
              )`, [])
            .catch((error) => this.presentToast(JSON.stringify(error)));
        })
        .catch((error) => this.presentToast(JSON.stringify(error)));
    });
  }

    public addNote(note) {
      // validation
      if (!note.title.length) {
        this.presentToast("'Title can't be empty");
        return;
      }
      this.dbInstance.executeSql(`
      INSERT INTO ${this.dbTable} (title, content) VALUES ('${note.title}', '${note.content}')`, [])
        .then(() => {
          this.presentToast('Note Saved Successfully');
        }, (err) => {
          this.presentToast(JSON.stringify(err.err));
        });
    }

    getAllNotes() {
      return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable}`, []).then((res) => {
        this.notes = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            this.notes.push(res.rows.item(i));
          }
          return this.notes;
        }
      },(e) => {
        alert(JSON.stringify(e));
      });
    }
}
