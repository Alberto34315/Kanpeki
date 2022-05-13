import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeakService {

  msg: SpeechSynthesisUtterance;
  voices:SpeechSynthesisVoice[];

  constructor() { 
    this.msg = new SpeechSynthesisUtterance();
    this.voices=window.speechSynthesis.getVoices()
  }
  speak(word:string) {
    this.msg.text = word;
    this.msg.lang = 'ja-JP';
    window.speechSynthesis.speak(this.msg);
  }
}
