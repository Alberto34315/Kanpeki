import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResponseCategoryDTO } from '../../../models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { finalize, map, Observable, of, startWith, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ResponseWordDTO } from '../../../models/response/responseWordDTO';
import SwiperCore, { Navigation } from "swiper";
import { ErrorMessageService } from 'src/app/services/error-message.service';

// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
  selector: 'app-study-user',
  templateUrl: './study-user.component.html',
  styles: [],
})
export class StudyUserComponent implements OnInit {
  public myControl = new FormControl();
  public listCategories: ResponseCategoryDTO[] = [];
  public idCategory: number = 0;
  public filteredOptions: Observable<ResponseCategoryDTO[]> = of([]);
  public image: any = null;
  public listWords: ResponseWordDTO[] = [];
  public load: boolean = false;
  constructor(
    private connectionS: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService
  ) {
  }

  ngOnInit(): void {
    this.connectionS
      .getCategories()
      .pipe(
        map((res) => {
          return res.filter((res) => res.isQuestion == false);
        }),
        tap({
          next: (res) => {
            this.load = true
            this.listCategories = res;
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map((value) => this._filter(value))
            );
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
        })
      )
      .subscribe((res) => {
      });
  }

  startStudy() {
    if (this.idCategory > 0) {
      this.connectionS.getWordsByCategory(this.idCategory)
        .pipe(
          tap({
            next: (res) => {
              this.load = true
              this.listWords = res;
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
          })
        )
        .subscribe((res) => {
        });
    }
  }

  getCategory(option: ResponseCategoryDTO) {
    this.idCategory = option.id;
  }

  private _filter(value: string): ResponseCategoryDTO[] {
    const filterValue = value.toLowerCase();

    return this.listCategories.filter(
      (option) =>
        option.unitName.toLowerCase().includes(filterValue) ||
        option.categoryName.toLowerCase().includes(filterValue)
    );
  }

  exit() {
    this.listWords = []
    this.myControl.setValue("")
  }

}
