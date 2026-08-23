export type InterestType =
  | "Personal Experience"
  | "Community Gathering"
  | "Educational Institution"
  | "Workplace Well-being";

export function buildWhatsAppUrl(params: {
  name: string;
  interest: InterestType;
  message: string;
}): string {
  const { name, interest, message } = params;
  const text = `Hi, I'm ${name}. I'm interested in: ${interest}.${
    message ? " " + message : ""
  }`;
  return `https://wa.me/918368426330?text=${encodeURIComponent(text)}`;
}
