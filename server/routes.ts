import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processMedicalReport } from "@shared/medical-dictionary";
import { insertMedicalReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Put application routes here
  // Prefix all routes with /api

  // API endpoint to process a medical report
  app.post("/api/process-report", async (req, res) => {
    try {
      // Validate request body
      const requestSchema = z.object({
        originalText: z.string().min(1, "Report text is required"),
        isAnonymized: z.boolean().optional().default(false),
        userId: z.number().optional()
      });
      
      const validatedData = requestSchema.parse(req.body);
      const { originalText, isAnonymized, userId } = validatedData;
      
      // Process the medical report text
      const { identifiedTerms, simplifiedText } = processMedicalReport(originalText);
      
      // Create a medical report entry
      const report = {
        userId: userId ?? null,
        originalText,
        simplifiedText,
        identifiedTerms,
        createdAt: new Date().toISOString(),
        isAnonymized
      };
      
      // Save the report if a user is provided
      let savedReport = null;
      if (userId) {
        savedReport = await storage.createMedicalReport(report);
      }
      
      // Return the processed report
      res.json({
        success: true,
        report: {
          id: savedReport?.id,
          originalText,
          simplifiedText,
          identifiedTerms,
          createdAt: report.createdAt,
          isAnonymized
        }
      });
    } catch (error) {
      console.error("Error processing medical report:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Invalid request"
      });
    }
  });

  // API endpoint to get a specific medical report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid report ID" });
      }
      
      const report = await storage.getMedicalReport(id);
      if (!report) {
        return res.status(404).json({ success: false, message: "Report not found" });
      }
      
      res.json({ success: true, report });
    } catch (error) {
      console.error("Error fetching medical report:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Server error"
      });
    }
  });

  // API endpoint to get user's medical reports
  app.get("/api/user/:userId/reports", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
      }
      
      const reports = await storage.getMedicalReportsByUserId(userId);
      res.json({ success: true, reports });
    } catch (error) {
      console.error("Error fetching user medical reports:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Server error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
