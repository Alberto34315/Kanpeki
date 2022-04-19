import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public static journal = 'pink';

  public get current(): string {
    return localStorage.getItem('theme') ?? ThemeService.journal;
  }

  public set current(value: string) {
    localStorage.setItem('theme', value);
    this.style.href = `${value}.css`;
  }

  private readonly style: HTMLLinkElement;
  constructor() {
    this.style = document.createElement('link');
    this.style.rel = 'stylesheet';
    document.head.appendChild(this.style);

    if (localStorage.getItem('theme') !== undefined) {
      this.style.href = `${this.current}.css`;
    }
  }
}
