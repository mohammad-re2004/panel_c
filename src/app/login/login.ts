import { Component, OnInit, signal } from '@angular/core';
import { CaptchaService } from '../services/captcha';
import { Auth } from '../services/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  captchaUrl = signal<string>('');
  message! :string;
  isError :boolean = false;

  username = '';
  password = '';
  captcha = '';

  constructor(private captchaService: CaptchaService, private authService: Auth,  private router: Router,) { }

  ngOnInit(): void {
    this.loadCaptcha();
  }

  public loadCaptcha(): void {
    this.captchaService.getCaptcha().subscribe({
      next: (blob) => {
        this.captchaUrl.set(URL.createObjectURL(blob));
      },
      error: (err) => {
        console.error('خطا در دریافت کپچا:', err);
      },
    });
  }
  ///////////////////////

  currentUser = signal<any>(null);

  onSubmit(): void {
  //  this.message = "";
    this.authService
      .login({ username: this.username, password: this.password, captcha: this.captcha })
      .subscribe({
        next: (res) => {
          this.authService.setTokenCookie(res.token);
          // حالا که توکن داریم، رهگیر خودش هدر رو می‌ذاره → درخواست کاربر فعلی:
          // this.authService.getUser().subscribe({
          //   next: (user) => {
          //     this.currentUser.set(user);
          //     this.isError.set(false);
          //     this.message.set('ورود موفق ✅');
          //   },
          //   error: () => {
          //     this.isError.set(true);
          //     this.message.set('ورود موفق بود، ولی دریافت کاربر ناموفق ❌');
          //   },
          // });
          
          this.router.navigate(['/panel_news']);

        },
        error: (err) => {
          this.isError=(true);
           alert("خطا")
          // this.message=('ورود ناموفق ❌ (کد: ' + err.status + ')');
          this.loadCaptcha();
         
        },
      });
  }
}
