import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processMedicalReport } from "@shared/medical-dictionary";
import { supportedLanguages, HealthData } from "@shared/schema";
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
        userId: z.number().optional(),
        language: z.string().optional().default("en")
      });
      
      const validatedData = requestSchema.parse(req.body);
      const { originalText, isAnonymized, userId, language } = validatedData;
      
      // Process the medical report text
      const { identifiedTerms, simplifiedText } = processMedicalReport(originalText);
      
      // Save the report if a user is provided
      let savedReport = null;
      if (userId) {
        savedReport = await storage.createMedicalReport({
          userId,
          originalText,
          simplifiedText,
          identifiedTerms,
          isAnonymized,
          language
        });
        
        // Update health profile with the identified terms
        try {
          const healthProfile = await storage.getUserHealthProfile(userId);
          if (healthProfile) {
            const updatedHealthData: HealthData = {
              ...healthProfile.healthData,
              recentTerms: identifiedTerms
            };
            await storage.createOrUpdateUserHealthProfile(userId, updatedHealthData);
          } else {
            // Create a new health profile with just the terms
            await storage.createOrUpdateUserHealthProfile(userId, {
              recentTerms: identifiedTerms
            });
          }
        } catch (profileError) {
          console.error("Error updating health profile:", profileError);
          // Don't fail the whole request if profile update fails
        }
      }
      
      // Return the processed report
      res.json({
        success: true,
        report: {
          id: savedReport?.id,
          originalText,
          simplifiedText,
          identifiedTerms,
          createdAt: savedReport?.createdAt || new Date().toISOString(),
          isAnonymized,
          language
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
  
  // API endpoint to get user's recent reports
  app.get("/api/user/:userId/recent-reports", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const reports = await storage.getRecentReportsByUserId(userId, limit);
      res.json({ success: true, reports });
    } catch (error) {
      console.error("Error fetching recent reports:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Server error"
      });
    }
  });
  
  // API endpoint to get user's health profile
  app.get("/api/user/:userId/health-profile", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
      }
      
      const profile = await storage.getUserHealthProfile(userId);
      if (!profile) {
        return res.status(404).json({ success: false, message: "Health profile not found" });
      }
      
      res.json({ success: true, profile });
    } catch (error) {
      console.error("Error fetching health profile:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Server error"
      });
    }
  });
  
  // API endpoint to update user's health profile
  app.post("/api/user/:userId/health-profile", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
      }
      
      // Validate health data structure
      const healthDataSchema = z.object({
        age: z.number().optional(),
        gender: z.string().optional(),
        height: z.number().optional(),
        weight: z.number().optional(),
        knownConditions: z.array(z.string()).optional(),
        medications: z.array(z.string()).optional(),
        allergies: z.array(z.string()).optional(),
        familyHistory: z.array(z.string()).optional(),
        lastCheckup: z.string().optional(),
        bloodType: z.string().optional(),
        chronicConditions: z.array(z.string()).optional()
      });
      
      const healthData = healthDataSchema.parse(req.body);
      const profile = await storage.createOrUpdateUserHealthProfile(userId, healthData);
      
      res.json({ success: true, profile });
    } catch (error) {
      console.error("Error updating health profile:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Invalid request"
      });
    }
  });
  
  // API endpoint to update user's language preference
  app.post("/api/user/:userId/language", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
      }
      
      const schema = z.object({
        language: z.string().refine(
          lang => supportedLanguages.some(l => l.code === lang),
          { message: "Unsupported language" }
        )
      });
      
      const { language } = schema.parse(req.body);
      const user = await storage.updateUserLanguage(userId, language);
      
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error updating language preference:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Invalid request"
      });
    }
  });
  
  // API endpoint to get supported languages
  app.get("/api/languages", async (req, res) => {
    res.json({ success: true, languages: supportedLanguages });
  });

  const httpServer = createServer(app);

  return httpServer;
}
