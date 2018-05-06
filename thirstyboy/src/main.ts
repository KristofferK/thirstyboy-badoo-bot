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

const updateDiv = (div: HTMLDivElement) => (message: string, className: string) => {
  div.innerText = message;
  div.className = className;
};

const statusBar = <HTMLDivElement>document.getElementById('status-bar');
const updateStatusBar = updateDiv(statusBar);

const findPersonAndPerformAction = () => {
  badoo.getCurrentPerson().then(person => {
    console.log(person);
    const shouldLike = person.mutualInterests >= 2 || person.description.toLowerCase().indexOf('lol') != -1;
    console.log((shouldLike ? 'Liking ' : 'Disliking ') + person.name + ' in 3 seconds!');
    window.setTimeout(() => {
      badoo.likeOrDislikePerson(person, shouldLike).then(likeResponse => {
        console.log(likeResponse.isLike);
        imageFeedback.src = likeResponse.screendumpPath + "?" + (+new Date());
        findPersonAndPerformAction();
      });
    }, 3000);
  });
};

const loginButton = <HTMLButtonElement>document.querySelector("#perform-login");
loginButton.addEventListener('click', (e: MouseEvent) => {
  const form = new FormData(document.querySelector('form'))
  const email = form.get('email').toString();
  const password = form.get('password').toString();
  credentialsSaver.save(email, password);

  document.querySelector('form').style.display = 'none';

  updateStatusBar('Attempting to sign in.', 'bg-info');
  imageFeedback.src = '';
  badoo.login(email, password).then(loginMessage => {
    imageFeedback.src = loginMessage.screendumpPath + "?" + (+new Date());
    if (!loginMessage.succesfullySignedIn) {
      document.querySelector('form').style.display = 'block';
      updateStatusBar('Failed to sign in.', 'bg-danger');
    }
    else {
      updateStatusBar('Sucessfully signed in.', 'bg-success');
      findPersonAndPerformAction();
    }
  })
});