import {Currency} from "@/types/currency";
import {Progress} from "@/types/progress";

// Currency API

let trans: Map<string, string> = new Map<string, string>();
let currNames: string[] = [];

function titleCase(input: string) {
  return input.replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
}

function dateToString(date: Date) : string {
  return `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

async function getCurrencies(date: string): Promise<string[]> {
  const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies.min.json`)).json();
  return Object.keys(data);
}

async function getTranslations(date: string): Promise<Map<string, string>> {
  const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies.min.json`)).json();
  return new Map(Object.entries(data));
}

async function getConversion(date: string, from: string, to: string): Promise<Currency> {
  const data = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${date}/currencies/${from}/${to}.min.json`)).json();
  let crate = 0;
  for (const [k, v] of Object.entries(data)) {
    if (k == to && typeof v == "number") crate = v;
  }
  return {fromName: from, date: data.date, rate: crate, fullName: "", shortName: to};
}

export async function init(): Promise<void> {
  trans = await getTranslations("latest");
  currNames = await getCurrencies("latest");
}

export async function getCurrencyList(from: string, date: Date | string, currArray: Progress): Promise<void> {
  let date_string: string;
  if (typeof date == "object") {
    date_string = dateToString(<Date>date);
  } else {
    date_string = date;
  }
  for (let curr = 0; curr < currNames.length; curr++) {
    const currObj = await getConversion(date_string, from, currNames[curr]);
    currObj.fullName = titleCase(trans.get(currNames[curr]) || "?");
    currObj.shortName = currObj.shortName.toUpperCase();
    currArray.currencies.push(currObj);
  }
}

export function validateCurrency(curr: string): boolean {
  return currNames.includes(curr);
}
