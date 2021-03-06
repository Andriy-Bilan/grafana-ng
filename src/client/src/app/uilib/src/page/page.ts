import { Component, Input, ViewEncapsulation } from '@angular/core';
import { PageNavigation } from 'common';

@Component({
  selector: 'ed-page',
  host: {'class': 'page-wrapper'},
  encapsulation: ViewEncapsulation.None,
  template: `
    <ed-page-header [navigation]="navigation"></ed-page-header>

    <div class="page-container page-body">
      <ng-content></ng-content>
    </div>

    <ed-page-footer></ed-page-footer>`
})
export class PageComponent {
  @Input() navigation: string | PageNavigation;
  @Input() disabled: boolean = false;
}


