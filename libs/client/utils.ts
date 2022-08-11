export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function timeForToday(time: Date) {
  const pastTime = new Date(time);
  const curTime = new Date();

  const betweenTime = Math.floor(
    (curTime.getTime() - pastTime.getTime()) / 1000 / 60
  );

  if (betweenTime < 1) {
    return "방금";
  } else if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);

  if (betweenTimeHour === 1) {
    return "한 시간 전";
  }
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);

  if (betweenTimeDay === 1) {
    return "하루 전";
  }

  if (betweenTimeDay < 30) {
    return `${betweenTimeDay}일 전`;
  }

  const betweenTimeMonth = Math.floor(betweenTime / 60 / 24 / 30);

  if (betweenTimeMonth === 1) {
    return "한달 전";
  }

  if (betweenTimeMonth < 12) {
    return `${betweenTimeMonth}달 전`;
  }

  const betweenTimeYear = Math.floor(betweenTime / 60 / 24 / 30 / 12);

  if (betweenTimeYear === 1) {
    return "일 년 전";
  }

  return `${betweenTimeYear}년 전`;
}
