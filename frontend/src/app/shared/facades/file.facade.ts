import { inject, Injectable, signal } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { FileService, FileResponse } from '../../services/file.service';
import { BaseComponent } from '../helpers/base-component';

@Injectable({
  providedIn: 'root'
})
export class FileFacade extends BaseComponent {
  private fileService = inject(FileService);

  // Estados gerenciados pela Facade
  isUploading = signal(false);
  errorMessage = signal<string | null>(null);
  lastUploadedFile = signal<FileResponse | null>(null);

  uploadFile(file: File, onSuccess?: (res: FileResponse) => void): void {
    this.isUploading.set(true);
    this.errorMessage.set(null);

    this.fileService.upload(file)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.isUploading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.lastUploadedFile.set(response);
          if (onSuccess) onSuccess(response);
        },
        error: (err) => {
          console.error('FileFacade: Error uploading file:', err);
          this.errorMessage.set('Erro ao fazer upload do arquivo.');
        }
      });
  }

  loadFileById(id: string): void {
    this.fileService.getFileById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (response) => this.lastUploadedFile.set(response),
        error: (err) => console.error(`FileFacade: Error fetching file ${id}:`, err)
      });
  }
}
