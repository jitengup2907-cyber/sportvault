import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, ShadingType, BorderStyle, HeadingLevel,
  Header, Footer, PageNumber,
} from "docx";
import { saveAs } from "file-saver";
import { GeneratedReport, AcademyInfo, RATING_CATEGORIES } from "@/types/player";
import { GeneratedMatchReport } from "@/types/match";
import { ReportTemplate, REPORT_TEMPLATES } from "@/types/template";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

function renderStarsText(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function computeAvg(ratings: Record<string, number>, group: string): number {
  const cats = RATING_CATEGORIES.filter((c) => c.group === group);
  const rated = cats.filter((c) => (ratings[c.key] || 0) > 0);
  if (rated.length === 0) return 0;
  return rated.reduce((sum, c) => sum + (ratings[c.key] || 0), 0) / rated.length;
}

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

export async function generatePlayerDocx(report: GeneratedReport, academy: AcademyInfo, templateId: string = "classic-green") {
  const template = REPORT_TEMPLATES.find((t) => t.id === templateId) || REPORT_TEMPLATES[0];
  const { player, reportText } = report;
  const onPitchAvg = computeAvg(player.ratings, "on-pitch");
  const offPitchAvg = computeAvg(player.ratings, "off-pitch");
  const overallAvg = (onPitchAvg + offPitchAvg) / 2;
  const typeLabel = academy.reportType === "annual" ? "Annual" : "Monthly";
  const primaryHex = template.primaryColor.replace("#", "");

  const ratingRows: TableRow[] = [];
  const groups = ["on-pitch", "off-pitch"] as const;
  const dimensions = ["physical", "mental", "social"] as const;

  for (const group of groups) {
    ratingRows.push(new TableRow({
      children: [new TableCell({
        borders: cellBorders,
        width: { size: 9360, type: WidthType.DXA },
        columnSpan: 2,
        shading: { fill: primaryHex, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text: group === "on-pitch" ? "ON THE PITCH" : "OFF THE PITCH", bold: true, color: "FFFFFF", size: 20, font: "Arial" })],
        })],
      })],
    }));

    for (const dim of dimensions) {
      const cats = RATING_CATEGORIES.filter((c) => c.group === group && c.dimension === dim);
      for (const cat of cats) {
        const rating = player.ratings[cat.key] || 0;
        ratingRows.push(new TableRow({
          children: [
            new TableCell({
              borders: cellBorders,
              width: { size: 5000, type: WidthType.DXA },
              margins: { top: 40, bottom: 40, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: cat.label, size: 18, font: "Arial" })] })],
            }),
            new TableCell({
              borders: cellBorders,
              width: { size: 4360, type: WidthType.DXA },
              margins: { top: 40, bottom: 40, left: 120, right: 120 },
              children: [new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: renderStarsText(rating), size: 18, font: "Arial", color: primaryHex })],
              })],
            }),
          ],
        }));
      }
    }
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
    },
    sections: [{
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [
              new TextRun({ text: `${academy.academyName} — ${typeLabel} Player Report`, bold: true, size: 16, color: "999999", font: "Arial" }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", size: 16, color: "999999", font: "Arial" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "999999", font: "Arial" }),
            ],
          })],
        }),
      },
      children: [
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: academy.academyName, bold: true, size: 36, color: primaryHex, font: "Arial" })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: `${typeLabel} Player Report Card — ${academy.periodLabel}`, size: 22, color: "666666", font: "Arial" })],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: player.playerName, bold: true, size: 32, font: "Arial" })],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `${player.sport}  ·  ${player.position}  ·  Age ${player.age}  ·  ${player.sessionsAttended}/${player.totalSessions} sessions`, size: 20, color: "666666", font: "Arial" })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [
            new TextRun({ text: `Overall: ${overallAvg.toFixed(1)}/5`, bold: true, size: 24, color: primaryHex, font: "Arial" }),
            new TextRun({ text: `  |  On-Pitch: ${onPitchAvg.toFixed(1)}/5  |  Off-Pitch: ${offPitchAvg.toFixed(1)}/5`, size: 20, color: "666666", font: "Arial" }),
          ],
        }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [5000, 4360],
          rows: ratingRows,
        }),
        new Paragraph({ spacing: { before: 400, after: 100 }, children: [new TextRun({ text: "Coach's Report", bold: true, size: 26, color: primaryHex, font: "Arial" })] }),
        ...reportText.split("\n").filter(Boolean).map((para) =>
          new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: para, size: 21, font: "Arial" })] })
        ),
        new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: `— Coach ${academy.coachName}`, bold: true, size: 22, font: "Arial" })] }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${player.playerName.replace(/\s+/g, "_")}_Report.docx`);
}

export async function generateMatchDocx(report: GeneratedMatchReport, coachName: string, templateId: string = "classic-green") {
  const template = REPORT_TEMPLATES.find((t) => t.id === templateId) || REPORT_TEMPLATES[0];
  const { match, reportText } = report;
  const primaryHex = template.primaryColor.replace("#", "");
  const resultLabel = match.result === "win" ? "WIN" : match.result === "loss" ? "LOSS" : "DRAW";

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 22 } } } },
    sections: [{
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      children: [
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: "Match Summary Report", bold: true, size: 36, color: primaryHex, font: "Arial" })],
        }),
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: `${match.teamName} vs ${match.opponentName}  ·  ${match.matchDate}  ·  ${match.venue}`, size: 22, color: "666666", font: "Arial" })],
        }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({
              children: ["Result", "Score", "Formation"].map((label) =>
                new TableCell({
                  borders: cellBorders,
                  width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: primaryHex, type: ShadingType.CLEAR },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: label, bold: true, color: "FFFFFF", size: 20, font: "Arial" })] })],
                })
              ),
            }),
            new TableRow({
              children: [resultLabel, `${match.scoreOwn} - ${match.scoreOpponent}`, match.formation || "N/A"].map((val) =>
                new TableCell({
                  borders: cellBorders,
                  width: { size: 3120, type: WidthType.DXA },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 },
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: val, bold: true, size: 22, font: "Arial" })] })],
                })
              ),
            }),
          ],
        }),
        new Paragraph({ spacing: { before: 400, after: 100 }, children: [new TextRun({ text: "Tactical Analysis", bold: true, size: 26, color: primaryHex, font: "Arial" })] }),
        ...reportText.split("\n").filter(Boolean).map((para) =>
          new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: para, size: 21, font: "Arial" })] })
        ),
        new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: `— Coach ${coachName}`, bold: true, size: 22, font: "Arial" })] }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Match_${match.teamName}_vs_${match.opponentName}_${match.matchDate}.docx`);
}
