import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs';
import { ResponseWordDTO } from 'src/app/models/response/responseWordDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
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
  public load: boolean = false;
  public componentForm: ComponentType<FormWordsComponent>;
  public dialogRef!: MatDialogRef<FormWordsComponent, any>

  constructor(private connectionS: ConnectionService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.componentForm = FormWordsComponent
  }

  ngOnInit(): void {
    this.getListWords()
  }

  getListWords() {
    this.connectionS.getWords()
      .pipe(tap({
        next: (res) => {
          this.load = true
          this.listWords = res
          this.cdRef.markForCheck()
        },
        error: (err) => {
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
    this.dialogRef = this.dialog.open(FormWordsComponent, {
      width: '450px',
      height: '600px',
      data: {},
      disableClose: true,
      panelClass: 'custom-dialog-container'
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
      this.errorMsgS.deleteElement().then((res) => {
        if (res.isConfirmed) {
          this.listDeleteElement.forEach(id => {
            this.connectionS.deleteWords(id).subscribe(res => {
              this.procesaPropagar()
            })
          });
        }
      })
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
