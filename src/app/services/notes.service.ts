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
                title nvarchar(255),
                content ntext
              )`, [])
            .then((res) => {
              this.presentToast('Success in db creation');
            })
            .catch((error) => this.presentToast(JSON.stringify(error)));
        })
        .catch((error) => this.presentToast(JSON.stringify(error)));
    });
  }

    // Crud
    public addNote(note) {
      // validation
      if (!note.title.length || !note.content.length) {
        this.presentToast('Provide both title and content');
        return;
      }
      this.dbInstance.executeSql(`
      INSERT INTO ${this.dbTable} (title, content) VALUES ('${note.title}', '${note.content}')`, [])
        .then(() => {
          this.presentToast('Note Inserted Successfully');
        }, (err) => {
          this.presentToast(JSON.stringify(err.err));
        });
    }

}
