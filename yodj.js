config = {
  "auth": process.env.TT_AUTH,
  "user_id": process.env.TT_USERID,
  "room_id": process.env.TT_ROOMID
}

var Bot = require("ttapi");
var bot = new Bot(config.auth, config.user_id, config.room_id);

console.log("Running...");

bot.on("speak", function(data) {
    console.log("Someone spoke.");
    if(data.text.match(/bucky/)) {
        console.log("Someone is talking to me!");
        bot.speak("Shut up and jam, @" + data.name + "!");
    }
});

