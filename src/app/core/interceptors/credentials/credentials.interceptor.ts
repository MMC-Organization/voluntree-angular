import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@/environments/environment';

/**
 * Interceptor que adiciona automaticamente withCredentials: true
 * APENAS em requisições para o backend da aplicação (não para APIs externas).
 * 
 * Isso permite que o navegador envie e receba cookies (como JSESSIONID)
 * em requisições para o backend Spring Boot, mas não interfere com
 * requisições para APIs externas (como ViaCEP) que não suportam credentials.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Verifica se a requisição é para o backend da aplicação
  const isBackendRequest = req.url.startsWith(environment.apiUrl) || 
                          req.url.startsWith('/api');
  
  // Adiciona withCredentials apenas para requisições ao backend
  if (isBackendRequest) {
    const authReq = req.clone({
      withCredentials: true
    });
    return next(authReq);
  }
  
  // Para requisições externas, mantém a requisição original
  return next(req);
};
