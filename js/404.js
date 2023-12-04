const images = [
    "hess1.png",
    "hess2.jpg",
    "hess3.png",
    "hess4.png",
    "hess5.jpg",
    "hess6.png",
    "hess7.jpg",
    "hess8.jpg",
    "hess9.png",
    "hess10.png",
    "hess11.png",
    "hess12.jpg",
    "hess13.jpg",
    "hess14.png",
    "hess15.png",
];

const colorComplement = {
	0: "#62391d",
	5:"#60ACDD",
	6:"#F6931E",
	14:"#6EA9D6",
	13: "#C5E9F5",
};

function getImgUrl(imageName) {
    return "//hessvacio.com/img/hess/" + imageName;
}

function getRandomImg () {
    return images[Math.floor(Math.random() * images.length)];
}

function getFullPath () {
    return getImgUrl(this.getRandomImg());
}

function ChangeUrl () {
    console.log("change url");
    const photo = getFullPath();
    console.log(photo);
    document.getElementById("random-h").src = photo;
}

ChangeUrl();
