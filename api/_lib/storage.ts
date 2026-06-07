import { put } from '@vercel/blob';
import crypto from 'crypto';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

/**
 * Upload a resume to Vercel Blob.
 *
 * @param base64       - Base64-encoded file content (strip data URI prefix first).
 * @param originalName - Original filename from the browser (e.g. "resume.pdf").
 * @param mimeType     - MIME type validated by Zod before this is called.
 * @returns Public URL of the uploaded blob.
 */
export async function uploadResume(
  base64: string,
  originalName: string,
  mimeType: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Invalid file extension: ${ext}`);
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Invalid MIME type: ${mimeType}`);
  }

  const buffer = Buffer.from(base64, 'base64');

  // Guard: max 5 MB after decoding
  if (buffer.byteLength > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5 MB limit');
  }

  const safeFilename = `${crypto.randomUUID()}${ext}`;
  const pathname = `resumes/${safeFilename}`;

  const blob = await put(pathname, buffer, {
    access: 'public',
    contentType: mimeType,
    // BLOB_READ_WRITE_TOKEN is picked up automatically from env
  });

  return blob.url;
}
