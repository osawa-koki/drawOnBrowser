"use strict";

const [canvas, colorBoxes, redo, undo] = getElm(["canvas", "colorBoxes", "redo", "undo"]);
const ctx = canvas.getContext("2d");

const env = {
	color: "red",
	bold: 5,
	isClicking: false,
	pointsTracer: [],
};


(() => {
	const [onBlack, onWhite] = mkElm(["div", "div"]);
	onBlack.style.backgroundColor = "black";
	onWhite.style.backgroundColor = "white";
	const elms = [onBlack, onWhite];
	looper(elms, elm => elm.addEventListener("click", setColor));
	append(elms, colorBoxes);
})();
looper(fromAtoB(0, 340, 15, false), (i, _) => {
	const [colorElm] = mkElm(["div"]);
	colorElm.style.backgroundColor = `hsla(${i}, 100%, 50%, 1)`;
	colorElm.addEventListener("click", setColor);
	colorBoxes.appendChild(colorElm);
});

function setColor() {
	removeClassifiedItems("selected");
	this.classList.add("selected");
	env.color = this.style.backgroundColor;
}


function moveStart() {
	env.isClicking = true;
	ctx.fillStyle = env.color;
}
function moveEnd() {
	env.isClicking = false;
	drawLine();
}

function drawLine() {
	ctx.beginPath();
	ctx.lineWidth = env.bold;
	ctx.strokeStyle = env.color;
	looper(env.pointsTracer, (points, _) => {
		ctx.lineTo(points[0], points[1]);
	});
	env.pointsTracer.splice(0);
	ctx.stroke();
}

canvas.addEventListener("mousedown", moveStart);
canvas.addEventListener("mouseup", moveEnd);
canvas.addEventListener("mouseleave", moveEnd);

canvas.addEventListener("mousemove", function(event) {
	if (!env.isClicking) return;

	const clickX = event.pageX;
	const clickY = event.pageY;

	const clientRect = this.getBoundingClientRect();
	const positionX = clientRect.left + window.pageXOffset;
	const positionY = clientRect.top + window.pageYOffset;

	const x = clickX - positionX;
	const y = clickY - positionY;

	env.pointsTracer.push([x, y]);
    drawPoint(x, y);
});


function drawPoint(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, env.bold / 2, 0, 2 * Math.PI, false);
	ctx.fill();
}

