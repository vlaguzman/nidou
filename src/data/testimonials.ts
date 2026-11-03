export const testimonials = {
  heading: "Lo que cambia cuando te sientes acompañada",
  expand: { more: "Leer más", less: "Leer menos" },
  items: [
    {
      quote:
        "Mi cita con el artista que Adriana me ha enseñado me ha hecho darme cuenta de que sí es posible crear cosas lindas y artísticas mientras me regalo un espacio para mí. Es muy gratificante ver el resultado final y saber que Luca algún día lo tendrá como recuerdo del amor de su mamá. Gracias, Adri, por ayudarme a encontrar al artista que hay en mí y por compartir tu tiempo conmigo en esta aventura de la maternidad.",
      name: "Laura",
      detail: "Cita con el artista",
      collapsible: true,
    },
    {
      quote:
        "Vale la pena tomarse un espacio, no sabía que necesitaba tanto respirar profundo y con intención y reconocer de todo lo que estoy siendo capaz.",
      name: "Ana",
      detail: "Presencia compartida",
    },
    {
      quote: "Sentí que no estoy sola, me sentí acogida y escuchada.",
      name: "Annie",
      detail: "Presencia compartida",
    },
  ] as { quote: string; name: string; detail: string; collapsible?: boolean }[],
};
