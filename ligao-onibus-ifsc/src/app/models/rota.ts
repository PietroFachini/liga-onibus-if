export interface Rota {
  id: string;
  atrasado: boolean;
  concluida: boolean;
  horario: string;
  rota: string;
  tempo?: number;
}