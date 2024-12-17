import db from "..";
import { advocates } from "../schema";

export type Advocate = {  
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

const specialties = [
  "Bipolar",
  "LGBTQ",
  "Medication/Prescribing",
  "Suicide History/Attempts",
  "General Mental Health (anxiety, depression, stress, grief, life transitions)",
  "Men's issues",
  "Relationship Issues (family, friends, couple, etc)",
  "Trauma & PTSD",
  "Personality disorders",
  "Personal growth",
  "Substance use/abuse",
  "Pediatrics",
  "Women's issues (post-partum, infertility, family planning)",
  "Chronic pain",
  "Weight loss & nutrition",
  "Eating disorders",
  "Diabetic Diet and nutrition",
  "Coaching (leadership, career, academic and wellness)",
  "Life coaching",
  "Obsessive-compulsive disorders",
  "Neuropsychological evaluations & testing (ADHD testing)",
  "Attention and Hyperactivity (ADHD)",
  "Sleep issues",
  "Schizophrenia and psychotic disorders",
  "Learning disorders",
  "Domestic abuse",
];

const randomSpecialty = () => {
  const random1 = Math.floor(Math.random() * 24);
  const random2 = Math.floor(Math.random() * (24 - random1)) + random1 + 1;
  return specialties.slice(random1, random2);
};

export const generateAdvocates = (count: number) => {
  const advocatesData = [];
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"];
  const degrees = ["MD", "PhD", "MSW"];

  for (let i = 0; i < count; i++) {
    advocatesData.push({
      firstName: `FirstName${i}`,
      lastName: `LastName${i}`,
      city: cities[i % cities.length],
      degree: degrees[i % degrees.length],
      specialties: randomSpecialty(),
      yearsOfExperience: Math.floor(Math.random() * 20) + 1, // 1-20 years
      phoneNumber: 1000000000 + i, // Ensure unique phone numbers
    });
  }

  return advocatesData;
};
