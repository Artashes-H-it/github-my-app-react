 export function isAuthenticatedFunc() {
    let token = localStorage.getItem('token');
    if(token == null || token == undefined || token.length == 0) {
         return  false;
    }
    
    return true;
}

export function formatRelativeDate(isoDate, prevIsoDate = null) {
  const date = new Date(isoDate);

  if (!prevIsoDate) {
    return formatDate(date);
  }

  const prevDate = new Date(prevIsoDate);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, prevDate)) {
    return null;
  }

  
  return formatDate(date);
}

function formatDate(date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, tomorrow)) return "Tomorrow";

  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
