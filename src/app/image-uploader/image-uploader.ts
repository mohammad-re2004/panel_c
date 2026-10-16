import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  imports: [],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.css',
})
export class ImageUploader {

  @Input() preview: string = '';     
  @Output() fileSelected = new EventEmitter<File>();

  isDragging = signal(false);
  localPreview = signal('');         

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging.set(false);
    const file = e.dataTransfer?.files[0];
    this.handleFile(file);
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.handleFile(file);
    input.value = '';   
  }

  private handleFile(file: File | undefined): void {
    if (!file || !file.type.startsWith('image/')) return;
    this.localPreview.set(URL.createObjectURL(file));
    this.fileSelected.emit(file);
  }
}
