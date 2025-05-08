export interface IExtrusion {
  turno: string; // "Dia" o "Noche"
  linea: number; // "Linea 1", "Linea 2", etc.
  acumulado: number; // Valor numérico del acumulado de producción
  objetivo: number; // Valor numérico del objetivo de producción
  mala: number; // Valor numérico de la producción mala
  cumplimiento: number; // Porcentaje de cumplimiento
  calidad: number; // Porcentaje de calidad
  promedio: number; // Promedio entre cumplimiento y calidad
}

export interface ICorte {
  turno: string; // "Dia" o "Noche"
  avance: number; // Valor numérico del acumulado de producción
  objetivo: number; // Valor numérico del objetivo de producción
  promedio: number; // Promedio entre cumplimiento y calidad
}

export interface ITermoformado {
  turno: string;
}
export interface IEmpaque {
  turno: string;
}
export interface IEmbultaje {
  turno: string;
}

export interface IImpresion {
  turno: string; // "Dia" o "Noche"
  avance: number; // Valor numérico del acumulado de producción
  objetivo: number; // Valor numérico del objetivo de producción
  promedio: number; // Promedio entre cumplimiento y calidad
}

export interface IMezcla {
  turno: string;
}

export type IGeneral =
  | IExtrusion
  | ICorte
  | ITermoformado
  | IEmpaque
  | IEmbultaje
  | IImpresion
  | IMezcla;
