require("sugar");

var config = require("./config.js");

var Bot = require("ttapi");
var bot = new Bot(config.auth, config.user_id, config.room_id);

console.log("Running...");

var delay = function(callback, args) {
  setTimeout(function(){
    callback(args);
  }, config.reply_delay);
};

var addSong = function() {
  bot.speak("I will. I love this song.");
  bot.bop();
  bot.playlistAll(function(playlist) {
    var song = data.room.metadata.current_song;
    bot.playlistAdd(song._id, playlist.list.length);
    console.log("Added " + song.metadata.song + "to my queue");
  });
  // show the heart:
  bot.snag();
};


var startSpinningReplies = [
  "3 2 1 let's jam",
  "Just call me Mr. Spinderella.",
  "Funky fresh beats, coming right up.",
  "Okay, but I REALLY suck at this.",
  "Oooh. This chair is still warm.",
  "Well, if you insist.",
  "Somebody STOP ME!"
];
var startSpinning = function(){
  bot.speak(startSpinningReplies.sample());
  bot.addDj();
  console.log("Started DJ'ing");
};

var stopSpinning = function(){
  bot.speak("As you wish.");
  bot.remDj(config.user_id);
  console.log("Stopped DJ'ing");
};

var bopReplies = [
  "I was just about to!",
  "Oh yeah, I'm shakin' it, now!",
  "Look at me go!",
  "This song rules. It RULES!",
  "This is my new favorite song.",
  "What? Oh, yeah. This song is okay I guess. If you say so.",
  "Of course. I shall now be gettin' jiggy wit' it.",
  "Let the booty shaking commence."
];

var bop = function() {
  bot.speak(bopReplies.sample());
  bot.bop();
  console.log("Awesome song is awesome.");
};

var confusedReplies = [
  "Mhmm... Mhmm... I know some of those words.",
  "Ha ha ha ha!\nWait- What did you say?",
  "Uhm. I guess so...",
  "You're not really making any sense.",
  "I could really use a nap.",
  "WHAT? WHAAAT!?!?!\nI'm afraid it's too darn loud.",
  "I have no idea.",
  "Monkeys are funny. Tee hee."
];

var totallyConfused = function() {
  bot.speak(confusedReplies.sample());
};

var bopTriggers = [
  /awesome (this|my) song/i,
  /start (dancing|shaking (your (ass|booty|rump)|it))/i,
  /shake (your (ass|booty|rump)|it)/i,
];

var onSpokenTo = function(data){
  console.log("@" + data.name + " is talking to me.");

  if(data.text.match(/add (this|my) song/i)) {
    delay(addSong, data);
  }

  else if(data.text.match(/get (you're ass )?up t?here/i)) {
    delay(startSpinning, data);
  }

  else if(data.text.match(/(get|step) down/i)) {
    delay(stopSpinning, data);
  }

  else if(bopTriggers.any(function(){return data.text.match(this);})) {
    delay(bop, data);
  }

  else {
    delay(totallyConfused, data);
  }
};


var mentionedReplies = [
  "You talking to me...?",
  "My ears are burning.",
  "What? Who said that?",
  "I will happily reply, if you would find the courtesy to address me directly.",
  "(Sigh)",
  "I could use a hug.",
  "What time is it?"
];

var onMentioned = function() {
  bot.speak(mentionedReplies.sample());
};


var myNameAtBeginning = new RegExp("^@?" + config.name, "i");
var myNameAnywhere = new RegExp(config.name, "i");

var onSpeak = function(data) {
  console.log("Someone spoke.");

  if(data.text.match(myNameAtBeginning)) {
    onSpokenTo(data);
  }

  else if(data.text.match(myNameAnywhere)) {
    delay(onMentioned);
  }
};

bot.on("speak", onSpeak);

