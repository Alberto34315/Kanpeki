import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CardData } from '../../../models/cardData';
import { ResponseWordDTO } from '../../../models/response/responseWordDTO';
import { DomSanitizer } from '@angular/platform-browser';
import { ConnectionService } from 'src/app/user/services/connection.service';
import { LanguageService } from '../../../services/language.service';
import { SpeakService } from '../../../services/speak.service';
import { ErrorMessageService } from 'src/app/services/error-message.service';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
  animations: [
    trigger('cardFlip', [
      state(
        'default',
        style({
          transform: 'none',
        })
      ),
      state(
        'flipped',
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      state(
        'matched',
        style({
          visibility: 'false',
          transform: 'scale(0.05)',
          opacity: 0,
        })
      ),
      transition('default => flipped', [animate('400ms')]),
      transition('flipped => default', [animate('400ms')]),
      transition('* => matched', [animate('400ms')]),
    ]),
  ],
})
export class CardComponent implements OnInit {
  @Input('word') word!: ResponseWordDTO;
  public data: CardData = {
    imageId: 'pDGNBK9A0sk',
    state: 'default',
  };
  public image: any = null;
  public idiom: String = '';
  public load: boolean = false;
  constructor(
    private connectionS: ConnectionService,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService,
    private speak: SpeakService,
    private cdRef: ChangeDetectorRef,
    private errorMsgS: ErrorMessageService
  ) {
    this.idiom = this.languageService.getIdiom();
  }

  ngOnInit(): void {
    this.getImage(this.word);
  }

  cardClicked() {
    if (this.data.state === 'default') {
      this.data.state = 'flipped';
    } else {
      this.data.state = 'default';
    }
  }

  speakWord(word: ResponseWordDTO) {
    this.speak.speak(word.japanese);
  }

  getImage(word: ResponseWordDTO) {
    if (word.urlImage != '') {
      let imgArr = word.urlImage.split('/');
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
        .subscribe((resp) => {
        });
    }
  }
}
