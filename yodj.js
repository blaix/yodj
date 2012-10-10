config = {
  "auth": process.env.TT_AUTH,
  "user_id": process.env.TT_USERID,
  "room_id": process.env.TT_ROOMID,
  "reply_delay": 1000
};

var Bot = require("ttapi");
var bot = new Bot(config.auth, config.user_id, config.room_id);

console.log("Running...");

function reply(callback) {
  setTimeout(callback, config.reply_delay);
}

bot.on("speak", function(data) {
  console.log("Someone spoke.");
  if(data.text.match(/^@?bucky/i)) {
    console.log("@" + data.name + " is talking to me.");

    if(data.text.match(/add (this|my) song/i)) {
      reply(function() {
        bot.speak("I will. I love this song.");
        bot.bop();
        bot.roomInfo(false, function(data) {
          var song = data.room.metadata.current_song;
          bot.playlistAdd(song._id);
          console.log("Added " + song.metadata.song + "to my queue");
        });
      });
    }

    else if(data.text.match(/get (you're ass )?up t?here/i)) {
      reply(function() {
        bot.speak("3 2 1 let's jam");
        bot.addDj();
        console.log("Started DJ'ing");
      });
    }

    else if(data.text.match(/(get|step) down/i)) {
      reply(function() {
        bot.speak("As you wish.");
        bot.remDj(config.user_id);
        console.log("Stopped DJ'ing");
      });
    }

    else if(data.text.match(/awesome (this|my) song/i)) {
      reply(function() {
        bot.speak("I was just about to!");
        bot.bop();
        console.log("Awesome song is awesome.");
      });
    }

    else {
      reply(function() {
        bot.speak("Mhmm... Mhmm... I know some of those words.");
      });
    }
  }
});

