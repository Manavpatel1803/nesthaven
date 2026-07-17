const express = require('express');
const mysql = require('mysql2/promise');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// ======================
// DATABASE CONFIG
// ======================

const SSL_CA = fs.readFileSync(process.env.DB_SSL_CA);

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        ca: SSL_CA,
    },
};

const pool = mysql.createPool(dbConfig);

// ======================
// MIDDLEWARE
// ======================

app.use(express.json({ limit: '10mb' }));
app.use(cors());

// ======================
// ROOT ROUTES
// ======================

app.get('/', (req, res) => {
    res.json({
        service: 'NestHaven API',
        status: 'ok',
        endpoints: [
            'GET  /api/rentals?title=',
            'GET  /api/rentals/offerid?offerid=',
            'GET  /api/rentals/cities',
            'POST /api/calculate-pricing',
            'POST /api/chat/property',
            'POST /api/agent/visa',
            'GET  /api/direct/listings',
            'POST /api/direct/listings',
        ],
    });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// ======================
// FETCH AND STORE JOBS
// ======================

async function fetchAndStoreJobs() {
    try {
        const allJobs = [];

        // REDUCED FROM 500 TO 20
        const TOTAL_PAGES = 20;

        const APP_ID = process.env.VUE_APP_ADZUNA_APP_ID;
        const API_KEY = process.env.VUE_APP_ADZUNA_API_KEY;

        const RESULTS_PER_PAGE = 50;

        for (let currentPage = 1; currentPage <= TOTAL_PAGES; currentPage++) {

            const adzunaApiUrl =
                `https://api.adzuna.com/v1/api/jobs/gb/search/${currentPage}` +
                `?app_id=${APP_ID}` +
                `&app_key=${API_KEY}` +
                `&results_per_page=${RESULTS_PER_PAGE}`;

            console.log(`Fetching jobs page ${currentPage}`);

            const response = await axios.get(adzunaApiUrl);

            if (!response.data.results.length) {
                break;
            }

            allJobs.push(...response.data.results);
        }

        console.log(`Total jobs fetched: ${allJobs.length}`);

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            for (const job of allJobs) {

                const title = job.title || 'Unknown';
                const description = job.description || '';
                const url = job.redirect_url || '';

                const company =
                    job.company?.display_name || 'Unknown';

                const location =
                    job.location?.display_name || 'Unknown';

                await connection.execute(
                    `
                    INSERT INTO job_listings
                    (
                        title,
                        company,
                        location,
                        description,
                        url,
                        date_added
                    )
                    VALUES (?, ?, ?, ?, ?, NOW())
                    ON DUPLICATE KEY UPDATE
                        description = VALUES(description),
                        url = VALUES(url),
                        date_added = NOW()
                    `,
                    [
                        title,
                        company,
                        location,
                        description,
                        url
                    ]
                );
            }

            // Remove jobs older than 1 day
            await connection.execute(`
                DELETE FROM job_listings
                WHERE date_added < NOW() - INTERVAL 1 DAY
            `);

            await connection.commit();

            console.log('Jobs stored successfully');

        } catch (error) {

            await connection.rollback();
            console.error('Transaction Error:', error);

        } finally {

            connection.release();
        }

    } catch (error) {

        console.error('Error fetching jobs:', error.message);
    }
}

// ======================
// JOB CRON
// ======================

// Every 8 hours
cron.schedule('0 */8 * * *', () => {
    console.log('Running job fetch cron...');
    fetchAndStoreJobs();
});

// ======================
// JOBS API
// ======================

app.get('/api/jobs', async (req, res) => {

    try {

        const {
            search = '',
            page = 1,
            perPage = 10
        } = req.query;

        // FIXED radix 10
        const pageNumber = parseInt(page, 10) || 1;
        const itemsPerPage = parseInt(perPage, 10) || 10;

        const offset = (pageNumber - 1) * itemsPerPage;

        let query = `
            SELECT *
            FROM job_listings
        `;

        let params = [];

        if (search.trim() !== '') {

            query += `
                WHERE
                    title LIKE ?
                    OR company LIKE ?
                    OR location LIKE ?
            `;

            const searchQuery = `%${search}%`;

            params.push(
                searchQuery,
                searchQuery,
                searchQuery
            );
        }

        query += `
            ORDER BY date_added DESC
            LIMIT ?
            OFFSET ?
        `;

        params.push(itemsPerPage, offset);

        const [jobs] = await pool.query(query, params);

        res.status(200).json(jobs);

    } catch (error) {

        console.error('Error fetching jobs:', error);

        res.status(500).json({
            message: 'Error fetching jobs',
            error: error.message
        });
    }
});

// ======================
// FETCH AND STORE RENTALS
// ======================

async function fetchAndStoreRentals() {

    try {

        const apiKey = process.env.UNIPLACES_API_KEY;

        const cityUrl =
            'https://api-export.staging-uniplaces.com/v1/cities';

        const cityResponse = await axios.get(cityUrl, {
            headers: {
                accept: 'application/json',
                'x-api-key': apiKey
            }
        });

        const cities = cityResponse.data;

        if (!cities.length) {
            console.log('No cities found');
            return;
        }

        const cityMap = {};

        // ======================
        // STORE CITIES
        // ======================

        for (const city of cities) {

            const { code, name_translations } = city;

            const [countryCode, cityCodePart] =
                code.split('-');

            const cityName =
                name_translations.find(
                    t => t.locale_code === 'en_GB'
                )?.text || 'Unknown';

            await pool.query(
                `
                INSERT INTO cities
                (
                    code,
                    country_code,
                    city_code,
                    city_name
                )
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    city_name = VALUES(city_name)
                `,
                [
                    code,
                    countryCode,
                    cityCodePart,
                    cityName
                ]
            );

            cityMap[code] = {
                cityCode: cityCodePart,
                cityName
            };
        }

        // ======================
        // STORE RENTALS
        // ======================

        for (const code of Object.keys(cityMap)) {

            try {

                console.log(`Fetching rentals for ${code}`);

                const url =
                    `https://api-export.staging-uniplaces.com/v1/cities/${code}/offers`;

                const response = await axios.get(url, {
                    headers: {
                        'x-api-key': apiKey
                    },
                    params: {
                        limit: 200,
                        page: 1
                    }
                });

                const rentals = response.data.data;

                if (!rentals || rentals.length === 0) {
                    continue;
                }

                for (const rental of rentals) {

                    const attributes =
                        rental.attributes?.accommodation_offer || {};

                    const property =
                        rental.attributes?.property || {};

                    const offerid = rental.id;

                    const photos =
                        rental.attributes?.photos?.length
                            ? JSON.stringify(
                                rental.attributes.photos.map(
                                    photo => photo.hash
                                )
                            )
                            : null;

                    await pool.query(
                        `
                        INSERT INTO rental_properties
                        (
                            title,
                            description,
                            price,
                            currency,
                            neighbourhood,
                            number_of_rooms,
                            number_of_bathrooms,
                            photos,
                            available_date,
                            max_guests,
                            is_instant_booking,
                            gap_on_booking,
                            contract_type,
                            accommodation_type,
                            type,
                            has_resident_landlord,
                            city_code,
                            offerid
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            price = VALUES(price),
                            available_date = VALUES(available_date)
                        `,
                        [
                            attributes.title || null,
                            attributes.description || null,
                            ((attributes.price?.amount || 0) / 100),
                            attributes.price?.currency_code || null,
                            property.neighbourhood || null,
                            property.number_of_rooms || null,
                            property.number_of_bathrooms || null,
                            photos,
                            attributes.available_from || null,
                            attributes.max_guests || null,
                            attributes.is_instant_booking || false,
                            attributes.gap_on_booking || false,
                            attributes.contract_type || null,
                            property.accommodation_type || null,
                            property.accommodation_type || null,
                            property.has_resident_landlord || false,
                            code,
                            offerid
                        ]
                    );

                    // ======================
                    // STORE FULL ACCOMMODATION
                    // ======================

                    try {

                        const offerDetailsUrl =
                            `https://api-export.staging-uniplaces.com/v1/offers/${offerid}`;

                        const offerResponse = await axios.get(
                            offerDetailsUrl,
                            {
                                headers: {
                                    'x-api-key': apiKey
                                }
                            }
                        );

                        const fullResponse =
                            JSON.stringify(offerResponse.data);

                        await pool.query(
                            `
                            INSERT INTO accommodation
                            (
                                accommodation_id,
                                full_response
                            )
                            VALUES (?, ?)
                            ON DUPLICATE KEY UPDATE
                                full_response = VALUES(full_response)
                            `,
                            [
                                offerid,
                                fullResponse
                            ]
                        );

                    } catch (offerError) {

                        console.error(
                            `Offer fetch failed for ${offerid}`,
                            offerError.message
                        );
                    }
                }

            } catch (cityError) {

                console.error(
                    `City rental fetch failed for ${code}`,
                    cityError.message
                );
            }
        }

        console.log('Rental sync complete');

    } catch (error) {

        console.error(
            'Rental sync failed:',
            error.message
        );
    }
}

// ======================
// RENTAL CRON
// ======================

// Every hour
cron.schedule('0 * * * *', () => {
    console.log('Running rental fetch cron...');
    fetchAndStoreRentals();
});

// ======================
// RENTAL CITIES API
// ======================

app.get('/api/rentals/cities', async (req, res) => {

    try {

        const { title = '' } = req.query;

        let query = `
            SELECT *
            FROM cities
            WHERE 1
        `;

        const params = [];

        // FIXED city_name
        if (title.trim() !== '') {

            query += `
                AND city_name LIKE ?
            `;

            params.push(`%${title}%`);
        }

        query += `
            ORDER BY city_name ASC
        `;

        const [cityrental] =
            await pool.query(query, params);

        res.status(200).json(cityrental);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching cities',
            error: error.message
        });
    }
});

// ======================
// RENTALS API
// ======================

app.get('/api/rentals', async (req, res) => {

    try {

        const { title = '' } = req.query;

        let query = `
            SELECT
                rp.*,
                c.country_code,
                c.code,
                c.city_name
            FROM rental_properties rp
            JOIN cities c
                ON rp.city_code = c.code
            WHERE 1
        `;

        const params = [];

        // FIXED SQL PRECEDENCE
        if (title.trim() !== '') {

            query += `
                AND (
                    c.city_name = ?
                    OR rp.title LIKE ?
                    OR rp.neighbourhood LIKE ?
                    OR c.country_code = ?
                )
            `;

            params.push(
                title,
                `%${title}%`,
                `%${title}%`,
                title
            );
        }

        query += `
            ORDER BY rp.id DESC
        `;

        const [rentals] =
            await pool.query(query, params);

        if (!rentals.length) {

            return res.status(404).json({
                message: 'No rental properties found.'
            });
        }

        res.status(200).json(rentals);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching rentals',
            error: error.message
        });
    }
});

// ======================
// RENTAL BY OFFER ID
// ======================

app.get('/api/rentals/offerid', async (req, res) => {

    try {

        const { offerid = '' } = req.query;

        if (!offerid.trim()) {

            return res.status(400).json({
                message: 'Offer ID is required.'
            });
        }

        const [result] = await pool.query(
            `
            SELECT *
            FROM rental_properties
            WHERE offerid = ?
            `,
            [offerid]
        );

        if (!result.length) {

            return res.status(404).json({
                message: 'Rental not found.'
            });
        }

        res.status(200).json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching rental',
            error: error.message
        });
    }
});

// ======================
// ACCOMMODATION API
// ======================

app.get('/api/rentals/getAccommodation/offerid', async (req, res) => {

    try {

        const { offerid = '' } = req.query;

        if (!offerid.trim()) {

            return res.status(400).json({
                message: 'Offer ID is required.'
            });
        }

        const [result] = await pool.query(
            `
            SELECT full_response
            FROM accommodation
            WHERE accommodation_id = ?
            `,
            [offerid]
        );

        if (!result.length) {

            return res.status(404).json({
                message: 'Accommodation not found.'
            });
        }

        res.status(200).json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching accommodation',
            error: error.message
        });
    }
});

// ======================
// CALCULATE PRICING API
// ======================

app.post('/api/calculate-pricing', async (req, res) => {

    try {

        const {
            offer_id,
            move_in_out,
            guests
        } = req.body;

        if (
            !offer_id ||
            !move_in_out?.start ||
            !move_in_out?.end ||
            !guests
        ) {
            return res.status(400).json({
                message: 'Missing required fields.'
            });
        }

        const apiUrl =
            'https://api-export.staging-uniplaces.com/v1/calculate-pricing';

        const apiKey =
            process.env.UNIPLACES_API_KEY;

        const payload = {
            offer_id: Number(offer_id),
            move_in_out: {
                start: String(move_in_out.start),
                end: String(move_in_out.end)
            },
            guests: Number(guests)
        };

        const response = await axios.post(
            apiUrl,
            payload,
            {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            error.response?.data || error.message
        );

        if (error.response) {

            return res.status(error.response.status).json({
                message:
                    error.response.data.message ||
                    'External API error',
                details: error.response.data
            });
        }

        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

// ======================
// NESTHAVEN AI ROUTES
// (property chatbot + UK student-life agent)
// ======================

require('./nesthaven-ai')(app, pool, axios);
require('./nesthaven-direct')(app, pool);

// ======================
// 404 (API only — frontend is the separate Angular app)
// ======================

app.use((req, res) => {
    res.status(404).json({ message: 'Not found', path: req.originalUrl });
});

// ======================
// START SERVER
// ======================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});