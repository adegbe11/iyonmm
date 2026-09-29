export function ageDifference(from:Date,to:Date){
  const start=new Date(Date.UTC(from.getUTCFullYear(),from.getUTCMonth(),from.getUTCDate()));
  const end=new Date(Date.UTC(to.getUTCFullYear(),to.getUTCMonth(),to.getUTCDate()));
  const shift=(months:number)=>{const month=start.getUTCMonth()+months;const last=new Date(Date.UTC(start.getUTCFullYear(),month+1,0)).getUTCDate();return new Date(Date.UTC(start.getUTCFullYear(),month,Math.min(start.getUTCDate(),last)));};
  let months=(end.getUTCFullYear()-start.getUTCFullYear())*12+end.getUTCMonth()-start.getUTCMonth();
  if(shift(months)>end)months--;
  return {y:Math.floor(months/12),m:months%12,d:Math.round((end.getTime()-shift(months).getTime())/86400000),totalDays:Math.round((end.getTime()-start.getTime())/86400000)};
}
