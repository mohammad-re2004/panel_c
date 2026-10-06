import { Component, signal } from '@angular/core';
import { Savenews } from '../services/savenews';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-save-news',
  imports: [FormsModule, RouterLink, RouterOutlet],
  templateUrl: './save-news.html',
  styleUrl: './save-news.css',
})
export class SaveNews {
  title = '';
  abstract = '';
  tags: string[] = [];
  tagInput = '';
  created = '';
  imageFile: File | null = null;
  message = signal('');
  isError = signal(false);
  constructor(
    private savenews_service: Savenews,
    private router: Router

  ) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0] ?? null;
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
      this.message.set('انتخاب تصویر اجباریه! 🖼️');
      return;
    }



    const fd = new FormData();
    fd.append('image', this.imageFile, this.imageFile.name);
    fd.append('title', this.title);
    fd.append('abstract', this.abstract);
    
    this.tags.forEach((t) => fd.append('tags', t));
    fd.append('created', this.created.replace('T', ' '));

    this.savenews_service.createNews(fd).subscribe({
      next: () => this.router.navigate(['/panel_news']),
      error: (err) => {
        this.isError.set(true);
        this.message.set('ثبت ناموفق ❌ (کد: ' + err.status + ')');
      },
    });
  }

}

