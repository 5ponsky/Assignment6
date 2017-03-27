
// ******************************
// ******* Random ****************
// ******************************

function intRandom(max) {
  return Math.random() * max;
}

function boolRandom() {
  if(Math.random() > 0.5)
    return true;
  else
    return false;
}



// ******************************
// ******* Cloud ****************
// ******************************

function Cloud() {
  this.x_pos = 575;
  this.y_pos = 0;

  try {
    if(cloud_image === null) {
      cloud_image = new Image();
      cloud_image.src = "cloud.png";
    }
  } catch (e) {
    console.log(e);
  }
}

// Return false because a "Cloud" isn't a "Tube"
Cloud.prototype.isTube = function () { return false; };

// Return x_pos or y_pos
Cloud.prototype.xPos = function() { return x_pos; };
Cloud.prototype.yPos = function() { return y_pos; };

Cloud.prototype.update = function () {
  this.x_pos = this.x_pos - 2;

  if(this.x_pos < -501) {
    this.x_pos = 501;
    this.y_pos = intRandom(250) + 50; // FIx
  }
};



// ******************************
// ******* Hand ****************
// ******************************

function Hand(bird) {
  this.bird = bird;
  this.gotcha = false;
  this.x_pos = 10;
  this.y_pos = 550;

  try {
    if(open_hand === null) {
      open_hand = new Image();
      open_hand.src = "hand1.png";
    }

    if(closed_hand === null) {
      closed_hand = new Image();
      closed_hand.src = "hand2.png";
    }

  } catch(e) {
    console.log(e);
  }
}

Hand.prototype.update = function () { grab(); };

Hand.prototype.grab = function () {
  this.x_pos = bird.x_pos + 5;
  if(bird.energy <= 0) {
    if(this.y_pos > bird.y_pos - 15 && this.y_pos < bird.y_pos + 15) {
      this.gotcha = true;
      this.y_pos = this.y_pos + 3;
      bird.y_pos = this.y_pos;
    } else {
      this.y_pos = this.y_pos - 5;
    }
  }
};




// ******************************
// ******* Tube ****************
// ******************************

function Tube() {
  this.gravity = -4.5;
  this.x_pos = 555;
  this.y_pos = 0;
  this.isKicked = false;
  this.tubeUpwards = false;

  try {
    if(tube_up_image === null) {
      tube_up_image = new Image();
      tube_up_image.src = "tube_up.png";
    }

    if(tube_down_image === null) {
      tube_down_image = new Image();
      tube_down_image.src = "tube_down.png";
    }

  } catch(e) {
    console.log(e);
  }

  this.tubeUpwards = true;

  if(this.tubeUpwards) {
    this.y_pos = 0;
  } else {
    this.y_pos = 1;
  }
}

Tube.prototype.update = function () {
  if(this.isKicked) {
    this.x_pos = this.x_pos + this.xVel;
    this.gravity = this.gravity + 0.4;
    this.y_pos = this.y_pos + this.gravity;
  } else
    this.x_pos = this.x_pos - 6;

  if(this.x_pos < -56)
    return true;
  return false;
};

Tube.prototype.beenHit = function (x) {
  this.xVel = x;

// Fire off if the tube hasn't been hit until now
  if(!this.isKicked) {
    this.isKicked = true;
    return false;
  }
  return true;
};


// ******************************
// ******* Bird ****************
// ******************************

function Bird(model) {
  this.model = model;
  this.flapped = false;
  this.gravity = -6.5;
  this.x_pos = 10;
  this.y_pos = 250;
  this.energy = 100;

  try {
    if(bird_image_up === null) {
      bird_image_up = new Image();
      bird_image_up.src = "bird1.png";
    }

    if(bird_image_down === null) {
      bird_image_down = new Image();
      bird_image_down.src = "bird2.png";
    }
  } catch(e) {
    console.log(e);
  }
}

Bird.prototype.update = function () {

  // Allow the bird to recharge energy so long as it has more than 0,
  // and cap the energy at 100
  if(this.energy > 0) {
    this.energy += 1;

    this.gravity = this.gravity + 0.4;
    this.y_pos = this.y_pos + this.gravity;
    --this.flapCounter;

    if(loseEnergy() && this.allowDamageWhenZero <= 0) {
      this.energy = this.energy - 65;
      this.allowDamageWhenZero = 25;
    }
    --this.allowDamageWhenZero;

    // Keep the energy levels from going out of bounds
    if(this.energy > 100)
      this.energy = 100;
    } else if (this.energy < 0)
      this.energy = 0;

    // Simulate a game "ceiling"
    if(this.y_pos < 0) {
      this.y_pos = 0;
      this.gravity = 0;
    }

    return false;
};

Bird.prototype.flap = function () {
  if(this.energy > 0) {
    this.gravity = this.gravity - 4.5;
    this.y_pos = this.y_pos - this.gravity;
    this.flapCounter = 3;
  } else
    this.energy = 0;
};

Bird.prototype.loseEnergy = function () {
  // While each thing in the list doesn't return a collision
};



// ******************************
// ******* Chuck ****************
// ******************************


function Chuck(model) {
  this.model = model;
  this.x_pos = -100;
  this.y_pos = (intRandom(175) + 250);
  this.gravity = (intRandom(14) - 15.5);
  this.xVel = (intRandom(4) + 11.0);

  try {
    if(chuck_image === null)
      chuck_image = new Image();
      chuck_image.src = "chuck_norris.png";
  } catch(e) {
    //e.printStackTrace(System.err);
  }
}

Chuck.prototype.update = function () {

  // Simulate gravity
  this.gravity = this.gravity + 0.2;
  this.y_pos = this.y_pos + this.gravity;

  this.x_pos = this.x_pos + this.xVel;

  if(judoKick()) {
    this.gravity = -4.5;
    this.xVel = -this.xVel;
  }

  if(x_pos > 585 || y_pos > 510)
    return true;
  return false;
};

Chuck.prototype.judoKick = function () {
  for (var s in sprites) {
    if(s.isTube()) {
      if(collisionBetween(this, s)) {

        // If the tube has already been hit, return false
        // as we want nothing to collide with a "dead" tube
        if(s.beenHit(xVel))
          return false;
        return true;
      }
    }
    // if (object.hasOwnProperty(s)) { }
  }
};



// ******************************
// ******* Model ****************
// ******************************

// Model Constructor
function Model() {
  this.addTubeWhenZero = 45;
  this.maximumTubes = 0;
  this.bird = new Bird(this);
  this.hand = new Hand(this.bird);
  this.cloud = new Cloud();
  this.tube = new Tube();
  this.sprites = []; // We might need a linnked list instead

  this.sprites.push(this.cloud);
  this.sprites.push(this.bird);
  this.sprites.push(this.hand);
}

// Update the model
Model.prototype.update = function () {

  // Iterate the list of sprites
  for (var s in this.sprites) {
    console.log(s);
    if(s.update()) {

    }
    //if (sprites.hasOwnProperty(s)) { }
  }

  // If enough time has passed, and we don't have too many tubes,
  // add one and reset the timer
  if(this.addTubeWhenZero <= 0 && this.maximumTubes < 4) {
    t = new Tube();
    this.sprites.add(this.t);
    addTubeWhenZero = 45;
  }
  --addTubeWhenZero;

  if(this.bird.y_pos > 501) {
    console.log("GAME OVER");
  }
};

// flap yo wings
Model.prototype.onClick = function () {
  this.bird.flap();
};

// send in the Don
Model.prototype.sendChuck = function () {
  this.chuck = new Chuck(this);
  // add a chuck to the sprite list
  this.bird.energy -= 30;
};


// ******************************
// ******* View ****************
// ******************************


// View Constructor
function View(controller, model) {
  this.controller = controller;
  this.model = model;
  this.canvas = document.getElementById("myCanvas");
}

// Update the screen
View.prototype.update = function () {
  // Draw window and background (?)
  let ctx = this.canvas.getContext("2d");
  ctx.clearRect(0, 0, 500, 500);

  // Draw Sprites
  ctx.drawImage(this.turtle, this.model.x_pos, this.model.y_pos);
  /*
  while(not at end of list)
    get the next sprite
    draw that sprite
  */

  // Draw energy bar
  ctx.setColor(new Color(0, 255, 0));
  ctx.fillRect(425, 200, 75, 2 * model.bird.energy);
  ctx.setColor(new Color(0, 0, 0));
  ctx.drawRect(424, 199, 76, 201);
};


// ******************************
// ******* Controller ****************
// ******************************


function Controller(model, view) {
  this.model = model;
  this.view = view;
  let self = this;
  //var pageLoaded = document.getElementById("panel");
  if(view.canvas) {
    view.canvas.addEventListener("click", function(event) {
      self.onClick(event);
    });
    view.canvas.addEventListener("right click", function(event) {
      self.onContextMenu(event);
    });
  }
}

Controller.prototype.onClick = function (event) {
  this.model.onClick();
};

Controller.prototype.onContextMenu = function (event) {
  this.model.sendChuck();
};



// ******************************
// ******* Game ****************
// ******************************




function Game() {
  this.model = new Model();
  this.view = new View(this.model);
  this.controller = new Controller(this.model, this.view);
}

Game.prototype.onTimer = function () {
  this.model.update();
  this.view.update();
};

// So the story goes...
let game = new Game();
let timer = setInterval(function() {
  game.onTimer();
}, 40);
