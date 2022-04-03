const boxes = Array.from(document.querySelectorAll(".board__box"));
const correctText = document.querySelector(".correct-num");
const livesText = document.querySelector(".lives");
const livesBtns = Array.from(document.querySelectorAll(".lives__btns"));
const btnReset = document.querySelector(".btn--reset");
const modalBackground = document.querySelector(".bc");
const modal = document.querySelector(".win");
const main = document.querySelector(".main");
const settingsbar = document.querySelector(".settings-board");
let active = false;

btnReset.addEventListener("click", (e) => {
  if (active == false) {
    active = true;
    btnReset.textContent = "Reset";
    boxes.forEach((b) => {
      flipBoxToFront(b, true);
    });
  } else {
    location.reload();
  }
});

console.log(boxes);

const data = {
  correctNum: 0,
  selectedBoxes: [],
  lives: 30,
  correct: 0,
  correctBoxes: [],
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const giveBoxesImages = function () {
  let items = [
    "apple",
    "banana",
    "baseball",
    "basketball",
    "bed",
    "books",
    "broccoli",
    "cat",
    "computer",
    "controller",
    "dog",
    "football",
    "hat",
    "headphones",
    "money",
    "pasta",
    "pencil",
    "pizza",
    "shoes",
    "soccer",
    "soda",
  ];

  items = shuffle(items);

  items = shuffle(
    items
      .reduce(function (res, current, index, array) {
        return res.concat([current, current]);
      }, [])
      .slice(0, boxes.length)
  );
  console.log(items);

  boxes.forEach((box) => {
    box.querySelector(
      ".board__value"
    ).innerHTML = `<img class="board__value-image" src="box_images/${
      items[boxes.indexOf(box)]
    }.jpeg" data-boxNum="${boxes.indexOf(box)}">`;
    flipBoxToFront(box, false);
  });
};

giveBoxesImages();

function flipBoxToFront(box, side) {
  const sides = Array.from(box.querySelectorAll(".board__side"));
  if (side) {
    sides[0].style.transform = "rotateY(0deg)";
    sides[1].style.transform = "rotateY(180deg)";
    sides[0].classList.add("top");
  }

  if (!side) {
    sides[0].style.transform = "rotateY(180deg)";
    sides[1].style.transform = "rotateY(0deg)";
    sides[1].classList.add("top");
  }
}

const handleCorrectAnswer = function () {
  data.correctBoxes.push(data.selectedBoxes[1]);
  flipBoxToFront(data.selectedBoxes[0], false);
  data.selectedBoxes.forEach((b) => {
    b.classList.add("correct");
  });
  data.correct++;
  correctText.textContent = `correct: ${data.correct} / ${boxes.length / 2}`;
};

const handleIncorrectAnswer = function () {
  flipBoxToFront(data.selectedBoxes[0], false);
  settingsbar.classList.add("red");
  data.selectedBoxes.forEach((b) => {
    setTimeout(() => {
      flipBoxToFront(b, true);
      settingsbar.classList.remove("red");
    }, 1000);
  });
  data.selectedBoxes = [];
  data.lives--;
  livesText.textContent = `Lives: ${data.lives}`;
};

const renderMessage = function (message) {
  const markup = `
    <div class="win">
    <h2>${message}</h2>
    <button class="btn--win-reset">Reset</button>
  </div>
  <div class="bc"></div>`;
  main.insertAdjacentHTML("beforeend", markup);
  document.querySelector(".btn--win-reset").addEventListener("click", (e) => {
    location.reload();
  });
};

const checkIfBoardIsSolved = function () {
  if (data.correctBoxes.length == boxes.length / 2) {
    console.log("solved");
    renderMessage("You Won!");

    active = true;
  }
};

const checkIfLose = function () {
  if (data.lives == 0) {
    console.log("lose");
    renderMessage("You Lose!");
  }
};

const handleBoxClick = function (box) {
  console.log("click");
  console.log("active");
  flipBoxToFront(box, false);
  if (data.selectedBoxes.length < 2) {
    console.log("1");
    data.selectedBoxes.push(box);
  }
  if (data.selectedBoxes.length == 2) {
    console.log(
      "2",
      box.querySelector(".board__value-image").dataset.boxnum,
      data.selectedBoxes[0].querySelector(".board__value-image").dataset.boxnum
    );
    if (
      box.querySelector(".board__value-image").dataset.boxnum ==
      data.selectedBoxes[0].querySelector(".board__value-image").dataset.boxnum
    )
      return;
    const image1 = data.selectedBoxes[0].querySelector(
      ".board__value-image"
    ).src;
    const image2 = data.selectedBoxes[1].querySelector(
      ".board__value-image"
    ).src;
    if (image1 == image2) {
      console.log("correct");
      handleCorrectAnswer();
    }

    if (image1 !== image2) {
      console.log("wrong");
      handleIncorrectAnswer();
    }

    data.selectedBoxes = [];
  }

  checkIfBoardIsSolved();
  checkIfLose();

  //   setTimeout(() => {
  //     sides[0].classList.add("top");
  //     sides[1].classList.remove("top");
  //   }, 2000);
};

const handleLives = function (e) {
  if (e.target.classList.contains("lives__btn--up")) {
    data.lives++;
    livesText.textContent = `Lives: ${data.lives}`;
  }

  if (e.target.classList.contains("lives__btn--down")) {
    console.log("down");
    data.lives--;
    livesText.textContent = `Lives: ${data.lives}`;
  }
};

livesBtns.forEach((b) => {
  b.addEventListener("click", (e) => {
    handleLives(e);
  });
});

boxes.forEach((b) => {
  b.addEventListener("click", () => {
    if (active) {
      boxes.forEach((box) => {
        if (box.classList.contains("correct")) {
          return;
        }
        flipBoxToFront(box, true);
      });
      handleBoxClick(b);
    }
  });
});
