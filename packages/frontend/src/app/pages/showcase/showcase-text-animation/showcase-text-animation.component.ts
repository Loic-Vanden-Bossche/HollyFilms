import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-showcase-text-animation',
  templateUrl: './showcase-text-animation.component.html',
})
export class ShowcaseTextAnimationComponent implements AfterViewInit {
  @ViewChildren('word') wordElements: QueryList<
    ElementRef<HTMLSpanElement>
  > | null = null;

  words: { text: string; color: string }[] = [
    { text: 'Welcome', color: '#1abc9c' },
    { text: 'to', color: '#2ecc71' },
    { text: 'Angular', color: '#3498db' },
    { text: '7', color: '#9b59b6' },
    { text: 'Showcase', color: '#34495e' },
    { text: 'Text', color: '#16a085' },
    { text: 'Animation', color: '#27ae60' },
  ];

  effectiveWords: HTMLSpanElement[] = [];
  wordArray: HTMLSpanElement[][] = [];
  currentWordIndex = 0;

  changeWord() {
    let i;
    const cw = this.wordArray[this.currentWordIndex];
    const nw =
      this.currentWordIndex == this.effectiveWords.length - 1
        ? this.wordArray[0]
        : this.wordArray[this.currentWordIndex + 1];
    for (i = 0; i < cw.length; i++) {
      this.animateLetterOut(cw, i);
    }

    for (i = 0; i < nw.length; i++) {
      nw[i].className = 'letter behind';

      if (nw[0].parentElement) {
        nw[0].parentElement.style.opacity = '1';
      }
      this.animateLetterIn(nw, i);
    }

    this.currentWordIndex =
      this.currentWordIndex == this.wordArray.length - 1
        ? 0
        : this.currentWordIndex + 1;
  }

  splitLetters(word: Element) {
    const content = word.innerHTML;
    word.innerHTML = '';
    const letters = [];
    for (let i = 0; i < content.length; i++) {
      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.innerHTML = content.charAt(i);
      word.appendChild(letter);
      letters.push(letter);
    }

    this.wordArray.push(letters);
  }

  animateLetterOut(cw: { [x: number]: { className: string } }, i: number) {
    setTimeout(function () {
      cw[i].className = 'letter out';
    }, i * 80);
  }

  animateLetterIn(nw: { [x: number]: { className: string } }, i: number) {
    setTimeout(function () {
      nw[i].className = 'letter in';
    }, 340 + i * 80);
  }

  ngAfterViewInit() {
    this.effectiveWords =
      this.wordElements?.toArray().map((e) => e.nativeElement) || [];

    this.effectiveWords[this.currentWordIndex].style.opacity = '1';
    for (let i = 0; i < this.effectiveWords.length; i++) {
      this.splitLetters(this.effectiveWords[i]);
    }

    this.changeWord();
    setInterval(() => this.changeWord(), 4000);
  }
}
