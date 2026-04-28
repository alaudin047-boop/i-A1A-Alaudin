import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateRDPQuestions(finding: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Anda adalah asisten ahli untuk Anggota DPRD Komisi I. 
      Berdasarkan temuan BPK berikut: "${finding}"
      Dan konteks tambahan: "${context}"
      
      Buatlah 5 pertanyaan kritis, tajam, dan solutif yang harus diajukan kepada mitra kerja (Pemerintah Daerah/Dinas terkait) dalam Rapat Dengar Pendapat (RDP).
      Gunakan bahasa Indonesia yang formal namun tegas.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating questions:", error);
    return "Maaf, gagal membuat pertanyaan. SIlakan coba lagi.";
  }
}
