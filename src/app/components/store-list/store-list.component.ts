import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
})
export class StoreListComponent implements OnInit {
  stores: any[] = [];
  filteredStores: any[] = [];
  filter = {
    name: '',
    description: ''
  };

  constructor(private storeService: StoreService) {}

  ngOnInit() {
    this.storeService.getStores().subscribe((data) => {
      this.stores = data;
      this.applyFilters(); // Aplica los filtros iniciales
    });
  }

  // Aplica los filtros a la lista de tiendas
  applyFilters() {
    this.filteredStores = this.stores.filter((store) =>
      store.name.toLowerCase().includes(this.filter.name.toLowerCase()) &&
      store.description.toLowerCase().includes(this.filter.description.toLowerCase())
    );
  }
}
