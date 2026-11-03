import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '5mb' }));

// Local JSON DB file storage for backend persistence
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_PATH = path.resolve(DATA_DIR, 'db.json');

interface StoredDB {
  completions: Array<{
    date: string;
    workoutId: string;
    dayName: string;
    durationMinutes: number;
    completedAt: string;
  }>;
  checklists: Record<string, string[]>;
  dailyNotes: Record<string, string>;
  currentWeek: number;
  lastUpdated: string;
}

const DEFAULT_DB: StoredDB = {
  completions: [],
  checklists: {},
  dailyNotes: {},
  currentWeek: 1,
  lastUpdated: new Date().toISOString(),
};

function readDB(): StoredDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading backend database:', err);
    return DEFAULT_DB;
  }
}

function writeDB(data: StoredDB): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing backend database:', err);
  }
}

// ---------------- API ENDPOINTS ----------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Kadinamai iru — #STAY HARD',
    timestamp: new Date().toISOString(),
    environment: isProduction ? 'production' : 'development',
  });
});

// Get backend stored progress
app.get('/api/progress', (_req: Request, res: Response) => {
  const db = readDB();
  res.json(db);
});

// Bi-directional sync with mobile / offline client
app.post('/api/progress/sync', (req: Request, res: Response) => {
  try {
    const clientData = req.body;
    const db = readDB();

    // Merge completions (unique by date + workoutId)
    const existingMap = new Map<string, typeof db.completions[0]>();
    for (const c of db.completions) {
      existingMap.set(`${c.date}_${c.workoutId}`, c);
    }
    if (Array.isArray(clientData.completions)) {
      for (const c of clientData.completions) {
        const key = `${c.date}_${c.workoutId}`;
        if (!existingMap.has(key)) {
          existingMap.set(key, c);
        }
      }
    }

    const mergedCompletions = Array.from(existingMap.values()).sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    // Merge checklists
    const mergedChecklists = {
      ...db.checklists,
      ...(clientData.checklists || {}),
    };

    // Merge notes
    const mergedNotes = {
      ...db.dailyNotes,
      ...(clientData.dailyNotes || {}),
    };

    const updatedDB: StoredDB = {
      completions: mergedCompletions,
      checklists: mergedChecklists,
      dailyNotes: mergedNotes,
      currentWeek: clientData.currentWeek || db.currentWeek || 1,
      lastUpdated: new Date().toISOString(),
    };

    writeDB(updatedDB);
    res.json({ success: true, syncedData: updatedDB });
  } catch (err) {
    console.error('Error during progress sync:', err);
    res.status(500).json({ error: 'Failed to sync progress' });
  }
});

// Record a completion
app.post('/api/completions', (req: Request, res: Response) => {
  try {
    const { date, workoutId, dayName, durationMinutes } = req.body;
    if (!date || !workoutId) {
      return res.status(400).json({ error: 'date and workoutId are required' });
    }

    const db = readDB();
    const exists = db.completions.some(
      (c) => c.date === date && c.workoutId === workoutId
    );

    if (!exists) {
      db.completions.unshift({
        date,
        workoutId,
        dayName: dayName || 'Workout',
        durationMinutes: Number(durationMinutes) || 15,
        completedAt: new Date().toISOString(),
      });
      writeDB(db);
    }

    res.json({ success: true, completions: db.completions });
  } catch (err) {
    console.error('Error recording completion:', err);
    res.status(500).json({ error: 'Failed to record completion' });
  }
});

// Remove a completion (Undo completion)
app.delete('/api/completions', (req: Request, res: Response) => {
  try {
    const { date, workoutId } = req.body;
    if (!date || !workoutId) {
      return res.status(400).json({ error: 'date and workoutId are required' });
    }

    const db = readDB();
    db.completions = db.completions.filter(
      (c) => !(c.date === date && c.workoutId === workoutId)
    );
    writeDB(db);

    res.json({ success: true, completions: db.completions });
  } catch (err) {
    console.error('Error removing completion:', err);
    res.status(500).json({ error: 'Failed to remove completion' });
  }
});

// Update an exercise checklist for a date + workout
app.post('/api/checklists', (req: Request, res: Response) => {
  try {
    const { key, checkedIds } = req.body;
    if (!key || !Array.isArray(checkedIds)) {
      return res.status(400).json({ error: 'key and checkedIds array are required' });
    }

    const db = readDB();
    db.checklists[key] = checkedIds;
    writeDB(db);

    res.json({ success: true, checklists: db.checklists });
  } catch (err) {
    console.error('Error updating checklist:', err);
    res.status(500).json({ error: 'Failed to update checklist' });
  }
});

// Update programme week
app.post('/api/week', (req: Request, res: Response) => {
  try {
    const { week } = req.body;
    const num = Math.max(1, Math.min(4, Number(week) || 1));
    const db = readDB();
    db.currentWeek = num;
    writeDB(db);

    res.json({ success: true, currentWeek: db.currentWeek });
  } catch (err) {
    console.error('Error setting week:', err);
    res.status(500).json({ error: 'Failed to set week' });
  }
});

// Save daily reflection note
app.post('/api/notes', (req: Request, res: Response) => {
  try {
    const { date, note } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'date is required' });
    }

    const db = readDB();
    db.dailyNotes[date] = note || '';
    writeDB(db);

    res.json({ success: true, notes: db.dailyNotes });
  } catch (err) {
    console.error('Error saving note:', err);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Reset backend data
app.post('/api/reset', (_req: Request, res: Response) => {
  try {
    const emptyDB: StoredDB = {
      completions: [],
      checklists: {},
      dailyNotes: {},
      currentWeek: 1,
      lastUpdated: new Date().toISOString(),
    };
    writeDB(emptyDB);
    res.json({ success: true, message: 'All backend data reset successfully' });
  } catch (err) {
    console.error('Error resetting backend data:', err);
    res.status(500).json({ error: 'Failed to reset data' });
  }
});

// ---------------- STATIC & VITE MIDDLEWARE ----------------

async function startServer() {
  if (!isProduction) {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode serving built assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
