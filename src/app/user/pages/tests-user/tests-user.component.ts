import { Component, OnInit } from '@angular/core';
import { ResponseCategoryDTO } from '../../../models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { map, Observable, of, startWith } from 'rxjs';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ResponseQuestionDTO } from '../../../models/response/responseQuestionDTO';

@Component({
  selector: 'app-tests-user',
  templateUrl: './tests-user.component.html',
  styles: [],
})
export class TestsUserComponent implements OnInit {
  public myControl = new FormControl();
  public listCategories: ResponseCategoryDTO[] = [];
  public idCategory: number = 0;
  public filteredOptions: Observable<ResponseCategoryDTO[]> = of([]);
  public listQuestion: ResponseQuestionDTO[] = [];
  public myForm: FormGroup = this.fb.group({
    answerCorrect0: [''],
    answerCorrect1: [''],
    answerCorrect2: [''],
    answerCorrect3: [''],
    answerCorrect4: [''],
    answerCorrect5: [''],
    answerCorrect6: [''],
    answerCorrect7: [''],
    answerCorrect8: [''],
    answerCorrect9: [''],
  });
  constructor(
    private fb: FormBuilder,
    private connectionS: ConnectionService
  ) {}

  ngOnInit(): void {
    this.connectionS
      .getCategories()
      .pipe(
        map((res) => {
          return res.filter((res) => res.isQuestion == true);
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
      this.connectionS
        .getQuestionsByCategory(this.idCategory)
        .subscribe((res) => {
          this.listQuestion = res;
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
    this.listQuestion = [];
    this.myControl.setValue('');
  }

  send() {}
}
