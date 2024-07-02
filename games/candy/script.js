document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score-value');
    const timerDisplay = document.getElementById('time-value');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.getElementsByClassName('close')[0];
    let score = 0;
    let timeRemaining = 60;
    let timer;

    closeModal.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    const levelCandies = {
        1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '5+5', '2*3', '4+1', '6-2'],
        2: ['1', '2', '3', '4', '5', '0.5', '1/2', '1.5', '2.5', '3.5', '1+1', '3*2', '4-1', '2/2'],
        3: ['1', '2', '3', '0.25', '0.5', '3/4', '75%', '50%', '100%', '1/4', '0.5*2', '1/2+1/2', '0.75', '50%+50%']
    };

    const boardSize = 5;
    let currentLevel = 1;

    function evaluateExpression(expr) {
        try {
            return eval(expr.replace('x', '*').replace('%', '/100'));
        } catch {
            return null;
        }
    }

    function createBoard(level) {
        board.innerHTML = '';
        const candies = levelCandies[level];
        for (let i = 0; i < boardSize * boardSize; i++) {
            const candy = document.createElement('div');
            candy.classList.add('candy');
            candy.textContent = candies[Math.floor(Math.random() * candies.length)];
            candy.setAttribute('id', i);
            candy.dataset.value = evaluateExpression(candy.textContent);
            candy.addEventListener('click', handleCandyClick);
            board.appendChild(candy);
        }
        board.style.display = 'grid';
    }

    function startGame(level) {
        currentLevel = level;
        score = 0;
        timeRemaining = 60;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeRemaining;
        document.getElementById('level-select').style.display = 'none';
        createBoard(level);
        startTimer();
    }

    let selectedCandies = [];

    function handleCandyClick() {
        if (selectedCandies.length < 3 && !this.classList.contains('selected')) {
            this.classList.add('selected');
            selectedCandies.push(this);
        }
        if (selectedCandies.length === 3) {
            checkSelectedCandies();
        }
    }

    function checkSelectedCandies() {
        const [candy1, candy2, candy3] = selectedCandies;
        const value1 = candy1.dataset.value;
        const value2 = candy2.dataset.value;
        const value3 = candy3.dataset.value;

        if (value1 === value2 && value2 === value3) {
            selectedCandies.forEach(candy => {
                candy.classList.remove('selected');
                candy.classList.add('matched');
                candy.style.pointerEvents = 'none';
            });
            score += 100;
            scoreDisplay.textContent = score;
            checkForWin();
        } else {
            selectedCandies.forEach(candy => {
                candy.classList.remove('selected');
            });
        }
        selectedCandies = [];
    }

    function checkForWin() {
        if (board.querySelectorAll('.candy:not(.matched)').length < 3 || !checkForTrioPossibility()) {
            showNotification('Félicitations ! Vous avez gagné ! 🎉😀', 'success');
            clearInterval(timer);
            if (currentLevel < 3) {
                currentLevel++;
                setTimeout(() => {
                    startGame(currentLevel);
                }, 3000);
            } else {
                setTimeout(() => {
                    document.getElementById('level-select').style.display = 'block';
                    board.style.display = 'none';
                }, 3000);
            }
        }
    }

    function checkForTrioPossibility() {
        const candies = board.querySelectorAll('.candy:not(.matched)');
        const length = candies.length;
        for (let i = 0; i < length; i++) {
            for (let j = i + 1; j < length; j++) {
                for (let k = j + 1; k < length; k++) {
                    if (candies[i].dataset.value === candies[j].dataset.value && candies[j].dataset.value === candies[k].dataset.value) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }


    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeRemaining -= 1;
            timerDisplay.textContent = timeRemaining;
            if (timeRemaining === 0) {
                clearInterval(timer);
                showNotification('Temps écoulé ! Jeu terminé. 🙁🥹', 'error');
                setTimeout(() => {
                    document.getElementById('level-select').style.display = 'block';
                    board.style.display = 'none';
                }, 3000);
            }
        }, 1000);
    }

    window.startGame = startGame;
});
