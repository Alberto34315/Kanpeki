import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResponseCategoryDTO } from '../../../models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';
import { finalize, map, Observable, of, startWith, tap } from 'rxjs';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ResponseQuestionDTO } from '../../../models/response/responseQuestionDTO';
import { RequestResultDTO } from 'src/app/models/request/requestResultDTO';
import { ResponseUserDTO } from 'src/app/models/response/responseUserDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';

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
  public verify: string = ""
  public score: number = -1
  public disableButton: boolean = false;
  public user!: ResponseUserDTO
  public load: boolean = false;
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
    private connectionS: ConnectionService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService
  ) { }

  ngOnInit(): void {
    this.connectionS.getUserMe().subscribe(res => {
      this.user = res
    })
    this.exit()
    this.connectionS.getCategories()
      .pipe(
        map((res) => {
          return res.filter((res) => res.isQuestion == true);
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
      this.connectionS
        .getQuestionsByCategory(this.idCategory)
        .pipe(tap({
          next: (res) => {
            this.load = true
            this.listQuestion = res;
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
    this.listQuestion = [];
    this.myControl.setValue('');
    this.myForm.get("answerCorrect0")?.setValue('');
    this.myForm.get("answerCorrect1")?.setValue('');
    this.myForm.get("answerCorrect2")?.setValue('');
    this.myForm.get("answerCorrect3")?.setValue('');
    this.myForm.get("answerCorrect4")?.setValue('');
    this.myForm.get("answerCorrect5")?.setValue('');
    this.myForm.get("answerCorrect6")?.setValue('');
    this.myForm.get("answerCorrect7")?.setValue('');
    this.myForm.get("answerCorrect8")?.setValue('');
    this.myForm.get("answerCorrect9")?.setValue('');
    this.score = -1
  }

  send() {
    this.score = 0
    this.verifyTest()
  }

  verifyTest() {
    this.disableButton = true;
    for (let i = 0; i < this.listQuestion.length; i++) {
      this.listQuestion[i].answers.filter((answ) => {
        if (answ.response == this.myForm.get("answerCorrect" + i)?.value && answ.isCorrect) {
          this.score += 1
        }
      })
      let e1 = (<HTMLInputElement>document.getElementById("r" + i + "1"));
      let e2 = (<HTMLInputElement>document.getElementById("r" + i + "2"));
      let e3 = (<HTMLInputElement>document.getElementById("r" + i + "3"));
      let e4 = (<HTMLInputElement>document.getElementById("r" + i + "4"));
      e1.disabled = true
      e2.disabled = true
      e3.disabled = true
      e4.disabled = true
      this.valuesTest(e1, this.listQuestion[i].answers[0].isCorrect)
      this.valuesTest(e2, this.listQuestion[i].answers[1].isCorrect)
      this.valuesTest(e3, this.listQuestion[i].answers[2].isCorrect)
      this.valuesTest(e4, this.listQuestion[i].answers[3].isCorrect)
    }

    let result: RequestResultDTO = {
      categoryId: this.idCategory,
      score: this.score,
      userId: this.user.id
    }
    this.connectionS.addResultsUser(result)
      .pipe(tap({
        next: (res) => {
          this.load = true
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

  valuesTest(element: HTMLInputElement, flag: boolean) {
    if (flag) {
      element?.parentElement?.classList.add(String('true'));
    } else {
      element?.parentElement?.classList.add(String('false'));
    }
  }

}
