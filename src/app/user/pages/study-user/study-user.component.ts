import { Component, OnInit } from '@angular/core';
import { ResponseCategoryDTO } from '../../../models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { map, Observable, of, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ResponseWordDTO } from '../../../models/response/responseWordDTO';
import { DomSanitizer } from '@angular/platform-browser';
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
    private sanitizer: DomSanitizer
  ) {}

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
  getImage(word: ResponseWordDTO) {
    if (word.urlImage != '') {
      let imgArr = word.urlImage.split('/');
      this.connectionS.getFile(imgArr[imgArr.length - 1]).subscribe((resp) => {
        let objectURL = URL.createObjectURL(resp);
        this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
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
  
}
