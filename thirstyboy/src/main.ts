export = 0;

import { BadooClient } from './badoo-client';
import { Credentials, CredentialsSaver } from './credentials-saver';

let badoo: BadooClient;
BadooClient.initialize().then(client => badoo = client);

const imageFeedback = <HTMLImageElement>document.getElementById('image-feedback');
const credentialsSaver = new CredentialsSaver();

const credentails = credentialsSaver.restore();
(<HTMLInputElement>document.getElementById('email')).value = credentails.email;
(<HTMLInputElement>document.getElementById('password')).value = credentails.password;

const runElem = <HTMLButtonElement>document.querySelector("#perform-login");
runElem.addEventListener('click', (e: MouseEvent) => {
  const form = new FormData(document.querySelector('form'))
  const email = form.get('email').toString();
  const password = form.get('password').toString();
  credentialsSaver.save(email, password);

  console.log('Must login with', email, password);
  badoo.login(email, password).then(imagePath => {
    console.log('Log in?', imagePath);
    imageFeedback.src = imagePath;
  })
})