import { ILikeDecider } from "./i-like-decider";
import { Person } from "../model/person";
import { LikeResponse } from "../model/like-response";

export class TBScoreDecider implements ILikeDecider {
  public defaultBadooScore: number = 5.65;
  public mutualInterestsFactor: number = 0.45;
  public requiredScore: number = 6.95;
  public constructor() {
  }

  public shouldLike(person: Person): LikeResponse {
    const score = this.calculateTBScore(person);
    return score > this.requiredScore ?
      { isLike: true, message: `Score of ${score} is enough.` } :
      { isLike: false, message: `Score of ${score} is not enough.` };
      
  }

  private calculateTBScore(person: Person): number {
    const badooScore = person.badooScore != null ? person.badooScore : this.defaultBadooScore;
    return badooScore + person.mutualInterestsCount * this.mutualInterestsFactor;
  }
}