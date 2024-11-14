import { CoreModule } from '@abp/ng.core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommercialUiModule } from '@volo/abp.commercial.ng.ui';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';

@NgModule({
  declarations: [
    OnlyNumbersDirective],
  imports: [
    CoreModule,
    ThemeSharedModule,
    CommercialUiModule,
    NgbDropdownModule,
    NgxValidateCoreModule,
    CommonModule,
    NgbModule,
    NzSelectModule
  ],
  exports: [
    CoreModule,
    ThemeSharedModule,
    CommercialUiModule,
    NgbDropdownModule,
    NgxValidateCoreModule,
    CommonModule,
    NgbModule,
    NzSelectModule
    
  ],
  providers: [OnlyNumbersDirective]
})
export class SharedModule {}
