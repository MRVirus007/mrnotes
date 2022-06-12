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
  listNotes = [];
  searchText: string;
  //dynamic hex color variable
  // eslint-disable-next-line @typescript-eslint/member-ordering
  hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
  //for selected colors
  colors = ['#FD99FF', '#FF9E9E', '#91F48F', '#FFF599', '#9EFFFF', '#B69CFF', '#30BE71', '#FF0000'];
  constructor(public notesService: NotesService, private router: Router){
    //this.getNotes();
  }

  ionViewDidEnter() {
    this.notesService.getAllNotes();
  }

  addNote(){
    this.router.navigate(['/notes/create']);
  }

  remove(id) {
    this.notesService.deleteNote(id);
  }
  //dynamically change title bg color
  changeColorHex(): string {
    let hexColor = '#';
    for (let i = 0; i < 6; i++) {
      hexColor += this.hex[this.getRandomNumberForHex()];
    }
    //console.log(hexColor);
    //color.textContent = hexColor;
    //document.body.style.backgroundColor = hexColor;
    return hexColor;
  }

  getRandomNumberForHex() {
    return Math.floor(Math.random() * this.hex.length);
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
