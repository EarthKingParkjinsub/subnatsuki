/* =========================================================
   기본 DOM 요소
========================================================= */

const carousel =
    document.getElementById("carousel");

const carouselTrack =
    document.getElementById("carouselTrack");

const slides =
    Array.from(
        document.querySelectorAll(".slide")
    );

const prevSlideButton =
    document.getElementById("prevSlide");

const nextSlideButton =
    document.getElementById("nextSlide");

const slideCounter =
    document.getElementById("slideCounter");


/*
    전체 사진 Grid
*/

const photoCards =
    document.querySelectorAll(".photo-card");


/*
    상어 / 하트 / 달 버튼
*/

const effectButtons =
    document.querySelectorAll(".effect-button");

const heartMessage =
    document.getElementById("heartMessage");


/*
    이미지 뷰어
*/

const lightbox =
    document.getElementById("lightbox");

const lightboxArea =
    document.getElementById("lightboxArea");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeLightbox =
    document.getElementById("closeLightbox");



/* =========================================================
   사귄 날짜 계산

   2026년 6월 10일
   = 1일째
========================================================= */

const relationshipStart =
    new Date(
        2026,
        5,
        10
    );


function startOfLocalDay(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}



function updateLoveCounter() {

    const today =
        startOfLocalDay(
            new Date()
        );


    const start =
        startOfLocalDay(
            relationshipStart
        );


    const millisecondsPerDay =
        24
        * 60
        * 60
        * 1000;


    const elapsedDays =
        Math.floor(
            (
                today - start
            )
            / millisecondsPerDay
        );


    /*
        2026-06-10을
        1일째로 계산
    */

    const daysTogether =
        Math.max(
            1,
            elapsedDays + 1
        );


    /*
        다음 100일 단위 기념일

        65일
        → 100일

        103일
        → 200일

        250일
        → 300일
    */

    const nextMilestone =
        Math.ceil(
            daysTogether / 100
        )
        * 100;


    const daysLeft =
        nextMilestone
        - daysTogether;



    const daysTogetherElement =
        document.getElementById(
            "daysTogether"
        );


    const nextMilestoneElement =
        document.getElementById(
            "nextMilestone"
        );


    const countdownText =
        document.getElementById(
            "countdownText"
        );



    if (daysTogetherElement) {

        daysTogetherElement.textContent =
            daysTogether;

    }



    if (nextMilestoneElement) {

        nextMilestoneElement.textContent =
            nextMilestone;

    }



    if (countdownText) {

        if (daysLeft === 0) {

            countdownText.textContent =
                `${nextMilestone}일 기념일 · D-DAY ❤️`;

        }

        else {

            countdownText.textContent =
                `${nextMilestone}일까지 D-${daysLeft}`;

        }

    }

}



/*
    페이지 실행할 때
    날짜 계산
*/

updateLoveCounter();



/* =========================================================
   메인 사진 슬라이드
========================================================= */

let currentIndex = 0;


/*
    자동 슬라이드 간격

    5500 = 5.5초

    더 느리게 하고 싶으면
    7000 ~ 8000 추천
*/

const autoSlideDelay =
    5500;


let autoSlideTimer =
    null;



/* =========================================================
   특정 슬라이드 보여주기
========================================================= */

function showSlide(
    index,
    animate = true
) {

    if (
        slides.length === 0
        ||
        !carouselTrack
    ) {

        return;

    }


    /*
        무한 반복

        마지막 → 첫 번째

        첫 번째에서 이전
        → 마지막
    */

    currentIndex =
        (
            index
            + slides.length
        )
        % slides.length;



    /*
        애니메이션 여부
    */

    if (!animate) {

        carouselTrack.style.transition =
            "none";

    }

    else {

        carouselTrack.style.transition =
            "";

    }



    /*
        사진 위치 이동
    */

    carouselTrack.style.transform =
        `translateX(-${currentIndex * 100}%)`;



    /*
        현재 사진 표시
    */

    slides.forEach(
        (
            slide,
            slideIndex
        ) => {

            slide.classList.toggle(
                "is-active",
                slideIndex
                === currentIndex
            );

        }
    );



    /*
        1 / 9
        같은 카운터
    */

    if (slideCounter) {

        slideCounter.textContent =
            `${currentIndex + 1} / ${slides.length}`;

    }



    if (!animate) {

        requestAnimationFrame(
            () => {

                carouselTrack.style.transition =
                    "";

            }
        );

    }

}



/* =========================================================
   다음 사진
========================================================= */

function nextSlide() {

    showSlide(
        currentIndex + 1
    );

}



/* =========================================================
   이전 사진
========================================================= */

function previousSlide() {

    showSlide(
        currentIndex - 1
    );

}



/* =========================================================
   자동 슬라이드 시작
========================================================= */

function startAutoSlide() {

    stopAutoSlide();


    if (slides.length <= 1) {

        return;

    }


    autoSlideTimer =
        setInterval(
            nextSlide,
            autoSlideDelay
        );

}



/* =========================================================
   자동 슬라이드 정지
========================================================= */

function stopAutoSlide() {

    if (autoSlideTimer) {

        clearInterval(
            autoSlideTimer
        );


        autoSlideTimer =
            null;

    }

}



/* =========================================================
   좌우 화살표 버튼
========================================================= */

if (prevSlideButton) {

    prevSlideButton.addEventListener(
        "click",
        () => {

            previousSlide();

            startAutoSlide();

        }
    );

}



if (nextSlideButton) {

    nextSlideButton.addEventListener(
        "click",
        () => {

            nextSlide();

            startAutoSlide();

        }
    );

}



/*
    첫 번째 사진 표시
*/

showSlide(0);


/*
    자동 슬라이드 시작
*/

startAutoSlide();



/* =========================================================
   메인 사진
   터치 / 마우스 드래그
========================================================= */

let carouselDragging =
    false;


let carouselStartX =
    0;


let carouselCurrentX =
    0;


/*
    사진을 실제로 밀었는지
*/

let carouselMoved =
    false;



/* =========================================================
   사진 누르기 시작
========================================================= */

if (carousel) {

    carousel.addEventListener(
        "pointerdown",
        (event) => {

            /*
                화살표 버튼을 누른 경우
                드래그 시작 X
            */

            if (
                event.target.closest(
                    ".nav-button"
                )
            ) {

                return;

            }


            carouselDragging =
                true;


            carouselMoved =
                false;


            carouselStartX =
                event.clientX;


            carouselCurrentX =
                event.clientX;


            carousel.classList.add(
                "dragging"
            );


            /*
                사람이 조작하는 동안
                자동 슬라이드 정지
            */

            stopAutoSlide();


            try {

                carousel.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                /*
                    일부 브라우저에서
                    실패해도 무시
                */

            }

        }
    );

}



/* =========================================================
   손가락 / 마우스 움직이는 중
========================================================= */

if (carousel) {

    carousel.addEventListener(
        "pointermove",
        (event) => {

            if (!carouselDragging) {

                return;

            }


            carouselCurrentX =
                event.clientX;


            const deltaX =
                carouselCurrentX
                - carouselStartX;



            /*
                5px 이상 이동하면
                단순 클릭이 아니라
                드래그로 판단
            */

            if (
                Math.abs(deltaX) > 5
            ) {

                carouselMoved =
                    true;

            }



            /*
                손가락 움직임에 따라
                사진도 같이 따라옴
            */

            const dragPercent =
                (
                    deltaX
                    / carousel.clientWidth
                )
                * 100;



            carouselTrack.style.transform =
                `
                translateX(
                    calc(
                        -${currentIndex * 100}%
                        + ${dragPercent}%
                    )
                )
                `;

        }
    );

}



/* =========================================================
   손가락 / 마우스 떼기
========================================================= */

if (carousel) {

    carousel.addEventListener(
        "pointerup",
        finishCarouselDrag
    );


    carousel.addEventListener(
        "pointercancel",
        finishCarouselDrag
    );

}



function finishCarouselDrag(
    event
) {

    if (!carouselDragging) {

        return;

    }


    const deltaX =
        carouselCurrentX
        - carouselStartX;


    carouselDragging =
        false;


    carousel.classList.remove(
        "dragging"
    );



    try {

        carousel.releasePointerCapture(
            event.pointerId
        );

    }

    catch (error) {

        /*
            이미 해제됐으면 무시
        */

    }



    /*
        화면 너비의 14%

        또는 최소 55px 이상
        밀었을 때만 사진 변경
    */

    const threshold =
        Math.max(
            55,
            carousel.clientWidth
            * 0.14
        );



    /*
        왼쪽으로 밀기
        → 다음 사진
    */

    if (
        deltaX
        <= -threshold
    ) {

        nextSlide();

    }


    /*
        오른쪽으로 밀기
        → 이전 사진
    */

    else if (
        deltaX
        >= threshold
    ) {

        previousSlide();

    }


    /*
        조금만 밀었으면
        현재 사진으로 복귀
    */

    else {

        showSlide(
            currentIndex
        );

    }



    startAutoSlide();

}



/* =========================================================
   이미지 뷰어 열기

   메인 슬라이드와
   Grid 사진이 이 함수를 같이 사용
========================================================= */

function openViewer(
    imageSrc
) {

    if (
        !lightbox
        ||
        !lightboxImage
    ) {

        return;

    }


    lightboxImage.src =
        imageSrc;


    resetViewer();


    lightbox.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";


    /*
        사진 보는 동안에는
        뒤의 메인 슬라이드 정지
    */

    stopAutoSlide();

}



/* =========================================================
   메인 사진 클릭
   → 이미지 뷰어
========================================================= */

if (carousel) {

    carousel.addEventListener(
        "click",
        (event) => {

            /*
                사용자가 사진을
                옆으로 밀었다면

                클릭으로 처리하지 않음
            */

            if (carouselMoved) {

                carouselMoved =
                    false;

                return;

            }



            /*
                화살표 버튼을
                클릭한 경우도 제외
            */

            if (
                event.target.closest(
                    ".nav-button"
                )
            ) {

                return;

            }



            if (
                slides.length === 0
            ) {

                return;

            }



            const activeImage =
                slides[
                    currentIndex
                ]
                    .querySelector(
                        "img"
                    );



            if (!activeImage) {

                return;

            }



            openViewer(
                activeImage.src
            );

        }
    );

}



/* =========================================================
   전체 Grid 사진 클릭
   → 이미지 뷰어
========================================================= */

photoCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                const image =
                    card.querySelector(
                        "img"
                    );


                if (!image) {

                    return;

                }


                openViewer(
                    image.src
                );

            }
        );

    }
);



/* =========================================================
   이미지 뷰어 닫기
========================================================= */

if (closeLightbox) {

    closeLightbox.addEventListener(
        "click",
        closeViewer
    );

}



/*
    검은 배경 부분 클릭
    → 닫기
*/

if (lightboxArea) {

    lightboxArea.addEventListener(
        "click",
        (event) => {

            if (
                event.target
                === lightboxArea
            ) {

                closeViewer();

            }

        }
    );

}



/* =========================================================
   키보드 조작
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /*
            이미지 뷰어 열려 있을 때
        */

        if (
            lightbox
            &&
            lightbox.classList.contains(
                "open"
            )
        ) {

            /*
                ESC
                → 뷰어 닫기
            */

            if (
                event.key
                === "Escape"
            ) {

                closeViewer();

            }


            return;

        }



        /*
            평상시

            ← 키
            → 이전 사진
        */

        if (
            event.key
            === "ArrowLeft"
        ) {

            previousSlide();

            startAutoSlide();

        }



        /*
            → 키
            → 다음 사진
        */

        if (
            event.key
            === "ArrowRight"
        ) {

            nextSlide();

            startAutoSlide();

        }

    }
);



function closeViewer() {

    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";


    /*
        다시 메인 사진
        자동 슬라이드 시작
    */

    startAutoSlide();

}



/* =========================================================
   이미지 뷰어 확대 / 축소
========================================================= */

let scale =
    1;


let positionX =
    0;


let positionY =
    0;


let isDragging =
    false;


let startX =
    0;


let startY =
    0;



/* =========================================================
   마우스 휠

   1배 ~ 5배
========================================================= */

if (lightboxImage) {

    lightboxImage.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();



            /*
                위로 휠
                → 확대
            */

            if (
                event.deltaY < 0
            ) {

                scale +=
                    0.25;

            }


            /*
                아래로 휠
                → 축소
            */

            else {

                scale -=
                    0.25;

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
                다시 1배가 되면
                사진 중앙으로
            */

            if (
                scale === 1
            ) {

                positionX =
                    0;


                positionY =
                    0;

            }



            updateTransform();

        },
        {
            passive: false
        }
    );

}



/* =========================================================
   확대된 사진 누르기
========================================================= */

if (lightboxImage) {

    lightboxImage.addEventListener(
        "pointerdown",
        (event) => {

            /*
                확대하지 않은 상태에서는
                사진 이동하지 않음
            */

            if (
                scale <= 1
            ) {

                return;

            }



            isDragging =
                true;



            startX =
                event.clientX
                - positionX;



            startY =
                event.clientY
                - positionY;



            lightboxImage.classList.add(
                "dragging"
            );



            try {

                lightboxImage.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                /*
                    실패해도 무시
                */

            }

        }
    );

}



/* =========================================================
   확대된 사진 이동
========================================================= */

if (lightboxImage) {

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

}



/* =========================================================
   확대 사진 드래그 종료
========================================================= */

if (lightboxImage) {

    lightboxImage.addEventListener(
        "pointerup",
        stopDragging
    );


    lightboxImage.addEventListener(
        "pointercancel",
        stopDragging
    );

}



function stopDragging() {

    isDragging =
        false;


    if (lightboxImage) {

        lightboxImage.classList.remove(
            "dragging"
        );

    }

}



/* =========================================================
   이미지 더블클릭

   1배 → 2배

   확대 상태 → 원래 크기
========================================================= */

if (lightboxImage) {

    lightboxImage.addEventListener(
        "dblclick",
        () => {

            if (
                scale === 1
            ) {

                scale =
                    2;

            }

            else {

                scale =
                    1;


                positionX =
                    0;


                positionY =
                    0;

            }



            updateTransform();

        }
    );

}



/* =========================================================
   확대 위치 적용
========================================================= */

function updateTransform() {

    if (!lightboxImage) {

        return;

    }


    lightboxImage.style.transform =
        `
        translate(
            ${positionX}px,
            ${positionY}px
        )
        scale(${scale})
        `;

}



/* =========================================================
   이미지 뷰어 초기화
========================================================= */

function resetViewer() {

    scale =
        1;


    positionX =
        0;


    positionY =
        0;


    isDragging =
        false;



    if (lightboxImage) {

        lightboxImage.classList.remove(
            "dragging"
        );

    }



    updateTransform();

}



/* =========================================================
   상어 / 하트 / 달 효과 설정
========================================================= */

const effectConfig = {

    /*
        상어
    */

    shark: {

        count:
            60,

        emojis: [
            "🦈",
            "🦈",
            "🦈",
            "🌊",
            "🫧"
        ]

    },


    /*
        하트
    */

    heart: {

        count:
            100,

        emojis: [
            "❤️",
            "💕",
            "💗",
            "💖",
            "💓"
        ]

    },


    /*
        달
    */

    moon: {

        count:
            70,

        emojis: [
            "🌙",
            "🌙",
            "🌕",
            "⭐",
            "✨"
        ]

    }

};



/*
    아직 떨어지고 있는 하트 +
    앞으로 생성될 하트 수

    전부 0이 되면
    "츠키야 사랑해 !" 글씨를
    천천히 없앰
*/

let remainingHearts =
    0;



/* =========================================================
   상어 / 하트 / 달 버튼 클릭
========================================================= */

effectButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const effectName =
                    button.dataset.effect;


                launchEffect(
                    effectName
                );

            }
        );

    }
);



/* =========================================================
   낙하 효과 시작
========================================================= */

function launchEffect(
    effectName
) {

    const config =
        effectConfig[
        effectName
        ];


    if (!config) {

        return;

    }



    /*
        하트일 경우

        버튼 위에
        "츠키야 사랑해 !"
        표시
    */

    if (
        effectName
        === "heart"
    ) {

        if (heartMessage) {

            heartMessage.classList.add(
                "show"
            );

        }


        /*
            앞으로 만들어질 하트도
            미리 카운트
        */

        remainingHearts +=
            config.count;

    }



    /*
        한꺼번에 전부 만들지 않고

        약간씩 시간차를 두고
        생성
    */

    for (
        let i = 0;
        i < config.count;
        i++
    ) {

        setTimeout(
            () => {

                createFallingEmoji(
                    effectName,
                    config.emojis
                );

            },
            i * 70
        );

    }

}



/* =========================================================
   떨어지는 이모티콘 하나 생성
========================================================= */

function createFallingEmoji(
    effectName,
    emojiList
) {

    const emoji =
        document.createElement(
            "div"
        );


    emoji.classList.add(
        "falling-emoji"
    );



    /*
        랜덤 이모티콘
    */

    emoji.innerText =
        emojiList[
        Math.floor(
            Math.random()
            * emojiList.length
        )
        ];



    /*
        화면의 랜덤한 가로 위치
    */

    emoji.style.left =
        Math.random()
        * 100
        + "vw";



    /*
        랜덤 크기
    */

    emoji.style.fontSize =
        (
            18
            +
            Math.random()
            * 22
        )
        + "px";



    /*
        떨어지는 시간

        약 4.8 ~ 7.5초
    */

    const duration =
        4.8
        +
        Math.random()
        * 2.7;



    emoji.style.animationDuration =
        duration
        + "s";



    /*
        떨어지면서
        좌우로 흔들리는 정도
    */

    emoji.style.setProperty(
        "--move1",
        randomMove(
            65
        )
        + "px"
    );


    emoji.style.setProperty(
        "--move2",
        randomMove(
            95
        )
        + "px"
    );


    emoji.style.setProperty(
        "--move3",
        randomMove(
            110
        )
        + "px"
    );


    emoji.style.setProperty(
        "--move4",
        randomMove(
            125
        )
        + "px"
    );



    /*
        화면에 추가
    */

    document.body.appendChild(
        emoji
    );



    /*
        떨어지는 애니메이션이
        끝나면 HTML에서 삭제
    */

    setTimeout(
        () => {

            emoji.remove();



            /*
                하트 효과인 경우에만

                남은 하트 개수 감소
            */

            if (
                effectName
                === "heart"
            ) {

                remainingHearts--;



                /*
                    마지막 하트까지
                    전부 사라졌다면

                    사랑해 글씨도
                    천천히 사라지게 함
                */

                if (
                    remainingHearts
                    === 0
                ) {

                    if (heartMessage) {

                        heartMessage.classList.remove(
                            "show"
                        );

                    }

                }

            }

        },
        duration
        * 1000
        + 300
    );

}



/* =========================================================
   좌우 랜덤 이동값
========================================================= */

function randomMove(
    range
) {

    return (
        Math.random()
        * range
        * 2
        - range
    );

}