// SECOND LIFE · shared nav, overlay menu, footer, reveal, count-up, bars, tag cursor.
(function () {
  const pages = [
    ["index.html", "Home"],
    ["characteristics.html", "Who They Are"],
    ["analysis.html", "Why They Buy"],
    ["case-studies.html", "Case Studies"],
    ["recommendations.html", "Recommendations"],
  ];
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const cur = (h) => (h === here ? ' aria-current="page"' : "");
  const tagSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h8.4l8.1 8.1-9.9 9.9L3 12.9z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/></svg>';

  const header = document.createElement("header");
  header.innerHTML = `<nav class="nav"><div class="wrap">
      <a class="logo" href="index.html">${tagSvg}Second Life</a>
      <ul class="menu">${pages.map(([h, t]) => `<li><a href="${h}"${cur(h)}>${t}</a></li>`).join("")}</ul>
      <button class="burger" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
    </div></nav>
    <div class="overlay" aria-hidden="true">${pages.map(([h, t], i) =>
      `<a href="${h}"${cur(h)}><span>0${i + 1}</span>${t}</a>`).join("")}</div>`;
  document.body.prepend(header);

  const nav = header.querySelector(".nav"), burger = header.querySelector(".burger"), overlay = header.querySelector(".overlay");
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    overlay.setAttribute("aria-hidden", !open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  const onScroll = () => nav.classList.toggle("small", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const foot = document.createElement("footer");
  foot.innerHTML = `<div class="wrap">
      <div class="big">Second <em>Life.</em></div>
      <div class="row"><span>MKT2054 Consumer Behaviour · Group 23, Tutorial 1</span>
      <span>Sunway University · 2026</span>
      <span><a href="recommendations.html#references">References &amp; image credits</a></span></div></div>`;
  document.body.append(foot);

  // reveal / count-up / bars
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const countUp = (el) => {
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length;
    if (isNaN(end) || reduce) return;
    const t0 = performance.now(), d = 1400;
    const tick = (t) => { const p = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const fire = (el) => {
    el.classList.add("in");
    el.querySelectorAll("[data-count]").forEach(countUp);
    el.querySelectorAll(".fill").forEach((f) => (f.style.width = f.dataset.v + "%"));
  };
  const els = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { fire(e.target); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  } else els.forEach(fire);

  // price-tag cursor (desktop only)
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    const c = document.createElement("div"); c.className = "cursor"; document.body.append(c);
    let x = 0, y = 0, cx = 0, cy = 0;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; c.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener("mouseover", (e) => c.classList.toggle("on", !!e.target.closest("a,button")));
  }

  // read more: long paragraphs show 4 lines, full text on tap
  document.querySelectorAll(".theory p.muted, .tagcard p.muted, .rec p.muted").forEach((p) => {
    if (p.textContent.length < 420) return;
    p.classList.add("clamp");
    const b = document.createElement("button");
    b.className = "more"; b.type = "button"; b.textContent = "Read more +";
    b.setAttribute("aria-expanded", "false");
    b.addEventListener("click", () => {
      const open = p.classList.toggle("open");
      b.textContent = open ? "Show less −" : "Read more +";
      b.setAttribute("aria-expanded", open);
    });
    p.after(b);
  });
})();
