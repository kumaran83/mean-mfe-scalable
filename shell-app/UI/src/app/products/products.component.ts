import { Component, OnInit } from '@angular/core';
import { BasketService } from '../service/basket.service';
import { Product } from '../service/product';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styles: [
  ]
})
export class ProductsComponent implements OnInit {
  public products: Product[] = [];
  public isLoading: boolean = false;

  constructor(private productsService: ProductsService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getProducts()
      .subscribe({
        next: (products) => { this.products = products; this.isLoading = false; },
        error: (error) => { console.error('Error loading products:', error); this.isLoading = false; }
      });
  }

  public addToBasket(productId: number): void {
    const product = this.products.find(p => p.id === productId) as Product;
    this.basketService.addToBasket(product);
  }
}
