import { ILikeDecider } from "./i-like-decider";
import { Person } from "../model/person";
import { LikeResponse } from "../model/like-response";

export class AlternativeDecider implements ILikeDecider {
  public shouldLike(person: Person): LikeResponse {
    if (person.mutualInterestsCount >= 5) {
      return { isLike: true, message: '5+ mutual interests. Instant like.' };
    }

    const descriptionWithInterests = (person.description + '\n\n' + person.interests.map(e => e.title).join(', ')).toLowerCase();
    const keywords = [':3', 'x3', ':c', 'c:', '^^', 'XD', '😺', '😹', '😽', '😻', '🙀', 'emo', 'goth', 'punk', 'anime', 'kawaii', 'lawl', 'rawr', 'black veil brides', 'bring me the horizon', 'slipknot', 'korn', 'rob zombie', 'heavy metal', 'cosplay', 'alternativ', 'software', 'programmør', 'datamatiker', 'webudvikl', 'vegan', 'datalogi', 'computer science', 'meme', 'memes', 'maymays', 'dank'];
    const keywordsMatched = keywords.filter(keyword => descriptionWithInterests.indexOf(keyword) !== -1);
    if (keywordsMatched.length) {
      return { isLike: true, message: 'Matched keywords: ' + keywordsMatched.join(', ') + '.' };
    }

    const keywordsBanned = ['datter', 'mor', 'søn', 'jura ', 'crossfit'];
    const keywordsBannedMatched = keywordsBanned.filter(keyword => descriptionWithInterests.indexOf(keyword) !== -1);
    if (keywordsBannedMatched.length) {
      return { isLike: false, message: 'Matched banned keywords: ' + keywordsBannedMatched.join(', ') + '.' };
    }

    const languages = [];
    const languagesMatched = person.languages.filter(language => languages.indexOf(language.toLowerCase()) !== -1);
    if (languagesMatched.length) {
      return { isLike: true, message: 'Matched languages: ' + languagesMatched.join(', ') + '.' };
    }

    if (person.onlineStatus.indexOf('7+') !== -1) {
      return { isLike: false, message: 'User seems to be inactive.' };
    }

    return { isLike: false, message: 'Might not be relevant for us.' };
  }
}
