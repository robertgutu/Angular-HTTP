import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpClient, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';

function loggingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    
    // const req = request.clone({
    //     headers: request.headers.set('X-DEBUG', 'TESTING')
    // })
    console.log('outgoiong request!')
    console.log(request);
    // return next(req)
    return next(request)
}

bootstrapApplication(AppComponent, {
    providers:[provideHttpClient(
        withInterceptors([loggingInterceptor])
    )]
}).catch((err) => console.error(err));
