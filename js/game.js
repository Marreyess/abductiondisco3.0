
import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Character } from "./character.js";

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
    this.hallway03Image = this.loadImage("./assets/Pasillo03.PNG");
    this.hallway03PaperImage = this.loadImage("./assets/Hoja_pasillo.png");
    this.bachStatueImage = this.loadImage("./assets/Mini estatua Bach.png");
    this.princeStatueImage = this.loadImage("./assets/Mini Statua Price.PNG");
    this.investigationRoom = this.loadImage("./assets/sala-inv.png");
    this.discoRoom = this.loadImage("./assets/Sala disco.png");
    this.commandBridgeImage = this.loadImage("./assets/Puente de mando.png");
    this.bossSprite = this.loadImage("./assets/Alien/Johann bach.png");
    this.bossSprite.onerror = () => {
      this.bossSprite.onerror = null;
      this.bossSprite.src = "./assets/Johann bach.png";
    };
    this.bossDialoguePortrait = this.loadImage("./assets/Alien/Dialogo_Bach.PNG");
    this.bossDialoguePortrait.onerror = () => {
      this.bossDialoguePortrait.onerror = null;
      this.bossDialoguePortrait.src = "./assets/Dialogo_Bach.PNG";
    };
    this.bossDanceSprites = Array.from({ length: 8 }, (_, i) =>
      this.loadImage(`./assets/Alien/dance_bach${String(i + 1).padStart(2, "0")}.png`)
    );
    this.bossDanceSprites.forEach((sprite, index) => {
      sprite.onerror = () => {
        sprite.onerror = null;
        sprite.src = `./assets/dance_bach${String(index + 1).padStart(2, "0")}.png`;
      };
    });
    this.bossDanceFrame = 0;
    this.bossDanceTimer = 0;
    this.bossDanceFrameDuration = 0.20;
    this.bossPosition = { x: 555, y: 280, width: 170, height: 232 };
    this.bossImageBounds = new WeakMap();
    this.bossDefeated = false;
    this.bossDialogueIndex = 0;
    this.bossDialogues = [
      { speaker: "JOHANN BACH", text: "¡Alto, humano! Has vencido a mis artistas, pero la última nota de esta nave me pertenece." },
      { speaker: "NOAH", text: "¿Otro duelo? ¿No tienen una puerta de salida normal?" },
      { speaker: "JOHANN BACH", text: "¡Prepárate para la sinfonía final! Aquí hasta las estrellas siguen mi compás." }
    ];
    this.bossVictoryText = "¡Increíble! Me ganaste en mi propia nave... ¡y eso que yo puse la música!";
    this.bossVictoryDialogues = [
      { speaker: "JOHANN BACH", text: "¡Imposible! ¡Me ganaste en mi propia nave... y eso que yo puse la música!" },
      { speaker: "NOAH", text: "Entonces, ¿ya puedo volver a casa o me falta derrotar a un mariachi espacial?" },
      { speaker: "JOHANN BACH", text: "¡No, no! ¡Vete antes de que me desafíe también el refrigerador!" }
    ];
    this.bossVictoryIndex = 0;
    this.michaelSprite = this.loadImage("./assets/Alien/Alien Michael J.png");
    this.michaelDialoguePortrait = this.loadImage("./assets/Alien/Dialogo_Michael J.PNG");
    this.playerDialoguePortrait = this.loadImage("./assets/Player/Dialogo_player.png");
    this.freddieuxDialoguePortrait = this.loadImage("./assets/Alien/Dialogo_Freddie.png");
    this.elvisDialoguePortrait = this.loadImage("./assets/Alien/Dialogo_Elvis.png");
    this.playerIdleSouth = this.loadImage("./assets/Player/idle_south.png");
    this.playerDanceSprites = [1, 2, 3, 4, 5, 6, 7, 8].map(frame =>
      this.loadImage(`./assets/Player/dance${String(frame).padStart(2, "0")}.png`)
    );
    this.playerDanceFrame = 0;
    this.playerDanceTimer = 0;
    this.playerDanceFrameDuration = 0.20;
    this.michaelDanceSprites = [];

    for (let i = 1; i <= 8; i++) {
      const frame = String(i).padStart(2, "0");
      this.michaelDanceSprites.push(
        this.loadImage(`./assets/Alien/Dance-Michael-${frame}.png`)
      );
    }

    this.michaelDanceFrame = 0;
    this.michaelDanceTimer = 0;
    this.michaelDanceFrameDuration = 0.20;
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
    this.elvisDanceFrameDuration = 0.20;

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

    this.alien = new Enemy(260, 410, "Freddieux");

    this.elvisPosition = {
      x: 250,
      y: 370,
      width: 205,
      height: 260
    };

    this.elvisDefeated = false;
    this.elvisVictoryShown = false;
    this.elvisDialogueIndex = 0;
    this.elvisVictoryText = "¡Uh-huh! ¡Me ganaste hasta el copete! Está bien, cariño, la puerta de la izquierda es tuya. ¡Pero no me pidas que te firme la nave!";
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
        dialogue: "¡USA LAS FLECHAS DEL TECLADO PARA JALAR Y MOVER LA ESTATUA DE BACH!"
      },
      {
        x: 330,
        y: 565,
        radius: 135,
        image: this.princeStatueImage,
        dialogue: "¡USA LAS FLECHAS DEL TECLADO PARA JALAR Y MOVER LA ESTATUA DE PRICE!"
      }
    ];

    this.activeStatue = null;
    this.bachLastPullDirection = null;

    this.bachCharacter = new Character({
      name: "Bach",
      maxHp: 100,
      baseX: 640,
      baseY: 435,
      width: 460,
      height: 340,
      spriteSrc: "./assets/Mini estatua Bach.png",
      isPlayer: false
    });

    this.princeCharacter = new Character({
      name: "Price",
      maxHp: 100,
      baseX: 640,
      baseY: 435,
      width: 460,
      height: 340,
      spriteSrc: "./assets/Mini Statua Price.PNG",
      isPlayer: false
    });

    this.hallway02DiscoDoor = {
      x: 55,
      y: 650,
      radius: 210
    };

    this.discoSpawn = {
      x: 1110,
      y: 650
    };

    this.discoExitDoor = {
      x: 65,
      y: 610,
      radius: 135
    };

    this.hallway03Spawn = {
      x: 1080,
      y: 650
    };

    this.hallway03WalkableArea = [
      { x: 0, y: 684 },
      { x: 20, y: 666 },
      { x: 60, y: 653 },
      { x: 104, y: 639 },
      { x: 147, y: 623 },
      { x: 192, y: 606 },
      { x: 224, y: 600 },
      { x: 257, y: 598 },
      { x: 295, y: 587 },
      { x: 333, y: 579 },
      { x: 371, y: 562 },
      { x: 409, y: 546 },
      { x: 448, y: 530 },
      { x: 480, y: 519 },
      { x: 518, y: 515 },
      { x: 578, y: 515 },
      { x: 638, y: 515 },
      { x: 693, y: 515 },
      { x: 728, y: 513 },
      { x: 753, y: 510 },
      { x: 775, y: 504 },
      { x: 797, y: 513 },
      { x: 825, y: 524 },
      { x: 858, y: 539 },
      { x: 895, y: 551 },
      { x: 931, y: 562 },
      { x: 972, y: 576 },
      { x: 1009, y: 589 },
      { x: 1047, y: 602 },
      { x: 1086, y: 620 },
      { x: 1124, y: 635 },
      { x: 1162, y: 650 },
      { x: 1200, y: 665 },
      { x: 1238, y: 680 },
      { x: 1280, y: 696 },
      { x: 1280, y: 720 },
      { x: 0, y: 720 }
    ];

    this.hallway03Perspective = {
      topY: 540,
      bottomY: 700,
      farScale: 0.48,
      nearScale: 1,
      farSpeed: 90,
      nearSpeed: 170
    };

    this.hallway03Paper = {
      x: 255,
      y: 650,
      radiusX: 115,
      radiusY: 90
    };

    this.hallway03PaperReading = false;

    this.commandBridgeSpawn = {
      x: 640,
      y: 680
    };

    this.commandBridgeWalkableArea = [
      { x: 0, y: 655 },
      { x: 120, y: 640 },
      { x: 230, y: 615 },
      { x: 300, y: 590 },
      { x: 370, y: 568 },
      { x: 415, y: 558 },
      { x: 865, y: 558 },
      { x: 920, y: 570 },
      { x: 985, y: 590 },
      { x: 1050, y: 615 },
      { x: 1160, y: 640 },
      { x: 1280, y: 655 },
      { x: 1280, y: 720 },
      { x: 0, y: 720 }
    ];

    this.commandBridgeBlockedAreas = [
      [
        { x: 0, y: 480 },
        { x: 285, y: 480 },
        { x: 285, y: 625 },
        { x: 0, y: 655 }
      ],
      [
        { x: 995, y: 480 },
        { x: 1280, y: 480 },
        { x: 1280, y: 655 },
        { x: 995, y: 625 }
      ],
      [
        { x: 420, y: 420 },
        { x: 860, y: 420 },
        { x: 870, y: 510 },
        { x: 835, y: 558 },
        { x: 445, y: 558 },
        { x: 410, y: 510 }
      ]
    ];

    this.commandBridgeEntry = {
      x: 640,
      y: 545,
      radius: 75
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
        speaker: "FREDDIEUX",
        text: "¡BLORP ZHAAA KIRIKÍÍÍ! ¡WOMBA WOMBA ZÉÉÉ!"
      },
      {
        speaker: "NOAH",
        text: "¿...Qué?"
      },
      {
        speaker: "FREDDIEUX",
        text: "¡KRAAA ZUMBA BLIP!"
      },
      {
        speaker: "NOAH",
        text: "No entendí absolutamente nada."
      },
      {
        speaker: "FREDDIEUX",
        text: "¡Por todas las estrellas! Perdón, humano, olvidé que no hablas nuestro idioma. Qué falta de consideración la mía."
      },
      {
        speaker: "FREDDIEUX",
        text: "Permíteme empezar de nuevo, querido. Mi nombre es Freddieux, una estrella intergaláctica de renombre."
      },
      {
        speaker: "FREDDIEUX",
        text: "Soy una estrella intergaláctica, un artista de renombre y, modestia aparte, una auténtica leyenda."
      },
      {
        speaker: "NOAH",
        text: "¿Una estrella... qué?"
      },
      {
        speaker: "FREDDIEUX",
        text: "Una estrella, cariño. No todos podemos ser el centro del universo, pero algunos nacimos con ese talento."
      },
      {
        speaker: "NOAH",
        text: "Espera, espera... ¿Dónde estoy? ¿Y por qué estoy aquí? ¡¿Qué me hicieron?!"
      },
      {
        speaker: "FREDDIEUX",
        text: "Ay, querido, tantas preguntas y ni siquiera hemos llegado al estribillo."
      },
      {
        speaker: "NOAH",
        text: "¡¿ESTRIBILLO?! ¡ME SECUESTRARON!"
      },
      {
        speaker: "FREDDIEUX",
        text: "Técnicamente, te hemos realizado una invitación interplanetaria no solicitada."
      },
      {
        speaker: "NOAH",
        text: "¡ESO ES SECUESTRO!"
      },
      {
        speaker: "FREDDIEUX",
        text: "Qué poca elegancia tienes para describir una experiencia tan exclusiva."
      },
      {
        speaker: "NOAH",
        text: "Bueno, ¿qué quieren de mí?"
      },
      {
        speaker: "FREDDIEUX",
        text: "¡Ah! Finalmente llegamos a la pregunta importante."
      },
      {
        speaker: "FREDDIEUX",
        text: "Necesitamos algo que tu especie tiene y que nosotros llevamos siglos intentando comprender..."
      },
      {
        speaker: "NOAH",
        text: "¿Qué cosa?"
      },
      {
        speaker: "FREDDIEUX",
        text: "¡EL RITMO, QUERIDO!"
      },
      {
        speaker: "NOAH",
        text: "...¿Me abdujeron por bailar?"
      },
      {
        speaker: "FREDDIEUX",
        text: "No exactamente. Aunque, después de ver cómo te mueves, tenemos mucho trabajo por delante."
      },
      {
        speaker: "NOAH",
        text: "No pienso participar en nada. Quiero regresar a mi casa."
      },
      {
        speaker: "FREDDIEUX",
        text: "Oh, cariño, todos queremos algo. Yo, por ejemplo, quiero un refrigerador."
      },
      {
        speaker: "NOAH",
        text: "¿Un qué?"
      },
      {
        speaker: "FREDDIEUX",
        text: "Un refrigerador. ¡Un buen refrigerador! ¿Tienes idea de lo complicado que es conservar las bebidas a temperatura ambiente en el espacio?"
      },
      {
        speaker: "NOAH",
        text: "¿Me estás hablando en serio?"
      },
      {
        speaker: "FREDDIEUX",
        text: "Por supuesto. Soy un hombre de gustos refinados."
      },
      {
        speaker: "FREDDIEUX",
        text: "Pero volviendo a lo importante... Tu misión será demostrar que los humanos todavía tienen lo necesario para dominar la pista de baile."
      },
      {
        speaker: "NOAH",
        text: "¿Y si no quiero?"
      },
      {
        speaker: "FREDDIEUX",
        text: "Entonces tendremos una pequeña tragedia intergaláctica."
      },
      {
        speaker: "NOAH",
        text: "¿Me van a dejar aquí para siempre?"
      },
      {
        speaker: "FREDDIEUX",
        text: "No seas dramático, querido. Para eso ya estoy yo."
      },
      {
        speaker: "FREDDIEUX",
        text: "¡Que comience el espectáculo!"
      }
    ];

    this.elvisDialogues = [
      { speaker: "ELVIS", text: "¡Uh-huh! ¡Alto ahí, terrícola! ¿Vienes a rescatarme o a pedirme un autógrafo?" },
      { speaker: "NOAH", text: "¿Por qué hay un Elvis extraterrestre en esta nave?" },
      { speaker: "ELVIS", text: "¡Porque el Rey nunca murió, cariño! Solo cambié de planeta." },
      { speaker: "NOAH", text: "Claro... y supongo que también tengo que bailar contigo." },
      { speaker: "ELVIS", text: "¡Exactamente! Si sobrevives a mis pasos, te dejo pasar. Si no... ¡te unes a mi club de fans!" },
      { speaker: "NOAH", text: "Definitivamente debí quedarme en casa." }
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
      battleRestart: { x: 290, y: 495, width: 310, height: 75 },
      explore: { x: 640, y: 495, width: 360, height: 75 },
      returnHome: { x: 465, y: 381, width: 350, height: 72 },
      pauseContinue: { x: 475, y: 443, width: 307, height: 67 },
      pauseExit: { x: 475, y: 520, width: 307, height: 66 }
    };

    this.tutorialMusicPath = "./assets/Queen - Another One Bites The Dust.wav";
    this.elvisMusicPath = "./assets/Elvis Presley - Burning Love.wav";
    this.michaelMusicPath = "./assets/Michael Jackson - Thriller.wav";
    this.bossMusicPath = "./assets/Johann Sebastian Bach.wav";
    this.bossMusicStart = 0;
    this.bossNoteSpeed = 475;
    this.bossHitWindow = 0.16;
    this.bossDoubleHitWindow = 0.27;
    this.tutorialMusicStart = 50;
    this.elvisMusicStart = 0;
    this.michaelMusicStart = 35;
    this.currentMusicPath = this.tutorialMusicPath;
    this.musicStartOffset = 0;
    this.loadingRhythm = false;
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

    this.tutorialPhase = "observe";
    this.tutorialPhaseTime = 0;
    this.tutorialNoteY = 130;
    this.tutorialPracticeMessage = "";
    this.tutorialPracticeMessageTimer = 0;

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
      }
    });

    window.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (event.repeat) return;
        if (this.state === "paused") {
          this.resumeGame();
        } else if ([
          "comic", "controls", "playing", "dialogue", "elvisDialogue",
          "elvisVictoryDialogue", "victoryDialogue", "rhythmIntro",
          "rhythmTutorial", "rhythm", "rhythmEnd", "hallway", "hallway02",
          "hallway03", "investigation", "disco", "commandBridge",
          "bossDialogue", "bossVictoryDialogue"
        ].includes(this.state)) {
          this.pauseGame();
        }
        return;
      }
      if (event.repeat || !(event.key === "Enter" || event.code === "Space")) return;
      if (this.state === "dialogue") {
        event.preventDefault();
        this.nextDialogue();
      } else if (this.state === "elvisDialogue") {
        event.preventDefault();
        this.nextElvisDialogue();
      } else if (this.state === "elvisVictoryDialogue") {
        event.preventDefault();
        this.finishElvisVictoryDialogue();
      } else if (this.state === "bossDialogue") {
        event.preventDefault();
        this.nextBossDialogue();
      } else if (this.state === "bossVictoryDialogue") {
        event.preventDefault();
        if (this.bossVictoryIndex < this.bossVictoryDialogues.length - 1) {
          this.bossVictoryIndex++;
        }
      } else if (this.state === "victoryDialogue") {
        event.preventDefault();
        this.finishVictoryDialogue();
      } else if (this.state === "rhythmIntro") {
        event.preventDefault();
        if (this.battleMode === "tutorial") {
          this.tutorialPhase = "observe";
          this.tutorialPhaseTime = 0;
          this.tutorialNoteY = 130;
          this.tutorialPracticeMessage = "";
          this.tutorialPracticeMessageTimer = 0;
          this.state = "rhythmTutorial";
        } else {
          this.beginRhythm();
        }
      } else if (this.state === "disco" && this.activeMichaelDialogue >= 0) {
        event.preventDefault();
        this.activeMichaelDialogue++;
        if (this.activeMichaelDialogue >= this.michaelDialogue.length) {
          this.activeMichaelDialogue = -1;
          this.startRhythm("michael");
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

    if (this.state === "hallway03") {
      this.updateHallway03(deltaTime);
    }

    if (this.state === "commandBridge") {
      this.updateCommandBridge(deltaTime);
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
      if (this.battleMode === "boss") {
        this.updateBossDance(deltaTime);
      }

      this.updateRhythm(deltaTime);
    }

    if (this.state === "rhythmTutorial") {
      this.updateRhythmTutorial(deltaTime);
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

  updateBossDance(deltaTime) {
    this.bossDanceTimer += deltaTime;
    while (this.bossDanceTimer >= this.bossDanceFrameDuration) {
      this.bossDanceTimer -= this.bossDanceFrameDuration;
      this.bossDanceFrame = (this.bossDanceFrame + 1) % this.bossDanceSprites.length;
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
    this.activeStatue = null;
    this.bossDefeated = false;
    this.bossDialogueIndex = 0;
    this.bossVictoryIndex = 0;
    this.bachCharacter.releasePull();
    this.princeCharacter.releasePull();
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
    this.hallway03PaperReading = false;
    this.elvisDefeated = false;
    this.elvisVictoryShown = false;
    this.elvisDialogueIndex = 0;
    this.michaelDefeated = false;
    this.activeMichaelDialogue = -1;
    this.battleMode = "tutorial";
    this.currentMusicPath = this.tutorialMusicPath;
    this.music.src = this.tutorialMusicPath;
    this.music.load();
    this.musicStartOffset = 0;
    this.loadingRhythm = false;

    this.elvisDanceFrame = 0;
    this.elvisDanceTimer = 0;
    this.bossDanceFrame = 0;
    this.bossDanceTimer = 0;

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
      if (this.isInside(x, y, this.buttons.pauseContinue)) this.resumeGame();
      else if (this.isInside(x, y, this.buttons.pauseExit)) this.exitPause();
      return;
    }
    if (this.state === "menu") {
      if (this.isInside(x, y, this.buttons.play)) {
        this.resetGame();
        this.state = "comic";
      } else if (this.isInside(x, y, this.buttons.credits)) this.state = "credits";
      return;
    }
    if (this.state === "comic") {
      this.comicIndex++;
      if (this.comicIndex >= this.comicTotal) {
        this.comicIndex = 0;
        this.resetPlayerPosition();
        this.state = "controls";
        this.wasInteracting = this.player.wantsToInteract();
      }
      return;
    }
    if (this.state === "controls") {
      this.state = "playing";
      this.wasInteracting = this.player.wantsToInteract();
      return;
    }
    if (this.state === "dialogue") return this.nextDialogue();
    if (this.state === "elvisDialogue") return this.nextElvisDialogue();
    if (this.state === "elvisVictoryDialogue") return this.finishElvisVictoryDialogue();
    if (this.state === "bossDialogue") return this.nextBossDialogue();
    if (this.state === "bossVictoryDialogue") {
      if (this.bossVictoryIndex < this.bossVictoryDialogues.length - 1) {
        this.bossVictoryIndex++;
      } else if (this.isInside(x, y, this.buttons.returnHome)) {
        this.finishBossVictoryDialogue();
      }
      return;
    }
    if (this.state === "victoryDialogue") return this.finishVictoryDialogue();
    if (this.state === "credits") {
      if (this.isInside(x, y, this.buttons.back)) this.state = "menu";
      return;
    }
        if (this.state === "rhythmIntro") {
      if (this.isInside(x, y, this.buttons.back)) {
        this.exitRhythm();
      } else if (this.isInside(x, y, this.buttons.begin)) {
        if (this.battleMode === "tutorial") {
          this.tutorialPhase = "observe";
          this.tutorialPhaseTime = 0;
          this.tutorialNoteY = 130;
          this.tutorialPracticeMessage = "";
          this.tutorialPracticeMessageTimer = 0;
          this.state = "rhythmTutorial";
        } else {
          this.beginRhythm();
        }
      }
      return;
    }

    if (this.state === "rhythmTutorial") {
      if (this.isInside(x, y, this.buttons.back)) {
        this.exitRhythm();
        return;
      }

      if (this.tutorialPhase === "practice") {
        const noteX = this.notePositions[1];

        if (
          Math.abs(this.tutorialNoteY - this.hitY) <= 55 &&
          Math.abs(x - noteX) <= 65 &&
          Math.abs(y - this.tutorialNoteY) <= 55
        ) {
          this.tutorialPhase = "success";
          this.tutorialPhaseTime = 0;
          this.tutorialPracticeMessage = "¡MUY BIEN! ¡LO LOGRASTE!";
          this.tutorialPracticeMessageTimer = 1.4;
        } else if (this.tutorialNoteY < this.hitY - 55) {
          this.tutorialPracticeMessage = "¡ESPERA A QUE EL CIRCULO LLEGUE A LA LÍNEA!";
          this.tutorialPracticeMessageTimer = 1.5;
        } else {
          this.tutorialPracticeMessage = "¡INTÉNTALO OTRA VEZ! HAZ CLIC SOBRE EL CIRCULO";
          this.tutorialPracticeMessageTimer = 1.5;
        }
      }
      return;
    }
    if (this.state === "rhythmEnd") {
      const wonBattle = this.result === "victory" &&
        (this.battleMode === "elvis" || this.battleMode === "michael" || this.battleMode === "boss");
      if (wonBattle) {
        if (this.isInside(x, y, this.buttons.battleRestart)) {
          this.startRhythm(this.battleMode);
        } else if (this.isInside(x, y, this.buttons.explore) ||
          this.isInside(x, y, this.buttons.back)) {
          if (this.battleMode === "elvis") this.state = "elvisVictoryDialogue";
          else if (this.battleMode === "boss") this.state = "bossVictoryDialogue";
          else this.state = "victoryDialogue";
        }
      } else if (this.isInside(x, y, this.buttons.back)) {
        this.exitRhythm();
      } else if (this.isInside(x, y, this.buttons.restart)) {
        this.startRhythm(this.battleMode);
      }
      return;
    }
    if (this.state === "rhythm") {
      if (this.isInside(x, y, this.buttons.back)) this.exitRhythm();
      else this.hitNote(x, y, detail);
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
      this.startElvisDialogue();
      return;
    }

    this.wasInteracting = interacting;
  }

  updateHallway02(deltaTime) {
    const interacting = this.player.wantsToInteract();

    if (this.activeStatue) {
      const character = this.activeStatue === this.hallway02Statues[0]
        ? this.bachCharacter : this.princeCharacter;
      const keys = this.player.keys;
      let direction = null;

      if (keys.has("arrowleft")) direction = "left";
      else if (keys.has("arrowright")) direction = "right";
      else if (keys.has("arrowup")) direction = "up";
      else if (keys.has("arrowdown")) direction = "down";

      if (direction) character.setPullDirection(direction);
      else character.releasePull();
      character.update(deltaTime);

      if (interacting && !this.wasInteracting) {
        character.releasePull();
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
      this.michaelDefeated &&
      interacting &&
      !this.wasInteracting &&
      this.isNearDiscoExit()
    ) {
      this.enterHallway03();
      return;
    }

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

  isNearDiscoExit() {
    const feet = this.player.getFootPosition(
      this.player.x,
      this.player.y
    );

    return Math.hypot(
      feet.x - this.discoExitDoor.x,
      feet.y - this.discoExitDoor.y
    ) <= this.discoExitDoor.radius;
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

  enterHallway03() {
    this.setPlayerFeetPosition(
      this.hallway03Spawn.x,
      this.hallway03Spawn.y
    );
    this.player.direction = "west";
    this.player.currentFrames = this.player.idleFrames.west;
    this.player.frameIndex = 0;
    this.player.frameTimer = 0;
    this.player.moving = false;
    this.state = "hallway03";
    this.wasInteracting = this.player.wantsToInteract();
  }

  enterCommandBridge() {
    this.setPlayerFeetPosition(
      this.commandBridgeSpawn.x,
      this.commandBridgeSpawn.y
    );
    this.player.direction = "north";
    this.player.currentFrames = this.player.idleFrames.north;
    this.player.frameIndex = 0;
    this.player.frameTimer = 0;
    this.player.moving = false;
    this.state = "commandBridge";
    this.wasInteracting = this.player.wantsToInteract();
  }

  updateCommandBridge(deltaTime) {
    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => this.isCommandBridgePositionAllowed(x, y)
    );
    const interacting = this.player.wantsToInteract();
    if (interacting && !this.wasInteracting && !this.bossDefeated && this.isNearBoss()) {
      this.bossDialogueIndex = 0;
      this.state = "bossDialogue";
      this.wasInteracting = interacting;
      return;
    }
    this.wasInteracting = interacting;
  }

  isNearBoss() {
    const feet = this.player.getFootPosition(this.player.x, this.player.y);
    return Math.hypot(feet.x - 640, feet.y - 590) <= 170;
  }

  nextBossDialogue() {
    if (this.state !== "bossDialogue") return;
    this.bossDialogueIndex++;
    if (this.bossDialogueIndex >= this.bossDialogues.length) {
      this.bossDialogueIndex = 0;
      this.startRhythm("boss");
    }
  }

  finishBossVictoryDialogue() {
    if (this.state !== "bossVictoryDialogue") return;
    this.musicAttempt++;
    this.music.pause();
    this.music.loop = false;
    this.music.playbackRate = 1;
    this.resetGame();
    this.state = "menu";
    this.backgroundVideo.play().catch(() => {});
    this.lastTime = performance.now();
  }

  isCommandBridgePositionAllowed(x, y) {
    const feet = this.player.getFootPosition(x, y);
    if (!this.isPointInsidePolygon(feet, this.commandBridgeWalkableArea)) {
      return false;
    }
    for (const area of this.commandBridgeBlockedAreas) {
      if (this.isPointInsidePolygon(feet, area)) {
        return false;
      }
    }
    return true;
  }

  isNearCommandBridgeEntry() {
    const feet = this.player.getFootPosition();
    return Math.hypot(
      feet.x - this.commandBridgeEntry.x,
      feet.y - this.commandBridgeEntry.y
    ) <= this.commandBridgeEntry.radius;
  }

  updateHallway03(deltaTime) {
    const interacting = this.player.wantsToInteract();

    if (this.hallway03PaperReading) {
      if (interacting && !this.wasInteracting) {
        this.hallway03PaperReading = false;
      }

      this.wasInteracting = interacting;
      return;
    }

    const perspective = this.hallway03Perspective;
    const originalSpeed = this.player.speed;
    const feetBeforeMove = this.player.getFootPosition();
    const progress = this.getHallway03Progress(feetBeforeMove.y);

    this.player.speed =
      perspective.farSpeed +
      (perspective.nearSpeed - perspective.farSpeed) * progress;

    this.player.update(
      deltaTime,
      this.canvas,
      (x, y) => this.isHallway03PositionAllowed(x, y)
    );

    this.player.speed = originalSpeed;

    if (
      interacting &&
      !this.wasInteracting &&
      this.isNearCommandBridgeEntry()
    ) {
      this.enterCommandBridge();
      return;
    }

    if (
      interacting &&
      !this.wasInteracting &&
      this.isNearHallway03Paper()
    ) {
      this.hallway03PaperReading = true;
      this.wasInteracting = interacting;
      return;
    }

    this.wasInteracting = interacting;
  }

  getHallway03Progress(y) {
    const perspective = this.hallway03Perspective;

    return Math.max(
      0,
      Math.min(
        1,
        (y - perspective.topY) /
          (perspective.bottomY - perspective.topY)
      )
    );
  }

  isNearHallway03Paper() {
    const feet = this.player.getFootPosition();
    const paper = this.hallway03Paper;
    const horizontalDistance = (feet.x - paper.x) / paper.radiusX;
    const verticalDistance = (feet.y - paper.y) / paper.radiusY;

    return (
      horizontalDistance * horizontalDistance +
      verticalDistance * verticalDistance
    ) <= 1;
  }

  isHallway03PositionAllowed(x, y) {
    const feet = this.player.getFootPosition(x, y);
    return this.isPointInsidePolygon(
      feet,
      this.hallway03WalkableArea
    );
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

  startElvisDialogue() {
    this.elvisDialogueIndex = 0;
    this.state = "elvisDialogue";
    this.wasInteracting = true;
  }

  nextElvisDialogue() {
    if (this.state !== "elvisDialogue") return;
    this.elvisDialogueIndex++;
    if (this.elvisDialogueIndex >= this.elvisDialogues.length) {
      this.elvisDialogueIndex = 0;
      this.startRhythm("elvis");
    }
  }

  finishElvisVictoryDialogue() {
    if (this.state !== "elvisVictoryDialogue") return;
    this.elvisVictoryShown = true;
    this.exitRhythm();
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
    const isBoss = this.battleMode === "boss";
    const isMichael = this.battleMode === "michael";
    const isElvis = this.battleMode === "elvis";
    const fullDuration = this.music.duration;
    const duration = Number.isFinite(fullDuration)
      ? Math.max(0, fullDuration - this.musicStartOffset) : NaN;
    let total = isBoss ? 120 : isMichael ? 48 : isElvis ? 36 : 24;
    let interval = isBoss ? 0.49 : isMichael ? 0.46 : isElvis ? 0.65 : 0.85;
    let first = isBoss ? 1.8 : isMichael ? 2.2 : 3;

    if (!isBoss && Number.isFinite(duration) && duration > 0) {
      first = isMichael ? 2.2 : Math.min(3, Math.max(0.5, duration * 0.15));
      if (isMichael) interval = Math.min(0.5, Math.max(0.34, (duration - first - 0.8) / 48));
      else if (isElvis) interval = Math.min(0.78, Math.max(0.56, (duration - first - 0.8) / 36));
      else interval = Math.min(1.1, Math.max(0.38, (duration - first - 0.8) / 25));
      total = Math.max(1, Math.min(total, Math.floor((duration - first - 0.4) / interval)));
    }

    const starIndices = new Set();
    if (isBoss) {
      while (starIndices.size < 2) {
        starIndices.add(12 + Math.floor(Math.random() * (total - 24)));
      }
    } else if (total >= 8) {
      starIndices.add(Math.floor(total * (0.35 + Math.random() * 0.3)));
    }

    this.notes = [];
    let previousLane = -1;
    for (let i = 0; i < total; i++) {
      let lane = Math.floor(Math.random() * this.notePositions.length);
      if (lane === previousLane) {
        lane = (lane + 1 + Math.floor(Math.random() * 3)) % this.notePositions.length;
      }
      previousLane = lane;
      let type;
      if (starIndices.has(i)) {
        type = "star";
      } else if (isBoss) {
        const chance = Math.random();
        type = chance < 0.76 ? "circle" : chance < 0.86 ? "double" : "crossout";
      } else {
        type = this.randomType();
      }
      this.notes.push({
        id: i,
        x: this.notePositions[lane],
        type,
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
    this.music.loop = mode === "boss";
    this.music.muted = false;
    this.music.volume = 0.7;

    const musicPath = mode === "boss"
      ? this.bossMusicPath
      : mode === "michael"
      ? this.michaelMusicPath
      : mode === "elvis"
        ? this.elvisMusicPath
        : this.tutorialMusicPath;

    this.musicStartOffset = mode === "boss"
      ? this.bossMusicStart
      : mode === "michael"
      ? this.michaelMusicStart
      : mode === "elvis"
        ? this.elvisMusicStart
        : this.tutorialMusicStart;

    if (this.currentMusicPath !== musicPath ||
        this.music.src !== new URL(musicPath, document.baseURI).href) {
      this.currentMusicPath = musicPath;
      this.music.src = musicPath;
      this.music.load();
    }

    try {
      this.music.currentTime = 0;
    } catch (error) {
      console.warn(error);
    }

    if (typeof this.alien.stopDance === "function") {
      this.alien.stopDance();
    }

    this.elvisDanceFrame = 0;
    this.elvisDanceTimer = 0;
    this.michaelDanceFrame = 0;
    this.michaelDanceTimer = 0;
    this.bossDanceFrame = 0;
    this.bossDanceTimer = 0;
    this.musicError = false;
    this.audioStarted = false;
    this.loadingRhythm = false;
    this.state = "rhythmIntro";
    this.wasInteracting = this.player.wantsToInteract();
  }

  beginRhythm() {
  if (
    (this.state !== "rhythmIntro" && this.state !== "rhythmTutorial") ||
    this.loadingRhythm
  ) return;

  const startState = this.state;

  this.loadingRhythm = true;
  this.musicAttempt++;
  const attemptId = this.musicAttempt;

    this.music.pause();
    this.music.playbackRate = 1;
    this.music.muted = false;
    this.music.volume = 0.7;
    this.musicError = false;
    this.audioStarted = false;

    const startBattle = () => {
      if (attemptId !== this.musicAttempt || this.state !== startState) {
        this.loadingRhythm = false;
        return;
      }

      if (Number.isFinite(this.music.duration)) {
        this.musicStartOffset = Math.min(
          Math.max(0, this.musicStartOffset),
          Math.max(0, this.music.duration - 1)
        );
      }

      try {
        this.music.currentTime = this.musicStartOffset;
      } catch (error) {
        console.warn(error);
      }

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
      this.playerDanceFrame = 0;
      this.playerDanceTimer = 0;
      this.bossDanceFrame = 0;
      this.bossDanceTimer = 0;
      this.feedback = "¡PREPÁRATE!";
      this.feedbackColor = "#a6ff00";
      this.feedbackTimer = 1.5;
      this.speedEffectUntil = 0;
      this.result = "";
      this.buildChart();
      this.state = "rhythm";
      this.loadingRhythm = false;

      if (this.battleMode === "tutorial" &&
          typeof this.alien.startDance === "function") {
        this.alien.startDance();
      }

      if (this.musicError) {
        this.showFeedback("MODO PRÁCTICA SIN AUDIO", "#ffdc69");
      }
    };

    const onMetadata = () => {
      cleanup();
      if (attemptId !== this.musicAttempt) return;
      startBattle();
    };

    const onError = () => {
      cleanup();
      if (attemptId !== this.musicAttempt) return;
      console.error("No se pudo cargar la canción:", this.music.currentSrc || this.music.src);
      this.musicError = true;
      startBattle();
    };

    const cleanup = () => {
      this.music.removeEventListener("loadedmetadata", onMetadata);
      this.music.removeEventListener("error", onError);
    };

    if (this.music.readyState >= 1) {
      startBattle();
    } else {
      this.music.addEventListener("loadedmetadata", onMetadata);
      this.music.addEventListener("error", onError);
    }

    const playback = this.music.play();
    if (playback && typeof playback.then === "function") {
      playback.then(() => {
        if (attemptId !== this.musicAttempt) return;
        this.audioStarted = true;
        if (this.state === "paused") {
          this.music.pause();
          this.musicWasPlaying = true;
        }
      }).catch(error => {
        if (attemptId !== this.musicAttempt) return;
        console.error("No se pudo reproducir la canción:", this.music.currentSrc || this.music.src, error);
        this.musicError = true;
        if (this.state === "rhythm") {
          this.showFeedback("MODO PRÁCTICA SIN AUDIO", "#ffdc69");
        }
      });
    }

    if (this.music.readyState < 1 && this.music.networkState === 3) {
      onError();
    }
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
    this.rhythmTime = this.battleMode === "boss"
      ? this.rhythmTime + (this.musicError ? deltaTime : (!this.music.paused ? deltaTime * this.music.playbackRate : 0))
      : this.getRhythmTime(deltaTime);

    if (["tutorial", "elvis", "michael", "boss"].includes(this.battleMode)) {
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
          ? (this.battleMode === "boss" ? this.bossDoubleHitWindow : this.doubleHitWindow)
          : (this.battleMode === "boss" ? this.bossHitWindow : this.hitWindow);

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

  updateRhythmTutorial(deltaTime) {
    this.tutorialPhaseTime += deltaTime;

  this.tutorialPracticeMessageTimer = Math.max(
    0,
    this.tutorialPracticeMessageTimer - deltaTime
  );

  if (this.tutorialPhase === "observe") {
    this.tutorialNoteY =
      130 + Math.min(this.tutorialPhaseTime / 2.2, 1) *
      (this.hitY - 130);

    if (this.tutorialPhaseTime >= 2.5) {
      this.tutorialPhase = "demonstration";
      this.tutorialPhaseTime = 0;
      this.tutorialNoteY = 130;
    }

    return;
  }

  if (this.tutorialPhase === "demonstration") {
    this.tutorialNoteY =
      130 + Math.min(this.tutorialPhaseTime / 3, 1) *
      (this.hitY - 130);

    if (this.tutorialPhaseTime >= 4.2) {
      this.tutorialPhase = "practice";
      this.tutorialPhaseTime = 0;
      this.tutorialNoteY = 130;
      this.tutorialPracticeMessage = "¡TU TURNO! HAZ CLIC SOBRE EL CIRCULO";
      this.tutorialPracticeMessageTimer = 2;
    }

    return;
  }

  if (this.tutorialPhase === "practice") {
    this.tutorialNoteY =
      130 + Math.min(this.tutorialPhaseTime / 3.2, 1) *
      (this.hitY - 130);

    if (this.tutorialPhaseTime >= 3.2) {
      this.tutorialPhaseTime = 0;
      this.tutorialNoteY = 130;
      this.tutorialPracticeMessage = "¡INTÉNTALO OTRA VEZ!";
      this.tutorialPracticeMessageTimer = 1.5;
    }

    return;
  }

  if (this.tutorialPhase === "success") {
    if (this.tutorialPhaseTime >= 1.4) {
      this.beginRhythm();
    }
  }
  }
  getNoteY(note) {
    const speed =
      this.battleMode === "boss"
        ? this.bossNoteSpeed
        : this.battleMode === "michael"
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
      this.battleMode === "boss"
        ? this.bossNoteSpeed
        : this.battleMode === "michael"
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
          ? (this.battleMode === "boss" ? this.bossDoubleHitWindow : this.doubleHitWindow)
          : (this.battleMode === "boss" ? this.bossHitWindow : this.hitWindow);

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
    if (this.state !== "rhythm") return;
    this.musicAttempt++;
    this.music.pause();
    this.music.playbackRate = 1;
    this.speedEffectUntil = 0;
    if (typeof this.alien.stopDance === "function") this.alien.stopDance();
    this.result = won ? "victory" : "defeat";
    if (this.battleMode === "elvis") {
      if (won) this.elvisDefeated = true;
      this.state = "rhythmEnd";
    } else if (this.battleMode === "michael") {
      if (won) this.michaelDefeated = true;
      this.state = "rhythmEnd";
    } else if (this.battleMode === "boss") {
      if (won) {
        this.bossDefeated = true;
        this.bossVictoryIndex = 0;
        this.state = "bossVictoryDialogue";
      } else {
        this.state = "rhythmEnd";
      }
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
      this.battleMode === "boss"
        ? "commandBridge"
        : this.battleMode === "elvis"
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

  drawHallway03Background() {
    this.drawImageBackground(this.hallway03Image);
  }

  drawDiscoBackground() {
    this.drawImageBackground(this.discoRoom);
  }

  drawCommandBridgeBackground() {
    this.drawImageBackground(this.commandBridgeImage);
  }

  drawInvestigationBackground() {
    this.drawImageBackground(
      this.investigationRoom
    );
  }

  drawRhythmBackground() {
    if (this.battleMode === "boss") {
      this.drawCommandBridgeBackground();
    } else if (this.battleMode === "michael") {
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

    const rhythmIsActive = this.state === "rhythm" ||
      (this.state === "paused" && this.previousState === "rhythm");

    const noteNearby = rhythmIsActive && this.notes.some(note =>
      Math.abs(note.time - this.rhythmTime) <= 0.48
    );

    const useDance = rhythmIsActive && noteNearby &&
      !this.musicError && this.audioStarted;

    const sprite = useDance
      ? this.playerDanceSprites[this.playerDanceFrame]
      : this.playerIdleSouth;

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      ctx.drawImage(sprite, this.player.x, this.player.y,
        this.player.width, this.player.height);
    } else {
      this.player.draw(ctx);
    }

    ctx.restore();

    if (this.battleMode === "boss") {
      this.drawBoss(970, 230, 240, 355);
    } else if (this.battleMode === "elvis") {
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

  drawBoss(x, y, width, height) {
    const ctx = this.context;
    const active = this.battleMode === "boss" &&
      (this.state === "rhythm" || (this.state === "paused" && this.previousState === "rhythm"));
    const dancing = active && this.bossDanceSprites[this.bossDanceFrame];
    const sprite = dancing && dancing.complete && dancing.naturalWidth > 0
      ? dancing : this.bossSprite;
    if (!sprite || !sprite.complete || sprite.naturalWidth === 0) return;
    let bounds = this.bossImageBounds.get(sprite);
    if (!bounds) {
      const offscreen = document.createElement("canvas");
      offscreen.width = sprite.naturalWidth;
      offscreen.height = sprite.naturalHeight;
      const source = offscreen.getContext("2d", { willReadFrequently: true });
      source.drawImage(sprite, 0, 0);
      try {
        const pixels = source.getImageData(0, 0, offscreen.width, offscreen.height).data;
        let left = offscreen.width;
        let top = offscreen.height;
        let right = -1;
        let bottom = -1;
        for (let py = 0; py < offscreen.height; py++) {
          for (let px = 0; px < offscreen.width; px++) {
            if (pixels[(py * offscreen.width + px) * 4 + 3] > 15) {
              left = Math.min(left, px);
              top = Math.min(top, py);
              right = Math.max(right, px);
              bottom = Math.max(bottom, py);
            }
          }
        }
        bounds = right >= left
          ? { x: left, y: top, w: right - left + 1, h: bottom - top + 1 }
          : { x: 0, y: 0, w: offscreen.width, h: offscreen.height };
      } catch (error) {
        bounds = { x: 0, y: 0, w: offscreen.width, h: offscreen.height };
      }
      this.bossImageBounds.set(sprite, bounds);
    }
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sprite, bounds.x, bounds.y, bounds.w, bounds.h, x, y, width, height);
    ctx.restore();
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

  drawCharacterConversation(enemyPortrait, enemyName, accent, text, hint, speaker) {
    const ctx = this.context;
    const enemySpeaking = speaker !== "NOAH";
    const enemyNameColor = enemySpeaking ? accent : "#777b8f";
    const playerNameColor = enemySpeaking ? "#777b8f" : "#53ddff";

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawConversationPortrait(
      enemyPortrait,
      0,
      490,
      470,
      490,
      enemySpeaking ? 1 : 0.35
    );

    this.drawConversationPortrait(
      this.playerDialoguePortrait,
      810,
      490,
      470,
      490,
      enemySpeaking ? 0.35 : 1
    );

    ctx.fillStyle = "rgba(5, 4, 18, 0.96)";
    ctx.fillRect(180, 490, 920, 185);

    ctx.strokeStyle = accent;
    ctx.lineWidth = 5;
    ctx.strokeRect(180, 490, 920, 185);

    ctx.textAlign = "left";
    ctx.fillStyle = enemyNameColor;
    ctx.font = "bold 23px Silkscreen";
    ctx.fillText(enemyName, 220, 530);

    ctx.textAlign = "right";
    ctx.fillStyle = playerNameColor;
    ctx.font = "bold 17px Silkscreen";
    ctx.fillText("NOAH", 1060, 530);

    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "19px Silkscreen";

    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;

      if (ctx.measureText(candidate).width > 820 && line) {
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

    ctx.fillStyle = accent;
    ctx.textAlign = "right";
    ctx.font = "15px Silkscreen";
    ctx.fillText(hint, 1070, 650);
    ctx.restore();
  }

  draw() {
    if (this.state === "paused") {
      this.drawPause();
    } else if (this.state === "menu") {
      this.drawMenu();
    } else if (this.state === "comic") {
      this.drawComic();
    } else if (this.state === "controls") {
      this.drawControls();
    } else if (this.state === "credits") {
      this.drawCredits();
    } else if (this.state === "dialogue") {
      this.drawDialogue();
    } else if (this.state === "elvisDialogue") {
      this.drawElvisDialogue();
    } else if (this.state === "elvisVictoryDialogue") {
      this.drawElvisVictoryDialogue();
    } else if (this.state === "bossDialogue") {
      this.drawBossDialogue();
    } else if (this.state === "bossVictoryDialogue") {
      this.drawBossVictoryDialogue();
    } else if (this.state === "victoryDialogue") {
      this.drawVictoryDialogue();
    } else if (
      this.state === "rhythmIntro"
      ) {
    this.drawRhythmIntro();
    } else if (
      this.state === "rhythmTutorial"
    ) {
      this.drawRhythmTutorial();
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
      this.state === "hallway03"
    ) {
      this.drawHallway03();
    } else if (
      this.state === "commandBridge"
    ) {
      this.drawCommandBridge();
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

  drawControls() {
    const ctx = this.context;
    this.drawDuelRoom();
    ctx.save();
    ctx.fillStyle = "rgba(5, 4, 21, 0.96)";
    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle = "#171331";
    ctx.fillRect(70, 28, 1140, 664);
    ctx.strokeStyle = "#00ccff";
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 28, 1140, 664);

    const textFit = (value, x, y, maxWidth, fontSize, color, align = "left") => {
      let size = fontSize;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      do {
        ctx.font = `bold ${size}px Silkscreen`;
        if (ctx.measureText(value).width <= maxWidth || size <= 11) break;
        size--;
      } while (size > 10);
      ctx.fillText(value, x, y);
    };

    const drawKey = (label, x, y, width = 65, height = 54, color = "#53ddff") => {
      ctx.fillStyle = "#252044";
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = label.length > 1 ? "bold 18px Silkscreen" : "bold 25px Silkscreen";
      ctx.fillText(label, x + width / 2, y + height / 2 + 9);
    };

    textFit("¿CÓMO SE JUEGA?", 640, 91, 1020, 40, "#002fff", "center");
    textFit("CONTROLES DE ABDUCCIÓN DISCO", 640, 132, 980, 18, "#e3dcf8", "center");

    ctx.strokeStyle = "rgba(179, 156, 242, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(105, 151);
    ctx.lineTo(1175, 151);
    ctx.stroke();

    textFit("MOVERTE", 150, 189, 300, 22, "#53ddff");
    drawKey("W", 246, 213);
    drawKey("A", 174, 273);
    drawKey("S", 246, 273);
    drawKey("D", 318, 273);

    textFit("O", 470, 302, 35, 22, "#ffffff", "center");
    drawKey("↑", 646, 213);
    drawKey("←", 574, 273);
    drawKey("↓", 646, 273);
    drawKey("→", 718, 273);

    ctx.strokeStyle = "rgba(179, 156, 242, 0.3)";
    ctx.beginPath();
    ctx.moveTo(105, 351);
    ctx.lineTo(1175, 351);
    ctx.stroke();

    textFit("ACCIONES", 145, 391, 425, 22, "#ffdc69");
    drawKey("E", 153, 415, 72, 52, "#ffdc69");
    textFit("HABLAR / ABRIR / EXAMINAR", 242, 448, 323, 16, "#ffffff");

    drawKey("ESC", 153, 485, 92, 52, "#ff60b6");
    textFit("PAUSAR EL JUEGO", 261, 518, 310, 16, "#ffffff");

    textFit("EN LAS ESTATUAS USA LAS FLECHAS PARA MOVERLAS", 640, 608, 1020, 15, "#bbf4ff", "center");

    ctx.fillStyle = "#00a2ff";
    ctx.fillRect(338, 627, 604, 48);
    textFit("HAZ CLIC PARA COMENZAR", 640, 660, 570, 21, "#101225", "center");
    ctx.restore();
  }

  drawDialogue() {
    this.drawDuelRoom();

    this.alien.draw(this.context);
    this.player.draw(this.context);

    const dialogue = this.dialogues[this.dialogueIndex];

    if (!dialogue) return;

    this.drawCharacterConversation(
      this.freddieuxDialoguePortrait,
      "FREDDIEUX",
      "#a6ff00",
      dialogue.text,
      this.dialogueIndex === this.dialogues.length - 1
        ? "CLIC PARA INICIAR EL TUTORIAL >"
        : "CLIC PARA CONTINUAR >",
      dialogue.speaker
    );
  }

  drawElvisDialogue() {
    this.drawInvestigationBackground();
    this.drawElvis(
      this.elvisPosition.x,
      this.elvisPosition.y,
      this.elvisPosition.width,
      this.elvisPosition.height
    );
    this.player.draw(this.context);

    const entry = this.elvisDialogues[this.elvisDialogueIndex];
    if (!entry) return;

    this.drawCharacterConversation(
      this.elvisDialoguePortrait,
      "ELVIS",
      "#ffdc69",
      entry.text,
      this.elvisDialogueIndex === this.elvisDialogues.length - 1
        ? "CLIC PARA INICIAR LA BATALLA >"
        : "CLIC PARA CONTINUAR >",
      entry.speaker
    );
  }

  drawElvisVictoryDialogue() {
    this.drawInvestigationBackground();
    this.drawElvis(
      this.elvisPosition.x,
      this.elvisPosition.y,
      this.elvisPosition.width,
      this.elvisPosition.height
    );
    this.player.draw(this.context);

    this.drawCharacterConversation(
      this.elvisDialoguePortrait,
      "ELVIS",
      "#ffdc69",
      this.elvisVictoryText,
      "CLIC PARA CONTINUAR >",
      "ELVIS"
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
    ctx.fillText("¡TUTORIAL COMPLETADO!", 640, 170);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px Silkscreen";
    ctx.fillText(`PUNTUACIÓN ${this.score}`, 640, 225);

    this.drawCharacterConversation(
      this.freddieuxDialoguePortrait,
      "FREDDIEUX",
      "#a6ff00",
      "¡Eres muy bueno! Te dejaré pasar nada más porque rompiste la pista.",
      "CLIC PARA CONTINUAR >",
      "FREDDIEUX"
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

  drawHallway03() {
    this.drawHallway03Background();

    const ctx = this.context;
    const playerFeet = this.player.getFootPosition();
    const playerProgress = this.getHallway03Progress(playerFeet.y);
    const playerScale =
      this.hallway03Perspective.farScale +
      (this.hallway03Perspective.nearScale - this.hallway03Perspective.farScale) * playerProgress;

    const frame = this.player.currentFrames[this.player.frameIndex];

    if (frame && frame.complete && frame.naturalWidth > 0) {
      const drawWidth = this.player.width * playerScale;
      const drawHeight = this.player.height * playerScale;
      const drawX = playerFeet.x - drawWidth / 2;
      const drawY = playerFeet.y - drawHeight * 0.9;

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(frame, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    }

    if (!this.hallway03PaperReading && this.isNearCommandBridgeEntry()) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px Silkscreen";
      ctx.fillText("PRESIONA E PARA ENTRAR", 640, 690);
      ctx.restore();
    } else if (!this.hallway03PaperReading && this.isNearHallway03Paper()) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Silkscreen";
      ctx.fillText("PRESIONA E PARA LEER", 255, 690);
      ctx.restore();
    }

    if (this.hallway03PaperReading) {
      this.drawHallway03PaperReading();
    }
  }

  drawCommandBridge() {
    this.drawCommandBridgeBackground();
    this.drawBoss(
      this.bossPosition.x,
      this.bossPosition.y,
      this.bossPosition.width,
      this.bossPosition.height
    );
    this.player.draw(this.context);
    const ctx = this.context;
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "bold 18px Silkscreen";
    if (!this.bossDefeated && this.isNearBoss()) {
      ctx.fillStyle = "#ffdc69";
      ctx.fillText("PRESIONA E PARA DESAFIAR A JOHANN BACH", 640, 690);
    } else if (this.bossDefeated) {
      ctx.fillStyle = "#a6ff00";
      ctx.fillText("¡DERROTASTE AL JEFE FINAL!", 640, 690);
    }
    ctx.restore();
  }

  drawBossDialogue() {
    this.drawCommandBridgeBackground();
    this.drawBoss(this.bossPosition.x, this.bossPosition.y,
      this.bossPosition.width, this.bossPosition.height);
    this.player.draw(this.context);
    const dialogue = this.bossDialogues[this.bossDialogueIndex];
    if (!dialogue) return;
    this.drawCharacterConversation(
      this.bossDialoguePortrait, "JOHANN BACH", "#ffdc69", dialogue.text,
      "CLIC PARA CONTINUAR >", dialogue.speaker
    );
  }

  drawBossVictoryDialogue() {
    this.drawCommandBridgeBackground();
    this.drawBoss(this.bossPosition.x, this.bossPosition.y,
      this.bossPosition.width, this.bossPosition.height);
    this.player.draw(this.context);
    const dialogue = this.bossVictoryDialogues[this.bossVictoryIndex];
    const last = this.bossVictoryIndex === this.bossVictoryDialogues.length - 1;
    this.drawCharacterConversation(
      this.bossDialoguePortrait, "JOHANN BACH", "#a6ff00",
      dialogue.text, last ? "VOLVER A CASA ARRIBA" : "CLIC PARA CONTINUAR >", dialogue.speaker
    );
    if (last) {
      const ctx = this.context;
      const button = this.buttons.returnHome;
      ctx.save();
      ctx.fillStyle = "#a6ff00";
      ctx.fillRect(button.x, button.y, button.width, button.height);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(button.x, button.y, button.width, button.height);
      ctx.fillStyle = "#101225";
      ctx.font = "bold 24px Silkscreen";
      ctx.textAlign = "center";
      ctx.fillText("VOLVER A CASA", button.x + button.width / 2, button.y + 46);
      ctx.restore();
    }
  }

  drawHallway03PaperReading() {
    const ctx = this.context;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.82)";
    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle = "#17152b";
    ctx.fillRect(300, 55, 680, 610);

    ctx.strokeStyle = "#f4dca0";
    ctx.lineWidth = 5;
    ctx.strokeRect(300, 55, 680, 610);

    if (
      this.hallway03PaperImage.complete &&
      this.hallway03PaperImage.naturalWidth > 0
    ) {
      const maxWidth = 540;
      const maxHeight = 500;
      const imageRatio =
        this.hallway03PaperImage.naturalWidth /
        this.hallway03PaperImage.naturalHeight;

      let width = maxWidth;
      let height = width / imageRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * imageRatio;
      }

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        this.hallway03PaperImage,
        640 - width / 2,
        340 - height / 2,
        width,
        height
      );
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Silkscreen";
    ctx.fillText("PRESIONA E PARA CERRAR", 640, 625);
    ctx.restore();
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

    if (statue === this.hallway02Statues[0]) {
      this.bachCharacter.draw(ctx);
    } else if (statue === this.hallway02Statues[1]) {
      this.princeCharacter.draw(ctx);
    } else {
      this.drawContainedImage(statue.image, {
        x: 410,
        y: 95,
        width: 460,
        height: 340
      });
    }

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

    if (statue === this.hallway02Statues[0] || statue === this.hallway02Statues[1]) {

      ctx.fillText(
        "PRESIONA E PARA SALIR",
        640,
        625
      );
    } else {
      ctx.fillText(
        "PRESIONA E PARA CONTINUAR",
        640,
        615
      );
    }

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
    } else if (!this.michaelDefeated && this.isNearMichael()) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px Silkscreen";
      ctx.fillText("PRESIONA E PARA HABLAR", 640, 675);
      ctx.restore();
    } else if (this.michaelDefeated && this.isNearDiscoExit()) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = "#a6ff00";
      ctx.font = "bold 20px Silkscreen";
      ctx.fillText("PRESIONA E PARA CONTINUAR", 640, 675);
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
    this.drawCharacterConversation(
      this.michaelDialoguePortrait,
      "ALIEN MICHAEL JACKSON",
      "#ff8cff",
      text,
      hint,
      "MICHAEL"
    );
  }

  drawConversationPortrait(image, x, bottomY, width, height, opacity) {
    const ctx = this.context;

    if (!image || !image.complete || image.naturalWidth === 0) {
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
      bottomY - drawHeight,
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
          : "Presiona E para hablar con Elvis",
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
    } else if (this.previousState === "controls") {
      this.drawControls();
    } else if (this.previousState === "dialogue") {
      this.drawDialogue();
    } else if (this.previousState === "bossDialogue") {
      this.drawBossDialogue();
    } else if (this.previousState === "bossVictoryDialogue") {
      this.drawBossVictoryDialogue();
    } else if (this.previousState === "elvisDialogue") {
      this.drawElvisDialogue();
    } else if (this.previousState === "elvisVictoryDialogue") {
      this.drawElvisVictoryDialogue();
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
      this.previousState === "rhythmTutorial"
    ) {
      this.drawRhythmTutorial();

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
      this.previousState === "hallway03"
    ) {
      this.drawHallway03();
    } else if (
      this.previousState === "commandBridge"
    ) {
      this.drawCommandBridge();
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

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 5;

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 38px Silkscreen";
    ctx.fillText("CRÉDITOS", 640, 65);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 23px Silkscreen";
    ctx.fillText("MARIANA A. REYES", 365, 190);
    ctx.fillText("OSCAR MICHEL ORTEGA MARTÍNEZ", 915, 190);

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 245);
    ctx.lineTo(1130, 245);
    ctx.stroke();

    ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
    ctx.shadowBlur = 5;

    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 18px Silkscreen";
    ctx.fillText("MÚSICA", 400, 300);
    ctx.fillText("RECURSOS VISUALES", 1010, 300);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Silkscreen";
    ctx.fillText("BURNING LOVE", 245, 365);
    ctx.font = "13px Silkscreen";
    ctx.fillText("ELVIS PRESLEY · VOODOOVIBE", 245, 390);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Silkscreen";
    ctx.fillText("JOHANN SEBASTIAN BACH", 545, 365);
    ctx.font = "13px Silkscreen";
    ctx.fillText("RÁNEO", 545, 395);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Silkscreen";
    ctx.fillText("ANOTHER ONE BITES THE DUST", 245, 495);
    ctx.font = "13px Silkscreen";
    ctx.fillText("QUEEN · ASTROHOUSE", 245, 525);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Silkscreen";
    ctx.fillText("THRILLER", 545, 495);
    ctx.font = "13px Silkscreen";
    ctx.fillText("MICHAEL JACKSON · HOUSE HUB", 545, 525);

    ctx.fillStyle = "#ffffff";
    ctx.font = "13px Silkscreen";
    ctx.fillText("Se utilizaron herramientas de", 1010, 375);
    ctx.fillText("inteligencia artificial como", 1010, 402);
    ctx.fillText("apoyo en la creación de", 1010, 429);
    ctx.fillText("algunos recursos visuales", 1010, 456);
    ctx.fillText("del videojuego.", 1010, 483);

    ctx.restore();

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
        "Presiona E para hablar con Freddieux",
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
    if (this.battleMode === "boss") {
      this.drawBossIntro();
      return;
    }
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
        title: "CIRCULO",
        description: "Un clic cuando toque la línea",
        y: 215
      },
      {
        image: this.doubleSprite,
        title: "CIRCULO DOBLE",
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
      "COMENZAR PRÁCTICA",
      640,
      656
    );

    this.drawBackButton();
  }

  drawBossIntro() {
    const ctx = this.context;
    this.drawCommandBridgeBackground();
    ctx.fillStyle = "rgba(5,3,22,0.88)";
    ctx.fillRect(0, 0, 1280, 720);
    this.drawCharacters();
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffdc69";
    ctx.font = "bold 42px Silkscreen";
    ctx.fillText("BATALLA FINAL", 640, 125);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px Silkscreen";
    ctx.fillText("JOHANN BACH VS NOAH", 640, 205);
    ctx.font = "20px Silkscreen";
    ctx.fillText("100 NOTAS • MÁXIMA VELOCIDAD", 640, 282);
    ctx.fillText("2 ESTRELLAS ALEATORIAS", 640, 325);
    ctx.fillStyle = "#ff60b6";
    ctx.fillText("3 ERRORES SEGUIDOS = DERROTA", 640, 370);
    const button = this.buttons.begin;
    ctx.fillStyle = "#a6ff00";
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.fillStyle = "#101225";
    ctx.font = "bold 23px Silkscreen";
    ctx.fillText("INICIAR BATALLA", 640, 656);
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
    ctx.fillText("MICHAEL JACKSON VS NOAH", 640, 200);

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
      "ELVIS VS NOAH",
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
      this.battleMode === "boss"
        ? "BATALLA FINAL: NOAH VS JOHANN BACH"
        : this.battleMode === "michael"
        ? "NOAH VS MICHAEL ALIEN"
        : this.battleMode === "elvis"
          ? "NOAH VS ELVIS ALIEN"
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

  drawRhythmTutorial() {
    const ctx = this.context;

    this.drawRhythmBackground();

    ctx.fillStyle = "rgba(5,3,22,0.91)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";
    ctx.fillStyle = "#a6ff00";
    ctx.font = "bold 30px Silkscreen";
    ctx.fillText("TUTORIAL DE RITMO", 640, 55);

    let instruction = "";

    if (this.tutorialPhase === "observe") {
      instruction = "OBSERVA CÓMO CAE EL CIRCULO";
    } else if (this.tutorialPhase === "demonstration") {
      instruction =
        Math.abs(this.tutorialNoteY - this.hitY) <= 35
          ? "¡AHORA! HAZ CLIC SOBRE LA NOTA"
          : "OBSERVA CUÁNDO LLEGA A LA LÍNEA";
    } else if (this.tutorialPhase === "practice") {
      instruction = "TU TURNO: HAZ CLIC SOBRE EL CIRCULO";
    } else if (this.tutorialPhase === "success") {
      instruction = "¡MUY BIEN! ¡LO LOGRASTE!";
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Silkscreen";
    ctx.fillText(instruction, 640, 90);

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

    for (let i = 0; i < this.notePositions.length; i++) {
      const x = this.notePositions[i];

      ctx.fillStyle =
        i === 1
          ? "rgba(83,221,255,0.13)"
          : "rgba(100,55,170,0.06)";

      ctx.fillRect(x - 58, 110, 116, 510);

      ctx.strokeStyle = i === 1 ? "#53ddff" : "#8e45dc";
      ctx.globalAlpha = i === 1 ? 0.65 : 0.2;
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
    ctx.moveTo(this.trackLeft, this.hitY);
    ctx.lineTo(this.trackRight, this.hitY);
    ctx.stroke();

    ctx.restore();

    if (this.tutorialPhase !== "success") {
      ctx.save();
      ctx.shadowColor = "#b970ff";
      ctx.shadowBlur = 18;

      this.drawSprite(
        this.normalSprite,
        this.notePositions[1],
        this.tutorialNoteY,
        80,
        "#b970ff"
      );

      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#b8edff";
    ctx.font = "15px Silkscreen";

    if (this.tutorialPhase === "observe") {
      ctx.fillText(
        "MIRA EL MOVIMIENTO DE LA NOTA",
        640,
        665
      );
    } else if (this.tutorialPhase === "demonstration") {
      ctx.fillText(
        "EL MOMENTO CORRECTO ES CUANDO TOCA LA LÍNEA",
        640,
        665
      );
    } else if (this.tutorialPhase === "practice") {
      ctx.fillText(
        this.tutorialPracticeMessageTimer > 0
          ? this.tutorialPracticeMessage
          : "HAZ CLIC SOBRE EL CIRCULO CUANDO LLEGUE A LA LÍNEA",
        640,
        665
      );
    } else if (this.tutorialPhase === "success") {
      ctx.fillStyle = "#a6ff00";
      ctx.font = "bold 21px Silkscreen";
      ctx.fillText("¡LO HICISTE CORRECTAMENTE!", 640, 665);
    }

    this.drawBackButton();
  }

  drawRhythmEnd() {
    const ctx = this.context;

    this.drawRhythmBackground();

    ctx.fillStyle = "rgba(7,4,26,0.92)";
    ctx.fillRect(0, 0, 1280, 720);

    this.drawCharacters();

    ctx.textAlign = "center";

    const victory = this.result === "victory";

    ctx.fillStyle = victory ? "#a6ff00" : "#ff576d";
    ctx.font = "bold 37px Silkscreen";

    const title = this.battleMode === "boss"
      ? (victory ? "¡BACH HA SIDO DERROTADO!" : "¡BACH GANA LA SINFONÍA!")
      : this.battleMode === "michael"
      ? (victory ? "¡VICTORIA CONTRA MICHAEL!" : "¡MICHAEL TE HA DERROTADO!")
      : this.battleMode === "elvis"
        ? (victory ? "¡VICTORIA CONTRA ELVIS!" : "¡ELVIS TE HA DERROTADO!")
        : (victory ? "¡TUTORIAL COMPLETADO!" : "¡HAS PERDIDO!");

    ctx.fillText(title, 640, 220);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 29px Silkscreen";
    ctx.fillText(`PUNTUACIÓN ${this.score}`, 640, 305);

    ctx.font = "20px Silkscreen";
    ctx.fillText(`Aciertos: ${this.hits}`, 640, 365);
    ctx.fillText(`Errores consecutivos: ${this.misses}`, 640, 405);
    ctx.fillText(`Errores totales: ${this.totalMisses}`, 640, 445);

    const wonBattle = victory && (this.battleMode === "elvis" || this.battleMode === "michael" || this.battleMode === "boss");

    if (wonBattle) {
      const restart = this.buttons.battleRestart;

      ctx.fillStyle = "#a6ff00";
      ctx.fillRect(restart.x, restart.y, restart.width, restart.height);

      ctx.fillStyle = "#101225";
      ctx.font = "bold 18px Silkscreen";
      ctx.fillText("JUGAR DE NUEVO", restart.x + restart.width / 2, restart.y + 46);

      const explore = this.buttons.explore;

      ctx.fillStyle = "#53ddff";
      ctx.fillRect(explore.x, explore.y, explore.width, explore.height);

      ctx.fillStyle = "#101225";
      ctx.font = "bold 17px Silkscreen";
      ctx.fillText("SEGUIR EXPLORANDO", explore.x + explore.width / 2, explore.y + 46);
    } else {
      const button = this.buttons.restart;

      ctx.fillStyle = "#a6ff00";
      ctx.fillRect(button.x, button.y, button.width, button.height);

      ctx.fillStyle = "#101225";
      ctx.font = "bold 22px Silkscreen";
      ctx.fillText("VOLVER A JUGAR", button.x + button.width / 2, button.y + 45);
    }

    this.drawBackButton();
  }
}
