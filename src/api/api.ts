import {Conversion} from "@/types/conversion";

// Currency API

function dateToString(date: Date) : string {
  return `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

export async function getCurrencies(date: Date | string): Promise<string[]> {
  let date_string = date;
  if (typeof date == typeof new Date()) {
    date_string = dateToString(<Date>date);
  }
  const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date_string}/currencies.min.json`)).json();
  return Object.keys(data);
}

export async function getTranslations(date: Date | string): Promise<Map<string, string>> {
  let date_string = date;
  if (typeof date == typeof new Date()) {
    date_string = dateToString(<Date>date);
  }
  const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date_string}/currencies.min.json`)).json();
  return new Map(Object.entries(data));
}

export async function getConversion(date: Date | string, from: string, to: string): Promise<Conversion> {
  let date_string = date;
  if (typeof date == typeof new Date()) {
    date_string = dateToString(<Date>date);
  }
  const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date_string}/currencies/${from}/${to}.min.json`)).json();
  let crate = 0;
  for (const [k, v] of Object.entries(data)) {
    if (k == to && typeof v == "number") crate = v;
  }
  return {date: data.date, rate: crate};
}
