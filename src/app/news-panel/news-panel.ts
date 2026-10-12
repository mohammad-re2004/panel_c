import { Component, computed, OnInit, signal } from '@angular/core';
import { Panel } from '../panel/panel';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { NewsService } from '../services/news';
import { News, PagedNews } from '../interfaces/news_interface';
import { DatePipe } from '@angular/common';
import { ShamsiDate } from '../directives/shamsi-date';


@Component({
  selector: 'app-news-panel',
  imports: [Panel, RouterOutlet, DatePipe, RouterLinkWithHref,ShamsiDate],
  templateUrl: './news-panel.html',
  styleUrl: './news-panel.css',
})
export class NewsPanel implements OnInit {

  result = signal<PagedNews | null>(null);
  page = 1;
  limit = 5;


  pages = computed(() =>
    Array.from({ length: this.result()?.totalPages ?? 0 }, (_, i) => i + 1)
  );



  constructor(private news_service: NewsService) { }
  ngOnInit(): void {

    this.loadnews()



  }

  loadnews(): void {
    this.news_service
      .getAllnews({
        page: this.page,
        limit: this.limit,
        title: '',
        description: '',
        tags: [],
        fromDate: '',
        toDate: '',
      })
      .subscribe({
        next: (res) => {
          this.result.set(res);
        },

        error: (err) => alert("خطلا در دیافت"),

      }
      );
  }
  goToPage(p: number): void {
    const total = this.result()?.totalPages ?? 1;
    if (p < 1 || p > total || p === this.page) return;
    this.page = p;
    this.loadnews();
  }

  toPersianDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));
}

deleteNews(news: News): void {
  if (!confirm(`خبر «${news.title}»  حذف شود؟`)) return;

  this.news_service.deleteNews(news.id).subscribe({
    next: () => this.loadnews(),
    complete() {
      alert("حذف موفق")
    },
      // لیست رو از نو بخون تا صفحه‌بندی هم درست بمونه
    error: (err) => {
      console.error('حذف ناموفق:', err);
      alert('حذف ناموفق بود! (کد: ' + err.status + ')');
    },
  });
}


}
