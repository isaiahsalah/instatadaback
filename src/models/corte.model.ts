export type CorteModel = {
    turno: string;
    avance: number;
    objetivo: number;
    promedio: number;
  };

  export type Corte_PA =Pick <CorteModel, "turno" |"avance">

  export type Corte_PO = Pick <CorteModel, "turno" |"objetivo">