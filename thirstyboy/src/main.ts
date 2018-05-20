export = 0;

import { BadooClient } from './badoo-client';
import { Credentials, CredentialsSaver } from './credentials-saver';
import { ILikeDecider } from './like-deciders/i-like-decider';
import { MutualInterestsDecider } from './like-deciders/mutual-interests-decider';

const loginButton = <HTMLButtonElement>document.querySelector("#perform-login");

let badoo: BadooClient;
BadooClient.initialize().then(client => {
  badoo = client;
  loginButton.innerText = loginButton.innerText.split('(')[0].trim();
  loginButton.classList.remove('disabled');
});

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

const likeDecider: ILikeDecider = new MutualInterestsDecider(3); 

const findPersonAndPerformAction = () => {
  badoo.getCurrentPerson().then(person => {
    console.log(person);
    
    window.setTimeout(() => {
      badoo.likeOrDislikePerson(person, likeDecider).then(likeResponse => {
        console.log(likeResponse);
        window.setTimeout(findPersonAndPerformAction, 200);
      });
    }, 3000);
  });
};

loginButton.addEventListener('click', (e: MouseEvent) => {
  const form = new FormData(document.querySelector('form'))
  const email = form.get('email').toString();
  const password = form.get('password').toString();
  credentialsSaver.save(email, password);

  if (!badoo) {
    alert('Badoo client has not been initialized yet. Please try again.');
    return;
  }

  document.querySelector('form').style.display = 'none';
  updateStatusBar('Attempting to sign in.', 'bg-info');
  badoo.login(email, password).then(loginMessage => {
    if (!loginMessage.succesfullySignedIn) {
      document.querySelector('form').style.display = 'block';
      updateStatusBar('Failed to sign in.', 'bg-danger');
    }
    else {
      updateStatusBar(`Sucessfully signed in as ${loginMessage.name}. Beginning in three seconds.`, 'bg-success');
      window.setTimeout(findPersonAndPerformAction, 3000);
    }
  })
});