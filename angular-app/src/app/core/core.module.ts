import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule } from '@ngx-translate/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
    CachePreventionInterceptor,
    CorsSecurityInterceptor,
    CsrfPreventionInterceptor,
    EuLoginSessionTimeoutHandlingInterceptor,
    CoreModule as UxCoreModule,
    translateConfig,
} from '@eui/core';

import './operators';

import { appConfig } from '../../config/index';
import { environment } from '../../environments/environment';

import { REDUCER_TOKEN, getReducers, metaReducers } from './reducers/index';

import { SearchInputComponent } from './components/shell/search-input/search-input.component';

import { SharedModule } from '../shared/shared.module';
import { ZipkinInterceptor } from './interceptors/zipkin.interceptor';

@NgModule({
    imports: [
        SharedModule,
        UxCoreModule.forRoot({ appConfig: appConfig, environment: environment }),
        StoreModule.forRoot(REDUCER_TOKEN, { metaReducers }),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
        TranslateModule.forRoot(translateConfig),
    ],
    declarations: [
        SearchInputComponent
    ],
    exports: [
        SharedModule,
        SearchInputComponent
    ],
    providers: [
        {
            provide: REDUCER_TOKEN,
            deps: [],
            useFactory: getReducers
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ZipkinInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CorsSecurityInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: EuLoginSessionTimeoutHandlingInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CsrfPreventionInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CachePreventionInterceptor,
            multi: true,
        },
    ]
})
export class CoreModule {

}
