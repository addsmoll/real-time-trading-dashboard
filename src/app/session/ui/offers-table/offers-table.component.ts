import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject,
  computed
} from '@angular/core';
import { Offer } from '../../models/offer.model';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-offers-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatTab, MatTabGroup, MatTabLabel],
  templateUrl: './offers-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffersTableComponent {
  @Input({ required: true }) offers: Offer[] = [];
  @Input({ required: true }) wsStatus: 'online' | 'offline' = 'offline';
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tabs = [
    { label: 'BTC', id: '1' },
    { label: 'ETH', id: '2' },
    { label: 'SOL', id: '3' }
  ];

  private sessionId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? '1')
    ),
    { initialValue: '1' }
  );

  selectedIndex = computed(() =>
    this.tabs.findIndex(t => t.id === this.sessionId())
  );

  onTabChange(index: number) {
    const sessionId = this.tabs[index].id;
    this.router.navigate([
      environment.baseSessionUrl,
      sessionId
    ]);
  }

  displayedColumns: string[] = ['product', 'price', 'volume', 'updatedAt'];

}
