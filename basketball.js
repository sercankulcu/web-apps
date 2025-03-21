const titleElement = document.getElementById('title');
titleElement.addEventListener('click', function () {
  if (window.parent !== window) {
    window.parent.showMainContent();
  } else {
    window.location.href = 'index.html';
  }
});

const infoButton = document.getElementById('infoButton');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('closeButton');

infoButton.addEventListener('click', () => {
  overlay.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  overlay.style.display = 'none';
});

document.addEventListener('click', () => {
  document.getElementById('initialMessage').style.display = 'none';
});

document.addEventListener("DOMContentLoaded", function (event) {

  window.onload = function () {

    var Vector = {
      _x: 1,
      _y: 0,

      create: function (x, y) {
        var obj = Object.create(this);
        obj.setX(x);
        obj.setY(y);
        return obj;
      },

      setX: function (value) {
        this._x = value;
      },

      getX: function () {
        return this._x;
      },

      setY: function (value) {
        this._y = value;
      },

      getY: function () {
        return this._y;
      },

      setAngle: function (angle) {
        var length = this.getLength();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
      },

      getAngle: function () {
        return Math.atan2(this._y, this._x);
      },

      setLength: function (length) {
        var angle = this.getAngle();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
      },

      getLength: function () {
        return Math.sqrt(this._x * this._x + this._y * this._y);
      },

      add: function (v2) {
        if (v2) {
          return Vector.create(this._x + v2.getX(), this._y + v2.getY());
        } else {
          return Vector.create(this._x, this._y);;
        }
      },

      subtract: function (v2) {
        return Vector.create(this._x - v2.getX(), this._y - v2.getY());
      },

      scale: function (value) {
        return Vector.create(this._x * value, this._x * value);
      }
    };

    // A Particle
    var Particle = {
      position: null,
      velocity: null,
      gravity: null,

      create: function (x, y, speed, direction, grav) {
        var obj = Object.create(this);
        obj.position = Vector.create(x, y);
        obj.velocity = Vector.create(0, 0);
        obj.velocity.setLength(speed);
        obj.velocity.setAngle(direction);
        obj.gravity = Vector.create(0, grav || 0);

        return obj;
      },

      accelerate: function (vector) {
        this.velocity = this.velocity.add(vector);
      },

      update: function () {
        this.velocity = this.velocity.add(this.gravity);
        this.position = this.position.add(this.velocity);
      }
    };

    // Ball and basket vars
    var ball = document.getElementById("ball"),
      offsetY,
      ballRadius,
      basket = document.getElementById("basket"),
      basketWidth,
      ratio,
      scale,
      w,
      h;

    // Motion vars
    var p,
      start,
      force,
      timestamp = null,
      lastMouse,
      hasThrown = false,
      highEnough = false,
      lastY,
      rot;

    // Score vars
    var score = 0;

    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    resize();

    // Wait a second before fading the elements in to prevent a flash of unpositioned/unstyled content
    TweenMax.to(".stage", 1, { autoAlpha: 1, delay: 1 });

    function addEvents() {
      ball.addEventListener("mousedown", grabBall);
      ball.addEventListener("touchstart", grabBall);
      ball.addEventListener("mouseup", releaseBall);
      ball.addEventListener("touchend", releaseBall);
    }

    function removeEvents() {
      ball.removeEventListener("mousedown", grabBall);
      ball.removeEventListener("touchstart", grabBall);
      ball.removeEventListener("mouseup", releaseBall);
      ball.removeEventListener("touchend", releaseBall);
    }

    function resize() {
      removeEvents();
      addEvents();

      offsetY = ball.getBoundingClientRect().height * 1.75;

      // Find the smallest value of the SVG holding the basketball - it will give us the ball's radius
      ballRadius = Math.min(ball.getBoundingClientRect().width, ball.getBoundingClientRect().height);
      basketWidth = Math.round(basket.querySelector("rect").getBoundingClientRect().width);

      // Work out how the ratio between the basket's width and the ball's radius, make it a tiny smaller just for safety
      ratio = basketWidth / ballRadius - 0.2;

      w = window.innerWidth;
      h = window.innerHeight;

      // Make sure the basketball has no previous GSAP's transforms on it
      TweenMax.set(ball, { clearProps: "all" });

      // Move the basketball to its starting offset
      TweenMax.set(ball, { y: "+=" + offsetY }); // We need a number rather than a percentage to use later with collision calculation.

      scale = TweenMax.to(ball, 0.5, { scale: ratio, ease: Power1.easeInOut }).progress(1).pause(0);
    }

    function tick() {
      var currY = p.position.getY();
      var currX = p.position.getX();

      if (hasThrown) {
        if (currY < 0) highEnough = true;

        // Has the ball been thrown high enough
        if (highEnough) {
          // Is it falling?
          if (lastY < currY && force.getLength() > 15) {
            basket.style.zIndex = 1;

            // Has it hit the basket
            if (currY < 10 && currY > -10) {
              hasThrown = false;

              // Was it on target?
              if (currX > basketWidth * 0.15 && currX < basketWidth || currX < -basketWidth * 0.15 && currX > -basketWidth) {

                // Create an opposite force angled in relation to the basket
                force.setX(currX / 6);
                force.setLength(force.getLength() * 0.7);
                p.velocity = force;

                basket.style.zIndex = 0;
              } else if (currX <= basketWidth && currX >= -basketWidth) {
                // Yes
                score += 2;
                // Three pointer?
                if (force.getX() > 2 || force.getX() < -2) {
                  score += 1;
                }

                TweenMax.to("#net", 0.5, { scaleY: 1.4, transformOrigin: "50% 0", ease: Elastic.easeOut });
                TweenMax.to("#net", 0.6, { scale: 1, transformOrigin: "50% 0", ease: Power2.easeInOut, delay: 0.6 });
              }
            }
          }
        }
      }

      p.update();
      TweenMax.set(ball, {
        x: p.position.getX(),
        y: currY,
        rotation: rot
      });

      lastY = currY;
    }

    function grabBall(e) {
      p = Particle.create(0, offsetY, 0, 0, 0);
      force = Vector.create(0, 0);
      start = Vector.create(getMouse(e).x, getMouse(e).y - offsetY);

      document.addEventListener("mousemove", moveBall);
      document.addEventListener("touchmove", moveBall);
    }

    function moveBall(e) {
      getSpeed(e);

      // Update the ball's position
      TweenMax.set(ball, { x: p.position.getX(), y: p.position.getY() });
    }

    function releaseBall() {
      // Stop tracking the mousedown/touchdown
      ball.removeEventListener("mousedown", grabBall);
      ball.removeEventListener("touchstart", grabBall);
      // Stop tracking the mousemove
      document.removeEventListener("mousemove", moveBall);
      document.removeEventListener("touchmove", moveBall);
      // Reset the mouse tracking defaults
      timestamp = null;
      lastMouseX = null;
      lastMouseY = null;

      hasThrown = true;

      scale.play(0);

      // Limit how hard the ball can be thrown. Improves user accuracy diminishes realistic movement
      if (force.getLength() > 30) force.setLength(30);
      p.velocity = force;
      p.gravity = Vector.create(0, 0.7);

      if (force.getX() > 0) {
        rot = "-=4";
      } else {
        rot = "+=4";
      }

      // Start GSAP's tick so more physics-like movement can take place
      TweenMax.ticker.addEventListener("tick", tick);

      // Stop it after some period of time - saves having to write edges and floor logic and the user can shoot every three seconds or so
      TweenMax.delayedCall(2, reset);
    }

    function reset() {
      TweenMax.ticker.removeEventListener("tick", tick);

      p.gravity = 0;

      hasThrown = false;
      highEnough = false;

      basket.style.zIndex = 0;

      ball.addEventListener("mousedown", grabBall);
      ball.addEventListener("touchstart", grabBall);

      updateScore();

      TweenMax.to(ball, 1, {
        x: 0,
        y: offsetY,
        scale: 1,
        rotation: 0,
        ease: Power3.easeOut
      });
    }

    function getMouse(e) {
      return {
        x: e.clientX || e.targetTouches[0].clientX,
        y: e.clientY || e.targetTouches[0].clientY
      };
    }

    function getSpeed(e) {
      if (timestamp === null) {
        timestamp = Date.now();
        lastMouse = getMouse(e);
        return;
      }

      var now = Date.now(),
        currMouse = getMouse(e),
        dx = currMouse.x - lastMouse.x,
        dy = currMouse.y - lastMouse.y;

      // Let's make the angle less steep
      dy *= 2;
      dx /= 2;

      timestamp = now;
      lastMouse = currMouse;

      force = Vector.create(dx, dy);
      p.position.setX(getMouse(e).x - start.getX());
      p.position.setY(getMouse(e).y - start.getY());
    }

    function updateScore() {
      document.getElementById('score-display').textContent = score.toString().padStart(3, '0');
    }
  };
});