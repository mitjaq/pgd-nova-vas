import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotification(reservation: {
  type: string;
  date: string;
  time_slot: string | null;
  name: string;
  email: string;
  phone: string;
  purpose: string;
  notes: string | null;
}) {
  if (!process.env.ADMIN_EMAIL) return;

  const typeLabels: Record<string, string> = {
    dvorana: "Dvorana",
    piknik: "Piknik",
    mivka: "Mivka",
  };

  const typeLabel = typeLabels[reservation.type] || reservation.type;

  const timeSlotInfo = reservation.time_slot
    ? `Termin: ${reservation.time_slot}\n`
    : "";

  const notesInfo = reservation.notes
    ? `Opombe: ${reservation.notes}\n`
    : "";

  const subject = `Novo rezervacija: ${typeLabel} - ${reservation.date}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #e53e3e; padding-bottom: 10px;">Novo rezervacijsko geslo</h2>
      <p style="color: #555; line-height: 1.6;">Prejeto je bilo novo geslo za rezervacijo:</p>
      
      <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 8px 0; color: #333;"><strong>Vrsta rezervacije:</strong> ${typeLabel}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Datum:</strong> ${reservation.date}</p>
        ${timeSlotInfo ? `<p style="margin: 8px 0; color: #333;"><strong>Termin:</strong> ${reservation.time_slot}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
        <p style="margin: 8px 0; color: #333;"><strong>Ime in priimek:</strong> ${reservation.name}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Email:</strong> ${reservation.email}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Telefon:</strong> ${reservation.phone}</p>
        <p style="margin: 8px 0; color: #333;"><strong>Namen:</strong> ${reservation.purpose}</p>
        ${notesInfo ? `<p style="margin: 8px 0; color: #333;"><strong>Opombe:</strong> ${reservation.notes}</p>` : ""}
      </div>
      
      <p style="color: #718096; font-size: 14px; margin-top: 30px;">
        Za obdelavo gesla se prijavite v admin nadzorno ploščo.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "PGD Nova Vas <noreply@pgd-novav.si>",
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      html: html,
    });
  } catch (error) {
    console.error("Napaka pri pošiljanju email obvestila:", error);
  }
}
