import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(60),
  message: z.string().trim().min(5).max(4000),
});

export type ContactResult = { ok: boolean; error?: string };

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<ContactResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("contact_messages").insert({
      full_name: data.fullName,
      email: data.email,
      subject: data.subject,
      category: data.category,
      message: data.message,
    });

    if (error) {
      return { ok: false, error: "Could not save your message. Please try again." };
    }

    // Best-effort notification to the admin inbox; never blocks the user.
    try {
      const { OWNER_EMAIL } = await import("@/lib/email.server");
      const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
      await sendTemplateEmail("contact-message", OWNER_EMAIL, {
        templateData: data,
        replyTo: data.email,
      });
    } catch {
      // Email delivery is optional — the message is already stored.
    }

    return { ok: true };
  });
