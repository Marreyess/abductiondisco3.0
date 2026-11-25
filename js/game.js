import { Player } from "./player.js";
import { Enemy } from "./enemy.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.canvas.width = 1280;
    this.canvas.height = 720;

    this.logo = this.loadImage("./assets/logo-AbduccionDisco.png");
    this.playImage = this.loadImage("./assets/play.png");
    this.creditsImage = this.loadImage("./assets/credits.png");
    this.studioLogo = this.loadImage("./assets/double-m-studio.jpeg");
    this.duelRoom = this.loadImage("./assets/sala-duelo.jpeg");
    this.pauseImage = this.loadImage("./assets/pause.png");
    this.comicImage = this.loadImage("./assets/Comic_Inicio.png");

    this.hallwayImage = this.loadImage("./assets/Pasillo01.png");
    this.hallway02Image = this.loadImage("./assets/Pasillo02.png");
    this.bachStatueImage = this.loadImage("./assets/Mini estatua Bach.png");
    this.princeStatueImage = this.loadImage("./assets/Mini Statua Price.png");
    this.investigationRoom = this.loadImage("./assets/sala-inv.png");
    this.discoRoom = this.loadImage("./assets/Sala disco.png");
    this.michaelSprite = this.loadImage("./assets/Alien/Alien Michael J.png");
    this.michaelDialoguePortrait = this.loadImage("./assets/Alien/Dialogo_Michael J.PNG");
    this.playerDialoguePortrait = this.loadImage("./assets/Player/Dialogo_player.png");
    this.playerDanceSprites = [1, 2, 3, 4, 6, 7, 8].map(frame =>
      this.loadImage(`./assets/Player/dance${String(frame).padStart(2, "0")}.png`)
    );
    this.playerDanceFrame = 0;
    this.playerDanceTimer = 0;
    this.playerDanceFrameDuration = 0.14;
    this.michaelDanceSprites = [];

    for (let i = 1; i <= 8; i++) {
      const frame = String(i).padStart(2, "0");
      this.michaelDanceSprites.push(
        this.loadImage(`./assets/Alien/Dance-Michael-${frame}.png`)
      );
    }

    this.michaelDanceFrame = 0;
    this.michaelDanceTimer = 0;
    this.michaelDanceFrameDuration = 0.12;
    this.michaelDefeated = false;
    this.activeMichaelDialogue = -1;

    this.elvisSprite = this.loadImage("./assets/Alien/Elvis3.png");

    this.elvisDanceSprites = [];

    for (let i = 1; i <= 7; i++) {
      this.elvisDanceSprites.push(
        this.loadImage(`./assets/Alien/baile elvis ${i}.png`)
      );
    }

    this.elvisDanceFrame = 0;
    this.elvisDanceTimer = 0;
    this.elvisDanceFrameDuration = 0.16;

    this.normalSprite = this.loadImage("./assets/Notas/normal02.png");
    this.doubleSprite = this.loadImage("./assets/Notas/dobleClic02.png");
    this.starSprite = this.loadImage("./assets/Notas/star01.png");
    this.crossoutSprite = this.loadImage("./assets/Notas/crossout01.png");

    this.playerStart = {
      x: 390,
      y: 430
    };

    this.player = new Player(
      this.playerStart.x,
      this.playerStart.y
    );

    this.alien = new Enemy(260, 410, "Freddie");

    this.elvisPosition = {
      x: 250,
      y: 370,
      width: 205,
      height: 260
    };

    this.elvisDefeated = false;
    this.battleMode = "tutorial";

    this.state = "menu";
    this.previousState = null;
    this.lastTime = 0;
    this.started = false;
    this.wasInteracting = false;

    this.videoWasPlaying = false;
    this.musicWasPlaying = false;
    this.musicAttempt = 0;

    this.comicIndex = 0;
    this.comicTotal = 4;
    this.dialogueIndex = 0;
    this.tutorialCompleted = false;

    this.door = {
      x: 245,
      y: 605,
      radius: 125
    };

    this.walkableArea = [
      { x: 0, y: 625 },
      { x: 370, y: 470 },
      { x: 1070, y: 470 },
      { x: 1280, y: 550 },
      { x: 1280, y: 720 },
      { x: 0, y: 720 }
    ];

    this.blockedAreas = [
      { x: 350, y: 440, width: 230, height: 120 },
      { x: 1030, y: 390, width: 250, height: 220 }
    ];

    this.hallwayWalkableArea = [
      { x: 0, y: 495 },
      { x: 300, y: 495 },
      { x: 640, y: 500 },
      { x: 950, y: 495 },
      { x: 1280, y: 495 },
      { x: 1280, y: 720 },
      { x: 0, y: 720 }
    ];

    
this.hallway02WalkableArea = [
  { x: 0, y: 525 },
  { x: 1280, y: 525 },
  { x: 1280, y: 720 },
  { x: 0, y: 720 }
];


    this.hallway02Spawn = {
      x: 1030,
      y: 565
    };

    this.hallway02Statues = [
      {
        x: 930,
        y: 565,
        radius: 135,
        image: this.bachStatueImage,
        dialogue: "Vaya, parece un músico de otra época con esa peluca y esa vestimenta, seguro que componía piezas bastante elegantes. Me pregunto cómo sonaría su música."
      },
      {
        x: 330,
        y: 565,
        radius: 135,
        image: this.princeStatueImage,
        dialogue: "¡Qué estilo! Parece que sabía muy bien cómo llamar la atención, con esa guitarra seguro que hacía vibrar todo el escenario."
      }
    ];

    this.activeStatue = null;

    this.hallway02DiscoDoor = {
      x: 55,
      y: 650,
      radius: 210
    };

    this.discoSpawn = {
      x: 1110,
      y: 650
    };

    this.discoWalkableArea = [
      { x: 0, y: 490 },
      { x: 1280, y: 490 },
      { x: 1280, y: 720 },
      { x: 0, y: 720 }
    ];

    this.michaelPosition = {
      x: 640,
      y: 635,
      width: 185,
      height: 235,
      radius: 145
    };

    this.michaelDialogue = [
      "Oh, así que tú eres quien está causando revuelo por toda la nave. Créeme, aquí todos sabemos quién eres… y también a dónde te diriges.",
      "Pero no creas que vas a pasar tan fácilmente, cariño. Primero tendrás que demostrar que puedes seguir mi ritmo. ¡Hee-hee!"
    ];

    this.michaelVictoryText = "¡Vaya, tienes unos pasos fantásticos! Te dejaré pasar esta vez, pero te advierto que salir de aquí no será tan sencillo. ¡Hee-hee!";

    this.discoBlockedPolygons = [
      [
        { x: 570, y: 600 },
        { x: 710, y: 600 },
        { x: 710, y: 655 },
        { x: 570, y: 655 }
      ],
      [
        { x: 0, y: 350 },
        { x: 450, y: 350 },
        { x: 450, y: 535 },
        { x: 405, y: 575 },
        { x: 0, y: 555 }
      ],
      [
        { x: 480, y: 390 },
        { x: 800, y: 390 },
        { x: 800, y: 510 },
        { x: 760, y: 525 },
        { x: 500, y: 525 },
        { x: 480, y: 510 }
      ],
      [
        { x: 820, y: 425 },
        { x: 1150, y: 425 },
        { x: 1150, y: 550 },
        { x: 1100, y: 575 },
        { x: 865, y: 560 },
        { x: 820, y: 535 }
      ],
      [
        { x: 1180, y: 430 },
        { x: 1280, y: 430 },
        { x: 1280, y: 530 },
        { x: 1230, y: 545 },
        { x: 1180, y: 520 }
      ]
    ];

    this.investigationExitDoor = {
      x: 100,
      y: 650,
      radius: 115
    };

    this.hallwaySpawn = {
      x: 1030,
      y: 565
    };

    this.hallwayLeftDoor = {
      x: 130,
      y: 555,
      radius: 120
    };

    this.investigationSpawn = {
      x: 1170,
      y: 650
    };

    this.investigationWalkableArea = [
      { x: 0, y: 0 },
      { x: 1280, y: 0 },
      { x: 1280, y: 720 },
      { x: 0, y: 720 }
    ];

    this.investigationBlockedAreas = [
      { x: 145, y: 135, width: 205, height: 455 },
      { x: 350, y: 200, width: 790, height: 385 },
      { x: 0, y: 0, width: 145, height: 625 },
      { x: 1140, y: 0, width: 140, height: 625 }
    ];

    this.dialogues = [
      {
        speaker: "FREDDIE",
        text: "¡BLORP ZHAAA KIRIKÍÍÍ! ¡WOMBA WOMBA ZÉÉÉ!"
      },
      {
        speaker: "PROTAGONISTA",
        text: "¿...Qué?"
      },
      {
        speaker: "FREDDIE",
        text: "¡KRAAA ZUMBA BLIP!"
      },
      {
        speaker: "PROTAGONISTA",
        text: "No entendí absolutamente nada."
      },
      {
        speaker: "FREDDIE",
        text: "¡Por todas las estrellas! Perdón, humano, olvidé que no hablas nuestro idioma. Qué falta de consideración la mía."
      },
      {
        speaker: "FREDDIE",
        text: "Permíteme empezar de nuevo, querido. Mi nombre es Freddielux Mercury-9000, aunque puedes llamarme Freddie."
      },
      {
        speaker: "FREDDIE",
        text: "Soy una estrella intergaláctica, un artista de renombre y, modestia aparte, una auténtica leyenda."
      },
      {
        speaker: "PROTAGONISTA",
        text: "¿Una estrella... qué?"
      },
      {
        speaker: "FREDDIE",
        text: "Una estrella, cariño. No todos podemos ser el centro del universo, pero algunos nacimos con ese talento."
      },
      {
        speaker: "PROTAGONISTA",
        text: "Espera, espera... ¿Dónde estoy? ¿Y por qué estoy aquí? ¡¿Qué me hicieron?!"
      },
      {
        speaker: "FREDDIE",
        text: "Ay, querido, tantas preguntas y ni siquiera hemos llegado al estribillo."
      },
      {
        speaker: "PROTAGONISTA",
        text: "¡¿ESTRIBILLO?! ¡ME SECUESTRARON!"
      },
      {
        speaker: "FREDDIE",
        text: "Técnicamente, te hemos realizado una invitación interplanetaria no solicitada."
      },
      {
        speaker: "PROTAGONISTA",
        text: "¡ESO ES SECUESTRO!"
      },
      {
        speaker: "FREDDIE",
        text: "Qué poca elegancia tienes para describir una experiencia tan exclusiva."
      },
      {
        speaker: "PROTAGONISTA",
        text: "Bueno, ¿qué quieren de mí?"
      },
      {
        speaker: "FREDDIE",
        text: "¡Ah! Finalmente llegamos a la pregunta importante."
      },
      {
        speaker: "FREDDIE",
        text: "Necesitamos algo que tu especie tiene y que nosotros llevamos siglos intentando comprender..."
      },
      {
        speaker: "PROTAGONISTA",
        text: "¿Qué cosa?"
      },
      {
        speaker: "FREDDIE",
        text: "¡EL RITMO, QUERIDO!"
      },
      {
        speaker: "PROTAGONISTA",
        text: "...¿Me abdujeron por bailar?"
      },
      {
        speaker: "FREDDIE",
        text: "No exactamente. Aunque, después de ver cómo te mueves, tenemos mucho trabajo por delante."
      },
      {
        speaker: "PROTAGONISTA",
        text: "No pienso participar en nada. Quiero regresar a mi casa."
      },
      {
        speaker: "FREDDIE",
        text: "Oh, cariño, todos queremos algo. Yo, por ejemplo, quiero un refrigerador."
      },
      {
        speaker: "PROTAGONISTA",
        text: "¿Un qué?"
      },
      {
        speaker: "FREDDIE",
        text: "Un refrigerador. ¡Un buen refrigerador! ¿Tienes idea de lo complicado que es conservar las bebidas a temperatura ambiente en el espacio?"
      },
      {
        speaker: "PROTAGONISTA",
        text: "¿Me estás hablando en serio?"
      },
      {
        speaker: "FREDDIE",
        text: "Por supuesto. Soy un hombre de gustos refinados."
      },
      {
        speaker: "FREDDIE",
        text: "Pero volviendo a lo importante... Tu misión será demostrar que los humanos todavía tienen lo necesario para dominar la pista de baile."
      },
      {
        speaker: "PROTAGONISTA",
        text: "¿Y si no quiero?"
      },
      {
        speaker: "FREDDIE",
        text: "Entonces tendremos una pequeña tragedia intergaláctica."
      },
      {
        speaker: "PROTAGONISTA",
        text: "¿Me van a dejar aquí para siempre?"
      },
      {
        speaker: "FREDDIE",
        text: "No seas dramático, querido. Para eso ya estoy yo."
      },
      {
        speaker: "FREDDIE",
        text: "¡Que comience el espectáculo!"
      }
    ];

    this.backgroundVideo = document.createElement("video");
    this.backgroundVideo.src = "./assets/space-background.mp4";
    this.backgroundVideo.loop = true;
    this.backgroundVideo.muted = true;
    this.backgroundVideo.playsInline = true;
    this.backgroundVideo.preload = "auto";
    this.backgroundVideo.load();
    this.backgroundVideo.play().catch(() => {});

    this.buttons = {
      play: { x: 490, y: 450, width: 300, height: 100 },
      credits: { x: 490, y: 560, width: 300, height: 75 },
      back: { x: 35, y: 28, width: 115, height: 42 },
      begin: { x: 475, y: 615, width: 330, height: 65 },
      restart: { x: 470, y: 495, width: 340, height: 75 },
      pauseContinue: { x: 475, y: 443, width: 307, height: 67 },
      pauseExit: { x: 475, y: 520, width: 307, height: 66 }
    };

    this.currentMusicPath = "./assets/Queen - Another One Bites The Dust.wav";
    this.musicStartOffset = 0;
    this.music = new Audio(this.currentMusicPath);
    this.music.preload = "auto";
    this.music.volume = 0.7;
    this.music.loop = false;

    this.musicError = false;
    this.audioStarted = false;

    this.music.addEventListener("error", () => {
      this.musicError = true;
    });

    this.music.addEventListener("ended", () => {
      if (this.state === "rhythm") {
        this.finishRemainingNotes();
      }
    });

    this.trackLeft = 370;
    this.trackRight = 910;
    this.hitY = 565;

    this.noteSpeed = 240;
    this.elvisNoteSpeed = 315;
    this.michaelNoteSpeed = 390;

    this.hitWindow = 0.2;
    this.perfectWindow = 0.075;

    this.doubleHitWindow = 0.32;
    this.doubleHitRadius = 85;
    this.doubleClickDelay = 420;
    this.doubleHitYRadius = 75;

    this.notePositions = [
      440,
      560,
      680,
      800
    ];

    this.maxErrors = 3;

    this.notes = [];
    this.effects = [];

    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.totalMisses = 0;
    this.avoidedTraps = 0;

    this.rhythmTime = 0;
    this.fallbackTime = 0;

    this.feedback = "";
    this.feedbackColor = "#ffffff";
    this.feedbackTimer = 0;

    this.speedEffectUntil = 0;
    this.result = "";

    this.starSlowSpeed = 0.65;
    this.starFastSpeed = 1.35;
    this.starEffectDuration = 3;

    this.rhythm = {
      slider: null
    };

    this.canvas.addEventListener("click", () => {
      if (this.state === "disco" && this.activeMichaelDialogue >= 0) {
        this.activeMichaelDialogue++;

        if (this.activeMichaelDialogue >= this.michaelDialogue.length) {
          this.activeMichaelDialogue = -1;
          this.startRhythm("michael");
        }

        return;
      }

      if (this.state === "victoryDialogue" && this.battleMode === "michael") {
        this.finishVictoryDialogue();
      }
    });

    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();

        if (event.repeat) return;

        if (this.state === "disco" && this.activeMichaelDialogue >= 0) {
          this.activeMichaelDialogue = -1;
          this.wasInteracting = this.player.wantsToInteract();
          return;
        }

        if (this.state === "victoryDialogue" && this.battleMode === "michael") {
          this.finishVictoryDialogue();
          return;
        }

        if (this.state === "paused") {
          this.resumeGame();
        } else if (
          [
            "comic",
            "playing",
            "dialogue",
            "rhythmIntro",
            "rhythm",
            "rhythmEnd",
            "victoryDialogue",
            "hallway",
            "hallway02",
            "investigation",
            "disco"
          ].includes(this.state)
        ) {
          this.pauseGame();
        }

        return;
      }

      if (
        this.state === "dialogue" &&
        (
          event.key === "Enter" ||
          event.code === "Space"
        )
      ) {
        event.preventDefault();

        if (!event.repeat) {
          this.nextDialogue();
        }

        return;
      }

      if (
        this.state === "victoryDialogue" &&
        this.battleMode !== "michael" &&
        (
          event.key === "Enter" ||
          event.code === "Space"
        )
      ) {
        event.preventDefault();

        if (!event.repeat) {
          this.finishVictoryDialogue();
        }

        return;
      }

      if (
        this.state === "rhythmIntro" &&
        (
          event.key === "Enter" ||
          event.code === "Space"
        )
      ) {
        event.preventDefault();

        if (!event.repeat) {
          this.beginRhythm();
        }
      }
    });
  }

  loadImage(path) {
    const image = new Image();
    image.src = path;
    return image;
  }

  start() {
    if (this.started) return;

    this.started = true;
    this.lastTime = performance.now();

    requestAnimationFrame(this.loop);
  }

  loop = time => {
    const deltaTime = Math.min(
      Math.max((time - this.lastTime) / 1000, 0),
      0.05
    );

    this.lastTime = time;

    if (this.state === "playing") {
      this.update(deltaTime);
    }

    if (this.state === "hallway") {
      this.updateHallway(deltaTime);
    }

    if (this.state === "hallway02") {
      this.updateHallway02(deltaTime);
    }

    if (this.state === "disco") {
      this.updateDisco(deltaTime);
    }

    if (this.state === "investigation") {
      this.updateInvestigation(deltaTime);
    }

    if (this.state === "rhythm") {
      if (
        this.battleMode === "tutorial" &&
        typeof this.alien.update === "function"
      ) {
        this.alien.update(deltaTime);
      }

      if (this.battleMode === "elvis") {
        this.updateElvisDance(deltaTime);
      }

      if (this.battleMode === "michael") {
        this.updateMichaelDance(deltaTime);
      }

      this.updateRhythm(deltaTime);
    }

    this.draw();

    requestAnimationFrame(this.loop);
  };

  updateElvisDance(deltaTime) {
    if (
      this.state !== "rhythm" ||
      this.battleMode !== "elvis"
    ) {
      return;
    }

    this.elvisDanceTimer += deltaTime;

    while (
      this.elvisDanceTimer >=
      this.elvisDanceFrameDuration
    ) {
      this.elvisDanceTimer -=
        this.elvisDanceFrameDuration;

      this.elvisDanceFrame =
        (this.elvisDanceFrame + 1) %
        this.elvisDanceSprites.length;
    }
  }

  updateMichaelDance(deltaTime) {
    if (
      this.state !== "rhythm" ||
      this.battleMode !== "michael"
    ) {
      return;
    }

    this.michaelDanceTimer += deltaTime;

    while (
      this.michaelDanceTimer >=
      this.michaelDanceFrameDuration
    ) {
      this.michaelDanceTimer -=
        this.michaelDanceFrameDuration;

      this.michaelDanceFrame =
        (this.michaelDanceFrame + 1) %
        this.michaelDanceSprites.length;
    }
  }

  isInside(x, y, button) {
    return (
      x >= button.x &&
      x <= button.x + button.width &&
      y >= button.y &&
      y <= button.y + button.height
    );
  }

  resetPlayerPosition() {
    this.player.x = this.playerStart.x;
    this.player.y = this.playerStart.y;
  }

  setPlayerFeetPosition(x, y) {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    this.player.x += x - feet.x;
    this.player.y += y - feet.y;
  }

  resetGame() {
    this.musicAttempt++;

    this.music.pause();
    this.music.playbackRate = 1;

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    if (
      typeof this.alien.stopDance === "function"
    ) {
      this.alien.stopDance();
    }

    this.resetPlayerPosition();

    this.tutorialCompleted = false;
    this.elvisDefeated = false;
    this.michaelDefeated = false;
    this.activeMichaelDialogue = -1;
    this.battleMode = "tutorial";

    this.elvisDanceFrame = 0;
    this.elvisDanceTimer = 0;

    this.comicIndex = 0;
    this.dialogueIndex = 0;

    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;

    this.hits = 0;
    this.misses = 0;
    this.totalMisses = 0;
    this.avoidedTraps = 0;

    this.notes = [];
    this.effects = [];

    this.rhythmTime = 0;
    this.fallbackTime = 0;
    this.speedEffectUntil = 0;

    this.feedback = "";
    this.feedbackTimer = 0;
    this.result = "";

    this.musicError = false;
    this.audioStarted = false;

    this.previousState = null;
    this.videoWasPlaying = false;
    this.musicWasPlaying = false;

    this.wasInteracting =
      this.player.wantsToInteract();

    this.lastTime = performance.now();
  }

  handleClick(x, y, detail = 1) {
    if (this.state === "paused") {
      if (
        this.isInside(
          x,
          y,
          this.buttons.pauseContinue
        )
      ) {
        this.resumeGame();
      } else if (
        this.isInside(
          x,
          y,
          this.buttons.pauseExit
        )
      ) {
        this.exitPause();
      }

      return;
    }

    if (this.state === "menu") {
      if (
        this.isInside(x, y, this.buttons.play)
      ) {
        this.resetGame();
        this.state = "comic";
      } else if (
        this.isInside(x, y, this.buttons.credits)
      ) {
        this.state = "credits";
      }

      return;
    }

    if (this.state === "comic") {
      this.comicIndex++;

      if (
        this.comicIndex >= this.comicTotal
      ) {
        this.comicIndex = 0;
        this.resetPlayerPosition();

        this.state = "playing";

        this.wasInteracting =
          this.player.wantsToInteract();
      }

      return;
    }

    if (this.state === "dialogue") {
      this.nextDialogue();
      return;
    }

    if (this.state === "victoryDialogue") {
      this.finishVictoryDialogue();
      return;
    }

    if (this.state === "credits") {
      if (
        this.isInside(x, y, this.buttons.back)
      ) {
        this.state = "menu";
      }

      return;
    }

    if (this.state === "rhythmIntro") {
      if (
        this.isInside(x, y, this.buttons.back)
      ) {
        this.exitRhythm();
      } else if (
        this.isInside(x, y, this.buttons.begin)
      ) {
        this.beginRhythm();
      }

      return;
    }

    if (this.state === "rhythmEnd") {
      if (
        this.isInside(x, y, this.buttons.back)
      ) {
        this.exitRhythm();
      } else if (
        this.isInside(x, y, this.buttons.restart)
      ) {
        this.startRhythm(this.battleMode);
      }

      return;
    }

    if (this.state === "rhythm") {
      if (
        this.isInside(x, y, this.buttons.back)
      ) {
        this.exitRhythm();
      } else {
        this.hitNote(x, y, detail);
      }
    }
  }

  update(deltaTime) {
    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => this.isPositionAllowed(x, y)
    );

    const interacting =
      this.player.wantsToInteract();

    if (
      interacting &&
      !this.wasInteracting
    ) {
      if (
        this.tutorialCompleted &&
        this.isNearDoor()
      ) {
        this.enterHallway();
        return;
      }

      if (
        !this.tutorialCompleted &&
        this.isNear(this.player, this.alien)
      ) {
        this.startDialogue();
        return;
      }
    }

    this.wasInteracting = interacting;
  }

  updateHallway(deltaTime) {
    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => {
        const feet =
          this.player.getFootPosition(x, y);

        return this.isPointInsidePolygon(
          feet,
          this.hallwayWalkableArea
        );
      }
    );

    const interacting =
      this.player.wantsToInteract();

    if (
      interacting &&
      !this.wasInteracting &&
      this.isNearHallwayLeftDoor()
    ) {
      this.enterInvestigationRoom();
      return;
    }

    this.wasInteracting = interacting;
  }

  updateInvestigation(deltaTime) {
    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) =>
        this.isInvestigationPositionAllowed(x, y)
    );

    const interacting =
      this.player.wantsToInteract();

    if (
      interacting &&
      !this.wasInteracting &&
      this.elvisDefeated &&
      this.isNearInvestigationExit()
    ) {
      this.enterHallway02();
      return;
    }

    if (
      interacting &&
      !this.wasInteracting &&
      this.isNearElvis()
    ) {
      this.startRhythm("elvis");
      return;
    }

    this.wasInteracting = interacting;
  }

  updateHallway02(deltaTime) {
    const interacting = this.player.wantsToInteract();

    if (this.activeStatue) {
      if (interacting && !this.wasInteracting) {
        this.activeStatue = null;
      }

      this.wasInteracting = interacting;
      return;
    }

    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => {
        const feet = this.player.getFootPosition(x, y);

        return this.isPointInsidePolygon(
          feet,
          this.hallway02WalkableArea
        );
      }
    );

    const nearDiscoDoor = this.isNearHallway02DiscoDoor();
    const nearbyStatue = nearDiscoDoor
      ? null
      : this.getNearbyHallway02Statue();

    if (
      interacting &&
      !this.wasInteracting &&
      nearDiscoDoor
    ) {
      this.enterDiscoRoom();
      return;
    }

    if (interacting && !this.wasInteracting && nearbyStatue) {
      this.activeStatue = nearbyStatue;
      this.wasInteracting = interacting;
      return;
    }

    this.wasInteracting = interacting;
  }

  updateDisco(deltaTime) {
    const interacting = this.player.wantsToInteract();

    if (this.activeMichaelDialogue >= 0) {
      this.wasInteracting = interacting;
      return;
    }

    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => this.isDiscoPositionAllowed(x, y)
    );

    if (
      !this.michaelDefeated &&
      interacting &&
      !this.wasInteracting &&
      this.isNearMichael()
    ) {
      this.activeMichaelDialogue = 0;
      this.wasInteracting = interacting;
      return;
    }

    this.wasInteracting = interacting;
  }

  isNearMichael() {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    return Math.hypot(
      feet.x - this.michaelPosition.x,
      feet.y - this.michaelPosition.y
    ) <= this.michaelPosition.radius;
  }

  getNearbyHallway02Statue() {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    return this.hallway02Statues.find(statue =>
      Math.hypot(
        feet.x - statue.x,
        feet.y - statue.y
      ) <= statue.radius
    ) || null;
  }

  isNearHallway02DiscoDoor() {
    const feet = this.player.getFootPosition(this.player.x, this.player.y);
    return Math.hypot(
      feet.x - this.hallway02DiscoDoor.x,
      feet.y - this.hallway02DiscoDoor.y
    ) <= this.hallway02DiscoDoor.radius;
  }

  isNearInvestigationExit() {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    return Math.hypot(
      feet.x - this.investigationExitDoor.x,
      feet.y - this.investigationExitDoor.y
    ) <= this.investigationExitDoor.radius;
  }

  isNearDoor() {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    return Math.hypot(
      feet.x - this.door.x,
      feet.y - this.door.y
    ) <= this.door.radius;
  }

  isNearHallwayLeftDoor() {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    return Math.hypot(
      feet.x - this.hallwayLeftDoor.x,
      feet.y - this.hallwayLeftDoor.y
    ) <= this.hallwayLeftDoor.radius;
  }

  isNearElvis() {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    const elvisX =
      this.elvisPosition.x +
      this.elvisPosition.width / 2;

    const elvisY =
      this.elvisPosition.y +
      this.elvisPosition.height;

    return Math.hypot(
      feet.x - elvisX,
      feet.y - elvisY
    ) <= 145;
  }

  enterHallway() {
    if (!this.tutorialCompleted) return;

    this.setPlayerFeetPosition(
      this.hallwaySpawn.x,
      this.hallwaySpawn.y
    );

    this.state = "hallway";

    this.wasInteracting =
      this.player.wantsToInteract();
  }

  enterInvestigationRoom() {
    this.setPlayerFeetPosition(
      this.investigationSpawn.x,
      this.investigationSpawn.y
    );

    this.state = "investigation";

    this.wasInteracting =
      this.player.wantsToInteract();
  }

  enterHallway02() {
    this.setPlayerFeetPosition(
      this.hallway02Spawn.x,
      this.hallway02Spawn.y
    );

    this.state = "hallway02";

    this.wasInteracting =
      this.player.wantsToInteract();
  }

  enterDiscoRoom() {
    this.setPlayerFeetPosition(this.discoSpawn.x, this.discoSpawn.y);
    this.player.direction = "west";
    this.player.currentFrames = this.player.idleFrames.west;
    this.player.frameIndex = 0;
    this.player.frameTimer = 0;
    this.player.moving = false;
    this.state = "disco";
    this.wasInteracting = this.player.wantsToInteract();
  }

  isDiscoPositionAllowed(x, y) {
    const feet = this.player.getFootPosition(x, y);

    if (!this.isPointInsidePolygon(feet, this.discoWalkableArea)) {
      return false;
    }

    for (const polygon of this.discoBlockedPolygons) {
      if (this.isPointInsidePolygon(feet, polygon)) {
        return false;
      }
    }

    return true;
  }

  startDialogue() {
    this.dialogueIndex = 0;
    this.state = "dialogue";
    this.wasInteracting = true;
  }

  nextDialogue() {
    if (this.state !== "dialogue") return;

    this.dialogueIndex++;

    if (
      this.dialogueIndex >=
      this.dialogues.length
    ) {
      this.dialogueIndex = 0;
      this.startRhythm("tutorial");
    }
  }

  finishVictoryDialogue() {
    if (
      this.state !== "victoryDialogue"
    ) {
      return;
    }

    if (this.battleMode === "michael") {
      this.michaelDefeated = true;
      this.activeMichaelDialogue = -1;
      this.state = "disco";
      this.wasInteracting = this.player.wantsToInteract();
      return;
    }

    this.state = "playing";

    this.wasInteracting =
      this.player.wantsToInteract();
  }

  isPositionAllowed(x, y) {
    const feet =
      this.player.getFootPosition(x, y);

    const currentWalkableArea =
  this.state === "hallway02"
    ? this.hallway02WalkableArea
    : this.walkableArea;

if (
  !this.isPointInsidePolygon(
    feet,
    currentWalkableArea
  )
) {
  return false;
}

    for (const area of this.blockedAreas) {
      if (
        feet.x >= area.x &&
        feet.x <= area.x + area.width &&
        feet.y >= area.y &&
        feet.y <= area.y + area.height
      ) {
        return false;
      }
    }

    return true;
  }

  isInvestigationPositionAllowed(x, y) {
    const feet =
      this.player.getFootPosition(x, y);

    if (
      !this.isPointInsidePolygon(
        feet,
        this.investigationWalkableArea
      )
    ) {
      return false;
    }

    for (
      const area of this.investigationBlockedAreas
    ) {
      if (
        feet.x >= area.x &&
        feet.x <= area.x + area.width &&
        feet.y >= area.y &&
        feet.y <= area.y + area.height
      ) {
        return false;
      }
    }

    return true;
  }

  isPointInsidePolygon(point, polygon) {
    let inside = false;

    for (
      let i = 0, j = polygon.length - 1;
      i < polygon.length;
      j = i++
    ) {
      const a = polygon[i];
      const b = polygon[j];

      const intersects =
        (a.y > point.y) !==
          (b.y > point.y) &&
        point.x <
          ((b.x - a.x) * (point.y - a.y)) /
          (b.y - a.y) + a.x;

      if (intersects) {
        inside = !inside;
      }
    }

    return inside;
  }

  isNear(player, target) {
    const px =
      player.x + player.width / 2;

    const py =
      player.y + player.height / 2;

    const tx =
      target.x + target.width / 2;

    const ty =
      target.y + target.height / 2;

    return Math.hypot(
      px - tx,
      py - ty
    ) < 120;
  }

  pauseGame() {
    if (this.state === "paused") return;

    this.previousState = this.state;

    this.videoWasPlaying =
      !this.backgroundVideo.paused;

    this.musicWasPlaying =
      !this.music.paused;

    this.backgroundVideo.pause();
    this.music.pause();

    this.state = "paused";
  }

  resumeGame() {
    if (this.state !== "paused") return;

    this.state =
      this.previousState || "playing";

    this.previousState = null;

    if (this.videoWasPlaying) {
      this.backgroundVideo
        .play()
        .catch(() => {});
    }

    if (
      this.musicWasPlaying &&
      this.state === "rhythm"
    ) {
      this.music.play().catch(error => {
        console.warn(error);
        this.musicError = true;
      });
    }

    this.videoWasPlaying = false;
    this.musicWasPlaying = false;

    this.lastTime = performance.now();

    this.wasInteracting =
      this.player.wantsToInteract();
  }

  exitPause() {
    if (this.state !== "paused") return;

    this.resetGame();

    this.backgroundVideo
      .play()
      .catch(() => {});

    this.state = "menu";
  }

  randomType() {
    const number = Math.random();

    if (number < 0.58) {
      return "circle";
    }

    if (number < 0.8) {
      return "double";
    }

    return "crossout";
  }

  buildChart() {
    const fullDuration = this.music.duration;
    const isMichael = this.battleMode === "michael";
    const isElvis = this.battleMode === "elvis";
    const duration = isMichael && Number.isFinite(fullDuration)
      ? Math.max(0, fullDuration - this.musicStartOffset)
      : fullDuration;

    let total = isMichael ? 48 : isElvis ? 36 : 24;
    let interval = isMichael ? 0.46 : isElvis ? 0.65 : 0.85;
    let first = isMichael ? 2.2 : 3;

    if (
      Number.isFinite(duration) &&
      duration > 0
    ) {
      first = isMichael
        ? 2.2
        : Math.min(3, Math.max(0.5, duration * 0.15));

      if (isMichael) {
        interval = Math.min(
          0.5,
          Math.max(
            0.34,
            (duration - first - 0.8) / 48
          )
        );

        total = Math.max(
          1,
          Math.min(
            48,
            Math.floor(
              (duration - first - 0.4) /
              interval
            )
          )
        );
      } else if (isElvis) {
        interval = Math.min(
          0.78,
          Math.max(
            0.56,
            (duration - first - 0.8) / 36
          )
        );

        total = Math.max(
          1,
          Math.min(
            36,
            Math.floor(
              (duration - first - 0.4) /
              interval
            )
          )
        );
      } else {
        interval = Math.min(
          1.1,
          Math.max(
            0.38,
            (duration - first - 0.8) / 25
          )
        );

        total = Math.max(
          1,
          Math.min(
            24,
            Math.floor(
              (duration - first - 0.4) /
              interval
            )
          )
        );
      }
    }

    const starIndex = total >= 8
      ? Math.floor(
          total *
          (0.35 + Math.random() * 0.3)
        )
      : -1;

    this.notes = [];

    let previousLane = -1;

    for (let i = 0; i < total; i++) {
      let lane = Math.floor(
        Math.random() *
        this.notePositions.length
      );

      if (lane === previousLane) {
        lane = (
          lane +
          1 +
          Math.floor(Math.random() * 3)
        ) % this.notePositions.length;
      }

      previousLane = lane;

      this.notes.push({
        id: i,
        x: this.notePositions[lane],
        type: i === starIndex
          ? "star"
          : this.randomType(),
        time: first + i * interval,
        status: "pending",
        firstClickTime: null
      });
    }
  }

  startRhythm(mode = "tutorial") {
    this.battleMode = mode;

    this.musicAttempt++;

    this.music.pause();
    this.music.playbackRate = 1;

    const musicPath = mode === "michael"
      ? "./assets/Michael Jackson - Thriller.wav"
      : "./assets/Queen - Another One Bites The Dust.wav";

    if (this.currentMusicPath !== musicPath) {
      this.currentMusicPath = musicPath;
      this.music.src = musicPath;
      this.music.load();
    }

    this.musicStartOffset = mode === "michael" ? 35 : 0;

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    if (
      typeof this.alien.stopDance ===
      "function"
    ) {
      this.alien.stopDance();
    }

    this.elvisDanceFrame = 0;
    this.elvisDanceTimer = 0;

    this.state = "rhythmIntro";

    this.wasInteracting =
      this.player.wantsToInteract();
  }

  beginRhythm() {
    if (
      this.state !== "rhythmIntro"
    ) {
      return;
    }

    this.musicAttempt++;
    const attemptId = this.musicAttempt;

    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;

    this.hits = 0;
    this.misses = 0;
    this.totalMisses = 0;
    this.avoidedTraps = 0;

    this.rhythmTime = 0;
    this.fallbackTime = 0;
    this.effects = [];

    this.elvisDanceFrame = 0;
    this.elvisDanceTimer = 0;
    this.michaelDanceFrame = 0;
    this.michaelDanceTimer = 0;

    this.feedback = "¡PREPÁRATE!";
    this.feedbackColor = "#a6ff00";
    this.feedbackTimer = 1.5;

    this.speedEffectUntil = 0;
    this.result = "";

    this.music.pause();
    this.music.playbackRate = 1;

    this.musicError = false;
    this.audioStarted = false;

    this.buildChart();

    this.state = "rhythm";

    if (
      this.battleMode === "tutorial" &&
      typeof this.alien.startDance ===
        "function"
    ) {
      this.alien.startDance();
    }

    const playbackReady =
      this.musicStartOffset > 0 &&
      this.music.readyState < 1 &&
      !this.music.error
        ? new Promise((resolve, reject) => {
            this.music.addEventListener("loadedmetadata", resolve, { once: true });
            this.music.addEventListener("error", reject, { once: true });
          })
        : Promise.resolve();

    playbackReady
      .then(() => {
        if (attemptId !== this.musicAttempt) {
          return false;
        }

        if (this.musicStartOffset > 0) {
          this.music.currentTime = this.musicStartOffset;
        }

        return this.music.play();
      })
      .then(result => {
        if (
          result === false ||
          attemptId !== this.musicAttempt
        ) {
          return;
        }

        this.audioStarted = true;

        if (this.state === "paused") {
          this.music.pause();
          this.musicWasPlaying = true;
        }
      })
      .catch(error => {
        if (
          attemptId !== this.musicAttempt
        ) {
          return;
        }

        console.warn(error);

        if (this.state === "rhythm") {
          this.musicError = true;

          this.showFeedback(
            "MODO PRÁCTICA SIN AUDIO",
            "#ffdc69"
          );
        }
      });
  }

  getRhythmTime(deltaTime) {
    if (
      !this.musicError &&
      !this.music.paused &&
      this.music.readyState >= 2
    ) {
      this.audioStarted = true;

      return Math.max(
        0,
        this.music.currentTime - this.musicStartOffset
      );
    }

    if (
      this.audioStarted &&
      !this.musicError
    ) {
      return this.rhythmTime;
    }

    if (this.musicError) {
      this.fallbackTime += deltaTime;

      return this.fallbackTime;
    }

    return this.rhythmTime;
  }

  updateRhythm(deltaTime) {
    this.rhythmTime =
      this.getRhythmTime(deltaTime);

    if (this.battleMode === "michael") {
      this.playerDanceTimer += deltaTime;

      while (this.playerDanceTimer >= this.playerDanceFrameDuration) {
        this.playerDanceTimer -= this.playerDanceFrameDuration;
        this.playerDanceFrame =
          (this.playerDanceFrame + 1) % this.playerDanceSprites.length;
      }
    }

    this.feedbackTimer = Math.max(
      0,
      this.feedbackTimer - deltaTime
    );

    for (const effect of this.effects) {
      effect.life -= deltaTime;
    }

    this.effects = this.effects.filter(
      effect => effect.life > 0
    );

    if (
      this.speedEffectUntil > 0 &&
      this.rhythmTime >=
        this.speedEffectUntil
    ) {
      this.music.playbackRate = 1;
      this.speedEffectUntil = 0;
    }

    for (const note of this.notes) {
      if (
        note.status !== "pending"
      ) {
        continue;
      }

      const allowedTime =
        note.type === "double"
          ? this.doubleHitWindow
          : this.hitWindow;

      const extraTime =
        note.type === "double" &&
        note.firstClickTime !== null
          ? 0.12
          : 0;

      if (
        this.rhythmTime >
        note.time + allowedTime + extraTime
      ) {
        if (
          note.type === "crossout"
        ) {
          note.status = "avoided";
          this.avoidedTraps++;
        } else if (
          note.type === "star"
        ) {
          note.status = "skipped";
        } else {
          note.status = "missed";
          this.registerMiss();
        }

        if (
          this.state !== "rhythm"
        ) {
          return;
        }
      }
    }

    this.checkRhythmEnd();
  }

  getNoteY(note) {
    const speed =
      this.battleMode === "michael"
        ? this.michaelNoteSpeed
        : this.battleMode === "elvis"
          ? this.elvisNoteSpeed
          : this.noteSpeed;

    return this.hitY -
      (note.time - this.rhythmTime) *
      speed;
  }

  getHittableNote(x) {
    let candidate = null;
    let bestDistance = Infinity;

    const speed =
      this.battleMode === "michael"
        ? this.michaelNoteSpeed
        : this.battleMode === "elvis"
          ? this.elvisNoteSpeed
          : this.noteSpeed;

    for (const note of this.notes) {
      if (
        note.status !== "pending"
      ) {
        continue;
      }

      const difference = Math.abs(
        this.rhythmTime - note.time
      );

      const distanceX = Math.abs(
        x - note.x
      );

      const allowedTime =
        note.type === "double"
          ? this.doubleHitWindow
          : this.hitWindow;

      const allowedRadius =
        note.type === "double"
          ? this.doubleHitRadius
          : 55;

      const extraTime =
        note.type === "double" &&
        note.firstClickTime !== null
          ? 0.12
          : 0;

      if (
        difference <= allowedTime + extraTime &&
        distanceX <= allowedRadius
      ) {
        const distance =
          difference * speed +
          distanceX * 0.15;

        if (
          distance < bestDistance
        ) {
          candidate = note;
          bestDistance = distance;
        }
      }
    }

    return candidate;
  }

  hitNote(x, y, detail = 1) {
    if (
      Math.abs(y - this.hitY) >
      this.doubleHitYRadius
    ) {
      return;
    }

    const note = this.getHittableNote(x);

    if (!note) {
      this.showFeedback(
        "FUERA DE TIEMPO",
        "#ff647a"
      );
      return;
    }

    const allowedY =
      note.type === "double"
        ? this.doubleHitYRadius
        : 55;

    if (
      Math.abs(y - this.hitY) >
      allowedY
    ) {
      return;
    }

    if (
      note.type === "crossout"
    ) {
      note.status = "trapHit";

      this.registerMiss();

      if (
        this.state === "rhythm"
      ) {
        this.showFeedback(
          "¡NO TOQUES LA EQUIS!",
          "#ff576d"
        );
      }

      this.checkRhythmEnd();
      return;
    }

    if (
      note.type === "double"
    ) {
      const now = performance.now();

      if (
        note.firstClickTime === null
      ) {
        note.firstClickTime = now;

        this.showFeedback(
          "¡SEGUNDO CLIC!",
          "#ffdc69"
        );

        return;
      }

      if (
        now - note.firstClickTime >
        this.doubleClickDelay
      ) {
        note.firstClickTime = now;

        this.showFeedback(
          "¡SEGUNDO CLIC!",
          "#ffdc69"
        );

        return;
      }
    }

    note.status = "hit";

    const difference = Math.abs(
      this.rhythmTime - note.time
    );

    let points =
      difference <= this.perfectWindow
        ? 150
        : 100;

    let feedbackMessage = "¡PERFECT!";
    let feedbackColor = "#a6ff00";

    if (
      note.type === "double"
    ) {
      points = 200;
      feedbackMessage = "¡DOBLE CLIC!";
    }

    if (
      note.type === "star"
    ) {
      points = 300;

      const randomEffect = Math.random();

      if (randomEffect < 0.5) {
        this.music.playbackRate =
          this.starSlowSpeed;

        feedbackMessage =
          "¡ESTRELLA! MÚSICA LENTA";

        feedbackColor = "#53ddff";
      } else {
        this.music.playbackRate =
          this.starFastSpeed;

        feedbackMessage =
          "¡ESTRELLA! MÚSICA RÁPIDA";

        feedbackColor = "#ffdc69";
      }

      this.speedEffectUntil =
        this.rhythmTime +
        this.starEffectDuration;
    }

    this.registerHit(points);

    this.showFeedback(
      feedbackMessage,
      feedbackColor
    );

    this.addEffect(
      note.x,
      this.hitY,
      feedbackColor
    );

    this.checkRhythmEnd();
  }

  registerHit(points) {
    this.hits++;
    this.combo++;

    this.bestCombo = Math.max(
      this.bestCombo,
      this.combo
    );

    this.score +=
      points +
      Math.min(this.combo * 5, 100);

    this.misses = 0;
  }

  registerMiss() {
    this.misses++;
    this.totalMisses++;
    this.combo = 0;

    this.showFeedback(
      `ERROR ${this.misses}/${this.maxErrors}`,
      "#ff576d"
    );

    if (
      this.misses >= this.maxErrors
    ) {
      this.endRhythm(false);
    }
  }

  showFeedback(message, color) {
    this.feedback = message;
    this.feedbackColor = color;
    this.feedbackTimer = 0.8;
  }

  addEffect(x, y, color) {
    this.effects.push({
      x,
      y,
      color,
      life: 0.5
    });
  }

  checkRhythmEnd() {
    if (
      this.state !== "rhythm"
    ) {
      return;
    }

    if (
      this.notes.length > 0 &&
      this.notes.every(
        note => note.status !== "pending"
      )
    ) {
      this.endRhythm(true);
    }
  }

  finishRemainingNotes() {
    if (
      this.state !== "rhythm"
    ) {
      return;
    }

    for (const note of this.notes) {
      if (
        note.status !== "pending"
      ) {
        continue;
      }

      if (
        note.type === "crossout"
      ) {
        note.status = "avoided";
        this.avoidedTraps++;
      } else if (
        note.type === "star"
      ) {
        note.status = "skipped";
      } else {
        note.status = "missed";
        this.registerMiss();
      }

      if (
        this.state !== "rhythm"
      ) {
        return;
      }
    }

    this.checkRhythmEnd();
  }

  endRhythm(won) {
    if (
      this.state !== "rhythm"
    ) {
      return;
    }

    this.musicAttempt++;

    this.music.pause();
    this.music.playbackRate = 1;

    this.speedEffectUntil = 0;

    if (
      typeof this.alien.stopDance ===
      "function"
    ) {
      this.alien.stopDance();
    }

    this.result = won
      ? "victory"
      : "defeat";

    if (
      this.battleMode === "elvis"
    ) {
      if (won) {
        this.elvisDefeated = true;
      }

      this.state = "rhythmEnd";
    } else if (this.battleMode === "michael") {
      this.state = won
        ? "victoryDialogue"
        : "rhythmEnd";
    } else if (won) {
      this.tutorialCompleted = true;
      this.state = "victoryDialogue";
    } else {
      this.state = "rhythmEnd";
    }
  }

  exitRhythm() {
    this.musicAttempt++;

    this.music.pause();
    this.music.playbackRate = 1;

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    if (
      typeof this.alien.stopDance ===
      "function"
    ) {
      this.alien.stopDance();
    }

    this.speedEffectUntil = 0;

    this.state =
      this.battleMode === "elvis"
        ? "investigation"
        : this.battleMode === "michael"
          ? "disco"
          : "playing";

    this.wasInteracting =
      this.player.wantsToInteract();
  }

  startSliderAt(x, y) {
    return false;
  }

  moveSlider(x, y) {}

  finishSlider(success) {}

  drawImageBackground(image) {
    const ctx = this.context;

    ctx.fillStyle = "#080b23";
    ctx.fillRect(0, 0, 1280, 720);

    if (
      image &&
      image.complete &&
      image.naturalWidth > 0
    ) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        0,
        0,
        1280,
        720
      );

      ctx.restore();
    }
  }

  drawBackground() {
    const ctx = this.context;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1280, 720);

    if (
      this.backgroundVideo.readyState >= 2
    ) {
      ctx.drawImage(
        this.backgroundVideo,
        0,
        0,
        1280,
        720
      );
    }

    ctx.fillStyle =
      "rgba(5,3,18,0.42)";

    ctx.fillRect(0, 0, 1280, 720);
  }

  drawDuelRoom() {
    this.drawImageBackground(this.duelRoom);
  }

  drawHallwayBackground() {
    this.drawImageBackground(this.hallwayImage);
  }

  drawHallway02Background() {
    this.drawImageBackground(this.hallway02Image);
  }

  drawDiscoBackground() {
    this.drawImageBackground(this.discoRoom);
  }

  drawInvestigationBackground() {
    this.drawImageBackground(
      this.investigationRoom
    );
  }

  drawRhythmBackground() {
    if (this.battleMode === "michael") {
      this.drawDiscoBackground();
    } else if (
      this.battleMode === "elvis"
    ) {
      this.drawInvestigationBackground();
    } else {
      this.drawDuelRoom();
    }
  }

  drawContainedImage(image, area) {
    if (
      !image ||
      !image.complete ||
      !image.naturalWidth
    ) {
      return;
    }

    const scale = Math.min(
      area.width / image.naturalWidth,
      area.height / image.naturalHeight
    );

    const width =
      image.naturalWidth * scale;

    const height =
      image.naturalHeight * scale;

    const x =
      area.x +
      (area.width - width) / 2;

    const y =
      area.y +
      (area.height - height) / 2;

    this.context.drawImage(
      image,
      x,
      y,
      width,
      height
    );
  }

  drawSprite(image, x, y, size, color) {
    const ctx = this.context;

    if (
      image &&
      image.complete &&
      image.naturalWidth > 0
    ) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        image,
        x - size / 2,
        y - size / 2,
        size,
        size
      );

      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = color;

      ctx.beginPath();
      ctx.arc(
        x,
        y,
        size * 0.34,
        0,
        Math.PI * 2
      );

      ctx.fill();
      ctx.restore();
    }
  }

  drawElvis(x, y, width, height) {
    const ctx = this.context;
    let sprite = this.elvisSprite;

    if (
      this.battleMode === "elvis" &&
      (
        this.state === "rhythm" ||
        (
          this.state === "paused" &&
          this.previousState === "rhythm"
        )
      )
    ) {
      const danceSprite =
        this.elvisDanceSprites[
          this.elvisDanceFrame
        ];

      if (
        danceSprite &&
        danceSprite.complete &&
        danceSprite.naturalWidth > 0
      ) {
        sprite = danceSprite;
      }
    }

    if (
      !sprite ||
      !sprite.complete ||
      sprite.naturalWidth === 0
    ) {
      return;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      sprite,
      x,
      y,
      width,
      height
    );

    ctx.restore();
  }

  drawCharacters() {
    const ctx = this.context;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    ctx.translate(
      80 - this.player.x,
      355 - this.player.y
    );

    if (this.battleMode === "michael") {
      const danceSprite = this.playerDanceSprites[this.playerDanceFrame];

      if (danceSprite && danceSprite.complete && danceSprite.naturalWidth > 0) {
        ctx.drawImage(
          danceSprite,
          this.player.x,
          this.player.y,
          this.player.width,
          this.player.height
        );
      } else {
        this.player.draw(ctx);
      }
    } else {
      this.player.draw(ctx);
    }

    ctx.restore();

    if (this.battleMode === "elvis") {
      this.drawElvis(
        950,
        255,
        260,
        340
      );
    } else if (this.battleMode === "michael") {
      this.drawMichael(
        950,
        255,
        260,
        340
      );
    } else {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      ctx.translate(
        990 - this.alien.x,
        365 - this.alien.y
      );

      this.alien.draw(ctx);
      ctx.restore();
    }
  }

  drawMichael(x, y, width, height) {
    const ctx = this.context;
    let sprite = this.michaelSprite;

    if (
      this.battleMode === "michael" &&
      (
        this.state === "rhythm" ||
        (
          this.state === "paused" &&
          this.previousState === "rhythm"
        )
      )
    ) {
      const danceSprite =
        this.michaelDanceSprites[this.michaelDanceFrame];

      if (
        danceSprite &&
        danceSprite.complete &&
        danceSprite.naturalWidth > 0
      ) {
        sprite = danceSprite;
      }
    }

    if (
      !sprite ||
      !sprite.complete ||
      sprite.naturalWidth === 0
    ) {
      return;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, x, y, width, height);
    ctx.restore();
  }

  drawWrappedText(
    text,
    x,
    y,
    maxWidth,
    lineHeight
  ) {
    const ctx = this.context;
    const words = text.split(" ");
    let line = "";

    for (const word of words) {
      const nextLine = line
        ? line + " " + word
        : word;

      if (
        ctx.measureText(nextLine).width >
          maxWidth &&
        line
      ) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = nextLine;
      }
    }

    if (line) {
      ctx.fillText(line, x, y);
    }
  }

  drawDialogueBox(speaker, text, hint) {
    const ctx = this.context;

    const color =
      speaker === "FREDDIE"
        ? "#a6ff00"
        : "#53ddff";

    ctx.fillStyle =
      "rgba(3,2,15,0.55)";

    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle =
      "rgba(18,13,46,0.97)";

    ctx.fillRect(75, 455, 1130, 225);

    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.strokeRect(75, 455, 1130, 225);

    ctx.textAlign = "left";
    ctx.fillStyle = color;
    ctx.font = "bold 27px Silkscreen";

    ctx.fillText(
      speaker,
      115,
      505
    );

    if (
      speaker === "FREDDIE"
    ) {
      ctx.font = "16px Silkscreen";
      ctx.fillStyle = "#c8c4d8";

      ctx.fillText(
        "Freddielux Mercury-9000",
        265,
        503
      );
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "19px Silkscreen";

    this.drawWrappedText(
      text,
      115,
      547,
      1040,
      27
    );

    ctx.fillStyle = color;
    ctx.font = "bold 14px Silkscreen";
    ctx.textAlign = "right";

    ctx.fillText(
      hint,
      1150,
      646
    );

    ctx.textAlign = "start";
  }

  draw() {
    if (this.state === "paused") {
      this.drawPause();
    } else if (this.state === "menu") {
      this.drawMenu();
    } else if (this.state === "comic") {
      this.drawComic();
    } else if (this.state === "credits") {
      this.drawCredits();
    } else if (this.state === "dialogue") {
      this.drawDialogue();
    } else if (
      this.state === "victoryDialogue"
    ) {
      this.drawVictoryDialogue();
    } else if (
      this.state === "rhythmIntro"
    ) {
      this.drawRhythmIntro();
    } else if (
      this.state === "rhythm"
    ) {
      this.drawRhythm();
    } else if (
      this.state === "rhythmEnd"
    ) {
      this.drawRhythmEnd();
    } else if (
      this.state === "hallway"
    ) {
      this.drawHallway();
    } else if (
      this.state === "hallway02"
    ) {
      this.drawHallway02();
    } else if (
      this.state === "investigation"
    ) {
      this.drawInvestigation();
    } else if (
      this.state === "disco"
    ) {
      this.drawDisco();
    } else {
      this.drawGame();
    }
  }

  drawComic() {
    const ctx = this.context;

    ctx.fillStyle = "#101225";
    ctx.fillRect(0, 0, 1280, 720);

    if (
      !this.comicImage.complete ||
      !this.comicImage.naturalWidth
    ) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "24px Silkscreen";

      ctx.fillText(
        "Cargando cómic...",
        640,
        360
      );

      return;
    }

    const frameWidth =
      this.comicImage.naturalWidth / 2;

    const frameHeight =
      this.comicImage.naturalHeight / 2;

    const column =
      this.comicIndex % 2;

    const row =
      Math.floor(this.comicIndex / 2);

    const scale = Math.min(
      1050 / frameWidth,
      580 / frameHeight
    );

    const drawWidth =
      frameWidth * scale;

    const drawHeight =
      frameHeight * scale;

    const drawX =
      (1280 - drawWidth) / 2;

    const drawY =
      (720 - drawHeight) / 2 - 20;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      this.comicImage,
      column * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    ctx.textAlign = "center";

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 21px Silkscreen";

    ctx.fillText(
      `${this.comicIndex + 1} / ${this.comicTotal}`,
      640,
      655
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "19px Silkscreen";

    ctx.fillText(
      this.comicIndex === 3
        ? "HAZ CLIC PARA ENTRAR A LA SALA"
        : "HAZ CLIC PARA CONTINUAR",
      640,
      690
    );
  }

  drawDialogue() {
    this.drawDuelRoom();

    this.alien.draw(this.context);
    this.player.draw(this.context);

    const dialogue =
      this.dialogues[this.dialogueIndex];

    if (!dialogue) return;

    this.drawDialogueBox(
      dialogue.speaker,
      dialogue.text,
      this.dialogueIndex ===
        this.dialogues.length - 1
        ? "CLIC PARA INICIAR EL TUTORIAL >"
        : "CLIC PARA CONTINUAR >"
    );
  }

  drawVictoryDialogue() {
    if (this.battleMode === "michael") {
      this.drawDiscoBackground();
      this.drawMichaelConversation(
        this.michaelVictoryText,
        "HAZ CLIC PARA TERMINAR"
      );
      return;
    }

    this.drawDuelRoom();

    this.alien.draw(this.context);
    this.player.draw(this.context);

    const ctx = this.context;

    ctx.textAlign = "center";
    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 36px Silkscreen";

    ctx.fillText(
      "¡TUTORIAL COMPLETADO!",
      640,
      170
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px Silkscreen";

    ctx.fillText(
      `PUNTUACIÓN ${this.score}`,
      640,
      225
    );

    this.drawDialogueBox(
      "FREDDIE",
      "¡Eres muy bueno! Te dejaré pasar nada más porque rompiste la pista.",
      "CLIC PARA CONTINUAR >"
    );
  }

  drawHallway() {
    const ctx = this.context;

    this.drawHallwayBackground();
    this.player.draw(ctx);

    if (
      this.isNearHallwayLeftDoor()
    ) {
      ctx.save();

      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Silkscreen";

      ctx.fillText(
        "Presiona E para entrar a la sala",
        640,
        675
      );

      ctx.restore();
    }
  }

  drawHallway02() {
    const ctx = this.context;

    this.drawHallway02Background();
    this.player.draw(ctx);

    if (this.activeStatue) {
      this.drawStatueDialogue();
      return;
    }

    if (this.isNearHallway02DiscoDoor()) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Silkscreen";
      ctx.fillText("PRESIONA E PARA ENTRAR A LA SALA", 640, 675);
      ctx.restore();
    } else if (this.getNearbyHallway02Statue()) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Silkscreen";
      ctx.fillText("PRESIONA E PARA OBSERVAR", 640, 675);
      ctx.restore();
    }
  }

  drawStatueDialogue() {
    const ctx = this.context;
    const statue = this.activeStatue;

    if (!statue) return;

    ctx.save();

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawContainedImage(statue.image, {
      x: 410,
      y: 95,
      width: 460,
      height: 340
    });

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "21px Silkscreen";

    const words = statue.dialogue.split(" ");
    const lines = [];
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;

      if (ctx.measureText(testLine).width > 610 && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) lines.push(line);

    lines.forEach((text, index) => {
      ctx.fillText(text, 640, 485 + index * 32);
    });

    ctx.fillStyle = "#a6ff00";
    ctx.font = "16px Silkscreen";

    ctx.fillText(
      "PRESIONA E PARA CONTINUAR",
      640,
      615
    );

    ctx.restore();
  }

  drawDisco() {
    const ctx = this.context;
    this.drawDiscoBackground();

    this.drawContainedImage(this.michaelSprite, {
      x: this.michaelPosition.x - this.michaelPosition.width / 2,
      y: this.michaelPosition.y - this.michaelPosition.height,
      width: this.michaelPosition.width,
      height: this.michaelPosition.height
    });

    this.player.draw(ctx);

    if (this.activeMichaelDialogue >= 0) {
      this.drawMichaelDialogue();
   
    } else if (this.isNearMichael()) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Silkscreen";
      ctx.fillText("PRESIONA E PARA HABLAR", 640, 675);
      ctx.restore();
    }
  }

  drawMichaelDialogue() {
    const dialogue = this.michaelDialogue[this.activeMichaelDialogue];

    if (!dialogue) return;

    this.drawMichaelConversation(
      dialogue,
      "HAZ CLIC PARA CONTINUAR"
    );
  }

  drawMichaelConversation(text, hint) {
    const ctx = this.context;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawConversationPortrait(
      this.michaelDialoguePortrait,
      -20,
      -70,
      620,
      560,
      1
    );

    this.drawConversationPortrait(
      this.playerDialoguePortrait,
      925,
      165,
      300,
      325,
      0.35
    );

    ctx.fillStyle = "rgba(5, 4, 18, 0.96)";
    ctx.fillRect(180, 490, 920, 185);

    ctx.strokeStyle = "#e85cff";
    ctx.lineWidth = 5;
    ctx.strokeRect(180, 490, 920, 185);

    ctx.fillStyle = "#ff8cff";
    ctx.textAlign = "left";
    ctx.font = "bold 23px Silkscreen";
    ctx.fillText("ALIEN MICHAEL JACKSON", 220, 530);

    ctx.fillStyle = "#777b8f";
    ctx.textAlign = "right";
    ctx.font = "bold 17px Silkscreen";
    ctx.fillText("NOAH", 1060, 530);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.font = "19px Silkscreen";

    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;

      if (ctx.measureText(candidate).width > 830 && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }

    if (line) lines.push(line);

    lines.slice(0, 3).forEach((lineText, index) => {
      ctx.fillText(lineText, 220, 572 + index * 28);
    });

    ctx.fillStyle = "#ff8cff";
    ctx.textAlign = "right";
    ctx.font = "15px Silkscreen";
    ctx.fillText(hint, 1070, 650);
    ctx.restore();
  }

  drawConversationPortrait(image, x, y, width, height, opacity) {
    const ctx = this.context;

    if (
      !image ||
      !image.complete ||
      image.naturalWidth === 0
    ) {
      return;
    }

    const scale = Math.min(
      width / image.naturalWidth,
      height / image.naturalHeight
    );

    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      image,
      x + (width - drawWidth) / 2,
      y + (height - drawHeight) / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();
  }

  drawInvestigation() {
    const ctx = this.context;

    this.drawInvestigationBackground();

    this.drawElvis(
      this.elvisPosition.x,
      this.elvisPosition.y,
      this.elvisPosition.width,
      this.elvisPosition.height
    );

    this.player.draw(ctx);

    if (
      this.isNearElvis()
    ) {
      ctx.save();

      ctx.textAlign = "center";
      ctx.fillStyle = "#a6ff00";
      ctx.font = "bold 18px Silkscreen";

      ctx.fillText(
        this.elvisDefeated
          ? "Presiona E para volver a desafiar a Elvis"
          : "Presiona E para desafiar a Elvis",
        640,
        690
      );

      ctx.restore();
    }

    if (
      this.elvisDefeated &&
      this.isNearInvestigationExit()
    ) {
      ctx.save();

      ctx.textAlign = "center";
      ctx.fillStyle = "#a6ff00";
      ctx.font = "bold 18px Silkscreen";

      ctx.fillText(
        "Presiona E para pasar al Pasillo02",
        640,
        690
      );

      ctx.restore();
    }
  }

  drawPause() {
    const ctx = this.context;

    if (
      this.previousState === "playing"
    ) {
      this.drawGame();
    } else if (
      this.previousState === "comic"
    ) {
      this.drawComic();
    } else if (
      this.previousState === "dialogue"
    ) {
      this.drawDialogue();
    } else if (
      this.previousState === "victoryDialogue"
    ) {
      this.drawVictoryDialogue();
    } else if (
      this.previousState === "rhythm"
    ) {
      this.drawRhythm();
    } else if (
      this.previousState === "rhythmIntro"
    ) {
      this.drawRhythmIntro();
    } else if (
      this.previousState === "rhythmEnd"
    ) {
      this.drawRhythmEnd();
    } else if (
      this.previousState === "hallway"
    ) {
      this.drawHallway();
    } else if (
      this.previousState === "hallway02"
    ) {
      this.drawHallway02();
    } else if (
      this.previousState === "investigation"
    ) {
      this.drawInvestigation();
    } else if (
      this.previousState === "disco"
    ) {
      this.drawDisco();
    }

    ctx.fillStyle =
      "rgba(0,0,0,0.70)";

    ctx.fillRect(0, 0, 1280, 720);

    if (
      this.pauseImage.complete &&
      this.pauseImage.naturalWidth > 0
    ) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(
        this.pauseImage,
        0,
        0,
        1280,
        720
      );

      ctx.restore();
    } else {
      ctx.textAlign = "center";

      ctx.fillStyle = "#a6ff00";
      ctx.font = "bold 70px Silkscreen";

      ctx.fillText(
        "PAUSA",
        640,
        315
      );

      ctx.fillStyle = "#32e6ff";
      ctx.fillRect(475, 443, 307, 67);

      ctx.fillStyle = "#8000c8";
      ctx.font = "bold 27px Silkscreen";

      ctx.fillText(
        "CONTINUAR",
        640,
        488
      );

      ctx.fillStyle = "#8000c8";
      ctx.fillRect(475, 520, 307, 66);

      ctx.fillStyle = "#32e6ff";

      ctx.fillText(
        "SALIR",
        640,
        565
      );
    }
  }

  drawMenu() {
    this.drawBackground();

    this.drawContainedImage(
      this.logo,
      {
        x: 145,
        y: 30,
        width: 990,
        height: 390
      }
    );

    this.drawContainedImage(
      this.playImage,
      this.buttons.play
    );

    this.drawContainedImage(
      this.creditsImage,
      this.buttons.credits
    );
  }

  drawCredits() {
    const ctx = this.context;

    this.drawBackground();
    ctx.textAlign = "center";

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 44px Silkscreen";

    ctx.fillText(
      "CREDITS",
      640,
      75
    );

    this.drawContainedImage(
      this.studioLogo,
      {
        x: 490,
        y: 100,
        width: 300,
        height: 250
      }
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 25px Silkscreen";

    ctx.fillText(
      "DOUBLE M STUDIO",
      640,
      385
    );

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 17px Silkscreen";

    ctx.fillText(
      "DESARROLLO DEL VIDEOJUEGO",
      640,
      425
    );

    ctx.fillStyle = "#c8c4d8";
    ctx.font = "18px Silkscreen";

    ctx.fillText(
      "Desarrollado por",
      640,
      465
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Silkscreen";

    ctx.fillText(
      "Mariana A. Reyes",
      640,
      505
    );

    ctx.fillText(
      "Oscar Michel Ortega Martinez",
      640,
      540
    );

    ctx.fillStyle = "#a6ff00";
    ctx.font = "16px Silkscreen";

    ctx.fillText(
      "ABDUCCIÓN DISCO",
      640,
      585
    );

    this.drawBackButton();
  }

  drawBackButton() {
    const ctx = this.context;

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Silkscreen";

    ctx.fillText(
      "← BACK",
      35,
      55
    );
  }

  drawGame() {
    const ctx = this.context;

    this.drawDuelRoom();

    this.alien.draw(ctx);
    this.player.draw(ctx);

    ctx.textAlign = "center";

    if (
      !this.tutorialCompleted &&
      this.isNear(this.player, this.alien)
    ) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "18px Silkscreen";

      ctx.fillText(
        "Presiona E para hablar con Freddie",
        640,
        675
      );
    }

    if (this.tutorialCompleted) {
      ctx.fillStyle = "#ffffff";

      if (this.isNearDoor()) {
        ctx.font = "bold 20px Silkscreen";

        ctx.fillText(
          "Presiona E para entrar al pasillo",
          640,
          675
        );
      } else {
        ctx.font = "16px Silkscreen";

        ctx.fillText(
          "Dirígete a la puerta de cristal de la izquierda",
          640,
          675
        );
      }
    }

    ctx.textAlign = "start";
  }

  drawRhythmIntro() {
    if (this.battleMode === "elvis") {
      this.drawElvisIntro();
      return;
    }

    if (this.battleMode === "michael") {
      this.drawMichaelIntro();
      return;
    }

    const ctx = this.context;

    this.drawDuelRoom();

    ctx.fillStyle =
      "rgba(5,3,22,0.94)";

    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.fillStyle = "#15112e";
    ctx.fillRect(340, 65, 600, 625);

    ctx.strokeStyle = "#8e45dc";
    ctx.lineWidth = 4;
    ctx.strokeRect(340, 65, 600, 625);

    ctx.textAlign = "center";

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 29px Silkscreen";

    ctx.fillText(
      "TUTORIAL DE RITMO",
      640,
      115
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "17px Silkscreen";

    ctx.fillText(
      "Conoce las notas antes del duelo",
      640,
      150
    );

    const items = [
      {
        image: this.normalSprite,
        title: "CÍRCULO",
        description: "Un clic cuando toque la línea",
        y: 215
      },
      {
        image: this.doubleSprite,
        title: "CÍRCULO DOBLE",
        description: "Dos clics rápidos en la línea",
        y: 320
      },
      {
        image: this.starSprite,
        title: "ESTRELLA ESPECIAL",
        description: "Acelera o ralentiza la música al azar",
        y: 420
      },
      {
        image: this.crossoutSprite,
        title: "TACHE / EQUIS",
        description: "No lo presiones: es una trampa",
        y: 525
      }
    ];

    for (const item of items) {
      this.drawSprite(
        item.image,
        410,
        item.y,
        72,
        "#b970ff"
      );

      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Silkscreen";

      ctx.fillText(
        item.title,
        460,
        item.y - 6
      );

      ctx.font = "14px Silkscreen";

      ctx.fillText(
        item.description,
        460,
        item.y + 20
      );
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffdc69";
    ctx.font = "15px Silkscreen";

    ctx.fillText(
      "3 errores seguidos = derrota",
      640,
      588
    );

    const button = this.buttons.begin;

    ctx.fillStyle = "#a6ff00";

    ctx.fillRect(
      button.x,
      button.y,
      button.width,
      button.height
    );

    ctx.fillStyle = "#101225";
    ctx.font = "bold 23px Silkscreen";

    ctx.fillText(
      "INICIAR DUELO",
      640,
      656
    );

    this.drawBackButton();
  }

  drawMichaelIntro() {
    const ctx = this.context;

    this.drawRhythmBackground();

    ctx.fillStyle = "rgba(5,3,22,0.88)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ff60b6";
    ctx.font = "bold 42px Silkscreen";
    ctx.fillText("SEGUNDA BATALLA", 640, 130);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 31px Silkscreen";
    ctx.fillText("MICHAEL JACKSON VS PROTAGONISTA", 640, 200);

    ctx.font = "21px Silkscreen";
    ctx.fillText("Demuestra que puedes seguir el ritmo de la leyenda", 640, 280);

    ctx.fillStyle = "#ffdc69";
    ctx.font = "bold 21px Silkscreen";
    ctx.fillText("¡MÁS VELOCIDAD Y MÁS NOTAS!", 640, 340);
    ctx.fillText("3 ERRORES SEGUIDOS = DERROTA", 640, 380);

    const button = this.buttons.begin;

    ctx.fillStyle = "#a6ff00";
    ctx.fillRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = "#101225";
    ctx.font = "bold 23px Silkscreen";
    ctx.fillText("INICIAR BATALLA", 640, 656);

    this.drawBackButton();
  }

  drawElvisIntro() {
    const ctx = this.context;

    this.drawInvestigationBackground();

    ctx.fillStyle =
      "rgba(5,3,22,0.88)";

    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";

    ctx.fillStyle = "#ffdc69";
    ctx.font = "bold 42px Silkscreen";

    ctx.fillText(
      "PRIMERA BATALLA",
      640,
      130
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 31px Silkscreen";

    ctx.fillText(
      "ELVIS VS PROTAGONISTA",
      640,
      200
    );

    ctx.font = "21px Silkscreen";

    ctx.fillText(
      "Demuestra quién domina la pista de baile",
      640,
      280
    );

    ctx.fillStyle = "#ff60b6";
    ctx.font = "bold 21px Silkscreen";

    ctx.fillText(
      "3 ERRORES SEGUIDOS = DERROTA",
      640,
      340
    );

    const button = this.buttons.begin;

    ctx.fillStyle = "#a6ff00";

    ctx.fillRect(
      button.x,
      button.y,
      button.width,
      button.height
    );

    ctx.fillStyle = "#101225";
    ctx.font = "bold 23px Silkscreen";

    ctx.fillText(
      "INICIAR BATALLA",
      640,
      656
    );

    this.drawBackButton();
  }

  drawRhythm() {
    const ctx = this.context;

    this.drawRhythmBackground();

    ctx.fillStyle =
      "rgba(5,3,22,0.91)";

    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 30px Silkscreen";

    ctx.fillText(
      this.battleMode === "michael"
        ? "BATALLA 2: MICHAEL JACKSON"
        : this.battleMode === "elvis"
          ? "BATALLA 1: ELVIS"
          : "TUTORIAL DE RITMO",
      640,
      55
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Silkscreen";

    ctx.fillText(
      `PUNTOS ${this.score}`,
      175,
      145
    );

    ctx.fillStyle = "#ff60b6";

    ctx.fillText(
      `COMBO x${this.combo}`,
      1100,
      145
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "17px Silkscreen";

    ctx.fillText(
      `ACIERTOS ${this.hits}`,
      175,
      210
    );

    ctx.fillText(
      `ERRORES ${this.misses}/3`,
      1100,
      210
    );

    ctx.fillStyle = "#15112e";

    ctx.fillRect(
      this.trackLeft,
      105,
      this.trackRight - this.trackLeft,
      520
    );

    ctx.strokeStyle = "#8e45dc";
    ctx.lineWidth = 4;

    ctx.strokeRect(
      this.trackLeft,
      105,
      this.trackRight - this.trackLeft,
      520
    );

    const laneColors = [
      "#b970ff",
      "#32e6ff",
      "#55ff83",
      "#ff60b6"
    ];

    for (
      let i = 0;
      i < this.notePositions.length;
      i++
    ) {
      const x = this.notePositions[i];

      ctx.fillStyle =
        i % 2 === 0
          ? "rgba(100,55,170,0.10)"
          : "rgba(25,150,180,0.08)";

      ctx.fillRect(
        x - 58,
        110,
        116,
        510
      );

      ctx.strokeStyle = laneColors[i];
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(x - 58, 110);
      ctx.lineTo(x - 58, 620);
      ctx.stroke();

      ctx.globalAlpha = 1;
    }

    ctx.save();

    ctx.strokeStyle = "#53ddff";
    ctx.lineWidth = 6;
    ctx.shadowColor = "#53ddff";
    ctx.shadowBlur = 20;

    ctx.beginPath();

    ctx.moveTo(
      this.trackLeft,
      this.hitY
    );

    ctx.lineTo(
      this.trackRight,
      this.hitY
    );

    ctx.stroke();
    ctx.restore();

    for (const note of this.notes) {
      if (
        note.status !== "pending"
      ) {
        continue;
      }

      const y = this.getNoteY(note);

      if (
        y < 90 ||
        y > 640
      ) {
        continue;
      }

      let sprite;
      let color;
      let size;

      if (
        note.type === "circle"
      ) {
        sprite = this.normalSprite;
        color = "#b970ff";
        size = 80;
      } else if (
        note.type === "double"
      ) {
        sprite = this.doubleSprite;
        color = "#ff65bf";
        size = 85;
      } else if (
        note.type === "star"
      ) {
        sprite = this.starSprite;
        color = "#ffdc69";
        size = 85;
      } else {
        sprite = this.crossoutSprite;
        color = "#ff576d";
        size = 95;
      }

      this.drawSprite(
        sprite,
        note.x,
        y,
        size,
        color
      );
    }

    for (const effect of this.effects) {
      const progress =
        1 - effect.life / 0.5;

      ctx.save();

      ctx.globalAlpha = Math.max(
        0,
        effect.life / 0.5
      );

      ctx.strokeStyle = effect.color;
      ctx.lineWidth = 5;

      ctx.beginPath();

      ctx.arc(
        effect.x,
        effect.y,
        30 + progress * 70,
        0,
        Math.PI * 2
      );

      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "#b8edff";
    ctx.font = "15px Silkscreen";

    ctx.fillText(
      this.battleMode === "elvis"
        ? "SIGUE EL RITMO Y VENCE A ELVIS"
        : "HAZ CLIC CUANDO LA NOTA TOQUE LA LÍNEA",
      640,
      651
    );

    if (
      this.feedbackTimer > 0
    ) {
      ctx.fillStyle =
        this.feedbackColor;

      ctx.font = "bold 20px Silkscreen";

      ctx.fillText(
        this.feedback,
        640,
        94
      );
    }

    if (
      this.music.playbackRate !== 1
    ) {
      ctx.fillStyle =
        this.music.playbackRate > 1
          ? "#ffdc69"
          : "#53ddff";

      ctx.font = "16px Silkscreen";

      ctx.fillText(
        `VELOCIDAD x${this.music.playbackRate.toFixed(2)}`,
        1100,
        270
      );
    }

    this.drawBackButton();
  }

  drawRhythmEnd() {
    const ctx = this.context;

    this.drawRhythmBackground();

    ctx.fillStyle =
      "rgba(7,4,26,0.92)";

    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";

    const victory =
      this.result === "victory";

    ctx.fillStyle = victory
      ? "#a6ff00"
      : "#ff576d";

    ctx.font = "bold 37px Silkscreen";

    let title = "";

    if (this.battleMode === "michael") {
      title = victory
        ? "¡VICTORIA CONTRA MICHAEL!"
        : "¡MICHAEL TE HA DERROTADO!";
    } else if (
      this.battleMode === "elvis"
    ) {
      title = victory
        ? "¡VICTORIA CONTRA ELVIS!"
        : "¡ELVIS TE HA DERROTADO!";
    } else {
      title = victory
        ? "¡TUTORIAL COMPLETADO!"
        : "¡HAS PERDIDO!";
    }

    ctx.fillText(
      title,
      640,
      220
    );

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 29px Silkscreen";

    ctx.fillText(
      `PUNTUACIÓN ${this.score}`,
      640,
      305
    );

    ctx.font = "20px Silkscreen";

    ctx.fillText(
      `Aciertos: ${this.hits}`,
      640,
      365
    );

    ctx.fillText(
      `Errores consecutivos: ${this.misses}`,
      640,
      405
    );

    ctx.fillText(
      `Errores totales: ${this.totalMisses}`,
      640,
      445
    );

    const button = this.buttons.restart;

    ctx.fillStyle = "#a6ff00";

    ctx.fillRect(
      button.x,
      button.y,
      button.width,
      button.height
    );

    ctx.fillStyle = "#101225";
    ctx.font = "bold 22px Silkscreen";

    ctx.fillText(
      victory &&
      this.battleMode === "elvis"
        ? "JUGAR DE NUEVO"
        : "VOLVER A JUGAR",
      640,
      540
    );

    this.drawBackButton();
  }
}