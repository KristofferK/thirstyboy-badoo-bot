# thirstyboy-badoo-bot
Online dating sure is a fascinating phenomena. Unfortunately finding the right partner, can take up a lot of our precious time. What if we could have a bot automatically do the work, and find potential partners for us?

## Technology
For technology we will use Electron and Puppeteer. Styling will be done using Bootstrap 4.

For the first iterations we will just print to console. However later one we might decide to add a view engine like Angular or Vue.

## Installation
Install necessary packages using `npm install`. Run the program using `npm run electron-local`.
 
## Finding the partner
We should be able to determine wheter a person is a potential partner in multiple ways. We'll call the determining algorithms for *fixed* and *dynamic*.

### Fixed
The fixed determining algorithm will require the person, to have a Badoo-score of at least X, and at least Y mutual interests. X will be any real number between 0 and 10. Y will be any natural number between 0 and 20. A real thirstyboy will of course let both X and Y be 0.

Now we'd never judge a partner by their looks, so we will of course set the default value of X to 0.0 and Y to 3.

### Dynamic
In the dynamic determining algorithm we will calculate a score, *TBScore*, as

TBScore = BadooScore + MutualInterests * Factor

Factor will be 0.45, but should later be adjustable through the GUI. Unfortunately often enough persons won't have a BadooScore. In that case we will assume it is 6.3.

# Proof of Concept
This is entirely made as a proof of concept. Please also note that when you hit the login button, your credentials (email and password) will be stored in plaintext on your system.

## Future plans
In a future version, we'd like to rewrite the entire project, to use some sort of optimization technique to determine which person(s) to match with depending on multiple features. This could be particle swarm optimization. *Finding a suitable partner in a multi dimensional search space*.