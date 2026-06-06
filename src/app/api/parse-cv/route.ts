import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let text = "";

    if (fileName.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (fileName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: "Unsupported file type. Please upload a PDF or DOCX file." }, { status: 400 });
    }

    return NextResponse.json({ text: text.trim() });
  } catch (err) {
    console.error("CV parse error:", err);
    return NextResponse.json({ error: "Failed to parse file. Please try again." }, { status: 500 });
  }
}
