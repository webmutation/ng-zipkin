import * as zipkin from 'zipkin';
const { BatchRecorder, jsonEncoder: { JSON_V2 } } = zipkin;
import { HttpLogger } from 'zipkin-transport-http';

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// Send spans to Zipkin asynchronously over HTTP
const zipkinBaseUrl = 'http://localhost:9411';

// TODO: this is just to test setting the headers, the mechanism will come later.

@Injectable()
export class ZipkinInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request.clone({
            headers: request.headers
                .set('X-B3-TraceId', 'example-TraceId')
                .set('X-B3-ParentSpanId', 'example-ParentSpanId')
                .set('X-B3-SpanId', 'example-SpanId')
                .set('X-B3-Sampled', 'example-Sampled')
        }));
    }
}
