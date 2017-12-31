- testing
+ working
* todo

# ToDo

* editable def: my tags are deleted via "where" or "update" operation
* {}
* https://github.com/merolhack/mern-stack/tree/069b8abf57f052b52af97b4f06ce91037525a998#making-a-progressive-web-app
* https://www.djamware.com/post/59faec0a80aca7739224ee1f/building-crud-web-application-using-mern-stack
* if :valsi then not saave new but update existing
* editing: 1. delete all klesi, my tcita, update fields from new ones.
* editing of definitions
* tcita and klesi are saved probably before writing smuvelcki
* /valsi show tcita. my tcita are separate. others' tcita - finti's prefix
* hyperlink field - two fields for each?
* way to always delete populated passwords
* routes: too many elements like undone tcita are returned
* /cenba - /finti template but prefilled with values
* add new tcita is actually editing of def: simply only tcita fields are accepted for update
* add new tcita to /valsi. separate Select, addable. /api/jmina_letcita to existing valsi.id
* throttle model no longer logs
* friends functionality
* see tags from friends only
* definition editable: by me, by everyone, by no one
* favorite users - my circles of Users
* definition editable by selected users
* OptionInput is changing a controlled input of type text to be uncontrolled. Input elements should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled input element for the lifetime of the component.
* warning that this word in this lang already was added by you
* save lojban words with spaces
* adding a language updates finti page https://stackoverflow.com/questions/36180414/reactjs-add-custom-event-listener-to-component and https://stackoverflow.com/questions/28230845/communication-between-tabs-or-windows
* "dont publish" - not indexable smuvelcki
* dont allow saving identical read-only def. if another read-only already is
* Comedy node.js for main functions. Test!
* shows other defs of this word after submit - simply improve {Valsi}?
* save tags when jbangu, when finti
* https://github.com/bvaughn/react-virtualized-select/ for tcita and klesi
* klesi has language, "your klesi"/"order all by frequency"
* klecihe - smuvelcki, clickable when on klesi. Has velski, language, author
* /sisku client must determine via switch how to present the component for a given model: smuvelcki, mupli, bangu ...
** !items case
* maybe valsi saved even if returned null.id
* if predicate language then show terbri first, old terbri last. otherwise vice versa
* confirmation dialog if adding a new type. "var newKlesiConfirmed=true" simply read flashmessage and press add again. on handlechange newKlesiConfirmed=false
* text before x1 => "text before" whatever. same for other hints
* mobile /finti is not scrollable
- add your defs on profile page
* tcita page
* implement Flow. Mongoose models via https://gist.github.com/nodkz/812519ca9473b28493122872ae57e9c3#file-user-js-L206
* link to tcita on tcita itself
* save logged in state in localstorage
* move localstorage higher into layout
* delete finti localstorage after success
* can't add tag that's already mine and has the same value
* add old terbri
* add page to view users with their rights
* if you have right "add rights" then show "add languages" to user rights in the list via tags
* read only rights that "undone=undefined or false"
* write date of creation
* /recent.html last 7 days
* list of my last definitions
* show my latest words (sort by date of creation)
* klesi_smuvelcki - klesi should have definitions, just text by user
* use https://github.com/DmsChrisPena/reddit-clone-api/blob/master/package.json
* add button to link to one of my words
* add input to link to another def. support any links, confirm if found an id
** on enter of the link show confirmation window.
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
* tcita must have values different from labels - freqs add - impossible to show selected tcita as different
* not only x but lujvo decomposition letters if it's a lujvo (must not coincide)
** k, k', k'' for klaklakla
* user's favorite languages: senelci_bangu
* user's favorite languages: reorder them, add new
* use senelci_bangu in definitions as recommendations
* use senelci_bangu in mupli as recommendations
* search page via http://mongoosejs.com/docs/queries.html
* /finti - flag not to save history
* /cninomupli - flag not to save history
* how to edit a mupli?
* sitemap (routes, paths) like that of jbovlaste.lojban.org
* res.send in server/routes must send err message if any error
* upvote words-s restore functionality. on press 'upvote' if already upvoted by me show message. if not upvoted save. if earlier downvoted - downvote not more often than once a day.
** for downvote reverse method
* html in react-select languages - freq to the right
* check api. whenever send user dont send password!!!
* check api. move all checks into it from client
* react-select noResultsText - localize, searchPromptText
* react-select-plus group support - my languages, other languages
* saving user must be done on server side, dont send user from client `isLoggedIn`
* SaveKlesi and SaveLanguage into one function
* on page reload reatin authenticated state via JWT https://stackoverflow.com/questions/39097440/on-react-router-how-to-stay-logged-in-state-even-refresh-the-page (/profile always redirects to  /login)
* isPredicateLanguage in my settings
* TeX result of parsing. err: ..., parsed: ...
* don't show stats in selected Klesi
* integrate https://github.com/Hashnode/mern-starter
* flashcards https://github.com/atlassian/react-beautiful-dnd
* upgrade react router to https://ebaytech.berlin/universal-web-apps-with-react-router-4-15002bb30ccb https://stackoverflow.com/questions/42797543/whats-wrong-with-this-reactrouter-match-implementation/42798535#42798535
* deleting tags, smuvelcki, klesi, user results in "disabled" for this record
//{_id: {$in: [req.body.data]}
* export dictionary as html
* use https://github.com/verekia/js-stack-from-scratch
* localstorage should instead be stored via https://www.npmjs.com/package/redux-persist
* Redis for horizontal scaling?
* http://kotobanki.thatpage.org/ - implement sharing learnt lists

# Done

- save state after server reload
- fill tcita table on each save
- empty klesi is shown in options
- save tcita.tcita to db
- save tcita's finti to db
- valsi is added in /finti even before confirmation
- /finti/:valsi should not save to localstorage - on componentdidupdate
- when delete new tcita its duplicated in tcitymei
- on every change of tags reload from server tcitymei
- retain logging in at /profile
- /mi doesnt show user details and defs by default
- there is always "undefined" tcita. remove it
- duplicate tcita are being saved
- klemei = klesi entered + from server, nothing more!
- new klesi are not being added, are added only for existing words
- /finti clear button
- show author on valsi/:id
- save my tags
- check if second user can save his tags
- add email when registering locally
- no such nickname if email already registered
- no such nickname if email already registered - better information!
- check if email already registered
x finti page css http://jsfiddle.net/thirtydot/s3zUd/1/
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
- gh is saved as lojban word
- no longer can populate fields
- /sisku/finti=:finti&valsi=:valsi&selgerna_filovalsi=:selgerna_filovalsi root to show defs of valsi from finti
- dont log out after restarting server
- integrate express-sessions into the app and dont change name of pikta
- new klesi are not being added
- no more errors that i already have defs for this word
- /dict/:valsi_by_name
- save only if truly logged in and credentials coincide! - looks like isAuthenticated does the trick
- tcita into separate model
- on save to server save each new type to klesi model. if exists +1 for frequency. if no frequency =1
- take klesi from Klesi table
- type input should be extendable
- author of language marks it as predicate.
- LaTex parser
- latex renderer https://www.npmjs.com/package/react-tex
- /finti - change to promises http://erikaybar.name/using-es6-promises-with-mongoosejs-queries/ https://stackoverflow.com/questions/39004185/how-to-promise-all-multiple-arrays-of-mongoose-document-inserts https://stackoverflow.com/questions/38955512/how-to-use-promise-all-with-mongoose-queries-as-arguments
-- save only if all promises returned no-error
-- on first save show popup that klesi will be added
- /finti on load add to klemei from stored_storage
- 1. check latex, cmaxes, 2. check language 3. promise.all check all klesi.
-- ok now fi all hecks are clean (no err) then we need to return something else
--- if force===true then promise.all(langs,klesi) update frequencies of langs and klesi. then: return results. either ok or error. then: now once again for each error return promise with with save new klesi within each promise 4. save word and return it. ||| So we have 4 embedded layers pf functions.
- /valsi - all definitions of this word
- /finti save state in localstorage
- add language of terbri
- add cmaxes
- throttle works? https://www.npmjs.com/package/mongo-throttle
- finti page. if not logged in redirect to login.

# pages

* /def/:id - simply a readable def
* /def/:id - add upvote downvote, sumvotes
* /def/:id - later add writable tags
* /def/finti - writable new word, write yout initial tags
* /def/:id...:id - link first to the second
* /def/:id...:id - add upvotes, sumvote
* /def/:id...:id - writable tags

# /def/finti

* don't save empty fields
* enter on last field adds a new one

* old_terbri: text - dispreferred
* etymology: [{language: languages[i].id}]
* etymology_comment: text
* tags: [{user: users[i].id, tag: text}] - jargon is a tag

# examples

* linkage: [{wholinked: users[i].id, deflinked: defs[i].id, translation_text: }] - you must derive the language of translation_text from defs[i].language

#words - for indexing

* word: blalalavla
* defs: [defs[i].id]
