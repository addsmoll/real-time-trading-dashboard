import {Component, Input, ChangeDetectionStrategy, OnInit, inject, signal, computed} from '@angular/core';
import { Offer } from '../../models/offer.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';

@Component({
  selector: 'app-offers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatTab, MatTabGroup, MatTabLabel],
  templateUrl: './offers-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersTableComponent implements OnInit{
  @Input({ required: true }) offers: Offer[] = [];
  @Input({ required: true }) wsStatus: 'online' | 'offline' = 'offline';
  private router = inject(Router);

  tabs = [
    { label: 'BTC', id: '1' },
    { label: 'ETH', id: '2' },
    { label: 'SOL', id: '3' }
  ];

  private currentSession = signal<string>('1');

  selectedIndex = computed(() =>
    this.tabs.findIndex(t => t.id === this.currentSession())
  );

  constructor() {

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {

        const url = this.router.url;
        const parts = url.split('/');

        const sessionId = parts[parts.length - 1];

        if (sessionId) {
          this.currentSession.set(sessionId);
        }
      });
  }

  onTabChange(index: number) {

    const sessionId = this.tabs[index].id;

    this.router.navigate([
      environment.baseSessionUrl,
      sessionId
    ]);
  }


  displayedColumns: string[] = ['product', 'price', 'volume', 'updatedAt'];

  ngOnInit() {
    console.log('OffersTableComponent', this.offers);
  }

  trackByOfferId(index: number, offer: Offer) {
    return offer.id;
  }
}
