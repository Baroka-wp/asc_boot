// Constantes
const WIDTH = 800;
const HEIGHT = 600;
const CELL_SIZE = 40;
const GRID_WIDTH = Math.floor(WIDTH / CELL_SIZE);
const GRID_HEIGHT = Math.floor(HEIGHT / CELL_SIZE);

// Couleurs
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const RED = "#FF0000";
const GREEN = "#00FF00";
const BLUE = "#0000FF";
const YELLOW = "#FFFF00";

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.visited = false;
    }

    draw(ctx) {
        const x = this.col * CELL_SIZE;
        const y = this.row * CELL_SIZE;
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 2;
        if (this.walls.top) ctx.strokeRect(x, y, CELL_SIZE, 1);
        if (this.walls.right) ctx.strokeRect(x + CELL_SIZE - 1, y, 1, CELL_SIZE);
        if (this.walls.bottom) ctx.strokeRect(x, y + CELL_SIZE - 1, CELL_SIZE, 1);
        if (this.walls.left) ctx.strokeRect(x, y, 1, CELL_SIZE);
    }
}

class Maze {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = Array.from({ length: GRID_HEIGHT }, (_, row) =>
            Array.from({ length: GRID_WIDTH }, (_, col) => new Cell(row, col))
        );
        this.currentCell = this.grid[0][0];
        this.stack = [];
        this.start = this.grid[0][0];
        this.end = this.grid[GRID_HEIGHT - 1][GRID_WIDTH - 1];
        this.player = this.start;
    }

    draw() {
        this.ctx.fillStyle = WHITE;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let row of this.grid) {
            for (let cell of row) {
                cell.draw(this.ctx);
            }
        }

        // Dessiner l'entrée
        this.ctx.fillStyle = GREEN;
        this.ctx.fillRect(this.start.col * CELL_SIZE, this.start.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        // Dessiner la sortie
        this.ctx.fillStyle = RED;
        this.ctx.fillRect(this.end.col * CELL_SIZE, this.end.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

        // Dessiner le joueur
        this.ctx.fillStyle = BLUE;
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.col * CELL_SIZE + CELL_SIZE / 2,
            this.player.row * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 3,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }

    getNeighbors(cell) {
        const neighbors = [];
        const directions = [
            ['top', -1, 0],
            ['right', 0, 1],
            ['bottom', 1, 0],
            ['left', 0, -1]
        ];
        for (let [direction, dy, dx] of directions) {
            const newRow = cell.row + dy;
            const newCol = cell.col + dx;
            if (newRow >= 0 && newRow < GRID_HEIGHT && newCol >= 0 && newCol < GRID_WIDTH) {
                const neighbor = this.grid[newRow][newCol];
                if (!neighbor.visited) {
                    neighbors.push([direction, neighbor]);
                }
            }
        }
        return neighbors;
    }

    removeWall(current, next, direction) {
        const opposite = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
        current.walls[direction] = false;
        next.walls[opposite[direction]] = false;
    }

    generate() {
        this.currentCell.visited = true;
        while (true) {
            const neighbors = this.getNeighbors(this.currentCell);
            if (neighbors.length > 0) {
                const [direction, nextCell] = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.removeWall(this.currentCell, nextCell, direction);
                this.stack.push(this.currentCell);
                nextCell.visited = true;
                this.currentCell = nextCell;
            } else if (this.stack.length > 0) {
                this.currentCell = this.stack.pop();
            } else {
                break;
            }
        }
    }

    movePlayer(direction) {
        if (!this.player.walls[direction]) {
            switch (direction) {
                case 'top':
                    if (this.player.row > 0) this.player = this.grid[this.player.row - 1][this.player.col];
                    break;
                case 'right':
                    if (this.player.col < GRID_WIDTH - 1) this.player = this.grid[this.player.row][this.player.col + 1];
                    break;
                case 'bottom':
                    if (this.player.row < GRID_HEIGHT - 1) this.player = this.grid[this.player.row + 1][this.player.col];
                    break;
                case 'left':
                    if (this.player.col > 0) this.player = this.grid[this.player.row][this.player.col - 1];
                    break;
            }
        }
    }

    checkWin() {
        return this.player === this.end;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        this.maze = new Maze(this.ctx);
        this.currentStage = 'instructions';
        this.timeLimit = 120;
        this.timeRemaining = this.timeLimit;
        this.timer = null;
        this.equations = [
            {
                question: "Résolvez l'équation : 2x + 7 = 32",
                answer: "12.5"
            },
            {
                question: "Lorsque j'avais 6 ans, ma sœur avait la moitié de mon âge.\nAujourd'hui j'ai 67 ans. Quel est l'âge de ma sœur ?",
                answer: "64"
            },
            {
                question: "Si 5 chats attrapent 5 souris en 5 minutes,\ncombien de chats faut-il pour attraper 100 souris en 100 minutes ?",
                answer: "5"
            }
        ];
        this.currentEquation = 0;
    }

    start() {
        this.showInstructions();
    }

    showInstructions() {
        this.showMessage("Bienvenue ! Le formulaire d'inscription est à la sortie du Labyrinthe du Shogun !\n\n" +
            "Utilisez les flèches du clavier pour vous déplacer.\n" +
            "Trouvez la sortie en moins de 2 minutes !\n\n" +
            "Appuyez sur une touche pour commencer.");

        const startGame = (e) => {
            if (e.key === 'Enter') {
                document.removeEventListener('keydown', startGame);
                this.startMaze();
            }
        };

        document.addEventListener('keydown', startGame);
    }

    startMaze() {
        this.currentStage = 'maze';
        this.maze.generate();
        this.addEventListeners();
        this.startTimer();
        this.gameLoop();
    }

    gameLoop() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

        if (this.currentStage === 'maze') {
            this.maze.draw();
            if (this.maze.checkWin()) {
                this.stopTimer();
                this.currentStage = 'equation';
                this.showEquation();
                return;  // Stop the game loop here
            }
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    showEquation() {
        const equation = this.equations[this.currentEquation];
        this.showMessage(equation.question);

        const gameControls = document.getElementById('gameControls');
        gameControls.style.display = 'block';
    }

    showMessage(message) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.ctx.fillStyle = YELLOW;
        this.ctx.font = "24px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        const lines = message.split('\n');
        lines.forEach((line, index) => {
            const y = HEIGHT / 2 + (index - (lines.length - 1) / 2) * 30;
            this.ctx.fillText(line, WIDTH / 2, y);
        });
    }

    checkAnswer() {
        const input = document.getElementById('equationInput');
        const answer = input.value.trim();

        if (answer === this.equations[this.currentEquation].answer) {
            this.showMessage("Correct !");
            this.currentEquation++;

            setTimeout(() => {
                if (this.currentEquation < this.equations.length) {
                    this.showEquation();
                } else {
                    this.endGame('Félicitations ! Maintenant renseigne le formulaire avec tes informations. On te reconteacteras pour te donner tes missions');
                }
            }, 1500); // Délai de 1.5 secondes
        } else {
            this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
            this.showMessage("Incorrect. Essayez encore !\n\n" + this.equations[this.currentEquation].question);
        }
        input.value = '';
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (this.currentStage === 'maze') {
                switch (event.key) {
                    case 'ArrowUp': this.maze.movePlayer('top'); break;
                    case 'ArrowRight': this.maze.movePlayer('right'); break;
                    case 'ArrowDown': this.maze.movePlayer('bottom'); break;
                    case 'ArrowLeft': this.maze.movePlayer('left'); break;
                }
            }
        });

        const submitButton = document.getElementById('submitAnswer');
        submitButton.addEventListener('click', () => this.checkAnswer());
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            if (this.timeRemaining <= 0) {
                this.endGame('Le temps est écoulé !');
            }
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    endGame(message) {
        this.stopTimer();
        const gameControls = document.getElementById('gameControls');
        gameControls.style.display = 'none';

        this.showMessage(message);

        setTimeout(() => {
            if (typeof window.showInscriptionForm === 'function') {
                window.showInscriptionForm();
            } else {
                console.error("La fonction showInscriptionForm n'est pas définie");
            }
        }, 3000);
    }
}

// Fonction pour démarrer le jeu
export function startGame() {
    const game = new Game();
    game.start();
}