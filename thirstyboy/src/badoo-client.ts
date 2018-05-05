import * as puppeteer from 'puppeteer';

export interface LoginMessage {
  screendumpPath: string;
  succesfullySignedIn: boolean;
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
}