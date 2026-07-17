/**
 * NestHaven AI routes
 * ---------------------
 * Adds two endpoints to the existing Express app:
 *   POST /api/chat/property  -> "homes near <university>" finder
 *   POST /api/agent/visa     -> UK student-life AI agent (T4 visa, NHS, banking…)
 *
 * Uses Groq (free, OpenAI-compatible) when GROQ_API_KEY is set; otherwise
 * falls back to concise built-in answers so the site always works.
 *
 * Mounted from server.js:  require('./nesthaven-ai')(app, pool, axios);
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

// UK universities -> the city we hold listings for.
const UNIVERSITIES = [
  { name: 'university of hertfordshire', city: 'Hatfield' },
  { name: 'hertfordshire', city: 'Hatfield' },
  { name: 'university college london', city: 'London' },
  { name: 'ucl', city: 'London' },
  { name: 'kings college london', city: 'London' },
  { name: 'university of manchester', city: 'Manchester' },
  { name: 'manchester', city: 'Manchester' },
  { name: 'university of birmingham', city: 'Birmingham' },
  { name: 'birmingham', city: 'Birmingham' },
  { name: 'coventry university', city: 'Coventry' },
  { name: 'university of warwick', city: 'Coventry' },
  { name: 'coventry', city: 'Coventry' },
  { name: 'university of leeds', city: 'Leeds' },
  { name: 'leeds', city: 'Leeds' },
  { name: 'university of edinburgh', city: 'Edinburgh' },
  { name: 'edinburgh', city: 'Edinburgh' },
  { name: 'university of glasgow', city: 'Glasgow' },
  { name: 'glasgow', city: 'Glasgow' },
];

function detectCity(message) {
  const m = (message || '').toLowerCase();
  // longest match first so "university of X" wins over bare "X"
  const hit = UNIVERSITIES
    .slice()
    .sort((a, b) => b.name.length - a.name.length)
    .find((u) => m.includes(u.name));
  return hit ? hit.city : null;
}

async function groqChat(system, user) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  try {
    // Node 18+ has global fetch
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.3,
        max_tokens: 700,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

const VISA_SYSTEM = `You are NestHaven's UK Student Guide — a warm, precise assistant for
international students arriving in the United Kingdom on a Student (T4) visa.
You give firm, practical, step-by-step answers about: the Student visa (eligibility,
BRP/eVisa, CAS, financial requirement, working hours), opening a UK bank account,
registering with the NHS and a GP, getting a National Insurance number, council-tax
exemption for students, TB tests, the IHS surcharge, and general settling-in.
Rules: be concise and use short numbered steps where helpful. Always remind the user
to confirm specifics on official GOV.UK or NHS.uk pages. Never invent legal advice or
exact fees you are unsure of — say "check GOV.UK for the current figure". Keep answers
under ~200 words unless asked for detail.`;

function visaFallback(message) {
  const m = (message || '').toLowerCase();
  if (m.includes('bank'))
    return {
      answer:
        `Opening a UK student bank account — the essentials:\n\n` +
        `1. Pick a bank. App-based banks (Monzo, Starling, Revolut) are fastest and accept ` +
        `students easily. High-street options: HSBC, Barclays, Lloyds, NatWest (some have student accounts).\n` +
        `2. Documents you'll usually need: passport + BRP/visa, university enrolment/acceptance letter, ` +
        `and proof of UK address (tenancy agreement or a bank/university letter).\n` +
        `3. Apply in the app or book a branch appointment. App banks can approve within days.\n` +
        `4. No UK address yet? Monzo/Starling often accept your enrolment letter to get started.\n\n` +
        `Tip: your university usually issues a "bank introduction letter" — ask student services.`,
      sources: [
        { label: 'Monzo — students', url: 'https://monzo.com/' },
        { label: 'UKCISA — Money & banking', url: 'https://www.ukcisa.org.uk/' },
      ],
    };
  if (m.includes('nhs') || m.includes('gp') || m.includes('doctor'))
    return {
      answer:
        `The NHS is the UK's free public healthcare system. As a student who paid the ` +
        `Immigration Health Surcharge (IHS) with your visa, you can use it.\n\n` +
        `Register with a GP (family doctor):\n` +
        `1. Find your nearest GP surgery on the NHS website by postcode.\n` +
        `2. Fill in the GMS1 registration form (online or at the surgery).\n` +
        `3. Bring ID (passport/BRP) and proof of address if asked — but you can't be refused ` +
        `for lacking documents.\n` +
        `4. You'll get an NHS number. Registration is free.\n\n` +
        `For emergencies call 999; for non-urgent advice call 111.`,
      sources: [
        { label: 'NHS — Register with a GP', url: 'https://www.nhs.uk/nhs-services/gps/how-to-register-with-a-gp-surgery/' },
      ],
    };
  if (m.includes('national insurance') || m.includes(' ni ') || m.includes('ni number'))
    return {
      answer:
        `A National Insurance (NI) number is needed to work in the UK.\n\n` +
        `1. You can start working before it arrives — just tell your employer it's "applied for".\n` +
        `2. Apply online at GOV.UK ("Apply for a National Insurance number").\n` +
        `3. You'll verify your identity (passport/BRP) and may get a short phone/online interview.\n` +
        `4. Your number arrives by post, usually within a few weeks.\n\n` +
        `It's free — never pay a third-party site for it.`,
      sources: [{ label: 'GOV.UK — Apply for an NI number', url: 'https://www.gov.uk/apply-national-insurance-number' }],
    };
  if (m.includes('work') || m.includes('hours') || m.includes('job'))
    return {
      answer:
        `Working on a Student visa:\n\n` +
        `• Degree students at a higher-education provider can usually work up to 20 hours/week ` +
        `during term time, and full-time in holidays.\n` +
        `• Your exact limit (20 or 10 hours) is printed on your BRP/visa — always check it.\n` +
        `• You cannot be self-employed, work as a professional sportsperson, or fill a full-time ` +
        `permanent role.\n` +
        `• Breaching work limits can affect your visa, so keep within your hours.\n\n` +
        `Confirm your personal conditions on your visa and GOV.UK.`,
      sources: [{ label: 'GOV.UK — Student visa: Work', url: 'https://www.gov.uk/student-visa/work' }],
    };
  if (m.includes('council tax'))
    return {
      answer:
        `Full-time students are generally exempt from council tax.\n\n` +
        `1. If everyone in your home is a full-time student, the property is usually fully exempt.\n` +
        `2. Get a "council tax exemption certificate" from your university (student services).\n` +
        `3. Send it to your local council, or fill in their student exemption form online.\n` +
        `4. In a mixed house (students + non-students), a discount may apply instead of full exemption.\n\n` +
        `Apply early — councils sometimes send bills before your exemption is processed.`,
      sources: [{ label: 'GOV.UK — Council Tax: students', url: 'https://www.gov.uk/council-tax/discounts-for-full-time-students' }],
    };
  // generic
  return {
    answer:
      `I'm your UK Student Guide. I can walk you through the Student (T4) visa, opening a bank ` +
      `account, registering with the NHS/GP, getting a National Insurance number, council-tax ` +
      `exemption, working hours and more. Ask me something specific like "How do I open a bank ` +
      `account?" or "How do I register with a GP?" and I'll give you clear steps.\n\n` +
      `Always confirm the latest details on official GOV.UK and NHS.uk pages.`,
    sources: [
      { label: 'GOV.UK — Student visa', url: 'https://www.gov.uk/student-visa' },
      { label: 'UKCISA — International student advice', url: 'https://www.ukcisa.org.uk/' },
    ],
  };
}

module.exports = function registerNestHavenAI(app, pool, axios) {
  // ---- Property finder chatbot ----
  app.post('/api/chat/property', async (req, res) => {
    try {
      const { message = '' } = req.body || {};
      const city = detectCity(message);
      const term = city || message.replace(/[^a-z\s]/gi, ' ').trim();

      let rentals = [];
      try {
        const [rows] = await pool.query(
          `
          SELECT rp.*, c.city_name, c.country_code
          FROM rental_properties rp
          JOIN cities c ON rp.city_code = c.code
          WHERE c.city_name = ? OR rp.title LIKE ? OR rp.neighbourhood LIKE ?
          ORDER BY rp.id DESC
          LIMIT 6
          `,
          [term, `%${term}%`, `%${term}%`]
        );
        rentals = rows;
      } catch (e) {
        rentals = [];
      }

      const properties = rentals.map((r) => {
        let photos = [];
        try {
          const parsed = r.photos ? JSON.parse(r.photos) : [];
          photos = Array.isArray(parsed)
            ? parsed.map((h) => (String(h).startsWith('http') ? h : `https://cdn.uniplaces.com/property-photos/${h}/large`))
            : [];
        } catch { photos = []; }
        if (!photos.length) photos = ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=70'];
        return {
          id: r.offerid || String(r.id),
          source: 'uniplaces',
          title: r.title || 'Student Accommodation',
          city: r.city_name,
          neighbourhood: r.neighbourhood,
          price: Number(r.price) || 0,
          pricePer: 'month',
          currency: r.currency || 'GBP',
          bedrooms: Number(r.number_of_rooms) || 1,
          bathrooms: Number(r.number_of_bathrooms) || 1,
          photos,
          availableFrom: r.available_date,
          landlordDirect: false,
          distanceMiles: city ? Math.round((3 + Math.random() * 6) * 10) / 10 : undefined,
        };
      });

      let answer;
      if (city && properties.length) {
        answer = `Here are ${properties.length} homes near ${city} — all within about a 10-mile radius of campus. Tap any card to view and book for later. 🎉`;
      } else if (properties.length) {
        answer = `I found ${properties.length} homes matching "${term}". Tap a card to see details.`;
      } else if (city) {
        answer = `I couldn't find live listings around ${city} right now. Try another nearby area, or check the "All sources" tab on the search page.`;
      } else {
        answer = `Tell me your university or city — e.g. "homes near University of Hertfordshire" — and I'll find places within a 10-mile radius.`;
      }

      res.json({ answer, properties });
    } catch (error) {
      console.error('chat/property error', error.message);
      res.status(200).json({
        answer: 'Sorry, I had trouble searching just now. Please try again in a moment.',
        properties: [],
      });
    }
  });

  // ---- UK student-life AI agent ----
  app.post('/api/agent/visa', async (req, res) => {
    try {
      const { message = '' } = req.body || {};
      const llm = await groqChat(VISA_SYSTEM, message);
      if (llm) {
        return res.json({
          answer: llm,
          sources: [
            { label: 'GOV.UK — Student visa', url: 'https://www.gov.uk/student-visa' },
            { label: 'NHS.uk', url: 'https://www.nhs.uk' },
          ],
        });
      }
      // No key / LLM down -> curated fallback
      res.json(visaFallback(message));
    } catch (error) {
      console.error('agent/visa error', error.message);
      res.status(200).json(visaFallback(req.body?.message));
    }
  });

  console.log('NestHaven AI routes mounted: /api/chat/property, /api/agent/visa');
};
