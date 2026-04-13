const express = require('express');
const cors = require('cors');
const app = express();

// VIKTIGT: Met.no kräver identifikation
const USER_AGENT = "AuroraFieldApp/2.0 github.com/aurora-app (aurora-contact@example.com)";

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Met.no Weather Proxy
app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing lat/lon parameters" });
    }

    const latFixed = parseFloat(lat).toFixed(4);
    const lonFixed = parseFloat(lon).toFixed(4);
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latFixed}&lon=${lonFixed}`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`Met.no Error: ${response.status}`);
            return res.status(response.status).json({ error: "Met.no API error" });
        }

        const data = await response.json();

        const timeseries = data.properties?.timeseries || [];
        if (timeseries.length === 0) {
            return res.status(500).json({ error: "No timeseries data" });
        }

        // Return the next 12 hours of forecast
        const hourlyForecast = timeseries.slice(0, 12).map(item => {
            const details = item.data?.instant?.details || {};
            return {
                cloudCover: details.cloud_area_fraction ?? null,
                windSpeed: details.wind_speed ?? null,
                fog: details.fog_area_fraction ?? 0,
                temperature: details.air_temperature ?? null,
                timestamp: item.time
            };
        });

        // Cache for 30 minutes
        res.set('Cache-Control', 'public, max-age=1800');
        res.json(hourlyForecast);

    } catch (error) {
        console.error("Proxy error:", error.message);
        res.status(500).json({ error: "Failed to fetch weather" });
    }
});

// NOAA Kp Index Proxy
app.get('/api/noaa/kp', async (req, res) => {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json');
        const data = await response.json();
        res.set('Cache-Control', 'public, max-age=300');
        res.json(data);
    } catch (error) {
        console.error("NOAA Kp error:", error.message);
        res.status(500).json({ error: "Failed to fetch Kp" });
    }
});

// NOAA Bz Proxy
app.get('/api/noaa/bz', async (req, res) => {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/products/summary/solar-wind-mag-field.json');
        const data = await response.json();
        res.set('Cache-Control', 'public, max-age=60');
        res.json(data);
    } catch (error) {
        console.error("NOAA Bz error:", error.message);
        res.status(500).json({ error: "Failed to fetch Bz" });
    }
});

// OVATION Aurora Oval
app.get('/api/ovation', async (req, res) => {
    try {
        const response = await fetch('https://services.swpc.noaa.gov/json/ovation_aurora_latest.json');
        const data = await response.json();
        res.set('Cache-Control', 'public, max-age=300');
        res.json(data);
    } catch (error) {
        console.error("OVATION error:", error.message);
        res.status(500).json({ error: "Failed to fetch OVATION" });
    }
});

// TGO Magnetometer (Mock - would need scraping for real data)
app.get('/api/tgo', (req, res) => {
    // Mock data - replace with real scraping later
    const mockDbDt = 5 + Math.random() * 20;
    res.json({
        station: "TRO",
        timestamp: new Date().toISOString(),
        db_dt: parseFloat(mockDbDt.toFixed(1)),
        source: "mock"
    });
});

// RainViewer API Proxy (for cloud satellite data)
let rainViewerCache = { timestamp: null, path: null, expires: 0 };

app.get('/api/rainviewer', async (req, res) => {
    try {
        // Cache for 10 minutes
        if (rainViewerCache.path && Date.now() < rainViewerCache.expires) {
            return res.json({ path: rainViewerCache.path });
        }

        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await response.json();

        if (data.satellite && data.satellite.infrared && data.satellite.infrared.length > 0) {
            const path = data.satellite.infrared[data.satellite.infrared.length - 1].path;
            rainViewerCache = { path, expires: Date.now() + 600000 }; // 10 min cache
            res.json({ path });
        } else {
            res.status(404).json({ error: "No satellite data available" });
        }
    } catch (error) {
        console.error("RainViewer error:", error.message);
        res.status(500).json({ error: "Failed to fetch RainViewer" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aurora API Proxy running on port ${PORT}`);
});
