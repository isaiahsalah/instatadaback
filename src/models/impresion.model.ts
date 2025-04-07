export type ImpresionModel = {
    turno: string;
    avance: number;
    objetivo: number;
    promedio: number;
  };

  export type Impresion_PA =Pick <ImpresionModel, "turno" |"avance">

  export type Impresion_PO = Pick <ImpresionModel, "turno" |"objetivo">