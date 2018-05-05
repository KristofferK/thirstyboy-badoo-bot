import * as puppeteer from 'puppeteer';

export interface LoginMessage {
  screendumpPath: string;
  succesfullySignedIn: boolean;
}

export interface Person {
  mutualInterests: number;
  age: number;
  name: string;
  badooScore: number | null;
}

export interface LikeResponse {
  screendumpPath: string;
  isLike: boolean;
}

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
    const screendumpPath = 'screendump/post_login.jpg';
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
    await this.page.waitFor(2000);
    await this.page.screenshot({path: `src/${screendumpPath}`, fullPage: true});

    const succesfullySignedIn: boolean = await this.page.evaluate(() => {
      return document.querySelector('.sidebar__sign') == null;
    });

    return Promise.resolve({screendumpPath, succesfullySignedIn});
  }

  public async getCurrentPerson(): Promise<Person> {
    const person: Person = await this.page.evaluate(() => {
      const ageElement = <HTMLSpanElement>document.querySelector('.profile-header__age');
      const nameElement = <HTMLSpanElement>document.querySelector('.profile-header__name');
      const mutualInterestsElement = <HTMLSpanElement>document.querySelector('[data-interests-type="count"]');
      const badooScoreElement = <HTMLDivElement>document.querySelector('[data-score]');

      const age = parseInt(ageElement.innerText.substring(2));
      const name = nameElement.innerText;
      const mutualInterests = mutualInterestsElement != null ? parseInt(mutualInterestsElement.innerText) : 0;
      const badooScore = badooScoreElement != null ? parseFloat(badooScoreElement.attributes['data-score'].value) : null;

      return { age, name, mutualInterests, badooScore };
    });
    return Promise.resolve(person);
  }

  public calculateTBScore(person: Person): number {
    const badooScore = person.badooScore != null ? person.badooScore : 6.3;
    return badooScore + person.mutualInterests * 0.45;
  }

  public async likeOrDislikePerson(person: Person, like: boolean): Promise<LikeResponse> {
    await this.page.evaluate((like: boolean) => {
      const choice = like ? 'yes' : 'no';
      const element = <HTMLSpanElement>document.querySelector('[data-choice="'+choice+'"]');
      element.click();
    }, like);
    await this.page.waitFor(100);
    const screendumpPath = 'screendump/person.jpg';
    await this.page.screenshot({path: `src/${screendumpPath}`, fullPage: true});
    return Promise.resolve({ screendumpPath, isLike: like });
  }
}