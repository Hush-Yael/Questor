
export function throttle(fn: () => void, wait: number) {
  let time = Date.now();
  
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
}

const getTimeUnits = (num: number, base: 'ms' | 's') => {
  let seconds = 0;

  if (base === 'ms')
    seconds = Math.floor(num / 1000);
  if (base === 's') 
    seconds = num
  
  const minutes = Math.floor(seconds / 60), hours = Math.floor(minutes / 60);

  return {
    seconds,
    minutes,
    hours
  }
}

export function toTimeStr(num: number, base: 'ms' | 's') {
  const units = getTimeUnits(num, base);
  const seconds = (units.seconds % 60).toString().padStart(2,'0');
  const minutes = (units.minutes % 60).toString().padStart(2,'0');
  const hours = (units.hours % 24).toString().padStart(2,'0');
  
  return hours !== "00"
    ? `${hours}:${minutes}:${seconds}`
    : `${minutes}:${seconds}`;
}
