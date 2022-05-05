import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseQuestionDTO } from 'src/app/models/response/responseQuestionDTO';
import { FormQuestionsComponent } from '../../components/form-questions/form-questions.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styles: [
  ]
})
export class ListQuestionsComponent implements OnInit {
  public listQuestions: ResponseQuestionDTO[] = []
  public componentForm: ComponentType<FormQuestionsComponent>;
  public dialogRef!: MatDialogRef<FormQuestionsComponent, any>
  public listDeleteElement: any[] = []
  public load: boolean = true
  constructor(private connectionS: ConnectionService, public dialog: MatDialog) {
    this.componentForm = FormQuestionsComponent
  }

  ngOnInit(): void {
    this.getListQuetions()
  }

  getListQuetions() {
    this.connectionS.getQuestions()
      .subscribe((resp) => {
        console.log(resp);

        this.listQuestions = resp
      })
  }

  openForm() {
    this.dialogRef = this.dialog.open(FormQuestionsComponent, {
      width: '450px',
      height: '600px',
      data: {},
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listQuestions = []
        this.getListQuetions()
      }
    });
  }

  deleteQuest() {
    if (this.listDeleteElement.length > 0 && this.listQuestions.length > 0) {
      this.listDeleteElement.forEach(id => {
        this.connectionS.deleteQuestions(id).subscribe(res => {
          this.procesaPropagar()
        })
      });
    }
  }
  
  listDelete(elements: any) {
    this.listDeleteElement = elements;
  }

  procesaPropagar() {
    this.listQuestions = []
    this.getListQuetions()
  }


}
