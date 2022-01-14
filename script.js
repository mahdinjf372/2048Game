let actionAllowed = true;
let movement = false;

//************** */
document.addEventListener("DOMContentLoaded", function() {

    var square = document.querySelector('.swiper-container');

    var manager = new Hammer.Manager(square);

    var Swipe = new Hammer.Swipe();

    manager.add(Swipe);

    manager.on('swipe', async(e) => {
        console.log(e);

        if (actionAllowed && (e.angle > -45 && e.angle < 45)) {

            RunAction("ArrowRight", "");

        } else if (actionAllowed && (e.angle <= -45 && e.angle >= -135)) {

            RunAction("ArrowUp", "");

        } else if (actionAllowed && (e.angle < -135 || e.angle > 135)) {

            RunAction("ArrowLeft", "");

        } else if (actionAllowed && (e.angle <= 135 && e.angle >= 45)) {

            RunAction("ArrowDown", "");
        }

    });
});


/***************** */


document.addEventListener('keydown', async(e) => {
    if (actionAllowed && (e.key == 'ArrowLeft' || e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowRight')) {
        RunAction(e, "keydown");
    }
})

async function RunAction(e, mode) {
    if (mode == "keydown") {

        if (e.key == 'ArrowLeft' && !e.repeat) {

            ToLeft();

        } else if (e.key == 'ArrowUp' && !e.repeat) {

            ToUp();

        } else if (e.key == 'ArrowRight' && !e.repeat) {

            ToRight();

        } else if (e.key == 'ArrowDown' && !e.repeat) {

            ToDown();
        }
    } else {

        if (e == 'ArrowLeft') {

            ToLeft();

        } else if (e == 'ArrowUp') {

            ToUp();

        } else if (e == 'ArrowRight') {

            ToRight();

        } else if (e == 'ArrowDown') {

            ToDown();
        }

    }

    await new Promise(resolve => setTimeout(resolve, 150));
    let duplicated = [];
    let toBeAnimated = [];
    for (let i = 0; i < boxes().length; i++) {
        for (let j = 0; j < boxes().length; j++) {
            if (i != j && X(boxes()[i]) == X(boxes()[j]) && Y(boxes()[i]) == Y(boxes()[j])) {
                if (!duplicated.find(box => (X(box) == X(boxes()[i]) && Y(box) == Y(boxes()[i])))) {
                    duplicated.push(boxes()[i]);
                    toBeAnimated.push(boxes()[j]);
                    boxes()[j].innerHTML = Number(boxes()[j].innerHTML) * 2;
                    document.querySelector("#scoreValue").innerHtml = Number(document.querySelector("#scoreValue").innerHTML);
                }
            }
        }
    }

    duplicated.forEach((box) => {
        box.remove();
    });

    let colors = [{ color: '#00c6ff', value: 4 }, { color: '#ff0048', value: 8 }, { color: '#00a06d', value: 16 }, { color: '#dfb50d', value: 32 }, { color: '#7bdf0d', value: 64 }, { color: '#0d31df', value: 128 }, { color: '#a92424', value: 256 }, { color: '#683f3f', value: 564 }, { color: '#683f3f', value: 1024 }, { color: '#c000ff', value: 2048 }, { color: '#2eeb93', value: 4096 }, { color: '#ccff00', value: 8192 }, ]
    toBeAnimated.forEach((box) => {
        box.style.background = colors.find(object => object.value == box.innerHTML).color;
        box.style.transform = 'scale(1.125)';
    });
    await new Promise(resolve => setTimeout(resolve, 50));

    if (movement) {
        generateBox();
    }

    toBeAnimated.forEach((box) => {
        box.style.transform = 'scale(1)'
    });
    await new Promise(resolve => setTimeout(resolve, 50 + (100 - 50)));
    actionAllowed = true;

    if (boxes().length == 16) {
        let gameOver = true;
        boxes().forEach((box_1) => {
            let boxA = boxes().find(box_2 => (X(box_1) == X(box_2) && Y(box_1) - 147 == Y(box_2)));
            let boxB = boxes().find(box_2 => (X(box_1) + 147 == X(box_2) && Y(box_1) == Y(box_2)));
            let boxC = boxes().find(box_2 => (X(box_1) == X(box_2) && Y(box_1) + 147 == Y(box_2)));
            let boxD = boxes().find(box_2 => (X(box_1) - 147 == X(box_2) && Y(box_1) == Y(box_2)));

            if ((boxA && boxA.innerHTML == box_1.innerHTML) || (boxB && boxB.innerHTML == box_1.innerHTML) || (boxC && boxC.innerHTML == box_1.innerHTML) || (boxD && boxD.innerHTML == box_1.innerHTML)) {
                gameOver = false;
            }
        });

        if (gameOver) {
            actionAllowed = false;
            alert('Game Over');
        }
    }
}



function boxes() {
    return Array.from(document.querySelectorAll('.box'))
}

function X(box) {
    return Number(box.style.marginLeft.split("px")[0]);
}

function Y(box) {
    return Number(box.style.marginTop.split("px")[0]);
}

function generateBox() {
    let values = [0, 147, 294, 441];
    let randomValueX;
    let randomValueY;
    let boxValues = boxes().map(box => `${X(box)} ${Y(box)}`)

    do {
        randomValueX = values[Math.floor(Math.random() * values.length)]
        randomValueY = values[Math.floor(Math.random() * values.length)]

    } while (boxValues.includes(`${randomValueX} ${randomValueY}`));

    let style = `margin-left:${randomValueX}px; margin-top:${randomValueY}px; background:#b53471;`;
    document.querySelector('#game-board').insertAdjacentHTML('beforeend', `
<div class='box' style='${style}'>2</div>`);

    boxes()[boxes().length - 1].animate(
        [
            { clipPath: "circle(0%)" },
            { clipPath: "circle(100%)" }
        ], {
            duration: 100,
            easing: 'linear'
        }
    )

}

generateBox();
generateBox();

function ToLeft() {

    for (let i = 0; i <= 441; i += 147) {
        let state = ['free', 'free', 'free', 'free'];
        for (let j = 0; j <= 441; j += 147) {
            boxes().forEach((box_A) => {
                if (Y(box_A) == i && X(box_A) == j) {
                    let index = (state.indexOf('occupied') == -1) ? state.indexOf('free') : state.indexOf('occupied');
                    let tempX = X(box_A);
                    if (index == state.indexOf('free')) {
                        box_A.style.marginLeft = `${index*147}px`;
                        state[index] = 'occupied';
                    } else if (index == state.indexOf('occupied')) {
                        let occupiedBox = boxes().find(box_B => (X(box_B) == index * 147 && Y(box_B) == i));
                        if (occupiedBox.innerHTML == box_A.innerHTML) {
                            box_A.style.marginLeft = `${index*147}px`;
                            state[index] = 'blocked';
                        } else {
                            box_A.style.marginLeft = `${(index+1)*147}px`;
                            state[index] = 'blocked';
                            state[index + 1] = 'occupied';
                        }

                    }
                    if (X(box_A) != tempX) {
                        movement = true;
                    }
                }
            })
        }
    }
}

function ToUp() {

    for (let i = 0; i <= 441; i += 147) {
        let state = ['free', 'free', 'free', 'free'];
        for (let j = 0; j <= 441; j += 147) {
            boxes().forEach((box_A) => {
                if (X(box_A) == i && Y(box_A) == j) {
                    let index = (state.indexOf('occupied') == -1) ? state.indexOf('free') : state.indexOf('occupied');
                    let tempY = Y(box_A);
                    if (index == state.indexOf('free')) {
                        box_A.style.marginTop = `${index*147}px`;
                        state[index] = 'occupied';
                    } else if (index == state.indexOf('occupied')) {
                        let occupiedBox = boxes().find(box_B => (Y(box_B) == index * 147 && X(box_B) == i));
                        if (occupiedBox.innerHTML == box_A.innerHTML) {
                            box_A.style.marginTop = `${index*147}px`;
                            state[index] = 'blocked';
                        } else {
                            box_A.style.marginTop = `${(index+1)*147}px`;
                            state[index] = 'blocked';
                            state[index + 1] = 'occupied';
                        }

                    }
                    if (Y(box_A) != tempY) {
                        movement = true;
                    }
                }
            })
        }
    }
}

function ToRight() {


    for (let i = 0; i <= 441; i += 147) {
        let state = ['free', 'free', 'free', 'free'];
        for (let j = 441; j >= 0; j -= 147) {
            boxes().forEach((box_A) => {
                if (Y(box_A) == i && X(box_A) == j) {
                    let index = (state.lastIndexOf('occupied') == -1) ? state.lastIndexOf('free') : state.lastIndexOf('occupied');
                    let tempX = X(box_A);
                    if (index == state.lastIndexOf('free')) {
                        box_A.style.marginLeft = `${index*147}px`;
                        state[index] = 'occupied';
                    } else if (index == state.lastIndexOf('occupied')) {
                        let occupiedBox = boxes().find(box_B => (X(box_B) == index * 147 && Y(box_B) == i));
                        if (occupiedBox.innerHTML == box_A.innerHTML) {
                            box_A.style.marginLeft = `${index*147}px`;
                            state[index] = 'blocked';
                        } else {
                            box_A.style.marginLeft = `${(index-1)*147}px`;
                            state[index] = 'blocked';
                            state[index - 1] = 'occupied';
                        }

                    }
                    if (X(box_A) != tempX) {
                        movement = true;
                    }
                }
            })
        }
    }
}

function ToDown() {

    for (let i = 0; i <= 441; i += 147) {
        let state = ['free', 'free', 'free', 'free'];
        for (let j = 441; j >= 0; j -= 147) {
            boxes().forEach((box_A) => {
                if (X(box_A) == i && Y(box_A) == j) {
                    let index = (state.lastIndexOf('occupied') == -1) ? state.lastIndexOf('free') : state.lastIndexOf('occupied');
                    let tempY = Y(box_A);
                    if (index == state.lastIndexOf('free')) {
                        box_A.style.marginTop = `${index*147}px`;
                        state[index] = 'occupied';
                    } else if (index == state.lastIndexOf('occupied')) {
                        let occupiedBox = boxes().find(box_B => (Y(box_B) == index * 147 && X(box_B) == i));
                        if (occupiedBox.innerHTML == box_A.innerHTML) {
                            box_A.style.marginTop = `${index*147}px`;
                            state[index] = 'blocked';
                        } else {
                            box_A.style.marginTop = `${(index-1)*147}px`;
                            state[index] = 'blocked';
                            state[index - 1] = 'occupied';
                        }

                    }
                    if (Y(box_A) != tempY) {
                        movement = true;
                    }
                }
            })
        }
    }
}