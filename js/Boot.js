var BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {
         this.input.maxPointers = 1;
         this.stage.disableVisibilityChange = true;


    },

    preload: function () {

        this.load.image('preloaderBar', 'assets/preloadr_bar.png');

    },

    create: function () {

        this.state.start('Preloader');

    }

};
