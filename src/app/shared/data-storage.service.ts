import {Injectable} from '@angular/core';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService) {
  }

  storeRecipes() {
    /*    return this.http.put('https://ng-recipe-book-f582e.firebaseapp.com/recipes.json', this.recipeService.getRecipes(),{
          params: new HttpParams().set('auth', token)
        });*/
    const req = new HttpRequest('PUT', 'https://ng-recipe-book-f582e.firebaseapp.com/recipes.json',
      this.recipeService.getRecipes(), {reportProgress: true,
        headers: new HttpHeaders().append('Access-Control-Allow-Origin', '*')});
    return this.http.request(req);
  }

  getRecipes() {
    this.http.get<Recipe[]>('https://ng-recipe-book-f582e.firebaseio.com/recipes.json')
      .pipe(
        map((recipes: Recipe[]) => {
            console.log(recipes);
            for (const recipe of recipes) {
              if (!recipe['ingredients']) {
                recipe['ingredients'] = [];
              }
            }
            return recipes;
          }
        )).subscribe(
      (recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      }
    );
  }
}
