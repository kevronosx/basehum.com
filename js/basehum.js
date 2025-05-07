function RandomBackground() {
  this.elem = null;
  this.list = null;
}

RandomBackground.prototype = {
  init: function(elem, options) {
    this.elem = elem;
    this.bgElem = document.querySelector(this.elem);
    this.list = options.list;
    this.setBG();
  },

  setBG: function() {
    this.bgElem.style.backgroundImage = "url('" + this.randomUrl() + "')";
  },

  randomUrl: function() {
    return this.list[Math.floor(Math.random() * this.list.length)];
  }
};

function App() {
  this.name = "Basehum";
  this.bg = new RandomBackground();
}

App.prototype = {

  init: function() {
    this.bg.init('.background-shell', {
      list: [
        './img/backgrounds/dark.jpg',
        './img/backgrounds/last_line_crazy.gif',
        './img/backgrounds/needle_blur_small.jpg',
        './img/backgrounds/25969337231_429703919d_k.jpg',
        './img/backgrounds/26325699563_abcc18d161_b.jpg',
        './img/backgrounds/27000976556_fb0b63f131_b.jpg',
        './img/backgrounds/27311863245_3070133290_b.jpg',
      ]
    });
    // this.crossFade();
  },

  crossFade: function() {
    setInterval(function() {
      this.bg.setBG();
    }.bind(this), 3000);
  }

};

var app = new App();
app.init();
