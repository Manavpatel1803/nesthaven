/**
 * NestHaven Direct Listings
 * -------------------------
 * Lets landlords submit their own UK homes, stored in our DB (not an agency
 * feed). These power the "Direct landlords" tab in the app.
 *
 *   POST /api/direct/listings        -> create a listing
 *   GET  /api/direct/listings        -> list (optional ?title= filter)
 *   GET  /api/direct/listings/:id    -> single listing
 *
 * Mounted from server.js:  require('./nesthaven-direct')(app, pool);
 */

module.exports = function registerDirectListings(app, pool) {
  // Ensure the table exists (id prefix "direct-" is added in responses).
  async function ensureTable() {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS direct_listings (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          currency VARCHAR(8) DEFAULT 'GBP',
          price_per VARCHAR(16) DEFAULT 'month',
          bedrooms INT DEFAULT 1,
          bathrooms INT DEFAULT 1,
          max_guests INT DEFAULT 1,
          neighbourhood VARCHAR(255),
          city VARCHAR(120),
          postcode VARCHAR(16),
          photos TEXT,
          available_date DATE NULL,
          landlord_name VARCHAR(160),
          landlord_email VARCHAR(200),
          status VARCHAR(20) DEFAULT 'live',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('NestHaven Direct: direct_listings table ready');
    } catch (e) {
      console.error('NestHaven Direct: table setup failed', e.message);
    }
  }
  ensureTable();

  const STOCK = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=70';

  function normalise(r) {
    let photos = [];
    try {
      const parsed = r.photos ? JSON.parse(r.photos) : [];
      photos = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      photos = [];
    }
    if (!photos.length) photos = [STOCK];
    return {
      id: `direct-${r.id}`,
      source: 'nesthaven',
      title: r.title,
      description: r.description || undefined,
      neighbourhood: r.neighbourhood || undefined,
      city: r.city || undefined,
      postcode: r.postcode || undefined,
      price: Number(r.price) || 0,
      pricePer: r.price_per === 'week' ? 'week' : 'month',
      currency: r.currency || 'GBP',
      bedrooms: Number(r.bedrooms) || 1,
      bathrooms: Number(r.bathrooms) || 1,
      guests: r.max_guests != null ? Number(r.max_guests) : undefined,
      photos,
      availableFrom: r.available_date || undefined,
      landlordDirect: true,
      verified: false,
    };
  }

  // ---- Create a listing ----
  app.post('/api/direct/listings', async (req, res) => {
    try {
      const b = req.body || {};
      const required = ['title', 'price', 'city'];
      const missing = required.filter((k) => !String(b[k] ?? '').trim());
      if (missing.length) {
        return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
      }

      // photos: accept array or comma/newline separated string of URLs
      let photos = [];
      if (Array.isArray(b.photos)) photos = b.photos.filter(Boolean);
      else if (typeof b.photos === 'string')
        photos = b.photos.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);

      const [result] = await pool.query(
        `INSERT INTO direct_listings
         (title, description, price, currency, price_per, bedrooms, bathrooms,
          max_guests, neighbourhood, city, postcode, photos, available_date,
          landlord_name, landlord_email)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          String(b.title).slice(0, 255),
          b.description ? String(b.description).slice(0, 4000) : null,
          Number(b.price) || 0,
          b.currency || 'GBP',
          b.pricePer === 'week' ? 'week' : 'month',
          Number(b.bedrooms) || 1,
          Number(b.bathrooms) || 1,
          Number(b.guests) || 1,
          b.neighbourhood || null,
          String(b.city).slice(0, 120),
          b.postcode || null,
          photos.length ? JSON.stringify(photos) : null,
          b.availableFrom || null,
          b.landlordName || null,
          b.landlordEmail || null,
        ]
      );

      const [rows] = await pool.query(`SELECT * FROM direct_listings WHERE id = ?`, [
        result.insertId,
      ]);
      res.status(201).json(normalise(rows[0]));
    } catch (error) {
      console.error('direct create error', error.message);
      res.status(500).json({ message: 'Could not save listing', error: error.message });
    }
  });

  // ---- List / search ----
  app.get('/api/direct/listings', async (req, res) => {
    try {
      const { title = '' } = req.query;
      let sql = `SELECT * FROM direct_listings WHERE status = 'live'`;
      const params = [];
      if (title.trim()) {
        sql += ` AND (city LIKE ? OR neighbourhood LIKE ? OR postcode LIKE ? OR title LIKE ?)`;
        const t = `%${title.trim()}%`;
        params.push(t, t, t, t);
      }
      sql += ` ORDER BY id DESC LIMIT 60`;
      const [rows] = await pool.query(sql, params);
      res.json(rows.map(normalise));
    } catch (error) {
      console.error('direct list error', error.message);
      res.json([]); // never break the search page
    }
  });

  // ---- Single listing ----
  app.get('/api/direct/listings/:id', async (req, res) => {
    try {
      const raw = String(req.params.id).replace(/^direct-/, '');
      const [rows] = await pool.query(`SELECT * FROM direct_listings WHERE id = ?`, [raw]);
      if (!rows.length) return res.status(404).json({ message: 'Listing not found' });
      res.json(normalise(rows[0]));
    } catch (error) {
      console.error('direct get error', error.message);
      res.status(500).json({ message: 'Error', error: error.message });
    }
  });

  console.log('NestHaven Direct routes mounted: /api/direct/listings');
};
