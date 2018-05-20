import * as puppeteer from 'puppeteer';
import { LoginMessage } from './model/login-message';
import { Person } from './model/person';
import { LikeResponse } from './model/like-response';
import { ILikeDecider } from './like-deciders/i-like-decider';
import { Interest } from './model/interest';

export class BadooClient {
  private constructor(private browser: puppeteer.Browser, private page: puppeteer.Page) {
  }
  
  static async initialize(width: number = 1422, height: number = 800): Promise<BadooClient> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({width: width, height: height});
    return Promise.resolve(new BadooClient(browser, page));
  }

  public async login(email: string, password: string): Promise<LoginMessage> {
    await this.page.goto('https://badoo.com/signin/?f=top');
    await this.page.evaluate((email: string, password: string) => {
      const emailField = <HTMLInputElement>document.querySelector('input[name="email"]');
      const passwordField = <HTMLInputElement>document.querySelector('input[name="password"]');
      const submitButton = <HTMLButtonElement>document.querySelector('[type="submit"]');
      emailField.value = email;
      passwordField.value = password;
      submitButton.click();
    }, email, password);
    await this.page.waitFor(2000);
    await this.page.goto('https://badoo.com/encounters');
    await this.page.waitFor(3000);

    let succesfullySignedIn: boolean = await this.page.evaluate(() => {
      return document.querySelector('.sidebar__sign') === null;
    });
    const name: string = await this.page.evaluate(() => {
      const element = <HTMLAnchorElement>document.querySelector('.sidebar-info__name');
      return element === null ? '<unknown>' : element.innerText;
    })

    if (name === '<unknown>') {
      succesfullySignedIn = false;
    }
    await this.page.screenshot({ path: 'src/screendump/post_login.jpg', fullPage: true });

    return Promise.resolve({name, succesfullySignedIn});
  }

  public async getCurrentPerson(): Promise<Person> {
    await this.page.waitFor(125);
    await this.page.waitForSelector('.b-link.js-profile-header-toggle-layout');
    await this.page.click('.b-link.js-profile-header-toggle-layout');
    await this.page.waitFor(700);
    const person: Person = await this.page.evaluate((p: Person) => {
      const ageElement = <HTMLSpanElement>document.querySelector('.profile-header__age');
      const nameElement = <HTMLSpanElement>document.querySelector('.profile-header__name');
      const mutualInterestsElement = <HTMLSpanElement>document.querySelector('[data-interests-type="count"]');
      const badooScoreElement = <HTMLDivElement>document.querySelector('[data-score]');
      const descriptionElement = <HTMLSpanElement>document.querySelector('.profile-section__txt');
      const interestsElements = <HTMLSpanElement[]>([...document.querySelectorAll('[data-interests-id')]);
      const languageElement = <HTMLDivElement>document.querySelector('.js-profile-languages-container .profile-section__content');const onlineStatusElement = document.querySelector('.online-status .tooltip__content');

      const age = parseInt(ageElement.innerText.substring(2));
      const name = nameElement.innerText;
      const mutualInterestsCount = mutualInterestsElement != null ? parseInt(mutualInterestsElement.innerText) : 0;
      const badooScore = badooScoreElement != null ? parseFloat(badooScoreElement.attributes['data-score'].value) : null;
      const onlineStatus = onlineStatusElement != null ? onlineStatusElement.innerHTML.trim() : '';
      
      let interests: Interest[] = [];
      if (interestsElements != null) interests = interestsElements.map(e => {
        return { title: e.innerText.trim(), isMutual: e.classList.contains('intr--match') };
      });

      let description: string = '';
      if (descriptionElement != null) description = descriptionElement.innerText;

      let languages: string[] = [];
      if (languageElement != null) languages = languageElement.innerText.split(',').map(e => e.split('(')[0].trim());

      p.age = age,
      p.mutualInterestsCount = mutualInterestsCount;
      p.name = name;
      p.description = description;
      p.interests = interests;
      p.languages = languages;
      p.badooScore = badooScore;
      p.onlineStatus = onlineStatus;
      return p;
    }, new Person());
    return Promise.resolve(person);
  }

  public async likeOrDislikePerson(person: Person, likeDecider: ILikeDecider): Promise<LikeResponse> {
    const likeResponse = likeDecider.shouldLike(person);
    await this.page.evaluate((like: boolean) => {
      const choice = like ? 'yes' : 'no';
      const element = <HTMLSpanElement>document.querySelector('[data-choice="'+choice+'"]');
      element.click();
    }, likeResponse.isLike);
    await this.page.waitFor(100);
    return Promise.resolve(likeResponse);
  }
}