import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs';
import { ResponseQuestionDTO } from 'src/app/models/response/responseQuestionDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { FormQuestionsComponent } from '../../components/form-questions/form-questions.component';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styles: [
  ]
})
export class ListQuestionsComponent implements OnInit {
  public listQuestions!: ResponseQuestionDTO[]
  public componentForm: ComponentType<FormQuestionsComponent>;
  public dialogRef!: MatDialogRef<FormQuestionsComponent, any>
  public listDeleteElement: any[] = []
  public load: boolean = false;
  constructor(
    private connectionS: ConnectionService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.componentForm = FormQuestionsComponent
  }

  ngOnInit(): void {
    this.getListQuetions()
  }

  getListQuetions() {
    this.connectionS.getQuestions()
      .pipe(tap({
        next: (res) => {
          this.listQuestions = []
          this.load = true
          this.listQuestions = res
          this.cdRef.markForCheck()
        },
        error: (err) => {
          this.listQuestions = []
          this.load = true
          this.cdRef.markForCheck()
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 300)
        }))
      .subscribe((resp) => {
      })
  }

  openForm() {
    this.dialogRef = this.dialog.open(FormQuestionsComponent, {
      width: '550px',
      height: '600px',
      data: {},
      disableClose: true,
      panelClass: 'custom-dialog-container'
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
      this.errorMsgS.deleteElement().then((res) => {
        if (res.isConfirmed) {
          this.listDeleteElement.forEach(id => {
            this.connectionS.deleteQuestions(id)
              .pipe(tap({
                next: (res) => {
                  this.procesaPropagar()
                },
                error: (err) => {
                  this.errorMsgS.showErrorMessage(err)
                }
              }))
              .subscribe(res => {
              })
          });
        }
      })
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
