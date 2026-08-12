/* =============================
   사진 클릭 → 이미지 뷰어
============================= */

const photoCards =
    document.querySelectorAll(".photo-card");

const lightbox =
    document.getElementById("lightbox");

const lightboxArea =
    document.getElementById("lightboxArea");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeLightbox =
    document.getElementById("closeLightbox");


let scale = 1;

let positionX = 0;
let positionY = 0;

let isDragging = false;

let startX = 0;
let startY = 0;


/* =============================
   사진 클릭
============================= */

photoCards.forEach((card) => {

    card.addEventListener("click", () => {

        const image =
            card.querySelector("img");

        lightboxImage.src =
            image.src;

        resetViewer();

        lightbox.classList.add("open");

        document.body.style.overflow =
            "hidden";

    });

});


/* =============================
   이미지 뷰어 닫기
============================= */

closeLightbox.addEventListener(
    "click",
    closeViewer
);


/* 검은 배경 클릭 */

lightboxArea.addEventListener(
    "click",
    (event) => {

        if (
            event.target === lightboxArea
        ) {

            closeViewer();

        }

    }
);


/* ESC로 닫기 */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
            &&
            lightbox.classList.contains(
                "open"
            )
        ) {

            closeViewer();

        }

    }
);


function closeViewer() {

    lightbox.classList.remove("open");

    document.body.style.overflow = "";

}


/* =============================
   마우스 휠 확대 / 축소
============================= */

lightboxImage.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();


        if (event.deltaY < 0) {

            scale += 0.25;

        } else {

            scale -= 0.25;

        }


        /* 최소 1배, 최대 5배 */

        scale =
            Math.min(
                Math.max(scale, 1),
                5
            );


        /* 다시 1배가 되면 중앙 */

        if (scale === 1) {

            positionX = 0;
            positionY = 0;

        }


        updateTransform();

    },
    {
        passive: false
    }
);


/* =============================
   드래그 이동
============================= */

lightboxImage.addEventListener(
    "pointerdown",
    (event) => {

        /*
            확대하지 않은 상태에서는
            드래그 불가능
        */

        if (scale <= 1) {
            return;
        }


        isDragging = true;


        startX =
            event.clientX
            - positionX;

        startY =
            event.clientY
            - positionY;


        lightboxImage.classList.add(
            "dragging"
        );


        lightboxImage.setPointerCapture(
            event.pointerId
        );

    }
);


lightboxImage.addEventListener(
    "pointermove",
    (event) => {

        if (!isDragging) {
            return;
        }


        positionX =
            event.clientX
            - startX;

        positionY =
            event.clientY
            - startY;


        updateTransform();

    }
);


lightboxImage.addEventListener(
    "pointerup",
    stopDragging
);


lightboxImage.addEventListener(
    "pointercancel",
    stopDragging
);


function stopDragging() {

    isDragging = false;

    lightboxImage.classList.remove(
        "dragging"
    );

}


/* =============================
   더블클릭
============================= */

lightboxImage.addEventListener(
    "dblclick",
    () => {

        if (scale === 1) {

            scale = 2;

        } else {

            scale = 1;

            positionX = 0;
            positionY = 0;

        }


        updateTransform();

    }
);


/* =============================
   사진 transform
============================= */

function updateTransform() {

    lightboxImage.style.transform =
        `
        translate(
            ${positionX}px,
            ${positionY}px
        )
        scale(${scale})
        `;

}


/* =============================
   뷰어 초기화
============================= */

function resetViewer() {

    scale = 1;

    positionX = 0;
    positionY = 0;

    isDragging = false;

    lightboxImage.classList.remove(
        "dragging"
    );

    updateTransform();

}


/* ======================================
   하트 효과
====================================== */

const heartButton =
    document.getElementById(
        "heartButton"
    );

const heartMessage =
    document.getElementById(
        "heartMessage"
    );


/*
    아직 사라지지 않은 하트 +
    앞으로 생성될 하트까지 포함한 개수

    이게 0이 되면
    "안녕"을 사라지게 함
*/

let remainingHearts = 0;


/* =============================
   하트 버튼 클릭
============================= */

heartButton.addEventListener(
    "click",
    () => {

        /*
            버튼 위의 "안녕" 표시
        */

        heartMessage.classList.add(
            "show"
        );


        const heartCount = 100;


        /*
            앞으로 생성될 하트까지
            미리 카운트
        */

        remainingHearts += heartCount;


        /*
            하트 100개를
            조금씩 시간차를 두고 생성
        */

        for (
            let i = 0;
            i < heartCount;
            i++
        ) {

            setTimeout(
                createHeart,
                i * 90
            );

        }

    }
);


/* =============================
   하트 하나 생성
============================= */

function createHeart() {

    const heart =
        document.createElement("div");


    const hearts = [
        "❤️",
        "💕",
        "💗",
        "💖",
        "💓"
    ];


    heart.classList.add(
        "falling-heart"
    );


    /* 랜덤 종류 */

    heart.innerText =
        hearts[
        Math.floor(
            Math.random()
            * hearts.length
        )
        ];


    /* 화면 랜덤 위치 */

    heart.style.left =
        Math.random() * 100
        + "vw";


    /* 랜덤 크기 */

    heart.style.fontSize =
        (
            17
            + Math.random() * 20
        )
        + "px";


    /* 랜덤 낙하 속도 */

    const duration =
        4.5
        + Math.random() * 2.5;


    heart.style.animationDuration =
        duration + "s";


    /* 좌우 움직임 */

    heart.style.setProperty(
        "--move1",
        randomMove(60) + "px"
    );

    heart.style.setProperty(
        "--move2",
        randomMove(90) + "px"
    );

    heart.style.setProperty(
        "--move3",
        randomMove(100) + "px"
    );

    heart.style.setProperty(
        "--move4",
        randomMove(110) + "px"
    );


    document.body.appendChild(
        heart
    );


    /*
        이 하트의 애니메이션이 끝나면
        삭제
    */

    setTimeout(() => {

        heart.remove();


        /*
            남은 하트 감소
        */

        remainingHearts--;


        /*
            모든 하트가 사라짐
        */

        if (remainingHearts === 0) {

            /*
                버튼 위의 안녕도
                서서히 사라짐
            */

            heartMessage.classList.remove(
                "show"
            );

        }

    }, duration * 1000 + 300);

}


/* =============================
   하트 좌우 움직임
============================= */

function randomMove(range) {

    return (
        Math.random()
        * range
        * 2
        - range
    );

}