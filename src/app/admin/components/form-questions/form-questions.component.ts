import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, map, tap } from 'rxjs';
import { AnswerDTO } from 'src/app/models/answerDTO';
import { RequestQuestionDTO } from 'src/app/models/request/requestQuestionDTO';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseQuestionDTO } from 'src/app/models/response/responseQuestionDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { ValidFormService } from 'src/app/services/valid-form.service';
import { ConnectionService } from '../../services/connection.service';
import { bind, toHiragana } from 'wanakana';
@Component({
  selector: 'app-form-questions',
  templateUrl: './form-questions.component.html',
  styleUrls: ['./form-questions.component.sass']
})
export class FormQuestionsComponent implements OnInit {

  public myForm: FormGroup = this.fb.group({
    statement: ['', [Validators.required, Validators.maxLength(250)]],
    help: ['',],
    category: ['', [Validators.required]],
    answer1: ['', [Validators.required, Validators.maxLength(250)]],
    answer2: ['', [Validators.required, Validators.maxLength(250)]],
    answer3: ['', [Validators.required, Validators.maxLength(250)]],
    answer4: ['', [Validators.required, Validators.maxLength(250)]],
    furigana1: ['',],
    furigana2: ['',],
    furigana3: ['',],
    furigana4: ['',],
    answerCorrect: ['answer1'],
  });

  public load: boolean = false;
  public listCategories: ResponseCategoryDTO[] = []
  constructor(
    public dialogRef: MatDialogRef<FormQuestionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResponseQuestionDTO | RequestQuestionDTO,
    private fb: FormBuilder,
    private connectionS: ConnectionService,
    private valiFormS: ValidFormService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.valiFormS.myForm = this.myForm
  }

  ngOnInit(): void {
    this.connectionS.getCategories().pipe(map((res) => {
      return res.filter(res => res.isQuestion == true);
    }))
      .subscribe(res => {
        this.listCategories = res
      })
    if (this.data.id) {
      this.myForm.get('statement')?.patchValue(this.data.statement);
      this.myForm.get('help')?.patchValue(this.data.help);
      this.myForm.get('category')?.patchValue(this.data.categoryId);
      this.data.answers?.forEach((answer, i) => {
        let num = i + 1
        this.myForm.get('answer' + num)?.patchValue(answer.response);
        this.myForm.get('furigana' + num)?.patchValue(answer.furigana);
        if (answer.isCorrect) {
          this.myForm.get('answerCorrect')?.patchValue('answer' + num);
        }
      })
    }
  }

  textKanji(e: any) {
    bind(e.target)
  }

  onClose(): void {
    this.dialogRef.close(true)
  }

  fieldIsRequired(field: string) {
    return this.valiFormS.fieldIsRequired(field)
  }


  maxLengthdIsValid(field: string) {
    return this.valiFormS.maxLengthdIsValid(field)
  }

  save() {
    this.load = false;
    let question: RequestQuestionDTO = {
      statement: toHiragana(this.myForm.get('statement')?.value),
      help: toHiragana(this.myForm.get('help')?.value),
      categoryId: this.myForm.get("category")?.value,
    }
    let a1: AnswerDTO = {
      response: toHiragana(this.myForm.get('answer1')?.value),
      furigana: toHiragana(this.myForm.get('furigana1')?.value),
      isCorrect: this.answerIsCorrect('answer1'),
    }
    let a2: AnswerDTO = {
      response: toHiragana(this.myForm.get('answer2')?.value),
      furigana: toHiragana(this.myForm.get('furigana2')?.value),
      isCorrect: this.answerIsCorrect('answer2'),
    }
    let a3: AnswerDTO = {
      response: toHiragana(this.myForm.get('answer3')?.value),
      furigana: toHiragana(this.myForm.get('furigana3')?.value),
      isCorrect: this.answerIsCorrect('answer3'),
    }
    let a4: AnswerDTO = {
      response: toHiragana(this.myForm.get('answer4')?.value),
      furigana: toHiragana(this.myForm.get('furigana4')?.value),
      isCorrect: this.answerIsCorrect('answer4'),
    }
    question.answers = []
    question.answers?.push(a1)
    question.answers?.push(a2)
    question.answers?.push(a3)
    question.answers?.push(a4)

    if (this.data.id) {
      question.id = this.data.id
      this.connectionS.updatQuestion(question.id, question)
        .pipe(tap({
          next: (res) => {
            if (res) {
              this.load = true;
              this.cdRef.markForCheck()
              this.onClose()
            }
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
        .subscribe(resp => {
        })

    } else {
      this.connectionS.addQuestion(question)
        .pipe(tap({
          next: (res) => {
            if (res) {
              this.load = true;
              this.cdRef.markForCheck()
              this.onClose()
            }
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
        .subscribe(resp => {
        })
    }
  }

  answerIsCorrect(answer: string): boolean {
    let value = false;
    if (this.myForm.get("answerCorrect")?.value === answer) {
      value = true
    }
    return value;
  }
}
