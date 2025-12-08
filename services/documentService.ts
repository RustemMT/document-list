import axios from "axios";
import { Document, AnalyzeResponse } from "@/types/document";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const documentService = {
  async getDocuments(): Promise<Document[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      const posts = response.data.slice(0, 10);

      const formattedDocuments = posts.map(({ id, title, body }: any) => ({
        id,
        file_name: title,
        version: `v1.0`,
        size: Math.floor(Math.random() * 10000000) + 100000,
        upload_date: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0],
        body,
      }));

      return formattedDocuments;
    } catch (error) {
      console.error("Ошибка при получении документов:", error);
      throw error;
    }
  },

  async analyzeDocument(documentId: number): Promise<AnalyzeResponse> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: `Анализ документа ${documentId} выполнен`,
      };
    } catch (error) {
      console.error("Ошибка при анализе документа:", error);
      throw error;
    }
  },
};
