/* ==========================================================================
   Web Summit 2026 Side Events · garna.io
   Same mechanics as the Gamescom 2026 page: events are read from a Google
   Sheet on every page load, so editing a row updates the live page with no
   deploy. If the sheet can't be reached, the bundled snapshot
   (window.WS_EVENTS_SNAPSHOT, websummit-2026-events-data.js) is shown instead.

   New compared to Gamescom:
   - topic filters (sheet column `tags`) and a "Free only" toggle;
   - organiser line under the title (column `host`);
   - custom highlight label per row (column `label`), e.g. "Garna will be there";
   - access type `included` = comes with a Web Summit ticket;
   - column `free` = 1 when there is no ticket price (drives "Free to attend");
   - column `hide` = 1 keeps a row in the sheet but off the page.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- config */

  var CONFIG = {
    // Google Sheet must be shared as "Anyone with the link · Viewer".
    sheetId: "1nzPaw5j408tsV9tUAVFKLrCNASowDhcEQpwk02ap8Ko",
    // Only days inside this window are shown. Multi-day events are clamped to it.
    windowStart: "2026-11-06",
    windowEnd: "2026-11-14",
    // The schedule canvas starts with the first listed side-event day.
    defaultDay: "2026-11-06",
    fetchTimeoutMs: 8000
  };

  var UI = {};
  var uiRoot = document.getElementById("websummitUiTranslations");
  if (uiRoot) {
    Array.prototype.forEach.call(uiRoot.querySelectorAll("[data-websummit-i18n]"), function (node) {
      UI[node.getAttribute("data-websummit-i18n")] = (node.textContent || "").trim();
    });
  }

  function t(key, fallback) {
    return UI[key] || fallback;
  }

  function eventCountLabel(count) {
    var lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
    var form = "many";
    if (lang === "ru") {
      var mod10 = count % 10;
      var mod100 = count % 100;
      if (mod10 === 1 && mod100 !== 11) form = "one";
      else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) form = "few";
    } else if (count === 1) {
      form = "one";
    }
    return count + " " + t("event." + form, form === "one" ? "event" : "events");
  }

  /* Access type -> badge label, badge modifier, CTA label. */
  var ACCESS = {
    free:        { label: t("access.free", "Free"),               mod: "badge-free",   cta: t("cta.register", "Register") },
    paid:        { label: t("access.paid", "Paid"),               mod: "",             cta: t("cta.tickets", "Get tickets") },
    application: { label: t("access.apply", "Apply"),             mod: "",             cta: t("cta.apply", "Apply") },
    invite:      { label: t("access.invite", "Invite only"),      mod: "",             cta: t("cta.details", "Details") },
    included:    { label: t("access.included", "With Web Summit ticket"), mod: "",     cta: t("cta.details", "Details") },
    open:        { label: t("access.open", "Open entry"),         mod: "badge-open",   cta: t("cta.details", "Details") },
    tba:         { label: t("access.tba", "TBA"),                 mod: "",             cta: t("cta.details", "Details") },
    closed:      { label: t("access.closed", "Closed"),           mod: "badge-closed", cta: t("cta.details", "Details") }
  };
  ACCESS.badge = ACCESS.included; // Gamescom-era value, kept as an alias
  var ACCESS_FALLBACK = { label: t("cta.details", "Details"), mod: "", cta: t("cta.details", "Details") };

  /* Topic filters. Keys are the values allowed in the sheet's `tags` column. */
  var TOPICS = [
    { key: "investors", label: t("topic.investors", "Investors & VC") },
    { key: "pitch",     label: t("topic.pitch", "Pitch nights") },
    { key: "founders",  label: t("topic.founders", "Founder meetups") },
    { key: "ai",        label: t("topic.ai", "AI") },
    { key: "food",      label: t("topic.food", "Breakfasts & dinners") },
    { key: "party",     label: t("topic.party", "Parties") },
    { key: "talks",     label: t("topic.talks", "Talks & workshops") }
  ];

  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function (day, index) {
    return t("weekday." + index, day);
  });
  var MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"].map(function (month, index) {
    return t("month." + index, month);
  });

  /* ------------------------------------------------------------- utilities */

  function $(sel, root) { return (root || document).querySelector(sel); }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* Only allow http(s) links through to href. */
  function safeUrl(url) {
    var u = String(url || "").trim();
    return /^https?:\/\//i.test(u) ? u : "";
  }

  function toDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || "").trim());
    return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
  }

  function toIso(date) {
    return date.toISOString().slice(0, 10);
  }

  function dayId(iso) { return "day-" + iso; }

  /* "17:00-21:00" / "From 13:00" -> minutes since midnight. No time -> -1. */
  function startMinutes(time) {
    var m = /(\d{1,2}):(\d{2})/.exec(String(time || ""));
    return m ? (+m[1]) * 60 + (+m[2]) : -1;
  }

  function parseTags(value) {
    return String(value || "").toLowerCase().split(/[,;]/).map(function (s) {
      return s.trim();
    }).filter(Boolean);
  }

  function isTruthy(value) {
    var v = String(value || "").trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }

  /* ----------------------------------------------------------- data loading */

  /* gviz encodes date cells as the string "Date(2026,10,9)" (month is 0-based). */
  function normalizeCell(cell) {
    if (!cell) return "";
    var v = cell.v;
    if (v == null) return cell.f != null ? String(cell.f) : "";
    if (typeof v === "string") {
      var d = /^Date\((\d+),(\d+),(\d+)/.exec(v);
      if (d) {
        return toIso(new Date(Date.UTC(+d[1], +d[2], +d[3])));
      }
      return v;
    }
    if (v instanceof Date) return toIso(v);
    // time-of-day cells come back as [h, m, s, ms]
    if (Array.isArray(v)) {
      return cell.f || v.slice(0, 2).map(function (n) { return String(n).padStart(2, "0"); }).join(":");
    }
    return String(v);
  }

  function normalizeEvent(raw) {
    return {
      date: raw.date || "",
      end_date: raw.end_date || "",
      name: raw.name || "",
      time: raw.time || "",
      description: raw.description || "",
      location: raw.location || "",
      access: String(raw.access || "").trim().toLowerCase(),
      access_note: raw.access_note || "",
      link: raw.link || "",
      featured: raw.featured === true || isTruthy(raw.featured),
      score: parseInt(raw.score != null ? raw.score : raw.priority_score, 10) || 0,
      host: raw.host || "",
      tags: Array.isArray(raw.tags) ? raw.tags : parseTags(raw.tags),
      label: raw.label || "",
      free: raw.free === true || isTruthy(raw.free)
    };
  }

  function parseGviz(text) {
    var start = text.indexOf("{");
    var end = text.lastIndexOf("}");
    if (start < 0 || end < 0) throw new Error("Unexpected gviz payload");
    var payload = JSON.parse(text.slice(start, end + 1));
    var table = payload.table;
    if (!table || !table.rows) throw new Error("No table in gviz payload");

    // Map columns by header label so column order can shift without breaking.
    var index = {};
    (table.cols || []).forEach(function (col, i) {
      var key = String(col.label || col.id || "").trim().toLowerCase().replace(/\s+/g, "_");
      if (key) index[key] = i;
    });

    // Fallback: if gviz didn't treat row 1 as headers, read them from row 0.
    if (!index.hasOwnProperty("name") && table.rows.length) {
      var first = table.rows[0];
      var fromRow = {};
      (first.c || []).forEach(function (cell, i) {
        var key = normalizeCell(cell).trim().toLowerCase().replace(/\s+/g, "_");
        if (key) fromRow[key] = i;
      });
      if (fromRow.hasOwnProperty("name")) {
        index = fromRow;
        table.rows = table.rows.slice(1);
      }
    }

    function pick(row, key) {
      if (!index.hasOwnProperty(key)) return "";
      return normalizeCell(row.c && row.c[index[key]]).trim();
    }

    return table.rows.map(function (row) {
      return normalizeEvent({
        date: pick(row, "date"),
        end_date: pick(row, "end_date"),
        name: pick(row, "name"),
        time: pick(row, "time"),
        description: pick(row, "description"),
        location: pick(row, "location"),
        access: pick(row, "access"),
        access_note: pick(row, "access_note"),
        link: pick(row, "link"),
        featured: pick(row, "featured"),
        priority_score: pick(row, "priority_score"),
        host: pick(row, "host"),
        tags: pick(row, "tags"),
        label: pick(row, "label"),
        free: pick(row, "free")
      });
    }).filter(function (e, i) {
      // `hide` = 1 keeps a row in the sheet but off the page.
      return e.name && !isTruthy(pick(table.rows[i], "hide"));
    });
  }

  function loadFromSheet() {
    var url = "https://docs.google.com/spreadsheets/d/" + CONFIG.sheetId +
              "/gviz/tq?tqx=out:json&headers=1&t=" + Date.now();

    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, CONFIG.fetchTimeoutMs);

    return fetch(url, controller ? { signal: controller.signal } : undefined)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (text) {
        if (timer) clearTimeout(timer);
        return parseGviz(text);
      })
      .then(function (rows) {
        if (!rows.length) throw new Error("Sheet returned no rows");
        return { events: rows, live: true };
      });
  }

  function loadSnapshot() {
    var snap = (window.WS_EVENTS_SNAPSHOT || []).map(normalizeEvent).filter(function (e) {
      return e.name;
    });
    return { events: snap, live: false };
  }

  /* ------------------------------------------------------------- day model */

  /* Expand multi-day events so they appear on every day they run. */
  function buildDays(events) {
    var winStart = toDate(CONFIG.windowStart);
    var winEnd = toDate(CONFIG.windowEnd);
    var buckets = {};
    var tba = [];

    events.forEach(function (ev) {
      var start = toDate(ev.date);
      if (!start) { tba.push(ev); return; }

      var end = toDate(ev.end_date) || start;
      if (end < start) end = start;

      // clamp to the window we display
      var from = start < winStart ? winStart : start;
      var to = end > winEnd ? winEnd : end;
      if (from > winEnd || to < winStart) return;

      var multi = toIso(start) !== toIso(end);
      for (var d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
        var iso = toIso(d);
        (buckets[iso] = buckets[iso] || []).push({ ev: ev, multi: multi });
      }
    });

    var days = Object.keys(buckets).sort().map(function (iso) {
      var items = buckets[iso].sort(function (a, b) {
        // multi-day items without a time go first, then by start time
        var am = startMinutes(a.ev.time), bm = startMinutes(b.ev.time);
        if (am !== bm) return am - bm;
        return b.ev.score - a.ev.score;
      });
      var date = toDate(iso);
      return {
        iso: iso,
        date: date,
        weekday: WEEKDAYS[date.getUTCDay()],
        dayNum: date.getUTCDate(),
        month: MONTHS[date.getUTCMonth()],
        items: items
      };
    });

    if (tba.length) {
      days.push({
        iso: "tba",
        date: null,
        weekday: t("date.label", "Date"),
        dayNum: t("date.tba", "TBA"),
        month: "",
        items: tba.map(function (ev) { return { ev: ev, multi: false }; })
      });
    }

    return days;
  }

  /* --------------------------------------------------------------- filters */

  var filters = { topic: "all", freeOnly: false };

  /* Free to attend = no ticket price, even if the host approves guests.
     Driven by the sheet's `free` column; free/open access counts on its own. */
  function isFreeToAttend(ev) {
    return ev.free || ev.access === "free" || ev.access === "open";
  }

  function passes(item) {
    var ev = item.ev;
    if (filters.freeOnly && !isFreeToAttend(ev)) return false;
    if (filters.topic !== "all" && ev.tags.indexOf(filters.topic) < 0) return false;
    return true;
  }

  function visibleItems(day) {
    return day ? day.items.filter(passes) : [];
  }

  /* ---------------------------------------------------------------- render */

  var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
  var ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>';

  /* Event rows are rendered in the browser, so their CTAs reproduce the
     shared Button.astro DOM contract (same as the Gamescom page) instead of
     introducing page-local button classes. */
  function renderEventButton(label, url) {
    var base = "garna-button inline-flex items-center justify-center font-manrope " +
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
      "focus-visible:outline-[#CBF300] garna-button-inline-accent ws-event-button";
    var inner = '<span class="garna-button-inner">' + esc(label) + "</span>";

    if (url) {
      return '<a class="' + base + '"' +
        ' href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + inner + "</a>";
    }

    return '<span class="' + base + '" aria-disabled="true">' +
      inner + "</span>";
  }

  function renderDayNav(days, activeIso) {
    return days.map(function (day) {
      var isTba = day.iso === "tba";
      var top = isTba ? t("date.tba", "TBA") : day.weekday + " " + day.dayNum;
      var count = eventCountLabel(visibleItems(day).length);
      var active = day.iso === activeIso;
      return '<button type="button" class="day-btn' + (active ? " is-active" : "") + '"' +
             ' data-day="' + esc(day.iso) + '"' +
             ' aria-pressed="' + (active ? "true" : "false") + '">' +
             '<span class="d-day">' + esc(top) + '</span>' +
             '<span class="d-count">' + esc(count) + '</span>' +
             '</button>';
    }).join("");
  }

  function renderFilters(events) {
    var used = {};
    events.forEach(function (ev) { ev.tags.forEach(function (tag) { used[tag] = true; }); });
    var chips = [{ key: "all", label: t("topic.all", "All topics") }].concat(
      TOPICS.filter(function (topic) { return used[topic.key]; })
    );
    var html = chips.map(function (chip) {
      var on = filters.topic === chip.key;
      return '<button type="button" class="ws-chip' + (on ? " is-active" : "") + '" data-topic="' +
        esc(chip.key) + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(chip.label) + "</button>";
    }).join("");
    html += '<button type="button" class="ws-free-toggle' + (filters.freeOnly ? " is-active" : "") +
      '" data-free="1" role="switch" aria-checked="' + (filters.freeOnly ? "true" : "false") + '">' +
      '<span class="ws-free-label">' + esc(t("filter.free", "Free events only")) + '</span>' +
      '<span class="ws-switch-track" aria-hidden="true"><span class="ws-switch-thumb"></span></span></button>';
    return html;
  }

  function renderEvent(item) {
    var ev = item.ev;
    var access = ACCESS[ev.access] || ACCESS_FALLBACK;
    var url = safeUrl(ev.link);
    var classes = ["event-card"];
    if (ev.featured || ev.label) classes.push("is-featured");
    if (ev.access === "closed") classes.push("is-closed");

    var facts = "";
    if (ev.location) {
      facts += '<span class="fact">' + ICON_PIN + esc(ev.location) + "</span>";
    }
    if (item.multi) {
      facts += '<span class="fact">' + ICON_CAL + esc(t("event.multiDay", "Runs across several days")) + "</span>";
    }
    facts += '<span class="badge ' + access.mod + '">' + esc(access.label) + "</span>";
    if (ev.access_note) {
      facts += '<span class="fact">' + esc(ev.access_note) + "</span>";
    }

    var pick = ev.label || (ev.featured ? t("event.featured", "Worth your time") : "");
    var cta = renderEventButton(url ? access.cta : t("cta.noLink", "No link yet"), url);

    return '<article class="event-row reveal">' +
             '<div class="event-time">' + esc(ev.time || t("event.timeTba", "Time TBA")) + "</div>" +
             '<div class="' + classes.join(" ") + '">' +
               '<div class="event-main">' +
                 '<div class="event-title">' +
                   "<h3>" + esc(ev.name) + "</h3>" +
                   (pick ? '<span class="pick">' + esc(pick) + "</span>" : "") +
                 "</div>" +
                 (ev.host ? '<p class="event-host">' + esc(t("event.by", "by")) + " " + esc(ev.host) + "</p>" : "") +
                 (ev.description ? '<p class="event-desc">' + esc(ev.description) + "</p>" : "") +
                 '<div class="event-facts">' + facts + "</div>" +
               "</div>" +
               '<div class="event-cta">' + cta + "</div>" +
             "</div>" +
           "</article>";
  }

  function renderDay(day) {
    if (!day) {
      return '<div class="empty-state"><h3>' + esc(t("empty.title", "Nothing scheduled here yet")) + "</h3>" +
             "<p>" + esc(t("empty.description", "Pick another day above. We keep this page updated through the week.")) + "</p></div>";
    }

    var items = visibleItems(day);
    var title, sub;
    if (day.iso === "tba") {
      title = t("date.announced", "Date to be announced");
      sub = eventCountLabel(items.length) + ", " +
            t("date.unannouncedSuffix", "organisers haven't announced a date yet");
    } else {
      title = day.weekday + ", " + day.dayNum + " " + day.month;
      sub = eventCountLabel(items.length);
    }

    // Single-day events first, sorted by time; multi-day programmes (tours,
    // hubs, summits running all week) go into their own group below, so they
    // don't push the day's actual schedule down the page.
    var single = items.filter(function (it) { return !it.multi; });
    var multi = items.filter(function (it) { return it.multi; });
    var lists = "";
    if (single.length) lists += '<div class="event-list">' + single.map(renderEvent).join("") + "</div>";
    if (multi.length) {
      lists += '<h3 class="ws-group-title">' + esc(t("group.multi", "Running across several days")) + "</h3>" +
               '<div class="event-list">' + multi.map(renderEvent).join("") + "</div>";
    }
    var body = items.length
      ? lists
      : '<div class="empty-state"><h3>' + esc(t("empty.filteredTitle", "Nothing matches these filters on this day")) + "</h3>" +
        "<p>" + esc(t("empty.filteredDescription", "Try another topic, switch off \"Free events only\", or pick another day.")) + "</p>" +
        '<button type="button" class="ws-reset" data-reset="1">' + esc(t("filter.reset", "Show all events")) + "</button></div>";

    return '<div class="day-heading"><h2 id="' + esc(dayId(day.iso)) + '">' + esc(title) + "</h2>" +
           '<span class="day-sub">' + esc(sub) + "</span></div>" + body;
  }

  function renderSchedule(days) {
    return days.map(function (day) {
      return '<section class="ws-day-section" data-day-section="' + esc(day.iso) + '"' +
        ' aria-labelledby="' + esc(dayId(day.iso)) + '">' + renderDay(day) + '</section>';
    }).join("");
  }

  /* ------------------------------------------------------------- reveal obs */

  var observer = null;
  function observeReveals(root) {
    var nodes = root.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nodes, function (n) { n.classList.add("is-visible"); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });
    }
    Array.prototype.forEach.call(nodes, function (n) { observer.observe(n); });
  }

  /* ------------------------------------------------------------------ boot */

  function pickInitialDay(days) {
    var fromHash = (location.hash || "").replace(/^#day-/, "");
    if (fromHash && days.some(function (d) { return d.iso === fromHash; })) return fromHash;

    var today = toIso(new Date());
    if (days.some(function (d) { return d.iso === today; })) return today;

    if (days.some(function (d) { return d.iso === CONFIG.defaultDay; })) return CONFIG.defaultDay;

    var firstDated = days.filter(function (d) { return d.iso !== "tba"; })[0];
    return firstDated ? firstDated.iso : (days[0] && days[0].iso);
  }

  function init(data) {
    var events = data.events;
    var days = buildDays(events);

    var navEl = $("#dayNav");
    var prevDayButton = $(".ws-day-scroll-prev");
    var nextDayButton = $(".ws-day-scroll-next");
    var listEl = $("#eventsBody");
    var filterEl = $("#topicFilters");
    var noteEl = $("#sourceNote");
    var statEvents = $("#statEvents");
    var statDays = $("#statDays");
    var statFree = $("#statFree");

    // Count only events that actually render inside the window (+ TBA).
    var shown = [];
    days.forEach(function (d) {
      d.items.forEach(function (it) { if (shown.indexOf(it.ev) < 0) shown.push(it.ev); });
    });
    if (statEvents) statEvents.textContent = shown.length;
    if (statDays) statDays.textContent = days.filter(function (d) { return d.iso !== "tba"; }).length;
    if (statFree) statFree.textContent = shown.filter(isFreeToAttend).length;

    if (!days.length) {
      if (listEl) {
        listEl.innerHTML = '<div class="empty-state"><h3>' + esc(t("empty.noEventsTitle", "No events loaded")) + "</h3>" +
          "<p>" + esc(t("empty.noEventsDescription", "The schedule didn't come through. A refresh usually fixes it.")) + "</p></div>";
      }
      return;
    }

    var activeIso = pickInitialDay(days);

    function updateDayScrollControls() {
      if (!navEl) return;
      var maxScroll = Math.max(0, navEl.scrollWidth - navEl.clientWidth);
      var atStart = maxScroll < 2 || navEl.scrollLeft <= 2;
      var atEnd = maxScroll < 2 || navEl.scrollLeft >= maxScroll - 2;
      if (prevDayButton) {
        prevDayButton.classList.toggle("is-disabled", atStart);
        prevDayButton.setAttribute("aria-hidden", atStart ? "true" : "false");
        prevDayButton.tabIndex = atStart ? -1 : 0;
      }
      if (nextDayButton) {
        nextDayButton.classList.toggle("is-disabled", atEnd);
        nextDayButton.setAttribute("aria-hidden", atEnd ? "true" : "false");
        nextDayButton.tabIndex = atEnd ? -1 : 0;
      }
    }

    function setActiveDay(iso, updateHash, centerInNav) {
      if (!iso || !days.some(function (day) { return day.iso === iso; })) return;
      var changed = activeIso !== iso;
      activeIso = iso;
      if (navEl) {
        Array.prototype.forEach.call(navEl.querySelectorAll(".day-btn"), function (button) {
          var active = button.getAttribute("data-day") === iso;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", active ? "true" : "false");
        });
        if (centerInNav && changed) {
          var activeBtn = navEl.querySelector('.day-btn[data-day="' + iso + '"]');
          if (activeBtn && navEl.scrollWidth > navEl.clientWidth) {
            var targetLeft = Math.max(0, activeBtn.offsetLeft - (navEl.clientWidth - activeBtn.offsetWidth) / 2);
            if (navEl.scrollTo) navEl.scrollTo({ left: targetLeft, behavior: "smooth" });
            else navEl.scrollLeft = targetLeft;
          }
        }
        window.requestAnimationFrame(updateDayScrollControls);
      }
      if (updateHash) {
        // Chrome throws a SecurityError for replaceState on file:// URLs, and
        // deep links are a nicety, so never let them take the page down.
        try {
          if (history.replaceState) history.replaceState(null, "", "#" + dayId(iso));
        } catch (e) { /* deep links unavailable here; the page works regardless */ }
      }
    }

    function updateFilterLayout() {
      if (!filterEl) return;
      filterEl.classList.remove("is-wrapped");
      if (window.matchMedia && window.matchMedia("(max-width: 760px)").matches) return;
      var chips = filterEl.querySelectorAll(".ws-chip");
      var toggle = filterEl.querySelector(".ws-free-toggle");
      if (!chips.length || !toggle) return;
      var firstRowTop = chips[0].offsetTop;
      var wrapped = toggle.offsetTop !== firstRowTop;
      Array.prototype.forEach.call(chips, function (chip) {
        if (chip.offsetTop !== firstRowTop) wrapped = true;
      });
      filterEl.classList.toggle("is-wrapped", wrapped);
    }

    function renderCanvas() {
      if (navEl) navEl.innerHTML = renderDayNav(days, activeIso);
      if (filterEl) filterEl.innerHTML = renderFilters(shown);
      if (listEl) {
        listEl.innerHTML = renderSchedule(days);
        observeReveals(listEl);
      }
      window.requestAnimationFrame(function () {
        updateDayScrollControls();
        updateFilterLayout();
        syncActiveDayFromScroll();
      });
    }

    var programmaticScrollTarget = null;
    var programmaticScrollDeadline = 0;

    function cancelProgrammaticScroll() {
      programmaticScrollTarget = null;
      programmaticScrollDeadline = 0;
    }

    function scrollToDay(iso, behavior) {
      if (!listEl) return;
      var section = listEl.querySelector('[data-day-section="' + iso + '"]');
      if (!section) return;
      programmaticScrollTarget = iso;
      programmaticScrollDeadline = Date.now() + 5000;
      setActiveDay(iso, true, true);
      try {
        var navHeight = (document.querySelector(".day-nav") || { offsetHeight: 0 }).offsetHeight;
        var top = section.getBoundingClientRect().top + window.pageYOffset - navHeight - 24;
        window.scrollTo({ top: Math.max(0, top), behavior: behavior || "smooth" });
      } catch (e) {
        section.scrollIntoView();
      }
    }

    var scrollTicking = false;
    function syncActiveDayFromScroll() {
      scrollTicking = false;
      if (!listEl) return;
      var sections = listEl.querySelectorAll("[data-day-section]");
      if (!sections.length) return;
      var navHeight = (document.querySelector(".day-nav") || { offsetHeight: 0 }).offsetHeight;
      var marker = navHeight + 36;
      if (programmaticScrollTarget) {
        var targetSection = listEl.querySelector('[data-day-section="' + programmaticScrollTarget + '"]');
        var targetTop = targetSection ? targetSection.getBoundingClientRect().top : marker;
        var targetMarker = navHeight + 24;
        if (Math.abs(targetTop - targetMarker) <= 4 || Date.now() >= programmaticScrollDeadline) {
          cancelProgrammaticScroll();
        } else {
          setActiveDay(programmaticScrollTarget, false, true);
          return;
        }
      }
      if (sections[0].getBoundingClientRect().top > marker) return;
      var nextIso = sections[0].getAttribute("data-day-section");

      Array.prototype.forEach.call(sections, function (section) {
        if (section.getBoundingClientRect().top <= marker) {
          nextIso = section.getAttribute("data-day-section");
        }
      });

      if (window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) {
        nextIso = sections[sections.length - 1].getAttribute("data-day-section");
      }
      setActiveDay(nextIso, true, true);
    }

    function requestScrollSync() {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(syncActiveDayFromScroll);
    }

    if (navEl) {
      // Touch devices use native horizontal scrolling. On narrow desktop
      // previews, allow the same strip to be dragged with a mouse.
      var dragStartX = 0;
      var dragStartScroll = 0;
      var isDraggingDays = false;
      var didDragDays = false;
      var suppressDayClick = false;

      navEl.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "touch" || e.button !== 0 || navEl.scrollWidth <= navEl.clientWidth) return;
        dragStartX = e.clientX;
        dragStartScroll = navEl.scrollLeft;
        isDraggingDays = true;
        didDragDays = false;
        navEl.classList.add("is-dragging");
        if (navEl.setPointerCapture) navEl.setPointerCapture(e.pointerId);
      });

      navEl.addEventListener("pointermove", function (e) {
        if (!isDraggingDays) return;
        var delta = e.clientX - dragStartX;
        if (Math.abs(delta) > 4) didDragDays = true;
        if (!didDragDays) return;
        navEl.scrollLeft = dragStartScroll - delta;
        e.preventDefault();
      });

      function finishDayDrag(e) {
        if (!isDraggingDays) return;
        isDraggingDays = false;
        suppressDayClick = didDragDays;
        navEl.classList.remove("is-dragging");
        if (navEl.releasePointerCapture && navEl.hasPointerCapture && navEl.hasPointerCapture(e.pointerId)) {
          navEl.releasePointerCapture(e.pointerId);
        }
        window.setTimeout(function () { suppressDayClick = false; }, 0);
      }

      navEl.addEventListener("pointerup", finishDayDrag);
      navEl.addEventListener("pointercancel", finishDayDrag);
      navEl.addEventListener("scroll", updateDayScrollControls, { passive: true });
      navEl.addEventListener("click", function (e) {
        if (!suppressDayClick) return;
        e.preventDefault();
        e.stopPropagation();
      }, true);

      navEl.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest(".day-btn") : null;
        if (!btn) return;
        scrollToDay(btn.getAttribute("data-day"), "smooth");
      });

      [prevDayButton, nextDayButton].forEach(function (button) {
        if (!button) return;
        button.addEventListener("click", function () {
          var direction = Number(button.getAttribute("data-day-scroll")) || 1;
          var distance = Math.max(220, navEl.clientWidth * 0.72) * direction;
          if (navEl.scrollBy) navEl.scrollBy({ left: distance, behavior: "smooth" });
          else navEl.scrollLeft += distance;
        });
      });
      window.addEventListener("resize", function () {
        updateDayScrollControls();
        updateFilterLayout();
        requestScrollSync();
      });
    }

    window.addEventListener("scroll", requestScrollSync, { passive: true });
    window.addEventListener("wheel", cancelProgrammaticScroll, { passive: true });
    window.addEventListener("touchstart", cancelProgrammaticScroll, { passive: true });
    window.addEventListener("pointerdown", cancelProgrammaticScroll, { passive: true });
    window.addEventListener("keydown", function (event) {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].indexOf(event.key) >= 0) {
        cancelProgrammaticScroll();
      }
    });

    if (filterEl) {
      filterEl.addEventListener("click", function (e) {
        var chip = e.target.closest ? e.target.closest(".ws-chip, .ws-free-toggle") : null;
        if (!chip) return;
        if (chip.hasAttribute("data-free")) filters.freeOnly = !filters.freeOnly;
        else filters.topic = chip.getAttribute("data-topic") || "all";
        renderCanvas();
      });
    }

    if (listEl) {
      listEl.addEventListener("click", function (e) {
        var reset = e.target.closest ? e.target.closest("[data-reset]") : null;
        if (!reset) return;
        filters.topic = "all";
        filters.freeOnly = false;
        renderCanvas();
      });
    }

    renderCanvas();

    // A shared URL remains useful: an explicit day hash opens that part of the
    // schedule after the async event data has rendered. Without a hash, the
    // page stays at the hero and the scroll spy takes over naturally.
    var requestedIso = (location.hash || "").replace(/^#day-/, "");
    if (requestedIso && days.some(function (day) { return day.iso === requestedIso; })) {
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { scrollToDay(requestedIso, "auto"); });
      });
    }

    if (noteEl) {
      noteEl.textContent = data.live
        ? t("source.live", "The schedule is read from our events sheet every time this page loads, so it is always the current one.")
        : t("source.fallback", "We couldn't reach the live sheet, so this is the last saved copy of the schedule.");
    }
  }

  /* Last resort: drop the "js" class so every .reveal block becomes visible
     again, and say what happened where the list would have been. */
  function bail(err) {
    if (window.console) console.error("[websummit]", err);
    document.documentElement.className =
      document.documentElement.className.replace(/\bjs\b/, "");
    var listEl = $("#eventsBody");
    if (listEl) {
      listEl.innerHTML = '<div class="empty-state"><h3>' + esc(t("error.title", "The schedule didn't load")) + "</h3>" +
        "<p>" + esc(t("error.description", "A refresh usually fixes it. If it doesn't, the browser console has the details.")) + "</p></div>";
    }
  }

  function start() {
    var listEl = $("#eventsBody");
    if (listEl) listEl.innerHTML = '<div class="loading">' + esc(t("loading", "Loading the schedule…")) + "</div>";

    loadFromSheet()
      .catch(function (err) {
        if (window.console) console.warn("[websummit] falling back to snapshot:", err && err.message);
        return loadSnapshot();
      })
      .then(init)
      .catch(bail);

    // Reveal for static sections
    observeReveals(document);
  }

  function boot() {
    try { start(); } catch (err) { bail(err); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
