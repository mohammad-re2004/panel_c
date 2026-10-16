import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../services/news';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { gregorianToShamsi, shamsiStringToGregorian, shamsiToGregorian, todayShamsiString } from '../utils/shamsi_data';
import { QeydarDatePickerModule } from '@qeydar/datepicker';

@Component({
  selector: 'app-news-edit',
  imports: [ReactiveFormsModule, FormsModule, RouterLink, QeydarDatePickerModule],
  templateUrl: './news-edit.html',
  styleUrl: './news-edit.css',
})
export class NewsEdit implements OnInit {
  private fb = inject(FormBuilder);
  private newsService = inject(NewsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  newsId = this.route.snapshot.paramMap.get('id') ?? '';

  editForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    abstract: ['', [Validators.required]],
  });

  tags: string[] = [];
  tagInput = '';
  // shamsiYears = Array.from({ length: 11 }, (_, i) => 1400 + i);   // ۱۴۰۰ تا ۱۴۱۰
  // shamsiMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  // shamsiDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // shYear = 1404;
  // shMonth = 1;
  // // shDay = 1;
  // jDate: string = todayShamsiString();
  jDate = '';
  time = '12:00';

  get gregorianPreview(): string {
    const g = shamsiStringToGregorian(this.jDate);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${g.gy}/${pad(g.gm)}/${pad(g.gd)}`;
  }

  imageFile: File | null = null;
  currentImage = signal('');
  loading = signal(true);
  message = signal('');
  isError = signal(false);

  ngOnInit(): void {
    this.newsService.getNews(this.newsId).subscribe({
      next: (news) => {
        this.editForm.setValue({ title: news.title, abstract: news.abstract });
        this.tags = [...news.tags];
        this.currentImage.set(news.image);

        // this.created = news.time.created.slice(0, 16);

        const d = new Date(news.time.created);
        const pad = (n: number) => String(n).padStart(2, '0');
        this.jDate = news.time.created.slice(0, 10).replaceAll('-', '/');
        this.time = news.time.created.slice(11, 16);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.isError.set(true);
        this.message.set('خبر پیدا نشد! 🚫');
      },
    });
  }


  addTag(): void {
    const value = this.tagInput.trim();
    this.tagInput = '';
    if (!value || this.tags.includes(value)) return;
    this.tags.push(value);
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0] ?? null;
  }
  submit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const fd = new FormData();
    if (this.imageFile) {
      fd.append('image', this.imageFile, this.imageFile.name);
    }
    fd.append('title', this.editForm.controls.title.value);
    fd.append('abstract', this.editForm.controls.abstract.value);
    this.tags.forEach((t) => fd.append('tags', t));
    // fd.append('created', this.created.replace('T', ' '));
    const g = shamsiStringToGregorian(this.jDate);
    const pad = (n: number) => String(n).padStart(2, '0');
    // fd.append('created', `${g.gy}-${pad(g.gm)}-${pad(g.gd)} ${this.time}`);
    fd.append('created', `${this.jDate.replaceAll('/', '-')} ${this.time}`);

    this.newsService.updateNews(this.newsId, fd).subscribe({
      next: () => this.router.navigate(['/panel_news']),
      error: (err) => {
        this.isError.set(true);
        this.message.set('ذخیره ناموفق ❌ (کد: ' + err.status + ')');
      },
    });
  }
}
