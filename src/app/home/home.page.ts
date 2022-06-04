import { Component } from '@angular/core';
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
  constructor(public notesService: NotesService , private alertCtrl: AlertController, private navCtrl: NavController){
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

  async addNote(){
    await this.notesService.addNote(`Mohammed ${Math.floor(Math.random() * 100)}`);
    this.loadNotes();
  }

  async removeNote(index){
    this.notesService.removeNote(index);
    this.listNotes.splice(index, 1);
  }

  onSearch(event){
    console.log('event: ', event.target.value);
  }

}
