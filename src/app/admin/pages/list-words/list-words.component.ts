import { Component, OnInit } from '@angular/core';
import { ResponseWordDTO } from 'src/app/models/response/responseWordDTO';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-words',
  templateUrl: './list-words.component.html',
  styles: [
  ]
})
export class ListWordsComponent implements OnInit {
  public listWords: ResponseWordDTO[] = []

  constructor(private connectionS: ConnectionService) { }

  ngOnInit(): void {
    this.getListWords()
  }

  getListWords() {
    this.connectionS.getWords()
      .subscribe((resp) => {
        this.listWords=resp
      })
  }

}
