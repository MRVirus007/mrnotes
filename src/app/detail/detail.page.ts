import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Note } from '../interfaces/note';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  constructor(private route: ActivatedRoute, private notesService: NotesService, private navCtrl: NavController) {
  }

  ngOnInit() {
  }
}
