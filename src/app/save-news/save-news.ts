import { Component, computed, signal } from '@angular/core';
import { Savenews } from '../services/savenews';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../services/news';
import { shamsiStringToGregorian, shamsiToGregorian, todayGregorianString, todayShamsiString } from '../utils/shamsi_data';
import { ImageUploader } from '../image-uploader/image-uploader';
import { QeydarDatePickerModule } from '@qeydar/datepicker';

@Component({
  selector: 'app-save-news',
  imports: [FormsModule, RouterLink, RouterOutlet, ImageUploader, QeydarDatePickerModule],
  templateUrl: './save-news.html',
  styleUrl: './save-news.css',
})
export class SaveNews {
  title = '';
  abstract = '';
  tags: string[] = [];
  tagInput = '';
  created = '';
  // shamsiYears = Array.from({ length: 11 }, (_, i) => 1400 + i);   // ۱۴۰۰ تا ۱۴۱۰
  // shamsiMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  // shamsiDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // shYear = 1404;
  // shMonth = 1;
  // shDay = 1;

  // متغیرهای جدید:
  // jDate: string = todayShamsiString();   // در edit مقدار اولیه مهم نیست، در ngOnInit پر میشه
  time = '12:00';
 jDate: string = todayGregorianString();


  // get gregorianPreview(): string {
  //   const g = shamsiStringToGregorian(this.jDate);
  //   const pad = (n: number) => String(n).padStart(2, '0');
  //   return `${g.gy}/${pad(g.gm)}/${pad(g.gd)}`;
  // }
  //
  imageFile: File | null = null;
  message = signal('');
  isError = signal(false);
  constructor(
    private savenews_service: NewsService,
    private router: Router

  ) { }

  // 

  onFileSelected(file: File): void {
    this.imageFile = file;
  }

  ////
  addTag(): void {
    const value = this.tagInput.trim();
    this.tagInput = '';
    if (!value || this.tags.includes(value)) return;   // خالی یا تکراری؟ نادیده بگیر
    this.tags.push(value);
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter((t) => t !== tag);
  }


  submit(): void {
    if (!this.imageFile) {
      this.isError.set(true);
      this.message.set(' تصویر اجباریه ');
      return;
    }



    const fd = new FormData();
    fd.append('image', this.imageFile, this.imageFile.name);
    fd.append('title', this.title);
    fd.append('abstract', this.abstract);

    this.tags.forEach((t) => fd.append('tags', t));
    // fd.append('created', this.created.replace('T', ' '));
    const g = shamsiStringToGregorian(this.jDate);
    const pad = (n: number) => String(n).padStart(2, '0');
    // fd.append('created', `${g.gy}-${pad(g.gm)}-${pad(g.gd)} ${this.time}`);
    fd.append('created', `${this.jDate.replaceAll('/', '-')} ${this.time}`);

    this.savenews_service.createNews(fd).subscribe({
      next: () => this.router.navigate(['/panel_news']),
      error: (err) => {
        this.isError.set(true);
        this.message.set('ثبت ناموفق ❌ (کد: ' + err.status + ')');
      },
    });
  }

  logDate(value: any): void {
  console.log('خروجی پیکر:', value, '| نوع:', typeof value);
}
}

