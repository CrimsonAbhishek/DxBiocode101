import { Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db/connection';
import { sendTrainingEmails } from '../services/emailService';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  location: z.string().optional(),
  organization: z.string().min(2),
  trainingCategory: z.string().optional(),
  message: z.string().optional(),
});

export async function createTraining(req: Request, res: Response): Promise<void> {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const d = parsed.data;

  try {
    const [result] = await pool.execute(
      `INSERT INTO training_requests (name, email, phone, location, organization, training_category, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [d.name, d.email, d.phone, d.location ?? null, d.organization, d.trainingCategory ?? null, d.message ?? null]
    );

    const insertId = (result as any).insertId;
    console.log(`[training] saved to DB — id=${insertId}`);

    await sendTrainingEmails({
      name: d.name, email: d.email, phone: d.phone,
      location: d.location, organization: d.organization,
      trainingCategory: d.trainingCategory, message: d.message,
    });

    res.status(201).json({ success: true, id: insertId, message: 'Training request submitted.' });
  } catch (err) {
    console.error('[training] error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

export async function getAllTraining(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.execute('SELECT * FROM training_requests ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch training requests.' });
  }
}
