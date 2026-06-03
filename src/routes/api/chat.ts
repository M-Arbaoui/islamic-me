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
  profile: z
    .object({
      name: z.string().max(40).optional(),
      struggle: z.string().max(120).optional(),
      goal: z.string().max(300).optional(),
    })
    .optional(),
});

function buildSystem(mode: "roast" | "motivate" | "analyze") {
  const base = [
    "أنت 'المرشد' — صوتٌ روحاني داخل تطبيق إسلامي لمجاهدة النفس.",
    "تتحدث العربية الفصحى البليغة الواضحة، بأسلوب أدبيٍّ مختصر لا متكلَّف.",
    "تنسيق الإجابة (مهم جداً): استخدم Markdown بثلاث فقرات قصيرة مفصولة بسطر فارغ.",
    "افتح بسطرٍ واحد قوي مائلٍ بين علامتي * (مثال: *يا صاحبي…*).",
    "ثم فقرة مركزية من ٢-٣ جمل تخاطب حال المستخدم تحديداً (استعمل أرقام صموده وعباداته).",
    "ثم اختم بسطر منفصل يبدأ بـ « » يحوي آية قرآنية صحيحة أو حديثاً مشهوراً مع التخريج بين قوسين.",
    "ممنوع: الفتوى في المسائل الفقهية الخلافية، التكفير، الاستهزاء بالدين، أي عبارة جارحة شخصياً.",
    "اجعل الإجابة بين ٦٠ و ١٢٠ كلمة.",
  ].join(" ");

  if (mode === "roast") {
    return (
      base +
      " وضع: جَلْد (Roast). المستخدم في يوم ضعيف ويستحق صفعةً روحية. تقمَّص شخصية الشيخ الحازم الذي يحب تلميذه فيوبّخه بسخريةٍ راقيةٍ ذكية — لا شتائم ولا تحقير، بل كشفُ تسويفه ومبرراته الواهية. اذكر اسم النفس الأمّارة وكيف يضحك إبليس عليه الآن. اختم رغم ذلك بشُعاع رجاء."
    );
  }
  if (mode === "motivate") {
    return (
      base +
      " وضع: تحفيز. المستخدم صامد ومستقيم. كن أخاً دافئاً فخوراً، صف له جمال ما يفعله، ذكّره أن الملائكة تشهد له، وحثّه على الإخلاص والاستمرار. حذّره بلطفٍ من العُجب والرياء — بإشارةٍ واحدة لا محاضرة."
    );
  }
  return (
    base +
    " وضع: تحليل اعتراف. المستخدم كتب مبرراً لضعفه أو وسوسةً تراوده. فكّك خداع النفس بصدقٍ جراحيّ هادئ: سمِّ نوع الحيلة (تسويف، مقارنة، يأس، عُجب…). ثم اقترح خطوة عملية واحدة صغيرة جداً قابلة للتنفيذ في الدقيقة القادمة (مثل: توضأ الآن، صلِّ ركعتين، اشرب ماءً وقل أستغفر الله ١٠ مرات، أغلق الشاشة ١٠ دقائق)."
  );
}

function buildUserContext(input: z.infer<typeof BodySchema>) {
  const lines = [
    `المرحلة الحالية: ${input.stageName} (المستوى ${input.stageIndex + 1} من ١٠)`,
    `أيام الصمود المتواصل: ${input.streakDays}`,
    `عبادات اليوم: صلوات ${input.habits.prayers}/٥، قرآن ${input.habits.quran ? "✓" : "✗"}، ذِكر ${input.habits.dhikr ? "✓" : "✗"}، ضبط النفس ${input.habits.restraint ? "✓" : "✗"}، عمل صالح ${input.habits.goodDeed ? "✓" : "✗"}`,
    `مجموع نقاط اليوم: ${input.todayScore}/٥`,
  ];
  if (input.profile?.name) lines.unshift(`اسم المستخدم: ${input.profile.name} — نادِه باسمه.`);
  if (input.profile?.struggle) lines.push(`أكبر تحدٍّ يعاني منه: ${input.profile.struggle}`);
  if (input.profile?.goal) lines.push(`هدفه الذي وضعه: ${input.profile.goal}`);
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
        const model = gateway("google/gemini-2.5-flash");

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