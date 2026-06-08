import { Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import pool from '../db/connection';
import { sendCareerEmails } from '../services/emailService';
import { uploadToR2, isR2Configured } from '../services/r2Service';

// Multer — in-memory storage (we forward to R2)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, or DOCX files are allowed.'));
    }
  },
});

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  position: z.string().min(1),
  experience: z.string().optional(),
  coverLetter: z.string().optional(),
});

export async function createCareerApplication(req: Request, res: Response): Promise<void> {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: parsed.error.errors[0].message });
    return;
  }

  const d = parsed.data;
  const file = req.file;

  if (!file) {
    res.status(400).json({ success: false, error: 'Resume file is required.' });
    return;
  }

  try {
    let resumeUrl: string | null = null;
    const resumeFilename = file.originalname;

    // Upload resume to R2 if configured
    if (isR2Configured()) {
      const key = `resumes/${Date.now()}-${d.firstName}-${d.lastName}-${resumeFilename}`;
      try {
        resumeUrl = await uploadToR2(key, file.buffer, file.mimetype);
        console.log(`[career] resume uploaded to R2: ${resumeUrl}`);
      } catch (uploadErr) {
        console.warn('[career] R2 upload failed, proceeding without URL:', uploadErr);
      }
    }

    // Save to MySQL
    const [result] = await pool.execute(
      `INSERT INTO career_applications (first_name, last_name, email, phone, position, experience, cover_letter, resume_url, resume_filename)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.firstName, d.lastName, d.email, d.phone, d.position,
        d.experience ?? null, d.coverLetter ?? null,
        resumeUrl, resumeFilename,
      ]
    );

    const insertId = (result as any).insertId;
    console.log(`[career] saved to DB — id=${insertId}`);

    // Send emails
    await sendCareerEmails({
      firstName: d.firstName, lastName: d.lastName,
      email: d.email, phone: d.phone, position: d.position,
      experience: d.experience, coverLetter: d.coverLetter,
      resumeUrl: resumeUrl ?? undefined, resumeFilename,
    });

    res.status(201).json({ success: true, id: insertId, message: 'Application submitted successfully.' });
  } catch (err) {
    console.error('[career] error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
}

export async function getAllApplications(req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.execute('SELECT * FROM career_applications ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch applications.' });
  }
}
