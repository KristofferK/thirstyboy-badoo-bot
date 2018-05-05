import * as os from 'os';
import * as fs from 'fs';

export interface Credentials {
  email: string;
  password: string;
}

export class CredentialsSaver {
  public save(email: string, password: string) {
    const credentials = JSON.stringify({email, password});
    fs.writeFileSync(this.getFilePath(), credentials);
  }

  public restore(): Credentials {
    if (fs.existsSync(this.getFilePath())) {
      const credentails = JSON.parse(fs.readFileSync(this.getFilePath(), {encoding: 'utf8'}));
      return <Credentials>credentails;
    }
    return {email: 'example@gmail.com', password: ''};
  }

  private getFilePath() {
    return os.tmpdir() + 'thirstybot.json';
  }
}