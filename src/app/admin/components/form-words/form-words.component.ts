import {ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize, map, tap } from 'rxjs';
import { RequestWordDTO } from 'src/app/models/request/requestWordDTO';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseWordDTO } from 'src/app/models/response/responseWordDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { ValidFormService } from 'src/app/services/valid-form.service';
import { bind, toHiragana } from 'wanakana';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-form-words',
  templateUrl: './form-words.component.html',
  styleUrls: ['./form-words.component.sass']
})
export class FormWordsComponent implements OnInit {

  public myForm: FormGroup = this.fb.group({
    spanish: ['', [Validators.required, Validators.maxLength(40)]],
    english: ['', [Validators.required, Validators.maxLength(40)]],
    japanese: ['', [Validators.required, Validators.maxLength(40)]],
    furigana: ['', [Validators.required, Validators.maxLength(40)]],
    urlImage: [''],
    category: ['', [Validators.required]],
  });


  public image: any = null;

  private fileInput!: ElementRef;

  @ViewChild('fileInput') set content(fileInput: ElementRef) {
    if (fileInput) {
      this.fileInput = fileInput;
    }
  }
  public load: boolean = false;
  public listCategories: ResponseCategoryDTO[] = []
  constructor(
    public dialogRef: MatDialogRef<FormWordsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResponseWordDTO | RequestWordDTO,
    private fb: FormBuilder,
    private connectionS: ConnectionService,
    private sanitizer: DomSanitizer,
    private valiFormS: ValidFormService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService
  ) {
    this.valiFormS.myForm = this.myForm
  }

  ngOnInit(): void {
    this.connectionS.getCategories().pipe(map((res) => {
      return res.filter(res => res.isQuestion == false);
    }))
      .subscribe(res => {
        this.listCategories = res
      })
    if (this.data.id) {
      this.getImage()
      this.myForm.get('spanish')?.patchValue(this.data.spanish);
      this.myForm.get('english')?.patchValue(this.data.english);
      this.myForm.get('japanese')?.patchValue(this.data.japanese);
      this.myForm.get('furigana')?.patchValue(this.data.furigana);
      this.myForm.get('category')?.patchValue(this.data.categoryId);
    }
  }

  textKanji(e: any) {
    bind(e.target, { IMEMode: 'toHiragana' })
  }

  getImage() {
    if (this.data.urlImage != "") {
      let imgArr = this.data.urlImage.split('/')
      this.connectionS.getFile(imgArr[imgArr.length - 1])
        .pipe(tap({
          next: (res) => {
            if (res) {
              this.load = true;
              let objectURL = URL.createObjectURL(res);
              this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              this.cdRef.markForCheck()
            }
          },
          error: (err) => {
            this.load = true
            this.cdRef.markForCheck()
            this.errorMsgS.showErrorImage()
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

  save() {
    this.load = false;
    let word: RequestWordDTO = this.myForm.value
    let fd = new FormData()
    if (this.data.id) {
      word.id = this.data.id
      word.urlImage = this.data.urlImage
      fd.append('id', String(word.id))
      fd.append('spanish', word.spanish)
      fd.append('english', word.english)
      fd.append('japanese', toHiragana(word.japanese))
      fd.append('furigana', toHiragana(word.furigana))
      fd.append('categoryId', String(word.category))
      if (this.fileInput !== undefined && this.fileInput.nativeElement.files[0] !== undefined) {
        fd.append("file", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
        this.updateWord(Number(word.id), fd)
      } else {
        if (word.urlImage.replace(/\s+/g, '') !== "") {
          let imgArr = word.urlImage.split('/')
          this.connectionS.getFile(imgArr[imgArr.length - 1])
            .pipe(tap({
              next: (res) => {
                if (res) {
                  this.load = true;
                  let name = imgArr[imgArr.length - 1].split("_")
                  fd.append("file", res, name[name.length - 1]);
                  this.updateWord(Number(word.id), fd)
                  this.cdRef.markForCheck()
                }
              },
              error: (err) => {
                this.load = true
                this.cdRef.markForCheck()
                this.errorMsgS.showErrorImage()
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
          fd.append("file", new Blob(), "default.png");
          this.updateWord(Number(word.id), fd)
        }
      }
    } else {
      fd.append('spanish', word.spanish)
      fd.append('english', word.english)
      fd.append('japanese', toHiragana(word.japanese))
      fd.append('furigana', toHiragana(word.furigana))
      fd.append('categoryId', String(word.category))
      if (this.fileInput !== undefined && this.fileInput.nativeElement.files[0] !== undefined) {
        fd.append("file", this.fileInput.nativeElement.files[0], this.fileInput.nativeElement.files[0].name);
      } else {
        fd.append("file", new Blob(), "default.png");
      }
      this.connectionS.addWord(fd)
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
        .subscribe((res) => {
        })
    }
  }

  updateWord(id: number, fd: FormData) {
    this.connectionS.updateWord(id, fd)
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
      .subscribe((res) => {
      })
  }

  deleteImage() {
    this.data.urlImage = '';
    this.image = '../../../../assets/img/profileDefault.png'
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

}
