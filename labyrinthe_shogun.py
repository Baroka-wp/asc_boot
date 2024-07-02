# -*- coding: utf-8 -*-
import pygame
import random
import sys

# Initialisation de Pygame
pygame.init()

# Constantes
WIDTH, HEIGHT = 800, 600
CELL_SIZE = 40
GRID_WIDTH = WIDTH // CELL_SIZE
GRID_HEIGHT = HEIGHT // CELL_SIZE

# Couleurs
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)
YELLOW = (255, 255, 0)

# Création de la fenêtre
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Le Labyrinthe du Shogun")

# Police pour le texte
font = pygame.font.Font(None, 36)

class Cell:
    def __init__(self, row, col):
        self.row = row
        self.col = col
        self.walls = {'top': True, 'right': True, 'bottom': True, 'left': True}
        self.visited = False

    def draw(self):
        x = self.col * CELL_SIZE
        y = self.row * CELL_SIZE
        if self.visited:
            pygame.draw.rect(screen, WHITE, (x, y, CELL_SIZE, CELL_SIZE))
        if self.walls['top']:
            pygame.draw.line(screen, BLACK, (x, y), (x + CELL_SIZE, y), 2)
        if self.walls['right']:
            pygame.draw.line(screen, BLACK, (x + CELL_SIZE, y), (x + CELL_SIZE, y + CELL_SIZE), 2)
        if self.walls['bottom']:
            pygame.draw.line(screen, BLACK, (x, y + CELL_SIZE), (x + CELL_SIZE, y + CELL_SIZE), 2)
        if self.walls['left']:
            pygame.draw.line(screen, BLACK, (x, y), (x, y + CELL_SIZE), 2)

class Maze:
    def __init__(self):
        self.grid = [[Cell(row, col) for col in range(GRID_WIDTH)] for row in range(GRID_HEIGHT)]
        self.current_cell = self.grid[0][0]
        self.stack = []
        self.start = self.grid[0][0]
        self.end = self.grid[GRID_HEIGHT - 1][GRID_WIDTH - 1]
        self.player = self.start

    def draw(self):
        for row in self.grid:
            for cell in row:
                cell.draw()
        
        # Dessiner l'entrée
        start_x = self.start.col * CELL_SIZE
        start_y = self.start.row * CELL_SIZE
        pygame.draw.rect(screen, GREEN, (start_x, start_y, CELL_SIZE, CELL_SIZE))

        # Dessiner la sortie
        end_x = self.end.col * CELL_SIZE
        end_y = self.end.row * CELL_SIZE
        pygame.draw.rect(screen, RED, (end_x, end_y, CELL_SIZE, CELL_SIZE))
        
        # Dessiner le joueur
        player_x = self.player.col * CELL_SIZE + CELL_SIZE // 2
        player_y = self.player.row * CELL_SIZE + CELL_SIZE // 2
        pygame.draw.circle(screen, BLUE, (player_x, player_y), CELL_SIZE // 3)

    def get_neighbors(self, cell):
        neighbors = []
        directions = [('top', -1, 0), ('right', 0, 1), ('bottom', 1, 0), ('left', 0, -1)]
        for direction, dy, dx in directions:
            new_row, new_col = cell.row + dy, cell.col + dx
            if 0 <= new_row < GRID_HEIGHT and 0 <= new_col < GRID_WIDTH:
                neighbor = self.grid[new_row][new_col]
                if not neighbor.visited:
                    neighbors.append((direction, neighbor))
        return neighbors

    def remove_wall(self, current, next_cell, direction):
        opposite = {'top': 'bottom', 'right': 'left', 'bottom': 'top', 'left': 'right'}
        current.walls[direction] = False
        next_cell.walls[opposite[direction]] = False

    def generate(self):
        self.current_cell.visited = True
        while True:
            neighbors = self.get_neighbors(self.current_cell)
            if neighbors:
                direction, next_cell = random.choice(neighbors)
                self.remove_wall(self.current_cell, next_cell, direction)
                self.stack.append(self.current_cell)
                next_cell.visited = True
                self.current_cell = next_cell
            elif self.stack:
                self.current_cell = self.stack.pop()
            else:
                break

    def move_player(self, direction):
        if not self.player.walls[direction]:
            if direction == 'top' and self.player.row > 0:
                self.player = self.grid[self.player.row - 1][self.player.col]
            elif direction == 'right' and self.player.col < GRID_WIDTH - 1:
                self.player = self.grid[self.player.row][self.player.col + 1]
            elif direction == 'bottom' and self.player.row < GRID_HEIGHT - 1:
                self.player = self.grid[self.player.row + 1][self.player.col]
            elif direction == 'left' and self.player.col > 0:
                self.player = self.grid[self.player.row][self.player.col - 1]

    def check_win(self):
        return self.player == self.end

def show_message(message):
    text = font.render(message, True, YELLOW, BLACK)
    text_rect = text.get_rect(center=(WIDTH // 2, HEIGHT // 2))
    screen.blit(text, text_rect)
    pygame.display.flip()
    pygame.time.wait(2000)  # Afficher le message pendant 2 secondes

# Création et génération du labyrinthe
maze = Maze()
maze.generate()

# Boucle principale du jeu
running = True
clock = pygame.time.Clock()

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                maze.move_player('top')
            elif event.key == pygame.K_RIGHT:
                maze.move_player('right')
            elif event.key == pygame.K_DOWN:
                maze.move_player('bottom')
            elif event.key == pygame.K_LEFT:
                maze.move_player('left')

    screen.fill(BLACK)
    maze.draw()
    
    if maze.check_win():
        show_message("Félicitations ! Vous avez atteint la sortie !")
        running = False

    pygame.display.flip()
    clock.tick(60)

pygame.quit()
sys.exit()