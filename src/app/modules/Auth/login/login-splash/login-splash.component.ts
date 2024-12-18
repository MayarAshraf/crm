import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-login-splash',
  standalone: true,
  templateUrl: './login-splash.component.html',
  styleUrls: ['./login-splash.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginSplashComponent {
  animTrampoline = viewChild.required<ElementRef>('animTrampoline');

  clientImgs: { src: string }[] = [];
  clientImgsToView = 35;
  totalImgs = 80;

  ngOnInit() {
    this.initLoginSplash();
  };

  initLoginSplash = () => {
    for (let i = 0; i < this.clientImgsToView; i++) {
      const randomImg = Math.floor(Math.random() * this.totalImgs + 1);
      this.clientImgs.push({ src: `assets/media/clients/${randomImg}.jpg` });
    };

    setTimeout(() => {
      const el = this.animTrampoline().nativeElement;
      if (el) {
        (el as unknown as SVGAnimateElement).beginElement();
      }
    }, 5500);
  };
}
