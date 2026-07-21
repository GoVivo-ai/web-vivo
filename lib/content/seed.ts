import type { SiteContent, PageDoc, Block } from "@/lib/blocks/types";

const b = (id: string, type: string, props: Record<string, unknown>): Block => ({ id, type, props });

/* ══════════════ HOME ══════════════ */
const home: PageDoc = {
  slug: "", path: "/", title: "Home", navGroup: "home",
  description: "Vivo builds you a dedicated nearshore team plus a technology command center. Get your time back without letting go of your business.",
  blocks: [
    b("home-hero", "hero", {
      variant: "photo", image: "/photos/hero-banner.png",
      imageAlt: "Owner-operator on a video call with a dedicated remote team",
      eyebrow: "Operations support for owner-operators",
      title: "Get your time back without letting go of your business.",
      lead: "Vivo builds you a dedicated team, seated in Latin America, that answers every call, follows up on every lead, and keeps the back office moving. Co-managed until it runs on its own.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
      secondaryCta: { label: "See how it works", href: "/how-it-works" },
    }),
    b("home-proof", "proof", {
      main: 'Trusted by <span class="hl">transportation operators running thousands of rides a day</span> under strict SLAs.',
      sub: "Built by operators who have run these businesses from the inside.",
    }),
    b("home-operate", "capGrid", {
      eyebrow: "How we operate",
      title: "One dedicated team. Built around how your business actually works.",
      lead: "A compact, specialized team that learns your operation and runs it alongside you, in your time zone and in fluent English.",
      cols: 3,
      items: [
        { icon: "phone-incoming", title: "Answer every call", text: "Every missed call is a job you never booked. Your team picks up, qualifies, and books — in your time zone, in fluent English." },
        { icon: "trending-up", title: "Follow up on every lead", text: "Structured outbound and consistent follow-up where there was improvisation before. The work that grows revenue but never gets done." },
        { icon: "clipboard-check", title: "Keep the back office moving", text: "Scheduling, data entry, dispatch, and the admin that quietly eats your day. Handled, tracked, and off your plate." },
      ],
      teaser: { icon: "layout-dashboard", title: "One command center for your whole operation", text: "We build and operate the technology layer that keeps your channels, leads, and results in one place. Your team runs on it — you just see it working.", label: "See how it works", href: "/how-it-works" },
    }),
    b("home-steps", "stepsNavy", {
      eyebrow: "How we build your team",
      title: "From your operation to a team that runs it. In your first 60 days.",
      steps: [
        { num: 1, title: "We map your operation", text: "We learn how your business actually runs — your tools, your standards, your workflow. No rip and replace." },
        { num: 2, title: "We build your team", text: "Bilingual specialists, hired and trained around your process, in your time zone." },
        { num: 3, title: "We co-manage", text: "We run alongside you while the team ramps. Onboarded in month one, metrics in place by month two." },
        { num: 4, title: "It runs without you in every decision", text: "You move from working inside the business to working on it." },
      ],
      cta: { label: "See the full process", href: "/how-it-works" },
    }),
    b("home-industries", "indCards", {
      eyebrow: "Industries",
      title: "Built for the operation you actually run.",
      cols: 3,
      cards: [
        { tag: "Home Services", title: "When the phone is your office", text: "Cleaning, landscaping, pest control, HVAC, plumbing. Every missed call is lost revenue. Build a team that never lets one ring out.", label: "Home Services", href: "/industries/home-services" },
        { tag: "NEMT &amp; Student Transportation", title: "Regulated rides under strict SLAs", text: "One missed pickup can cost the contract. Scale dispatch and support without dropping standards.", label: "Transportation", href: "/industries/transportation" },
        { tag: "3PL &amp; Logistics", title: "Track, trace, and back office", text: "Carrier sales and back office that consume your team's capacity. Add specialized support that scales with volume.", label: "3PL &amp; Logistics", href: "/industries/logistics" },
      ],
    }),
    b("home-changes", "costGridNavy", {
      eyebrow: "What to expect",
      title: "What changes when the team is running.",
      cols: 2,
      items: [
        { icon: "phone-incoming", title: "More booked jobs", text: "The calls you used to miss get answered." },
        { icon: "clock", title: "Faster follow-up", text: "On the leads and estimates that used to go cold." },
        { icon: "calendar-check", title: "Live in 60 days", text: "Onboarded in your first month, with metrics and SLAs in place by the second." },
        { icon: "trending-up", title: "Room to grow", text: "Every client so far has expanded their team, moving beyond customer service and booking into back office and marketing operations." },
      ],
    }),
    b("home-faq", "faq", {
      surface: "tint",
      eyebrow: "FAQ",
      title: "Straight answers, before you book.",
      items: [
        { q: "What is nearshore, and how is it different from offshore?", a: "Nearshore means your team sits in Latin America, in the same time zones as the US, working your business hours in fluent English. You get the cost advantage of remote talent without the overnight lag and cultural gap of traditional offshore." },
        { q: "Is this just a call center?", a: "No. A call center runs a generic script for many clients. Your Vivo team is dedicated to your business, trained on your operation, and works only your account, to your standards." },
        { q: "How fast is my team up and running?", a: "Onboarded in the first month, with metrics in place by the second. You see the operation change inside your first 60 days." },
        { q: "How much does it cost?", a: "You pay a predictable monthly rate per role, with no local hiring overhead. Most owners start with a 3-month pilot at an accessible cost, so you can evaluate on real results before committing further. See How It Works for the full model." },
        { q: "Where is the team based?", a: "In Latin America, in US-aligned time zones, with bilingual talent at professional English proficiency." },
        { q: "Do I lose control of my business?", a: "No. You keep control. The team operates to your standards and your voice, and we co-manage until it runs on its own. You are freeing the operation, not handing it off." },
      ],
    }),
    b("home-cta", "ctaBand", {
      eyebrow: "Book a clarity call",
      title: "Stop doing it all alone.",
      lead: "One call. We map your operation and show you exactly what a dedicated team would take off your plate.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
      talentNote: 'Looking to join the team instead? <a href="/careers">Careers</a>',
    }),
  ],
};

/* ══════════════ HOW IT WORKS ══════════════ */
const howItWorks: PageDoc = {
  slug: "how-it-works", path: "/how-it-works", title: "How it works", navGroup: "how-it-works",
  description: "The canonical Vivo model: owner control, a 4-step build, cost vs value, and the technology layer.",
  blocks: [
    b("hiw-hero", "hero", {
      variant: "photo", image: "/photos/meet.png", imageAlt: "A team collaborating around a table",
      eyebrow: "How it works",
      title: "You built this. We help you run it, while you keep control.",
      lead: "Vivo works alongside you. Your team operates to your standards, in your voice, on your tools — co-managed until you trust it to run on its own.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
    }),
    b("hiw-hesitate", "contrast", {
      eyebrow: "Why owners hesitate",
      title: "You've been burned before. This is built differently.",
      lead: "In-house hiring was expensive and slow. Software you bought never got used. Traditional outsourcing gave you low cost and lower quality. Vivo is built for the owner who is done with all three.",
      cards: [
        { title: 'Dedicated <span class="em">to your business</span>', text: "Your team works only your account, with its own standards and voice." },
        { title: 'Co-managed <span class="em">until it runs</span>', text: "We run alongside you until the team operates on its own." },
        { title: 'Built <span class="em">to your standards</span>', text: "The team learns your operation and represents your business the way you would." },
      ],
    }),
    b("hiw-process", "stepsVertical", {
      eyebrow: "The process, step by step",
      title: "How a Vivo team gets built.",
      steps: [
        { num: 1, label: "Discovery", title: "We map how your business actually runs", text: "Where calls come from, where leads leak, what eats your day, which tools you already use. We build around your workflow instead of forcing you into ours." },
        { num: 2, label: "Build", title: "We recruit and train around your process", text: "Bilingual specialists learn your industry language, your standards, and your systems before they touch a live customer." },
        { num: 3, label: "Co-manage", title: "Your team goes live with us running alongside", text: "Onboarded in the first month, with metrics and SLAs in place by the second. You always have visibility into what is happening." },
        { num: 4, label: "Independent", title: "The team runs to your standard without you in every decision", text: "Your time moves from inside the business to on top of it." },
      ],
    }),
    b("hiw-cost", "costValue", {
      eyebrow: "Cost & value",
      title: "Less cost. More operation.",
      leads: [
        'A dedicated member of your Vivo team starts at <b style="color:var(--vivo-navy); font-family:var(--font-heading);">$24,000 a year</b>, billed monthly. The same role as a local hire runs $50,000 to $65,000 once you add payroll taxes, health coverage, PTO, recruiting, and overhead. Same standard of work. Less than half the cost.',
        "But cost is only half the story. What changes is the operation itself.",
      ],
      cards: [
        { icon: "users", fig: "~2&times;", title: "With your team", text: "Roughly double the effective capacity. The calls you used to miss get answered. The leads that used to go cold get followed up. Your team stops leaking jobs." },
        { icon: "cpu", fig: "3&ndash;4&times;", highlight: true, title: "With your team and our technology", text: "We build and operate the dashboards, integrations, and tracking that remove the work instead of just staffing it. Automated status updates cut inbound calls. Integrations end double entry. You see problems before they become complaints. This is technology we build and run as part of your team — not software you have to implement." },
      ],
      midLead: "This is why every client so far has expanded — starting with customer service and booking, then adding back office, marketing, and the technology layer that compounds the results.",
      checklist: [
        { title: "Start with one person, or a 2-seat POD.", text: "Add to the team as the work proves out." },
        { title: "Priced by role and volume.", text: "As your team scales, the rate flexes with it." },
        { title: "Begin with a 3-month pilot.", text: "Low commitment, real evaluation. You judge Vivo on what changes in your operation, not on a promise." },
      ],
      cta: { label: "Book a clarity call for a quote built around your operation", href: "/book" },
    }),
    b("hiw-tech", "techLayer", {
      eyebrow: "Talent + technology",
      title: "Talent, and the technology to make it compound.",
      lead: "Your Vivo team does the work. It runs on a command center we build and operate for you — connecting your acquisition channels, your leads, and your performance in one place. We build it, we run it, you see it working.",
      caps: [
        { icon: "layout-grid", title: "Every channel in one place", text: "Meta, Google, LinkedIn, TikTok, and your other acquisition channels, unified. You see what's working and what's wasting money without logging into five dashboards." },
        { icon: "gauge", title: "Every lead scored and prioritized", text: "AI scores each lead in plain language, so your team works the ones most likely to convert first." },
        { icon: "route", title: "The right lead to the right person", text: "Leads route automatically to the advisor who should handle them." },
        { icon: "flame", title: "Nothing goes cold", text: "Automated follow-up keeps leads warm until they're ready to move." },
        { icon: "message-square-text", title: "Call, text, and log from one screen", text: "Built-in calling and messaging, with every touch tracked." },
        { icon: "bar-chart-3", title: "One clear report", text: "Standard and custom reporting on what actually moved the needle." },
      ],
      footLead: 'This is the layer that takes the operation from roughly double to <b style="color:var(--vivo-green);">3&times; or 4&times;</b>. The team answers and follows up. The technology removes the busywork and shows you exactly where your money is going. Talent and technology, operated as one.',
    }),
    b("hiw-compare", "compare", {
      eyebrow: "Vivo vs the alternatives",
      title: "How Vivo compares to what you're considering now.",
      columns: ["In-house hire", "Offshore call center", "Doing nothing", "Vivo"],
      rows: [
        { label: "Cost", cells: ["Highest", "Low", "None, but you pay in lost jobs", "Less than half of local"] },
        { label: "Time zone", cells: ["Yours", "Overnight lag", "&mdash;", "Yours"] },
        { label: "Dedicated to you", cells: ["Yes", "No, shared queue", "&mdash;", "Yes"] },
        { label: "Trained on your operation", cells: ["Eventually", "No", "&mdash;", "Before going live"] },
        { label: "Co-managed ramp", cells: ["No", "No", "&mdash;", "Yes"] },
        { label: "Quality control", cells: ["On you", "Generic script", "&mdash;", "Your standards"] },
      ],
      note: 'The honest read: in-house gives you control at a cost most owners this size cannot justify. Offshore gives you cost without control. Doing nothing feels free until you count the jobs you never booked. <strong>Vivo is built to give you control and cost at the same time.</strong>',
    }),
    b("hiw-faq", "faq", {
      eyebrow: "FAQ",
      title: "The mechanism, the cost, the timing.",
      items: [
        { q: "How does the co-management model actually work?", a: "Your team does not go live and disappear into your org chart. Vivo stays involved — managing quality, tracking metrics, and running the team alongside you until it operates independently. You keep visibility the entire time." },
        { q: "What do I need to have in place before starting?", a: "Very little. We work with the tools you already use before adding anything new. If you run on a phone and a spreadsheet today, we start there and build structure as we go." },
        { q: "How long until I see results?", a: "The operation starts changing inside your first 60 days. Onboarding happens in month one, and measurable metrics are in place by month two." },
        { q: "What if it is not working?", a: "That is what the 3-month pilot is for. You evaluate on real outcomes at an accessible cost, and you decide with evidence rather than a contract locking you in." },
        { q: "Can Vivo handle a regulated operation, like NEMT?", a: "Yes. Vivo already runs transportation operations under strict SLAs, where a single missed ride carries real consequences. The team is trained on the industry language and protocols before going live." },
        { q: "Who is behind Vivo?", a: "Operators who have run these businesses from the inside, not a staffing agency placing bodies. Meet the team on About Us." },
      ],
    }),
    b("hiw-cta", "ctaBand", {
      eyebrow: "Book a clarity call",
      title: "See exactly what a dedicated team would take off your plate.",
      lead: "Book a clarity call. We map your operation and show you the specific work a Vivo team would own — and what it would cost.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
      secondaryCta: { label: "Explore your industry", href: "/industries/home-services" },
    }),
  ],
};

/* ══════════════ HOME SERVICES ══════════════ */
const homeServices: PageDoc = {
  slug: "industries/home-services", path: "/industries/home-services", title: "Home Services", navGroup: "industries",
  description: "When the phone is your office, every missed call is a job you never booked. Vivo answers, follows up, and coordinates crews.",
  blocks: [
    b("hs-hero", "hero", {
      variant: "placeholder",
      eyebrow: "Home Services",
      title: "When the phone is your office, every missed call is a job you never booked.",
      lead: "Vivo builds you a dedicated team that answers every call, follows up on every quote, and coordinates your crews — so the work stops slipping through the cracks while you're on a job.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
      secondaryCta: { label: "See how it works", href: "/how-it-works" },
      photoNote: "Full-bleed hero, owner-operator's world — tech at a residential job or owner on the phone in a work truck. 2560px · 16:9 · &lt;350&nbsp;KB · navy overlay 80% on text side. No office scenes.",
    }),
    b("hs-proof", "proof", { main: 'Built by operators who have run <span class="hl">service businesses</span> from the inside.' }),
    b("hs-do", "splitDo", {
      eyebrow: "What we do",
      title: "One dedicated team, built around how your service business runs.",
      imageSide: "right", ratio: "120%",
      phLabel: "A crew or tech doing real work, or a dispatch coordination moment.", phSpec: "1600px · 3:2 · <200 KB",
      items: [
        { icon: "phone-incoming", title: "Never miss an inbound call", text: "Your team answers, qualifies, and books — in your time zone, in fluent English. Every ring becomes a booked job instead of a voicemail." },
        { icon: "message-square", title: "Follow up on every estimate", text: "The quotes that go cold because nobody chased them get chased. Consistent follow-up turns more estimates into signed work." },
        { icon: "calendar-days", title: "Coordinate crews and schedules", text: "Dispatch, scheduling changes, and day-of coordination handled — so your field teams stay productive and your customers stay informed." },
        { icon: "clipboard-check", title: "Keep the back office moving", text: "Data entry, invoicing support, review requests, and the admin that eats your evenings. Off your plate." },
      ],
    }),
    b("hs-teaser", "teaser", {
      eyebrow: "How it works",
      title: "From your operation to a working team in your first 60 days.",
      text: "We map how your business runs, build a bilingual team around your process, and co-manage until it operates to your standard without you in every decision.",
      cta: { label: "See the full process", href: "/how-it-works" },
    }),
    b("hs-math", "costGridNavy", {
      eyebrow: "The math",
      title: "The math on a phone you can't always answer.",
      leads: [
        "A service business doing 200 calls a day needs 4 to 5 people to answer them without callers giving up and hanging up. Most owners never hire that. They cover it with themselves and an assistant or two, at half the capacity the volume actually needs. That gap is the jobs slipping away while you're on a roof.",
        'A local team that size runs <b style="color:#fff; font-family:var(--font-heading);">$220,000 to $310,000 a year</b> fully loaded. A Vivo POD covers the same volume for less than half — and gives you the capacity you were never going to hire for on your own.',
      ],
      cols: 2,
      items: [
        { icon: "phone-incoming", title: "Every missed call answered", text: "Means a job booked instead of lost to the competitor who picked up." },
        { icon: "layers", title: "Start with a 2-seat POD", text: "And scale as the work proves out." },
      ],
    }),
    b("hs-cta", "ctaBand", {
      eyebrow: "Book a clarity call",
      title: "Stop losing jobs to a phone you can't always answer.",
      lead: "One call. We map your operation and show you exactly what a dedicated team would take off your plate.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
    }),
  ],
};

/* ══════════════ TRANSPORTATION ══════════════ */
const transportation: PageDoc = {
  slug: "industries/transportation", path: "/industries/transportation", title: "NEMT & Student Transportation", navGroup: "industries",
  description: "In regulated transport, one missed pickup can cost the contract. Vivo scales dispatch and support while holding your SLAs.",
  blocks: [
    b("tr-hero", "hero", {
      variant: "placeholder",
      eyebrow: "NEMT &amp; Student Transportation",
      title: "In regulated transport, one missed pickup can cost you the contract.",
      lead: "Vivo scales your dispatch and support with bilingual teams that already understand NEMT and student transportation — so you hold your SLAs even through demand spikes.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
      secondaryCta: { label: "See how it works", href: "/how-it-works" },
      photoNote: "Full-bleed hero — wheelchair-accessible van or a driver respectfully assisting a passenger. Dignity is non-negotiable. 2560px · 16:9 · &lt;350&nbsp;KB · navy overlay.",
    }),
    b("tr-proof", "proofBlockNavy", {
      eyebrow: "Real proof",
      title: "The most credible page we have — so the proof leads.",
      quote: "“We already run transportation operations handling thousands of daily rides under strict SLAs, where a single error carries real consequences. Our teams are trained on the industry language and protocols before they ever touch a live call.”",
      cite: "A track record from operating in regulated transportation directly — not a pitch.",
    }),
    b("tr-do", "splitDo", {
      eyebrow: "What we do",
      title: "Teams that speak your operation from day one.",
      imageSide: "left", ratio: "120%",
      phLabel: "A dispatch / coordination scene, or a student-transport vehicle.", phSpec: "1600px · 3:2 · <200 KB",
      items: [
        { icon: "phone-call", title: "High-volume inbound", text: "Handle 500 to 6,000 calls a day with the staffing to keep average handle time near target and wait times low." },
        { icon: "route", title: "Dispatch and coordination", text: "Real-time coordination and route support that keeps rides on schedule and contracts intact." },
        { icon: "gauge", title: "Scale without dropping standards", text: "Ramp fast for peak demand without compromising the SLAs your contracts depend on." },
        { icon: "layout-dashboard", title: "One command center for the whole operation", text: "We build and operate the technology layer that unifies your channels, leads, and dispatch performance in one place. Your team runs on it &mdash; you see it working." },
      ],
    }),
    b("tr-teaser", "teaser", {
      eyebrow: "How it works",
      title: "Built around your operation, co-managed until it runs on its own.",
      cta: { label: "See the full process", href: "/how-it-works" },
    }),
    b("tr-results", "leadSection", {
      eyebrow: "Results",
      title: "What operators see.",
      leads: ["Bilingual teams that hold your SLAs under pressure, scale fast for demand spikes, and coordinate high call volume while keeping wait times low. Co-managed until the team runs to your standard on its own."],
    }),
    b("tr-cta", "ctaBand", {
      eyebrow: "Book a clarity call",
      title: "Scale your operation without risking the contract.",
      lead: "We'll show you how a Vivo team holds your standards under pressure.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
    }),
  ],
};

/* ══════════════ LOGISTICS ══════════════ */
const logistics: PageDoc = {
  slug: "industries/logistics", path: "/industries/logistics", title: "3PL & Logistics", navGroup: "industries",
  description: "Track and trace, carrier sales, and back office support that scales with your volume.",
  blocks: [
    b("lg-hero", "hero", {
      variant: "placeholder",
      eyebrow: "3PL &amp; Logistics",
      title: "When shipments go dark, customers call and your team stops shipping.",
      lead: "Vivo adds specialized support for track and trace, carrier sales, and back office — so your operation scales without pulling your team off the floor.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
      photoNote: "Full-bleed hero — a warehouse, a truck at a dock, or a driver with a handheld scanner. 2560px · 16:9 · &lt;350&nbsp;KB · navy overlay.",
    }),
    b("lg-do", "splitDo", {
      eyebrow: "What we do",
      title: "Logistics support that scales with your volume.",
      imageSide: "right", ratio: "110%",
      phLabel: "Pallets and racking, or a shipment-tracking screen.", phSpec: "1600px · 3:2 · <200 KB",
      items: [
        { icon: "package-search", title: "Track and trace", text: "Proactive shipment updates and status handling — so customers stop calling for visibility you can give them first." },
        { icon: "handshake", title: "Carrier sales support", text: "A structured, consistent process where there was improvisation before." },
        { icon: "calculator", title: "Back office", text: "Accounting support and data entry that free your operational team to move freight." },
      ],
    }),
    b("lg-teaser", "teaser", {
      eyebrow: "How it works",
      title: "The same model, adapted to logistics.",
      cta: { label: "See the full process", href: "/how-it-works" },
    }),
    b("lg-cta", "ctaBand", {
      eyebrow: "Book a clarity call",
      title: "Add capacity without adding overhead.",
      primaryCta: { label: "Book a clarity call", href: "/book" },
    }),
  ],
};

/* ══════════════ ABOUT ══════════════ */
const about: PageDoc = {
  slug: "about", path: "/about", title: "About us", navGroup: "about",
  description: "Vivo started inside the businesses it now serves. Meet the operators behind the team.",
  blocks: [
    b("ab-origin", "originNavy", {
      eyebrow: "About us",
      title: "We built the team we wished we'd had.",
      lead: "Vivo started inside the businesses it now serves. Our founders ran operations in U.S. home services and regulated transportation, and hit the same wall every owner hits. The only ways to get real help were too expensive, too slow, or too disconnected to work. Local hiring drained cash and took months. Offshore outsourcing traded quality for cost. So we built the alternative we wanted: a dedicated nearshore team that operates like an internal hire, co-managed until it runs on its own.",
    }),
    b("ab-founders", "founders", {
      eyebrow: "Founders",
      title: "Operators who've run these businesses.",
      people: [
        { name: "Daniel Hernández", role: "CEO", text: "Operator with direct experience running US businesses, based in Utah, with firsthand knowledge of home services and NEMT / student transportation." },
        { name: "Juan Pablo Rivas", role: "COO", text: "Leads operations and delivery structure." },
        { name: "Felipe Jiménez", role: "CGO", text: "Leads product and growth, plus marketing and business development." },
        { name: "Víctor Sandoval", role: "CTO", text: "Leads the technology layer — the dashboards, integrations, and tracking Vivo builds and operates as part of each team." },
      ],
    }),
    b("ab-team", "splitText", {
      surface: "tint", imageSide: "right", ratio: "70%",
      eyebrow: "Our team",
      title: "A trained team that stays.",
      lead: "Behind every Vivo POD are specialists who are trained, supported, and held to a standard. We hire for capability and English fluency, and we invest in the people who represent your business.",
      phTag: "Photo · real Vivo team", phLabel: "Candid group or workspace shot. Consistency of lighting is the rule.", phSpec: "1600px · 3:2 · <200 KB",
    }),
    b("ab-culture", "splitText", {
      imageSide: "left", ratio: "70%",
      eyebrow: "Our culture",
      title: "Flat in voice and respect. Clear in responsibility.",
      lead: "We operate as one team across two countries. Everyone has a voice, everyone owns their outcomes, and no one hides behind a title.",
      phTag: "Photo · culture", phLabel: "Real people, real workspace, natural moment. No stock.", phSpec: "1600px · 3:2 · <200 KB",
      cta: { label: "See open roles", href: "/careers" },
    }),
    b("ab-cta", "ctaBand", {
      eyebrow: "Connect",
      title: "Meet the people behind Vivo.",
      lead: "Founders and company on LinkedIn.",
      secondaryCta: { label: "Company LinkedIn", href: "#", icon: "arrow-up-right" },
      primaryCta: { label: "Book a clarity call", href: "/book" },
    }),
  ],
};

/* ══════════════ INSIGHTS ══════════════ */
const insights: PageDoc = {
  slug: "insights", path: "/insights", title: "Insights", navGroup: "insights",
  description: "Practical perspective on running lean service and transport operations, from people who have done it.",
  blocks: [
    b("in-hero", "insightsHero", {
      eyebrow: "Insights",
      title: "Insights for owners who want to grow without burning out.",
      lead: "Practical perspective on running lean service and transport operations, from people who have done it.",
    }),
    b("in-hub", "insightsHub", {
      chips: ["All", "Home Services", "NEMT &amp; Student Transportation", "3PL &amp; Logistics", "Technology"],
      featured: {
        cat: "Case study · Technology",
        title: "How one operator ran driver acquisition across 40+ U.S. cities from a single command center.",
        text: "A high-volume acquisition operation was running across dozens of cities and every channel at once. The command center surfaced that one city's cost per lead was many times higher than another's, flagged it in plain language, and the team reallocated budget. The point isn't the month — it's the system catching what a human would miss.",
        bullets: [
          "Thousands of leads managed across 40+ U.S. cities in one place.",
          "Every acquisition channel unified in a single command center.",
          "AI surfacing cost inefficiencies city by city — and driving a budget decision.",
          "The full loop: acquire, score, prioritize, contact, and follow up, in one operated system.",
        ],
        cta: { label: "See what this could do for your operation", href: "/book" },
      },
      articles: [
        { cat: "Home Services · Article", title: "The real cost of a missed call for a home services business", text: "[ Real content needed — first article. Ties to the primary buyer's pain and a real search query. ]", phLabel: "Missed-call / home-services theme.", phSpec: "800×533 · <90 KB" },
      ],
      launchNote: "The technology case study above satisfies the launch gate (one real, fully anonymized case). Add the first article before opening the hub more widely. No dummy posts.",
    }),
  ],
};

/* ══════════════ CAREERS HUB ══════════════ */
const careers: PageDoc = {
  slug: "careers", path: "/careers", title: "Careers", navGroup: "careers",
  description: "Work with U.S. businesses. Grow inside a team that invests in you. Paid in USD. Fully remote.",
  blocks: [
    b("ca-hero", "hero", {
      variant: "placeholder",
      eyebrow: "Careers",
      title: "Work with U.S. businesses. Grow inside a team that invests in you.",
      lead: "Vivo is not a place that places you and disappears. You join a dedicated team, you're trained and supported, and you build a real career working directly with U.S. companies. Paid in USD. Fully remote.",
      primaryCta: { label: "See open roles", href: "#open-positions" },
      photoNote: 'Full-bleed hero — the <b style="color:#fff;">real Vivo team</b> at work, authentic and energized. The one hero where your own people belong. 2560px · 16:9 · &lt;350&nbsp;KB · navy overlay.',
    }),
    b("ca-roles", "indCards", {
      anchor: "open-positions",
      eyebrow: "Open positions",
      title: "Three ways to build your career with U.S. companies.",
      cols: 3,
      cards: [
        { tag: "Customer Service", title: "Customer Service Representative", text: "Be the voice a U.S. business trusts with every customer. You own the account, start to finish.", label: "View role · C1 English", href: "/careers/customer-service-representative", topColor: "var(--vivo-green)" },
        { tag: "Sales", title: "Sales Representative", text: "Turn conversations into booked business. You own a real pipeline. USD plus bonuses.", label: "View role · C1 English", href: "/careers/sales-representative", topColor: "var(--vivo-green)" },
        { tag: "Back Office", title: "Back Office Representative", text: "Keep a U.S. operation running clean behind the scenes. Accuracy is the job.", label: "View role · high B2 English", href: "/careers/back-office-representative", topColor: "var(--vivo-green)" },
      ],
    }),
    b("ca-culture", "splitText", {
      surface: "tint", imageSide: "right", ratio: "75%",
      eyebrow: "Culture & benefits",
      title: "Flat in voice and respect. Clear in responsibility.",
      lead: "A team where you're heard, your growth is supported, and your work has visible impact.",
      list: [
        "Paid in USD.",
        "Fully remote.",
        "Paid time off and local holidays.",
        "Standard equipment and home-office support.",
        "Training and a clear path to grow into senior and team-lead roles.",
        "You work with one business and own your account, supported by a team that invests in you.",
      ],
      phTag: "Photo · team / workspace", phLabel: "Candid, real people. Consistency of lighting.", phSpec: "1600px · 3:2 · <200 KB",
    }),
  ],
};

/* ── shared role-page builder ── */
function rolePage(opts: {
  slug: string; title: string; navTitle: string;
  eyebrow: string; heroTitle: string; heroLead: string; english: string; englishBadge: string; usdMeta: string;
  anchor: string; intro: string;
  doItems: string[]; successItems: string[];
  must: string[]; nice: string[]; notForYou: string[];
  offerTitle: string; colA: string[]; colB: string[];
  experienceLabel: string; storyLabel: string; defaultEnglish: string;
}): PageDoc {
  return {
    slug: `careers/${opts.slug}`, path: `/careers/${opts.slug}`, title: opts.title, navGroup: "careers",
    description: opts.heroLead,
    blocks: [
      b(`${opts.slug}-hero`, "hero", {
        variant: "placeholder", crumb: "All roles", crumbHref: "/careers",
        eyebrow: opts.eyebrow, title: opts.heroTitle, lead: opts.heroLead,
        roleMeta: [
          { icon: "map-pin", text: "Remote · Latin America" },
          { icon: "dollar-sign", text: opts.usdMeta },
          { icon: "badge-check", text: opts.englishBadge },
        ],
        primaryCta: { label: "Apply now", href: `#${opts.anchor}` },
      }),
      b(`${opts.slug}-intro`, "roleIntro", { eyebrow: "The role at Vivo", lead: opts.intro }),
      b(`${opts.slug}-split`, "roleSplitLists", {
        leftEyebrow: "What you'll do", left: opts.doItems,
        rightEyebrow: "What success looks like", right: opts.successItems,
      }),
      b(`${opts.slug}-req`, "requirements", { eyebrow: "Requirements", title: "What we're looking for.", must: opts.must, nice: opts.nice, notForYou: opts.notForYou }),
      b(`${opts.slug}-offer`, "offer", { eyebrow: "What we offer", title: opts.offerTitle, colA: opts.colA, colB: opts.colB }),
      b(`${opts.slug}-hire`, "hiringSteps", { eyebrow: "How hiring works", title: "Five steps. Clear the whole way.", steps: ["Apply.", "English and skills screen.", "Interview with the team.", "A short practical exercise using a real scenario.", "Offer."] }),
      b(`${opts.slug}-apply`, "applyForm", { anchor: opts.anchor, title: opts.title.replace("Careers · ", "").length ? `Apply for ${opts.navTitle}.` : "Apply.", role: opts.navTitle, experienceLabel: opts.experienceLabel, storyLabel: opts.storyLabel, defaultEnglish: opts.defaultEnglish }),
    ],
  };
}

const csr = rolePage({
  slug: "customer-service-representative", title: "Customer Service Representative", navTitle: "Customer Service Representative",
  eyebrow: "Customer Service Representative",
  heroTitle: "Be the voice a U.S. business trusts with every customer.",
  heroLead: "Remote, Latin America. Paid in USD. You work with one company and own the account.",
  english: "C1", englishBadge: "English C1", usdMeta: "Paid in USD", anchor: "apply-csr",
  intro: "You are the dedicated voice of a single U.S. business. You learn one company's operation, you represent it to its customers, and you own the quality of every interaction. When a customer calls, you are who they trust.",
  doItems: [
    "Answer inbound calls, chats, and emails as the frontline of one U.S. business.",
    "Book jobs, resolve issues, and follow up so nothing slips through the cracks.",
    "Log every interaction accurately in the CRM so the whole team has visibility.",
    "Spot patterns and flag them, so recurring problems get fixed, not just handled one by one.",
  ],
  successItems: [
    "<b>Answer rate.</b> You catch the calls. Few go to voicemail on your watch.",
    "<b>First-contact resolution.</b> Most issues solved in a single interaction.",
    "<b>Customer satisfaction.</b> Customers rate their experience with you high.",
    "<b>Booking conversion.</b> Inbound opportunities turn into booked jobs, not lost ones.",
    "<b>Quality and adherence.</b> You hit the QA and schedule standards consistently.",
  ],
  must: [
    "English at C1. You hold a fast, natural phone conversation with a U.S. customer — including a frustrated one — without hesitating.",
    "Clear, calm communication under pressure.",
    "A reliable remote setup: a quiet space, stable high-speed internet, and the ability to work U.S. business hours.",
    "Comfortable learning and working across CRM and helpdesk tools.",
    "Coachable and comfortable being held to service metrics.",
  ],
  nice: ["Prior call center or customer service experience.", "Experience in home services, transportation, or logistics."],
  notForYou: [
    "Your English is conversational but breaks down under pressure on a live call.",
    "You want a job where no one tracks your numbers.",
    "You cannot commit to U.S. business hours.",
    "You are looking for something temporary between other plans.",
  ],
  offerTitle: "Paid in USD. Fully remote. A real career.",
  colA: ["Paid in USD.", "Fully remote.", "Paid time off and local holidays."],
  colB: ["Standard equipment and home-office support.", "Training and a clear path to grow into senior and team-lead roles.", "You work with one business and own your account, supported by a team that invests in you."],
  experienceLabel: "Years of customer service experience", storyLabel: "Tell us about a time you turned an upset customer around.", defaultEnglish: "C1",
});

const sales = rolePage({
  slug: "sales-representative", title: "Sales Representative", navTitle: "Sales Representative",
  eyebrow: "Sales Representative",
  heroTitle: "Turn conversations into booked business for a U.S. company.",
  heroLead: "Remote, Latin America. Paid in USD, plus performance-based bonuses. You own a real pipeline.",
  english: "C1", englishBadge: "English C1", usdMeta: "USD + performance bonuses", anchor: "apply-sales",
  intro: "You drive revenue for a single U.S. business. You work leads, you build trust on the phone, and you close. One company, one pipeline, your results.",
  doItems: [
    "Run outbound and inbound sales conversations by phone, chat, and email.",
    "Qualify leads, present the right solution, and build long-term client relationships.",
    "Follow up relentlessly so no opportunity goes cold.",
    "Keep a clean, accurate pipeline in the CRM.",
    "Meet and beat targets consistently.",
  ],
  successItems: [
    "<b>Conversion.</b> Leads become booked business at a strong rate.",
    "<b>Speed to follow-up.</b> You reach new leads fast, before they cool.",
    "<b>Pipeline activity.</b> Calls and follow-ups completed, consistently.",
    "<b>Target attainment.</b> You hit or exceed your number.",
    "<b>Win rate.</b> You close the opportunities you work.",
  ],
  must: [
    "English at C1. You persuade, handle objections, and build rapport live, without hesitating.",
    "Strong communication and persuasion skills.",
    "A goal-driven, proactive mindset. You chase the follow-up nobody else does.",
    "A reliable remote setup: quiet space, stable high-speed internet, and U.S. business hours.",
    "Comfortable working in a CRM and being held to targets.",
  ],
  nice: ["Prior sales or customer acquisition experience.", "Experience in home services, transportation, or logistics."],
  notForYou: [
    "You go quiet after the first no.",
    "You dislike being measured on outcomes.",
    "You cannot commit to U.S. business hours.",
    "You wait to be told what to do next.",
  ],
  offerTitle: "USD, plus bonuses on what you close.",
  colA: ["Paid in USD, plus performance-based bonuses.", "Fully remote.", "Paid time off and local holidays."],
  colB: ["Standard equipment and home-office support.", "Training and a clear path to grow into senior and team-lead roles.", "You work with one business and own your pipeline, supported by a team that invests in you."],
  experienceLabel: "Years of sales experience", storyLabel: "Tell us about a deal you closed that almost fell through.", defaultEnglish: "C1",
});

const backoffice = rolePage({
  slug: "back-office-representative", title: "Back Office Representative", navTitle: "Back Office Representative",
  eyebrow: "Back Office Representative",
  heroTitle: "Keep a U.S. operation running clean behind the scenes.",
  heroLead: "Remote, Latin America. Paid in USD. You keep the operation moving so nothing falls through.",
  english: "B2", englishBadge: "English high B2", usdMeta: "Paid in USD", anchor: "apply-backoffice",
  intro: "You are the engine room of a single U.S. business. Scheduling, data, coordination, and the admin that keeps operations running. When the back office is clean, the whole company moves faster. That is your job.",
  doItems: [
    "Handle data entry, scheduling, and coordination with accuracy.",
    "Support invoicing and keep records clean and current.",
    "Keep information moving between the team so nothing stalls.",
    "Catch and fix the small errors before they become big ones.",
  ],
  successItems: [
    "<b>Accuracy.</b> Low error rate across everything you touch.",
    "<b>Turnaround.</b> Work completed on time, every time.",
    "<b>Throughput.</b> You handle real volume without dropping quality.",
    "<b>SLA and on-time completion.</b> You hit the standards the operation depends on.",
  ],
  must: [
    "English at a high B2. You communicate clearly in writing and handle systems in English.",
    "Strong attention to detail. Accuracy is the job.",
    "Organized and self-directed. You keep yourself on task.",
    "A reliable remote setup: quiet space, stable high-speed internet, and U.S. business hours.",
    "Comfortable working across spreadsheets and operational tools.",
  ],
  nice: ["Prior back-office, admin, or operations experience.", "Experience in home services, transportation, or logistics."],
  notForYou: [
    "You cut corners on accuracy to move faster.",
    "You need constant direction to stay on task.",
    "You cannot commit to U.S. business hours.",
    "Repetitive, detail-heavy work drains you.",
  ],
  offerTitle: "Paid in USD. Fully remote. A real career.",
  colA: ["Paid in USD.", "Fully remote.", "Paid time off and local holidays."],
  colB: ["Standard equipment and home-office support.", "Training and a clear path to grow into senior and team-lead roles.", "You work with one business and own your area, supported by a team that invests in you."],
  experienceLabel: "Years of back-office or admin experience", storyLabel: "Tell us about a process you made cleaner or more accurate.", defaultEnglish: "B2",
});

/* ══════════════ BOOK ══════════════ */
const book: PageDoc = {
  slug: "book", path: "/book", title: "Book a clarity call", navGroup: null,
  description: "One conversation. We map your operation and show you exactly what a dedicated team would take off your plate.",
  blocks: [
    b("bk", "bookHero", {
      eyebrow: "Book a clarity call",
      title: "One conversation. A clear picture.",
      lead: "We map your operation and show you exactly what a dedicated team would take off your plate — and what it would cost. No pressure, no generic pitch.",
      expect: [
        "We learn how your business runs today.",
        "We show you the specific work a Vivo team would own.",
        "You leave with a clear picture of cost and next steps.",
      ],
      panelTitle: "Pick a time",
      panelSub: "Choose a slot that works for you — the call takes about 30 minutes.",
      calendlyUrl: "",
    }),
  ],
};

export const SETTINGS = {
  nav: [
    { label: "Home", href: "/", group: "home" },
    { label: "How it works", href: "/how-it-works", group: "how-it-works" },
    { label: "Industries", href: "/industries/home-services", group: "industries" },
    { label: "About", href: "/about", group: "about" },
    { label: "Insights", href: "/insights", group: "insights" },
    { label: "Careers", href: "/careers", group: "careers" },
  ],
  headerCta: { label: "Book a clarity call", href: "/book" },
  footer: {
    blurb: "A dedicated team that runs your sales, support, and back office to your standards — co-managed until it runs on its own.",
    columns: [
      { heading: "Company", links: [
        { label: "How it works", href: "/how-it-works" },
        { label: "Industries", href: "/industries/home-services" },
        { label: "About us", href: "/about" },
        { label: "Insights", href: "/insights" },
      ] },
      { heading: "For businesses", links: [
        { label: "Home Services", href: "/industries/home-services" },
        { label: "Transportation", href: "/industries/transportation" },
        { label: "3PL & Logistics", href: "/industries/logistics" },
        { label: "Book a call", href: "/book" },
      ] },
      { heading: "Talent", links: [
        { label: "Careers", href: "/careers" },
        { label: "Our culture", href: "/about" },
      ] },
    ],
    copyright: "© 2026 Vivo. Grow faster. Operate smarter.",
    contactLine: "[ add phone ] · [ add email ] · Latin America · US-aligned time zones",
  },
};

export const SEED: SiteContent = {
  settings: SETTINGS,
  pages: [home, howItWorks, homeServices, transportation, logistics, about, insights, careers, csr, sales, backoffice, book],
};
