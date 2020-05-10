import {transition, trigger, query, style, animate, group, animateChild, useAnimation} from '@angular/animations';
import { zoomIn } from 'ng-animate';

export const fadeInAnimation =
  trigger('routeAnimations', [
    transition('* => *', [
      query(':enter, :leave',
        style({ position: 'fixed', width: '100%', height: '100%'  }),
        { optional: true }),
      group([
        query(':enter',[
          style({ transform: 'translateY(-100%)', opacity: '0%' }),
          animate('0.5s ease-in-out',
            style({ transform: 'translateY(0%)', opacity: '100%' }))
        ], { optional: true }),
        query(':leave', [
          style({ transform:   'translateY(0%)', opacity: '100%'}),
          animate('0.5s ease-in-out',
            style({ transform: 'translateY(100%)', opacity: '0%' }))
        ], { optional: true }),
      ])
    ]),
  ]);

export const zoomInAnimation =
  trigger('zoomInAnimation', [
    transition(':enter', useAnimation(zoomIn, { params: { timing: 0.8 } }))
  ]);
