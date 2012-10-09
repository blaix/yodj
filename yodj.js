config = {
  "auth": process.env.TT_AUTH,
  "user_id": process.env.TT_USERID,
  "room_id": process.env.TT_ROOMID
};

var Bot = require("ttapi");
var bot = new Bot(config.auth, config.user_id, config.room_id);

console.log("Running...");

bot.on("speak", function(data) {
  console.log("Someone spoke.");
  if(data.text.match(/^@?bucky/)) {
    console.log("@" + data.name + " is talking to me.");

    if(data.text.match(/add (this|my) song/)) {
      bot.speak("I will. I love this song.");
      bot.bop();
      bot.roomInfo(false, function(data) {
        bot.playlistAdd(data.room.metadata.current_song._id);
      });
    }

    if(data.text.match(/get (you're ass )?up t?here/)) {
      bot.speak("3 2 1 let's jam");
      bot.addDj();
    }

    if(data.text.match(/(get|step) down/)) {
      bot.speak("As you wish.");
      bot.removeDj(config.user_id);
    }
  }
});

