import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Note } from '../interfaces/note';
import { NotesService } from '../services/notes.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public note: Note;
  constructor(public notesService: NotesService, private alertController: AlertController, private router: Router) {
    this.note = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      note_id: null,
      title: '',
      content: ''
    };
  }

  ngOnInit() {
  }

  addNote() {
    this.notesService.addNote(this.note);
  }

  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert',
      header: 'Save changes ?',
      subHeader: '',
      message: '',
      buttons: [{
        text:'Discard',
        role: 'discard',
        cssClass: 'danger-class',
        handler: () => {
          console.log('Discard');
        }
      },
      {
        text:'Save',
        role: 'save',
        cssClass: 'success-class',
        handler: () => {
          console.log('Save');
        }
      }
    ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    this.switchOnRole(role);
  }

  switchOnRole(role) {
    switch(role) {
      case 'discard':
        this.note.title = '';
        this.note.content = '';
        this.router.navigate(['/notes']);
        break;
      case 'save':
        this.addNote();
        break;
      default:
    }
  }

  goBack(){
    if(this.note.title.length || this.note.content.length) {
      this.presentAlertMultipleButtons();
    } else {
      this.router.navigate(['/notes']);
    }
  }
}
