import { ILikeDecider } from "./i-like-decider";
import { Person } from "../model/person";
import { LikeResponse } from "../model/like-response";

export class LikeAll implements ILikeDecider {
  shouldLike(person: Person): LikeResponse {
    return { isLike: true, message: 'Liking everyone.' };
  }
}