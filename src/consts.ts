// Canonical contact constants — single source of truth (Ipialabogados.md §6, objetivo.md)
export const CONTACT = {
  whatsappPrimary: "573188215030",
  whatsappSecondary: "573137664683",
  get waPrimaryHref() { return `https://wa.me/${this.whatsappPrimary}?text=${encodeURIComponent("Hola, me gustaría recibir asesoría jurídica. ¿Podemos agendar una consulta?")}`; },
  get waSecondaryHref() { return `https://wa.me/${this.whatsappSecondary}`; },
  // tel: URIs for correctness (E.164)
  get telPrimary() { return `tel:+${this.whatsappPrimary}`; },
  get telSecondary() { return `tel:+${this.whatsappSecondary}`; },
  // Display formatting
  displayPrimary: "318 821 5030",
  displaySecondary: "313 766 4683",
  email: "contacto@ipialabogados.example.com",
  address: {
    street: "Cra 6 No. 2-36-Av. Las Lajas",
    city: "Ipiales",
    region: "Nariño",
    country: "CO",
    full: "Cra 6 No. 2-36-Av. Las Lajas, Ipiales - Nariño, Colombia",
  },
  horario: "Lunes a Viernes: 8:00 AM - 6:00 PM",
} as const;

export const SITE = {
  canonical: "https://ipialabogados.example.com",
  title: "Ipial Abogados — Excelencia Jurídica y Compromiso Humano",
  description:
    "Firma de abogados en Ipiales, Nariño. Especialistas en derecho laboral y seguridad social, penal y procesal penal. Fuente: Ipialabogados.md §2-§4.",
} as const;
