//shim
require("document-register-element");

//element setup
var template = require("./_template.html");
require("./image-slider.less");

var proto = Object.create(HTMLElement.prototype);

proto.createdCallback = function() {

  var images = this.querySelectorAll("img");
  this.innerHTML = template();
  this.querySelector(".first").appendChild(images[0]);
  this.querySelector(".second").appendChild(images[1]);
  images[0].setAttribute("draggable", "false");
  images[1].setAttribute("draggable", "false");

  var first = this.querySelector(".first");
  var container = this;

  var resizeable = function(e) {
    e.preventDefault();
    var bounds = e.target.getBoundingClientRect();
    var x;
    if (e.touches) { 
      x = e.touches[0].pageX - bounds.left;
    } else { 
      x = e.pageX - bounds.left;
    }
    first.style.width = x + "px";
  };

  first.addEventListener("mousedown", function(e) {
    e.preventDefault();
    container.addEventListener("mousemove", resizeable);
  });
  first.addEventListener("touchstart", function(e) {
    e.preventDefault();
    container.addEventListener("touchmove", resizeable);
  });
  container.addEventListener("mouseup", function() {
    container.removeEventListener("mousemove", resizeable);
  });
  container.addEventListener("touchend", function() {
    container.removeEventListener("touchmove", resizeable);
  });

  var resize = function() {
    var width = container.getBoundingClientRect().width;
    container.querySelector(".first img").style.maxWidth = width + "px";
  };
  
  resize();
  window.addEventListener('resize', resize);

  images.forEach(function(img) {
    img.addEventListener("load", resize);
  });

};

proto.attachedCallback = function() {};
proto.detachedCallback = function() {};
proto.attributeChangedCallback = function() {};

try {
  document.registerElement("image-slider", { prototype: proto });
} catch (e) {
  console.error("<image-slider> has already been registered.")
}