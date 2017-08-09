- testing
+ working
* todo
Soon:
- show author on valsi/:id
- save my tags
- check if second user can save his tags
- add email when registering locally
- no such nickname if email already registered
- no such nickname if email already registered - better information!
- check if email already registered
* finti page css http://jsfiddle.net/thirtydot/s3zUd/1/
- page to restore password: enter cmene and email
- send password https://www.w3schools.com/nodejs/nodejs_email.asp
- change password
- resend password not more often than once a day
- add page to add languages
- show if language already exists
- add language of word: list of languages https://github.com/JedWatson/react-select
- on saving check if language of smuvelcki is in the db
- on add smuvelcki add freq to its Language
- get languages sorted by freq
- terbri is not saved
- add server-side ilmentufa to word check, flash if incorrect
- tags must get saved
- fill klesi table on each save
* save tags when jbangu, when finti
* fill tcita table on each save
- on save to server save each new type to klesi model. if exists +1 for frequency. if no frequency =1
- take klesi from Klesi table
- type input should be extendable
- author of language marks it as predicate.
- LaTex parser
- latex renderer https://www.npmjs.com/package/react-tex
* if predicate language then show terbri first, old terbri last. otherwise vice versa
* don't show stats in selected Klesi
* confirmation dialog if adding a new type. "var newKlesiConfirmed=true" simply read flashmessage and press add again. on handlechange newKlesiConfirmed=false
* text before x1 => "text before" whatever. same for other hints
* mobile /finti is not scrollable
- /valsi - all definitions of this word
* /valsi show tcita. my tcita are separate
* add your defs on profile page
* tcita page
* link to tcita on tcita itself
* can't add tag that's already mine and has the same value
* add old terbri
* add page to view users with their rights
* if you have right "add rights" then show "add languages" to user rights in the list via tags
* read only rights that "undone=undefined or false"
- add language of terbri
* write date of creation
* show my latest words (sort by date of creation)
* add button to link to one of my words
* add input to link to another def. support any links, confirm if found an id
** on enter of the link show confirmation window.
* add cmaxes
* UI localization table. Get strings from it, English by default, if logged user language by default
* page listing all localization strings
* /proga/:id
* choose your language, tags your translation, similar to Valsi pages
* choose your localization in settings
* which woould be fallbacks: English, Lojban (will be chosen from the most used translation)
* unknown strings are in fallback language
* how to add a localization string? Fintilocalization page, linkage
* admin right "remove comment". allows to remove pages with spam, remains in db with
* admin right "remove user". allows to remove user
* admin right "remove word". allows to remove definition. on -1 to each of its "klesi". then remove "klesi" that have 0 frequency
* user registered using Twitter is displayed with his twitter name + an icon of twitter
* search for precise match of word: return all definitions
* add favicon https://medium.com/@bryantheastronaut/react-getting-started-the-mern-stack-tutorial-feat-es6-de1a2886be50
* if change one string the string with same place must change its type accordingly
* not only x but lujvo decomposition letters if it's a lujvo (must not coincide)
** k, k', k'' for klaklakla
* user's favorite languages: senelci_bangu
* user's favorite languages: reorder them, add new
* use senelci_bangu in definitions as recommendations
* use senelci_bangu in mupli as recommendations
- throttle works? https://www.npmjs.com/package/mongo-throttle
* search page via http://mongoosejs.com/docs/queries.html
* /finti - flag not to save history
* how to edit a definition?
* /cninomupli - flag not to save history
* how to edit a mupli?
* sitemap (routes, paths) like that of jbovlaste.lojban.org
* adding a language updates finti page https://stackoverflow.com/questions/36180414/reactjs-add-custom-event-listener-to-component and https://stackoverflow.com/questions/28230845/communication-between-tabs-or-windows
* res.send in server/routes must send err message if any error
* upvote words-s restore functionality. on press 'upvote' if already upvoted by me show message. if not upvoted save. if earlier downvoted - downvote not more often than once a day.
* for downvote reverse method
* html in react-select languages - freq to the right
* check api. whenever send user dont send password!!!
* react-select noResultsText - localize, searchPromptText
* react-select-plus group support - my languages, other languages
* saving user must be done on server side, dont send user from client `isLoggedIn`
- finti page. if not logged in redirect to login.
* SaveKlesi and SaveLanguage into one function
* on page reload reatin authenticated state via JWT https://stackoverflow.com/questions/39097440/on-react-router-how-to-stay-logged-in-state-even-refresh-the-page (/profile always redirects to  /login)
* isPredicateLanguage in my settings
* TeX result of parsing. err: ..., parsed: ...

----
pages
* /def/:id - simply a readable def
* /def/:id - add upvote downvote, sumvotes
* /def/:id - later add writable tags
* /def/finti - writable new word, write yout initial tags
* /def/:id...:id - link first to the second
* /def/:id...:id - add upvotes, sumvote
* /def/:id...:id - writable tags

----
/def/finti
* don't save empty fields
* enter on last field adds a new one

* old_terbri: text - dispreferred
* etymology: [{language: languages[i].id}]
* etymology_comment: text
* tags: [{user: users[i].id, tag: text}] - jargon is a tag

examples
* linkage: [{wholinked: users[i].id, deflinked: defs[i].id, translation_text: }] - you must derive the language of translation_text from defs[i].language

words - for indexing
* word: blalalavla
* defs: [defs[i].id]
----
