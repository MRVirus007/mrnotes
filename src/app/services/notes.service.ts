/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class NotesService {
  public notes: Note[] = [];
  readonly dbName: string = 'notes_db';
  readonly dbTable: string = 'notes';
  private dbInstance: SQLiteObject;
  constructor(private platform: Platform,
    private sqlite: SQLite,
    public toastController: ToastController,
    private router: Router) {
    this.databaseConn();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
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
        //this.router.navigate(['/notes']);
      }, (err) => {
        this.presentToast(JSON.stringify(err.err));
      });
  }

   // Update
  updateNote(id, title, content) {
    //validation
    if(!title.length) {
      this.presentToast("'Title can't be empty");
      return;
    }
    const data = [title, content];
    return this.dbInstance.executeSql(`UPDATE ${this.dbTable} SET title = ?, content = ? WHERE note_id = ${id}`, data).then(() => {
      this.presentToast('Note Saved Successfully');
    }, (err) => {
      this.presentToast(JSON.stringify(err));
    });
  }

  // Get Note
  getNote(id): Promise<any> {
    return this.dbInstance.executeSql(`SELECT * FROM ${this.dbTable} WHERE note_id = ?`, [id])
    .then((res) => ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        note_id: res.rows.item(0).note_id,
        title: res.rows.item(0).title,
        content: res.rows.item(0).content,
      }))
      .catch(err => {
        this.presentToast(JSON.stringify(err));
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

  // Delete
  deleteNote(id) {
    this.dbInstance.executeSql(`
    DELETE FROM ${this.dbTable} WHERE note_id = ${id}`, [])
      .then(() => {
        this.presentToast('Note Deleted Successfully');
        this.getAllNotes();
      })
      .catch(err => {
        this.presentToast(JSON.stringify(err));
      });
  }

}
