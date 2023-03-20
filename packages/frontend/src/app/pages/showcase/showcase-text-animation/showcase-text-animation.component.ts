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

  words: string[] = [
    'des films en haute qualité',
    'un service 100% gratuit',
    'un contenu régulièrement mis à jour',
    'des recommendations personnalisés',
    'une synchronisation sur tous vos appareils',
    'vos films sans interruptions ni publicités',
  ];

  effectiveWords: HTMLSpanElement[] = [];
  wordArray: HTMLSpanElement[][] = [];
  currentWordIndex = 0;

  colorFromGradiant(colorStart: string, colorEnd: string, percent: number) {
    const start = {
      r: parseInt(colorStart.substring(1, 3), 16),
      g: parseInt(colorStart.substring(3, 5), 16),
      b: parseInt(colorStart.substring(5, 7), 16),
    };
    const end = {
      r: parseInt(colorEnd.substring(1, 3), 16),
      g: parseInt(colorEnd.substring(3, 5), 16),
      b: parseInt(colorEnd.substring(5, 7), 16),
    };
    const r = Math.floor(start.r * (1 - percent) + end.r * percent).toString(
      16,
    );
    const g = Math.floor(start.g * (1 - percent) + end.g * percent).toString(
      16,
    );
    const b = Math.floor(start.b * (1 - percent) + end.b * percent).toString(
      16,
    );
    return '#' + this.pad(r) + this.pad(g) + this.pad(b);
  }

  pad(num: string) {
    return num.length < 2 ? '0' + num : num;
  }

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
      const letterContent = content.charAt(i);
      letter.className = 'letter';
      letter.style.color = this.colorFromGradiant(
        '#4ade80',
        '#3b82f6',
        i / content.length,
      );
      letter.innerHTML = letterContent === ' ' ? '&nbsp;' : letterContent;
      word.appendChild(letter);
      letters.push(letter);
    }
    this.wordArray.push(letters);
  }

  animateLetterOut(cw: { [x: number]: { className: string } }, i: number) {
    setTimeout(function () {
      cw[i].className = 'letter out';
    }, i * 10);
  }

  animateLetterIn(nw: { [x: number]: { className: string } }, i: number) {
    setTimeout(function () {
      nw[i].className = 'letter in';
    }, 340 + i * 10);
  }

  ngAfterViewInit() {
    this.effectiveWords =
      this.wordElements?.toArray().map((e) => e.nativeElement) || [];

    this.effectiveWords[this.currentWordIndex].style.opacity = '1';
    for (let i = 0; i < this.effectiveWords.length; i++) {
      this.splitLetters(this.effectiveWords[i]);
    }

    this.changeWord();
    setInterval(() => this.changeWord(), 6000);
  }
}
