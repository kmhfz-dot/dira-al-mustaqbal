(() => {
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (!manifestLink) return;

  const manifestUrl = new URL(manifestLink.href, window.location.href);
  const appRoot = new URL(".", manifestUrl);
  const iconUrl = new URL("assets/icons/icon-192.png", appRoot).href;

  const isIOS =
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  let deferredInstallPrompt = null;

  const copy = {
    en: {
      launcher: "Install App",
      eyebrow: "DIRA MOBILE APP",
      titleIOS: "Add Dira to your iPhone",
      titleAndroid: "Install Dira on Android",
      iosSteps: [
        "Tap the Share button in your browser.",
        "Select Add to Home Screen.",
        "Turn on Open as Web App.",
        "Tap Add. The Dira icon will appear on your Home Screen."
      ],
      androidSteps: [
        "Open your browser menu (the three dots).",
        "Select Install app or Add to Home screen.",
        "Confirm Install. The Dira icon will appear with your other apps."
      ],
      noteIOS:
        "Apple requires each person to confirm the Home Screen installation.",
      noteAndroid:
        "If the install choice is not visible, refresh the page and open the browser menu again.",
      close: "Close installation instructions"
    },
    ar: {
      launcher: "تثبيت التطبيق",
      eyebrow: "تطبيق درع المستقبل",
      titleIOS: "أضف تطبيق درع إلى الآيفون",
      titleAndroid: "ثبّت تطبيق درع على أندرويد",
      iosSteps: [
        "اضغط زر المشاركة في المتصفح.",
        "اختر إضافة إلى الشاشة الرئيسية.",
        "فعّل خيار فتح كتطبيق ويب.",
        "اضغط إضافة ليظهر رمز درع على الشاشة الرئيسية."
      ],
      androidSteps: [
        "افتح قائمة المتصفح ذات النقاط الثلاث.",
        "اختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.",
        "أكد التثبيت ليظهر رمز درع بين تطبيقاتك."
      ],
      noteIOS: "يتطلب نظام Apple من كل مستخدم تأكيد إضافة التطبيق.",
      noteAndroid:
        "إذا لم يظهر خيار التثبيت، حدّث الصفحة ثم افتح قائمة المتصفح مرة أخرى.",
      close: "إغلاق تعليمات التثبيت"
    }
  };

  const currentLanguage = () =>
    document.documentElement.lang === "ar" ||
    document.documentElement.dir === "rtl"
      ? "ar"
      : "en";

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.id = "pwaInstallButton";
  launcher.className = "pwa-install-launcher";
  launcher.hidden = true;
  launcher.innerHTML = `<img src="${iconUrl}" alt=""><span></span>`;
  document.body.append(launcher);

  const dialog = document.createElement("div");
  dialog.id = "pwaInstallDialog";
  dialog.className = "pwa-install-dialog";
  dialog.hidden = true;
  dialog.innerHTML = `
    <button class="pwa-install-backdrop" type="button" data-pwa-close aria-label="Close"></button>
    <section class="pwa-install-sheet" role="dialog" aria-modal="true" aria-labelledby="pwaInstallTitle">
      <header class="pwa-install-sheet-head">
        <img src="${iconUrl}" alt="Dira Al Mustaqbal Trading">
        <div><small></small><h2 id="pwaInstallTitle"></h2></div>
        <button class="pwa-install-close" type="button" data-pwa-close aria-label="Close">×</button>
      </header>
      <ol class="pwa-install-steps"></ol>
      <p class="pwa-install-note"></p>
    </section>
  `;
  document.body.append(dialog);

  const updateLanguage = () => {
    const language = currentLanguage();
    const text = copy[language];
    launcher.querySelector("span").textContent = text.launcher;
    dialog.querySelector("small").textContent = text.eyebrow;
    dialog.querySelector(".pwa-install-close").setAttribute("aria-label", text.close);
    dialog.querySelector(".pwa-install-backdrop").setAttribute("aria-label", text.close);
  };

  const closeDialog = () => {
    dialog.hidden = true;
    document.body.classList.remove("pwa-install-open");
    launcher.focus();
  };

  const openInstructions = (platform) => {
    const language = currentLanguage();
    const text = copy[language];
    const apple = platform === "ios";
    const steps = apple ? text.iosSteps : text.androidSteps;

    dialog.querySelector("h2").textContent = apple
      ? text.titleIOS
      : text.titleAndroid;
    dialog.querySelector(".pwa-install-steps").innerHTML = steps
      .map((step) => `<li>${step}</li>`)
      .join("");
    dialog.querySelector(".pwa-install-note").textContent = apple
      ? text.noteIOS
      : text.noteAndroid;
    dialog.hidden = false;
    document.body.classList.add("pwa-install-open");
    dialog.querySelector(".pwa-install-close").focus();
  };

  dialog.querySelectorAll("[data-pwa-close]").forEach((element) => {
    element.addEventListener("click", closeDialog);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dialog.hidden) closeDialog();
  });

  launcher.addEventListener("click", async () => {
    if (isIOS) {
      openInstructions("ios");
      return;
    }

    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      launcher.hidden = true;
      return;
    }

    openInstructions("android");
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!isStandalone()) launcher.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    launcher.hidden = true;
    if (!dialog.hidden) closeDialog();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(new URL("service-worker.js", appRoot), {
          scope: appRoot.pathname
        })
        .catch((error) => {
          console.warn("Dira app service worker registration failed:", error);
        });
    });
  }

  updateLanguage();
  new MutationObserver(updateLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang", "dir"]
  });

  if (!isStandalone() && isIOS) {
    launcher.hidden = false;
  } else if (!isStandalone() && isAndroid) {
    window.setTimeout(() => {
      if (!isStandalone()) launcher.hidden = false;
    }, 2200);
  }
})();
