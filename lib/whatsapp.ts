import { site, type InterestType } from "@/content/site";

export type { InterestType };

export function buildWhatsAppUrl(params: {
  name: string;
  interest: InterestType;
  message: string;
}): string {
  const { name, interest, message } = params;
  const text = `Hi, I'm ${name}. I'm interested in: ${interest}.${
    message ? " " + message : ""
  }`;
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
