import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id: any;
  title = '';
  content = '';
  constructor(
    private notesService: NotesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.notesService.getNote(this.id).then((res) => {
      this.title = res.title;
      this.content = res.content;
    }).catch(err => {
      this.notesService.presentToast(`Error: ${err}`);
    });
   }

  ngOnInit() {
  }
  updateNote() {
    this.notesService.updateNote(this.id, this.title, this.content).then(() => {
      this.router.navigate(['/notes']);
   });
  }

}
