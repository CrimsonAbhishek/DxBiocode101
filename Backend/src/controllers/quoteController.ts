import { Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db/connection';
import { sendQuoteEmails } from '../services/emailService';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone must be at least 7 digits'),
  organization: z.string().optional(),
  designation: z.string().optional(),
  facilityType: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  items: z.array(z.object({
    product_name: z.string(),
    quantity: z.number().default(1),
  })).optional(),
});

export async function createQuote(req: Request, res: Response): Promise<void> {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const d = parsed.data;

  try {
    // 1. Save to MySQL
    const [result] = await pool.execute(
      `INSERT INTO quotes (name, email, phone, organization, designation, facility_type, timeline, message, items_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.name, d.email, d.phone,
        d.organization ?? null, d.designation ?? null,
        d.facilityType ?? null, d.timeline ?? null,
        d.message, d.items ? JSON.stringify(d.items) : null,
      ]
    );

    const insertId = (result as any).insertId;
    console.log(`[quote] saved to DB — id=${insertId}`);

    // 2. Send emails
    await sendQuoteEmails({
      name: d.name, email: d.email, phone: d.phone,
      organization: d.organization, designation: d.designation,
      facilityType: d.facilityType, timeline: d.timeline,
      message: d.message, items: d.items,
    });

    res.status(201).json({ success: true, id: insertId, message: 'Quote request submitted successfully.' });
  } catch (err) {
    console.error('[quote] error:', err);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
}

export async function getAllQuotes(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.execute('SELECT * FROM quotes ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[quote] fetch error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch quotes.' });
  }
}
