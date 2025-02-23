export interface LoginData {
  identificador: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cnpj?: string;
  datanascimento: Date | string;
  razaosocial?: string;
}

export interface RecoverPasswordData {
  email: string;
  cpf: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ValidateResetPasswordData {
  token: string;
}
