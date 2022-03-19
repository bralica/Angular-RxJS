import {ChangeDetectionStrategy, Component } from '@angular/core';

import {BehaviorSubject, combineLatest, EMPTY, Subject} from 'rxjs';

import { ProductService } from './product.service';
import {catchError, filter, map, startWith, tap} from 'rxjs/operators';
import {ProductCategoryService} from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) { }

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ])
    .pipe(
      map(([products, selectedCategoryId]) =>
         products.filter(product =>
          selectedCategoryId ? product.categoryId === selectedCategoryId : true
        ),
      ),
      // map(([products, selectedCategoryId]) =>
      //   products.filter(product => {
      //     const selected = selectedCategoryId ? product.categoryId === selectedCategoryId : true;
      //     console.log('SELECTED ', selected);
      //     return selected;
      //   }),
      // ),
      tap(products => console.log('LATEST ', products)),
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('category id ', categoryId);
    this.categorySelectedSubject.next(+categoryId);
    // console.log('Not yet implemented');
    // console.log('selected category id ', categoryId);
    // this.selectedCategoryId = +categoryId;
  }
}
