import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_DEMO_USER,
  INITIAL_DEMO_RECORDS,
  INITIAL_DEMO_GOALS,
  generateRecommendations,
} from './src/data/demoData';
import { User, UsageRecord, Goal, HouseholdInputs } from './src/types';
import { calculateEmissions } from './src/utils/emissionFactors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-Memory Data Store with default pre-seeded demo data
  let currentUser: User = { ...INITIAL_DEMO_USER };
  let recordsStore: UsageRecord[] = [...INITIAL_DEMO_RECORDS];
  let goalsStore: Goal[] = [...INITIAL_DEMO_GOALS];

  // ==========================================
  // API ROUTES
  // ==========================================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'EcoTrack API', time: new Date().toISOString() });
  });

  // Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, householdSize, location } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      householdSize: Number(householdSize) || 1,
      location: location || 'Not specified',
      createdAt: new Date().toISOString(),
      ecoLevel: 'Eco Starter (Level 1)',
    };

    currentUser = newUser;
    return res.json({ user: currentUser, token: `token_${newUser.id}` });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // If logging in as demo or matching existing, return current user
    if (email.toLowerCase().includes('demo') || email === currentUser.email) {
      return res.json({ user: currentUser, token: `token_${currentUser.id}` });
    }

    currentUser = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      householdSize: 2,
      location: 'User Location',
      createdAt: new Date().toISOString(),
      ecoLevel: 'Eco Starter (Level 1)',
    };

    return res.json({ user: currentUser, token: `token_${currentUser.id}` });
  });

  // Auth: Current User
  app.get('/api/auth/me', (req: Request, res: Response) => {
    res.json({ user: currentUser });
  });

  // Profile: Get
  app.get('/api/profile', (req: Request, res: Response) => {
    res.json({ profile: currentUser });
  });

  // Profile: Update
  app.put('/api/profile', (req: Request, res: Response) => {
    const { name, email, householdSize, location, ecoLevel } = req.body;
    currentUser = {
      ...currentUser,
      name: name ?? currentUser.name,
      email: email ?? currentUser.email,
      householdSize: householdSize !== undefined ? Number(householdSize) : currentUser.householdSize,
      location: location ?? currentUser.location,
      ecoLevel: ecoLevel ?? currentUser.ecoLevel,
    };
    res.json({ profile: currentUser });
  });

  // Usage Records: GET all
  app.get('/api/records', (req: Request, res: Response) => {
    // Sort chronologically
    const sorted = [...recordsStore].sort((a, b) => a.month.localeCompare(b.month));
    res.json({ records: sorted });
  });

  // Usage Records: GET by ID
  app.get('/api/records/:id', (req: Request, res: Response) => {
    const record = recordsStore.find((r) => r.id === req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Usage record not found.' });
    }
    return res.json({ record });
  });

  // Usage Records: POST (Create)
  app.post('/api/records', (req: Request, res: Response) => {
    const input: HouseholdInputs = req.body;
    if (!input.month) {
      return res.status(400).json({ error: 'Month (YYYY-MM) is required.' });
    }

    const { emissions, percentages } = calculateEmissions(input);

    const newRecord: UsageRecord = {
      ...input,
      id: `rec_${Date.now()}`,
      userId: currentUser.id,
      emissions,
      percentages,
      createdAt: new Date().toISOString(),
    };

    // Replace if month already exists or push new
    const existingIdx = recordsStore.findIndex((r) => r.month === input.month);
    if (existingIdx >= 0) {
      recordsStore[existingIdx] = newRecord;
    } else {
      recordsStore.push(newRecord);
    }

    // Auto update goals progress matching the type
    goalsStore = goalsStore.map((goal) => {
      if (goal.type === 'electricity') {
        return { ...goal, currentValue: input.electricityKwh };
      }
      if (goal.type === 'carbon') {
        return { ...goal, currentValue: emissions.totalKg };
      }
      if (goal.type === 'water') {
        return { ...goal, currentValue: input.waterLiters };
      }
      if (goal.type === 'transportation') {
        return { ...goal, currentValue: emissions.transportationKg };
      }
      return goal;
    });

    res.status(201).json({ record: newRecord });
  });

  // Usage Records: PUT (Update)
  app.put('/api/records/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = recordsStore.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    const updatedInput: HouseholdInputs = {
      ...recordsStore[idx],
      ...req.body,
    };

    const { emissions, percentages } = calculateEmissions(updatedInput);

    const updatedRecord: UsageRecord = {
      ...updatedInput,
      id,
      userId: currentUser.id,
      emissions,
      percentages,
      createdAt: recordsStore[idx].createdAt,
    };

    recordsStore[idx] = updatedRecord;
    res.json({ record: updatedRecord });
  });

  // Usage Records: DELETE
  app.delete('/api/records/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = recordsStore.length;
    recordsStore = recordsStore.filter((r) => r.id !== id);

    if (recordsStore.length === initialLen) {
      return res.status(404).json({ error: 'Record not found.' });
    }

    res.json({ success: true, message: 'Record deleted successfully.' });
  });

  // Goals: GET all
  app.get('/api/goals', (req: Request, res: Response) => {
    res.json({ goals: goalsStore });
  });

  // Goals: POST
  app.post('/api/goals', (req: Request, res: Response) => {
    const { title, type, targetPercentage, startingValue, targetValue, currentValue, unit, deadline } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and Type are required.' });
    }

    const newGoal: Goal = {
      id: `goal_${Date.now()}`,
      userId: currentUser.id,
      title,
      type: type || 'carbon',
      targetPercentage: Number(targetPercentage) || 10,
      startingValue: Number(startingValue) || 100,
      targetValue: Number(targetValue) || 90,
      currentValue: currentValue !== undefined ? Number(currentValue) : Number(startingValue) || 100,
      unit: unit || 'kg CO₂e',
      deadline: deadline || new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    goalsStore.push(newGoal);
    res.status(201).json({ goal: newGoal });
  });

  // Goals: PUT (Update or mark complete)
  app.put('/api/goals/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const idx = goalsStore.findIndex((g) => g.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Goal not found.' });
    }

    goalsStore[idx] = {
      ...goalsStore[idx],
      ...req.body,
    };

    res.json({ goal: goalsStore[idx] });
  });

  // Goals: DELETE
  app.delete('/api/goals/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    goalsStore = goalsStore.filter((g) => g.id !== id);
    res.json({ success: true, message: 'Goal deleted.' });
  });

  // Recommendations: GET
  app.get('/api/recommendations', (req: Request, res: Response) => {
    const recs = generateRecommendations(recordsStore);
    res.json({ recommendations: recs });
  });

  // ==========================================
  // VITE & STATIC FILES SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EcoTrack] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[EcoTrack] Failed to start server:', err);
});
