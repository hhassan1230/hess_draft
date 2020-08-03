var images = [
	"hess1.png",
	"hess2.jpg",
	"hess3.png",
	"hess4.png",
	"hess5.jpg",
	"hess6.png",
	"hess7.jpg",
	"hess8.png",
	"hess9.png",
	"hess10.png",
];

var getImgUrl = function(imageName)
{
	return "./img/hess/" + imageName;
}

var getRandomImg = function () {
	return images[Math.floor(Math.random() * images.length)]
}

var getFullPath = function () {
	return getImgUrl(getRandomImg());
}

var ChangeUrl = function () {
	var imgElement = document.getElementById("random-h");
	imgElement.src = getFullPath();
}

ChangeUrl();