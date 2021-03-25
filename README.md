# Herbs Up!

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Setup](#setup)
- [Unit tests](#unit-tests)
- [Known issues](#known-issues)
- [Project status](#project-status)
- [Acknowledgements](#acknowledgements)

## Introduction

[![Build Status](https://travis-ci.org/sskorka/herbs-game.svg?branch=master)](https://travis-ci.org/sskorka/herbs-game)

<b>Herbs Up!</b> is an implementation of a kickstarter card game _Herbaceous_ and it's playable through a web browser.

[Live version available HERE](https://herbs-game.web.app/home)

Herbs Up! was created using Angular as a learning opportunity. As of now, it features singleplayer mode only.<br/>
You need to create a free account to start.

There is no tutorial available in-game **yet**, so I strongly suggest familiarizing yourselves with the game manual [here](https://www.ultraboardgames.com/herbaceous/game-rules.php) and [here](https://www.ultraboardgames.com/herbaceous/solo-variant-.php).

## Technologies

* Angular 9.1.0
* Firebase for authentication and data storage
* ngx-translate for internalization
* TypeScript, HTML, CSS

The game flow is controlled by a game manager service, as it communicates with the board component and sends its current game state.

## Setup

To start a dev server, you need Angular CLI installed on your machine.<br/>
```bash
# Clone this repository
>git clone https://github.com/sskorka/herbs-game

# Go to local repository
>cd herbs-game

# Install dependencies.
>npm install

# Start the dev server. (port `4200` by default)
>ng serve
```
**Development keys**: You will have to provide your own API_KEY in order to properly run the project on your local machine.<br/>
I recommend a free Firebase plan, as the _Herbs's Up_ API requests are compliant with their documentation.

### Building the project
Run `ng build` to build the project. Use `--prod` flag for a production build.<br/>
The build artifacts will be stored in the `dist/` directory.

## Unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Known issues
The current biggest issue is RWD, despite the wonders of a flexbox. The project's goal was to implement game mechanics, and as such RWD was not a priority.<br />
If you're experiencing layout-related problems, these can be applied for a temporary solution:
- Play on a 1080p or 1440p resolution
- Disable system interface scaling (set to 100%)
- Use F11 to enter fullscreen mode

## Project status
The project is considered finished, with the future possibility of adding multiplayer, as well as broader unit test coverage.

## Acknowledgements
Huge thanks to the [<i>Pencil First Games</i>](https://www.pencilfirstgames.com/herbaceous-base/) team for their super chill game that acted as an inspiration for this project.
