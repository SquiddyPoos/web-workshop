import {getConversion, getCurrencies, getTranslations} from "@/api/api";
import {Conversion} from "@/types/conversion";

async function main(): Promise<string> {
  const trans:Map<string, string> = await getTranslations("latest");
  const curr:string[] = await getCurrencies("latest");
  const currFrom = "sgd";
  const currTo = "usd";
  const conv:Conversion = await getConversion("latest", currFrom, currTo);
  return `On ${conv.date}, the conversion rate of ${currFrom.toUpperCase()} to ${currTo.toUpperCase()} was 1 ${currFrom.toUpperCase()} to ${conv.rate} ${currTo.toUpperCase()}. ` + curr.map(c => `${c} (${trans.get(c)})`).join(", ");
}

export default {
  main
};
