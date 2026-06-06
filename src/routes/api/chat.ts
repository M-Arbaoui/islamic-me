import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const ContextSchema = z
  .object({
    stageIndex: z.number().int().min(0).max(9).optional(),
    stageName: z.string().max(80).optional(),
    streakDays: z.number().int().min(0).max(100000).optional(),
    todayScore: z.number().int().min(0).max(5).optional(),
    habits: z
      .object({
        prayers: z.number().int().min(0).max(5),
        quran: z.boolean(),
        dhikr: z.boolean(),
        restraint: z.boolean(),
        goodDeed: z.boolean(),
      })
      .optional(),
    profile: z
      .object({
        name: z.string().max(40).optional(),
        struggle: z.string().max(120).optional(),
        goal: z.string().max(300).optional(),
      })
      .optional(),
  })
  .optional();

const BodySchema = z.object({
  messages: z.array(z.any()).min(1).max(60),
  context: ContextSchema,
});

function buildSystem() {
  return [
    "أنت 'المُرشد' — صديق روحاني رحيم داخل تطبيق إسلامي اسمه 'طوبى' لتزكية النفس.",
    "هويتك: أخٌ حنون، صبور، يحبّ المستخدم في الله، لا يجرح ولا يلوم ولا يحكم أبداً.",
    "أسلوبك: عربية فصحى بسيطة دافئة، قصيرة، بلا تَكَلُّف. نادِ المستخدم باسمه إن عُرف.",
    "ممنوع تماماً: التوبيخ، السخرية، الجَلْد، التحقير، الكلمات الجارحة، الفتوى الفقهية الخلافية، التكفير، إثارة اليأس أو الذنب الزائد.",
    "هدفك دائماً: التحفيز، التذكير بالله، رفع الهمّة، اقتراح ذكر أو دعاء أو خطوة صغيرة عملية.",
    "تنسيق الرد بـ Markdown: فقرة قصيرة (٢-٤ جمل) من القلب، وحين يناسب اقترح ذِكراً قصيراً بين «» أو خطوة عملية واحدة في سطر منفصل بصيغة 'جرّب الآن: ...'.",
    "اذكر آيةً أو حديثاً (مع التخريج بين قوسين) فقط حين يُثري الحديث، لا في كل رد.",
    "اجعل الرد بين ٤٠ و ١٢٠ كلمة. هذه محادثة وليست خطبة.",
    "تابع سياق الرسائل السابقة وابنِ عليها كصديق يصغي.",
  ].join(" ");
}

function buildContextPreamble(ctx?: z.infer<typeof ContextSchema>) {
  if (!ctx) return "";
  const lines: string[] = [];
  if (ctx.profile?.name) lines.push(`اسم المستخدم: ${ctx.profile.name} — نادِه باسمه بحنان.`);
  if (ctx.stageName != null && ctx.stageIndex != null)
    lines.push(`رتبته الروحية: ${ctx.stageName} (${ctx.stageIndex + 1}/١٠).`);
  if (ctx.streakDays != null) lines.push(`أيام صموده المتواصل: ${ctx.streakDays}.`);
  if (ctx.todayScore != null) lines.push(`نقاط عباداته اليوم: ${ctx.todayScore}/٥.`);
  if (ctx.habits)
    lines.push(
      `اليوم: صلوات ${ctx.habits.prayers}/٥، قرآن ${ctx.habits.quran ? "✓" : "✗"}، ذكر ${ctx.habits.dhikr ? "✓" : "✗"}، ضبط نفس ${ctx.habits.restraint ? "✓" : "✗"}، عمل صالح ${ctx.habits.goodDeed ? "✓" : "✗"}.`,
    );
  if (ctx.profile?.struggle) lines.push(`أكبر تحدٍّ يواجهه: ${ctx.profile.struggle}.`);
  if (ctx.profile?.goal) lines.push(`هدفه: ${ctx.profile.goal}.`);
  if (lines.length === 0) return "";
  return `سياق هذا المستخدم (للاستئناس فقط، لا تكرّره حرفياً):\n${lines.join("\n")}`;
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
        const model = gateway("google/gemini-2.5-flash");

        const preamble = buildContextPreamble(parsed.context);
        const system = preamble ? `${buildSystem()}\n\n${preamble}` : buildSystem();

        try {
          const result = streamText({
            model,
            system,
            messages: await convertToModelMessages(parsed.messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: parsed.messages as UIMessage[],
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "AI error";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});