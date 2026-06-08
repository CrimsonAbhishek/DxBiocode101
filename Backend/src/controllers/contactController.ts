import { Request, Response } from 'express';
import { z } from 'zod';
import pool from '../db/connection';
import { sendContactEmails } from '../services/emailService';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  organization: z.string().optional(),
  enquiryType: z.string().optional(),
  message: z.string().min(5),
});

export async function createContact(req: Request, res: Response): Promise<void> {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const d = parsed.data;

  try {
    const [result] = await pool.execute(
      `INSERT INTO contacts (name, email, phone, organization, enquiry_type, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [d.name, d.email, d.phone, d.organization ?? null, d.enquiryType ?? null, d.message]
    );

    const insertId = (result as any).insertId;
    console.log(`[contact] saved to DB — id=${insertId}`);

    await sendContactEmails({
      name: d.name, email: d.email, phone: d.phone,
      organization: d.organization, enquiryType: d.enquiryType, message: d.message,
    });

    res.status(201).json({ success: true, id: insertId, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('[contact] error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

export async function getAllContacts(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch contacts.' });
  }
}
