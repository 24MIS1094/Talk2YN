import { createServerFn } from "@tanstack/react-start";

export type EmailTestStep = {
  label: string;
  status: "pass" | "fail" | "warn";
  detail: string;
};

export type EmailTestResult = {
  ok: boolean;
  summary: string;
  steps: EmailTestStep[];
};

// Simple in-memory cooldown so the owner inbox can't be flooded.
let lastRunAt = 0;
const COOLDOWN_MS = 60_000;

export const testEmailDelivery = createServerFn({ method: "POST" }).handler(
  async (): Promise<EmailTestResult> => {
    const steps: EmailTestStep[] = [];

    const now = Date.now();
    if (now - lastRunAt < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (now - lastRunAt)) / 1000);
      return {
        ok: false,
        summary: `Please wait ${wait}s before testing again.`,
        steps: [{ label: "Rate limit", status: "warn", detail: `Cooldown active (${wait}s left).` }],
      };
    }
    lastRunAt = now;

    const { OWNER_EMAIL } = await import("@/lib/email.server");
    const { SENDER_DOMAIN, sendTemplateEmail } = await import(
      "@/lib/email-templates/send-email"
    );

    const hasKey = Boolean(process.env.LOVABLE_API_KEY);
    steps.push({
      label: "Email service key",
      status: hasKey ? "pass" : "fail",
      detail: hasKey ? "Configured." : "Missing — republish the app to inject it.",
    });

    const placeholder = /(^|\.)(example\.(com|org|net)|test|invalid|localhost)$/i.test(
      SENDER_DOMAIN
    );
    steps.push({
      label: "Sender domain",
      status: placeholder ? "fail" : "pass",
      detail: placeholder
        ? `${SENDER_DOMAIN} is a reserved placeholder domain — DNS can never verify. Use a subdomain of a domain you own.`
        : SENDER_DOMAIN,
    });

    if (!hasKey) {
      return { ok: false, summary: "Email is not configured yet.", steps };
    }

    try {
      const result = await sendTemplateEmail("delivery-test", OWNER_EMAIL, {
        idempotencyKey: `delivery-test-${now}`,
        templateData: { sentAt: new Date().toISOString(), senderDomain: SENDER_DOMAIN },
      });

      if (!result.sent) {
        steps.push({
          label: "Test send",
          status: "fail",
          detail: `${OWNER_EMAIL} is suppressed (earlier bounce, complaint, or unsubscribe).`,
        });
        return { ok: false, summary: "Recipient is blocked from receiving mail.", steps };
      }

      steps.push({
        label: "Test send",
        status: "pass",
        detail: `Accepted for delivery to ${OWNER_EMAIL}.`,
      });
      return {
        ok: true,
        summary: `Test email sent to ${OWNER_EMAIL}. Check the inbox (and spam) in a minute.`,
        steps,
      };
    } catch (error: any) {
      const code = error?.code as string | undefined;
      const detail =
        code === "domain_not_verified"
          ? "DNS for the sender domain is not verified yet, so nothing can send."
          : code === "emails_disabled"
            ? "Email sending is turned off for this project."
            : error?.status === 429
              ? `Rate limited. Retry in ${error?.retryAfterSeconds ?? 60}s.`
              : (error?.message ?? "Unknown sending error.");
      steps.push({ label: "Test send", status: "fail", detail });
      return { ok: false, summary: "Sending failed — see details below.", steps };
    }
  }
);
