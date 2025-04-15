import { 
  users, type User, type InsertUser,
  medicalReports, type MedicalReport, type InsertMedicalReport,
  MedicalTerm
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Medical report methods
  createMedicalReport(report: InsertMedicalReport): Promise<MedicalReport>;
  getMedicalReport(id: number): Promise<MedicalReport | undefined>;
  getMedicalReportsByUserId(userId: number): Promise<MedicalReport[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private medicalReports: Map<number, MedicalReport>;
  currentUserId: number;
  currentReportId: number;

  constructor() {
    this.users = new Map();
    this.medicalReports = new Map();
    this.currentUserId = 1;
    this.currentReportId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMedicalReport(insertReport: InsertMedicalReport): Promise<MedicalReport> {
    const id = this.currentReportId++;
    const report: MedicalReport = { ...insertReport, id };
    this.medicalReports.set(id, report);
    return report;
  }

  async getMedicalReport(id: number): Promise<MedicalReport | undefined> {
    return this.medicalReports.get(id);
  }

  async getMedicalReportsByUserId(userId: number): Promise<MedicalReport[]> {
    return Array.from(this.medicalReports.values()).filter(
      (report) => report.userId === userId,
    );
  }
}

export const storage = new MemStorage();
