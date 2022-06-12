import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotesService } from '../services/notes.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isSearchbarOpened  = false;
  searchText: string;
  colors = ['#3880ff', '#3dc2ff', '#5260ff', '#2dd36f', '#ffc409', '#eb445a', '#92949c'];
  constructor(public notesService: NotesService, private router: Router){}
  ionViewDidEnter() {
    this.notesService.getAllNotes();
  }
  addNote(){
    this.router.navigate(['/notes/create']);
  }
  remove(id) {
    this.notesService.deleteNote(id);
  }
  changeColor(): string {
    const randomNumber = this.getRandomNumber();
    return this.colors[randomNumber];
  }
  getRandomNumber() {
    return Math.floor(Math.random() * this.colors.length);
  }
  goToEdit(id) {
    this.router.navigate(['/edit', id]);
  }
}
