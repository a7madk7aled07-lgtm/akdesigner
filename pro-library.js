(() => {
  "use strict";

  const palettes = [
    { name: "ليلي", background: "#17152a", primary: "#eeeaff", accent: "#a891ff", soft: "#55477f", ink: "#f7f4ff" },
    { name: "ذهبي", background: "#fbf5e9", primary: "#34271c", accent: "#b48132", soft: "#e8d4ad", ink: "#302319" },
    { name: "زمرد", background: "#edf7f1", primary: "#153e31", accent: "#22866b", soft: "#c7e6d7", ink: "#17382e" },
    { name: "مرجاني", background: "#fff1ed", primary: "#452522", accent: "#dd675b", soft: "#ffd9d1", ink: "#482724" },
    { name: "كهربائي", background: "#111827", primary: "#f2f5ff", accent: "#58e1d3", soft: "#263c53", ink: "#f5f7ff" },
    { name: "أزرق ملكي", background: "#edf2ff", primary: "#172d56", accent: "#416de0", soft: "#cedbff", ink: "#172b50" },
    { name: "ترابي", background: "#f3eee6", primary: "#392c25", accent: "#ad704c", soft: "#e3d1c1", ink: "#3d3028" },
    { name: "أحادي", background: "#f2f2f0", primary: "#1d2022", accent: "#555b60", soft: "#d7d9d8", ink: "#171a1c" },
    { name: "وردي", background: "#fff0f6", primary: "#4b2039", accent: "#c74c8d", soft: "#f4c9df", ink: "#4b2039" },
    { name: "ناري", background: "#241322", primary: "#fff0de", accent: "#ff785e", soft: "#653244", ink: "#fff0de" }
  ];
  const styles = [
    ["minimal", "Minimal"], ["modern", "Modern"], ["luxury", "Luxury"],
    ["gaming", "Gaming"], ["three-d", "3D"], ["mascot", "Mascot"]
  ];
  const logoCategories = [
    {
      id: "games", label: "متاجر الألعاب", count: 20,
      names: ["نقطة لعب", "مجرة جيمز", "المستوى الأخير", "مخزن اللاعبين", "زر البداية", "مملكة البكسل", "طور الأساطير", "نادي النخبة", "اللاعب 77", "قوة التحكم", "كريستال جيم", "منطقة اللعب", "صندوق الغنائم", "ساحة الأبطال", "نيون أرينا", "ترسانة", "المرحلة التالية", "ميدان اللاعبين", "حارس البوابة", "فولت جيمز"],
      marks: ["✦", "◈", "⌘", "✧", "✪", "⚡", "◉", "⬡", "➤", "♜", "✣", "◎", "◆", "☼", "✺", "⟐", "⌖", "◇", "▣", "⟁"]
    },
    {
      id: "fashion", label: "متاجر الملابس", count: 20,
      names: ["خيط ولون", "دار القماش", "خطوة أنيقة", "تفصيل", "خزانة لانا", "ظل الحرير", "قطن ونور", "المشهد", "سطر أزياء", "دار مايا", "خيط ذهبي", "لون هادئ", "مقاسك", "أثر", "لِباس", "نسج", "ياسمين ستوديو", "بيت الكتان", "رِواق", "فستان وحكاية"],
      marks: ["✿", "❋", "✧", "◇", "◒", "⌁", "❖", "✺", "◡", "✳", "⌘", "⟐", "◈", "✦", "⌖", "⊙", "❀", "⟡", "♢", "◌"]
    },
    {
      id: "social", label: "متاجر السوشيال", count: 20,
      names: ["وصل ستوديو", "نقطة تواصل", "رابطك", "موجة اجتماعية", "حكاية رقمية", "دائرة محتوى", "صوت العلامة", "شبكة بلس", "صانع أثر", "مساحة نشر", "منصة ورد", "عدسة ومحتوى", "نقرة", "أفق رقمي", "مدار اجتماعي", "نبض الصفحة", "بصمة ميديا", "مسار", "واجهة", "فكرة تنتشر"],
      marks: ["◎", "◉", "⌘", "↗", "◌", "✦", "⟡", "⊙", "▱", "✧", "⌖", "◈", "∞", "⌁", "☼", "◇", "◍", "➤", "⟐", "✣"]
    },
    {
      id: "fire", label: "جواهر Free Fire", count: 20,
      names: ["جوهرة فولت", "سوق الدايموند", "شحنة بطل", "صندوق النخبة", "دار الجواهر", "دايموند زون", "رصيد فري", "جوهرة بلس", "متجر فاير", "مخزن الدايموند", "مجرة فري فاير", "الشحنة الذهبية", "ساحة الجواهر", "طاقة اللاعب", "نخبة فاير", "جوهرة آمنة", "دروب الماس", "فولت دايموند", "بوابة الشحن", "قمة اللاعبين"],
      marks: ["◆", "✦", "⚡", "❖", "⬡", "✪", "✧", "⟐", "◈", "☄", "✺", "◇", "♢", "⟁", "✹", "◉", "✣", "⬢", "⟡", "➤"]
    },
    {
      id: "projects", label: "مشاريع متنوعة", count: 40,
      names: ["ورق وزعتر", "رِواق قهوة", "مخبز سنبلة", "بيت النبتة", "أفق عقار", "دار عافية", "مساحة تعلّم", "ركن الحرفة", "عيادة مدار", "مطبخ ورد", "ندى للعناية", "مسار سفر", "مكتبة أثر", "استوديو سطر", "تمرة وسمسم", "حديقة بيت", "فكرة تقنية", "فنجان أول", "دار الضيافة", "ضوء شمعة", "خبز الدار", "خطوة صحة", "موجة بحر", "بيان للاستشارات", "مركز اتزان", "لوحة وفن", "رحلة لون", "صندوق هدايا", "مدار هندسي", "محمصة نون", "لؤلؤة عناية", "مزرعة ركن", "أكاديمية حرف", "بيت المونة", "سبيل للتوصيل", "مرسم ألوان", "مفتاح عقار", "مقهى جذور", "عالم الطفل", "درب أخضر"],
      marks: ["✿", "☕", "❋", "⌂", "◇", "✧", "▤", "✣", "✚", "❀", "◌", "⌖", "▣", "✒", "❖", "♧", "⌘", "◉", "♜", "☼", "✦", "♡", "≈", "✥", "⬡", "◈", "➤", "❁", "⌬", "◍", "✺", "♧", "▱", "◇", "↗", "✹", "⌑", "◕", "♧", "⟐"]
    }
  ];
  const logoArchetypes = [
    "seal", "wordmark", "monogram", "split", "crest", "orbit", "ribbon", "tile", "diamond", "mascot",
    "double-ring", "editorial", "crown", "horizon", "corner", "stack", "medallion", "side-mark", "stamp", "initials",
    "monoline", "signet", "floral", "radial", "hex-frame", "letter-stack", "emblem", "asym-mark", "banner", "horizontal-seal",
    "botanical-seal", "wrap-ribbon", "modular", "starburst", "path-mark", "bracket", "keyhole", "half-disc", "triple-mark", "skyline"
  ];
  const adConcepts = {
    games: [
      ["تحدي المحترفين", "ارفع مستواك اليوم", "خصم 25%", "arena"], ["جهّز عتادك", "كل الأدوات في مكان واحد", "ابتداءً من 49 ر.س", "loadout"],
      ["بطولة نهاية الأسبوع", "سجّل فريقك الآن", "جوائز بقيمة 500 ر.س", "tournament"], ["تحديث الموسم", "محتوى جديد وصل", "لفترة محدودة", "season"],
      ["ترقية المستوى", "ابدأ جولتك القادمة", "عرض اللاعبين", "rank"], ["صندوق المفاجآت", "اختيارات للاعبين", "وفر 20%", "loot"],
      ["ليلة لعب", "اجمع أصدقاءك", "باقة الفريق", "night"], ["انطلق الآن", "كل نقرة تصنع فرقاً", "خصم خاص", "launch"]
    ],
    fashion: [
      ["وصلت المجموعة", "قصّات صنعت لتدوم", "ابتداءً من 129 ر.س", "collection"], ["اختاري إطلالتك", "تفاصيل على ذوقك", "خصم 30%", "look"],
      ["أناقة الموسم", "قماش ناعم ولمسة مختلفة", "قطعتان بسعر مميز", "season"], ["خياطة تستحق", "تفصيل يليق بك", "احجزي موعدك", "atelier"],
      ["هدية لك", "تسوقي مجموعتك المفضلة", "شحن مجاني", "gift"], ["أساسيات يومية", "بساطة تكمّل أناقتك", "ابتداءً من 59 ر.س", "basics"],
      ["مقاسك موجود", "تسوقي التشكيلة الجديدة", "خصم 15%", "fit"], ["اختاري التميّز", "تفاصيل تعكس أسلوبك", "عرض الأسبوع", "style"]
    ],
    social: [
      ["خلّي حضورك أوضح", "هوية محتوى تناسب علامتك", "ابدأ من 99 ر.س", "presence"], ["رتّب روابطك", "كل حساباتك في بطاقة واحدة", "اطلب الآن", "links"],
      ["انشر فكرتك", "تصاميم لمنصاتك اليومية", "باقة 12 منشوراً", "publish"], ["محتواك يستاهل", "قوالب سهلة التعديل", "وفر 20%", "content"],
      ["اجذب جمهورك", "هوية بصرية متناسقة", "ابدأ اليوم", "audience"], ["صفحة أقوى", "ملفات جاهزة للنشر", "ابتداءً من 79 ر.س", "profile"],
      ["أطلق متجرك", "أغلفة ومنشورات متكاملة", "باقة الإطلاق", "launch"], ["صمّم حضورك", "فكرة واحدة وهوية كاملة", "استشارة مجانية", "brand"]
    ],
    fire: [
      ["عرض جواهر اليوم", "اشحن رصيدك بسهولة", "100 جوهرة · 5 ر.س", "gems"], ["ضاعف رصيدك", "اختر باقتك المناسبة", "500 + 50 هدية", "bonus"],
      ["شحنة النخبة", "خيارات متعددة للاعبين", "باقة 1000", "elite"], ["جواهر على قدّك", "اختر الباقة المناسبة", "ابتداءً من 5 ر.س", "tiers"],
      ["مكافأة الموسم", "عروض الشحن لفترة محدودة", "خصم 15%", "season"], ["رصيدك جاهز", "خطوات طلب واضحة", "تسليم سريع", "ready"],
      ["باقة الأصدقاء", "شارك اللعب مع فريقك", "4 باقات مميزة", "squad"], ["اشحن بذكاء", "اختيارات آمنة وواضحة", "اطلب الآن", "secure"]
    ],
    projects: [
      ["حان وقت التجديد", "تفاصيل مدروسة لحياتك", "اكتشف الجديد", "refresh"], ["نكهة اليوم", "طازج ويُحضّر بحب", "اطلب وجبتك", "food"],
      ["مساحة تلهمك", "ابحث عن مكانك القادم", "احجز زيارة", "space"], ["هدية من القلب", "اختيار يناسب كل مناسبة", "تغليف مجاني", "gift"],
      ["خطوة نحو التوازن", "خدمات تناسب احتياجك", "احجز استشارتك", "wellness"], ["فكرة تستحق", "حلول عملية لمشروعك", "استشارة أولى مجاناً", "ideas"],
      ["صنع محلياً", "تفاصيل تنسج حكاية", "اكتشف المجموعة", "craft"], ["اكتشف مكانك", "تجارب صممت لأجلك", "احجز الآن", "discover"]
    ]
  };
  const categories = Object.fromEntries(logoCategories.map(category => [category.id, category]));
  const templates = [];

  const shape = (name, kind, box, color, extra = {}) => ({ type: "shape", name, shape: kind, x: box[0], y: box[1], w: box[2], h: box[3], color, ...extra });
  const text = (name, value, box, color, size, extra = {}) => ({ type: "text", name, text: value, x: box[0], y: box[1], w: box[2], h: box[3], color, fontSize: size, weight: "700", fontFamily: "Tahoma", align: "center", ...extra });
  const centered = (x, y, w, h) => [x - w / 2, y - h / 2, w, h];
  const iconShapes = ["star", "diamond", "hexagon", "shield", "triangle", "ring", "burst", "cube", "heart", "lightning", "rounded", "octagon", "pentagon", "star6", "parallelogram", "cloud"];

  function makeLogoLayers(template) {
    const palette = template.palette;
    const mark = template.mark;
    const name = template.name;
    const layers = [];
    const addShape = (label, kind, box, color = palette.accent, extra = {}) => layers.push(shape(label, kind, box, color, extra));
    const addText = (label, value, box, color = palette.primary, size = 56, extra = {}) => layers.push(text(label, value, box, color, size, extra));
    const frame = iconShapes[template.variant % iconShapes.length];
    const centeredMark = (y = 290, size = 250) => addText("الرمز", mark, centered(540, y, size, size), palette.ink, size * .72);

    const extendedIndex = logoArchetypes.indexOf(template.archetype) - 20;
    if (extendedIndex >= 0) {
      const motif = iconShapes[(template.variant + extendedIndex) % iconShapes.length];
      switch (extendedIndex) {
        case 0:
          addShape("إطار خطي", "rounded", [205, 235, 670, 510], "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 9 });
          addText("العلامة", mark, [420, 290, 240, 190], palette.primary, 126);
          addShape("شرطة سفلية", "line", [355, 540, 370, 4], palette.soft, { strokeWidth: 5 });
          addText("اسم المتجر", name, [170, 660, 740, 78], palette.primary, 55);
          break;
        case 1:
          addShape("ختم الخاتم", "circle", centered(540, 375, 405, 405), palette.primary);
          addShape("حافة الخاتم", "circle", centered(540, 375, 365, 365), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 8 });
          addText("نقش العلامة", template.monogram, centered(540, 375, 245, 180), palette.background, 94);
          addText("اسم المتجر", name, [140, 660, 800, 82], palette.primary, 54);
          addText("وصف العلامة", template.tagline, [180, 752, 720, 42], palette.accent, 24, { weight: "400" });
          break;
        case 2:
          addShape("الزهرة", "circle", centered(540, 360, 340, 340), palette.soft);
          [0, 60, 120].forEach((angle, index) => addShape("بتلة", "ellipse", centered(540 + Math.cos(angle * Math.PI / 180) * 112, 360 + Math.sin(angle * Math.PI / 180) * 112, 185, 90), index % 2 ? palette.accent : palette.soft, { rotation: angle }));
          addText("قلب الزهرة", mark, centered(540, 360, 140, 135), palette.primary, 80);
          addText("اسم المتجر", name, [150, 610, 780, 80], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 700, 720, 44], palette.accent, 24, { weight: "400" });
          break;
        case 3:
          [300, 225, 150].forEach((size, index) => addShape("أشعة الشعار", "star8", centered(540, 375, size, size), index === 1 ? palette.soft : palette.accent, { rotation: index * 12 }));
          addText("مركز الشعار", mark, centered(540, 375, 104, 100), palette.ink, 59);
          addText("اسم المتجر", name, [150, 610, 780, 78], palette.primary, 52);
          addShape("نقطة فاصلة", "diamond", centered(540, 742, 30, 30), palette.accent);
          addText("وصف العلامة", template.tagline, [180, 780, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 4:
          addShape("إطار سداسي", "hexagon", centered(540, 395, 580, 600), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 14 });
          addShape("سداسي داخلي", "hexagon", centered(540, 395, 490, 510), palette.soft);
          addText("علامة الإطار", mark, centered(540, 370, 175, 160), palette.ink, 95);
          addText("اسم المتجر", name, [145, 690, 790, 78], palette.primary, 53);
          break;
        case 5:
          addText("الحرف الأول", template.monogram[0], [345, 210, 390, 350], palette.soft, 260);
          addText("الحرف الثاني", template.monogram.slice(1) || mark, [470, 340, 280, 290], palette.accent, 185);
          addShape("خط التوقيع", "line", [270, 675, 540, 6], palette.primary, { strokeWidth: 6 });
          addText("اسم المتجر", name, [145, 710, 790, 70], palette.primary, 51);
          addText("وصف العلامة", template.tagline, [180, 788, 720, 40], palette.accent, 23, { weight: "400" });
          break;
        case 6:
          addShape("شارة خارجية", motif, centered(540, 385, 620, 560), palette.soft);
          addShape("شارة داخلية", "circle", centered(540, 385, 390, 380), palette.background);
          addText("رمز الشارة", mark, centered(540, 370, 185, 170), palette.accent, 105);
          addText("اسم المتجر", name, [145, 680, 790, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 765, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 7:
          addShape("الكتلة المائلة", "parallelogram", [195, 300, 410, 360], palette.soft);
          addText("الرمز الجانبي", mark, [285, 380, 210, 180], palette.primary, 108);
          addText("اسم المتجر", name, [550, 345, 390, 93], palette.primary, 55, { align: "right" });
          addShape("فاصل مائل", "line", [565, 465, 280, 6], palette.accent, { strokeWidth: 7 });
          addText("وصف العلامة", template.tagline, [570, 500, 350, 78], palette.accent, 25, { align: "right", weight: "400" });
          break;
        case 8:
          addShape("الراية الرئيسية", "flag", [250, 220, 580, 160], palette.accent);
          addShape("الراية الخلفية", "flag", [220, 395, 640, 150], palette.soft, { rotation: 180 });
          addText("رمز العلامة", mark, centered(540, 370, 135, 120), palette.ink, 82);
          addText("اسم المتجر", name, [145, 625, 790, 82], palette.primary, 52);
          addText("وصف العلامة", template.tagline, [180, 715, 720, 42], palette.accent, 24, { weight: "400" });
          break;
        case 9:
          addShape("إطار أفقي", "ellipse", [125, 320, 830, 285], "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 13 });
          addShape("ختم الوسط", "diamond", centered(540, 460, 315, 315), palette.soft);
          addText("رمز الختم", mark, centered(540, 445, 140, 130), palette.ink, 79);
          addText("اسم المتجر", name, [145, 680, 790, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 765, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 10:
          addShape("غصن نباتي", "arc", [235, 255, 610, 420], "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 12, rotation: 180 });
          [0, 1, 2, 3].forEach(index => addShape("ورقة", "ellipse", centered(360 + index * 120, 420 - Math.sin(index * Math.PI / 3) * 105, 120, 62), index % 2 ? palette.soft : palette.accent, { rotation: index * 18 - 24 }));
          addText("رمز الغصن", mark, centered(540, 395, 116, 105), palette.primary, 65);
          addText("اسم المتجر", name, [145, 685, 790, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 770, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 11:
          addShape("رباط أعلى", "capsule", [265, 225, 550, 92], palette.soft);
          addShape("رباط الاسم", "capsule", [155, 425, 770, 148], palette.accent);
          addText("علامة الرباط", mark, centered(540, 345, 145, 135), palette.primary, 84);
          addText("اسم المتجر", name, [195, 450, 690, 82], palette.background, 52);
          addText("وصف العلامة", template.tagline, [180, 625, 720, 44], palette.primary, 24, { weight: "400" });
          addShape("رباط أسفل", "capsule", [365, 720, 350, 8], palette.accent);
          break;
        case 12:
          [0, 1, 2].forEach(index => addShape("وحدة هندسية", ["rectangle", "circle", "diamond"][index], [240 + index * 200, 300, 145, 145], [palette.primary, palette.accent, palette.soft][index]));
          addText("حروف الوحدات", template.monogram, [280, 340, 545, 65], palette.background, 45);
          addText("اسم المتجر", name, [150, 560, 780, 80], palette.primary, 54);
          addShape("فاصل الوحدات", "line", [280, 668, 520, 6], palette.accent, { strokeWidth: 6 });
          addText("وصف العلامة", template.tagline, [180, 700, 720, 42], palette.primary, 23, { weight: "400" });
          break;
        case 13:
          addShape("انفجار نجمي", "burst", centered(540, 390, 660, 630), palette.soft);
          addShape("قرص الوسط", "circle", centered(540, 390, 380, 370), palette.background);
          addText("علامة الانطلاق", mark, centered(540, 380, 200, 180), palette.accent, 112);
          addText("اسم المتجر", name, [145, 700, 790, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 785, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 14:
          addShape("مسار العلامة", "arc", [175, 245, 730, 455], "transparent", { fillMode: "outline", strokeColor: palette.soft, strokeWidth: 12, rotation: 180 });
          [0, 1, 2].forEach(index => addShape("نقطة المسار", "circle", centered(350 + index * 190, 450 - Math.sin(index * Math.PI / 2) * 120, 58, 58), palette.accent));
          addText("رمز المسار", mark, centered(540, 405, 130, 120), palette.primary, 75);
          addText("اسم المتجر", name, [150, 690, 780, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 775, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 15:
          addShape("زاوية يسار عليا", "line", [195, 230, 215, 8], palette.accent, { strokeWidth: 10 });
          addShape("زاوية يمين عليا", "line", [675, 230, 215, 8], palette.accent, { strokeWidth: 10 });
          addShape("زاوية يسار سفلى", "line", [195, 590, 215, 8], palette.soft, { strokeWidth: 10 });
          addShape("زاوية يمين سفلى", "line", [675, 590, 215, 8], palette.soft, { strokeWidth: 10 });
          addText("الرمز المحاط", mark, centered(540, 400, 200, 190), palette.primary, 115);
          addText("اسم المتجر", name, [145, 665, 790, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 750, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 16:
          addShape("فتحة المفتاح", "circle", centered(540, 330, 300, 300), palette.accent);
          addShape("عنق المفتاح", "rectangle", [475, 390, 130, 290], palette.accent);
          addShape("مفتاح داخلي", "circle", centered(540, 330, 180, 180), palette.background);
          addText("رمز البوابة", mark, centered(540, 345, 105, 100), palette.primary, 62);
          addText("اسم المتجر", name, [145, 685, 790, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 770, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 17:
          addShape("قرص خلفي", "circle", centered(540, 375, 640, 640), palette.soft);
          addShape("قرص أمامي", "circle", [220, 375, 640, 320], palette.background);
          addShape("خط الأفق", "line", [275, 555, 530, 6], palette.accent, { strokeWidth: 6 });
          addText("رمز النصف", mark, centered(540, 360, 165, 150), palette.primary, 94);
          addText("اسم المتجر", name, [145, 700, 790, 78], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 785, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        case 18:
          [0, 1, 2].forEach(index => {
            const x = 285 + index * 215;
            addShape("علامة متكررة", ["circle", "diamond", "hexagon"][index], centered(x, 385, 165, 165), [palette.accent, palette.soft, palette.primary][index]);
            addText("رمز مكرر", template.mark, centered(x, 385, 96, 90), palette.background, 53);
          });
          addText("اسم المتجر", name, [145, 605, 790, 80], palette.primary, 53);
          addShape("خط بصري", "line", [300, 710, 480, 6], palette.accent, { strokeWidth: 6 });
          addText("وصف العلامة", template.tagline, [180, 755, 720, 42], palette.accent, 23, { weight: "400" });
          break;
        default:
          addShape("معالم المدينة", "rectangle", [220, 385, 640, 95], palette.soft);
          [0, 1, 2, 3, 4].forEach(index => addShape("مبنى الشعار", ["rectangle", "rounded", "triangle", "rectangle", "rounded"][index], [250 + index * 120, 265 + (index % 2) * 35, 88, 125 + (index % 2) * 55], palette.accent));
          addShape("أفق المدينة", "line", [180, 500, 720, 5], palette.primary, { strokeWidth: 5 });
          addText("اسم المتجر", name, [145, 620, 790, 80], palette.primary, 53);
          addText("وصف العلامة", template.tagline, [180, 710, 720, 42], palette.accent, 23, { weight: "400" });
          addText("علامة المدينة", mark, [440, 780, 200, 70], palette.primary, 40);
      }
      addLogoIdentityLayers(template, layers);
      return layers;
    }

    switch (template.archetype) {
      case "seal":
        addShape("الحلقة الخارجية", "circle", centered(540, 420, 690, 690), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 13 });
        addShape("الختم الداخلي", "circle", centered(540, 420, 570, 570), "transparent", { fillMode: "outline", strokeColor: palette.soft, strokeWidth: 4 });
        centeredMark(365, 188);
        addText("اسم المتجر", name, [160, 655, 760, 92], palette.primary, 59);
        addText("وصف العلامة", template.tagline, [180, 758, 720, 48], palette.accent, 27, { weight: "400" });
        addShape("فاصل علوي", "diamond", centered(540, 565, 22, 22), palette.accent);
        break;
      case "wordmark":
        addShape("علامة مميزة", frame, [150, 360, 240, 240], palette.accent);
        addText("رمز المتجر", mark, [170, 390, 200, 150], palette.ink, 104);
        addShape("الفاصل", "line", [422, 340, 9, 285], palette.soft, { strokeWidth: 8 });
        addText("اسم المتجر", name, [465, 360, 500, 94], palette.primary, 58, { align: "right" });
        addText("وصف العلامة", template.tagline, [470, 466, 460, 54], palette.accent, 27, { align: "right", weight: "400" });
        addShape("خط الاسم", "line", [470, 550, 265, 5], palette.soft, { strokeWidth: 5 });
        break;
      case "monogram":
        addShape("درع الحروف", "shield", centered(540, 420, 500, 570), palette.soft);
        addShape("إطار الدرع", "shield", centered(540, 405, 430, 500), palette.accent, { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 9 });
        addText("الحروف الأولى", template.monogram, centered(540, 390, 315, 230), palette.ink, 112);
        addText("اسم المتجر", name, [180, 730, 720, 75], palette.primary, 52);
        addText("وصف العلامة", template.tagline, [180, 810, 720, 40], palette.accent, 24, { weight: "400" });
        break;
      case "split":
        addShape("خلفية الرمز", "rounded", [172, 312, 360, 360], palette.soft);
        addShape("الرمز الهندسي", frame, [235, 375, 234, 234], palette.accent);
        addText("علامة المتجر", mark, [263, 390, 180, 160], palette.ink, 105);
        addText("اسم المتجر", name, [565, 350, 380, 100], palette.primary, 58, { align: "right" });
        addText("وصف العلامة", template.tagline, [570, 462, 360, 65], palette.accent, 25, { align: "right", weight: "400" });
        addShape("خط التوازن", "line", [570, 560, 205, 5], palette.soft, { strokeWidth: 6 });
        addText("حروف العلامة", template.monogram, [570, 596, 200, 48], palette.primary, 26, { align: "right" });
        break;
      case "crest":
        addShape("شارة الشعار", "shield", centered(540, 390, 585, 650), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 15 });
        addShape("قمة الشارة", "star", centered(540, 180, 130, 130), palette.accent);
        addShape("جناح أيسر", "triangle", [278, 235, 110, 125], palette.soft, { rotation: -42 });
        addShape("جناح أيمن", "triangle", [692, 235, 110, 125], palette.soft, { rotation: 42 });
        centeredMark(385, 205);
        addText("اسم المتجر", name, [180, 610, 720, 85], palette.ink, 53);
        addText("وصف العلامة", template.tagline, [175, 704, 730, 45], palette.accent, 24, { weight: "400" });
        break;
      case "orbit":
        addShape("مدار خارجي", "ellipse", [110, 362, 860, 290], "transparent", { fillMode: "outline", strokeColor: palette.soft, strokeWidth: 8, rotation: -18 });
        addShape("مركز المدار", "circle", centered(540, 415, 355, 355), palette.background, { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 15 });
        addText("رمز العلامة", mark, centered(540, 405, 210, 190), palette.ink, 105);
        addText("اسم المتجر", name, [145, 680, 790, 78], palette.primary, 54);
        addShape("نقطة المدار", "circle", centered(184, 344, 38, 38), palette.accent);
        addShape("نقطة المدار", "circle", centered(900, 620, 30, 30), palette.accent);
        addText("وصف العلامة", template.tagline, [185, 770, 710, 45], palette.accent, 24, { weight: "400" });
        break;
      case "ribbon":
        addShape("لوحة الشعار", "rounded", [145, 305, 790, 410], palette.soft);
        addShape("شريط الاسم", "capsule", [115, 565, 850, 150], palette.accent);
        addShape("طرف الشريط الأيسر", "triangle", [118, 666, 82, 100], palette.soft);
        addShape("طرف الشريط الأيمن", "triangle", [880, 666, 82, 100], palette.soft, { rotation: 180 });
        addText("رمز العلامة", mark, centered(540, 415, 205, 175), palette.ink, 110);
        addText("اسم المتجر", name, [170, 584, 740, 100], palette.background, 51);
        addText("وصف العلامة", template.tagline, [200, 752, 680, 46], palette.primary, 25, { weight: "400" });
        break;
      case "tile":
        addShape("البلاطة الأساسية", "rounded", [230, 190, 620, 620], palette.primary);
        addShape("البلاطة الداخلية", "rounded", [252, 212, 576, 576], palette.background, { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 8 });
        addShape("إشارة البلاطة", frame, centered(540, 382, 225, 225), palette.soft);
        addText("علامة المتجر", mark, centered(540, 370, 145, 145), palette.ink, 82);
        addText("اسم المتجر", name, [285, 565, 510, 82], palette.ink, 48);
        addText("وصف العلامة", template.tagline, [285, 650, 510, 40], palette.accent, 22, { weight: "400" });
        break;
      case "diamond":
        addShape("جوهرة خارجية", "diamond", centered(540, 400, 500, 550), palette.soft);
        addShape("جوهرة داخلية", "diamond", centered(540, 398, 405, 450), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 10 });
        addText("رمز الجوهرة", mark, centered(540, 390, 175, 175), palette.ink, 100);
        addShape("نجمة علوية", "star", centered(540, 105, 70, 70), palette.accent);
        addText("اسم المتجر", name, [140, 690, 800, 82], palette.primary, 54);
        addText("وصف العلامة", template.tagline, [185, 782, 710, 40], palette.accent, 24, { weight: "400" });
        break;
      case "mascot":
        addShape("جسم الشخصية", "rounded", centered(540, 408, 420, 390), palette.soft);
        addShape("الأذن اليسرى", "triangle", [330, 185, 160, 185], palette.accent, { rotation: -8 });
        addShape("الأذن اليمنى", "triangle", [590, 185, 160, 185], palette.accent, { rotation: 8 });
        addShape("وجه الشخصية", "rounded", centered(540, 415, 345, 310), palette.primary);
        addShape("العين اليسرى", "circle", centered(465, 400, 45, 54), palette.background);
        addShape("العين اليمنى", "circle", centered(615, 400, 45, 54), palette.background);
        addShape("ابتسامة الشخصية", "arc", centered(540, 475, 115, 70), palette.accent, { fillMode: "outline", strokeWidth: 10, strokeColor: palette.accent });
        addText("اسم المتجر", name, [150, 690, 780, 78], palette.primary, 54);
        addText("وصف العلامة", template.tagline, [175, 775, 730, 42], palette.accent, 24, { weight: "400" });
        break;
      case "double-ring":
        [700, 590, 475].forEach((diameter, index) => addShape("حلقة متداخلة", "circle", centered(540, 395, diameter, diameter), "transparent", { fillMode: "outline", strokeColor: index === 1 ? palette.soft : palette.accent, strokeWidth: index === 0 ? 12 : 5 }));
        addText("حروف العلامة", template.monogram, centered(540, 385, 230, 175), palette.primary, 94);
        addText("اسم المتجر", name, [155, 715, 770, 78], palette.primary, 53);
        addText("وصف العلامة", template.tagline, [190, 800, 700, 42], palette.accent, 23, { weight: "400" });
        break;
      case "editorial":
        addShape("خط علوي", "line", [155, 278, 770, 6], palette.soft, { strokeWidth: 5 });
        addText("علامة طباعية", mark, [175, 318, 210, 200], palette.accent, 145, { align: "left" });
        addText("اسم المتجر", name, [380, 350, 545, 95], palette.primary, 58, { align: "right" });
        addText("وصف العلامة", template.tagline, [390, 455, 530, 53], palette.accent, 26, { align: "right", weight: "400" });
        addShape("خط فاصل", "line", [155, 575, 770, 5], palette.soft, { strokeWidth: 5 });
        addText("الاسم المختصر", template.monogram, [155, 614, 170, 75], palette.primary, 43, { align: "left" });
        addText("تصنيف المتجر", template.categoryLabel, [340, 628, 585, 48], palette.accent, 24, { align: "right", weight: "400" });
        break;
      case "crown":
        addShape("قوس التاج", "arc", centered(540, 405, 600, 450), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 12 });
        [300, 540, 780].forEach((x, index) => addShape("جوهرة التاج", index === 1 ? "diamond" : "star", centered(x, index === 1 ? 190 : 220, 82, 82), palette.accent));
        centeredMark(405, 195);
        addText("اسم المتجر", name, [150, 650, 780, 82], palette.primary, 55);
        addShape("خط التاج", "line", [260, 752, 560, 5], palette.soft, { strokeWidth: 6 });
        addText("وصف العلامة", template.tagline, [190, 770, 700, 40], palette.accent, 24, { weight: "400" });
        break;
      case "horizon":
        addShape("شمس الشعار", "circle", centered(540, 382, 310, 310), palette.soft);
        addShape("شريط الأفق", "rectangle", [290, 420, 500, 125], palette.background);
        addShape("أفق علوي", "line", [230, 548, 620, 5], palette.accent, { strokeWidth: 7 });
        addText("رمز الأفق", mark, centered(540, 390, 155, 155), palette.ink, 92);
        addText("اسم المتجر", name, [130, 640, 820, 85], palette.primary, 53);
        addText("وصف العلامة", template.tagline, [185, 735, 710, 48], palette.accent, 24, { weight: "400" });
        break;
      case "corner":
        addShape("زاوية علوية", "rightTriangle", [195, 220, 135, 135], palette.soft);
        addShape("زاوية سفلية", "rightTriangle", [750, 650, 135, 135], palette.soft, { rotation: 180 });
        addShape("ختم صغير", frame, centered(540, 390, 310, 310), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 12 });
        addText("علامة المتجر", mark, centered(540, 390, 180, 180), palette.primary, 108);
        addText("اسم المتجر", name, [160, 640, 760, 82], palette.primary, 55);
        addText("وصف العلامة", template.tagline, [200, 730, 680, 42], palette.accent, 24, { weight: "400" });
        break;
      case "stack":
        addShape("اللوح الطويل", "capsule", [440, 190, 200, 440], palette.primary);
        addText("رمز متراص", mark, [452, 226, 176, 150], palette.ink, 98);
        addShape("فاصل عمودي", "line", [532, 395, 5, 135], palette.accent, { strokeWidth: 5 });
        addText("الحروف الأولى", template.monogram, [452, 470, 176, 115], palette.background, 62);
        addText("اسم المتجر", name, [135, 675, 810, 78], palette.primary, 53);
        addText("وصف العلامة", template.tagline, [175, 765, 730, 42], palette.accent, 24, { weight: "400" });
        break;
      case "medallion":
        addShape("ميدالية خارجية", "octagon", centered(540, 410, 600, 600), palette.accent);
        addShape("ميدالية داخلية", "circle", centered(540, 410, 485, 485), palette.background);
        addShape("حلقة رفيعة", "circle", centered(540, 410, 420, 420), "transparent", { fillMode: "outline", strokeColor: palette.soft, strokeWidth: 6 });
        addText("علامة الميدالية", mark, centered(540, 385, 185, 160), palette.primary, 102);
        addText("اسم المتجر", name, [180, 675, 720, 78], palette.primary, 52);
        addText("وصف العلامة", template.tagline, [185, 760, 710, 42], palette.accent, 23, { weight: "400" });
        break;
      case "side-mark":
        addShape("كتلة جانبية", "diamond", [185, 310, 360, 360], palette.soft);
        addText("رمز جانبي", mark, [257, 385, 215, 170], palette.primary, 108);
        addShape("خط عمودي", "line", [585, 300, 7, 420], palette.accent, { strokeWidth: 8 });
        addText("اسم المتجر", name, [630, 350, 300, 100], palette.primary, 51, { align: "right" });
        addText("وصف العلامة", template.tagline, [640, 460, 280, 95], palette.accent, 24, { align: "right", weight: "400" });
        addText("تصنيف المتجر", template.categoryLabel, [640, 575, 280, 52], palette.primary, 22, { align: "right", weight: "400" });
        break;
      case "stamp":
        addShape("طابع خارجي", "burst", centered(540, 420, 735, 735), palette.soft);
        addShape("قلب الطابع", "circle", centered(540, 420, 520, 520), palette.background);
        addShape("إطار الطابع", "circle", centered(540, 420, 460, 460), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 9 });
        addText("رمز الطابع", mark, centered(540, 365, 160, 140), palette.accent, 92);
        addText("اسم المتجر", name, [175, 560, 730, 80], palette.primary, 49);
        addText("وصف العلامة", template.tagline, [200, 648, 680, 40], palette.accent, 22, { weight: "400" });
        break;
      default:
        addShape("حلقة الحروف", frame, centered(540, 380, 360, 360), "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 12 });
        addText("الحروف الأولى", template.monogram, centered(540, 370, 240, 165), palette.primary, 105);
        addText("اسم المتجر", name, [160, 650, 760, 80], palette.primary, 54);
        addText("وصف العلامة", template.tagline, [190, 740, 700, 44], palette.accent, 24, { weight: "400" });
    }
    addLogoIdentityLayers(template, layers);
    return layers;
  }

  function addLogoIdentityLayers(template, layers) {
    const palette = template.palette;
    const addShape = (name, kind, box, color, extra = {}) => layers.push(shape(name, kind, box, color, extra));
    const addText = (name, value, box, color, size, extra = {}) => layers.push(text(name, value, box, color, size, extra));
    const categoryIndex = logoCategories.findIndex(category => category.id === template.category);
    if (template.category === "games") {
      addShape("علامة طاقة", "lightning", [820, 165, 70, 125], palette.accent);
      addShape("إطار لعب", "line", [155, 875, 180, 6], palette.soft, { strokeWidth: 6 });
    } else if (template.category === "fashion") {
      addShape("غصن أناقة", "arc", [185, 230, 110, 340], "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 8, rotation: 25 });
      addShape("نقطة خياطة", "circle", centered(860, 850, 24, 24), palette.soft);
    } else if (template.category === "social") {
      addShape("مدار اجتماعي", "ring", centered(540, 480, 760, 420), "transparent", { fillMode: "outline", strokeColor: palette.soft, strokeWidth: 4, rotation: -12 });
      addShape("نقطة تواصل", "circle", centered(230, 485, 30, 30), palette.accent);
    } else if (template.category === "fire") {
      [260, 820].forEach(x => addShape("جوهرة جانبية", "diamond", centered(x, 240 + template.variant % 90, 50, 70), palette.accent));
      addShape("شرارة", "star", centered(840, 840, 28, 28), palette.soft);
    } else {
      const projectShape = iconShapes[(template.variant + categoryIndex) % iconShapes.length];
      addShape("ختم المشروع", projectShape, centered(885, 305 + template.variant % 70, 58, 58), palette.soft);
      addShape("نقطة المشروع", "circle", centered(205, 820, 20, 20), palette.accent);
    }
    if (template.styleId === "three-d") {
      layers.splice(0, 0, shape("ظل بارز", "parallelogram", [232, 247, 126, 112], palette.soft, { rotation: 8, opacity: 75 }));
      addShape("حافة مضيئة", "line", [690, 195, 180, 5], palette.accent, { strokeWidth: 5 });
    } else if (template.styleId === "luxury") {
      addShape("زخرفة فاخرة", "diamond", centered(540, 900, 28, 28), palette.accent);
      addShape("خط ذهبي", "line", [330, 875, 420, 3], palette.soft, { strokeWidth: 4 });
    } else if (template.styleId === "gaming") {
      addShape("إطار إلكتروني", "line", [840, 810, 105, 7], palette.accent, { strokeWidth: 8 });
      addShape("شرارة إلكترونية", "star6", centered(190, 200, 45, 45), palette.soft);
    } else if (template.styleId === "mascot") {
      addShape("رأس الشخصية", "rounded", centered(540, 190, 155, 120), palette.soft);
      addShape("عين الشخصية", "circle", centered(507, 185, 12, 18), palette.primary);
      addShape("عين الشخصية", "circle", centered(573, 185, 12, 18), palette.primary);
      addShape("ابتسامة الشخصية", "line", [522, 220, 36, 1], palette.primary, { strokeWidth: 4 });
    } else if (template.styleId === "modern") {
      addShape("قصّة عصرية", "chevron", [840, 330, 40, 68], palette.accent);
      addShape("فاصل عصري", "line", [175, 830, 95, 4], palette.soft, { strokeWidth: 5 });
    }
    if (template.archetype === "initials") addText("توقيع أولي", template.monogram, [440, 830, 200, 65], palette.accent, 34);
  }

  function makeAdLayers(template) {
    const palette = template.palette;
    const concept = template.concept;
    const layers = [];
    const addShape = (name, kind, box, color = palette.accent, extra = {}) => layers.push(shape(name, kind, box, color, extra));
    const addText = (name, value, box, color = palette.primary, size = 50, extra = {}) => layers.push(text(name, value, box, color, size, extra));
    const layout = template.variant % 8;
    const dark = template.palette.background === "#17152a" || template.palette.background === "#111827" || template.palette.background === "#241322";
    const foreground = dark ? "#ffffff" : palette.primary;
    const panel = dark ? "#26223f" : "#ffffff";

    if (layout === 0) {
      addShape("خلفية العرض", "rectangle", [0, 0, 1080, 1350], palette.background);
      addShape("شريط علوي", "rectangle", [0, 0, 1080, 170], palette.primary);
      addText("اسم المتجر", template.store, [85, 50, 900, 58], dark ? palette.background : "#ffffff", 34);
      addShape("رقم العرض", "burst", [670, 230, 310, 310], palette.accent);
      addText("نسبة الخصم", concept[2], [690, 330, 270, 72], "#ffffff", 44);
      addText("عنوان الإعلان", concept[0], [90, 270, 570, 135], foreground, 83, { align: "right" });
      addText("وصف العرض", concept[1], [95, 430, 550, 92], palette.accent, 37, { align: "right", weight: "400" });
      addShape("لوحة السعر", "rounded", [90, 735, 900, 210], panel);
      addText("السعر", concept[2], [135, 790, 820, 75], palette.accent, 56);
      addShape("زر الطلب", "capsule", [250, 1090, 580, 112], palette.primary);
      addText("دعوة إلى الإجراء", "اطلب الآن  ·  " + template.store, [285, 1125, 510, 47], dark ? palette.background : "#ffffff", 30);
    } else if (layout === 1) {
      addShape("خلفية الإعلان", "rectangle", [0, 0, 1080, 1350], palette.background);
      addShape("مساحة المنتج", "circle", [475, 230, 510, 510], palette.soft);
      addShape("تفصيل زخرفي", iconShapes[(template.variant + 3) % iconShapes.length], [590, 340, 270, 270], palette.accent);
      addText("رمز العلامة", template.mark, [655, 405, 145, 130], "#ffffff", 86);
      addText("تصنيف العرض", template.categoryLabel, [90, 150, 310, 50], palette.accent, 26, { align: "right", weight: "400" });
      addText("عنوان الإعلان", concept[0], [85, 355, 390, 155], foreground, 80, { align: "right" });
      addText("وصف العرض", concept[1], [90, 555, 355, 100], palette.accent, 34, { align: "right", weight: "400" });
      addShape("فاصل تحريري", "line", [90, 770, 900, 7], palette.soft, { strokeWidth: 7 });
      addText("السعر", concept[2], [95, 815, 875, 85], palette.primary, 58, { align: "right" });
      addText("اسم المتجر", template.store, [95, 925, 870, 52], palette.accent, 28, { align: "right", weight: "400" });
      addShape("زر الطلب", "rounded", [635, 1080, 350, 120], palette.primary);
      addText("دعوة إلى الإجراء", "اكتشف العرض", [660, 1115, 300, 50], dark ? palette.background : "#ffffff", 30);
    } else if (layout === 2) {
      addShape("خلفية القسيمة", "rectangle", [0, 0, 1080, 1350], palette.background);
      addShape("إطار القسيمة", "rounded", [75, 120, 930, 1080], "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: 12 });
      addShape("شريط القسيمة", "rounded", [130, 190, 820, 145], palette.primary);
      addText("اسم المتجر", template.store, [180, 232, 720, 55], dark ? palette.background : "#ffffff", 32);
      addText("عنوان الإعلان", concept[0], [135, 410, 810, 145], foreground, 80);
      addText("وصف العرض", concept[1], [165, 565, 750, 95], palette.accent, 37, { weight: "400" });
      addShape("شارة العرض", "burst", [330, 715, 420, 300], palette.soft);
      addText("السعر", concept[2], [370, 815, 340, 95], palette.primary, 46);
      addShape("زر الطلب", "capsule", [250, 1050, 580, 100], palette.accent);
      addText("دعوة إلى الإجراء", "احصل عليه الآن", [280, 1075, 520, 48], "#ffffff", 31);
    } else if (layout === 3) {
      addShape("خلفية الإعلان", "rectangle", [0, 0, 1080, 1350], palette.background);
      addShape("اللوحة الرئيسية", "rounded", [62, 70, 956, 1210], panel);
      addShape("شريط اللون", "rectangle", [62, 70, 956, 28], palette.accent);
      addText("تصنيف العرض", template.categoryLabel, [125, 150, 830, 45], palette.accent, 25, { weight: "400" });
      addText("عنوان الإعلان", concept[0], [125, 235, 830, 140], palette.primary, 80);
      addShape("رمز المنتج", iconShapes[(template.variant + 6) % iconShapes.length], centered(540, 590, 340, 300), palette.soft);
      addText("أيقونة المنتج", template.mark, [430, 510, 220, 150], palette.accent, 100);
      addText("وصف العرض", concept[1], [150, 810, 780, 90], palette.primary, 38, { weight: "400" });
      addShape("فاصل السعر", "line", [180, 950, 720, 5], palette.soft, { strokeWidth: 5 });
      addText("السعر", concept[2], [155, 985, 770, 72], palette.accent, 51);
      addText("دعوة إلى الإجراء", "اطلب اليوم من " + template.store, [170, 1120, 740, 50], palette.primary, 29);
    } else if (layout === 4) {
      addShape("خلفية الإعلان", "rectangle", [0, 0, 1080, 1350], palette.primary);
      addShape("كتلة زخرفية", iconShapes[(template.variant + 4) % iconShapes.length], [630, 255, 430, 470], palette.soft, { opacity: 76 });
      addShape("دائرة زخرفية", "circle", [90, 880, 210, 210], palette.accent, { opacity: 70 });
      addText("تصنيف العرض", template.categoryLabel, [105, 120, 870, 48], palette.accent, 26, { weight: "400" });
      addText("عنوان الإعلان", concept[0], [100, 285, 850, 175], dark ? "#ffffff" : palette.background, 92, { align: "right" });
      addShape("خط العنوان", "line", [112, 490, 250, 7], palette.accent, { strokeWidth: 7 });
      addText("وصف العرض", concept[1], [110, 535, 810, 88], dark ? "#ffffff" : palette.background, 39, { align: "right", weight: "400" });
      addText("السعر", concept[2], [115, 790, 800, 88], palette.accent, 60, { align: "right" });
      addShape("زر الطلب", "capsule", [110, 1085, 590, 118], palette.accent);
      addText("دعوة إلى الإجراء", "تسوق الآن  ↗", [145, 1117, 520, 48], "#ffffff", 32);
    } else if (layout === 5) {
      addShape("خلفية الإعلان", "rectangle", [0, 0, 1080, 1350], palette.background);
      addShape("إطار القصة", "rounded", [56, 55, 968, 1240], "transparent", { fillMode: "outline", strokeColor: palette.soft, strokeWidth: 5 });
      addShape("شمس الحملة", "circle", [290, 300, 500, 500], palette.soft);
      addShape("رمز الحملة", frameFor(template.variant), [425, 440, 230, 220], palette.accent);
      addText("أيقونة الحملة", template.mark, [470, 470, 140, 130], palette.ink, 86);
      addText("اسم المتجر", template.store, [145, 130, 790, 52], palette.accent, 29, { weight: "400" });
      addText("عنوان الإعلان", concept[0], [130, 855, 820, 112], palette.primary, 69);
      addText("وصف العرض", concept[1], [165, 976, 750, 74], palette.primary, 33, { weight: "400" });
      addShape("السعر", "rounded", [220, 1090, 640, 115], palette.primary);
      addText("السعر المعروض", concept[2], [255, 1122, 570, 52], dark ? palette.background : "#ffffff", 34);
    } else if (layout === 6) {
      addShape("خلفية الإعلان", "rectangle", [0, 0, 1080, 1350], palette.background);
      addShape("شريط جانبي", "rectangle", [0, 0, 255, 1350], palette.primary);
      addText("رمز الشريط", template.mark, [45, 195, 165, 130], dark ? palette.background : "#ffffff", 92);
      addText("تصنيف المتجر", template.categoryLabel, [45, 425, 170, 230], dark ? palette.background : "#ffffff", 30, { weight: "400" });
      addShape("مؤشر جانبي", "line", [90, 750, 80, 5], palette.accent, { strokeWidth: 6 });
      addText("عنوان الإعلان", concept[0], [300, 185, 690, 180], palette.primary, 81, { align: "right" });
      addText("وصف العرض", concept[1], [315, 390, 650, 100], palette.accent, 36, { align: "right", weight: "400" });
      addShape("شارة السعر", "hexagon", [390, 600, 405, 340], palette.soft);
      addText("السعر", concept[2], [430, 710, 325, 90], palette.primary, 48);
      addText("اسم المتجر", template.store, [315, 1000, 650, 50], palette.primary, 27, { align: "right", weight: "400" });
      addShape("زر الطلب", "capsule", [350, 1095, 590, 105], palette.accent);
      addText("دعوة إلى الإجراء", "ابدأ الآن", [385, 1122, 520, 45], "#ffffff", 30);
    } else {
      addShape("خلفية الإعلان", "rectangle", [0, 0, 1080, 1350], palette.background);
      addShape("شمس خلفية", "circle", centered(540, 495, 780, 780), palette.soft);
      addShape("علامة هندسية", iconShapes[(template.variant + 7) % iconShapes.length], centered(540, 465, 420, 400), palette.accent);
      addText("رمز الحملة", template.mark, centered(540, 455, 190, 180), "#ffffff", 108);
      addText("اسم المتجر", template.store, [145, 110, 790, 55], palette.accent, 29, { weight: "400" });
      addText("عنوان الإعلان", concept[0], [105, 850, 870, 120], palette.primary, 75);
      addText("وصف العرض", concept[1], [150, 982, 780, 78], palette.primary, 34, { weight: "400" });
      addShape("شريط العرض", "capsule", [130, 1095, 820, 112], palette.primary);
      addText("السعر والدعوة", concept[2] + "  ·  اكتشف المزيد", [170, 1124, 740, 48], dark ? palette.background : "#ffffff", 30);
    }
    return layers;
  }

  function frameFor(seed) {
    return iconShapes[(seed * 3 + 2) % iconShapes.length];
  }

  const taglines = ["تفاصيل تصنع الفرق", "هوية تترك أثراً", "اختيار يليق بك", "فكرتك بصورة أجمل", "جودة في كل تفصيل", "حضور يعبّر عنك", "أسلوبك يبدأ هنا", "مصمم بشغف"];
  for (const category of logoCategories) {
    for (let index = 0; index < category.count; index++) {
      const style = styles[(index + logoCategories.indexOf(category) * 2) % styles.length];
      const palette = palettes[(index * 3 + logoCategories.indexOf(category) * 2) % palettes.length];
      const item = {
        id: `logo-${category.id}-${String(index + 1).padStart(2, "0")}`,
        kind: "logo",
        category: category.id,
        categoryLabel: category.label,
        name: category.names[index],
        tagline: taglines[(index + logoCategories.indexOf(category)) % taglines.length],
        mark: category.marks[index],
        monogram: category.names[index].replace(/\s/g, "").slice(0, 2),
        styleId: style[0],
        styleLabel: style[1],
        archetype: logoArchetypes[index % logoArchetypes.length],
        variant: index + logoCategories.indexOf(category) * 7,
        palette,
        width: 1080,
        height: 1080
      };
      item.elements = makeLogoLayers(item);
      templates.push(item);
    }
  }

  for (const category of logoCategories) {
    for (let index = 0; index < 8; index++) {
      const style = styles[(index + logoCategories.indexOf(category) + 1) % styles.length];
      const palette = palettes[(index * 2 + logoCategories.indexOf(category) * 3 + 1) % palettes.length];
      const concept = adConcepts[category.id][index];
      const item = {
        id: `ad-${category.id}-${String(index + 1).padStart(2, "0")}`,
        kind: "ad",
        category: category.id,
        categoryLabel: category.label,
        name: concept[0],
        store: category.names[(index * 2 + 3) % category.names.length],
        tagline: concept[1],
        mark: category.marks[(index * 3 + 2) % category.marks.length],
        concept,
        styleId: style[0],
        styleLabel: style[1],
        variant: index + logoCategories.indexOf(category) * 3,
        palette,
        width: 1080,
        height: 1350
      };
      item.elements = makeAdLayers(item);
      templates.push(item);
    }
  }

  // Additional ready-to-edit social media templates. These are regular library items,
  // not gated content, and use the same editable vector layers as the original catalog.
  const socialBase = templates.find(template => template.category === "social" && template.kind === "logo");
  const socialNames = ["حضورك", "رابطك", "قصتك", "صوتك", "مساحتك", "أثرك", "وصل", "نبض", "واجهة", "مدار"];
  if (socialBase) {
    for (let index = 0; index < 50; index++) {
      const item = {
        ...socialBase,
        id: `social-extra-${String(index + 1).padStart(2, "0")}`,
        kind: "logo",
        category: "social",
        categoryLabel: "قوالب السوشيال ميديا",
        name: `${socialNames[index % socialNames.length]} · ${String(index + 1).padStart(2, "0")}`,
        mark: ["◎", "✦", "◈", "⌁", "◉"][index % 5],
        monogram: `S${String(index + 1).padStart(2, "0")}`,
        styleId: styles[index % styles.length][0],
        styleLabel: styles[index % styles.length][1],
        archetype: logoArchetypes[(index + 11) % logoArchetypes.length],
        variant: 80 + index,
        palette: palettes[(index + 3) % palettes.length]
      };
      item.elements = makeLogoLayers(item);
      templates.push(item);
    }
  }

  // 100 ready-to-edit social media templates: 10 platforms × 10 campaign ideas.
  // Every item is built from independent text and shape layers, so nothing is a flat image.
  const socialPlatforms = [
    { id: "instagram-post", label: "Instagram Post", width: 1080, height: 1080 },
    { id: "instagram-story", label: "Instagram Story", width: 1080, height: 1920 },
    { id: "instagram-reels", label: "Instagram Reels", width: 1080, height: 1920 },
    { id: "facebook-post", label: "Facebook Post", width: 1200, height: 1200 },
    { id: "facebook-cover", label: "Facebook Cover", width: 1640, height: 856 },
    { id: "linkedin-post", label: "LinkedIn Post", width: 1200, height: 627 },
    { id: "tiktok-cover", label: "TikTok Cover", width: 1080, height: 1920 },
    { id: "youtube-thumbnail", label: "YouTube Thumbnail", width: 1280, height: 720 },
    { id: "snapchat-story", label: "Snapchat Story", width: 1080, height: 1920 },
    { id: "whatsapp-status", label: "WhatsApp Status", width: 1080, height: 1920 }
  ];
  const socialConcepts = [
    ["إطلاق جديد", "خلّي فكرتك تبدأ اليوم", "اكتشف المزيد"],
    ["عرض محدود", "فرصتك الأفضل لفترة قصيرة", "اطلب الآن"],
    ["نصيحة اليوم", "خطوة صغيرة تصنع فرقًا كبيرًا", "احفظ المنشور"],
    ["قصة علامتك", "تفاصيل حقيقية تستحق أن تُروى", "تابع القصة"],
    ["منتج الأسبوع", "اختيارك الذكي يبدأ من هنا", "تسوّق الآن"],
    ["وراء الكواليس", "نصنعها بعناية من أجلك", "شاهد التفاصيل"],
    ["اقتباس ملهم", "أفكارك تستحق مساحة أكبر", "شارك الإلهام"],
    ["موعد مهم", "لا تفوّت لحظتك القادمة", "سجّل الموعد"],
    ["معلومة سريعة", "معلومة واحدة تغيّر نظرتك", "اعرف أكثر"],
    ["شكرًا لك", "وجودك هو أجمل جزء من قصتنا", "كن قريبًا"]
  ];
  function makeSocialLayers(template) {
    const { width: w, height: h, palette, variant, concept } = template;
    const short = Math.min(w, h);
    const layers = [];
    const addShape = (name, kind, box, color = palette.accent, extra = {}) => layers.push(shape(name, kind, box, color, extra));
    const addText = (name, value, box, color = palette.primary, size = 50, extra = {}) => layers.push(text(name, value, box, color, Math.max(24, Math.round(size)), extra));
    const layout = variant % 10;
    const dark = variant % 3 === 0 || palette.background === "#17152a" || palette.background === "#111827";
    const ink = dark ? "#ffffff" : palette.primary;
    const card = dark ? "#26223f" : "#ffffff";
    addShape("الخلفية", "rectangle", [0, 0, w, h], palette.background);
    if (layout === 0) {
      addShape("شريط علوي", "rectangle", [0, 0, w, h * .18], palette.primary);
      addShape("عنصر دائري", "circle", [w * .62, h * .18, short * .38, short * .38], palette.accent, { opacity: 82 });
      addText("اسم الحساب", "اسم علامتك", [w * .08, h * .06, w * .84, short * .06], dark ? palette.background : "#ffffff", short * .045);
      addText("العنوان الرئيسي", concept[0], [w * .08, h * .29, w * .84, short * .22], ink, short * .115, { align: "right" });
      addText("الوصف", concept[1], [w * .08, h * .55, w * .78, short * .12], palette.accent, short * .052, { weight: "400", align: "right" });
      addShape("زر الإجراء", "capsule", [w * .12, h * .78, w * .76, short * .1], palette.accent);
      addText("دعوة للإجراء", concept[2], [w * .18, h * .805, w * .64, short * .05], "#ffffff", short * .04);
    } else if (layout === 1) {
      addShape("لوحة المحتوى", "rounded", [w * .07, h * .08, w * .86, h * .84], card);
      addShape("إطار مميز", "rounded", [w * .11, h * .12, w * .78, h * .76], "transparent", { fillMode: "outline", strokeColor: palette.accent, strokeWidth: Math.max(6, short * .012) });
      addText("التصنيف", "SOCIAL / 2026", [w * .16, h * .18, w * .68, short * .05], palette.accent, short * .035, { weight: "400" });
      addText("العنوان الرئيسي", concept[0], [w * .15, h * .33, w * .7, short * .22], ink, short * .105);
      addShape("فاصل", "line", [w * .25, h * .62, w * .5, Math.max(4, short * .008)], palette.accent, { strokeWidth: Math.max(5, short * .012) });
      addText("الوصف", concept[1], [w * .16, h * .68, w * .68, short * .11], palette.primary, short * .045, { weight: "400" });
    } else if (layout === 2) {
      addShape("كتلة جانبية", "rectangle", [0, 0, w * .28, h], palette.primary);
      addShape("شارة", "burst", [w * .09, h * .2, short * .2, short * .2], palette.accent);
      addText("رمز العلامة", "AK", [w * .12, h * .255, short * .14, short * .08], "#ffffff", short * .06);
      addText("اسم الحساب", "اسم علامتك", [w * .055, h * .52, w * .17, h * .2], dark ? palette.background : "#ffffff", short * .035, { weight: "400" });
      addText("العنوان الرئيسي", concept[0], [w * .37, h * .19, w * .55, h * .24], ink, short * .1, { align: "right" });
      addText("الوصف", concept[1], [w * .37, h * .51, w * .53, h * .15], palette.accent, short * .05, { weight: "400", align: "right" });
      addShape("زر الإجراء", "rounded", [w * .42, h * .75, w * .42, short * .1], palette.accent);
      addText("دعوة للإجراء", concept[2], [w * .47, h * .775, w * .32, short * .05], "#ffffff", short * .035);
    } else if (layout === 3) {
      addShape("دائرة خلفية", "circle", [w * .18, h * .12, short * .65, short * .65], palette.soft);
      addShape("شكل مركزي", ["diamond", "hexagon", "star", "ring"][variant % 4], [w * .35, h * .22, short * .3, short * .3], palette.accent);
      addText("الحرف البصري", "✦", [w * .42, h * .31, short * .16, short * .12], "#ffffff", short * .09);
      addText("العنوان الرئيسي", concept[0], [w * .1, h * .58, w * .8, short * .16], ink, short * .08);
      addText("دعوة للإجراء", concept[2], [w * .15, h * .78, w * .7, short * .08], palette.accent, short * .045, { weight: "400" });
    } else if (layout === 4) {
      addShape("شريط سفلي", "rectangle", [0, h * .78, w, h * .22], palette.primary);
      addShape("زاوية زخرفية", "triangle", [w * .72, 0, short * .28, short * .28], palette.accent);
      addText("اسم الحساب", "اسم علامتك", [w * .08, h * .08, w * .84, short * .05], palette.accent, short * .04, { align: "right" });
      addText("العنوان الرئيسي", concept[0], [w * .08, h * .27, w * .84, h * .22], ink, short * .11, { align: "right" });
      addText("الوصف", concept[1], [w * .08, h * .55, w * .7, h * .12], palette.primary, short * .05, { weight: "400", align: "right" });
      addText("دعوة للإجراء", concept[2], [w * .1, h * .85, w * .8, short * .06], dark ? palette.background : "#ffffff", short * .04);
    } else {
      addShape("بطاقة رئيسية", "rounded", [w * .08, h * .1, w * .84, h * .8], card);
      addShape("تفصيل لوني", ["circle", "burst", "cloud", "capsule"][variant % 4], [w * .63, h * .16, short * .24, short * .24], palette.accent);
      addText("العنوان الرئيسي", concept[0], [w * .14, h * .25, w * .72, h * .22], ink, short * .09, { align: "right" });
      addText("الوصف", concept[1], [w * .14, h * .55, w * .7, h * .12], palette.primary, short * .045, { weight: "400", align: "right" });
      addShape("فاصل", "line", [w * .2, h * .72, w * .6, Math.max(4, short * .008)], palette.soft, { strokeWidth: Math.max(5, short * .01) });
      addText("دعوة للإجراء", concept[2], [w * .16, h * .78, w * .68, short * .07], palette.accent, short * .04);
    }
    addText("تذييل", "@yourbrand  ·  تابعنا للمزيد", [w * .1, h * .94, w * .8, short * .035], palette.primary, short * .026, { weight: "400" });
    return layers;
  }
  socialPlatforms.forEach((platform, platformIndex) => {
    socialConcepts.forEach((concept, conceptIndex) => {
      const palette = palettes[(platformIndex * 2 + conceptIndex) % palettes.length];
      const item = {
        id: `social-media-${platform.id}-${String(conceptIndex + 1).padStart(2, "0")}`,
        kind: "social",
        category: "social",
        categoryLabel: "قوالب السوشيال ميديا",
        platform: platform.label,
        name: `${platform.label} · ${concept[0]}`,
        tagline: `${platform.label} — قالب قابل للتعديل بالكامل`,
        styleId: styles[(platformIndex + conceptIndex) % styles.length][0],
        styleLabel: styles[(platformIndex + conceptIndex) % styles.length][1],
        variant: platformIndex * 10 + conceptIndex,
        concept,
        palette,
        width: platform.width,
        height: platform.height
      };
      item.elements = makeSocialLayers(item);
      templates.push(item);
    });
  });

  const shapePaths = {
    triangle: "M50 0 L100 100 L0 100 Z",
    rightTriangle: "M0 0 L0 100 L100 100 Z",
    diamond: "M50 0 L100 50 L50 100 L0 50 Z",
    pentagon: "M50 2 L98 38 L80 96 L20 96 L2 38 Z",
    hexagon: "M25 2 L75 2 L100 50 L75 98 L25 98 L0 50 Z",
    octagon: "M28 0 L72 0 L100 28 L100 72 L72 100 L28 100 L0 72 L0 28 Z",
    shield: "M8 0 L92 0 L88 60 L50 100 L12 60 Z",
    star: "M50 0 L61 35 L98 36 L68 59 L79 96 L50 74 L20 96 L31 59 L2 36 L39 35 Z",
    star6: "M50 0 L62 28 L94 8 L79 40 L100 50 L79 62 L94 92 L62 76 L50 100 L38 76 L6 92 L21 62 L0 50 L21 40 L6 8 L38 28 Z",
    star8: "M50 0 L60 33 L85 15 L70 41 L100 50 L70 59 L85 85 L60 67 L50 100 L40 67 L15 85 L30 59 L0 50 L30 41 L15 15 L40 33 Z",
    heart: "M50 95 C35 79 4 59 4 31 C4 2 38 -5 50 23 C64 -5 97 2 97 31 C97 59 66 79 50 95 Z",
    lightning: "M58 0 L15 57 L43 57 L30 100 L85 38 L56 38 Z",
    arrow: "M0 36 L66 36 L66 15 L100 50 L66 85 L66 64 L0 64 Z",
    leftArrow: "M100 36 L34 36 L34 15 L0 50 L34 85 L34 64 L100 64 Z",
    upArrow: "M36 100 L36 34 L15 34 L50 0 L85 34 L64 34 L64 100 Z",
    downArrow: "M36 0 L64 0 L64 66 L85 66 L50 100 L15 66 L36 66 Z",
    parallelogram: "M25 0 L100 0 L75 100 L0 100 Z",
    trapezoid: "M20 0 L80 0 L100 100 L0 100 Z",
    plus: "M38 0 L62 0 L62 38 L100 38 L100 62 L62 62 L62 100 L38 100 L38 62 L0 62 L0 38 L38 38 Z",
    cross: "M34 0 L66 0 L66 34 L100 34 L100 66 L66 66 L66 100 L34 100 L34 66 L0 66 L0 34 L34 34 Z",
    cube: "M50 0 L95 25 L95 75 L50 100 L5 75 L5 25 Z",
    flag: "M20 100 L20 0 L88 12 L20 42 Z",
    chevron: "M0 0 L48 0 L100 50 L48 100 L0 100 L52 50 Z",
    burst: "M50 0 L56 26 L70 8 L68 35 L92 22 L78 45 L100 50 L77 57 L94 78 L69 68 L71 96 L55 76 L49 100 L44 76 L25 95 L31 68 L7 79 L23 57 L0 50 L24 44 L7 22 L32 34 L29 6 L46 26 Z",
    rounded: null,
    rectangle: null,
    capsule: null,
    circle: null,
    ellipse: null,
    ring: null,
    line: null,
    arc: null,
    moon: null,
    cloud: null,
    speech: null,
    cylinder: null
  };
  const textMeasureContext = document.createElement("canvas").getContext("2d");

  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;"
    })[character]);
  }

  function itemSvg(element) {
    const x = element.x, y = element.y, w = element.w, h = element.h;
    const fill = element.fillMode === "outline" ? "none" : element.color;
    const stroke = element.strokeColor || element.color;
    const strokeWidth = Math.max(0, Number(element.strokeWidth) || 0);
    const opacity = Number.isFinite(element.opacity) ? element.opacity / 100 : 1;
    const rotate = Number(element.rotation) ? ` transform="rotate(${Number(element.rotation)} ${x + w / 2} ${y + h / 2})"` : "";
    if (element.type === "text") {
      const anchor = element.align === "left" ? "end" : element.align === "center" ? "middle" : "start";
      const tx = element.align === "left" ? x : element.align === "center" ? x + w / 2 : x + w;
      const lineHeight = (Number(element.lineHeight) || 1.35) * element.fontSize;
      const fontFamily = element.fontFamily || "Tahoma";
      textMeasureContext.font = `${element.weight || "700"} ${element.fontSize}px "${fontFamily}", Tahoma, Arial, sans-serif`;
      const lines = String(element.text).split("\n").map((line, index) => {
        const fit = textMeasureContext.measureText(line).width > w ? ` textLength="${w}" lengthAdjust="spacingAndGlyphs"` : "";
        return `<tspan x="${tx}" dy="${index ? lineHeight : 0}"${fit}>${escapeXml(line)}</tspan>`;
      }).join("");
      return `<text x="${tx}" y="${y}" fill="${element.color}" font-family="${escapeXml(fontFamily)},Tahoma,Arial,sans-serif" font-size="${element.fontSize}" font-weight="${escapeXml(element.weight || "700")}" text-anchor="${anchor}" dominant-baseline="hanging" direction="rtl" unicode-bidi="plaintext" opacity="${opacity}"${rotate}>${lines}</text>`;
    }
    const path = shapePaths[element.shape];
    let node;
    if (element.shape === "circle" || element.shape === "ellipse" || element.shape === "arc") {
      const rx = w / 2, ry = h / 2;
      node = `<ellipse cx="${x + rx}" cy="${y + ry}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth || (element.shape === "arc" ? 5 : 0)}" opacity="${opacity}"${rotate}/>`;
    } else if (element.shape === "ring") {
      node = `<path d="M${x + w / 2} ${y + h * .02} a${w * .48} ${h * .48} 0 1 0 0 ${h * .96} a${w * .48} ${h * .48} 0 1 0 0 ${-h * .96} M${x + w / 2} ${y + h * .23} a${w * .27} ${h * .27} 0 1 1 0 ${h * .54} a${w * .27} ${h * .27} 0 1 1 0 ${-h * .54}" fill="${element.fillMode === "outline" ? "none" : element.color}" fill-rule="evenodd" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"${rotate}/>`;
    } else if (element.shape === "line") {
      node = `<path d="M${x} ${y + h} L${x + w} ${y}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth || 5}" stroke-linecap="round" opacity="${opacity}"${rotate}/>`;
    } else if (element.shape === "rounded" || element.shape === "capsule" || element.shape === "rectangle") {
      const radius = element.shape === "capsule" ? Math.min(w, h) / 2 : element.shape === "rounded" ? Math.min(w, h) * .14 : 0;
      node = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"${rotate}/>`;
    } else if (path) {
      node = `<path d="${path}" transform="translate(${x} ${y}) scale(${w / 100} ${h / 100})${Number(element.rotation) ? ` rotate(${Number(element.rotation)} ${50} ${50})` : ""}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth ? strokeWidth * 100 / Math.min(w, h) : 0}" stroke-linejoin="round" opacity="${opacity}"/>`;
    } else if (element.shape === "arc") {
      node = `<path d="M${x + w * .05} ${y + h * .75} A${w * .45} ${h * .45} 0 0 1 ${x + w * .95} ${y + h * .75}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth || 5}" opacity="${opacity}"${rotate}/>`;
    } else {
      node = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" opacity="${opacity}"${rotate}/>`;
    }
    return node;
  }

  function templateSvg(template, transparent = false) {
    const background = transparent ? "" : `<rect width="${template.width}" height="${template.height}" fill="${template.palette.background}"/>`;
    const art = template.elements.map(itemSvg).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${template.width}" height="${template.height}" viewBox="0 0 ${template.width} ${template.height}" role="img" aria-label="${escapeXml(template.name)}">${background}${art}</svg>`;
  }

  function currentFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem("ak-pro-favorites") || "[]");
      return new Set(Array.isArray(stored) ? stored.filter(value => typeof value === "string") : []);
    } catch (error) {
      console.error("Could not read AK Pro favorites:", error);
      return new Set();
    }
  }

  const favoriteIds = currentFavorites();
  const cardNodes = new Map();
  const grid = document.getElementById("pro-template-grid");
  const search = document.getElementById("pro-template-search");
  const typeFilter = document.getElementById("pro-type-filter");
  if (!typeFilter.querySelector('option[value="social"]')) typeFilter.append(new Option("سوشيال ميديا · 100", "social"));
  const categoryFilter = document.getElementById("pro-category-filter");
  const styleFilter = document.getElementById("pro-style-filter");
  const favoritesOnly = document.getElementById("pro-favorites-only");
  const count = document.getElementById("pro-result-count");
  const favoritesCount = document.getElementById("pro-favorites-count");
  const emptyResults = document.getElementById("pro-empty-results");
  const previewDialog = document.getElementById("pro-preview-dialog");
  const previewTitle = document.getElementById("pro-preview-title");
  const previewDescription = document.getElementById("pro-preview-description");
  const previewKicker = document.getElementById("pro-preview-kicker");
  const previewArt = document.getElementById("pro-preview-art");
  let activeTemplate = null;
  const renderedCards = new WeakSet();
  const previewObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const template = templates.find(item => item.id === card.dataset.id);
        if (template && !renderedCards.has(card)) {
          card.querySelector(".pro-template-art").innerHTML = templateSvg(template);
          renderedCards.add(card);
        }
        previewObserver.unobserve(card);
      });
    }, { root: grid, rootMargin: "180px" })
    : null;

  function saveFavorites() {
    try {
      localStorage.setItem("ak-pro-favorites", JSON.stringify([...favoriteIds]));
    } catch (error) {
      console.error("Could not save AK Pro favorites:", error);
      const notice = document.getElementById("pro-favorites-count");
      notice.title = "تعذّر حفظ المفضلة على هذا الجهاز.";
    }
  }

  function updateFavorite(button, template) {
    const isFavorite = favoriteIds.has(template.id);
    button.textContent = isFavorite ? "★" : "☆";
    button.classList.toggle("is-favorite", isFavorite);
    button.setAttribute("aria-label", isFavorite ? "إزالة من المفضلة" : "أضف إلى المفضلة");
    button.title = button.getAttribute("aria-label");
  }

  function renderCard(template) {
    const card = document.createElement("article");
    card.className = "pro-template";
    card.dataset.id = template.id;
    card.dataset.type = template.kind;
    card.dataset.category = template.category;
    card.dataset.style = template.styleId;
    card.dataset.search = `${template.name} ${template.tagline} ${template.categoryLabel} ${template.styleLabel} ${template.kind}`.toLocaleLowerCase("ar");
    const preview = document.createElement("button");
    preview.type = "button";
    preview.className = "pro-template-open";
    preview.setAttribute("aria-label", `معاينة ${template.name}`);
    const art = document.createElement("span");
    art.className = `pro-template-art ${template.kind === "ad" ? "is-ad" : "is-logo"}`;
    const flag = document.createElement("span");
    if (template.kind === "social") flag.textContent = "سوشيال ميديا";
    flag.className = "pro-template-kind";
    flag.textContent = template.kind === "logo" ? "شعار" : "إعلان";
    art.append(flag);
    if (template.kind === "social") flag.textContent = "سوشيال ميديا";
    const title = document.createElement("strong");
    title.textContent = template.name;
    const meta = document.createElement("small");
    meta.textContent = `${template.categoryLabel} · ${template.styleLabel}`;
    preview.append(art, title, meta);
    const favorite = document.createElement("button");
    favorite.type = "button";
    favorite.className = "pro-template-favorite";
    favorite.addEventListener("click", event => {
      event.stopPropagation();
      if (favoriteIds.has(template.id)) favoriteIds.delete(template.id);
      else favoriteIds.add(template.id);
      saveFavorites();
      updateFavorite(favorite, template);
      filterTemplates();
    });
    updateFavorite(favorite, template);
    preview.addEventListener("click", () => openPreview(template));
    card.append(preview, favorite);
    cardNodes.set(template.id, card);
    grid.append(card);
    if (previewObserver) previewObserver.observe(card);
    else {
      art.innerHTML = templateSvg(template);
      renderedCards.add(card);
    }
  }

  function filterTemplates() {
    const query = search.value.trim().toLocaleLowerCase("ar");
    const kind = typeFilter.value;
    const category = categoryFilter.value;
    const style = styleFilter.value;
    let visible = 0;
    for (const template of templates) {
      const matches = (!query || `${template.name} ${template.tagline} ${template.categoryLabel} ${template.styleLabel}`.toLocaleLowerCase("ar").includes(query)) &&
        (kind === "all" || template.kind === kind) &&
        (category === "all" || template.category === category) &&
        (style === "all" || template.styleId === style) &&
        (!favoritesOnly.checked || favoriteIds.has(template.id));
      const card = cardNodes.get(template.id);
      card.hidden = !matches;
      if (matches) visible++;
    }
    count.textContent = `${visible} من ${templates.length} تصميماً`;
    favoritesCount.textContent = String(favoriteIds.size);
    emptyResults.hidden = visible > 0;
  }

  function openPreview(template) {
    activeTemplate = template;
    previewTitle.textContent = template.name;
    previewKicker.textContent = `${template.kind === "logo" ? "معاينة شعار" : "معاينة إعلان"} · ${template.categoryLabel} · ${template.styleLabel}`;
    previewDescription.textContent = template.kind === "logo" ? `${template.tagline} — طبقات مستقلة وخلفية قابلة للتغيير.` : `${template.tagline} — يتضمن نصوصاً وأسعاراً وأشكالاً قابلة للتحرير.`;
    previewArt.innerHTML = templateSvg(template);
    if (template.kind === "social") {
      previewKicker.textContent = `معاينة سوشيال ميديا · ${template.platform} · ${template.styleLabel}`;
      previewDescription.textContent = `${template.tagline} — طبقات نصية وأشكال وألوان مستقلة قابلة للتعديل.`;
    }
    document.getElementById("pro-preview-secondary").textContent = template.kind === "logo" ? "تنزيل SVG" : "تنزيل JPG";
    previewDialog.showModal();
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function downloadSvg(template) {
    const data = templateSvg(template, template.kind === "logo");
    downloadBlob(new Blob([data], { type: "image/svg+xml;charset=utf-8" }), `${template.id}.svg`);
  }

  function downloadRaster(template, format) {
    const svg = new Blob([templateSvg(template, template.kind === "logo")], { type: "image/svg+xml;charset=utf-8" });
    const imageUrl = URL.createObjectURL(svg);
    const image = new Image();
    image.onload = () => {
      const output = document.createElement("canvas");
      output.width = template.width;
      output.height = template.height;
      const context = output.getContext("2d");
      if (template.kind === "ad" && format === "jpg") {
        context.fillStyle = template.palette.background;
        context.fillRect(0, 0, output.width, output.height);
      }
      context.drawImage(image, 0, 0);
      output.toBlob(blob => {
        URL.revokeObjectURL(imageUrl);
        if (!blob) {
          console.error("Could not export AK Pro template raster image.");
          return;
        }
        downloadBlob(blob, `${template.id}.${format}`);
      }, format === "jpg" ? "image/jpeg" : "image/png", .94);
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      console.error("Could not render AK Pro template for export.");
    };
    image.src = imageUrl;
  }

  search.addEventListener("input", filterTemplates);
  typeFilter.addEventListener("change", filterTemplates);
  categoryFilter.addEventListener("change", filterTemplates);
  styleFilter.addEventListener("change", filterTemplates);
  favoritesOnly.addEventListener("change", filterTemplates);
  templates.forEach(renderCard);
  filterTemplates();

  document.getElementById("pro-preview-apply").addEventListener("click", () => {
    if (!activeTemplate) return;
    document.dispatchEvent(new CustomEvent("ak-pro-apply", { detail: activeTemplate }));
  });
  document.getElementById("pro-preview-png").addEventListener("click", () => {
    if (activeTemplate) downloadRaster(activeTemplate, "png");
  });
  document.getElementById("pro-preview-secondary").addEventListener("click", () => {
    if (!activeTemplate) return;
    if (activeTemplate.kind === "logo") downloadSvg(activeTemplate);
    else downloadRaster(activeTemplate, "jpg");
  });
  document.querySelectorAll('[data-close-dialog="pro-preview-dialog"]').forEach(button => {
    button.addEventListener("click", () => previewDialog.close());
  });
  previewDialog.addEventListener("click", event => {
    if (event.target === previewDialog) previewDialog.close();
  });
  document.getElementById("pro-library").addEventListener("close", () => {
    cardNodes.forEach(card => {
      const art = card.querySelector(".pro-template-art");
      if (!art.querySelector("svg")) return;
      art.replaceChildren(card.querySelector(".pro-template-kind"));
      renderedCards.delete(card);
      previewObserver?.observe(card);
    });
  });

  window.AKProLibrary = {
    templates,
    categories,
    renderSvg: templateSvg,
    buildElements(template, width, height) {
      const base = Math.min(width / template.width, height / template.height);
      const offsetX = (width - template.width * base) / 2;
      const offsetY = (height - template.height * base) / 2;
      return template.elements.map(element => ({
        ...element,
        id: undefined,
        x: Math.round(offsetX + element.x * base),
        y: Math.round(offsetY + element.y * base),
        w: Math.max(1, Math.round(element.w * base)),
        h: Math.max(1, Math.round(element.h * base)),
        fontSize: element.fontSize ? Math.round(element.fontSize * base) : undefined,
        strokeWidth: element.strokeWidth ? Math.max(1, Math.round(element.strokeWidth * base)) : 0
      }));
    },
    downloadBlob
  };
})();
