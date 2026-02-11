import {Component, Input, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { Offer } from '../../models/offer.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-offers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './offers-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersTableComponent implements OnInit{

  @Input({ required: true }) offers: Offer[] = [];
  @Input({ required: true }) wsStatus: 'online' | 'offline' = 'offline';

  displayedColumns: string[] = ['product', 'price', 'volume', 'updatedAt'];

  ngOnInit() {
    console.log('OffersTableComponent', this.offers);
  }

  trackByOfferId(index: number, offer: Offer) {
    return offer.id;
  }
}
