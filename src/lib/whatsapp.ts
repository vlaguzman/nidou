/** Click-to-chat link: opens WhatsApp with `text` prefilled; the visitor still taps send. */
export function whatsappHref(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
