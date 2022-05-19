import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ResponseResultDTO } from 'src/app/models/response/responseResultDTO';
import { ConnectionService } from 'src/app/user/services/connection.service';

@Component({
  selector: 'app-statistics-data',
  templateUrl: './statistics-data.component.html',
  styleUrls: ['./statistics-data.component.sass']
})
export class StatisticsDataComponent implements OnInit {

  public listCategories!: ResponseCategoryDTO
  public categoryName: string = ""
  constructor(@Inject(MAT_DIALOG_DATA) public data: ResponseResultDTO,
    private connectionS: ConnectionService) { }

  ngOnInit(): void {
    this.returnNameCategory(this.data.categoryId)
  }
  returnNameCategory(id: number) {
    this.connectionS.getCategoriesById(id).subscribe(res => {
      this.categoryName = res.unitName + " - " + res.categoryName
    })
  }
}
