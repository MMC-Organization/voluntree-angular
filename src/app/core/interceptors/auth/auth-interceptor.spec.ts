import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
  
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authInterceptor).toBeTruthy();
  });

  it('deve adicionar o cabeçalho Authorization se tiver token no localStorage', () => {
   
    const fakeToken = 'token-falso-123';
    localStorage.setItem('access_token', fakeToken);
    httpClient.get('/test-api').subscribe();

    const req = httpTestingController.expectOne('/test-api');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
  });

  it('NÃO deve adicionar o cabeçalho se não tiver token', () => {
    localStorage.removeItem('access_token');

    httpClient.get('/test-api').subscribe();

    const req = httpTestingController.expectOne('/test-api');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });
});