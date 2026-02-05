import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FileResponse {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/file`;

  upload(file: File): Observable<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<FileResponse>(`${this.apiUrl}/upload`, formData);
  }

  getFileById(id: string): Observable<FileResponse> {
    return this.http.get<FileResponse>(`${this.apiUrl}/${id}`);
  }
}

