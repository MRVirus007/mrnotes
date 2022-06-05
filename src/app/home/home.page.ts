import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { NotesService } from '../services/notes.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isSearchbarOpened  = false;
  listNotes = [];
  constructor(public notesService: NotesService, private router: Router){
  }

  onInit(){
  }

  addNote(){
    this.router.navigate(['/notes/create']);
  }

  onSearch(event){
    this.notesService.presentToast(event.target.value);
  }

}
