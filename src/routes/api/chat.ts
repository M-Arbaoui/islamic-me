import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const BodySchema = z.object({
  mode: z.enum(["roast", "motivate", "analyze"]),
  stageIndex: z.number().int().min(0).max(9),
  stageName: z.string().min(1).max(80),
  streakDays: z.number().int().min(0).max(100000),
  todayScore: z.number().int().min(0).max(5),
  habits: z.object({
    prayers: z.number().int().min(0).max(5),
    quran: z.boolean(),
    dhikr: z.boolean(),
    restraint: z.boolean(),
    goodDeed: z.boolean(),
  }),
  userMessage: z.string().max(800).optional(),
});

function buildSystem(mode: "roast" | "motivate" | "analyze") {
  const base =
    "أنت مرشد روحاني ذكي في تطبيق إسلامي لمجاهدة النفس. تتحدث العربية الفصحى البسيطة. لا تستخدم رموز Markdown غير ضرورية. أجب بفقرة واحدة قصيرة (٣-٥ جمل كحد أقصى). لا تُفتي في أحكام شرعية معقدة، ركّز على التحفيز والمحاسبة. يمكنك الاستشهاد بآية قرآنية قصيرة أو حديث صحيح مشهور مرة واحدة فقط إن ناسب.";
  if (mode === "roast") {
    return (
      base +
      " المستخدم في يوم ضعيف. كن صريحاً، حازماً، ساخراً بأسلوب الشيخ الذي يحب تلميذه فيوبخه. لا تكن قاسياً جارحاً ولا تشتم، بل ذكّره بحقيقة نفسه الأمّارة وبأن الشيطان يضحك عليه الآن. اختم بدفعة أمل قصيرة."
    );
  }
  if (mode === "motivate") {
    return (
      base +
      " المستخدم في يوم قوي ومستقيم. كن لطيفاً، مشجعاً، أخوياً دافئاً. اثنِ على صموده، ذكّره بأن الله يراه، وحثّه على الاستمرار والإخلاص. حذّره برفق من العُجب."
    );
  }
  return (
    base +
    " المستخدم كتب اعترافاً أو مبرراً لضعفه. حلّل المبرر بهدوء، فكّك خداع النفس بصدق، ثم اقترح خطوة عملية صغيرة جداً للأمام (مثال: توضأ، صلِّ ركعتين، اخرج للمشي ١٠ دقائق)."
  );
}

function buildUserContext(input: z.infer<typeof BodySchema>) {
  const lines = [
    `المرحلة الحالية: ${input.stageName} (المستوى ${input.stageIndex + 1} من ١٠)`,
    `أيام الصمود المتواصل: ${input.streakDays}`,
    `عبادات اليوم: صلوات ${input.habits.prayers}/٥، قرآن ${input.habits.quran ? "✓" : "✗"}، ذِكر ${input.habits.dhikr ? "✓" : "✗"}، ضبط النفس ${input.habits.restraint ? "✓" : "✗"}، عمل صالح ${input.habits.goodDeed ? "✓" : "✗"}`,
    `مجموع نقاط اليوم: ${input.todayScore}/٥`,
  ];
  if (input.userMessage) lines.push(`\nاعتراف المستخدم: "${input.userMessage}"`);
  return lines.join("\n");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed: z.infer<typeof BodySchema>;
        try {
          const json = await request.json();
          parsed = BodySchema.parse(json);
        } catch {
          return new Response("Invalid request", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const result = await generateText({
            model,
            system: buildSystem(parsed.mode),
            prompt: buildUserContext(parsed),
          });
          return Response.json({ text: result.text });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "AI error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});