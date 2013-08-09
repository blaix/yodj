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

var currentSong;

var onNewSong = function(data){
  currentSong = data.room.metadata.current_song;
};

var addSongToPlaylist = function(roomData){
  var currentSong = roomData.room.metadata.current_song;
  bot.playlistAll(function(playlist) {
    bot.playlistAdd(currentSong._id, playlist.list.length);
    console.log("Added " + currentSong.metadata.song + " to my queue");
  });
};

var addSongReplies = [
  "I will. I love this song.",
  "Will do.",
  "Hold on. Let me write that down.",
  "Can you remind me again later?",
  "I'll play it later, when I feel like it. GOSH!",
  "You don't know me! I'll play whatever I want to play! But I guess this song is okay."
];
var addSong = function(data) {
  bot.roomInfo(addSongToPlaylist);
  bot.speak();
  bot.bop();
  // show the heart:
  bot.snag();
};

var startSpinningReplies = [
  "3 2 1 let's jam",
  "Just call me Mr. Spinderella.",
  "Funky fresh beats, coming right up.",
  "Okay, but I'm not very good at this.",
  "Oooh. This chair is still warm.",
  "Well, if you insist.",
  "Somebody STOP ME!",
  "iz abot 2 br1ng teh 2nz"
];
var startSpinning = function(){
  bot.speak(startSpinningReplies.sample());
  bot.addDj();
  console.log("Started DJ'ing");
};

var stopSpinningReplies = [
  "As you wish.",
  "Fine. This room stinks anyway.",
  "Finally. My fingers are getting sore.",
  "Oh yeah!? You think you can do better?",
  "(yawn) I'm gonna go take a nap.",
  "Ok, sure. So, do we get paid by the hour, or...",
  "Yes, I have rocked the house sufficiently for now.",
  "Check you later, peeps."
];
var stopSpinning = function(){
  bot.speak(stopSpinningReplies.sample());
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
  "Let the booty shaking commence.",
  "This song is the bomb-diggity."
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

var startSpinningTriggers = [
  /get (you're ass )?up t?here/i,
  /have a seat/i,
  /step right up/i,
  /come on up here/i,
  /show (us|them) (what you|how)/i
];

var stopSpinningTriggers = [
  /(get|step) (down|off)/i,
  /shut.*up/i,
  /put a cork in it/i,
  /give it a rest/i,
  /spare us/i
];

var addSongTriggers = [
  /add (this|my) song/i,
  /play this later/i,
  /do you have this/i,
  /are you hearing this/i,
  /don't you love this/i,
  /remember this/i,
  /for later/i
];

var anyTriggerMatches = function(triggers, text){
  console.log("Checking triggers", triggers);
  return triggers.any(function(trigger){
    console.log("Matching:", text, trigger);
    return text.match(trigger);
  });
};

var onSpokenTo = function(data){
  console.log("@" + data.name + " is talking to me.");

  if(anyTriggerMatches(addSongTriggers, data.text)) {
    delay(addSong, data);
  }

  else if(anyTriggerMatches(startSpinningTriggers, data.text)) {
    delay(startSpinning, data);
  }

  else if(anyTriggerMatches(stopSpinningTriggers, data.text)) {
    delay(stopSpinning, data);
  }

  else if(anyTriggerMatches(bopTriggers, data.text)) {
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
  "What time is it? I should probably be getting home."
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
bot.on("newsong", onNewSong);
