import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../services/news';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-edit',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
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
  created = '';

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
        // "2026-09-11T14:55:00Z" → "2026-09-11T14:55" برای datetime-local
        this.created = news.time.created.slice(0, 16);
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
    fd.append('created', this.created.replace('T', ' '));

    this.newsService.updateNews(this.newsId, fd).subscribe({
      next: () => this.router.navigate(['/panel_news']),
      error: (err) => {
        this.isError.set(true);
        this.message.set('ذخیره ناموفق ❌ (کد: ' + err.status + ')');
      },
    });
  }
}
