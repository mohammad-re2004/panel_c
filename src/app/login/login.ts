import { Component, inject, OnInit, signal } from '@angular/core';
import { CaptchaService } from '../services/captcha';
import { Auth } from '../services/auth';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  captchaUrl = signal('');
  message = signal('');
  isError = signal(false);
  private fb = inject(FormBuilder)

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    captcha: ['', [Validators.required]],
  });



  constructor(

    private captchaService: CaptchaService,
    private authService: Auth,
    private router: Router
  ) { }







  ngOnInit(): void {
    this.loadCaptcha();
  }

  loadCaptcha(): void {
    this.captchaService.getCaptcha().subscribe({
      next: (blob) => this.captchaUrl.set(URL.createObjectURL(blob)),
      error: (err) => console.error('خطا در دریافت کپچا:', err),
    });
  }
  ///////////////////////

  currentUser = signal<any>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();   // «همه فیلدها رو لمس‌شده علامت بزن تا خطاها دیده بشن»
      return;
    }

    const { username, password, captcha } = this.loginForm.getRawValue();
    this.message.set('');
    this.authService.login({ username, password, captcha }).subscribe({
      next: (res) => {
        this.authService.setTokenCookie(res.token);
        this.router.navigate(['/panel_news']);
      },
      error: (err) => {
        this.isError.set(true);
        this.message.set('ورود ناموفق ❌ (کد: ' + err.status + ')');
        this.loadCaptcha();
      },
    });
  }
}
