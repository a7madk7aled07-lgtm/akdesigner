(() => {
  const canvas = document.getElementById("design-canvas");
  const ctx = canvas.getContext("2d");
  const canvasFrame = document.getElementById("canvas-frame");
  const layersEl = document.getElementById("layers");
  const propertyContent = document.getElementById("property-content");
  const uploadInput = document.getElementById("image-upload");
  const sizeSelect = document.getElementById("canvas-size");
  const statusEl = document.getElementById("save-status");
  const bgInput = document.getElementById("background-color");
  let background = "#ffffff";
  let backgroundImage = null;
  const imageSources = new Map();
  const backgroundSources = new Map();
  let nextBackgroundImageId = 1;
  let items = [];
  let selectedId = null;
  let nextId = 1;
  let history = [];
  let historyIndex = -1;
  let trash = [];
  let drag = null;
  let guidesVisible = false;
  let canvasZoom = 1;
  let toastTimer;
  let autoSaveTimer;
  let autoSaveWarningShown = false;
  let cameraStream = null;
  let drawFrame = 0;
  let proLibraryLoad = null;
  let copiedStyle = null;

  const shapeCatalog = [
    ["rectangle", "مربع", "▰"], ["rounded", "مستدير", "▢"], ["circle", "دائرة", "●"], ["ellipse", "بيضاوي", "⬭"],
    ["triangle", "مثلث", "▲"], ["rightTriangle", "قائم", "◢"], ["diamond", "معيّن", "◆"], ["pentagon", "خماسي", "⬟"],
    ["hexagon", "سداسي", "⬡"], ["heptagon", "سباعي", "⬢"], ["octagon", "ثماني", "⯄"], ["star", "نجمة", "★"],
    ["star6", "نجمة ٦", "✶"], ["star8", "نجمة ٨", "✳"], ["heart", "قلب", "♥"], ["plus", "زائد", "+"],
    ["cross", "صليب", "✚"], ["line", "خط", "╱"], ["arrow", "سهم", "➜"], ["leftArrow", "سهم يسار", "⬅"],
    ["upArrow", "سهم أعلى", "⬆"], ["downArrow", "سهم أسفل", "⬇"], ["chevron", "زاوية", "❯"], ["trapezoid", "شبه منحرف", "⏢"],
    ["parallelogram", "متوازي", "▱"], ["cylinder", "أسطوانة", "▤"], ["cloud", "سحابة", "☁"], ["speech", "فقاعة", "▱"],
    ["lightning", "برق", "ϟ"], ["moon", "هلال", "☾"], ["ring", "حلقة", "◎"], ["shield", "درع", "⬟"],
    ["burst", "انفجار", "✹"], ["arc", "قوس", "◠"], ["capsule", "كبسولة", "▰"], ["flag", "راية", "⚑"],
    ["cube", "مكعب", "⬢"],
    ["badgeCircle", "شارة دائرية", "◉"], ["badgeHex", "شارة سداسية", "⬢"], ["ticket", "تذكرة", "▱"], ["tag", "بطاقة سعر", "▰"], ["ribbon", "شريط", "⌁"],
    ["droplet", "قطرة", "◕"], ["leaf", "ورقة", "❧"], ["sun", "شمس", "☀"], ["gear", "ترس", "⚙"], ["flower", "زهرة", "✿"],
    ["star4", "نجمة رباعية", "✦"], ["star10", "نجمة عشرة", "✺"], ["star12", "نجمة اثنا عشر", "✹"], ["seal", "ختم", "✥"], ["emblem", "شعار دائري", "✪"],
    ["triangleDown", "مثلث سفلي", "▼"], ["triangleLeft", "مثلث يسار", "◀"], ["triangleRight", "مثلث يمين", "▶"], ["diamondWide", "معين عريض", "◇"], ["hexTall", "سداسي طويل", "⬡"],
    ["ovalFrame", "إطار بيضاوي", "⬭"], ["pillFrame", "إطار كبسولة", "▱"], ["frame", "إطار", "□"], ["doubleRing", "حلقتان", "◎"], ["dot", "نقطة", "•"],
    ["wave", "موجة", "〰"], ["arcWide", "قوس عريض", "◓"], ["halfCircle", "نصف دائرة", "◐"], ["quarterCircle", "ربع دائرة", "◔"], ["bracket", "قوس مربع", "❯"],
    ["parenthesis", "قوس جانبي", "❨"], ["slash", "خط مائل", "╱"], ["crossThin", "تقاطع رفيع", "✚"], ["plusRound", "زائد دائري", "⊕"], ["pointer", "مؤشر", "➤"],
    ["doubleArrow", "سهم مزدوج", "↔"], ["chevronDouble", "زاويتان", "»"], ["callout", "تعليق", "▱"], ["cloudSmall", "سحابة صغيرة", "☁"], ["heartSmall", "قلب صغير", "♥"],
    ["lightningWide", "برق عريض", "ϟ"], ["capsuleTall", "كبسولة طويلة", "▯"], ["parallelogramTall", "متوازي طويل", "▱"], ["polygon3", "مضلع ثلاثي", "△"], ["polygon4", "مضلع رباعي", "◇"],
    ["polygon5", "مضلع خماسي", "⬟"], ["polygon6", "مضلع سداسي", "⬢"], ["polygon8", "مضلع ثماني", "⯃"], ["burstSmall", "انفجار صغير", "✷"], ["burstLarge", "انفجار كبير", "✹"],
    ["corner", "زاوية", "⌜"], ["bracketRound", "قوس دائري", "◜"], ["badgeStar", "شارة نجمة", "✵"], ["medallion", "ميدالية", "❖"], ["rays", "أشعة", "☼"]
  ];

  const byId = id => items.find(item => item.id === id);
  const selected = () => byId(selectedId);
  const showToast = message => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  };
  const performanceToggle = document.getElementById("performance-mode-toggle");
  const setPerformanceMode = enabled => {
    document.documentElement.classList.toggle("performance-mode", enabled);
    performanceToggle?.setAttribute("aria-pressed", String(enabled));
    try {
      localStorage.setItem("ak-performance-mode", enabled ? "on" : "off");
    } catch (error) {
      console.error("Could not save performance mode preference:", error);
    }
    if (performanceToggle) performanceToggle.textContent = enabled ? "⚡ الأداء الخفيف: مفعّل" : "⚡ أداء خفيف";
  };
  let performanceMode = false;
  try {
    performanceMode = localStorage.getItem("ak-performance-mode") === "on";
  } catch (error) {
    console.error("Could not read performance mode preference:", error);
  }
  setPerformanceMode(performanceMode);
  const studio3dToggle = document.getElementById("studio-3d-toggle");
  let studio3D = false;
  try { studio3D = localStorage.getItem("ak-studio-3d") === "on"; } catch (error) { console.error("Could not read 3D preference:", error); }
  const setStudio3D = enabled => {
    studio3D = Boolean(enabled);
    document.body.classList.toggle("studio-3d", studio3D);
    studio3dToggle?.setAttribute("aria-pressed", String(studio3D));
    if (studio3dToggle) studio3dToggle.innerHTML = `<span aria-hidden="true">◇</span> ${studio3D ? "إيقاف 3D" : "وضع 3D"}`;
    try { localStorage.setItem("ak-studio-3d", studio3D ? "on" : "off"); } catch (error) { console.error("Could not save 3D preference:", error); }
  };
  setStudio3D(studio3D);
  studio3dToggle?.addEventListener("click", () => { setStudio3D(!studio3D); showToast(studio3D ? "تم تفعيل مساحة التصميم ثلاثية الأبعاد." : "تم إيقاف وضع 3D."); });
  const studio3dStage = document.querySelector(".editor-area");
  const resetStudio3DParallax = () => { canvasFrame?.style.setProperty("--depth-x", "0deg"); canvasFrame?.style.setProperty("--depth-y", "0deg"); };
  studio3dStage?.addEventListener("pointermove", event => {
    if (!studio3D || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = studio3dStage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 8;
    canvasFrame?.style.setProperty("--depth-x", `${x.toFixed(2)}deg`);
    canvasFrame?.style.setProperty("--depth-y", `${y.toFixed(2)}deg`);
  });
  studio3dStage?.addEventListener("pointerleave", resetStudio3DParallax);
  performanceToggle?.addEventListener("click", () => {
    performanceMode = !performanceMode;
    setPerformanceMode(performanceMode);
    showToast(performanceMode ? "تم تفعيل وضع الأداء الخفيف." : "تم إيقاف وضع الأداء الخفيف.");
  });
  const splash = document.getElementById("splash-screen");
  const hideSplash = () => {
    if (!splash || splash.dataset.dismissed) return;
    splash.dataset.dismissed = "true";
    splash.classList.add("is-hidden");
    setTimeout(() => splash.remove(), 350);
  };
  const startSplashExit = () => setTimeout(hideSplash, 650);
  if (document.readyState === "complete") startSplashExit();
  else window.addEventListener("load", startSplashExit, { once: true });
  setTimeout(hideSplash, 2000);
  function ensureProLibrary() {
    if (window.AKProLibrary) return Promise.resolve();
    if (proLibraryLoad) return proLibraryLoad;
    proLibraryLoad = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "pro-library.js?v=20261125-1";
      script.onload = () => resolve();
      script.onerror = () => {
        proLibraryLoad = null;
        reject(new Error("Could not load AK Pro library"));
      };
      document.body.append(script);
    });
    return proLibraryLoad;
  }
  if (false) {
  const proPalettes = [
    { name: "ليلكي", background: "#f4efff", accent: "#7557d9", soft: "#e5dcff", ink: "#292143" },
    { name: "مرجاني", background: "#fff1ed", accent: "#e56752", soft: "#ffe0d8", ink: "#492720" },
    { name: "زمردي", background: "#eaf6f0", accent: "#25866c", soft: "#d2eee2", ink: "#17382e" },
    { name: "ذهبي", background: "#fbf3df", accent: "#a8751b", soft: "#f4e3b8", ink: "#3d2c12" },
    { name: "ليلي", background: "#20243a", accent: "#9daeff", soft: "#343b5b", ink: "#f5f6ff" }
  ];
  const extraProPalettes = [
    { name: "لافندر", background: "#eeeaff", accent: "#6653a8", soft: "#d9d2f3", ink: "#29213f" },
    { name: "خوخي", background: "#fff0e5", accent: "#bf6746", soft: "#f5d6c1", ink: "#472c20" },
    { name: "سماوي", background: "#e7f4fb", accent: "#26769b", soft: "#cce8f4", ink: "#183746" },
    { name: "أحمر ملكي", background: "#f8e9eb", accent: "#a83f58", soft: "#edcbd3", ink: "#3e1f29" },
    { name: "أخضر زيتوني", background: "#f0f0df", accent: "#68713b", soft: "#dcdfbd", ink: "#30351c" }
  ];
  const proPhotoIds = [
    "1490481651871-ab68de25d43d", "1515886657613-9f3515b0c78f", "1513364776144-60967b0f800f",
    "1494438639946-1ebd1d20bf85", "1519389950473-47ba0277781c", "1500530855697-b586d89ba3ee",
    "1490730141103-6cac27aaab94", "1500534623283-312aade485b7", "1490750967868-88aa4486c946",
    "1518005020951-eccb494ad742", "1497366754035-f200968a6e72", "1542291026-7eec264c27ff",
    "1556229010-6c3f2c9ca5f8", "1555939594-58d7cb561ad1", "1517248135467-4c7edcad34c4",
    "1550745165-9bc0b252726f", "1529139574466-a303027c1d8b", "1531058020387-3be344556be6",
    "1481627834876-b7833e8f5570", "1517841905240-472988babdf9"
  ];
  const photoUrl = photoId => `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=720&h=900&q=78`;
  const proLayouts = [
    { name: "إطلاق جديد", subtitle: "تفاصيل صغيرة تصنع فرقاً كبيراً", glyph: "✦", category: "launch", photo: 16, shape: "star" },
    { name: "عرض خاص", subtitle: "فرصة مميزة لفترة محدودة", glyph: "%", category: "offers", photo: 11, shape: "burst" },
    { name: "اقتباس ملهم", subtitle: "ابدأ بخطوة، وسيأتي الطريق", glyph: "“", category: "quote", photo: 2, shape: "speech" },
    { name: "موعد فعالية", subtitle: "احفظ التاريخ وكن على الموعد", glyph: "◷", category: "events", photo: 17, shape: "circle" },
    { name: "منتج جديد", subtitle: "صُمّم بعناية، واختير لأجلك", glyph: "◇", category: "offers", photo: 11, shape: "diamond" },
    { name: "قائمة طعام", subtitle: "نكهة تحكي حكاية", glyph: "✿", category: "food", photo: 13, shape: "heart" },
    { name: "هوية علامة", subtitle: "اترك بصمتك أينما كنت", glyph: "AK", category: "launch", photo: 10, shape: "rounded" },
    { name: "إعلان خدمة", subtitle: "حلول ذكية تبدأ من هنا", glyph: "↗", category: "tech", photo: 4, shape: "arrow" },
    { name: "قصة اليوم", subtitle: "لحظتك تستحق أن تُروى", glyph: "◉", category: "quote", photo: 5, shape: "ring" },
    { name: "بطاقة شكر", subtitle: "ممتنون لثقتكم ودعمكم", glyph: "♥", category: "events", photo: 8, shape: "heart" }
  ].map(layout => ({ ...layout, photoUrl: photoUrl(proPhotoIds[layout.photo]) }));
  const extraProLayouts = [
    { name: "رحلة لا تُنسى", subtitle: "اكتشف أماكن تلهمك", glyph: "⌖", category: "travel", photo: 5, shape: "star" },
    { name: "لحظة عناية", subtitle: "لأنك تستحق وقتاً لنفسك", glyph: "✿", category: "beauty", photo: 12, shape: "circle" },
    { name: "فكرة تتعلّم", subtitle: "كل يوم بداية جديدة", glyph: "▤", category: "education", photo: 18, shape: "rectangle" },
    { name: "نبض التقنية", subtitle: "غدٌ أذكى يبدأ اليوم", glyph: "⌘", category: "tech", photo: 15, shape: "hexagon" },
    { name: "صباح القهوة", subtitle: "لحظات هادئة ومذاق جميل", glyph: "☕", category: "food", photo: 3, shape: "circle" },
    { name: "بيت الأحلام", subtitle: "مساحة تشبهك وتلهمك", glyph: "⌂", category: "launch", photo: 9, shape: "rounded" },
    { name: "توازن وعافية", subtitle: "خطوة صغيرة نحو الأفضل", glyph: "✧", category: "wellness", photo: 7, shape: "heart" },
    { name: "مجموعة الموسم", subtitle: "اختيارات صُممت لتلفت النظر", glyph: "◇", category: "beauty", photo: 0, shape: "diamond" },
    { name: "كتاب جديد", subtitle: "حكاية تنتظر أن تكتشفها", glyph: "▣", category: "education", photo: 18, shape: "rectangle" },
    { name: "مساحة عمل", subtitle: "أفكار أكبر، وإنجاز كل يوم", glyph: "↗", category: "tech", photo: 10, shape: "arrow" }
  ];
  const allProPalettes = [...proPalettes, ...extraProPalettes];
  const legacyTemplates = proLayouts.flatMap((layout, layoutIndex) =>
    proPalettes.map((palette, paletteIndex) => ({
      ...layout, palette,
      index: layoutIndex * proPalettes.length + paletteIndex + 1,
      name: `${layout.name} · ${palette.name}`,
      isNew: false
    }))
  );
  const newProTemplates = extraProLayouts.flatMap((layout, layoutIndex) =>
    allProPalettes.map((palette, paletteIndex) => ({
      ...layout, palette,
      index: legacyTemplates.length + layoutIndex * allProPalettes.length + paletteIndex + 1,
      name: `${layout.name} · ${palette.name}`,
      photoUrl: photoUrl(proPhotoIds[layout.photo]),
      isNew: true
    }))
  );
  const proTemplates = [...legacyTemplates, ...newProTemplates];
  const proGrid = document.getElementById("pro-template-grid");
  proTemplates.forEach(template => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pro-template";
    button.style.setProperty("--template-bg", template.palette.background);
    button.style.setProperty("--template-accent", template.palette.accent);
    button.dataset.category = template.category;
    button.dataset.search = `${template.name} ${template.subtitle} ${template.category}`.toLocaleLowerCase("ar");
    button.setAttribute("aria-label", `تطبيق القالب ${template.name}`);
    const preview = document.createElement("span");
    preview.className = "pro-template-preview";
    const image = document.createElement("img");
    image.src = template.photoUrl;
    image.alt = `صورة معاينة لتصميم ${template.name}`;
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.addEventListener("error", () => preview.classList.add("photo-unavailable"), { once: true });
    const badge = document.createElement("span");
    badge.className = "pro-template-badge";
    badge.textContent = template.isNew ? "جديد" : "قالب";
    const glyph = document.createElement("span");
    glyph.className = "pro-template-glyph";
    glyph.textContent = template.glyph;
    preview.append(image, badge, glyph);
    const title = document.createElement("strong");
    title.textContent = template.name;
    const number = document.createElement("small");
    number.textContent = `${String(template.index).padStart(3, "0")} · ${template.subtitle}`;
    button.append(preview, title, number);
    button.addEventListener("click", async () => {
      if (!proUnlocked) {
        document.getElementById("pro-login-error").hidden = true;
        proLogin.showModal();
        proPassword.focus();
        return;
      }
      button.disabled = true;
      button.classList.add("loading");
      try {
        await applyProTemplate(template);
      } finally {
        button.disabled = false;
        button.classList.remove("loading");
      }
    });
    proGrid.append(button);
  });
  const proSearch = document.getElementById("pro-template-search");
  const proCategory = document.getElementById("pro-category-filter");
  const proResultCount = document.getElementById("pro-result-count");
  const proEmptyResults = document.getElementById("pro-empty-results");
  function filterProTemplates() {
    const query = proSearch.value.trim().toLocaleLowerCase("ar");
    const category = proCategory.value;
    let visible = 0;
    proGrid.querySelectorAll(".pro-template").forEach(card => {
      const matches = (!query || card.dataset.search.includes(query)) &&
        (category === "all" || card.dataset.category === category);
      card.hidden = !matches;
      if (matches) visible++;
    });
    proResultCount.textContent = `${visible} من ${proTemplates.length} تصميم`;
    proEmptyResults.hidden = visible > 0;
  }
  proSearch.addEventListener("input", filterProTemplates);
  proCategory.addEventListener("change", filterProTemplates);
  filterProTemplates();
  let proUnlocked = true;
  const proLibrary = document.getElementById("pro-library");
  async function openProLibrary() {
    try {
      await ensureProLibrary();
      proLibrary.showModal();
    } catch (error) {
      console.error("Could not open AK Pro library:", error);
      showToast("تعذر تحميل مكتبة AK Pro. تحقق من ملفات الموقع ثم أعد المحاولة.");
    }
  }
  document.getElementById("pro-entry-btn").addEventListener("click", () => {
    openProLibrary();
  });
  document.querySelectorAll("[data-close-dialog]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close());
  });
  proLibrary.addEventListener("click", event => {
    if (event.target === proLibrary) proLibrary.close();
  });
  async function applyProTemplate(template) {
    if (items.length && !window.confirm("سيستبدل القالب التصميم الحالي. هل تريد المتابعة؟")) return;
    showToast("جاري تجهيز التصميم والصورة...");
    let photo;
    let photoObjectUrl;
    try {
      const response = await fetch(template.photoUrl, { mode: "cors" });
      if (!response.ok) throw new Error(`Image request failed with status ${response.status}`);
      photoObjectUrl = URL.createObjectURL(await response.blob());
      const sourceImage = new Image();
      await new Promise((resolve, reject) => {
        sourceImage.onload = resolve;
        sourceImage.onerror = () => reject(new Error("Could not decode template image"));
        sourceImage.src = photoObjectUrl;
      });
      const src = compactImageData(sourceImage, 1800);
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Could not prepare template image"));
        image.src = src;
      });
      photo = { image, src, id: nextBackgroundImageId++ };
    } catch (error) {
      console.error("Could not prepare pro template image:", error);
      showToast("تعذر تحميل صورة التصميم. تحقّق من الاتصال بالإنترنت؛ لم يتغير تصميمك.");
      return;
    } finally {
      if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
    }
    const width = canvas.width, height = canvas.height, palette = template.palette;
    const makeShape = (shape, name, x, y, w, h, color, opacity = 100) => ({
      id: nextId++, type: "shape", shape, name,
      x: Math.round(width * x), y: Math.round(height * y),
      w: Math.round(width * w), h: Math.round(height * h),
      color, opacity
    });
    const makeText = (name, text, x, y, w, color, fontSize, weight = "700") => ({
      id: nextId++, type: "text", name, text,
      x: Math.round(width * x), y: Math.round(height * y),
      w: Math.round(width * w), h: Math.round(height * .14),
      color, fontSize: Math.round(width * fontSize), weight
    });
    background = palette.background;
    backgroundSources.set(photo.id, photo.src);
    backgroundImage = photo;
    items = [
      makeShape("rectangle", "طبقة تظليل الصورة", 0, 0, 1, 1, "#171525", 25),
      makeShape("rounded", "لوحة العنوان", .07, .53, .86, .38, palette.background, 93),
      makeShape("rectangle", "خط إبراز", .12, .63, .18, .012, palette.accent),
      makeShape(template.shape || "star", "زخرفة القالب", .78, .12, .12, .12, palette.soft, 90)
    ];
    items.push(
      makeText("عنوان التصميم", template.name.split(" · ")[0], .12, .68, .76, palette.ink, .064),
      makeText("وصف التصميم", template.subtitle, .12, .78, .76, palette.accent, .032, "500"),
      makeText("علامة القالب", template.glyph, .12, .575, .18, palette.accent, .07)
    );
    selectedId = null;
    bgInput.value = palette.background;
    document.getElementById("bg-hex").textContent = palette.background.toUpperCase();
    draw();
    renderLayers();
    renderProperties();
    remember();
    setStatus("تعديلات غير محفوظة");
    proLibrary.close();
    showToast(`تم تطبيق القالب: ${template.name}`);
  }
  }
  const proLibrary = document.getElementById("pro-library");
  async function openProLibrary() {
    try {
      await ensureProLibrary();
      proLibrary.showModal();
    } catch (error) {
      console.error("Could not open AK Pro library:", error);
      showToast("تعذر تحميل مكتبة AK Pro. تحقق من ملفات الموقع ثم أعد المحاولة.");
    }
  }
  document.getElementById("pro-entry-btn").addEventListener("click", () => {
    openProLibrary();
  });
  document.querySelectorAll("[data-close-dialog]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.closeDialog).close());
  });
  proLibrary.addEventListener("click", event => {
    if (event.target === proLibrary) proLibrary.close();
  });
  document.addEventListener("ak-pro-apply", event => {
    const template = event.detail;
    if (!template || !window.AKProLibrary.templates.some(entry => entry.id === template.id)) {
      showToast("تعذر العثور على التصميم المحدد.");
      return;
    }
    if (items.length && !window.confirm("سيستبدل القالب التصميم الحالي. هل تريد المتابعة؟")) return;
    const library = window.AKProLibrary;
    if (template.kind === "social") setCanvasSize(`${template.width}x${template.height}`, false);
    let width = canvas.width, height = canvas.height;
    items = library.buildElements(template, width, height).map(element => ({
      ...element,
      id: nextId++,
      opacity: Number.isFinite(element.opacity) ? element.opacity : 100
    }));
    background = template.palette.background;
    backgroundImage = null;
    selectedId = null;
    bgInput.value = background;
    document.getElementById("bg-hex").textContent = background.toUpperCase();
    document.getElementById("pro-preview-dialog").close();
    proLibrary.close();
    draw(); renderLayers(); renderProperties(); remember();
    setStatus("تعديلات غير محفوظة");
    showToast(`تم تطبيق ${template.kind === "logo" ? "الشعار" : "الإعلان"} بطبقاته القابلة للتحرير.`);
  });
  const snapshot = () => JSON.stringify({ width: canvas.width, height: canvas.height, background, backgroundImageId: backgroundImage?.id || null, items: items.map(({ image, previewCanvas, src, ...item }) => item) });
  const remember = () => {
    const state = snapshot();
    if (history[historyIndex] === state) return;
    history = history.slice(0, historyIndex + 1);
    history.push(state);
    if (history.length > 50) history.shift();
    historyIndex = history.length - 1;
    updateHistoryButtons();
  };
  const updateHistoryButtons = () => {
    document.getElementById("undo-btn").disabled = historyIndex <= 0;
    document.getElementById("redo-btn").disabled = historyIndex >= history.length - 1;
  };
  const setStatus = text => {
    statusEl.textContent = text;
    if (text === "تعديلات غير محفوظة") scheduleAutoSave();
  };

  function updateSelectionToolbar() {
    const toolbar = document.getElementById("selection-toolbar");
    const editTextButton = document.getElementById("selection-edit-text");
    const item = selected();
    if (!item) {
      toolbar.hidden = true;
      return;
    }
    editTextButton.hidden = item.type !== "text";
    const scaleX = canvas.clientWidth / canvas.width;
    const scaleY = canvas.clientHeight / canvas.height;
    const top = item.y * scaleY;
    toolbar.style.left = `${(item.x + item.w / 2) * scaleX}px`;
    toolbar.style.top = `${Math.max(4, top - 4)}px`;
    toolbar.classList.toggle("below-selection", top < 40);
    toolbar.hidden = false;
  }

  function compactImageData(image, maxDimension = 2400) {
    const scale = Math.min(1, maxDimension / image.width, maxDimension / image.height);
    const compact = document.createElement("canvas");
    compact.width = Math.max(1, Math.round(image.width * scale));
    compact.height = Math.max(1, Math.round(image.height * scale));
    compact.getContext("2d").drawImage(image, 0, 0, compact.width, compact.height);
    return compact.toDataURL("image/webp", .9);
  }

  function drawShape(target, item) {
    const { x, y, w, h } = item;
    const rawKind = item.shape || "rectangle";
    const aliases = {
      badgeCircle: "circle", badgeHex: "hexagon", ticket: "rounded", tag: "parallelogram", ribbon: "capsule",
      droplet: "heart", leaf: "ellipse", sun: "burst", gear: "star8", flower: "star6", star4: "star", star10: "star8", star12: "burst", seal: "octagon", emblem: "circle",
      triangleDown: "downArrow", triangleLeft: "leftArrow", triangleRight: "arrow", diamondWide: "diamond", hexTall: "hexagon",
      ovalFrame: "ellipse", pillFrame: "capsule", frame: "rectangle", doubleRing: "ring", dot: "circle",
      wave: "arc", arcWide: "arc", halfCircle: "arc", quarterCircle: "arc", bracket: "chevron", parenthesis: "arc", slash: "line", crossThin: "cross", plusRound: "plus", pointer: "arrow",
      doubleArrow: "arrow", chevronDouble: "chevron", callout: "speech", cloudSmall: "cloud", heartSmall: "heart",
      lightningWide: "lightning", capsuleTall: "capsule", parallelogramTall: "parallelogram", polygon3: "triangle", polygon4: "diamond", polygon5: "pentagon", polygon6: "hexagon", polygon8: "octagon",
      burstSmall: "burst", burstLarge: "burst", corner: "line", bracketRound: "arc", badgeStar: "star", medallion: "diamond", rays: "burst"
    };
    const kind = aliases[rawKind] || rawKind;
    target.fillStyle = item.color;
    target.strokeStyle = item.strokeColor || item.color;
    target.lineWidth = Number(item.strokeWidth) || 0;
    const paint = () => {
      if (item.fillMode !== "outline" && kind !== "line" && kind !== "arc" && kind !== "flag") target.fill();
      if (item.fillMode === "outline" || item.strokeWidth > 0 || kind === "line" || kind === "arc" || kind === "flag") {
        target.lineWidth = Math.max(Number(item.strokeWidth) || 0, kind === "line" || kind === "arc" || kind === "flag" ? 5 : 1);
        target.lineJoin = "round";
        target.stroke();
      }
    };
    target.beginPath();
    const polygon = (points, close = true) => {
      target.moveTo(x + points[0][0] * w, y + points[0][1] * h);
      points.slice(1).forEach(([px, py]) => target.lineTo(x + px * w, y + py * h));
      if (close) target.closePath();
    };
    const regular = (count, inner = null, rotation = -Math.PI / 2) => {
      const points = [];
      const steps = inner ? count * 2 : count;
      for (let index = 0; index < steps; index++) {
        const radius = inner && index % 2 ? inner : 0.48;
        const angle = rotation + Math.PI * 2 * index / steps;
        points.push([.5 + Math.cos(angle) * radius, .5 + Math.sin(angle) * radius]);
      }
      polygon(points);
    };
    const arrows = {
      arrow: [[0,.36],[.66,.36],[.66,.15],[1,.5],[.66,.85],[.66,.64],[0,.64]],
      leftArrow: [[1,.36],[.34,.36],[.34,.15],[0,.5],[.34,.85],[.34,.64],[1,.64]],
      upArrow: [[.36,1],[.36,.34],[.15,.34],[.5,0],[.85,.34],[.64,.34],[.64,1]],
      downArrow: [[.36,0],[.64,0],[.64,.66],[.85,.66],[.5,1],[.15,.66],[.36,.66]],
      chevron: [[0,0],[.48,0],[1,.5],[.48,1],[0,1],[.52,.5]]
    };
    if (kind === "circle" || kind === "ellipse" || kind === "ring" || kind === "arc") {
      target.ellipse(x + w / 2, y + h / 2, w * .48, h * .48, 0, 0, Math.PI * 2);
      if (kind === "ring") {
        target.ellipse(x + w / 2, y + h / 2, w * .27, h * .27, 0, 0, Math.PI * 2);
        if (item.fillMode === "outline") target.stroke();
        else target.fill("evenodd");
      } else paint();
      return;
    }
    if (kind === "rounded" || kind === "capsule") {
      target.roundRect(x, y, w, h, kind === "capsule" ? Math.min(w, h) / 2 : Math.min(w, h) * .14);
    } else if (kind === "triangle") polygon([[.5,0],[1,1],[0,1]]);
    else if (kind === "rightTriangle") polygon([[0,0],[0,1],[1,1]]);
    else if (kind === "diamond") polygon([[.5,0],[1,.5],[.5,1],[0,.5]]);
    else if (kind === "pentagon" || kind === "shield") polygon(kind === "shield" ? [[.08,0],[.92,0],[.88,.6],[.5,1],[.12,.6]] : (() => { const points=[]; for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5;points.push([.5+Math.cos(a)*.48,.5+Math.sin(a)*.48]);}return points; })());
    else if (kind === "hexagon") regular(6);
    else if (kind === "heptagon") regular(7);
    else if (kind === "octagon") regular(8);
    else if (kind === "star") regular(5,.22);
    else if (kind === "star6") regular(6,.25);
    else if (kind === "star8" || kind === "burst") regular(kind === "burst" ? 16 : 8, kind === "burst" ? .34 : .25);
    else if (kind === "heart") { target.moveTo(x+w*.5,y+h*.94); target.bezierCurveTo(x+w*.35,y+h*.8,x,y+h*.56,x+w*.04,y+h*.3); target.bezierCurveTo(x+w*.1,y-h*.02,x+w*.42,y+h*.03,x+w*.5,y+h*.27); target.bezierCurveTo(x+w*.61,y-h*.01,x+w*.92,y+h*.03,x+w*.97,y+h*.3); target.bezierCurveTo(x+w,y+h*.56,x+w*.65,y+h*.83,x+w*.5,y+h*.94); }
    else if (kind === "plus" || kind === "cross") polygon(kind === "plus" ? [[.38,0],[.62,0],[.62,.38],[1,.38],[1,.62],[.62,.62],[.62,1],[.38,1],[.38,.62],[0,.62],[0,.38],[.38,.38]] : [[.34,0],[.66,0],[.66,.34],[1,.34],[1,.66],[.66,.66],[.66,1],[.34,1],[.34,.66],[0,.66],[0,.34],[.34,.34]]);
    else if (arrows[kind]) polygon(arrows[kind]);
    else if (kind === "trapezoid") polygon([[.2,0],[.8,0],[1,1],[0,1]]);
    else if (kind === "parallelogram") polygon([[.25,0],[1,0],[.75,1],[0,1]]);
    else if (kind === "cylinder") { target.ellipse(x+w/2,y+h*.16,w*.48,h*.16,0,0,Math.PI*2); target.lineTo(x+w*.98,y+h*.82); target.ellipse(x+w/2,y+h*.82,w*.48,h*.16,0,0,Math.PI); target.closePath(); }
    else if (kind === "cloud") { target.moveTo(x+w*.16,y+h*.78); target.bezierCurveTo(x-w*.02,y+h*.75,x+w*.02,y+h*.45,x+w*.23,y+h*.43); target.bezierCurveTo(x+w*.24,y+h*.12,x+w*.62,y+h*.08,x+w*.72,y+h*.39); target.bezierCurveTo(x+w*1.04,y+h*.33,x+w*1.05,y+h*.79,x+w*.81,y+h*.8); target.closePath(); }
    else if (kind === "speech") { target.roundRect(x+w*.04,y+h*.04,w*.92,h*.72,Math.min(w,h)*.08); target.moveTo(x+w*.25,y+h*.74); target.lineTo(x+w*.2,y+h); target.lineTo(x+w*.48,y+h*.74); target.closePath(); }
    else if (kind === "lightning") polygon([[.57,0],[.14,.57],[.43,.57],[.3,1],[.85,.38],[.56,.38]]);
    else if (kind === "moon") { target.arc(x+w*.57,y+h*.5,Math.min(w,h)*.47,-Math.PI*.73,Math.PI*.73); target.arc(x+w*.77,y+h*.36,Math.min(w,h)*.39,Math.PI*.7,-Math.PI*.7,true); target.closePath(); }
    else if (kind === "flag") { target.moveTo(x+w*.2,y+h); target.lineTo(x+w*.2,y); target.lineTo(x+w*.88,y+h*.12); target.lineTo(x+w*.2,y+h*.42); }
    else if (kind === "line") polygon([[0,1],[1,0]], false);
    else if (kind === "cube") { polygon([[.5,0],[.95,.25],[.95,.75],[.5,1],[.05,.75],[.05,.25]]); }
    else polygon([[0,0],[1,0],[1,1],[0,1]]);
    target.lineCap = "round";
    paint();
  }

  function drawBackground(target) {
    target.fillStyle = background;
    target.fillRect(0, 0, canvas.width, canvas.height);
    const image = backgroundImage?.image;
    if (image?.complete && image.naturalWidth > 0) {
      const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
      const width = image.width * scale, height = image.height * scale;
      target.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    }
  }

  function drawImageInBox(target, source, item) {
    if (item.fit !== "cover") {
      target.drawImage(source, item.x, item.y, item.w, item.h);
      return;
    }
    const sourceWidth = source.width || source.videoWidth;
    const sourceHeight = source.height || source.videoHeight;
    if (!sourceWidth || !sourceHeight || !item.w || !item.h) return;
    const scale = Math.max(item.w / sourceWidth, item.h / sourceHeight);
    const cropWidth = item.w / scale;
    const cropHeight = item.h / scale;
    const cropX = (sourceWidth - cropWidth) / 2;
    const cropY = (sourceHeight - cropHeight) / 2;
    target.drawImage(source, cropX, cropY, cropWidth, cropHeight, item.x, item.y, item.w, item.h);
  }

  function imageFilter(item) {
    const adjustment = item.adjustments || {};
    const toneFilters = { natural: "", vivid: "saturate(1.25)", warm: "sepia(.25)", cool: "hue-rotate(15deg) saturate(1.1)", mono: "grayscale(1)", vintage: "sepia(.55) contrast(1.08)", rose: "hue-rotate(325deg) saturate(1.2)", mint: "hue-rotate(95deg) saturate(1.12)" };
    const brightness = 100 + (Number(adjustment.brightness) || 0) + (Number(adjustment.shadows) || 0) * .18;
    const contrast = 100 + (Number(adjustment.contrast) || 0);
    const saturation = Number(adjustment.saturation) || 100;
    const temperature = Number(adjustment.temperature) || 0;
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${Math.abs(temperature) * .002}) ${temperature < 0 ? "hue-rotate(185deg)" : ""} ${toneFilters[adjustment.tone] || ""}`;
  }

  function hexToHsl(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
    if (!match) return null;
    const [red, green, blue] = match.slice(1).map(value => parseInt(value, 16) / 255);
    return rgbToHsl(red, green, blue);
  }

  function rgbToHsl(red, green, blue) {
    const max = Math.max(red, green, blue), min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;
    let hue = 0, saturation = 0;
    if (max !== min) {
      const difference = max - min;
      saturation = lightness > .5 ? difference / (2 - max - min) : difference / (max + min);
      if (max === red) hue = (green - blue) / difference + (green < blue ? 6 : 0);
      else if (max === green) hue = (blue - red) / difference + 2;
      else hue = (red - green) / difference + 4;
      hue *= 60;
    }
    return { hue, saturation, lightness };
  }

  function hslToRgb(hue, saturation, lightness) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const section = hue / 60;
    const secondary = chroma * (1 - Math.abs(section % 2 - 1));
    let red = 0, green = 0, blue = 0;
    if (section < 1) [red, green] = [chroma, secondary];
    else if (section < 2) [red, green] = [secondary, chroma];
    else if (section < 3) [green, blue] = [chroma, secondary];
    else if (section < 4) [green, blue] = [secondary, chroma];
    else if (section < 5) [red, blue] = [secondary, chroma];
    else [red, blue] = [chroma, secondary];
    const offset = lightness - chroma / 2;
    return [(red + offset) * 255, (green + offset) * 255, (blue + offset) * 255];
  }

  function buildImagePreview(item, maxDimension = 1800) {
    if (!item.image || !item.image.complete) return;
    const scale = Math.min(1, maxDimension / item.image.width, maxDimension / item.image.height);
    const preview = document.createElement("canvas");
    preview.width = Math.max(1, Math.round(item.image.width * scale));
    preview.height = Math.max(1, Math.round(item.image.height * scale));
    const previewCtx = preview.getContext("2d", { willReadFrequently: true });
    previewCtx.filter = imageFilter(item);
    previewCtx.drawImage(item.image, 0, 0, preview.width, preview.height);
    const temperature = Number(item.adjustments?.temperature) || 0;
    const shadows = Number(item.adjustments?.shadows) || 0;
    const harmonyStrength = Math.max(0, Math.min(100, Number(item.adjustments?.harmonyStrength) || 0)) / 100 * .65;
    const targetColor = harmonyStrength ? hexToHsl(item.adjustments?.harmonyColor) : null;
    if (temperature || shadows || targetColor) {
      try {
        const pixels = previewCtx.getImageData(0, 0, preview.width, preview.height);
        const data = pixels.data;
        for (let index = 0; index < data.length; index += 4) {
          const light = (data[index] * .2126 + data[index + 1] * .7152 + data[index + 2] * .0722) / 255;
          const lift = shadows * .75 * (1 - light) * (1 - light);
          data[index] = Math.min(255, Math.max(0, data[index] + temperature * .42 + lift));
          data[index + 1] = Math.min(255, Math.max(0, data[index + 1] + temperature * .08 + lift));
          data[index + 2] = Math.min(255, Math.max(0, data[index + 2] - temperature * .42 + lift));
          if (targetColor) {
            const current = rgbToHsl(data[index] / 255, data[index + 1] / 255, data[index + 2] / 255);
            const hueDelta = ((targetColor.hue - current.hue + 540) % 360) - 180;
            const hue = (current.hue + hueDelta * harmonyStrength + 360) % 360;
            const saturation = current.saturation * (1 - harmonyStrength) + targetColor.saturation * harmonyStrength;
            const [red, green, blue] = hslToRgb(hue, saturation, current.lightness);
            data[index] = red; data[index + 1] = green; data[index + 2] = blue;
          }
        }
        previewCtx.putImageData(pixels, 0, 0);
      } catch (error) {
        console.error("Could not apply image tone adjustments:", error);
        showToast("تعذر تطبيق تحسينات الألوان على هذه الصورة.");
      }
    }
    item.previewCanvas = preview;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvasEmptyState = document.getElementById("canvas-empty-state");
    if (canvasEmptyState) canvasEmptyState.hidden = items.length > 0;
    drawBackground(ctx);
    for (const item of items) {
      ctx.save();
      const opacity = Number(item.opacity);
      ctx.globalAlpha = Number.isFinite(opacity) ? opacity / 100 : 1;
      ctx.translate(item.x + item.w / 2, item.y + item.h / 2);
      ctx.rotate((Number(item.rotation) || 0) * Math.PI / 180);
      ctx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1);
      ctx.translate(-item.w / 2, -item.h / 2);
      ctx.shadowColor = item.shadow ? "rgba(0,0,0,.3)" : "transparent";
      ctx.shadowBlur = item.shadow ? Math.max(0, Number(item.shadowBlur) || 12) : 0;
      ctx.shadowOffsetX = item.shadow ? 0 : 0;
      ctx.shadowOffsetY = item.shadow ? Math.max(2, (Number(item.shadowBlur) || 12) * .35) : 0;
      const localItem = { ...item, x: 0, y: 0 };
      if (item.type === "shape") {
        drawShape(ctx, localItem);
      } else if (item.type === "text") {
        const fontFamily = item.fontFamily || "Tahoma";
        const fontPrefix = `${item.italic ? "italic " : ""}${item.weight === "700" ? "700" : "400"}`;
        ctx.font = `${fontPrefix} ${item.fontSize}px "${fontFamily}", Tahoma, Arial, sans-serif`;
        if ("letterSpacing" in ctx) ctx.letterSpacing = `${Number(item.letterSpacing) || 0}px`;
        ctx.textBaseline = "top";
        ctx.direction = "rtl";
        ctx.textAlign = item.align || "right";
        const textX = item.align === "center" ? item.w / 2 : item.align === "left" ? 0 : item.w;
        const lines = String(item.text).split("\n");
        const lineHeight = (Number(item.lineHeight) || 1.35) * item.fontSize;
        const fill = item.textGradient ? ctx.createLinearGradient(0, 0, item.w, 0) : null;
        if (fill) { fill.addColorStop(0, item.color || "#18243b"); fill.addColorStop(1, item.textGradient); }
        ctx.fillStyle = fill || item.color;
        lines.forEach((line, index) => {
          const y = index * lineHeight;
          if (item.textOutline) { ctx.strokeStyle = item.textOutline; ctx.lineWidth = Math.max(1, Number(item.textOutlineWidth) || 4); ctx.lineJoin = "round"; ctx.strokeText(line, textX, y, item.w); }
          ctx.fillText(line, textX, y, item.w);
        });
      } else if (item.type === "image" && item.image && item.image.complete) {
        ctx.filter = item.previewCanvas ? "none" : imageFilter(item);
        drawImageInBox(ctx, item.previewCanvas || item.image, localItem);
      }
      if (item.id === selectedId) {
        ctx.strokeStyle = "#477cff";
        ctx.lineWidth = Math.max(2, canvas.width / 540);
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(0, 0, item.w, item.h);
        ctx.setLineDash([]);
        ctx.fillStyle = "#477cff";
        ctx.fillRect(item.w - 6, item.h - 6, 12, 12);
      }
      ctx.restore();
    }
    if (guidesVisible) {
      ctx.save();
      ctx.strokeStyle = "rgba(71,124,255,.55)";
      ctx.lineWidth = Math.max(1, canvas.width / 1800);
      ctx.setLineDash([10, 9]);
      ctx.beginPath();
      [1 / 3, 1 / 2, 2 / 3].forEach(position => {
        ctx.moveTo(canvas.width * position, 0); ctx.lineTo(canvas.width * position, canvas.height);
        ctx.moveTo(0, canvas.height * position); ctx.lineTo(canvas.width, canvas.height * position);
      });
      ctx.stroke(); ctx.restore();
    }
    updateSelectionToolbar();
  }
  function requestDraw() {
    if (drawFrame) return;
    drawFrame = requestAnimationFrame(() => {
      drawFrame = 0;
      draw();
    });
  }

  function renderLayers() {
    document.getElementById("layer-count").textContent = String(items.length);
    if (!items.length) {
      layersEl.innerHTML = '<p class="empty-layers">أضف عنصراً ليظهر هنا</p>';
      return;
    }
    layersEl.replaceChildren();
    [...items].reverse().forEach(item => {
      const row = document.createElement("div");
      row.className = `layer-item${item.id === selectedId ? " active" : ""}`;
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", `تحديد ${item.name}`);
      const icon = document.createElement("span");
      icon.className = "layer-type";
      icon.textContent = item.type === "text" ? "T" : item.type === "image" ? "▧" : item.type === "shape" ? (shapeCatalog.find(shape => shape[0] === item.shape)?.[2] || "◆") : "▰";
      const name = document.createElement("span");
      name.className = "layer-name";
      name.textContent = item.name;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "layer-delete";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `حذف ${item.name}`);
      remove.addEventListener("click", event => { event.stopPropagation(); deleteItem(item.id); });
      row.addEventListener("click", () => selectItem(item.id));
      row.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") selectItem(item.id); });
      row.append(icon, name, remove);
      layersEl.append(row);
    });
  }

  function addField(labelText, control, parent) {
    const field = document.createElement("div");
    field.className = "field";
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = control.id;
    field.append(label, control);
    parent.append(field);
    return field;
  }

  function renderProperties() {
    propertyContent.replaceChildren();
    const item = selected();
    if (!item) {
      const empty = document.createElement("div");
      empty.className = "selection-empty";
      empty.innerHTML = '<div class="empty-icon">✳</div><h3>اختر عنصراً</h3><p>اضغط على أي عنصر في اللوحة لعرض خصائصه وتعديلها</p>';
      const shortcut = document.createElement("div");
      shortcut.className = "shortcut-card";
      shortcut.innerHTML = '<span class="shortcut-icon">⌘</span><span>تلميح سريع</span><p>يمكنك سحب العناصر بحرية داخل مساحة العمل</p>';
      propertyContent.append(empty, shortcut);
      return;
    }
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "item-name";
    nameInput.value = item.name;
    nameInput.maxLength = 60;
    nameInput.addEventListener("input", () => { item.name = nameInput.value; renderLayers(); setStatus("تعديلات غير محفوظة"); });
    nameInput.addEventListener("change", remember);
    addField("اسم الطبقة", nameInput, propertyContent);

    if (item.type === "text") {
      const textInput = document.createElement("textarea");
      textInput.id = "item-text";
      textInput.value = item.text;
      textInput.rows = 3;
      textInput.maxLength = 500;
      textInput.addEventListener("input", () => {
        item.text = textInput.value;
        ctx.font = `${item.weight} ${item.fontSize}px Tahoma, Arial, sans-serif`;
        item.w = Math.max(70, Math.min(canvas.width - item.x, ctx.measureText(item.text.split("\n").sort((a, b) => b.length - a.length)[0] || "نص").width + 8));
        item.h = Math.max(45, item.text.split("\n").length * item.fontSize * 1.35);
        draw();
        setStatus("تعديلات غير محفوظة");
      });
      textInput.addEventListener("change", remember);
      addField("النص", textInput, propertyContent);
      const fontSize = document.createElement("input");
      fontSize.type = "range";
      fontSize.id = "item-size";
      fontSize.min = "16";
      fontSize.max = String(Math.max(100, Math.min(220, Math.round(canvas.width / 3))));
      fontSize.value = String(item.fontSize);
      fontSize.addEventListener("input", () => {
        item.fontSize = Number(fontSize.value);
        item.h = Math.max(45, item.text.split("\n").length * item.fontSize * 1.35);
        ctx.font = `${item.weight} ${item.fontSize}px Tahoma, Arial, sans-serif`;
        item.w = Math.max(70, Math.min(canvas.width - item.x, ctx.measureText(item.text.split("\n").sort((a, b) => b.length - a.length)[0] || "نص").width + 8));
        requestDraw();
      });
      fontSize.addEventListener("change", remember);
      const sizeField = addField("حجم الخط", fontSize, propertyContent);
      const sizeLabel = document.createElement("span");
      sizeLabel.className = "property-note";
      sizeLabel.textContent = `${item.fontSize}px`;
      fontSize.addEventListener("input", () => { sizeLabel.textContent = `${item.fontSize}px`; });
      sizeField.append(sizeLabel);
    }

    if (item.type === "image") {
      item.adjustments = { brightness: 0, contrast: 0, temperature: 0, shadows: 0, saturation: 100, tone: "natural", harmonyColor: background, harmonyStrength: 0, ...item.adjustments };
      const settings = document.createElement("details");
      settings.className = "image-adjustments";
      const summary = document.createElement("summary");
      summary.textContent = "⚙ تحسين الصورة وضبط الألوان";
      const adjustmentBody = document.createElement("div");
      adjustmentBody.className = "image-adjustment-body";
      settings.append(summary, adjustmentBody);
      const autoButton = document.createElement("button");
      autoButton.type = "button";
      autoButton.className = "button button-primary auto-enhance";
      autoButton.textContent = "✦ تحسين تلقائي للصورة";
      autoButton.addEventListener("click", () => {
        const probe = document.createElement("canvas");
        probe.width = 64; probe.height = 64;
        const probeCtx = probe.getContext("2d", { willReadFrequently: true });
        probeCtx.drawImage(item.image, 0, 0, 64, 64);
        const pixels = probeCtx.getImageData(0, 0, 64, 64).data;
        let total = 0, min = 255, max = 0;
        for (let index = 0; index < pixels.length; index += 16) {
          const light = pixels[index] * .2126 + pixels[index + 1] * .7152 + pixels[index + 2] * .0722;
          total += light; min = Math.min(min, light); max = Math.max(max, light);
        }
        const average = total / (pixels.length / 16);
        const range = max - min;
        item.adjustments = { ...item.adjustments, brightness: Math.round(Math.max(-12, Math.min(12, (128 - average) * .14))), contrast: Math.round(Math.max(-5, Math.min(24, (180 - range) * .12))), saturation: 115, temperature: 0, shadows: 20, tone: "natural" };
        buildImagePreview(item); renderProperties(); draw(); remember(); setStatus("تعديلات غير محفوظة");
      });
      adjustmentBody.append(autoButton);
      const harmonyCard = document.createElement("div");
      harmonyCard.className = "image-harmony-card";
      const harmonyTitle = document.createElement("strong");
      harmonyTitle.textContent = "مواءمة ذكية مع ألوان التصميم";
      const harmonyNote = document.createElement("p");
      harmonyNote.textContent = "غيّر طابع الصورة مع الحفاظ على تفاصيل الإضاءة والظلال.";
      const harmonyColor = document.createElement("input");
      harmonyColor.type = "color";
      harmonyColor.id = "image-harmony-color";
      harmonyColor.value = item.adjustments.harmonyColor || background;
      const harmonyColorField = addField("اللون المستهدف", harmonyColor, harmonyCard);
      harmonyColorField.classList.add("harmony-color-field");
      const harmonyActions = document.createElement("div");
      harmonyActions.className = "property-actions";
      const harmonyMatchButton = document.createElement("button");
      harmonyMatchButton.type = "button";
      harmonyMatchButton.className = "property-action";
      harmonyMatchButton.textContent = "استخدم لون الخلفية";
      const harmonyResetButton = document.createElement("button");
      harmonyResetButton.type = "button";
      harmonyResetButton.className = "property-action";
      harmonyResetButton.textContent = "إعادة الألوان";
      const refreshHarmony = (fullQuality = false) => {
        item.previewCanvas = null;
        if (item.adjustments.harmonyStrength) {
          if (fullQuality) buildImagePreview(item);
          else buildImagePreview(item, 1100);
        }
        draw();
        setStatus("تعديلات غير محفوظة");
      };
      harmonyColor.addEventListener("input", () => {
        item.adjustments.harmonyColor = harmonyColor.value;
        refreshHarmony();
      });
      harmonyColor.addEventListener("change", () => { refreshHarmony(true); remember(); });
      harmonyMatchButton.addEventListener("click", () => {
        harmonyColor.value = background;
        item.adjustments.harmonyColor = background;
        if (!item.adjustments.harmonyStrength) item.adjustments.harmonyStrength = 48;
        harmonyStrength.value = String(item.adjustments.harmonyStrength);
        harmonyStrengthLabel.textContent = `${harmonyStrength.value}%`;
        refreshHarmony(true); remember();
      });
      harmonyResetButton.addEventListener("click", () => {
        item.adjustments.harmonyStrength = 0;
        harmonyStrength.value = "0";
        harmonyStrengthLabel.textContent = "0%";
        refreshHarmony(true); remember();
      });
      harmonyActions.append(harmonyMatchButton, harmonyResetButton);
      harmonyCard.append(harmonyTitle, harmonyNote, harmonyActions);
      const harmonyStrength = document.createElement("input");
      harmonyStrength.type = "range";
      harmonyStrength.id = "image-harmony-strength";
      harmonyStrength.min = "0";
      harmonyStrength.max = "100";
      harmonyStrength.value = String(item.adjustments.harmonyStrength || 0);
      const harmonyStrengthField = addField("قوة المواءمة", harmonyStrength, harmonyCard);
      const harmonyStrengthLabel = document.createElement("span");
      harmonyStrengthLabel.className = "property-note";
      harmonyStrengthLabel.textContent = `${harmonyStrength.value}%`;
      harmonyStrengthField.append(harmonyStrengthLabel);
      harmonyStrength.addEventListener("input", () => {
        item.adjustments.harmonyStrength = Number(harmonyStrength.value);
        harmonyStrengthLabel.textContent = `${harmonyStrength.value}%`;
        refreshHarmony();
      });
      harmonyStrength.addEventListener("change", () => { refreshHarmony(true); remember(); });
      adjustmentBody.append(harmonyCard);
      const tones = [["natural","طبيعي"],["vivid","حيوي"],["warm","دافئ"],["cool","بارد"],["mono","أبيض وأسود"],["vintage","كلاسيكي"],["rose","وردي"],["mint","نعناعي"]];
      const toneSelect = document.createElement("select");
      toneSelect.id = "image-tone";
      tones.forEach(([value, label]) => {
        const option = document.createElement("option"); option.value = value; option.textContent = label;
        toneSelect.append(option);
      });
      toneSelect.value = item.adjustments.tone || "natural";
      toneSelect.addEventListener("change", () => {
        item.adjustments.tone = toneSelect.value;
        item.previewCanvas = null;
        if (item.adjustments.harmonyStrength || item.adjustments.temperature || item.adjustments.shadows) buildImagePreview(item);
        draw(); remember(); setStatus("تعديلات غير محفوظة");
      });
      addField("تدرّج الألوان", toneSelect, adjustmentBody);
      const sliders = [
        ["temperature", "درجة الحرارة", -100, 100, item.adjustments.temperature || 0],
        ["brightness", "السطوع", -100, 100, item.adjustments.brightness || 0],
        ["contrast", "التباين", -100, 100, item.adjustments.contrast || 0],
        ["shadows", "الظلال", 0, 100, item.adjustments.shadows || 0],
        ["saturation", "تشبّع الألوان", 0, 200, item.adjustments.saturation ?? 100]
      ];
      sliders.forEach(([key, labelText, min, max, initial]) => {
        const range = document.createElement("input");
        range.type = "range"; range.id = `image-${key}`; range.min = String(min); range.max = String(max); range.value = String(initial);
        const field = addField(labelText, range, adjustmentBody);
        const value = document.createElement("span"); value.className = "property-note"; value.textContent = `${initial}${key === "temperature" ? "" : "%"}`;
        field.append(value);
        range.addEventListener("input", () => {
          item.adjustments[key] = Number(range.value);
          value.textContent = `${range.value}${key === "temperature" ? "" : "%"}`;
          item.previewCanvas = null;
          if (item.adjustments.harmonyStrength) buildImagePreview(item, 800);
          draw(); setStatus("تعديلات غير محفوظة");
        });
        range.addEventListener("change", () => { buildImagePreview(item); draw(); remember(); });
      });
      propertyContent.append(settings);
    } else {
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.id = "item-color";
      colorInput.value = item.color || "#477cff";
      colorInput.addEventListener("input", () => { item.color = colorInput.value; draw(); setStatus("تعديلات غير محفوظة"); });
      colorInput.addEventListener("change", remember);
      addField(item.type === "text" ? "لون النص" : "لون العنصر", colorInput, propertyContent);
    }

    const addSection = (title, parent = propertyContent) => {
      const section = document.createElement("details");
      section.className = "property-group";
      section.open = title === "التحويل والمظهر";
      const summary = document.createElement("summary");
      summary.textContent = title;
      const body = document.createElement("div");
      body.className = "property-group-body";
      section.append(summary, body);
      parent.append(section);
      return body;
    };
    const addRange = (parent, id, label, min, max, value, onInput) => {
      const input = document.createElement("input");
      input.type = "range"; input.id = id; input.min = String(min); input.max = String(max); input.value = String(value); input.step = "1";
      const field = addField(label, input, parent);
      const output = document.createElement("span");
      output.className = "property-note"; output.textContent = String(value);
      field.append(output);
      input.addEventListener("input", () => { output.textContent = input.value; onInput(Number(input.value)); draw(); setStatus("تعديلات غير محفوظة"); });
      input.addEventListener("change", remember);
      return input;
    };
    const addSelect = (parent, id, label, options, value, onChange) => {
      const control = document.createElement("select");
      control.id = id;
      options.forEach(([optionValue, optionLabel]) => {
        const option = document.createElement("option"); option.value = optionValue; option.textContent = optionLabel; control.append(option);
      });
      control.value = value;
      control.addEventListener("change", () => { onChange(control.value); draw(); remember(); setStatus("تعديلات غير محفوظة"); });
      addField(label, control, parent);
      return control;
    };
    const addAction = (parent, label, action, active = false) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = `property-action${active ? " active" : ""}`; button.textContent = label;
      button.addEventListener("click", () => { action(); draw(); renderProperties(); renderLayers(); remember(); setStatus("تعديلات غير محفوظة"); });
      parent.append(button);
      return button;
    };
    if (item.type === "text") {
      const effects = addSection("تأثيرات النص");
      addAction(effects, item.textOutline ? "إلغاء حد النص" : "إضافة حد النص", () => { item.textOutline = item.textOutline ? null : "#ffffff"; });
      const outlineColor = document.createElement("input"); outlineColor.type = "color"; outlineColor.id = "item-text-outline"; outlineColor.value = item.textOutline || "#ffffff"; outlineColor.addEventListener("input", () => { item.textOutline = outlineColor.value; draw(); }); outlineColor.addEventListener("change", remember); addField("لون الحد", outlineColor, effects);
      addRange(effects, "item-text-outline-width", "سُمك الحد", 1, 20, item.textOutlineWidth || 4, value => { item.textOutlineWidth = value; });
      const gradientColor = document.createElement("input"); gradientColor.type = "color"; gradientColor.id = "item-text-gradient"; gradientColor.value = item.textGradient || item.color || "#477cff"; gradientColor.addEventListener("input", () => { item.textGradient = gradientColor.value; draw(); }); gradientColor.addEventListener("change", remember); addField("لون التدرج", gradientColor, effects);
    }
    const transformGroup = addSection("التحويل والمظهر");
    addRange(transformGroup, "item-rotation", "التدوير", -180, 180, item.rotation || 0, value => { item.rotation = value; });
    addRange(transformGroup, "item-opacity", "الشفافية", 0, 100, item.opacity ?? 100, value => { item.opacity = value; });
    addRange(transformGroup, "item-width", "العرض", 20, canvas.width, Math.min(canvas.width, Math.round(item.w)), value => { item.w = Math.min(value, canvas.width - item.x); });
    addRange(transformGroup, "item-height", "الارتفاع", 20, canvas.height, Math.min(canvas.height, Math.round(item.h)), value => { item.h = Math.min(value, canvas.height - item.y); });
    const flipActions = document.createElement("div"); flipActions.className = "property-actions";
    addAction(flipActions, item.flipX ? "↔ انعكاس أفقي ✓" : "↔ انعكاس أفقي", () => { item.flipX = !item.flipX; }, item.flipX);
    addAction(flipActions, item.flipY ? "↕ انعكاس عمودي ✓" : "↕ انعكاس عمودي", () => { item.flipY = !item.flipY; }, item.flipY);
    addAction(flipActions, item.locked ? "🔒 إلغاء القفل" : "🔓 قفل العنصر", () => { item.locked = !item.locked; }, item.locked);
    transformGroup.append(flipActions);
    const appearanceActions = document.createElement("div"); appearanceActions.className = "property-actions";
    addAction(appearanceActions, "نسخ المظهر", () => {
      copiedStyle = { color: item.color, textGradient: item.textGradient, textOutline: item.textOutline, textOutlineWidth: item.textOutlineWidth, opacity: item.opacity, rotation: item.rotation, flipX: item.flipX, flipY: item.flipY, shadow: item.shadow, shadowBlur: item.shadowBlur, fillMode: item.fillMode, strokeColor: item.strokeColor, strokeWidth: item.strokeWidth, fontFamily: item.fontFamily, weight: item.weight, italic: item.italic, align: item.align, letterSpacing: item.letterSpacing, lineHeight: item.lineHeight };
      showToast("تم نسخ مظهر العنصر.");
    });
    addAction(appearanceActions, "لصق المظهر", () => { if (copiedStyle) Object.assign(item, copiedStyle); else showToast("انسخ مظهر عنصر أولًا."); }, Boolean(copiedStyle));
    addAction(appearanceActions, "إعادة الضبط", () => { item.opacity = 100; item.rotation = 0; item.flipX = false; item.flipY = false; item.shadow = false; item.textGradient = null; item.textOutline = null; item.fillMode = "fill"; item.strokeWidth = 0; });
    transformGroup.append(appearanceActions);

    if (item.type === "shape") {
      const styleGroup = addSection("حدود وظلال");
      const fillActions = document.createElement("div"); fillActions.className = "property-actions";
      addAction(fillActions, item.fillMode === "outline" ? "تعبئة الشكل" : "إطار فقط", () => { item.fillMode = item.fillMode === "outline" ? "fill" : "outline"; });
      const stroke = document.createElement("input"); stroke.type = "color"; stroke.id = "item-stroke"; stroke.value = item.strokeColor || item.color || "#477cff";
      stroke.addEventListener("input", () => { item.strokeColor = stroke.value; draw(); });
      stroke.addEventListener("change", remember); addField("لون الإطار", stroke, styleGroup);
      addRange(styleGroup, "item-stroke-width", "سُمك الإطار", 0, 32, item.strokeWidth || 0, value => { item.strokeWidth = value; });
      addAction(styleGroup, item.shadow ? "إيقاف الظل" : "إضافة ظل", () => { item.shadow = !item.shadow; });
      addRange(styleGroup, "item-shadow-blur", "نعومة الظل", 0, 50, item.shadowBlur || 12, value => { item.shadowBlur = value; });
    } else if (item.type === "image") {
      const imageStyle = addSection("ظل الصورة");
      addAction(imageStyle, item.shadow ? "إيقاف الظل" : "إضافة ظل", () => { item.shadow = !item.shadow; });
      addRange(imageStyle, "item-shadow-blur", "نعومة الظل", 0, 50, item.shadowBlur || 12, value => { item.shadowBlur = value; });
    }

    if (item.type === "text") {
      const textStyle = addSection("تنسيق النص");
      addSelect(textStyle, "item-font", "نوع الخط", [["Tahoma","Tahoma"],["Arial","Arial"],["Georgia","Georgia"],["monospace","Monospace"]], item.fontFamily || "Tahoma", value => { item.fontFamily = value; });
      const textActions = document.createElement("div"); textActions.className = "property-actions";
      addAction(textActions, item.weight === "700" ? "عريض ✓" : "عريض", () => { item.weight = item.weight === "700" ? "400" : "700"; }, item.weight === "700");
      addAction(textActions, item.italic ? "مائل ✓" : "مائل", () => { item.italic = !item.italic; }, item.italic);
      textStyle.append(textActions);
      const presetActions = document.createElement("div"); presetActions.className = "property-actions property-presets";
      addAction(presetActions, "عنوان", () => { item.fontSize = Math.round(canvas.width * .09); item.weight = "700"; item.color = "#18243b"; item.lineHeight = 1.1; });
      addAction(presetActions, "عنوان فرعي", () => { item.fontSize = Math.round(canvas.width * .055); item.weight = "600"; item.color = "#477cff"; item.lineHeight = 1.2; });
      addAction(presetActions, "نص هادئ", () => { item.fontSize = Math.round(canvas.width * .032); item.weight = "400"; item.color = "#5d687c"; item.lineHeight = 1.45; });
      textStyle.append(presetActions);
      addSelect(textStyle, "item-align", "محاذاة النص", [["right","يمين"],["center","وسط"],["left","يسار"]], item.align || "right", value => { item.align = value; });
      addRange(textStyle, "item-letter-spacing", "تباعد الحروف", 0, 12, item.letterSpacing || 0, value => { item.letterSpacing = value; });
      addRange(textStyle, "item-line-height", "تباعد الأسطر", 100, 220, Math.round((item.lineHeight || 1.35) * 100), value => { item.lineHeight = value / 100; });
    }

    const arrangeGroup = addSection("محاذاة وترتيب");
    const arrangeActions = document.createElement("div"); arrangeActions.className = "property-actions";
    addAction(arrangeActions, "توسيط أفقي", () => { item.x = Math.round((canvas.width - item.w) / 2); });
    addAction(arrangeActions, "توسيط عمودي", () => { item.y = Math.round((canvas.height - item.h) / 2); });
    addAction(arrangeActions, "للأمام", () => { const index = items.indexOf(item); if (index >= 0 && index < items.length - 1) { items.splice(index, 1); items.push(item); } });
    addAction(arrangeActions, "للخلف", () => { const index = items.indexOf(item); if (index > 0) { items.splice(index, 1); items.unshift(item); } });
    arrangeGroup.append(arrangeActions);

    const xInput = document.createElement("input");
    xInput.type = "number"; xInput.id = "item-x"; xInput.min = "0"; xInput.max = String(canvas.width); xInput.value = String(Math.round(item.x));
    const yInput = document.createElement("input");
    yInput.type = "number"; yInput.id = "item-y"; yInput.min = "0"; yInput.max = String(canvas.height); yInput.value = String(Math.round(item.y));
    const positionRow = document.createElement("div");
    positionRow.className = "field-inline";
    addField("الموضع الأفقي", xInput, positionRow);
    addField("الموضع العمودي", yInput, positionRow);
    const updatePosition = () => {
      item.x = Math.max(0, Math.min(canvas.width - item.w, Number(xInput.value) || 0));
      item.y = Math.max(0, Math.min(canvas.height - item.h, Number(yInput.value) || 0));
      xInput.value = String(Math.round(item.x)); yInput.value = String(Math.round(item.y));
      draw(); setStatus("تعديلات غير محفوظة");
    };
    xInput.addEventListener("input", updatePosition); yInput.addEventListener("input", updatePosition);
    xInput.addEventListener("change", remember); yInput.addEventListener("change", remember);
    propertyContent.append(positionRow);
  }

  function selectItem(id) {
    selectedId = id;
    renderLayers();
    renderProperties();
    draw();
  }

  function createItem(type, shape = null) {
    const shapeName = shape || (type === "circle" ? "circle" : "rectangle");
    const displayName = shapeCatalog.find(entry => entry[0] === shapeName)?.[1] || "مستطيل";
    const defaults = {
      text: { name: "نص جديد", text: "اكتب فكرتك هنا", x: canvas.width * .2, y: canvas.height * .25, w: canvas.width * .58, h: 100, color: "#18243b", fontSize: Math.max(36, Math.round(canvas.width / 14)), weight: "600" },
      shape: { name: displayName, shape: shapeName, x: canvas.width * .3, y: canvas.height * .3, w: canvas.width * .4, h: canvas.height * .4, color: "#477cff" }
    };
    const item = { id: nextId++, type: type === "text" ? "text" : "shape", ...defaults[type === "text" ? "text" : "shape"] };
    items.push(item);
    selectItem(item.id);
    remember();
    setStatus("تعديلات غير محفوظة");
  }

  function deleteItem(id) {
    const removed = items.find(item => item.id === id);
    if (removed) trash.push({ ...removed, src: imageSources.get(removed.id) || removed.src });
    items = items.filter(item => item.id !== id);
    if (selectedId === id) selectedId = null;
    renderLayers(); renderProperties(); draw(); remember();
    setStatus("تعديلات غير محفوظة");
  }

  function updateProjectStats() {
    const layerCount = document.getElementById("stats-layer-count");
    const canvasSize = document.getElementById("stats-canvas-size");
    const historyCount = document.getElementById("stats-history-count");
    const trashCount = document.getElementById("stats-trash-count");
    if (layerCount) layerCount.textContent = String(items.length);
    if (canvasSize) canvasSize.textContent = `${canvas.width} × ${canvas.height}`;
    if (historyCount) historyCount.textContent = `${Math.max(0, historyIndex + 1)} / ${history.length}`;
    if (trashCount) trashCount.textContent = String(trash.length);
  }

  function restoreLastDeleted() {
    const deleted = trash.pop();
    if (!deleted) { showToast("سلة المحذوفات فارغة."); return; }
    const restored = hydrateItem({ ...deleted, id: nextId++ });
    items.push(restored);
    selectItem(restored.id);
    remember();
    showToast("تم استرجاع آخر عنصر محذوف.");
  }

  function duplicateSelected() {
    const item = selected();
    if (!item) return;
    const copy = { ...item, id: nextId++, name: `${item.name} - نسخة`, x: Math.min(canvas.width - item.w, item.x + 24), y: Math.min(canvas.height - item.h, item.y + 24) };
    if (item.type === "image") {
      copy.src = imageSources.get(item.id) || item.src;
      if (copy.src) imageSources.set(copy.id, copy.src);
    }
    items.push(copy);
    selectItem(copy.id); remember(); setStatus("تعديلات غير محفوظة");
  }

  function setCanvasSize(value, preserve = true) {
    const [width, height] = value.split("x").map(Number);
    if (!Number.isFinite(width) || !Number.isFinite(height)) return;
    const oldW = canvas.width, oldH = canvas.height;
    canvas.width = width; canvas.height = height;
    if (preserve) items.forEach(item => {
      item.x = Math.round(item.x * width / oldW);
      item.y = Math.round(item.y * height / oldH);
      item.w = Math.min(width, Math.round(item.w * width / oldW));
      item.h = Math.min(height, Math.round(item.h * height / oldH));
      if (item.type === "text") item.fontSize = Math.max(16, Math.round(item.fontSize * width / oldW));
    });
    document.getElementById("dimension-label").textContent = `${width} × ${height}`;
    draw(); renderProperties(); remember(); setStatus("تعديلات غير محفوظة");
  }

  function undoRedo(direction) {
    const target = historyIndex + direction;
    if (target < 0 || target >= history.length) return;
    historyIndex = target;
    const state = JSON.parse(history[historyIndex]);
    canvas.width = state.width; canvas.height = state.height; background = state.background;
    backgroundImage = state.backgroundImageId ? hydrateBackground(backgroundSources.get(state.backgroundImageId), state.backgroundImageId) : null;
    items = state.items.map(hydrateItem);
    nextId = Math.max(0, ...items.map(item => item.id)) + 1;
    const size = `${canvas.width}x${canvas.height}`;
    if ([...sizeSelect.options].some(option => option.value === size)) sizeSelect.value = size;
    bgInput.value = background;
    document.getElementById("bg-hex").textContent = background.toUpperCase();
    document.getElementById("dimension-label").textContent = `${canvas.width} × ${canvas.height}`;
    selectedId = null; updateHistoryButtons(); draw(); renderLayers(); renderProperties();
    setStatus("تعديلات غير محفوظة");
  }

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  }
  function hitTest(point) {
    for (let index = items.length - 1; index >= 0; index--) {
      const item = items[index];
      const local = pointInItem(point, item);
      if (local.x >= item.x && local.x <= item.x + item.w && local.y >= item.y && local.y <= item.y + item.h) return item;
    }
    return null;
  }
  function pointInItem(point, item) {
    const centerX = item.x + item.w / 2, centerY = item.y + item.h / 2;
    const dx = point.x - centerX, dy = point.y - centerY;
    const angle = -(Number(item.rotation) || 0) * Math.PI / 180;
    const x = dx * Math.cos(angle) - dy * Math.sin(angle);
    const y = dx * Math.sin(angle) + dy * Math.cos(angle);
    return { x: centerX + x * (item.flipX ? -1 : 1), y: centerY + y * (item.flipY ? -1 : 1) };
  }

  canvas.addEventListener("pointerdown", event => {
    const point = pointFromEvent(event);
    const hit = hitTest(point);
    if (!hit) { selectedId = null; renderLayers(); renderProperties(); draw(); return; }
    selectItem(hit.id);
    if (hit.locked) { showToast("هذا العنصر مقفل. ألغِ القفل من الخصائص لتحريكه."); return; }
    drag = { id: hit.id, startX: hit.x, startY: hit.y, startPoint: point, moved: false };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", event => {
    if (!drag) return;
    const item = byId(drag.id);
    if (!item) return;
    const point = pointFromEvent(event);
    const dx = point.x - drag.startPoint.x, dy = point.y - drag.startPoint.y;
    const angle = -(Number(item.rotation) || 0) * Math.PI / 180;
    let deltaX = dx * Math.cos(angle) - dy * Math.sin(angle);
    let deltaY = dx * Math.sin(angle) + dy * Math.cos(angle);
    deltaX *= item.flipX ? -1 : 1; deltaY *= item.flipY ? -1 : 1;
    let nextX = drag.startX + deltaX, nextY = drag.startY + deltaY;
    if (guidesVisible && Math.abs(nextX + item.w / 2 - canvas.width / 2) < canvas.width * .012) nextX = (canvas.width - item.w) / 2;
    if (guidesVisible && Math.abs(nextY + item.h / 2 - canvas.height / 2) < canvas.height * .012) nextY = (canvas.height - item.h) / 2;
    item.x = Math.max(0, Math.min(canvas.width - item.w, nextX));
    item.y = Math.max(0, Math.min(canvas.height - item.h, nextY));
    drag.moved = true;
    const xInput = document.getElementById("item-x"), yInput = document.getElementById("item-y");
    if (xInput && yInput) { xInput.value = String(Math.round(item.x)); yInput.value = String(Math.round(item.y)); }
    requestDraw();
  });
  canvas.addEventListener("pointerup", () => {
    if (drag && drag.moved) { remember(); setStatus("تعديلات غير محفوظة"); }
    drag = null;
  });
  canvas.addEventListener("pointercancel", () => { drag = null; });
  document.getElementById("selection-delete").addEventListener("click", event => { event.stopPropagation(); if (selectedId !== null) deleteItem(selectedId); });
  document.getElementById("selection-duplicate").addEventListener("click", event => { event.stopPropagation(); duplicateSelected(); });
  document.getElementById("selection-edit-text").addEventListener("click", event => {
    event.stopPropagation();
    const item = selected();
    if (!item || item.type !== "text") return;
    const mobileTools = window.matchMedia("(max-width: 680px), (max-height: 500px) and (max-width: 980px)").matches;
    if (activeMobilePanel !== "settings" && (mobileTools || window.innerWidth <= 1050)) {
      if (!mobileTools) document.body.classList.add("tablet-text-editor-open");
      openMobilePanel("settings", document.querySelector('[data-mobile-panel="settings"]'));
    }
    const textInput = document.getElementById("item-text");
    if (!textInput) return;
    requestAnimationFrame(() => {
      if (selected()?.type !== "text") return;
      textInput.focus();
      textInput.select();
    });
  });

  const akPalettes = {
    midnight: { background: "#111827", accent: "#e7b66b", ink: "#f8fafc", soft: "#263247" },
    sand: { background: "#f7efe3", accent: "#b76e45", ink: "#32241f", soft: "#ead2bf" },
    olive: { background: "#eef1e4", accent: "#62724f", ink: "#263122", soft: "#d8dfc7" },
    cobalt: { background: "#eaf1ff", accent: "#315bd6", ink: "#172652", soft: "#cbd9ff" }
  };
  function applyAkTemplate(kind) {
    if (items.length > 1 && !window.confirm("سيستبدل القالب التصميم الحالي. هل تريد المتابعة؟")) return;
    let width = canvas.width, height = canvas.height;
    const makeShape = (shape, name, x, y, w, h, color, opacity = 100) => ({ id: nextId++, type: "shape", shape, name, x: Math.round(width * x), y: Math.round(height * y), w: Math.round(width * w), h: Math.round(height * h), color, opacity });
    const makeText = (name, text, x, y, w, color, size, weight = "700", align = "right") => ({ id: nextId++, type: "text", name, text, x: Math.round(width * x), y: Math.round(height * y), w: Math.round(width * w), h: Math.round(height * .12), color, fontSize: Math.max(24, Math.round(width * size)), weight, align, fontFamily: "Tahoma", lineHeight: 1.25 });
    const palettes = { announcement: akPalettes.cobalt, story: akPalettes.midnight, quote: akPalettes.sand, product: akPalettes.olive };
    const p = palettes[kind] || akPalettes.cobalt;
    if (kind === "story") setCanvasSize("1080x1920", false);
    else if (canvas.width !== 1080 || canvas.height !== 1080) setCanvasSize("1080x1080", false);
    width = canvas.width; height = canvas.height;
    const w = canvas.width, h = canvas.height;
    background = p.background; backgroundImage = null; bgInput.value = background; document.getElementById("bg-hex").textContent = background.toUpperCase();
    if (kind === "announcement") items = [makeShape("rounded", "خلفية الإعلان", .06, .08, .88, .84, p.soft), makeShape("rectangle", "شريط العرض", .06, .62, .88, .30, p.accent), makeText("العنوان", "عرض اليوم", .14, .19, .72, p.ink, .105), makeText("النسبة", "خصم 30%", .14, .40, .72, p.accent, .15), makeText("الدعوة", "اطلب الآن", .14, .72, .72, "#ffffff", .055)];
    if (kind === "story") items = [makeShape("rectangle", "خلفية القصة", 0, 0, 1, 1, p.background), makeShape("circle", "نقطة زخرفية", .09, .12, .18, .10, p.accent), makeText("العنوان", "يومك يبدأ بفكرة", .10, .38, .80, p.ink, .10), makeText("الوصف", "صمّمها بطريقتك", .10, .54, .80, p.accent, .05), makeShape("rounded", "زر القصة", .10, .78, .42, .09, p.accent), makeText("زر", "اكتشف المزيد", .10, .795, .42, "#ffffff", .035, "600", "center")];
    if (kind === "quote") items = [makeShape("rounded", "بطاقة الاقتباس", .08, .12, .84, .76, "#fffaf2"), makeShape("circle", "علامة الاقتباس", .16, .20, .12, .08, p.accent), makeText("الاقتباس", "الكلمة الجميلة\nتترك أثرًا طويلًا", .16, .36, .68, p.ink, .075), makeText("التوقيع", "— AK Studio", .16, .72, .68, p.accent, .035, "600")];
    if (kind === "product") items = [makeShape("rectangle", "خلفية المنتج", 0, 0, 1, 1, p.background), makeShape("rounded", "بطاقة المنتج", .08, .12, .84, .76, "#ffffff"), makeShape("circle", "مساحة الصورة", .22, .22, .56, .33, p.soft), makeText("اسم المنتج", "منتجك هنا", .15, .60, .70, p.ink, .075), makeText("السعر", "49.00 ر.س", .15, .73, .40, p.accent, .06), makeText("الحالة", "متوفر الآن", .56, .74, .28, p.ink, .03, "600", "center")];
    selectedId = items[items.length - 1]?.id || null; renderLayers(); renderProperties(); draw(); remember(); setStatus("تم تطبيق قالب AK عربي"); showToast("تم تطبيق قالب عربي أصلي قابل للتعديل.");
  }
  document.querySelectorAll("[data-ak-template]").forEach(button => button.addEventListener("click", () => applyAkTemplate(button.dataset.akTemplate)));
  document.querySelectorAll("[data-system-palette]").forEach(button => button.addEventListener("click", () => {
    const palette = akPalettes[button.dataset.systemPalette]; if (!palette) return;
    background = palette.background; bgInput.value = background; document.getElementById("bg-hex").textContent = background.toUpperCase(); document.documentElement.style.setProperty("--brand-accent", palette.accent);
    const item = selected(); if (item && item.type !== "image") item.color = palette.ink;
    try { localStorage.setItem("ak-system-palette", button.dataset.systemPalette); } catch (error) { console.error("Could not save AK palette", error); }
    draw(); renderProperties(); remember(); showToast("تم تطبيق نظام ألوان AK الموحد.");
  }));
  const reviewDialog = document.getElementById("design-review-dialog");
  const reviewList = document.getElementById("design-review-list");
  const reviewScore = document.getElementById("design-review-score");
  const hexLuminance = hex => {
    const value = String(hex || "#ffffff").replace("#", "");
    if (value.length !== 6) return 1;
    const rgb = [0, 2, 4].map(index => parseInt(value.slice(index, index + 2), 16) / 255).map(channel => channel <= .03928 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
    return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  };
  const runDesignReview = () => {
    const checks = [];
    const canvasArea = Math.max(1, canvas.width * canvas.height);
    if (!items.length) checks.push(["alert", "!", "اللوحة فارغة", "أضف قالبًا أو نصًا أو صورة قبل التصدير."]);
    else checks.push(["good", "✓", "اللوحة تحتوي على عناصر", `${items.length} ${items.length === 1 ? "عنصر" : "عناصر"} جاهزة للمراجعة.`]);
    const outOfBounds = items.filter(item => item.x < 0 || item.y < 0 || item.x + item.w > canvas.width || item.y + item.h > canvas.height).length;
    checks.push(outOfBounds ? ["alert", "!", "عنصر خارج حدود اللوحة", `يوجد ${outOfBounds} عنصر قد يظهر مقصوصًا عند التصدير.`] : ["good", "✓", "كل العناصر داخل اللوحة", "لا توجد طبقات خارجة عن حدود التصميم."]);
    const textItems = items.filter(item => item.type === "text");
    const tinyText = textItems.filter(item => Number(item.fontSize || 0) < Math.max(22, canvas.width / 42)).length;
    checks.push(tinyText ? ["warn", "~", "راجع حجم النص", `${tinyText} نص صغير نسبيًا وقد يصعب قراءته على الهاتف.`] : ["good", "✓", "وضوح النص جيد", textItems.length ? "أحجام النصوص مناسبة للمقاس الحالي." : "أضف نصًا إذا كان التصميم يحتاج رسالة واضحة."]);
    const centers = items.map(item => ({ x: item.x + item.w / 2, y: item.y + item.h / 2 }));
    const average = centers.reduce((sum, point) => ({ x: sum.x + point.x / Math.max(1, centers.length), y: sum.y + point.y / Math.max(1, centers.length) }), { x: 0, y: 0 });
    const balance = Math.abs(average.x - canvas.width / 2) / canvas.width + Math.abs(average.y - canvas.height / 2) / canvas.height;
    checks.push(balance > .34 ? ["warn", "~", "وازن التكوين", "العناصر مائلة كثيرًا إلى جهة واحدة؛ جرّب التوسيط أو الشبكة."] : ["good", "✓", "التكوين متوازن", "مركز العناصر قريب من مركز اللوحة."]);
    const contrast = textItems.filter(item => Math.abs(hexLuminance(item.color) - hexLuminance(background)) < .18).length;
    checks.push(contrast ? ["warn", "~", "تحقق من التباين", `${contrast} نص قد لا يكون واضحًا فوق الخلفية الحالية.`] : ["good", "✓", "التباين مناسب", "الألوان الأساسية واضحة على الخلفية الحالية."]);
    const score = Math.max(0, Math.round((checks.filter(check => check[0] === "good").length / checks.length) * 100));
    reviewScore.innerHTML = `<strong>${score}</strong><span>نسبة الجاهزية<br><small>فحص محلي سريع قبل التصدير</small></span>`;
    reviewList.replaceChildren();
    checks.forEach(([kind, icon, title, description]) => {
      const row = document.createElement("div"); row.className = `review-item ${kind}`; row.innerHTML = `<span class="review-item-icon">${icon}</span><span><strong>${title}</strong><small>${description}</small></span>`; reviewList.append(row);
    });
    reviewDialog.showModal();
  };
  document.getElementById("design-review-btn")?.addEventListener("click", runDesignReview);
  document.getElementById("design-review-close")?.addEventListener("click", () => reviewDialog.close());
  document.getElementById("design-review-export")?.addEventListener("click", () => { reviewDialog.close(); downloadDesign("png"); });
  const toolsCenterDialog = document.getElementById("tools-center-dialog");
  const toolsCenterGrid = document.getElementById("tools-center-grid");
  const toolsCenterSearch = document.getElementById("tools-center-search");
  const toolsCenterTabs = document.getElementById("tools-center-tabs");
  const toolsCenterCount = document.getElementById("tools-center-count");
  const toolCatalog = [
    ["all", "إضافة نص", "أنشئ طبقة نص عربية", "T", "add-text"],
    ["all", "مستطيل", "أضف شكلًا مستطيلاً", "◇", "add-rect"],
    ["all", "دائرة", "أضف شكلًا دائريًا", "○", "add-circle"],
    ["all", "رفع صورة", "اختر صورة من جهازك", "▧", "upload-trigger"],
    ["all", "ترتيب ذكي", "وزّع العناصر تلقائيًا", "⌘", "auto-arrange-btn"],
    ["all", "مراجع التصميم", "افحص التصميم قبل التصدير", "✓", "design-review-btn"],
    ["all", "توسيط العنصر", "ضع العنصر في مركز اللوحة", "＋", "center-selection-btn"],
    ["all", "نسخ العنصر", "أنشئ نسخة من العنصر المحدد", "⧉", "duplicate-selection-btn"],
    ["all", "شبكة المحاذاة", "أظهر أو أخفِ الأدلة", "⌗", "grid-toggle-btn"],
    ["all", "هوية العلامة", "طبّق ألوان وخطوط العلامة", "◆", "brand-kit-btn"],
    ["all", "تصدير PNG", "نزّل التصميم بجودة عالية", "↓", "export-btn"],
    ["all", "تنظيف اللوحة", "ابدأ بتصميم جديد", "⌫", "clear-canvas-btn"],
    ["template", "إعلان سريع", "قالب عربي للعرض", "✦", "template:announcement"],
    ["template", "قصة يومية", "قالب عمودي جاهز", "▣", "template:story"],
    ["template", "اقتباس عربي", "بطاقة للنصوص الملهمة", "❝", "template:quote"],
    ["template", "بطاقة منتج", "سعر وميزة المنتج", "◆", "template:product"],
    ["color", "لون منتصف الليل", "لوحة داكنة فاخرة", "●", "palette:midnight"],
    ["color", "لون رملي", "دفء وهدوء بصري", "●", "palette:sand"],
    ["color", "لون زيتوني", "هوية طبيعية هادئة", "●", "palette:olive"],
    ["color", "لون كوبالت", "لون رقمي واضح", "●", "palette:cobalt"],
    ["library", "مكتبة التصاميم", "قوالب وشعارات أصلية", "✦", "library"],
    ["library", "إحصائيات المشروع", "قياس الطبقات والمقاس", "◌", "project-stats-btn"]
  ];
  const toolCategories = [["all", "الكل"], ["template", "القوالب"], ["color", "الألوان"], ["library", "المكتبة"]];
  const advancedToolCatalog = [
    ["studio", "تحسين طبيعي", "ألوان متوازنة للصورة", "✦", "advanced:filter:natural"], ["studio", "ألوان نابضة", "رفع الحيوية والتشبّع", "◈", "advanced:filter:vivid"], ["studio", "سينمائي دافئ", "درجة دافئة بلمسة فيلمية", "◉", "advanced:filter:warm"], ["studio", "سينمائي بارد", "إحساس عصري بارد", "◌", "advanced:filter:cool"], ["studio", "أبيض وأسود", "تحويل أحادي اللون", "◐", "advanced:filter:mono"], ["studio", "فنتج", "طابع قديم ناعم", "◍", "advanced:filter:vintage"], ["studio", "وردي ناعم", "لمسة وردية للصور", "♡", "advanced:filter:rose"], ["studio", "نعناع", "ألوان منعشة وهادئة", "❋", "advanced:filter:mint"],
    ["studio", "إضاءة عالية", "رفع إضاءة الصورة", "☼", "advanced:adjust:brightness:24"], ["studio", "إضاءة منخفضة", "تعتيم فني للصورة", "☾", "advanced:adjust:brightness:-22"], ["studio", "تباين قوي", "إبراز التفاصيل", "◑", "advanced:adjust:contrast:28"], ["studio", "تباين ناعم", "مظهر ناعم ومتوازن", "◒", "advanced:adjust:contrast:-18"], ["studio", "ألوان غنية", "رفع التشبّع", "✺", "advanced:adjust:saturation:128"], ["studio", "ألوان هادئة", "تهدئة الألوان", "○", "advanced:adjust:saturation:72"], ["studio", "دفء بصري", "إضاءة دافئة", "☀", "advanced:adjust:temperature:24"], ["studio", "برودة بصرية", "هوية تقنية نظيفة", "❄", "advanced:adjust:temperature:-22"], ["studio", "رفع الظلال", "إظهار التفاصيل الداكنة", "△", "advanced:adjust:shadows:42"],
    ["studio", "قص سينمائي", "ملاءمة الصورة داخل الإطار", "▣", "advanced:fit:cover"], ["studio", "صورة كاملة", "عرض الصورة كاملة", "□", "advanced:fit:contain"], ["studio", "تدوير يمين", "تدوير 90 درجة", "↻", "advanced:rotate:90"], ["studio", "تدوير يسار", "تدوير عكسي", "↺", "advanced:rotate:-90"], ["studio", "انعكاس أفقي", "قلب العنصر أفقيًا", "⇄", "advanced:flip:x"], ["studio", "انعكاس عمودي", "قلب العنصر عموديًا", "⇅", "advanced:flip:y"], ["studio", "شفافية 80%", "إحساس طبقات خفيف", "◒", "advanced:opacity:80"], ["studio", "شفافية 50%", "عنصر خلفي متوازن", "◓", "advanced:opacity:50"], ["studio", "ظل ناعم", "إضافة عمق للعنصر", "⬢", "advanced:shadow:soft"], ["studio", "إزالة الظل", "إرجاع العنصر مسطحًا", "◇", "advanced:shadow:none"],
    ["studio", "عنوان رئيسي", "إضافة طبقة عنوان", "T", "advanced:text:headline"], ["studio", "عنوان فرعي", "إضافة طبقة وصف", "T", "advanced:text:subtitle"], ["studio", "دعوة للإجراء", "زر نصي قابل للتعديل", "→", "advanced:text:cta"], ["studio", "سعر المنتج", "طبقة سعر بارزة", "ر.س", "advanced:text:price"], ["studio", "وسم جديد", "شارة جديدة", "NEW", "advanced:text:badge"], ["studio", "توقيع الحساب", "إضافة اسم الحساب", "@", "advanced:text:handle"], ["studio", "فاصل أنيق", "خط بصري قابل للتحريك", "—", "advanced:shape:line"], ["studio", "شارة دائرية", "عنصر دائري", "●", "advanced:shape:circle"], ["studio", "بطاقة ناعمة", "لوحة خلفية للنص", "▰", "advanced:shape:rounded"], ["studio", "نجمة التركيز", "عنصر زخرفي", "✦", "advanced:shape:star"], ["studio", "قلب اجتماعي", "عنصر تفاعل بصري", "♥", "advanced:shape:heart"], ["studio", "سهم الإجراء", "توجيه بصري", "➜", "advanced:shape:arrow"],
    ["studio", "توسيط ذكي", "توسيط الطبقة", "＋", "advanced:layout:center"], ["studio", "ملاءمة اللوحة", "تحجيم العنصر", "⊞", "advanced:layout:fit"], ["studio", "نسخة احترافية", "تكرار العنصر", "⧉", "advanced:layout:duplicate"], ["studio", "محاذاة أعلى", "تثبيت العنصر بالأعلى", "↑", "advanced:layout:top"], ["studio", "محاذاة أسفل", "تثبيت العنصر بالأسفل", "↓", "advanced:layout:bottom"], ["studio", "لوحة مربعة", "منشور 1080 مربع", "□", "advanced:canvas:1080x1080"], ["studio", "لوحة ستوري", "ستوري 1080×1920", "▯", "advanced:canvas:1080x1920"], ["studio", "لوحة ريلز", "فيديو عمودي", "▯", "advanced:canvas:1080x1920"], ["studio", "لوحة يوتيوب", "صورة مصغرة 16:9", "▭", "advanced:canvas:1280x720"], ["studio", "فحص الجودة", "مراجعة قبل التصدير", "✓", "advanced:review"], ["studio", "تصدير سريع", "تنزيل PNG", "↓", "advanced:export:png"]
  ];
  toolCatalog.push(...advancedToolCatalog);
  toolCategories.push(["studio", "أدوات AK الخاصة"]);
  let activeToolCategory = "all";
  const runAdvancedTool = action => {
    const parts = action.split(":");
    const item = selected() || items.find(entry => entry.type === "image");
    const imageEdit = (updates, message) => {
      if (!item || item.type !== "image") { showToast("حدد صورة أو أضف صورة أولًا لاستخدام هذه الأداة."); return; }
      item.adjustments = { brightness: 0, contrast: 0, temperature: 0, shadows: 0, saturation: 100, tone: "natural", ...item.adjustments, ...updates };
      item.previewCanvas = null; draw(); renderProperties(); remember(); showToast(message);
    };
    const addTextPreset = (name, value, size) => { createItem("text"); const created = selected(); if (!created) return; created.name = name; created.text = value; created.fontSize = Math.round(canvas.width * size); created.w = Math.round(canvas.width * .72); created.x = Math.round((canvas.width - created.w) / 2); draw(); renderLayers(); renderProperties(); remember(); showToast(`تمت إضافة ${name}.`); };
    if (parts[1] === "filter") imageEdit({ tone: parts[2] }, "تم تطبيق نمط الصورة.");
    else if (parts[1] === "adjust") imageEdit({ [parts[2]]: Number(parts[3]) }, "تم تحسين الصورة.");
    else if (parts[1] === "fit") { if (!item || item.type !== "image") return showToast("حدد صورة أولًا."); item.fit = parts[2]; item.previewCanvas = null; draw(); remember(); showToast("تم تحديث ملاءمة الصورة."); }
    else if (parts[1] === "rotate") { if (!item) return showToast("حدد عنصرًا أولًا."); item.rotation = (Number(item.rotation) || 0) + Number(parts[2]); draw(); renderProperties(); remember(); showToast("تم تدوير العنصر."); }
    else if (parts[1] === "flip") { if (!item) return showToast("حدد عنصرًا أولًا."); item[`flip${parts[2].toUpperCase()}`] = !item[`flip${parts[2].toUpperCase()}`]; draw(); remember(); showToast("تم انعكاس العنصر."); }
    else if (parts[1] === "opacity") { if (!item) return showToast("حدد عنصرًا أولًا."); item.opacity = Number(parts[2]); draw(); renderProperties(); remember(); showToast("تم تغيير الشفافية."); }
    else if (parts[1] === "shadow") { if (!item) return showToast("حدد عنصرًا أولًا."); item.shadow = parts[2] === "soft"; item.shadowBlur = item.shadow ? 24 : 0; draw(); renderProperties(); remember(); showToast("تم تحديث الظل."); }
    else if (parts[1] === "text") { const presets = { headline: ["عنوان رئيسي", "اكتب عنوانك هنا", .085], subtitle: ["عنوان فرعي", "أضف وصفًا مختصرًا", .045], cta: ["دعوة للإجراء", "اكتشف المزيد", .04], price: ["السعر", "49.00 ر.س", .06], badge: ["وسم", "جديد", .045], handle: ["الحساب", "@yourbrand", .035] }; addTextPreset(...presets[parts[2]]); }
    else if (parts[1] === "shape") { createItem("shape", parts[2]); showToast("تمت إضافة عنصر زخرفي قابل للتعديل."); }
    else if (parts[1] === "layout") { if (!item) return showToast("حدد عنصرًا أولًا."); if (parts[2] === "center") { item.x = Math.round((canvas.width - item.w) / 2); item.y = Math.round((canvas.height - item.h) / 2); } else if (parts[2] === "fit") { const scale = Math.min(canvas.width / item.w, canvas.height / item.h); item.w = Math.round(item.w * scale); item.h = Math.round(item.h * scale); item.x = Math.round((canvas.width - item.w) / 2); item.y = Math.round((canvas.height - item.h) / 2); } else if (parts[2] === "top") item.y = 24; else if (parts[2] === "bottom") item.y = Math.max(0, canvas.height - item.h - 24); else if (parts[2] === "duplicate") duplicateSelected(); draw(); renderLayers(); renderProperties(); remember(); showToast("تم تحديث ترتيب العنصر."); }
    else if (parts[1] === "canvas") setCanvasSize(parts[2], true);
    else if (parts[1] === "review") runDesignReview();
    else if (parts[1] === "export") downloadDesign(parts[2]);
  };
  const runTool = action => {
    if (action.startsWith("advanced:")) runAdvancedTool(action);
    if (action.startsWith("template:")) document.querySelector(`[data-ak-template="${action.split(":")[1]}"]`)?.click();
    else if (action.startsWith("palette:")) document.querySelector(`[data-system-palette="${action.split(":")[1]}"]`)?.click();
    else if (action === "library") document.getElementById("pro-entry-btn")?.click();
    else document.getElementById(action)?.click();
    if (toolsCenterDialog?.open) toolsCenterDialog.close();
  };
  const renderToolCenter = () => {
    const query = toolsCenterSearch.value.trim().toLocaleLowerCase("ar");
    const visible = toolCatalog.filter(([category, title, description]) => (activeToolCategory === "all" || category === activeToolCategory) && (!query || `${title} ${description}`.toLocaleLowerCase("ar").includes(query)));
    toolsCenterGrid.replaceChildren();
    visible.forEach(([, title, description, icon, action]) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "center-tool-card"; button.innerHTML = `<span class="center-tool-icon">${icon}</span><span><strong>${title}</strong><small>${description}</small></span>`; button.addEventListener("click", () => runTool(action)); toolsCenterGrid.append(button);
    });
    toolsCenterCount.textContent = visible.length;
    if (!visible.length) toolsCenterGrid.innerHTML = '<p class="property-note">لا توجد أداة مطابقة.</p>';
  };
  toolCategories.forEach(([value, label]) => { const tab = document.createElement("button"); tab.type = "button"; tab.className = `tools-center-tab${value === "all" ? " active" : ""}`; tab.textContent = label; tab.addEventListener("click", () => { activeToolCategory = value; toolsCenterTabs.querySelectorAll("button").forEach(button => button.classList.remove("active")); tab.classList.add("active"); renderToolCenter(); }); toolsCenterTabs.append(tab); });
  document.getElementById("tools-center-btn")?.addEventListener("click", () => { activeToolCategory = "all"; toolsCenterSearch.value = ""; toolsCenterTabs.querySelectorAll("button").forEach((button, index) => button.classList.toggle("active", index === 0)); renderToolCenter(); toolsCenterDialog.showModal(); requestAnimationFrame(() => toolsCenterSearch.focus()); });
  document.getElementById("tools-center-close")?.addEventListener("click", () => toolsCenterDialog.close());
  toolsCenterSearch?.addEventListener("input", renderToolCenter);
  const commandDialog = document.getElementById("command-dialog");
  const commandInput = document.getElementById("command-search-input");
  const commandList = document.getElementById("command-list");
  let commandIndex = 0;
  const commandItems = [
    ["template:announcement", "إعلان سريع", "قالب عربي للعرض والدعوة إلى الإجراء", "✦"],
    ["template:story", "قصة يومية", "تصميم عمودي جاهز للنشر", "▣"],
    ["template:quote", "اقتباس عربي", "بطاقة هادئة للنصوص الملهمة", "❝"],
    ["template:product", "بطاقة منتج", "اسم المنتج والسعر والحالة", "◆"],
    ["add-text", "إضافة نص", "أنشئ طبقة نص عربية جديدة", "T"],
    ["add-rect", "إضافة شكل", "أضف مستطيلًا إلى اللوحة", "◇"],
    ["auto-arrange", "ترتيب ذكي", "وزّع العناصر داخل شبكة متوازنة", "⌘"],
    ["tools-center", "مركز الأدوات", "كل أدوات الاستوديو في مكان واحد", "✦"],
    ["upload", "إضافة صورة", "اختر صورة من جهازك", "▧"],
    ["pro", "مكتبة التصاميم", "قوالب وشعارات إضافية", "✦"],
    ["settings", "الإعدادات", "الهوية والاختصارات والخصوصية", "⚙"],
    ["export", "تصدير PNG", "نزّل التصميم بجودة عالية", "↓"]
  ];
  const runCommand = command => {
    if (command.startsWith("template:")) applyAkTemplate(command.split(":")[1]);
    else if (command === "add-text") createItem("text");
    else if (command === "add-rect") createItem("shape", "rounded");
    else if (command === "auto-arrange") document.getElementById("auto-arrange-btn")?.click();
    else if (command === "tools-center") document.getElementById("tools-center-btn")?.click();
    else if (command === "upload") uploadInput.click();
    else if (command === "pro") openProLibrary();
    else if (command === "settings") settingsDialog.showModal();
    else if (command === "export") downloadDesign("png");
    commandDialog.close();
  };
  const renderCommands = () => {
    const query = commandInput.value.trim().toLocaleLowerCase("ar");
    commandList.replaceChildren();
    commandItems.filter(([, title, description]) => !query || `${title} ${description}`.toLocaleLowerCase("ar").includes(query)).forEach(([command, title, description, icon]) => {
      const button = document.createElement("button"); button.type = "button"; button.className = "command-item"; button.innerHTML = `<span class="command-item-icon">${icon}</span><span><strong>${title}</strong><small>${description}</small></span>`;
      button.addEventListener("click", () => runCommand(command)); commandList.append(button);
    });
    commandIndex = 0;
    commandList.children[commandIndex]?.classList.add("is-command-active");
    if (!commandList.children.length) commandList.innerHTML = '<p class="property-note">لا توجد نتيجة مطابقة.</p>';
  };
  document.getElementById("command-btn")?.addEventListener("click", () => { commandDialog.showModal(); commandInput.value = ""; renderCommands(); requestAnimationFrame(() => commandInput.focus()); });
  document.getElementById("command-close")?.addEventListener("click", () => commandDialog.close());
  commandInput?.addEventListener("input", renderCommands);
  commandInput?.addEventListener("keydown", event => {
    const commandButtons = [...commandList.querySelectorAll("button.command-item")];
    if (!commandButtons.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      commandIndex = (commandIndex + (event.key === "ArrowDown" ? 1 : -1) + commandButtons.length) % commandButtons.length;
      commandButtons.forEach((button, index) => button.classList.toggle("is-command-active", index === commandIndex));
      commandButtons[commandIndex].scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter") {
      event.preventDefault();
      commandButtons[commandIndex].click();
    }
  });
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); document.getElementById("command-btn")?.click(); }
    if (event.key === "Escape" && commandDialog?.open) commandDialog.close();
  });
  document.getElementById("add-text").addEventListener("click", () => createItem("text"));
  document.getElementById("add-rect").addEventListener("click", () => createItem("shape", "rectangle"));
  document.getElementById("add-circle").addEventListener("click", () => createItem("shape", "circle"));
  document.getElementById("upload-trigger").addEventListener("click", () => uploadInput.click());
  document.getElementById("canvas-start-template")?.addEventListener("click", () => document.querySelector('[data-ak-template="announcement"]')?.click());
  document.getElementById("canvas-start-text")?.addEventListener("click", () => document.getElementById("add-text")?.click());
  uploadInput.addEventListener("change", () => {
    const file = uploadInput.files && uploadInput.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("الرجاء اختيار ملف صورة صالح."); uploadInput.value = ""; return; }
    const reader = new FileReader();
    reader.onerror = () => showToast("تعذرت قراءة الصورة. حاول اختيار ملف آخر.");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => showToast("تعذر فتح الصورة. تأكد من سلامة الملف.");
      image.onload = () => {
        try {
          const src = compactImageData(image);
          const item = { id: nextId++, type: "image", name: file.name.slice(0, 55) || "صورة", x: 0, y: 0, w: canvas.width, h: canvas.height, fit: "cover", color: "#ffffff", image, src, adjustments: { brightness: 0, contrast: 0, temperature: 0, shadows: 0, saturation: 100, tone: "natural", harmonyColor: background, harmonyStrength: 0 } };
          imageSources.set(item.id, src);
          items.push(item); selectItem(item.id); draw(); remember(); setStatus("تعديلات غير محفوظة");
        } catch (error) {
          console.error("Could not optimize uploaded image:", error);
          showToast("تعذر تجهيز الصورة. جرّب صورة أصغر أو بصيغة أخرى.");
        }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
    uploadInput.value = "";
  });

  function setBackgroundFromFile(file) {
    if (!file || !file.type.startsWith("image/")) { showToast("الرجاء اختيار ملف صورة صالح."); return; }
    const reader = new FileReader();
    reader.onerror = () => showToast("تعذرت قراءة صورة الخلفية.");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => showToast("تعذر فتح صورة الخلفية.");
      image.onload = () => {
        try {
          const src = compactImageData(image);
          const id = nextBackgroundImageId++;
          backgroundSources.set(id, src);
          backgroundImage = { image, src, id };
          draw(); remember(); setStatus("تعديلات غير محفوظة");
          showToast("تمت إضافة صورة كخلفية للوحة.");
        } catch (error) {
          console.error("Could not optimize background image:", error);
          showToast("تعذر تجهيز صورة الخلفية. جرّب صورة أصغر.");
        }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
  const backgroundUpload = document.getElementById("background-upload");
  document.getElementById("background-upload-trigger").addEventListener("click", () => backgroundUpload.click());
  backgroundUpload.addEventListener("change", () => {
    setBackgroundFromFile(backgroundUpload.files && backgroundUpload.files[0]);
    backgroundUpload.value = "";
  });

  const socialModal = document.getElementById("social-modal");
  const socialForm = document.getElementById("social-form");
  const closeSocialModal = () => { socialModal.hidden = true; };
  document.getElementById("add-social-links").addEventListener("click", () => {
    socialModal.hidden = false;
    document.getElementById("social-instagram").focus();
  });
  document.getElementById("social-close").addEventListener("click", closeSocialModal);
  document.getElementById("social-cancel").addEventListener("click", closeSocialModal);
  socialModal.addEventListener("click", event => { if (event.target === socialModal) closeSocialModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !socialModal.hidden) closeSocialModal(); });
  socialForm.addEventListener("submit", event => {
    event.preventDefault();
    const accent = document.getElementById("social-accent").value;
    const style = document.getElementById("social-style")?.value || "luxury";
    const cardStyles = {
      luxury: { background: "#101827", tile: "#192538", text: "#f4f7fc", muted: "#aebbd0" },
      editorial: { background: "#f7f1e8", tile: "#fffaf2", text: "#2b211b", muted: "#806f61" },
      neon: { background: "#141126", tile: "#241b45", text: "#ffffff", muted: "#c9bfff" },
      minimal: { background: "#ffffff", tile: "#f1f3f7", text: "#1d2635", muted: "#6b778c" },
      glass: { background: "#dcecf0", tile: "#eef8f8", text: "#17343c", muted: "#55727a" }
    };
    const cardTheme = cardStyles[style] || cardStyles.luxury;
    const links = [
      { title: "إنستغرام", value: document.getElementById("social-instagram").value.trim(), icon: "◎", color: "#d94c8a" },
      { title: "واتساب", value: document.getElementById("social-whatsapp").value.trim(), icon: "☎", color: "#22bd80" },
      { title: "البريد الإلكتروني", value: document.getElementById("social-email").value.trim(), icon: "✉", color: accent }
    ].filter(link => link.value);
    if (!links.length) {
      showToast("أدخل بيانات حساب واحد على الأقل لإضافة بطاقة التواصل.");
      return;
    }

    const cardWidth = Math.max(360, Math.min(canvas.width * .92, 1440));
    const cardHeight = Math.max(135, Math.min(canvas.height * .24, cardWidth * .24));
    const card = document.createElement("canvas");
    card.width = Math.round(cardWidth);
    card.height = Math.round(cardHeight);
    const cardCtx = card.getContext("2d");
    const width = card.width, height = card.height;
    const padding = width * .025;
    const gap = width * .018;
    const tileWidth = (width - padding * 2 - gap * (links.length - 1)) / links.length;
    const tileHeight = height * .73;
    const tileY = height * .19;
    cardCtx.fillStyle = cardTheme.background;
    cardCtx.beginPath();
    cardCtx.roundRect(0, 0, width, height, height * .12);
    cardCtx.fill();
    cardCtx.strokeStyle = accent;
    cardCtx.globalAlpha = .5;
    cardCtx.lineWidth = Math.max(1, height * .008);
    cardCtx.stroke();
    cardCtx.globalAlpha = 1;
    links.forEach((link, index) => {
      const x = width - padding - tileWidth - index * (tileWidth + gap);
      cardCtx.fillStyle = cardTheme.tile;
      cardCtx.beginPath();
      cardCtx.roundRect(x, tileY, tileWidth, tileHeight, height * .075);
      cardCtx.fill();
      cardCtx.fillStyle = link.color;
      cardCtx.beginPath();
      cardCtx.arc(x + tileWidth / 2, tileY + tileHeight * .29, height * .12, 0, Math.PI * 2);
      cardCtx.fill();
      cardCtx.fillStyle = "#ffffff";
      cardCtx.font = `700 ${Math.round(height * .14)}px Arial, sans-serif`;
      cardCtx.textAlign = "center";
      cardCtx.textBaseline = "middle";
      cardCtx.fillText(link.icon, x + tileWidth / 2, tileY + tileHeight * .29 + height * .005);
      cardCtx.fillStyle = cardTheme.text;
      cardCtx.direction = "rtl";
      cardCtx.font = `600 ${Math.round(height * .075)}px Tahoma, Arial, sans-serif`;
      cardCtx.fillText(link.title, x + tileWidth / 2, tileY + tileHeight * .61, tileWidth - 16);
      cardCtx.fillStyle = cardTheme.muted;
      cardCtx.direction = "ltr";
      cardCtx.font = `500 ${Math.round(height * .066)}px Arial, Tahoma, sans-serif`;
      cardCtx.fillText(link.value, x + tileWidth / 2, tileY + tileHeight * .82, tileWidth - 18);
    });

    const src = card.toDataURL("image/png");
    const image = new Image();
    image.onload = draw;
    image.onerror = () => showToast("تعذر تجهيز بطاقة التواصل؛ حاول مرة أخرى.");
    image.src = src;
    const item = {
      id: nextId++, type: "image", name: "بطاقة التواصل الاجتماعي",
      x: Math.round((canvas.width - card.width) / 2),
      y: Math.max(0, Math.round(canvas.height - card.height - canvas.height * .1)),
      w: card.width, h: card.height, fit: "contain", color: "#ffffff", image, src,
      adjustments: { brightness: 0, contrast: 0, temperature: 0, shadows: 0, saturation: 100, tone: "natural", harmonyColor: background, harmonyStrength: 0 }
    };
    imageSources.set(item.id, src);
    items.push(item);
    selectItem(item.id);
    draw(); remember(); setStatus("تعديلات غير محفوظة");
    closeSocialModal();
    showToast("تمت إضافة بطاقة التواصل كعنصر واحد قابل للتحريك والتغيير.");
  });

  const logoStudioDialog = document.getElementById("logo-studio-dialog");
  const logoGrid = document.getElementById("logo-grid");
  const logoSearch = document.getElementById("logo-search");
  const logoIndustryFilter = document.getElementById("logo-industry-filter");
  const logoStyleFilter = document.getElementById("logo-style-filter");
  const logoResultCount = document.getElementById("logo-result-count");
  const logoPageLabel = document.getElementById("logo-page-label");
  const logoEmptyResults = document.getElementById("logo-empty-results");
  const logoIndustries = {
    food: ["مذاق", "فنجان", "لقمة", "حبّة", "رغيف", "نقطة قهوة", "سفرة", "طبق"],
    fashion: ["خيط", "أناقة", "لمسة", "نسج", "قطعة", "ورد", "ظل", "مقاس"],
    tech: ["نبض", "كود", "نقطة", "مدار", "فولت", "زر", "بكسل", "جيم"],
    home: ["دار", "ركن", "أفق", "مفتاح", "بيت", "مسكن", "مربع", "مرفأ"],
    services: ["أثر", "وصل", "خطوة", "مسار", "فكرة", "منارة", "جسر", "معرفة"]
  };
  const logoSuffixes = ["ستوديو", "لاين", "هاوس", "ماركت", "كرافت", "بلاس", "لاب", "ديجيتال", "كو", "بوينت"];
  const logoMarks = ["✦", "◎", "◈", "⌁", "✿", "◆", "◉", "↗", "S", "AK"];
  const logoPalettes = [
    { background: "#172033", accent: "#8ca7ff", ink: "#ffffff" }, { background: "#f7efe5", accent: "#a96d3d", ink: "#30241d" },
    { background: "#e8f4ef", accent: "#25866c", ink: "#17382e" }, { background: "#fff0f4", accent: "#c74c8d", ink: "#4b2039" },
    { background: "#f1f2f4", accent: "#262b33", ink: "#1a1d22" }, { background: "#211a35", accent: "#d5a8ff", ink: "#ffffff" }
  ];
  const logoStyleNames = ["minimal", "modern", "luxury", "bold", "organic"];
  const logoCatalog = Array.from({ length: 10000 }, (_, index) => {
    const industryKeys = Object.keys(logoIndustries);
    const industry = industryKeys[index % industryKeys.length];
    const word = logoIndustries[industry][Math.floor(index / industryKeys.length) % logoIndustries[industry].length];
    const suffix = logoSuffixes[Math.floor(index / 7) % logoSuffixes.length];
    return {
      id: index + 1,
      name: `${word} ${suffix} ${String(Math.floor(index / 2) + 1).padStart(4, "0")}`,
      industry,
      style: logoStyleNames[index % logoStyleNames.length],
      mark: logoMarks[index % logoMarks.length],
      palette: logoPalettes[index % logoPalettes.length]
    };
  });
  let logoPage = 1;
  const logoPageSize = 24;
  const filteredLogos = () => {
    const query = (logoSearch?.value || "").trim().toLocaleLowerCase("ar");
    const industry = logoIndustryFilter?.value || "all";
    const style = logoStyleFilter?.value || "all";
    return logoCatalog.filter(logo => (!query || logo.name.toLocaleLowerCase("ar").includes(query)) && (industry === "all" || logo.industry === industry) && (style === "all" || logo.style === style));
  };
  function addLogoToCanvas(logo) {
    const p = logo.palette;
    const makeShape = (name, shape, x, y, w, h, color, extra = {}) => ({ id: nextId++, type: "shape", name, shape, x, y, w, h, color, ...extra });
    const makeText = (name, text, x, y, w, h, color, fontSize, extra = {}) => ({ id: nextId++, type: "text", name, text, x, y, w, h, color, fontSize, weight: "700", align: "center", fontFamily: "Tahoma", ...extra });
    const logoItems = [
      makeShape("خلفية اللوغو", "rounded", canvas.width * .12, canvas.height * .13, canvas.width * .76, canvas.height * .74, p.background),
      makeShape("لمسة اللوغو", logo.style === "organic" ? "leaf" : logo.style === "bold" ? "burst" : "circle", canvas.width * .35, canvas.height * .19, canvas.width * .3, canvas.height * .3, p.accent),
      makeText("رمز اللوغو", logo.mark, canvas.width * .39, canvas.height * .24, canvas.width * .22, canvas.height * .18, p.ink, Math.max(50, canvas.width * .105)),
      makeText("اسم اللوغو", logo.name, canvas.width * .18, canvas.height * .55, canvas.width * .64, canvas.height * .1, p.ink, Math.max(28, canvas.width * .052)),
      makeText("وصف اللوغو", "هوية تصنع الفرق", canvas.width * .22, canvas.height * .68, canvas.width * .56, canvas.height * .06, p.accent, Math.max(18, canvas.width * .026), { weight: "400" }),
      makeShape("خط اللوغو", "line", canvas.width * .36, canvas.height * .79, canvas.width * .28, 4, p.accent, { strokeWidth: 5 })
    ];
    items.push(...logoItems);
    selectItem(logoItems[2].id);
    draw(); remember(); setStatus("تمت إضافة لوغو قابل للتعديل");
    logoStudioDialog.close();
    showToast(`تمت إضافة ${logo.name} بطبقات قابلة للتعديل.`);
  }
  function renderLogoCatalog() {
    const results = filteredLogos();
    const totalPages = Math.max(1, Math.ceil(results.length / logoPageSize));
    logoPage = Math.min(logoPage, totalPages);
    const pageItems = results.slice((logoPage - 1) * logoPageSize, logoPage * logoPageSize);
    logoGrid.replaceChildren();
    pageItems.forEach(logo => {
      const card = document.createElement("button");
      card.type = "button"; card.className = "logo-card"; card.style.setProperty("--logo-bg", logo.palette.background); card.style.setProperty("--logo-accent", logo.palette.accent);
      card.innerHTML = `<span class="logo-card-mark">${logo.mark}</span><strong>${logo.name}</strong><small>${logo.industry} · ${logo.style}</small>`;
      card.addEventListener("click", () => addLogoToCanvas(logo)); logoGrid.append(card);
    });
    logoResultCount.textContent = `${results.length.toLocaleString("ar-EG")} شعار`;
    logoPageLabel.textContent = `${logoPage} / ${totalPages}`;
    logoEmptyResults.hidden = results.length > 0;
    document.getElementById("logo-prev").disabled = logoPage <= 1;
    document.getElementById("logo-next").disabled = logoPage >= totalPages;
  }
  document.getElementById("logo-studio-trigger").addEventListener("click", () => { logoPage = 1; renderLogoCatalog(); logoStudioDialog.showModal(); });
  document.getElementById("logo-studio-close").addEventListener("click", () => logoStudioDialog.close());
  logoSearch.addEventListener("input", () => { logoPage = 1; renderLogoCatalog(); });
  logoIndustryFilter.addEventListener("change", () => { logoPage = 1; renderLogoCatalog(); });
  logoStyleFilter.addEventListener("change", () => { logoPage = 1; renderLogoCatalog(); });
  document.getElementById("logo-prev").addEventListener("click", () => { logoPage--; renderLogoCatalog(); });
  document.getElementById("logo-next").addEventListener("click", () => { logoPage++; renderLogoCatalog(); });
  const settingsDialog = document.getElementById("settings-dialog");
  document.getElementById("settings-btn").addEventListener("click", () => { updateProjectStats(); settingsDialog.showModal(); });
  document.getElementById("settings-close").addEventListener("click", () => settingsDialog.close());
  settingsDialog.addEventListener("click", event => { if (event.target === settingsDialog) settingsDialog.close(); });
  document.querySelectorAll(".settings-tab").forEach(tab => tab.addEventListener("click", () => {
    const key = tab.dataset.settingsTab;
    document.querySelectorAll(".settings-tab").forEach(button => button.classList.toggle("active", button === tab));
    document.querySelectorAll(".settings-panel").forEach(panel => panel.classList.toggle("active", panel.dataset.settingsPanel === key));
  }));
  const applyTheme = theme => { document.body.dataset.theme = theme; try { localStorage.setItem("ak-theme", theme); } catch (error) { console.error("Could not save theme:", error); } };
  try { applyTheme(localStorage.getItem("ak-theme") || "light"); } catch (error) { applyTheme("light"); }
  document.getElementById("theme-toggle-btn").addEventListener("click", () => { applyTheme(document.body.dataset.theme === "light" ? "dark" : "light"); showToast("تم تحديث مظهر الموقع."); });
  document.getElementById("brand-kit-btn").addEventListener("click", () => { settingsDialog.showModal(); document.querySelector('[data-settings-tab="brand"]').click(); showToast("مركز هوية العلامة جاهز من الإعدادات."); });
  const brandNameInput = document.getElementById("brand-name-input");
  const brandPrimaryInput = document.getElementById("brand-primary-input");
  const brandAccentInput = document.getElementById("brand-accent-input");
  const brandFontInput = document.getElementById("brand-font-input");
  const loadBrandKit = () => { try { const kit = JSON.parse(localStorage.getItem("ak-brand-kit") || "{}"); if (brandNameInput) brandNameInput.value = kit.name || ""; if (brandPrimaryInput) brandPrimaryInput.value = kit.primary || "#477cff"; if (brandAccentInput) brandAccentInput.value = kit.accent || "#f59e0b"; if (brandFontInput) brandFontInput.value = kit.font || "Cairo"; } catch (error) { console.error("Could not load brand kit:", error); } };
  const readBrandKit = () => ({ name: brandNameInput?.value.trim() || "", primary: brandPrimaryInput?.value || "#477cff", accent: brandAccentInput?.value || "#f59e0b", font: brandFontInput?.value || "Cairo" });
  loadBrandKit();
  document.getElementById("save-brand-kit-btn").addEventListener("click", () => { const kit = readBrandKit(); localStorage.setItem("ak-brand-kit", JSON.stringify(kit)); document.documentElement.style.setProperty("--brand-accent", kit.primary); showToast("تم حفظ هوية العلامة على جهازك."); });
  document.getElementById("apply-brand-kit-btn").addEventListener("click", () => { const item = selected(); if (!item) { showToast("حدد عنصرًا أولًا لتطبيق الهوية."); return; } const kit = readBrandKit(); if (item.type === "text") { item.color = kit.primary; item.fontFamily = kit.font; } else if (item.type === "shape") item.color = kit.primary; draw(); renderProperties(); remember(); showToast("تم تطبيق هوية العلامة على العنصر."); });
  document.getElementById("restore-trash-btn").addEventListener("click", restoreLastDeleted);
  document.getElementById("save-version-btn").addEventListener("click", saveProject);
  document.getElementById("project-stats-btn").addEventListener("click", () => { updateProjectStats(); settingsDialog.showModal(); document.querySelector('[data-settings-tab="stats"]').click(); });
  document.getElementById("share-project-btn").addEventListener("click", async () => { try { const payload = JSON.stringify(serializeProject()); await navigator.clipboard?.writeText(payload); showToast("تم نسخ بيانات المشروع؛ أرسل معها ملف النسخة الاحتياطية."); } catch (error) { showToast("جهّز نسخة احتياطية للمشاركة من زر النسخة الاحتياطية."); } });
  document.getElementById("export-pack-btn").addEventListener("click", () => { document.getElementById("export-btn").click(); setTimeout(() => document.getElementById("backup-btn").click(), 250); showToast("بدأ تنزيل حزمة التسليم."); });
  document.getElementById("center-selection-btn").addEventListener("click", () => { const item = selected(); if (!item) { showToast("حدد عنصرًا أولًا لتوسيطة."); return; } item.x = Math.round((canvas.width - item.w) / 2); item.y = Math.round((canvas.height - item.h) / 2); draw(); remember(); setStatus("تم توسيط العنصر"); showToast("تم توسيط العنصر داخل اللوحة."); });
  document.getElementById("auto-arrange-btn")?.addEventListener("click", () => {
    if (!items.length) { showToast("أضف عناصر أولًا لترتيبها."); return; }
    const columns = Math.max(1, Math.ceil(Math.sqrt(items.length * canvas.width / Math.max(1, canvas.height))));
    const rows = Math.ceil(items.length / columns);
    const margin = Math.round(Math.min(canvas.width, canvas.height) * .06);
    const cellWidth = (canvas.width - margin * 2) / columns;
    const cellHeight = (canvas.height - margin * 2) / rows;
    items.forEach((item, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      item.x = Math.round(Math.max(margin, Math.min(canvas.width - item.w - margin, margin + column * cellWidth + (cellWidth - item.w) / 2)));
      item.y = Math.round(Math.max(margin, Math.min(canvas.height - item.h - margin, margin + row * cellHeight + (cellHeight - item.h) / 2)));
    });
    draw(); renderLayers(); renderProperties(); remember(); setStatus("تم ترتيب العناصر تلقائيًا"); showToast("تم توزيع العناصر داخل شبكة متوازنة.");
  });
  document.getElementById("duplicate-selection-btn").addEventListener("click", () => { const action = document.getElementById("selection-duplicate"); if (!selected() || !action || action.hidden) { showToast("حدد عنصرًا أولًا لنسخه."); return; } action.click(); });
  document.getElementById("clear-canvas-btn").addEventListener("click", () => { if (!items.length) { showToast("اللوحة فارغة أصلًا."); return; } if (!window.confirm("سيتم حذف كل العناصر من اللوحة. هل تريد المتابعة؟")) return; items = []; selectedId = null; renderLayers(); renderProperties(); draw(); remember(); setStatus("لوحة جديدة"); showToast("تم تنظيف اللوحة."); });
  document.getElementById("grid-toggle-btn").addEventListener("click", () => document.getElementById("toggle-guides").click());
  document.getElementById("quick-export-btn").addEventListener("click", () => document.getElementById("export-btn").click());
  const shapeGrid = document.getElementById("shape-grid");
  shapeCatalog.forEach(([shape, label, icon]) => {
    const button = document.createElement("button");
    button.type = "button"; button.className = "shape-button"; button.title = label; button.setAttribute("aria-label", `إضافة ${label}`);
    const glyph = document.createElement("span"); glyph.textContent = icon;
    const caption = document.createElement("span"); caption.textContent = label;
    button.append(glyph, caption);
    button.addEventListener("click", () => createItem("shape", shape));
    shapeGrid.append(button);
  });

  async function stopCamera() {
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    document.getElementById("scan-video").srcObject = null;
    document.getElementById("scan-modal").hidden = true;
  }
  document.getElementById("scan-trigger").addEventListener("click", async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast("الكاميرا تحتاج إلى HTTPS أو localhost ومتصفحاً يدعمها.");
      return;
    }
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      document.getElementById("scan-video").srcObject = cameraStream;
      document.getElementById("scan-modal").hidden = false;
    } catch (error) {
      console.error("Could not access camera:", error);
      showToast(error.name === "NotAllowedError" ? "لم يتم السماح باستخدام الكاميرا." : "تعذر تشغيل الكاميرا على هذا الجهاز.");
    }
  });
  document.getElementById("scan-close").addEventListener("click", stopCamera);
  document.getElementById("scan-cancel").addEventListener("click", stopCamera);
  document.getElementById("scan-modal").addEventListener("click", event => { if (event.target.id === "scan-modal") stopCamera(); });
  document.getElementById("scan-capture").addEventListener("click", () => {
    const video = document.getElementById("scan-video");
    if (!video.videoWidth || !video.videoHeight) { showToast("انتظر حتى تصبح الكاميرا جاهزة."); return; }
    const captured = document.createElement("canvas");
    const scale = Math.min(1, 2400 / video.videoWidth, 2400 / video.videoHeight);
    captured.width = Math.round(video.videoWidth * scale); captured.height = Math.round(video.videoHeight * scale);
    captured.getContext("2d").drawImage(video, 0, 0, captured.width, captured.height);
    const src = captured.toDataURL("image/jpeg", .9);
    const image = new Image();
    image.onload = () => {
      const item = { id: nextId++, type: "image", name: "صورة ممسوحة", x: 0, y: 0, w: canvas.width, h: canvas.height, fit: "cover", color: "#ffffff", image, src, adjustments: { brightness: 0, contrast: 0, temperature: 0, shadows: 0, saturation: 100, tone: "natural" } };
      imageSources.set(item.id, src);
      items.push(item); selectItem(item.id); draw(); remember(); setStatus("تعديلات غير محفوظة"); stopCamera(); showToast("تم التقاط الصورة وإضافتها للتصميم.");
    };
    image.onerror = () => showToast("تعذر معالجة الصورة الملتقطة.");
    image.src = src;
  });

  bgInput.addEventListener("input", () => {
    background = bgInput.value;
    document.getElementById("bg-hex").textContent = background.toUpperCase();
    draw(); setStatus("تعديلات غير محفوظة");
  });
  bgInput.addEventListener("change", remember);
  document.getElementById("clear-background-image").addEventListener("click", () => {
    if (!backgroundImage) { showToast("لا توجد صورة خلفية لإزالتها."); return; }
    backgroundImage = null; draw(); remember(); setStatus("تعديلات غير محفوظة");
    showToast("تمت إزالة صورة الخلفية.");
  });
  document.querySelectorAll(".swatch").forEach(button => button.addEventListener("click", () => {
    background = button.dataset.bg; bgInput.value = background;
    document.getElementById("bg-hex").textContent = background.toUpperCase();
    draw(); remember(); setStatus("تعديلات غير محفوظة");
  }));
  sizeSelect.addEventListener("change", () => setCanvasSize(sizeSelect.value));
  function setZoom(value) {
    canvasZoom = Math.max(.4, Math.min(2.5, value));
    canvasFrame.style.transform = `scale(${canvasZoom})`;
    const zoomLabel = document.getElementById("zoom-fit");
    zoomLabel.textContent = `${Math.round(canvasZoom * 100)}%`;
    zoomLabel.setAttribute("aria-label", `التكبير ${Math.round(canvasZoom * 100)} بالمئة - اضغط للملاءمة`);
    updateSelectionToolbar();
  }
  document.getElementById("zoom-in").addEventListener("click", () => setZoom(canvasZoom + .1));
  document.getElementById("zoom-out").addEventListener("click", () => setZoom(canvasZoom - .1));
  document.getElementById("zoom-fit").addEventListener("click", () => setZoom(1));
  document.getElementById("toggle-guides").addEventListener("click", event => {
    guidesVisible = !guidesVisible;
    event.currentTarget.classList.toggle("active", guidesVisible);
    event.currentTarget.title = guidesVisible ? "إخفاء الأدلة" : "إظهار الأدلة";
    draw();
  });
  document.getElementById("undo-btn").addEventListener("click", () => undoRedo(-1));
  document.getElementById("redo-btn").addEventListener("click", () => undoRedo(1));

  const mobileSheet = document.getElementById("mobile-editor-sheet");
  const mobileSheetContent = document.getElementById("mobile-sheet-content");
  const mobileToolsBackdrop = document.getElementById("mobile-tool-backdrop");
  const mobilePanelOriginals = new Map();
  let activeMobilePanel = null;
  const mobileViewport = window.visualViewport;
  let mobilePanelViewportHeight = 0;
  function updateMobileKeyboardLayout() {
    if (mobileSheet.hidden || !mobilePanelViewportHeight) {
      document.body.classList.remove("mobile-keyboard-open");
      document.documentElement.style.removeProperty("--mobile-visual-viewport-height");
      document.documentElement.style.removeProperty("--mobile-visual-viewport-top");
      return;
    }
    const viewportHeight = mobileViewport?.height || window.innerHeight;
    const keyboardOpen = mobilePanelViewportHeight - viewportHeight > 120;
    document.body.classList.toggle("mobile-keyboard-open", keyboardOpen);
    if (keyboardOpen) {
      document.documentElement.style.setProperty("--mobile-visual-viewport-height", `${viewportHeight}px`);
      document.documentElement.style.setProperty("--mobile-visual-viewport-top", `${mobileViewport?.offsetTop || 0}px`);
    } else {
      document.documentElement.style.removeProperty("--mobile-visual-viewport-height");
      document.documentElement.style.removeProperty("--mobile-visual-viewport-top");
    }
  }
  mobileViewport?.addEventListener("resize", updateMobileKeyboardLayout);
  mobileViewport?.addEventListener("scroll", updateMobileKeyboardLayout);
  window.addEventListener("resize", updateMobileKeyboardLayout);
  window.addEventListener("orientationchange", () => {
    if (!document.body.classList.contains("mobile-keyboard-open")) {
      mobilePanelViewportHeight = mobileViewport?.height || window.innerHeight;
    }
    updateMobileKeyboardLayout();
  });
  const mobilePanelDefinitions = {
    elements: { title: "العناصر والقوالب العربية", nodes: [document.querySelector(".ak-system-panel"), document.querySelector(".shape-picker")] },
    background: { title: "الخلفية", nodes: [document.querySelector(".color-panel")] },
    size: { title: "مقاس التصميم", nodes: [sizeSelect.closest(".panel")] },
    layers: { title: "طبقات التصميم", nodes: [document.querySelector(".layers-panel")] },
    settings: { title: "خصائص العنصر", nodes: [document.querySelector(".properties-heading"), propertyContent] },
    download: { title: "تنزيل التصميم", nodes: [document.getElementById("export-btn"), document.getElementById("export-jpg-btn"), document.getElementById("export-transparent-btn"), document.getElementById("export-svg-btn"), document.getElementById("backup-btn"), document.getElementById("open-project-btn")] },
    more: { title: "أدوات إضافية", nodes: [] }
  };
  function rememberMobilePanelPositions(definition) {
    definition.nodes.forEach(node => {
      if (!mobilePanelOriginals.has(node)) mobilePanelOriginals.set(node, { parent: node.parentNode, next: node.nextSibling });
    });
  }
  function restoreMobilePanels() {
    [...mobilePanelOriginals.entries()].reverse().forEach(([node, position]) => {
      if (!position.parent) return;
      position.parent.insertBefore(node, position.next && position.next.parentNode === position.parent ? position.next : null);
    });
    mobilePanelOriginals.clear();
    mobileSheetContent.replaceChildren();
  }
  function closeMobilePanel() {
    mobileSheet.hidden = true;
    mobileToolsBackdrop.hidden = true;
    document.body.classList.remove("mobile-tools-open");
    document.body.classList.remove("tablet-text-editor-open");
    document.body.classList.remove("mobile-keyboard-open");
    mobilePanelViewportHeight = 0;
    document.documentElement.style.removeProperty("--mobile-visual-viewport-height");
    document.documentElement.style.removeProperty("--mobile-visual-viewport-top");
    restoreMobilePanels();
    activeMobilePanel = null;
    document.querySelectorAll(".mobile-dock button").forEach(button => button.classList.remove("active"));
  }
  function openMobilePanel(key, button) {
    if (activeMobilePanel === key) {
      closeMobilePanel();
      return;
    }
    if (activeMobilePanel) restoreMobilePanels();
    const definition = mobilePanelDefinitions[key];
    if (!definition) return;
    rememberMobilePanelPositions(definition);
    document.getElementById("mobile-sheet-title").textContent = definition.title;
    definition.nodes.forEach(node => mobileSheetContent.append(node));
    if (key === "download") {
      const downloads = document.createElement("div");
      downloads.className = "mobile-download-actions";
      mobileSheetContent.append(downloads);
      definition.nodes.forEach(node => downloads.append(node));
      const note = document.createElement("p");
      note.className = "mobile-download-note";
      note.textContent = "احفظ التصميم كصورة أو نزّل نسخة احتياطية لاستعادته لاحقاً.";
      mobileSheetContent.append(note);
    }
    if (key === "elements") document.querySelector(".shape-picker").open = true;
    if (key === "background") {
      const uploadButton = document.createElement("button");
      uploadButton.type = "button";
      uploadButton.className = "background-photo-action";
      uploadButton.innerHTML = "<span>▧</span><strong>اختيار صورة للخلفية</strong><small>اختر صورة من جهازك</small>";
      uploadButton.addEventListener("click", () => backgroundUpload.click());
      mobileSheetContent.prepend(uploadButton);
    }
    if (key === "more") {
      const actions = document.createElement("div");
      actions.className = "mobile-more-actions";
      const shortcuts = [
        ["size", "▦", "مقاس التصميم"],
        ["layers", "☷", "الطبقات"],
        ["settings", "⚙", "خصائص العنصر"],
        ["download", "↓", "التنزيل والنسخ الاحتياطي"],
        ["auto-arrange", "⌘", "ترتيب ذكي للعناصر"],
        ["camera", "▣", "مسح بالكاميرا"],
        ["social", "◎", "بطاقة التواصل"],
        ["command", "⌘", "البحث السريع"],
        ["tools-center", "✦", "مركز الأدوات"],
        ["review", "✓", "مراجع التصميم"],
        ["pro", "✦", "مكتبة التصاميم"],
      ];
      shortcuts.forEach(([action, icon, label]) => {
        const shortcut = document.createElement("button");
        shortcut.type = "button";
        shortcut.className = "mobile-more-action";
        shortcut.innerHTML = `<span>${icon}</span><strong>${label}</strong><b>‹</b>`;
        shortcut.addEventListener("click", () => {
          if (action === "performance") {
            document.getElementById("performance-mode-toggle").click();
            return;
          }
          if (action === "camera" || action === "social" || action === "pro") {
            document.querySelector(`[data-mobile-action="${action}"]`).click();
            return;
          }
          if (action === "command") {
            document.getElementById("command-btn")?.click();
            return;
          }
          if (action === "tools-center") {
            document.getElementById("tools-center-btn")?.click();
            return;
          }
          if (action === "review") {
            runDesignReview();
            return;
          }
          if (action === "auto-arrange") {
            document.getElementById("auto-arrange-btn")?.click();
            return;
          }
          const target = document.querySelector(`[data-mobile-panel="${action}"]`);
          openMobilePanel(action, target);
        });
        actions.append(shortcut);
      });
      mobileSheetContent.append(actions);
    }
    if (key === "settings" && selected()?.type === "image") {
      const adjustmentDetails = propertyContent.querySelector(".image-adjustments");
      if (adjustmentDetails) adjustmentDetails.open = true;
    }
    mobileSheet.hidden = false;
    mobileToolsBackdrop.hidden = false;
    document.body.classList.add("mobile-tools-open");
    activeMobilePanel = key;
    mobilePanelViewportHeight = mobileViewport?.height || window.innerHeight;
    updateMobileKeyboardLayout();
    document.querySelectorAll(".mobile-dock button").forEach(dockButton => dockButton.classList.toggle("active", dockButton === button));
  }
  document.querySelectorAll(".mobile-dock [data-mobile-panel]").forEach(button => {
    button.addEventListener("click", () => openMobilePanel(button.dataset.mobilePanel, button));
  });
  document.querySelectorAll(".mobile-dock [data-mobile-action]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.mobileAction === "text") createItem("text");
      else if (button.dataset.mobileAction === "image") uploadInput.click();
      else if (button.dataset.mobileAction === "camera") document.getElementById("scan-trigger").click();
      else if (button.dataset.mobileAction === "social") document.getElementById("add-social-links").click();
      else if (button.dataset.mobileAction === "pro") document.getElementById("pro-entry-btn").click();
      closeMobilePanel();
    });
  });
  document.getElementById("mobile-sheet-close").addEventListener("click", closeMobilePanel);
  mobileToolsBackdrop.addEventListener("click", closeMobilePanel);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && activeMobilePanel) closeMobilePanel();
  });

  document.addEventListener("keydown", event => {
    const target = event.target;
    const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target.isContentEditable;
    if (editing || document.querySelector("dialog[open]") || activeMobilePanel) return;
    const command = event.ctrlKey || event.metaKey;
    const item = selected();
    if (command && event.key.toLowerCase() === "s") { event.preventDefault(); saveProject(); return; }
    if (command && event.key.toLowerCase() === "d") { event.preventDefault(); duplicateSelected(); return; }
    if (command && event.key.toLowerCase() === "z") { event.preventDefault(); undoRedo(event.shiftKey ? 1 : -1); return; }
    if (command && event.key.toLowerCase() === "y") { event.preventDefault(); undoRedo(1); return; }
    if (command && event.key === "]" && item) {
      event.preventDefault(); const index = items.indexOf(item);
      if (index < items.length - 1) { items.splice(index, 1); items.splice(index + 1, 0, item); renderLayers(); draw(); remember(); }
      return;
    }
    if (command && event.key === "[" && item) {
      event.preventDefault(); const index = items.indexOf(item);
      if (index > 0) { items.splice(index, 1); items.splice(index - 1, 0, item); renderLayers(); draw(); remember(); }
      return;
    }
    if (item && event.altKey && event.key.startsWith("Arrow")) {
      event.preventDefault(); item.rotation = (Number(item.rotation) || 0) + (event.shiftKey ? 15 : 1) * (event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1);
      draw(); renderProperties(); remember(); setStatus("تعديلات غير محفوظة"); return;
    }
    if (item && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault(); const step = event.shiftKey ? 10 : 1;
      if (event.key === "ArrowLeft") item.x -= step;
      if (event.key === "ArrowRight") item.x += step;
      if (event.key === "ArrowUp") item.y -= step;
      if (event.key === "ArrowDown") item.y += step;
      item.x = Math.max(0, Math.min(canvas.width - item.w, item.x));
      item.y = Math.max(0, Math.min(canvas.height - item.h, item.y));
      draw(); renderProperties(); remember(); setStatus("تعديلات غير محفوظة"); return;
    }
    if ((event.key === "Delete" || event.key === "Backspace") && selectedId !== null) { event.preventDefault(); deleteItem(selectedId); }
    if (event.key === "Escape" && selectedId !== null) { selectedId = null; renderLayers(); renderProperties(); draw(); }
  });

  function serializeProject() {
    return {
      format: "ak-designer-project",
      version: 1,
      width: canvas.width,
      height: canvas.height,
      background,
      backgroundImageSrc: backgroundImage?.src || null,
      backgroundImageId: backgroundImage?.id || null,
      items: items.map(({ image, previewCanvas, ...item }) => ({ ...item, src: imageSources.get(item.id) || item.src }))
    };
  }
  function persistProjectLocally() {
    localStorage.setItem("masaha-project", JSON.stringify(serializeProject()));
  }
  function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      try {
        persistProjectLocally();
        autoSaveWarningShown = false;
        setStatus("تم الحفظ تلقائياً");
      } catch (error) {
        console.error("Could not autosave project locally:", error);
        setStatus("تعذر الحفظ التلقائي");
        if (!autoSaveWarningShown) {
          showToast("تعذر الحفظ التلقائي؛ نزّل نسخة احتياطية قبل مغادرة الصفحة.");
          autoSaveWarningShown = true;
        }
      }
    }, 700);
  }
  function saveProject() {
    clearTimeout(autoSaveTimer);
    try {
      persistProjectLocally();
      autoSaveWarningShown = false;
      setStatus("تم حفظ المشروع");
      showToast("تم حفظ تصميمك على هذا الجهاز.");
    } catch (error) {
      console.error("Could not save project locally:", error);
      setStatus("تعذر حفظ المشروع");
      showToast("تعذر حفظ المشروع. نزّل نسخة احتياطية أو أزل صوراً كبيرة.");
    }
  }
  window.addEventListener("pagehide", () => {
    clearTimeout(autoSaveTimer);
    try {
      persistProjectLocally();
    } catch (error) {
      console.error("Could not save project before leaving:", error);
    }
  });
  function hydrateItem(item) {
    const src = item.src || imageSources.get(item.id);
    if (item.type !== "image" || !src) return item;
    imageSources.set(item.id, src);
    const image = new Image();
    image.onload = draw;
    image.onerror = () => showToast(`تعذر تحميل الصورة: ${item.name}`);
    image.src = src;
    return { ...item, image, src };
  }
  function hydrateBackground(src, id = nextBackgroundImageId++) {
    if (!src) return null;
    backgroundSources.set(id, src);
    nextBackgroundImageId = Math.max(nextBackgroundImageId, id + 1);
    const image = new Image();
    image.onload = draw;
    image.onerror = () => showToast("تعذر تحميل صورة الخلفية المحفوظة.");
    image.src = src;
    return { image, src, id };
  }
  function isSafeImageSource(source) {
    return typeof source === "string" && source.length <= 24_000_000 && /^data:image\/(?:png|jpeg|webp|gif|svg\+xml);base64,/i.test(source);
  }
  function validateProject(project) {
    if (!project || !Number.isInteger(project.width) || !Number.isInteger(project.height) ||
        project.width < 1 || project.height < 1 || project.width > 4096 || project.height > 4096 ||
        project.width * project.height > 16_777_216 || !Array.isArray(project.items) || project.items.length > 500) {
      throw new Error("Invalid project dimensions or item count");
    }
    if (project.background !== undefined && !/^#[0-9a-f]{6}$/i.test(project.background)) throw new Error("Invalid background color");
    if (project.backgroundImageSrc && !isSafeImageSource(project.backgroundImageSrc)) throw new Error("Invalid background image");
    if (project.backgroundImageId !== undefined && project.backgroundImageId !== null &&
        (!Number.isSafeInteger(project.backgroundImageId) || project.backgroundImageId < 1)) throw new Error("Invalid background image ID");
    const ids = new Set();
    for (const item of project.items) {
      if (!item || !Number.isSafeInteger(item.id) || item.id < 1 || ids.has(item.id) ||
          !["text", "shape", "image"].includes(item.type) ||
          ![item.x, item.y, item.w, item.h].every(Number.isFinite) ||
          item.x < 0 || item.y < 0 || item.w <= 0 || item.h <= 0 ||
          item.x > project.width || item.y > project.height || item.w > project.width * 2 || item.h > project.height * 2) {
        throw new Error("Invalid project item");
      }
      ids.add(item.id);
      if (item.type === "image" && !isSafeImageSource(item.src)) throw new Error("Invalid project image");
      if (item.type === "shape" && !shapeCatalog.some(shape => shape[0] === item.shape)) throw new Error("Invalid project shape");
      if (item.type === "text" && (typeof item.text !== "string" || item.text.length > 500 || !Number.isFinite(item.fontSize) || item.fontSize < 1 || item.fontSize > 2048)) {
        throw new Error("Invalid project text");
      }
      if (item.color !== undefined && !/^#[0-9a-f]{6}$/i.test(item.color)) throw new Error("Invalid item color");
    }
    return project;
  }
  function restoreProject(project) {
    validateProject(project);
    clearTimeout(autoSaveTimer);
    canvas.width = project.width;
    canvas.height = project.height;
    background = project.background || "#ffffff";
    backgroundImage = hydrateBackground(project.backgroundImageSrc, project.backgroundImageId || undefined);
    imageSources.clear();
    project.items.forEach(item => { if (item.type === "image") imageSources.set(item.id, item.src); });
    items = project.items.map(hydrateItem);
    selectedId = null;
    nextId = Math.max(0, ...items.map(item => item.id)) + 1;
    const size = `${canvas.width}x${canvas.height}`;
    if ([...sizeSelect.options].some(option => option.value === size)) sizeSelect.value = size;
    bgInput.value = background;
    document.getElementById("bg-hex").textContent = background.toUpperCase();
    document.getElementById("dimension-label").textContent = `${canvas.width} × ${canvas.height}`;
    history = [];
    historyIndex = -1;
    renderLayers(); renderProperties(); draw(); remember();
  }
  function loadProject() {
    try {
      const raw = localStorage.getItem("masaha-project");
      if (!raw) return false;
      restoreProject(JSON.parse(raw));
      return true;
    } catch (error) {
      console.error("Could not load saved project:", error);
      showToast("تعذر فتح المشروع المحفوظ؛ ابدأ تصميماً جديداً.");
      return false;
    }
  }
  document.getElementById("save-btn").addEventListener("click", saveProject);
  document.getElementById("backup-btn").addEventListener("click", () => {
    try {
      const blob = new Blob([JSON.stringify(serializeProject())], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ak-designer-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("تم تنزيل نسخة احتياطية قابلة للاستعادة.");
    } catch (error) {
      console.error("Could not export project backup:", error);
      showToast("تعذر إنشاء النسخة الاحتياطية.");
    }
  });
  const projectUpload = document.getElementById("project-upload");
  document.getElementById("open-project-btn").addEventListener("click", () => projectUpload.click());
  projectUpload.addEventListener("change", () => {
    const file = projectUpload.files && projectUpload.files[0];
    projectUpload.value = "";
    if (!file) return;
    if (file.size > 30_000_000) {
      showToast("حجم ملف المشروع أكبر من الحد المسموح (30 ميغابايت).");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => showToast("تعذرت قراءة ملف المشروع.");
    reader.onload = () => {
      try {
        const project = validateProject(JSON.parse(reader.result));
        if (!window.confirm("فتح هذه النسخة سيستبدل التصميم الحالي. تأكد من تنزيل نسخة احتياطية إذا أردت الاحتفاظ به. هل تريد المتابعة؟")) return;
        restoreProject(project);
        saveProject();
        showToast("تم فتح المشروع وحفظه على هذا الجهاز.");
      } catch (error) {
        console.error("Could not import project backup:", error);
        showToast("ملف المشروع غير صالح أو غير مدعوم؛ لم يتغير التصميم الحالي.");
      }
    };
    reader.readAsText(file);
  });
  function createExportCanvas(transparent = false) {
    const output = document.createElement("canvas");
    output.width = canvas.width; output.height = canvas.height;
    const outputCtx = output.getContext("2d");
    if (!transparent) drawBackground(outputCtx);
    for (const item of items) {
      outputCtx.save();
      outputCtx.globalAlpha = Number.isFinite(Number(item.opacity)) ? Number(item.opacity) / 100 : 1;
      outputCtx.translate(item.x + item.w / 2, item.y + item.h / 2);
      outputCtx.rotate((Number(item.rotation) || 0) * Math.PI / 180);
      outputCtx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1);
      outputCtx.translate(-item.w / 2, -item.h / 2);
      outputCtx.shadowColor = item.shadow ? "rgba(0,0,0,.3)" : "transparent";
      outputCtx.shadowBlur = item.shadow ? Math.max(0, Number(item.shadowBlur) || 12) : 0;
      outputCtx.shadowOffsetY = item.shadow ? Math.max(2, (Number(item.shadowBlur) || 12) * .35) : 0;
      const localItem = { ...item, x: 0, y: 0 };
      if (item.type === "shape") drawShape(outputCtx, localItem);
      else if (item.type === "image" && item.image && item.image.complete) {
        if (!item.previewCanvas && item.adjustments) buildImagePreview(item);
        outputCtx.filter = "none";
        drawImageInBox(outputCtx, item.previewCanvas || item.image, localItem);
      }
      else if (item.type === "text") {
        outputCtx.font = `${item.italic ? "italic " : ""}${item.weight || "600"} ${item.fontSize}px "${item.fontFamily || "Tahoma"}", Tahoma, Arial, sans-serif`;
        if ("letterSpacing" in outputCtx) outputCtx.letterSpacing = `${Number(item.letterSpacing) || 0}px`;
        outputCtx.textBaseline = "top"; outputCtx.direction = "rtl";
        outputCtx.textAlign = item.align || "right";
        const textX = item.align === "center" ? item.w / 2 : item.align === "left" ? 0 : item.w;
        const fill = item.textGradient ? outputCtx.createLinearGradient(0, 0, item.w, 0) : null;
        if (fill) { fill.addColorStop(0, item.color || "#18243b"); fill.addColorStop(1, item.textGradient); }
        outputCtx.fillStyle = fill || item.color;
        item.text.split("\n").forEach((line, index) => {
          const y = index * (Number(item.lineHeight) || 1.35) * item.fontSize;
          if (item.textOutline) { outputCtx.strokeStyle = item.textOutline; outputCtx.lineWidth = Math.max(1, Number(item.textOutlineWidth) || 4); outputCtx.lineJoin = "round"; outputCtx.strokeText(line, textX, y, item.w); }
          outputCtx.fillText(line, textX, y, item.w);
        });
      }
      outputCtx.restore();
    }
    // Brand signature is included in every exported image, including transparent PNGs.
    outputCtx.save();
    const brandSize = Math.max(18, Math.round(canvas.width * .018));
    const brandPadding = Math.max(16, Math.round(canvas.width * .022));
    outputCtx.font = `700 ${brandSize}px Arial, sans-serif`;
    outputCtx.textAlign = "right";
    outputCtx.textBaseline = "bottom";
    outputCtx.fillStyle = transparent ? "rgba(24,36,59,.82)" : "rgba(255,255,255,.82)";
    outputCtx.fillText("AK DESIGNER  ·  @Ahmad_abuamr07", canvas.width - brandPadding, canvas.height - brandPadding);
    outputCtx.restore();
    return output;
  }

  function downloadDesign(format, transparent = false) {
    const output = createExportCanvas(transparent);
    const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
    const extension = format === "jpg" ? "jpg" : "png";
    output.toBlob(blob => {
      if (!blob) { showToast("تعذر إنشاء ملف الصورة."); return; }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `ak-designer-${Date.now()}${transparent ? "-transparent" : ""}.${extension}`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      showToast(`بدأ تحميل التصميم بصيغة ${extension.toUpperCase()}.`);
    }, mimeType, format === "jpg" ? .92 : undefined);
  }
  function createExportSvg() {
    if (backgroundImage || items.some(item => item.type === "image")) {
      throw new Error("SVG export supports editable text and shapes only; remove image layers first.");
    }
    const pathData = {
      triangle: "M50 0 L100 100 L0 100 Z", rightTriangle: "M0 0 L0 100 L100 100 Z",
      diamond: "M50 0 L100 50 L50 100 L0 50 Z", pentagon: "M50 2 L98 38 L80 96 L20 96 L2 38 Z",
      hexagon: "M25 2 L75 2 L100 50 L75 98 L25 98 L0 50 Z", octagon: "M28 0 L72 0 L100 28 L100 72 L72 100 L28 100 L0 72 L0 28 Z",
      shield: "M8 0 L92 0 L88 60 L50 100 L12 60 Z", star: "M50 0 L61 35 L98 36 L68 59 L79 96 L50 74 L20 96 L31 59 L2 36 L39 35 Z",
      heart: "M50 95 C35 79 4 59 4 31 C4 2 38 -5 50 23 C64 -5 97 2 97 31 C97 59 66 79 50 95 Z",
      chevron: "M0 0 L48 0 L100 50 L48 100 L0 100 L52 50 Z",
      flag: "M20 100 L20 0 L88 12 L20 42 Z",
      lightning: "M58 0 L15 57 L43 57 L30 100 L85 38 L56 38 Z",
      burst: "M50 0 L56 26 L70 8 L68 35 L92 22 L78 45 L100 50 L77 57 L94 78 L69 68 L71 96 L55 76 L49 100 L44 76 L25 95 L31 68 L7 79 L23 57 L0 50 L24 44 L7 22 L32 34 L29 6 L46 26 Z",
      star6: "M50 0 L62 28 L94 8 L79 40 L100 50 L79 62 L94 92 L62 76 L50 100 L38 76 L6 92 L21 62 L0 50 L21 40 L6 8 L38 28 Z",
      star8: "M50 0 L60 33 L85 15 L70 41 L100 50 L70 59 L85 85 L60 67 L50 100 L40 67 L15 85 L30 59 L0 50 L30 41 L15 15 L40 33 Z",
      cube: "M50 0 L95 25 L95 75 L50 100 L5 75 L5 25 Z"
    };
    const escape = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" })[character]);
    const textMeasureContext = document.createElement("canvas").getContext("2d");
    const markup = items.map(item => {
      const opacity = Number.isFinite(item.opacity) ? item.opacity / 100 : 1;
      const rotation = Number(item.rotation) || 0;
      const transform = rotation ? ` rotate(${rotation} ${item.x + item.w / 2} ${item.y + item.h / 2})` : "";
      if (item.type === "text") {
        const align = item.align || "right";
        const anchor = align === "center" ? "middle" : align === "left" ? "end" : "start";
        const x = align === "center" ? item.x + item.w / 2 : align === "left" ? item.x : item.x + item.w;
        const fontFamily = item.fontFamily || "Tahoma";
        textMeasureContext.font = `${item.weight || "600"} ${item.fontSize}px "${fontFamily}", Tahoma, Arial, sans-serif`;
        if ("letterSpacing" in textMeasureContext) textMeasureContext.letterSpacing = `${Number(item.letterSpacing) || 0}px`;
        const lines = item.text.split("\n").map((line, index) => {
          const fit = textMeasureContext.measureText(line).width > item.w ? ` textLength="${item.w}" lengthAdjust="spacingAndGlyphs"` : "";
          return `<tspan x="${x}" dy="${index ? (item.lineHeight || 1.35) * item.fontSize : 0}"${fit}>${escape(line)}</tspan>`;
        }).join("");
        return `<text x="${x}" y="${item.y}" fill="${item.color}" font-family="${escape(fontFamily)},Tahoma,Arial,sans-serif" font-size="${item.fontSize}" font-weight="${escape(item.weight || "600")}" text-anchor="${anchor}" dominant-baseline="hanging" direction="rtl" unicode-bidi="plaintext" opacity="${opacity}" transform="${transform.trim()}">${lines}</text>`;
      }
      const fill = item.fillMode === "outline" ? "none" : item.color;
      const stroke = item.strokeColor || item.color;
      const strokeWidth = Number(item.strokeWidth) || 0;
      const svgAliases = { badgeCircle: "circle", badgeHex: "hexagon", ticket: "rounded", tag: "parallelogram", ribbon: "capsule", droplet: "heart", leaf: "ellipse", sun: "burst", gear: "star8", flower: "star6", star4: "star", star10: "star8", star12: "burst", seal: "octagon", emblem: "circle", triangleDown: "downArrow", triangleLeft: "leftArrow", triangleRight: "arrow", diamondWide: "diamond", hexTall: "hexagon", ovalFrame: "ellipse", pillFrame: "capsule", frame: "rectangle", doubleRing: "ring", dot: "circle", wave: "arc", arcWide: "arc", halfCircle: "arc", quarterCircle: "arc", bracket: "chevron", parenthesis: "arc", slash: "line", crossThin: "cross", plusRound: "plus", pointer: "arrow", doubleArrow: "arrow", chevronDouble: "chevron", callout: "speech", cloudSmall: "cloud", heartSmall: "heart", lightningWide: "lightning", capsuleTall: "capsule", parallelogramTall: "parallelogram", polygon3: "triangle", polygon4: "diamond", polygon5: "pentagon", polygon6: "hexagon", polygon8: "octagon", burstSmall: "burst", burstLarge: "burst", corner: "line", bracketRound: "arc", badgeStar: "star", medallion: "diamond", rays: "burst" };
      const geometry = svgAliases[item.shape] || item.shape;
      const common = `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"`;
      const localTransform = `translate(${item.x} ${item.y})${rotation ? ` rotate(${rotation} ${item.w / 2} ${item.h / 2})` : ""}`;
      if (geometry === "circle" || geometry === "ellipse" || geometry === "arc") return `<ellipse cx="${item.w / 2}" cy="${item.h / 2}" rx="${item.w * .48}" ry="${item.h * .48}" fill="${geometry === "arc" ? "none" : fill}" stroke="${stroke}" stroke-width="${strokeWidth || (geometry === "arc" ? 5 : 0)}" opacity="${opacity}" transform="${localTransform}"/>`;
      if (geometry === "rounded" || geometry === "capsule" || geometry === "rectangle") {
        const radius = geometry === "capsule" ? Math.min(item.w, item.h) / 2 : geometry === "rounded" ? Math.min(item.w, item.h) * .14 : 0;
        return `<rect width="${item.w}" height="${item.h}" rx="${radius}" ${common} transform="${localTransform}"/>`;
      }
      if (geometry === "line") return `<path d="M0 ${item.h} L${item.w} 0" fill="none" stroke="${stroke}" stroke-width="${strokeWidth || 5}" stroke-linecap="round" opacity="${opacity}" transform="${localTransform}"/>`;
      if (geometry === "ring") return `<path d="M${item.w / 2} ${item.h * .02} a${item.w * .48} ${item.h * .48} 0 1 0 0 ${item.h * .96} a${item.w * .48} ${item.h * .48} 0 1 0 0 ${-item.h * .96} M${item.w / 2} ${item.h * .23} a${item.w * .27} ${item.h * .27} 0 1 1 0 ${item.h * .54} a${item.w * .27} ${item.h * .27} 0 1 1 0 ${-item.h * .54}" fill="${fill}" fill-rule="evenodd" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" transform="${localTransform}"/>`;
      const path = pathData[geometry];
      if (path) return `<path d="${path}" ${common} transform="translate(${item.x} ${item.y}) scale(${item.w / 100} ${item.h / 100})${rotation ? ` rotate(${rotation} ${50} ${50})` : ""}"/>`;
      throw new Error(`SVG export does not support the "${geometry}" shape.`);
    }).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">${markup}</svg>`;
  }
  // Extra studio tools: the first release already included templates, autosave, dark theme,
  // mobile layout and keyboard shortcuts; these controls expose the remaining workflows.
  const wireStudioTools = () => {
    const open = id => document.getElementById(id);
    const ensureSelected = type => {
      let item = selected();
      if ((!item || (type && item.type !== type))) item = items.find(entry => !type || entry.type === type);
      if (item && item.id !== selectedId) selectItem(item.id);
      return item;
    };
    open("smart-tools-link")?.addEventListener("click", () => open("smart-tools-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    open("open-templates-btn")?.addEventListener("click", () => openProLibrary());
    open("crop-image-btn")?.addEventListener("click", () => {
      const item = ensureSelected("image");
      if (!item || item.type !== "image") { showToast("حدد صورة أولًا لقصّها."); return; }
      item.cropX = ((Number.isFinite(item.cropX) ? item.cropX : .5) + .25) % 1;
      item.cropY = ((Number.isFinite(item.cropY) ? item.cropY : .5) + .15) % 1;
      item.previewCanvas = null; draw(); renderProperties(); remember(); showToast("تم تغيير موضع القص؛ جرّب الزر مرة أخرى للنتيجة التالية.");
    });
    const updateImageFromBlob = (item, blob, message) => {
      const src = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        const oldSrc = imageSources.get(item.id);
        if (oldSrc?.startsWith("blob:")) URL.revokeObjectURL(oldSrc);
        item.image = image; item.src = src; imageSources.set(item.id, src); item.previewCanvas = null;
        draw(); renderProperties(); remember(); showToast(message);
      };
      image.onerror = () => { URL.revokeObjectURL(src); showToast("تعذر قراءة الصورة الناتجة."); };
      image.src = src;
    };
    const imageCanvasBlob = source => new Promise((resolve, reject) => source.toBlob(blob => blob ? resolve(blob) : reject(new Error("image-blob-failed")), "image/png"));
    const removeBackgroundLocally = (item, source) => {
      const imageCtx = source.getContext("2d", { willReadFrequently: true });
      imageCtx.drawImage(item.image, 0, 0, source.width, source.height);
      const data = imageCtx.getImageData(0, 0, source.width, source.height); const pixels = data.data;
      for (let i = 0; i < pixels.length; i += 4) { const nearWhite = pixels[i] > 232 && pixels[i + 1] > 232 && pixels[i + 2] > 232; if (nearWhite) pixels[i + 3] = 0; }
      imageCtx.putImageData(data, 0, 0); updateImageFromBlob(item, new Blob([data.data], { type: "application/octet-stream" }), "تمت إزالة الخلفية البيضاء محليًا.");
    };
    if (false) {
      (async () => {
      const item = ensureSelected("image");
      if (!item || item.type !== "image" || !item.image) { showToast("حدد صورة أولًا لإزالة خلفيتها."); return; }
      const button = open("remove-bg-btn"); const originalLabel = button?.querySelector("strong")?.textContent;
      if (button) { button.disabled = true; const label = button.querySelector("strong"); if (label) label.textContent = "جاري تحليل الصورة..."; }
      const source = document.createElement("canvas"); source.width = item.image.naturalWidth || item.image.width; source.height = item.image.naturalHeight || item.image.height;
      try {
        const blob = await imageCanvasBlob(source);
        if (!["http:", "https:"].includes(location.protocol)) throw new Error("static-file");
        const form = new FormData(); form.append("image", blob, "ak-designer-image.png");
        const response = await fetch("/api/remove-bg", { method: "POST", body: form });
        if (!response.ok) throw new Error(`codia-${response.status}`);
        updateImageFromBlob(item, await response.blob(), "تمت إزالة الخلفية بواسطة Codia AI.");
      } catch (error) {
        console.warn("Codia AI background removal is unavailable; using local fallback.", error);
        const imageCtx = source.getContext("2d", { willReadFrequently: true }); imageCtx.drawImage(item.image, 0, 0, source.width, source.height);
        const data = imageCtx.getImageData(0, 0, source.width, source.height); const pixels = data.data;
        for (let i = 0; i < pixels.length; i += 4) { const nearWhite = pixels[i] > 232 && pixels[i + 1] > 232 && pixels[i + 2] > 232; if (nearWhite) pixels[i + 3] = 0; }
        imageCtx.putImageData(data, 0, 0); imageCanvasBlob(source).then(result => updateImageFromBlob(item, result, "تعذر الوصول إلى Codia؛ تمت إزالة الخلفية البيضاء محليًا.")).catch(() => showToast("تعذر إزالة الخلفية من الصورة."));
      } finally {
        if (button) { button.disabled = false; const label = button.querySelector("strong"); if (label) label.textContent = originalLabel || "إزالة الخلفية بالذكاء الاصطناعي"; }
      }
      })();
    }
    if (false) {
      const item = ensureSelected("image");
      if (!item || item.type !== "image" || !item.image) { showToast("حدد صورة أولًا لإزالة خلفيتها."); return; }
      const source = document.createElement("canvas"); source.width = item.image.naturalWidth || item.image.width; source.height = item.image.naturalHeight || item.image.height;
      const imageCtx = source.getContext("2d", { willReadFrequently: true }); imageCtx.drawImage(item.image, 0, 0, source.width, source.height);
      const data = imageCtx.getImageData(0, 0, source.width, source.height); const pixels = data.data;
      for (let i = 0; i < pixels.length; i += 4) { const nearWhite = pixels[i] > 232 && pixels[i + 1] > 232 && pixels[i + 2] > 232; if (nearWhite) pixels[i + 3] = 0; }
      imageCtx.putImageData(data, 0, 0); const src = source.toDataURL("image/png"); const image = new Image(); image.onload = () => { item.image = image; item.src = src; imageSources.set(item.id, src); item.previewCanvas = null; draw(); remember(); showToast("تمت إزالة الخلفية البيضاء من الصورة."); }; image.src = src;
    }
    open("group-items-btn")?.addEventListener("click", () => {
      const item = ensureSelected(); if (!item) { showToast("أضف عنصرين إلى التصميم أولًا."); return; }
      const candidate = items.find(entry => entry.id !== item.id && !entry.groupId) || items.find(entry => entry.id !== item.id);
      if (!candidate) { showToast("أضف عنصرًا ثانيًا حتى تنشئ مجموعة."); return; }
      const groupId = item.groupId || candidate.groupId || nextGroupId++; item.groupId = groupId; candidate.groupId = groupId; renderLayers(); remember(); showToast("تم تجميع العنصرين؛ حرّك أحدهما لتحريك المجموعة.");
    });
    open("align-items-btn")?.addEventListener("click", () => {
      const item = ensureSelected(); if (!item) { showToast("أضف عنصرًا إلى التصميم أولًا."); return; }
      item.x = Math.round((canvas.width - item.w) / 2); item.y = Math.round((canvas.height - item.h) / 2); draw(); renderProperties(); remember(); showToast("تمت محاذاة العنصر إلى مركز اللوحة.");
    });
    open("text-effects-btn")?.addEventListener("click", () => { const item = ensureSelected("text"); if (!item) { showToast("أضف نصًا إلى التصميم أولًا."); return; } renderProperties(); document.getElementById("item-text-outline")?.scrollIntoView({ behavior: "smooth", block: "center" }); });
    open("versions-btn")?.addEventListener("click", () => { try { const versions = JSON.parse(localStorage.getItem("ak-project-versions") || "[]"); versions.push({ savedAt: new Date().toISOString(), project: serializeProject() }); localStorage.setItem("ak-project-versions", JSON.stringify(versions.slice(-10))); showToast(`تم حفظ نسخة رقم ${versions.length}.`); } catch (error) { showToast("تعذر حفظ نسخة التصميم."); } });
    open("keyboard-help-btn")?.addEventListener("click", () => { settingsDialog.showModal(); document.querySelector('[data-settings-tab="shortcuts"]')?.click(); });
    open("dark-mode-btn")?.addEventListener("click", () => document.getElementById("theme-toggle-btn")?.click());
    open("touch-mode-btn")?.addEventListener("click", () => { document.body.classList.toggle("touch-mode"); showToast(document.body.classList.contains("touch-mode") ? "تم تفعيل وضع اللمس." : "تم إيقاف وضع اللمس."); });
    open("font-library-btn")?.addEventListener("click", () => { settingsDialog.showModal(); document.querySelector('[data-settings-tab="brand"]')?.click(); showToast("اختر الخط المفضل من هوية العلامة."); });
    const frame = document.getElementById("canvas-frame");
    ["dragenter", "dragover"].forEach(type => frame?.addEventListener(type, event => { event.preventDefault(); frame.classList.add("drop-active"); }));
    ["dragleave", "drop"].forEach(type => frame?.addEventListener(type, event => { event.preventDefault(); frame.classList.remove("drop-active"); }));
    frame?.addEventListener("drop", event => { const file = [...(event.dataTransfer?.files || [])].find(entry => entry.type.startsWith("image/")); if (!file) { showToast("أسقط ملف صورة صالحًا داخل اللوحة."); return; } const transfer = new DataTransfer(); transfer.items.add(file); uploadInput.files = transfer.files; uploadInput.dispatchEvent(new Event("change", { bubbles: true })); });
  };
  document.getElementById("export-transparent-btn").addEventListener("click", () => downloadDesign("png", true));
  document.getElementById("export-svg-btn").addEventListener("click", () => {
    try {
      const svg = createExportSvg();
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `ak-designer-${Date.now()}.svg`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast("بدأ تنزيل التصميم بصيغة SVG.");
    } catch (error) {
      console.error("Could not export project as SVG:", error);
      showToast("تصدير SVG متاح للتصاميم المتجهية من النصوص والأشكال فقط.");
    }
  });
  document.getElementById("export-btn").addEventListener("click", () => downloadDesign("png"));
  document.getElementById("export-jpg-btn").addEventListener("click", () => downloadDesign("jpg"));
  if ("serviceWorker" in navigator && ["http:", "https:"].includes(location.protocol)) {
    navigator.serviceWorker.register("./sw.js").catch(error => console.info("Offline cache is unavailable in this context.", error));
  }
  const projectLoaded = loadProject();
  if (!projectLoaded) {
    createItem("text");
  } else {
    setStatus("تم تحميل المشروع");
  }
  renderLayers(); renderProperties(); draw(); remember();
})();

// الحسابات غير مطلوبة: يبقى الاستوديو سريعًا ومفتوحًا مع حفظ المشاريع محليًا.
document.querySelectorAll('.auth-dialog, [id^="auth-"]').forEach(element => element.remove());
document.querySelectorAll('[data-settings-tab="account"], [data-mobile-action="account"]').forEach(element => element.remove());
