import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  preferredLanguage: text("preferred_language").default("en"),
  email: text("email").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  preferredLanguage: true,
  email: true,
});

export const medicalReports = pgTable("medical_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalText: text("original_text").notNull(),
  simplifiedText: text("simplified_text").notNull(),
  identifiedTerms: jsonb("identified_terms").$type<MedicalTerm[]>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isAnonymized: boolean("is_anonymized").notNull().default(false),
  language: text("language").default("en"),
});

export const insertMedicalReportSchema = createInsertSchema(medicalReports).pick({
  userId: true,
  originalText: true,
  simplifiedText: true,
  identifiedTerms: true,
  isAnonymized: true,
  language: true,
});

export const userHealthProfiles = pgTable("user_health_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  healthData: jsonb("health_data").$type<HealthData>().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserHealthProfileSchema = createInsertSchema(userHealthProfiles).pick({
  userId: true,
  healthData: true,
});

export type HealthData = {
  age?: number;
  gender?: string;
  height?: number; // in cm
  weight?: number; // in kg
  knownConditions?: string[];
  medications?: string[];
  allergies?: string[];
  familyHistory?: string[];
  lastCheckup?: string; // ISO date string
  bloodType?: string;
  chronicConditions?: string[];
  recentTerms?: MedicalTerm[]; // Recent terms from reports
};

export type MedicalTerm = {
  term: string;
  simplified: string;
  definition: string;
  normalRange?: string;
  value?: string;
  status?: 'normal' | 'low' | 'high' | 'borderline-high' | 'borderline-low' | 'abnormal';
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMedicalReport = z.infer<typeof insertMedicalReportSchema>;
export type MedicalReport = typeof medicalReports.$inferSelect;

export type InsertUserHealthProfile = z.infer<typeof insertUserHealthProfileSchema>;
export type UserHealthProfile = typeof userHealthProfiles.$inferSelect;

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
];
