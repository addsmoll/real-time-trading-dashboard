import { Component, inject, computed, signal } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {

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

}
