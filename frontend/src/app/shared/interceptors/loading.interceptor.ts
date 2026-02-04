// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
// import { Observable, finalize } from 'rxjs';
// import { LoadingService } from '../../components/loading/loading.service';

// @Injectable()
// export class LoadingInterceptor implements HttpInterceptor {
//     constructor(private loadingService: LoadingService) {}

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         let message = 'Carregando...';
//         if (req.method === 'GET') {
//             message = 'Carregando dados...';
//         } else if (req.method === 'POST') {
//             message = 'Enviando dados...';
//         }
//         this.loadingService.show(message);
//         return next.handle(req).pipe(
//             finalize(() => {
//                 this.loadingService.hide();
//             }),
//         );
//     }
// }
