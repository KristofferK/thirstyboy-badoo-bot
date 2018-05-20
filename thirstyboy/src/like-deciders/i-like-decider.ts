import { LikeResponse } from "../model/like-response";
import { Person } from "../model/person";

export interface ILikeDecider {
  shouldLike(person: Person): LikeResponse;
}