import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import * as AuthActions from './auth.actions';
import {map, mergeMap, switchMap, tap} from 'rxjs/operators';
import * as firebase from 'firebase';
import {from} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup: Observable<Action> = this.actions$
    .pipe(ofType(AuthActions.TRY_SIGNUP)).pipe(map((action: AuthActions.TrySignup) => {
      return action.payload;
    }))
    .pipe(switchMap((authData: { username: string, password: string }) => {
      return from(firebase.auth().createUserWithEmailAndPassword(authData.username, authData.password));
    }))
    .pipe(switchMap(() => {
      return from(firebase.auth().currentUser.getIdToken());
    }))
    .pipe(mergeMap((token: string) => {
      return [
        {
          type: AuthActions.SIGNUP
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token
        }
      ];
    }));

  @Effect()
  authSignin: Observable<Action> = this.actions$
    .pipe(ofType(AuthActions.TRY_SIGNIN)).pipe(map((action: AuthActions.TrySignin) => {
      return action.payload;
    }))
    .pipe(switchMap((authData: { username: string, password: string }) => {
      return from(firebase.auth().signInWithEmailAndPassword(authData.username, authData.password));
    }))
    .pipe(switchMap(() => {
      return from(firebase.auth().currentUser.getIdToken());
    }))
    .pipe(mergeMap((token: string) => {
      this.router.navigate(['/']);
      return [
        {
          type: AuthActions.SIGNUP
        },
        {
          type: AuthActions.SET_TOKEN,
          payload: token
        }
      ];
    }));

  @Effect({dispatch: false})
  authLogout = this.actions$
    .pipe(ofType(AuthActions.LOGOUT))
    .pipe(tap(() => {
      this.router.navigate(['/']);
    }));

  constructor(private actions$: Actions, private router: Router) {

  }
}
