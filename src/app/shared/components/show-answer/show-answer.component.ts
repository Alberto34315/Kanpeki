import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnswerDTO } from 'src/app/models/answerDTO';

@Component({
  selector: 'app-show-answer',
  templateUrl: './show-answer.component.html',
  styleUrls: ['./show-answer.component.sass']
})
export class ShowAnswerComponent implements OnInit {
 
  constructor(@Inject(MAT_DIALOG_DATA) public data: AnswerDTO) { }

  ngOnInit(): void {
  }
}
