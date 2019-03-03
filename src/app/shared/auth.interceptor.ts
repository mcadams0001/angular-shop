import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import * as fromApp from '../store/app.reducer';
import * as fromAuth from '../auth/store/auth.reducers';
import {Store} from "@ngrx/store";
import {switchMap, take} from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted!', req);
    return this.store.select('auth')
      .pipe(take(1)).pipe(switchMap((authState: fromAuth.State) => {
      const copiedReq = req.clone({params: req.params.append('auth', authState.token)});
      return next.handle(copiedReq);
    }));
  }

}
