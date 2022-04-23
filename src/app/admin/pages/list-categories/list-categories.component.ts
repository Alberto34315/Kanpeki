import { Component, OnInit } from '@angular/core';
import { ResponseCategoryDTO } from 'src/app/models/response/responseCategoryDTO';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styles: [
  ]
})
export class ListCategoriesComponent implements OnInit {
  public listCategories: ResponseCategoryDTO[] = []

  constructor(private connectionS: ConnectionService) { }

  ngOnInit(): void {  
  this.getListCategories()
}

getListCategories() {
  this.connectionS.getCategories()
    .subscribe((resp) => {
      this.listCategories=resp
    })
  }
}
