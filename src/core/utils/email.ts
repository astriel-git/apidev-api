// src/core/utils/email.ts
import nodemailer from 'nodemailer';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import juice from 'juice';

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a transporter using Mailtrap SMTP settings from environment variables.
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

/**
 * Reads an HTML template, compiles it with Handlebars,
 * and returns the inlined HTML.
 *
 * @param templateName - Name of the template file (e.g., 'recovery-email.hbs')
 * @param context - An object with the values to inject into the template.
 */
async function compileTemplate(templateName: string, context: any): Promise<string> {
  const templatePath = join(__dirname, '..', '..', 'core', 'utils', 'templates', templateName);
  const source = await fs.promises.readFile(templatePath, 'utf8');
  const template = handlebars.compile(source);
  const html = template(context);
  return juice(html);
}

/**
 * Sends a recovery email.
 * @param to The recipient's email address.
 * @param recoveryLink The password recovery link.
 */
export async function sendRecoveryEmail(to: string, recoveryLink: string): Promise<void> {
  const logoUrl = 'https://i.imgur.com/MrJ6KOa.png';
  
  const htmlContent = await compileTemplate('recovery-email.hbs', { 
    resetLink: recoveryLink,
    logoUrl 
  });
  
  const mailOptions = {
    from: '"Your App Name" <noreply@yourapp.com>',
    to,
    subject: 'Password Recovery',
    text: `Click the link to reset your password: ${recoveryLink}`,
    html: htmlContent,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Recovery email sent:', info.response);
  } catch (error) {
    console.error('Error sending recovery email:', error);
    throw error;
  }
}

