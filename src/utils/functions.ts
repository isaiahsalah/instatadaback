// Función para calcular el rango de fechas predeterminado
export const getDefaultWeekRange = (): {startDate: string; endDate: string} => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

  // Calcular el lunes de la semana actual
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  // Calcular el viernes de la semana actual
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  // Formatear las fechas como YYYY-MM-DD
  const formatDate = (date: Date): string => date.toISOString().split("T")[0];
  return {
    startDate: formatDate(monday),
    endDate: formatDate(friday),
  };
};
