import dayjs from "dayjs";
// const format = (times: string, fmt: string) => {
//   const currentDate = new Date(times);
//   const o: { [t: string]: number } = {
//     "M+": currentDate.getMonth() + 1, // 月份
//     "d+": currentDate.getDate(), // 日
//     "h+": currentDate.getHours(), // 小时
//     "m+": currentDate.getMinutes(), // 分
//     "s+": currentDate.getSeconds(), // 秒
//     "q+": Math.floor((currentDate.getMonth() + 3) / 3), // 季度
//     S: currentDate.getMilliseconds(), // 毫秒
//   };
//   if (/(y+)/.test(fmt)) {
//     fmt = fmt.replace(RegExp.$1, (currentDate.getFullYear() + "").substring(4 - RegExp.$1.length));
//   }
//   for (var k in o) {
//     if (new RegExp("(" + k + ")").test(fmt)) {
//       fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k].toString() : ("00" + o[k]).substring(("" + o[k]).length));
//     }
//   }
//   return fmt;
// };

// export function formatTimeToStr(times: string, pattern?: string) {
//   let d: string = "";
//   if (pattern) {
//     d = format(times, pattern);
//   } else {
//     d = format(times, "yyyy-MM-dd hh:mm:ss");
//   }

//   return d.toLocaleString();
// }

export function calculationTime(times?: string): string {
  const days = dayjs(times);
  const currentDays = dayjs();
  let duration = 0;
  duration = currentDays.diff(days, "year");
  if (duration > 0) {
    return duration + "年前";
  }
  duration = currentDays.diff(days, "month");
  if (duration > 0) {
    return duration + "个月前";
  }
  duration = currentDays.diff(days, "day");
  if (duration > 0) {
    return duration + "天前";
  }
  duration = currentDays.diff(days, "hour");
  if (duration > 0) {
    return duration + "小时前";
  }
  duration = currentDays.diff(days, "minute");
  if (duration > 0) {
    if (duration < 5) {
      return "几分钟前";
    }
    return duration + "分钟前";
  }
  duration = currentDays.diff(days, "second");
  if (duration > 0) {
    return "刚刚";
  }
  return "刚刚";
}

// export function setLocalStorage(item, value) {
//   localStorage.setItem(item, JSON.stringify(value));
// }

// export function getLocalStorage(item) {
//   const params = localStorage.getItem(item);
//   if (params.indexOf("{") === 0) {
//     return JSON.parse(params);
//   }
// }
