export const convertDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  if (Number(day) < 10) {
    day = '0' + day;
  }
  if (Number(month) < 10) {
    month = '0' + month;
  }

  return year + '-' + month + '-' + day;
};
