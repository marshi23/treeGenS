let windFactor = 1.0;

function Branch(len, s, rotRange) {
  this.len = len;
  this.s = s;
  this.rot = radians(random(-rotRange, rotRange));

  stroke(255, 204, 0);
  strokeWeight(4);
  line(0,0,0, -this.len);
  translate(0,-this.len);

  if (this.s > 0) {
    let bcoef = angle/branches;

    for (let i = 1; i <= branches; i++) {

      push();
      rotate(i*bcoef);
      new Branch(this.len*coef, this.s-1);
      pop();

      push();
      rotate(-i*bcoef);
      new Branch(this.len*coef, this.s-1);
      pop();
  }
}

windFactor = random(0.2, 1);
  // this.show = function() {
  //   stroke(255, 204, 0);
  //   strokeWeight(3);
  //   line(0,0,0, -this.len);
  //   translate(0,-this.len);
  //
  // }

}
