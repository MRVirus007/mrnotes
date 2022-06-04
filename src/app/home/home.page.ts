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
    this.loadNotes();
  }

  onInit(){
  }

  async loadNotes(){
    //this.listNotes = await this.notesService.getNotes();
    this.notesService.getNotes().subscribe(res => {
      this.listNotes = res;
    });
  }

  addNote(){
    this.router.navigate(['/notes/create']);
  }

  async removeNote(index){
    this.notesService.removeNote(index);
    this.listNotes.splice(index, 1);
  }

  onSearch(event){
    console.log('event: ', event.target.value);
  }

}
