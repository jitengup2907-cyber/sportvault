import jsPDF from "jspdf";
import { GeneratedReport, AcademyInfo } from "@/types/player";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getCurrentMonthYear() {
  const d = new Date();
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function renderStarsText(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function generatePDF(report: GeneratedReport, academy: AcademyInfo) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { player, reportText } = report;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  // Green header bar
  doc.setFillColor(37, 139, 88); // primary green
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(academy.academyName || "Sports Academy", margin, 18);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Monthly Player Report Card — ${getCurrentMonthYear()}`, margin, 28);

  y = 48;

  // Player info
  doc.setTextColor(30, 60, 40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(player.playerName, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 100, 80);
  doc.text(`${player.sport}  ·  ${player.position}  ·  Age ${player.age}`, margin, y);
  y += 6;
  doc.text(`Attendance: ${player.sessionsAttended} / ${player.totalSessions} sessions`, margin, y);
  y += 10;

  // Ratings
  doc.setFontSize(10);
  doc.setTextColor(30, 60, 40);
  doc.text(`Ball Control / Skill:   ${renderStarsText(player.skillRating)}`, margin, y);
  y += 6;
  doc.text(`Fitness & Stamina:    ${renderStarsText(player.fitnessRating)}`, margin, y);
  y += 6;
  doc.text(`Teamwork & Attitude: ${renderStarsText(player.teamworkRating)}`, margin, y);
  y += 10;

  // Divider
  doc.setDrawColor(200, 220, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Report text
  doc.setTextColor(30, 40, 30);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(reportText, contentWidth);
  doc.text(lines, margin, y);
  y += lines.length * 5.5 + 15;

  // Ensure footer doesn't overflow
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y > pageHeight - 40) {
    doc.addPage();
    y = 30;
  }

  // Footer
  doc.setDrawColor(200, 220, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 60, 40);
  doc.text(academy.coachName || "Coach", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 120, 100);
  doc.text("Coach's Signature", margin, y);
  y += 2;
  doc.line(margin, y + 2, margin + 50, y + 2);

  doc.save(`${player.playerName.replace(/\s+/g, "_")}_Report.pdf`);
}

export function generateAllPDFs(reports: GeneratedReport[], academy: AcademyInfo) {
  reports.forEach((report) => generatePDF(report, academy));
}
