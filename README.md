# thirstyboy-badoo-bot
Online dating sure is a fascinating phenomena. Unfortunately finding the right partner, can take up a lot of our precious time. What if we could have a bot automatically do the work, and find potential partners for us?

## Technology
For technology we will use
 * Angular(5), since version 6 is still release candidates, and we've bad experience using release candidate versions of Angular.
 * Electron since it works on multiple platforms.
 
## Finding the partner
We should be able to determine wheter a person is a potential partner in multiple ways. We'll call the determining algorithms for *fixed* and *dynamic*.

### Fixed
The fixed determining algorithm will require the person, to have a Badoo-score of at least X, and at least Y mutual interests. X will be any real number between 0 and 10. Y will be any natural number between 0 and 20. A real thirstyboy will of course let both X and Y be 0.

Now we'd never judge a partner by their looks, so we will of course set the default value of X to 0.0 and Y to 3.

### Dynamic
In the dynamic determining algorithm we will calculate a score (TB-score). The TB-score must be at least Z, where Z is calculated as

Z = BadooScore - MutualInterests * Factor

Factor will be 0.45, but should later be adjustable through the GUI.