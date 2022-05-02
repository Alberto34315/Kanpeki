import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseWordDTO } from 'src/app/models/response/responseWordDTO';
import { FormWordsComponent } from '../../components/form-words/form-words.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-words',
  templateUrl: './list-words.component.html',
  styles: [
  ]
})
export class ListWordsComponent implements OnInit {
  public listWords: ResponseWordDTO[] = []
  public listDeleteElement: any[] = []
  public load: boolean = true
  public componentForm: ComponentType<FormWordsComponent>;
  public dialogRef!: MatDialogRef<FormWordsComponent, any>

  constructor(private connectionS: ConnectionService, public dialog: MatDialog) {
    this.componentForm = FormWordsComponent
  }

  ngOnInit(): void {
    this.getListWords()
  }

  getListWords() {
    this.connectionS.getWords()
      .subscribe((resp) => {
        this.listWords = resp
      })
  }

  openForm() {
    this.dialogRef = this.dialog.open(FormWordsComponent, {
      width: '450px',
      height: '600px',
      data: {},
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listWords = []
        this.getListWords()
      }
    });
  }

  deleteWord() {
    if (this.listDeleteElement.length > 0 && this.listWords.length > 0) {
      this.listDeleteElement.forEach(id => {
        this.connectionS.deleteWords(id).subscribe(res => {
          this.procesaPropagar()
        })
      });
    }
  }
  procesaPropagar() {
    this.listWords = []
    this.getListWords()
  }
  listDelete(elements: any) {
    this.listDeleteElement = elements;
  }
}
