import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RecipeActions from '../store/recipe.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRecipe from '../store/recipe.reducers';

@Injectable()
export class RecipeEffects {
  @Effect()
  recipeFetch = this.actions$
    .pipe(ofType(RecipeActions.FETCH_RECIPES))
    .pipe(switchMap((action: RecipeActions.FetchRecipes) => {
      console.log('Call recipes service');
      return this.http.get<Recipe[]>('https://ng-recipe-book-f582e.firebaseio.com/recipes.json');
    }))
    .pipe(map((recipes: Recipe[]) => {
        console.log(recipes);
        for (let recipe of recipes) {
          if (!recipe['ingredients']) {
            recipe['ingredients'] = [];
          }
        }
        return {
          type: RecipeActions.SET_RECIPES,
          payload: recipes
        };
      }
    ));

  @Effect({dispatch: false})
  recipeStore = this.actions$
    .pipe(ofType(RecipeActions.STORE_RECIPES))
    .pipe(withLatestFrom(this.store.select('recipes')))
    .pipe(switchMap(([action, state]) => {
      const req = new HttpRequest('PUT', 'https://ng-recipe-book-f582e.firebaseapp.com/recipes.json',
        state.recipes, {reportProgress: true, headers: new HttpHeaders().append('Access-Control-Allow-Origin', '*')});
      return this.http.request(req);
    }));

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromRecipe.FeatureState>) {
  }
}
