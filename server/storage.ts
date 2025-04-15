import { 
  users, type User, type InsertUser,
  medicalReports, type MedicalReport, type InsertMedicalReport,
  userHealthProfiles, type UserHealthProfile, type InsertUserHealthProfile,
  MedicalTerm, HealthData
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLanguage(userId: number, language: string): Promise<User>;
  
  // Medical report methods
  createMedicalReport(report: InsertMedicalReport): Promise<MedicalReport>;
  getMedicalReport(id: number): Promise<MedicalReport | undefined>;
  getMedicalReportsByUserId(userId: number): Promise<MedicalReport[]>;
  getRecentReportsByUserId(userId: number, limit?: number): Promise<MedicalReport[]>;
  
  // Health profile methods
  getUserHealthProfile(userId: number): Promise<UserHealthProfile | undefined>;
  createOrUpdateUserHealthProfile(userId: number, healthData: HealthData): Promise<UserHealthProfile>;
}

// Database implementation of storage
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUserLanguage(userId: number, language: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ preferredLanguage: language })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Medical report methods
  async createMedicalReport(insertReport: InsertMedicalReport): Promise<MedicalReport> {
    const [report] = await db
      .insert(medicalReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getMedicalReport(id: number): Promise<MedicalReport | undefined> {
    const [report] = await db.select().from(medicalReports).where(eq(medicalReports.id, id));
    return report || undefined;
  }

  async getMedicalReportsByUserId(userId: number): Promise<MedicalReport[]> {
    return await db.select().from(medicalReports)
      .where(eq(medicalReports.userId, userId))
      .orderBy(desc(medicalReports.createdAt));
  }
  
  async getRecentReportsByUserId(userId: number, limit: number = 5): Promise<MedicalReport[]> {
    return await db.select().from(medicalReports)
      .where(eq(medicalReports.userId, userId))
      .orderBy(desc(medicalReports.createdAt))
      .limit(limit);
  }
  
  // Health profile methods
  async getUserHealthProfile(userId: number): Promise<UserHealthProfile | undefined> {
    const [profile] = await db.select().from(userHealthProfiles)
      .where(eq(userHealthProfiles.userId, userId));
    return profile || undefined;
  }
  
  async createOrUpdateUserHealthProfile(userId: number, healthData: HealthData): Promise<UserHealthProfile> {
    // Check if profile exists
    const existingProfile = await this.getUserHealthProfile(userId);
    
    if (existingProfile) {
      // Update existing profile
      const [updatedProfile] = await db.update(userHealthProfiles)
        .set({ 
          healthData,
          updatedAt: new Date()
        })
        .where(eq(userHealthProfiles.id, existingProfile.id))
        .returning();
      return updatedProfile;
    } else {
      // Create new profile
      const [newProfile] = await db.insert(userHealthProfiles)
        .values({
          userId,
          healthData
        })
        .returning();
      return newProfile;
    }
  }
}

export const storage = new DatabaseStorage();
