import { 
  users, type User, type InsertUser,
  medicalReports, type MedicalReport, type InsertMedicalReport,
  MedicalTerm
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Medical report methods
  createMedicalReport(report: InsertMedicalReport): Promise<MedicalReport>;
  getMedicalReport(id: number): Promise<MedicalReport | undefined>;
  getMedicalReportsByUserId(userId: number): Promise<MedicalReport[]>;
}

// Database implementation of storage
export class DatabaseStorage implements IStorage {
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
    return await db.select().from(medicalReports).where(eq(medicalReports.userId, userId));
  }
}

export const storage = new DatabaseStorage();
