# basic_user_app

install npm & mongo
create db = users, collection = accounts

this branch is the second method of implementing multi-language

in language.json, english & nihongo are separated. their key names are the same

in /getLanguagees, call the variable then add [current_language] then send

pros:
    no use of [current_language] in all variables in angular (use variable as is)
cons:
    get language after logging in and after changing language in settings
    