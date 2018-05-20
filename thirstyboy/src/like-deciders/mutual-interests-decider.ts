import { ILikeDecider } from "./i-like-decider";
import { LikeResponse } from "../model/like-response";
import { Person } from "../model/person";

export class MutualInterestsDecider implements ILikeDecider {
  public constructor(public mutualInterestsRequired: number) {

  }

  public shouldLike(person: Person): LikeResponse {
    return person.mutualInterestsCount >= this.mutualInterestsRequired ?
      { isLike: true, message: `${person.name} has ${this.mutualInterestsRequired}+ mutual interests.` } :
      { isLike: false, message: 'Not enough mutual interests.' };
  }
}