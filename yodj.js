var config = require("./config.js");

var myName = new RegExp("^@?" + config.name, "i");

var Bot = require("ttapi");
var bot = new Bot(config.auth, config.user_id, config.room_id);

console.log("Running...");

function delay(callback) {
  setTimeout(callback, config.reply_delay);
}

var addressedDirectly = function(data){
  console.log("@" + data.name + " is talking to me.");

  if(data.text.match(/add (this|my) song/i)) {
    delay(function() {
      bot.speak("I will. I love this song.");
      bot.bop();
      bot.playlistAll(function(playlist) {
        var song = data.room.metadata.current_song;
        bot.playlistAdd(song._id, playlist.list.length);
        console.log("Added " + song.metadata.song + "to my queue");
      });
      // show the heart:
      bot.snag();
    });
  }

  else if(data.text.match(/get (you're ass )?up t?here/i)) {
    delay(function() {
      bot.speak("3 2 1 let's jam");
      bot.addDj();
      console.log("Started DJ'ing");
    });
  }

  else if(data.text.match(/(get|step) down/i)) {
    delay(function() {
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
    delay(function() {
      bot.speak("Mhmm... Mhmm... I know some of those words.");
    });
  }
};

var onSpeak = function(data) {
  console.log("Someone spoke.");

  if(data.text.match(myName)) {
    onSpokenTo(data);
  }

  // bucky appears in line but not at the beginning
  else if(data.text.match(/bucky/)) {
    delay(function() {
      bot.speak("You talking to me...?");
    });
  }
};

bot.on("speak", onSpeak);

