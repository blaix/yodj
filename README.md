# Yo, DJ! Turn that music up.

A turntable bot.

## Dev setup

You'll need [node.js](http://nodejs.org/).
If you use [Homebrew](http://mxcl.github.com/homebrew/) you can:

    brew install node

Install dependencies:

    npm install

Install foreman:

    gem install foreman

Log into <turntable.fm> as your bot's user, go into a room, and get credentials
using [this bookmarklet](http://alaingilbert.github.com/Turntable-API/bookmarklet.html).

Run it using the credentials you gathered above:

    TT_AUTH=[auth] TT_USERID=[user id] TT_ROOMID=[room id] foreman start

## Deploying to heroku

[Sign up for an account on heroku](https://api.heroku.com/signup), and then:

    gem install heroku
    heroku login
    heroku create
    heroku config:add TT_AUTH=[auth]
    heroku config:add TT_USERID=[user id]
    heroku config:add TT_ROOMID=[room id]
    git push heroku master
    heroku ps:scale server=1 # you should only have to do this once
