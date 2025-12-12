import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Document {
  id: string;
  title: string;
  type: "pdf" | "image" | "text" | "form";
  category: string;
  description?: string;
  filePath?: string;
  url?: string;
  size?: number;
  uploadedAt: number;
  tags: string[];
  language: "fa" | "de" | "en";
  isRequired: boolean;
  status: "pending" | "uploaded" | "verified" | "rejected";
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  requiredFields: string[];
  category: string;
  language: "fa" | "de" | "en";
}

export interface DocumentUploadProgress {
  documentId: string;
  progress: number;
  status: "uploading" | "processing" | "completed" | "error";
  error?: string;
}

const DOCUMENTS_KEY = "simorgh_documents";
const TEMPLATES_KEY = "simorgh_document_templates";

export class DocumentsService {
  private static instance: DocumentsService;

  static getInstance(): DocumentsService {
    if (!DocumentsService.instance) {
      DocumentsService.instance = new DocumentsService();
    }
    return DocumentsService.instance;
  }

  async getDocuments(category?: string, status?: string): Promise<Document[]> {
    try {
      const stored = await AsyncStorage.getItem(DOCUMENTS_KEY);
      const documents: Document[] = stored ? JSON.parse(stored) : [];
      
      let filtered = documents;
      
      if (category) {
        filtered = filtered.filter(doc => doc.category === category);
      }
      
      if (status) {
        filtered = filtered.filter(doc => doc.status === status);
      }
      
      return filtered.sort((a, b) => b.uploadedAt - a.uploadedAt);
    } catch (error) {
      console.error("Error loading documents:", error);
      return [];
    }
  }

  async getDocumentById(id: string): Promise<Document | null> {
    try {
      const documents = await this.getDocuments();
      return documents.find(doc => doc.id === id) || null;
    } catch (error) {
      console.error("Error loading document:", error);
      return null;
    }
  }

  async uploadDocument(
    title: string,
    type: "pdf" | "image" | "text" | "form",
    category: string,
    filePath: string,
    language: "fa" | "de" | "en",
    tags: string[] = [],
    description?: string
  ): Promise<string> {
    try {
      const documentId = Date.now().toString();
      const document: Document = {
        id: documentId,
        title,
        type,
        category,
        description,
        filePath,
        uploadedAt: Date.now(),
        tags,
        language,
        isRequired: false,
        status: "uploaded",
      };

      const documents = await this.getDocuments();
      documents.unshift(document);
      
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
      return documentId;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<void> {
    try {
      const documents = await this.getDocuments();
      const index = documents.findIndex(doc => doc.id === id);
      
      if (index === -1) return;
      
      documents[index] = { ...documents[index], ...updates };
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const documents = await this.getDocuments();
      const filtered = documents.filter(doc => doc.id !== id);
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  async getDocumentTemplates(language: "fa" | "de" | "en"): Promise<DocumentTemplate[]> {
    try {
      const stored = await AsyncStorage.getItem(TEMPLATES_KEY);
      const templates: DocumentTemplate[] = stored ? JSON.parse(stored) : [];
      return templates.filter(template => template.language === language);
    } catch (error) {
      console.error("Error loading document templates:", error);
      return [];
    }
  }

  async createDocumentTemplate(
    name: string,
    description: string,
    type: string,
    requiredFields: string[],
    category: string,
    language: "fa" | "de" | "en"
  ): Promise<string> {
    try {
      const templateId = Date.now().toString();
      const template: DocumentTemplate = {
        id: templateId,
        name,
        description,
        type,
        requiredFields,
        category,
        language,
      };

      const templates = await this.getDocumentTemplates(language);
      templates.push(template);
      
      // Save all templates (including other languages)
      const allTemplates = await this.getAllTemplates();
      allTemplates.push(template);
      
      await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(allTemplates));
      return templateId;
    } catch (error) {
      console.error("Error creating document template:", error);
      throw error;
    }
  }

  async getRequiredDocuments(): Promise<Document[]> {
    try {
      const documents = await this.getDocuments();
      return documents.filter(doc => doc.isRequired && doc.status !== "verified");
    } catch (error) {
      console.error("Error loading required documents:", error);
      return [];
    }
  }

  async verifyDocument(id: string): Promise<void> {
    try {
      await this.updateDocument(id, { status: "verified" });
    } catch (error) {
      console.error("Error verifying document:", error);
    }
  }

  async rejectDocument(id: string, reason?: string): Promise<void> {
    try {
      await this.updateDocument(id, { status: "rejected" });
    } catch (error) {
      console.error("Error rejecting document:", error);
    }
  }

  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return this.getDocuments(category);
  }

  async searchDocuments(query: string, language?: "fa" | "de" | "en"): Promise<Document[]> {
    try {
      const documents = await this.getDocuments();
      const lowercaseQuery = query.toLowerCase();
      
      return documents.filter(doc => {
        const matchesLanguage = !language || doc.language === language;
        const matchesQuery = 
          doc.title.toLowerCase().includes(lowercaseQuery) ||
          (doc.description && doc.description.toLowerCase().includes(lowercaseQuery)) ||
          doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
          doc.category.toLowerCase().includes(lowercaseQuery);
        
        return matchesLanguage && matchesQuery;
      });
    } catch (error) {
      console.error("Error searching documents:", error);
      return [];
    }
  }

  async getDocumentStats(): Promise<{
    total: number;
    pending: number;
    verified: number;
    rejected: number;
    required: number;
  }> {
    try {
      const documents = await this.getDocuments();
      
      return {
        total: documents.length,
        pending: documents.filter(doc => doc.status === "pending").length,
        verified: documents.filter(doc => doc.status === "verified").length,
        rejected: documents.filter(doc => doc.status === "rejected").length,
        required: documents.filter(doc => doc.isRequired).length,
      };
    } catch (error) {
      console.error("Error getting document stats:", error);
      return {
        total: 0,
        pending: 0,
        verified: 0,
        rejected: 0,
        required: 0,
      };
    }
  }

  async clearAllDocuments(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DOCUMENTS_KEY);
    } catch (error) {
      console.error("Error clearing documents:", error);
    }
  }

  private async getAllTemplates(): Promise<DocumentTemplate[]> {
    try {
      const stored = await AsyncStorage.getItem(TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading all templates:", error);
      return [];
    }
  }
}

export const documentsService = DocumentsService.getInstance();

// Export individual functions for convenience
export const getDocuments = (category?: string, status?: string) => 
  documentsService.getDocuments(category, status);
export const getDocumentById = (id: string) => documentsService.getDocumentById(id);
export const uploadDocument = (
  title: string,
  type: "pdf" | "image" | "text" | "form",
  category: string,
  filePath: string,
  language: "fa" | "de" | "en",
  tags?: string[],
  description?: string
) => documentsService.uploadDocument(title, type, category, filePath, language, tags, description);
export const updateDocument = (id: string, updates: Partial<Document>) => 
  documentsService.updateDocument(id, updates);
export const deleteDocument = (id: string) => documentsService.deleteDocument(id);
export const getRequiredDocuments = () => documentsService.getRequiredDocuments();
export const verifyDocument = (id: string) => documentsService.verifyDocument(id);
export const rejectDocument = (id: string) => documentsService.rejectDocument(id);
