import { RouterStateSerializer } from '@ngrx/router-store';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface RouterStateUrl {
  url: string;
  params: Record<string, any>;
}

export class CustomSerializer
  implements RouterStateSerializer<RouterStateUrl>
{

  serialize(routerState: RouterStateSnapshot): RouterStateUrl {

    let route: ActivatedRouteSnapshot = routerState.root;

    // идём до самого глубокого child route
    while (route.firstChild) {
      route = route.firstChild;
    }

    return {
      url: routerState.url,
      params: route.params
    };
  }
}
