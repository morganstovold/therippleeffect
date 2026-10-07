import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { env } from "cloudflare:workers";

export const subjects = {
  general: "General Inquiry",
  scholarship: "Scholarship Questions",
  sponsorship: "Sponsorship",
  volunteer: "Volunteer",
  events: "Events",
  other: "Other",
} as const;

export const server = {
  contact: defineAction({
    accept: "form",
    input: z.object({
      name: z.string().trim().min(1, "Please enter your name.").max(200),
      email: z.email("Please enter a valid email address."),
      subject: z.enum(Object.keys(subjects) as [keyof typeof subjects], "Please choose a subject."),
      message: z.string().trim().min(1, "Please enter a message.").max(5000),
      // Hidden field real visitors never fill in. Bots usually do.
      website: z.string().optional(),
      "cf-turnstile-response": z.string().optional(),
    }),
    handler: async (input, context) => {
      if (input.website) {
        return { sent: true };
      }

      const human = await verifyTurnstile(input["cf-turnstile-response"], context.clientAddress);
      if (!human) {
        throw new ActionError({ code: "FORBIDDEN", message: "Please complete the spam check and try again." });
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: env.CONTACT_TO_EMAIL,
          reply_to: input.email,
          subject: `Website contact: ${subjects[input.subject]}`,
          text: `From: ${input.name} <${input.email}>\nSubject: ${subjects[input.subject]}\n\n${input.message}`,
        }),
      });

      if (!response.ok) {
        console.error("Resend rejected the contact email", response.status, await response.text());
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, your message could not be sent. Please email us directly.",
        });
      }

      return { sent: true };
    },
  }),
};

async function verifyTurnstile(token: string | undefined, ip: string) {
  if (!token) {
    return false;
  }
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const result = (await response.json()) as { success: boolean };
  return result.success;
}
