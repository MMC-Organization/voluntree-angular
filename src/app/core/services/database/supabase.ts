import { Injectable } from '@angular/core';

/**
 * Mock do Supabase Client para evitar erros de compilação.
 * Este serviço retorna uma implementação fake que não faz nada,
 * já que a aplicação agora usa a API REST do backend Spring Boot.
 */
@Injectable({
  providedIn: 'root'
})
export class Supabase {
  get client() {
    return {
      from: (table: string) => ({
        select: (columns: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => ({ data: null, error: { message: 'Supabase desabilitado. Use a API REST.' } })
          }),
          limit: (count: number) => ({
            then: async () => ({ data: [], error: null })
          })
        }),
        insert: (data: any) => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: 'Supabase desabilitado. Use a API REST.' } })
          })
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({
            single: async () => ({ data: null, error: { message: 'Supabase desabilitado. Use a API REST.' } })
          })
        }),
        delete: () => ({
          eq: (column: string, value: any) => ({
            then: async () => ({ data: null, error: { message: 'Supabase desabilitado. Use a API REST.' } })
          })
        })
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: { message: 'Supabase desabilitado. Use a API REST.' } }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase desabilitado. Use a API REST.' } }),
        signUp: async () => ({ data: null, error: { message: 'Supabase desabilitado. Use a API REST.' } }),
        signOut: async () => ({ error: { message: 'Supabase desabilitado. Use a API REST.' } })
      }
    };
  }
}
