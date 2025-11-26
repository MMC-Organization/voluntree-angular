export interface Ong {
  id?: string;
  cnpj: string;
  name: string; // Razão Social
  nomeFantasia?: string;
  responsavel: string;
  email: string;
  telefone: string;
  createdAt?: Date;
}

export interface OngSignup {
  cnpj: string;
  name: string;
  nomeFantasia?: string;
  responsavel: string;
  email: string;
  telefone: string;
  password: string;
}
