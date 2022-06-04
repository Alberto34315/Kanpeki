import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { ConnectionService } from 'src/app/user/services/connection.service';

@Component({
  selector: 'app-statistics-data',
  templateUrl: './statistics-data.component.html',
  styleUrls: ['./statistics-data.component.sass']
})
export class StatisticsDataComponent implements OnInit {

  public listCategories!: ResponseCategoryDTO
  public categoryName: string = ""
  public titles: string[] = []
  public load: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private connectionS: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) { }

  ngOnInit(): void {
    this.titles = Object.keys(this.data).filter(resp => {
      return resp != "userId"
    })
    this.returnNameCategory(this.data.categoryId)
  }
  returnNameCategory(id: number) {
    this.connectionS.getCategoriesById(id)
      .pipe(tap({
        next: (res) => {
          this.load = true
          this.categoryName = res.unitName + " - " + res.categoryName
          this.cdRef.markForCheck()
        },
        error: (err) => {
          this.load = true
          this.cdRef.markForCheck()
          this.errorMsgS.showErrorMessage(err)
        }
      }),
        finalize(() => {
          setTimeout(() => {
            this.load = false
          }, 300)
        }))
      .subscribe(res => {
      })
  }
}
