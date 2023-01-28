import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { Note } from '../interfaces/note';
import { NotesService } from '../services/notes.service';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public note: Note;
  placeholder = '';
  recording = false;
  constructor(public notesService: NotesService,
    private alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private changeDetectorRef: ChangeDetectorRef) {
    this.note = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      note_id: null,
      title: '',
      content: ''
    };

    //Autosave on press of back button 
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.note.title !== '') {
        this.goBack();
      }
    });

    SpeechRecognition.requestPermission();
  }

  async startRecognition() {
    const { available } = await SpeechRecognition.available();
    this.recording = true;
    if (available) {
      await SpeechRecognition.start({
        language: "en-US",
        partialResults: true,
        popup: false
      });

      // listin to partial results
      await SpeechRecognition.addListener("partialResults", (data: any) => {
        //for iOS replace "value" keyword with "matches"
        if (data.value && data.value.length > 0) {
          this.placeholder = data.value[0] + ' ';
          //this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  async stopRecognition() {
    this.note.content += this.placeholder;
    this.recording = false;
    await SpeechRecognition.stop();
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
        text: 'Discard',
        role: 'discard',
        cssClass: 'danger-class',
        handler: () => {
          console.log('Discard');
        }
      },
      {
        text: 'Save',
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
    switch (role) {
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

  goBack() {
    if (this.note.title.length || this.note.content.length) {
      this.presentAlertMultipleButtons();
    } else {
      this.router.navigate(['/notes']);
    }
  }


}
