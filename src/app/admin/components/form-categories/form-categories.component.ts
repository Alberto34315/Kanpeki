import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize, tap } from 'rxjs';
import { RequestCategoryDTO } from 'src/app/models/request/requestCategoryDTO';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { ValidFormService } from 'src/app/services/valid-form.service';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-form-categories',
  templateUrl: './form-categories.component.html',
  styleUrls: ['./form-categories.component.sass']
})
export class FormCategoriesComponent implements OnInit {
  public myForm: FormGroup = this.fb.group({
    unitName: ['', [Validators.required, Validators.maxLength(40)]],
    categoryName: ['', [Validators.required, Validators.maxLength(40)]],
    isQuestion: ['true', [Validators.required]],
  });
  public load: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<FormCategoriesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResponseCategoryDTO | RequestCategoryDTO,
    private fb: FormBuilder,
    private connectionS: ConnectionService,
    private valiFormS: ValidFormService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService) {
    this.valiFormS.myForm = this.myForm
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.myForm.get('unitName')?.patchValue(this.data.unitName);
      this.myForm.get('categoryName')?.patchValue(this.data.categoryName);
      this.myForm.get('isQuestion')?.patchValue(this.data.isQuestion);
    }
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
    let category: RequestCategoryDTO = {
      unitName: this.myForm.get('unitName')?.value,
      categoryName: this.myForm.get('categoryName')?.value,
      isQuestion: this.myForm.get("isQuestion")?.value,
    }
    if (this.data.id) {
      category.id = this.data.id
      this.connectionS.updatCategory(category.id, category)
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
      this.connectionS.addCategory(category)
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
}
