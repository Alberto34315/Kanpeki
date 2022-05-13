import { Component, OnInit } from '@angular/core';
import { ResponseCategoryDTO } from '../../../models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { map, Observable, of, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ResponseWordDTO } from '../../../models/response/responseWordDTO';
import SwiperCore, { Navigation } from "swiper";

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
  constructor(
    private connectionS: ConnectionService,
  ) {
  }

  ngOnInit(): void {
    this.connectionS
      .getCategories()
      .pipe(
        map((res) => {
          return res.filter((res) => res.isQuestion == false);
        })
      )
      .subscribe((res) => {
        this.listCategories = res;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      });
  }

  startStudy() {
    if (this.idCategory > 0) {
      this.connectionS.getWordsByCategory(this.idCategory).subscribe((res) => {
       this.listWords=res;
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

  exit(){
    this.listWords=[]
    this.myControl.setValue("")
  }
  
}
