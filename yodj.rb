require 'turntabler'

AUTH = 'OZGXQyiXskjmsebvbYbEIRkO' #ENV['TT_AUTH']
USER_ID = '50d59421eb35c14a2be160d2' #ENV['TT_USERID']
ROOM_ID = '50d594afeb35c14a2be160da' #ENV['TT_ROOMID']
EMAIL = 'yodj@hentzia.com'
PASSWORD = '11grav28'
REPLY_DELAY = 1000

module YoDJ
  module Bot
    class << self
      attr_accessor :name

      # TODO: define events (room actions) as well as commands (spoken)

      def start(client)
        @client = client
        handle_commands
      end

      def commands
        @commands ||= []
      end

      def handle_commands
        @client.on(:user_spoke) do |msg|
          # sleep REPLY_DELAY
          if msg.content =~ name
            commands.each do |command|
              command.call(msg) if msg.content =~ command.text
            end
          end
        end
      end

      def behavior(&block)
        Behavior.new(self).instance_eval(&block)
      end

      def say(something)
        @client.room.say(something)
      end
    end

    class Behavior
      attr_accessor :bot

      def initialize(the_bot)
        @bot = the_bot
      end

      def name(name)
        bot.name = name
      end

      def command(text, &block)
        bot.commands << Command.new(text, block)
      end
    end
  end

  class Command < Struct.new(:text, :action)
    def call(msg)
      action.call(msg)
    end
  end
end

YoDJ::Bot.behavior do
  name /smarts/i

  command /hi/i do |msg|
    bot.say "Hi, #{msg.sender}!"
  end
end

Turntabler.run do
  client = Turntabler::Client.new(EMAIL,
                                  PASSWORD,
                                  user_id: USER_ID,
                                  auth: AUTH,
                                  room: ROOM_ID)
  YoDJ::Bot.start(client)
end

  # client.on(:user_spoke) do |msg|
  #   if msg =~ /^@?bucky/i

  #     f(data.text.match(/add (this|my) song/i)) {
  #     reply(function() {
  #       bot.speak("I will. I love this song.");
  #       bot.bop();
  #       bot.playlistAll(function(playlist) {
  #         console.log(playlist);
  #         var song = data.room.metadata.current_song;
  #         bot.playlistAdd(song._id, playlist.list.length);
  #         // console.log("Added " + song.metadata.song + "to my queue");
  #         console.log(playlist)
  #       });
  #       bot.snag(); // shows the heart
  #     });
  #   }

  #   else if(data.text.match(/get (you're ass )?up t?here/i)) {
  #     reply(function() {
  #       bot.speak("3 2 1 let's jam");
  #       bot.addDj();
  #       console.log("Started DJ'ing");
  #     });
  #   }

  #   else if(data.text.match(/(get|step) down/i)) {
  #     reply(function() {
  #       bot.speak("As you wish.");
  #       bot.remDj(config.user_id);
  #       console.log("Stopped DJ'ing");
  #     });
  #   }

  #   else if(data.text.match(/awesome (this|my) song/i)) {
  #     reply(function() {
  #       bot.speak("I was just about to!");
  #       bot.bop();
  #       console.log("Awesome song is awesome.");
  #     });
  #   }

  #   else {
  #     reply(function() {
  #       bot.speak("Mhmm... Mhmm... I know some of those words.");
  #     });
  #   }
  # }

  # // bucky appears in line but not at the beginning
  # else if(data.text.match(/bucky/)) {
  #   reply(function() {
  #     bot.speak("You talking to me...?");
  #   });
  # }
# });

