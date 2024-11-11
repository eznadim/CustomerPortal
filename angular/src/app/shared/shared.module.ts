import { CoreModule } from '@abp/ng.core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommercialUiModule } from '@volo/abp.commercial.ng.ui';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { NgxValidateCoreModule } from '@ngx-validate/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
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
  ],
  exports: [
    CoreModule,
    ThemeSharedModule,
    CommercialUiModule,
    NgbDropdownModule,
    NgxValidateCoreModule,
    CommonModule,
  ],
  providers: [OnlyNumbersDirective]
})
export class SharedModule {}
