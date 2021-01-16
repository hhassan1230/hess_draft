var $buttons = $(".newPic");
var startY = 0;
var initTimeline = new TimelineMax({ onComplete: createDragger, delay: -10 });

initTimeline.to("#dragger", 1, { x: 1000 });
initTimeline.to("#theSquare", 1, { attr: { x: 50 } }, 0);

$buttons.click(slide);
// $buttons. //(slide);

function slide() {
    var butIndex = $buttons.index($(this));
    var newY = butIndex * 700;
    if (newY === startY || TweenMax.isTweening(".allPics")) {
        return;
    } else {
        TweenMax.to(".allPics", 1, { y: -newY });
        TweenMax.to(".allCaptions", 1, { y: -newY / 7 });
        startY = newY;
    }
}

function createDragger() {
    Draggable.create("#dragger", {
        type: "x",
        bounds: {
            minX: -75,
            maxX: 992
        },
        throwProps: true,
        edgeResistance: 1,
        onDrag: moveMask,
        onThrowUpdate: moveMask
    });
}

function moveMask() {
    TweenMax.set("#theSquare", { attr: { x: this.x - 950 } });
}