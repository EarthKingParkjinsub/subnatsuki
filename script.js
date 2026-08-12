/* ========================================
   갤러리 사진 선택
======================================== */

const mainPhoto =
    document.getElementById("mainPhoto");

const mainSection =
    document.getElementById("mainSection");

const photoCards =
    document.querySelectorAll(".photo-card");


photoCards.forEach((card) => {

    card.addEventListener("click", () => {

        const image =
            card.querySelector("img");

        const selectedImage =
            image.src;


        // 메인 사진 fade out
        mainPhoto.classList.add("changing");


        setTimeout(() => {

            // 메인 사진 변경
            mainPhoto.src =
                selectedImage;


            // 기존 active 제거
            photoCards.forEach((item) => {

                item.classList.remove(
                    "active"
                );

            });


            // 클릭한 사진 active
            card.classList.add("active");


            // 다시 등장
            mainPhoto.classList.remove(
                "changing"
            );


            // 메인 사진 위치로 자동 이동
            mainSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 220);

    });

});


/* ========================================
   하트 효과
======================================== */

const heartButton =
    document.getElementById(
        "heartButton"
    );


heartButton.addEventListener(
    "click",
    () => {

        // 한 번에 터지지 않고
        // 천천히 생성
        for (
            let i = 0;
            i < 100;
            i++
        ) {

            setTimeout(
                createHeart,
                i * 90
            );

        }

    }
);


function createHeart() {

    const heart =
        document.createElement("div");


    const heartTypes = [
        "❤️",
        "💕",
        "💗",
        "💖",
        "💓"
    ];


    heart.classList.add(
        "falling-heart"
    );


    heart.innerText =
        heartTypes[
        Math.floor(
            Math.random()
            * heartTypes.length
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


    /* 속도 */

    const duration =
        4.5
        + Math.random() * 2.5;


    heart.style.animationDuration =
        duration + "s";


    /* 좌우 흔들림 */

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


    /* 애니메이션 끝나면 삭제 */

    setTimeout(() => {

        heart.remove();

    }, duration * 1000 + 300);

}


function randomMove(range) {

    return (
        Math.random()
        * range
        * 2
    ) - range;

}


/* ========================================
   라이트박스 이미지 뷰어
======================================== */

const lightbox =
    document.getElementById(
        "lightbox"
    );

const lightboxArea =
    document.getElementById(
        "lightboxArea"
    );

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const closeLightbox =
    document.getElementById(
        "closeLightbox"
    );


/* 현재 확대율 */

let scale = 1;


/* 현재 사진 위치 */

let positionX = 0;
let positionY = 0;


/* 드래그 상태 */

let isDragging = false;


/* 드래그 시작 위치 */

let startX = 0;
let startY = 0;


/* ========================================
   메인 사진 클릭 → 뷰어 열기
======================================== */

mainPhoto.addEventListener(
    "click",
    () => {

        lightboxImage.src =
            mainPhoto.src;


        resetViewer();


        lightbox.classList.add(
            "open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        /* 뒤 페이지 스크롤 방지 */

        document.body.style.overflow =
            "hidden";

    }
);


/* ========================================
   닫기
======================================== */

closeLightbox.addEventListener(
    "click",
    closeViewer
);


/* 검은 배경 클릭 */

lightboxArea.addEventListener(
    "click",
    (event) => {

        /*
            이미지 자체를 클릭한 게 아니면
            뷰어 닫기
        */

        if (
            event.target
            === lightboxArea
        ) {

            closeViewer();

        }

    }
);


/* ESC */

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

    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    setTimeout(() => {

        resetViewer();

    }, 250);

}


/* ========================================
   마우스 휠 확대 / 축소
======================================== */

lightboxImage.addEventListener(
    "wheel",
    (event) => {

        event.preventDefault();


        const oldScale =
            scale;


        /*
            휠 위 = 확대
            휠 아래 = 축소
        */

        if (event.deltaY < 0) {

            scale += 0.25;

        } else {

            scale -= 0.25;

        }


        /*
            최소 1배
            최대 5배
        */

        scale =
            Math.min(
                Math.max(
                    scale,
                    1
                ),
                5
            );


        /*
            1배가 되면
            중앙으로 복귀
        */

        if (scale === 1) {

            positionX = 0;
            positionY = 0;

        }


        /*
            확대율 변화가 없으면
            종료
        */

        if (oldScale === scale) {
            return;
        }


        updateImageTransform();

    },
    {
        passive: false
    }
);


/* ========================================
   드래그
======================================== */

lightboxImage.addEventListener(
    "pointerdown",
    (event) => {

        /*
            1배에서는
            움직일 필요 없음
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


        lightboxImage
            .setPointerCapture(
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


        updateImageTransform();

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


/* ========================================
   더블클릭
   → 확대 / 원상복구
======================================== */

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


        updateImageTransform();

    }
);


/* ========================================
   실제 transform 적용
======================================== */

function updateImageTransform() {

    lightboxImage.style.transform =
        `
        translate(
            ${positionX}px,
            ${positionY}px
        )
        scale(${scale})
        `;

}


/* ========================================
   뷰어 초기화
======================================== */

function resetViewer() {

    scale = 1;

    positionX = 0;
    positionY = 0;

    isDragging = false;


    updateImageTransform();


    lightboxImage.classList.remove(
        "dragging"
    );

}