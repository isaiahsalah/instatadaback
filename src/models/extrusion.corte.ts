export type ExtrusionModel = {
    turno: string;
    linea: number;
    acumulado: number;
    objetivo: number;
    mala: number;
    cumplimiento: number;
    calidad: number;
    promedio: number;
  };

  export type Extrusion_PA =Pick <ExtrusionModel, "turno" |"linea"|"acumulado"|"mala">

  export type Extrusion_PO = Pick <ExtrusionModel, "turno" |"linea"|"objetivo">