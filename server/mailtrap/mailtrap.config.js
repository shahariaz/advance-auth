import { MailtrapClient } from "mailtrap";

const TOKEN = "a3dc2fe42915a259574ca5fc40d273ed";

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Mailtrap Test",
};
