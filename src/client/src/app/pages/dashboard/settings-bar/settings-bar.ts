import { Component } from '@angular/core';
import { AnnotationRule, DashboardLink, DashboardLinkType, DashboardStore } from 'common';
import { FadeInOutAnimation } from 'uilib';
import { BaseDasboardComponent } from '../base/dashboard-base';

@Component({
  selector: 'dashboard-settings-bar',
  templateUrl: './settings-bar.html',
  animations: [FadeInOutAnimation],
})
export class DashboardSettingsBarComponent extends BaseDasboardComponent {

  DashboardLinkTypeRef = DashboardLinkType;

  get annotationRules(): AnnotationRule[]{
    return this
      .dashboard
      ?.data
      .annotationRules
      ?.filter( x => !x.buildIn );
  }

  get links(): DashboardLink[]{
    return this
      .dashboard
      ?.data
      .links;
  }

  get hasLinks() : boolean{
    return this.links?.length > 0;
  }

  get hasCustomAnnotationRules() : boolean{
    return this.annotationRules?.length > 0;
  }

  get showSettingsBar() : boolean{
    return this.hasLinks /*|| this.hasCustomAnnotationRules*/;
  }
	
  constructor( store: DashboardStore ){
      super( store );

  }
}
