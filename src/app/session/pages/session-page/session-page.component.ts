import {Component, inject} from '@angular/core';
import { SessionFacade } from '../../data-access/state/session.facade';
import {AsyncPipe, CommonModule} from '@angular/common';
import {OffersTableComponent} from '../../ui/offers-table/offers-table.component';

@Component({
  selector: 'app-session-page',
  standalone: true,
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss'],
  imports: [CommonModule, OffersTableComponent, AsyncPipe],
})
export class SessionPageComponent {
  private facade = inject(SessionFacade);
  offers$ = this.facade.offers$;
  wsStatus$ = this.facade.wsStatus$;
}
