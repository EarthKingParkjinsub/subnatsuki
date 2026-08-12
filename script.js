const heartButton = document.getElementById("heartButton");

heartButton.addEventListener("click", () => {

    // 너무 한꺼번에 터지지 않도록 30개
    for (let i = 0; i < 200; i++) {

        setTimeout(() => {
            createHeart();
        }, i * 80);

    }
});


function createHeart() {

    const heart = document.createElement("div");

    heart.classList.add("heart");
    heart.innerText = "❤️";

    // 화면의 랜덤 위치에서 시작
    heart.style.left = Math.random() * 100 + "vw";

    // 크기도 조금씩 다르게
    heart.style.fontSize =
        18 + Math.random() * 22 + "px";

    // 떨어지는 속도
    heart.style.animationDuration =
        4 + Math.random() * 3 + "s";

    // 좌우로 흔들리는 정도
    heart.style.setProperty(
        "--move1",
        randomMove() + "px"
    );

    heart.style.setProperty(
        "--move2",
        randomMove() + "px"
    );

    heart.style.setProperty(
        "--move3",
        randomMove() + "px"
    );

    heart.style.setProperty(
        "--move4",
        randomMove() + "px"
    );

    document.body.appendChild(heart);

    // 애니메이션 끝나면 삭제
    setTimeout(() => {
        heart.remove();
    }, 7500);
}


function randomMove() {

    // -80px ~ +80px
    return Math.random() * 160 - 80;

}