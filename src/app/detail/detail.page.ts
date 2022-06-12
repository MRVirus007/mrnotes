import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Note } from '../interfaces/note';
import { NotesService } from '../services/notes.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public note: Note;
  constructor(public notesService: NotesService) {
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
}
