import jsPDF from "jspdf";
import { GeneratedReport, AcademyInfo, RATING_CATEGORIES } from "@/types/player";

function renderStarsText(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function computeAvg(ratings: Record<string, number>, group: string): number {
  const cats = RATING_CATEGORIES.filter((c) => c.group === group);
  const rated = cats.filter((c) => (ratings[c.key] || 0) > 0);
  if (rated.length === 0) return 0;
  return rated.reduce((sum, c) => sum + (ratings[c.key] || 0), 0) / rated.length;
}

function addLogoToDoc(doc: jsPDF, logoDataUrl: string, x: number, y: number, maxH: number): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      const h = maxH;
      const w = h * ratio;
      try {
        doc.addImage(logoDataUrl, "PNG", x, y, w, h);
      } catch {
        // If addImage fails, skip logo
      }
      resolve();
    };
    img.onerror = () => resolve();
    img.src = logoDataUrl;
  });
}

export async function generatePDF(report: GeneratedReport, academy: AcademyInfo) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { player, reportText } = report;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  const onPitchAvg = computeAvg(player.ratings, "on-pitch");
  const offPitchAvg = computeAvg(player.ratings, "off-pitch");
  const overallAvg = (onPitchAvg + offPitchAvg) / 2;

  // === HEADER BAR ===
  doc.setFillColor(37, 139, 88);
  doc.rect(0, 0, pageWidth, 32, "F");

  // Logo
  let logoOffset = 0;
  if (academy.logoDataUrl) {
    await addLogoToDoc(doc, academy.logoDataUrl, margin, 4, 24);
    logoOffset = 28;
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(academy.academyName || "Sports Academy", margin + logoOffset, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const typeLabel = academy.reportType === "annual" ? "Annual" : "Monthly";
  doc.text(`${typeLabel} Player Report Card — ${academy.periodLabel}`, margin + logoOffset, 25);

  // Overall score badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(pageWidth - margin - 22, 6, 20, 20, 3, 3, "F");
  doc.setTextColor(37, 139, 88);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(overallAvg.toFixed(1), pageWidth - margin - 12, 18, { align: "center" });
  doc.setFontSize(6);
  doc.setTextColor(80, 120, 80);
  doc.text("OVERALL", pageWidth - margin - 12, 23, { align: "center" });

  y = 40;

  // === PLAYER INFO ===
  doc.setTextColor(25, 50, 35);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(player.playerName, margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 100, 80);
  doc.text(`${player.sport}  ·  ${player.position}  ·  Age ${player.age}  ·  ${player.sessionsAttended}/${player.totalSessions} sessions`, margin, y);
  y += 5;
  doc.text(`On-Pitch: ${onPitchAvg.toFixed(1)}/5  |  Off-Pitch: ${offPitchAvg.toFixed(1)}/5`, margin, y);
  y += 8;

  // === RATINGS TABLE ===
  const groups = ["on-pitch", "off-pitch"] as const;
  const dimensions = ["physical", "mental", "social"] as const;
  const dimLabels: Record<string, string> = { physical: "Physical", mental: "Mental", social: "Social" };

  for (const group of groups) {
    doc.setFillColor(240, 248, 240);
    doc.rect(margin, y - 3.5, contentWidth, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(37, 139, 88);
    doc.text(group === "on-pitch" ? "ON THE PITCH" : "OFF THE PITCH", margin + 2, y);
    y += 6;

    for (const dim of dimensions) {
      const cats = RATING_CATEGORIES.filter((c) => c.group === group && c.dimension === dim);
      if (cats.length === 0) continue;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(60, 90, 60);
      doc.text(`${dimLabels[dim]}`, margin + 2, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(50, 70, 50);

      for (const cat of cats) {
        if (y > pageHeight - 20) { doc.addPage(); y = 20; }
        const rating = player.ratings[cat.key] || 0;
        doc.text(cat.label, margin + 4, y);
        doc.text(renderStarsText(rating), margin + contentWidth - 30, y);
        y += 4;
      }
      y += 1;
    }
    y += 2;
  }

  doc.setDrawColor(200, 220, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  if (y > pageHeight - 80) { doc.addPage(); y = 20; }

  // === REPORT TEXT ===
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(25, 50, 35);
  doc.text("Coach's Report", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(40, 55, 40);
  const lines = doc.splitTextToSize(reportText, contentWidth);

  for (const line of lines) {
    if (y > pageHeight - 30) { doc.addPage(); y = 20; }
    doc.text(line, margin, y);
    y += 4.5;
  }

  y += 8;
  if (y > pageHeight - 30) { doc.addPage(); y = 20; }

  // === FOOTER ===
  doc.setDrawColor(200, 220, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(25, 50, 35);
  doc.text(academy.coachName || "Coach", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 120, 100);
  doc.text("Coach's Signature", margin, y);
  y += 3;
  doc.line(margin, y, margin + 50, y);

  doc.save(`${player.playerName.replace(/\s+/g, "_")}_Report.pdf`);
}

export async function generateAllPDFs(reports: GeneratedReport[], academy: AcademyInfo) {
  for (const report of reports) {
    await generatePDF(report, academy);
  }
}
