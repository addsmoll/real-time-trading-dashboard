import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, tap, delayWhen } from 'rxjs/operators';

export interface SocketEvent<T = any> {
  type: string;
  payload: T;
}

@Injectable({ providedIn: 'root' })
export class WsService {
  private url = 'wss://example.com/session';
  private socket$!: WebSocketSubject<SocketEvent>;
  private messages$ = new Subject<SocketEvent>();
  private reconnectAttempts = 0;

  connect(sessionId: string): Observable<SocketEvent> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<SocketEvent>(`${this.url}/${sessionId}`);
      this.socket$.pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(() => this.reconnectAttempts++),
            delayWhen(() => timer(Math.min(1000 * 2 ** this.reconnectAttempts, 30000)))
          )
        )
      ).subscribe({
        next: msg => this.messages$.next(msg),
        error: err => this.messages$.error(err),
        complete: () => this.messages$.complete()
      });
    }
    return this.messages$.asObservable();
  }

  disconnect() {
    this.socket$?.complete();
    this.reconnectAttempts = 0;
  }
}
