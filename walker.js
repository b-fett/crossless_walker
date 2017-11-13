var decarts = [[210, 170], [190, 160], [30, 150], [80, 140], [120, 140], [150, 110], [120, 120], [120, 100], [90, 90], [70, 70], [160, 70], [130, 50], [50, 30], [150, 20], [140, 90]]

var dots = {
	count: 10,
	minX: 10,
	maxX: 100,
	minY: 10,
	maxY: 100,
	rnd: function(min, max) {
		return Math.round(min + Math.random() * (max - min));
	},
	init: function(decarts) {
		this.array = [];
		if (decarts) {
			for (var i in decarts) {
				this.array.push({
					i: i*1,
					x: decarts[i][0],
					y: decarts[i][1]
				});
			}
		}
		else {
			for (var i = 0; i < this.count; i++) {
				this.array.push({
					i: i*1,
					x: this.rnd(this.minX, this.maxX),
					y: this.rnd(this.minY, this.maxY)
				});
			}
		}
	},
};

var viewport = {
	left: -200,
	right: 400,
	up: 400,
	down: -200,
	get width() {
		return this.right - this.left;
	},
	get height() {
		return this.up - this.down;
	},
	getX: function (x) {
		return x - this.left;
	},
	getY: function (y) {
		return this.up - y;
	}
}

dots.init(decarts);

var NB = dots.array[0];
for (var i in dots.array) {
	if (NB.x > dots.array[i].x)
		NB = dots.array[i];
}

for (var i in dots.array) {
	var x = dots.array[i].NBx = dots.array[i].x - NB.x;
	var y = dots.array[i].NBy = dots.array[i].y - NB.y;
	dots.array[i].NBradius = Math.sqrt(x * x + y * y);
	dots.array[i].NBangle = Math.atan2(y, x);
}
dots.array.splice(NB.i, 1);

dots.array.sort(function(dot1, dot2) {
	if (dot1.NBangle == dot2.NBangle)
		return dot1.NBradius - dot2.NBradius;
	else
		return dot1.NBangle - dot2.NBangle;
});

dots.array.unshift(NB);

var svg = document.getElementById("svgsheet");

svg.setAttribute('width', viewport.width);
svg.setAttribute('height', viewport.height);

var xAxis = document.createElementNS(svg.namespaceURI, 'polyline');
xAxis.setAttribute('points', '0, ' + viewport.up + ' ' + (viewport.right - viewport.left) + ', ' + viewport.up );
xAxis.setAttribute('fill', 'none');
xAxis.setAttribute('stroke', '#000');
xAxis.setAttribute('stroke-width', '1');
svg.appendChild(xAxis);

var yAxis = document.createElementNS(svg.namespaceURI, 'polyline');
yAxis.setAttribute('points', (-viewport.left) + ', 0 ' + (-viewport.left) + ', ' + (viewport.up - viewport.down));
yAxis.setAttribute('fill', 'none');
yAxis.setAttribute('stroke', '#000');
yAxis.setAttribute('stroke-width', '1');
svg.appendChild(yAxis);




var polyline = document.createElementNS(svg.namespaceURI, 'polyline');
polyline.setAttribute('points', (function() {
	var s = '';
	for (var i in dots.array) {
		s += viewport.getX(dots.array[i].x) + ', ' + viewport.getY(dots.array[i].y) + " ";
	}
	s += viewport.getX(dots.array[0].x) + ', ' + viewport.getY(dots.array[0].y) + " ";
	return s;
})());
polyline.setAttribute('fill', 'none');
polyline.setAttribute('stroke', '#000');
polyline.setAttribute('stroke-width', '1');
svg.appendChild(polyline);

for (var i in dots.array) {
	var circle = document.createElementNS(svg.namespaceURI, 'circle');
	circle.setAttribute('cx', viewport.getX(dots.array[i].x));
	circle.setAttribute('cy', viewport.getY(dots.array[i].y));
	circle.setAttribute('r', '2.4');
	circle.setAttribute('fill', dots.array[i] == NB ? '#00ff00':'#ED6E46');
	circle.setAttribute('stroke', 'rgba(255,255,255,1)');
	circle.setAttribute('stroke-width', '1px');
	svg.appendChild(circle);
}