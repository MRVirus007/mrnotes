import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../services/notes.service';
import { Platform } from '@ionic/angular';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: any;
  title = '';
  content = '';
  recording = false;
  placeholder = '';
  constructor(
    private notesService: NotesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private platform: Platform,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.notesService.getNote(this.id).then((res) => {
      this.title = res.title;
      this.content = res.content;
    }).catch(err => {
      this.notesService.presentToast(`Error: ${err}`);
    });

    //Autosave on press of back button 
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.title !== '') {
        this.updateNote();
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
    this.content += this.placeholder;
    this.recording = false;
    await SpeechRecognition.stop();
  }

  ngOnInit() {
  }
  updateNote() {
    this.notesService.updateNote(this.id, this.title, this.content).then(() => {
      this.router.navigate(['/notes']);
    });
  }

}
