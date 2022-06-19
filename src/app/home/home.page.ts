import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
  constructor(public notesService: NotesService,
     private router: Router,
     private alertController: AlertController){}
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
  async showAppInfo() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-alert-about',
      header: 'App Info',
      subHeader: 'Design Inspired By - Divya Kelaskar',
      message: 'Developed By - Mohammed Rokerya, This app is developed in Ionic Framework with Angular.',
      buttons: [{
        text:'About Developer',
        role: 'discard',
        cssClass: 'danger-class',
        handler: () => {
          window.open('https://in.linkedin.com/in/mohammed-rokerya-3346a3144','_system','location=yes');
        }
      },
      {
        text:'Design Info',
        role: 'save',
        cssClass: 'success-class',
        handler: () => {
          window.open('https://www.figma.com/community/file/1014161465589596715','_system','location=yes');
        }
      }]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
  }
}
