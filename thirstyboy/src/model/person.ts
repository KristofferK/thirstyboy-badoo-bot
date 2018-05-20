import { Interest } from "./interest";

export class Person {
  mutualInterestsCount: number;
  age: number;
  name: string;
  description: string;
  interests: Interest[];
  languages: string[];
  badooScore: number | null;
  lastOnline: string;
}
