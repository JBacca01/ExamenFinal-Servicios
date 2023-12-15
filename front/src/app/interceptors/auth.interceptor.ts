import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../public/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService) {}
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let cloneReq = request;
    this.loader.setActive();

    if (
      localStorage.getItem('token_auth') &&
      !request.url.endsWith('/register')
    ) {
      cloneReq = request.clone({
        setHeaders: {
          Authorization: localStorage.getItem('token_auth')!,
        },
      });
    }
    return next.handle(cloneReq).pipe(
      finalize(() => {
        this.loader.setInactive();
      })
    );
  }
}