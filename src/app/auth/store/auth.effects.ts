import {Actions, Effect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Action} from "@ngrx/store";
import * as AuthActions from './auth.actions';
import {map, mergeMap, switchMap} from "rxjs/operators";
import * as firebase from 'firebase';
import {from} from "rxjs";

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
    .pipe(mergeMap((token:string)=>{
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


  constructor(private actions$: Actions) {

  }
}
