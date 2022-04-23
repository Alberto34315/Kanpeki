import { Component, OnInit } from '@angular/core';
import { ResponseQuestionDTO } from 'src/app/models/response/responseQuestionDTO';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styles: [
  ]
})
export class ListQuestionsComponent implements OnInit {
  public listQuestions: ResponseQuestionDTO[] = []

  constructor(private connectionS: ConnectionService) { }

  ngOnInit(): void {
    this.getListQuetions()
  }

  getListQuetions() {
    this.connectionS.getQuestions()
      .subscribe((resp) => {
        console.log(resp);
        
        this.listQuestions = resp
      })
  }

}
