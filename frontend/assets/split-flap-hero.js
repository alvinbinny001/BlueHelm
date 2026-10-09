/* SplitFlapText – vanilla JS port injected into the compiled app.
   Targets the <em>shipment</em> inside the hero heading and replaces it
   with a cycling split-flap departure board. */

(() => {
  'use strict';

  /* ── Load CSS ── */
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/assets/SplitFlapText.css';
  document.head.append(link);

  /* ── Config ── */
  const WORDS        = ['SHIPMENT', 'DECISION', 'CONTRACT', 'STRATEGY', 'FORECAST'];
  const FLIP_MS      = 90;          // ms per individual flap
  const STAGGER_MS   = 55;          // ms delay between tiles
  const CYCLE_DELAY  = 2600;        // ms hold before next word
  const FLIPS_PER    = 8;           // random intermediate glyphs
  const TILE_COLOR   = '#0d1f14';   // dark green-black tile
  const TEXT_COLOR   = '#d6ff55';   // lime accent (matches brand)
  const TILE_RADIUS  = '6px';
  const GAP          = '4px';
  const FONT_SIZE    = '0.88em';    // relative to parent heading

  const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /* ── Helpers ── */
  const rand = n => Math.floor(Math.random() * n);
  const sample = () => CHARSET[rand(CHARSET.length)];
  const pad = (str, width) => str.padEnd(width, ' ').slice(0, width);
  const buildSeq = (target, n) => {
    const steps = Array.from({ length: n }, sample);
    steps.push(target);
    return steps;
  };

  /* ── Build DOM for one tile ── */
  function createTileEl(char) {
    const tile = document.createElement('span');
    tile.className = 'split-flap-text__tile';

    const top = document.createElement('span');
    top.className = 'split-flap-text__half split-flap-text__half--top';
    const topChar = document.createElement('span');
    topChar.className = 'split-flap-text__char';
    topChar.textContent = char === ' ' ? '\u00A0' : char;
    top.append(topChar);

    const bot = document.createElement('span');
    bot.className = 'split-flap-text__half split-flap-text__half--bottom';
    const botChar = document.createElement('span');
    botChar.className = 'split-flap-text__char';
    botChar.textContent = char === ' ' ? '\u00A0' : char;
    bot.append(botChar);

    tile.append(top, bot);
    return { tile, topChar, botChar };
  }

  /* ── Animate a flap on a tile ── */
  let _flipKey = 0;
  function flipTile(tileObj, fromChar, toChar, delay) {
    return new Promise(resolve => {
      setTimeout(() => {
        const { tile, topChar, botChar } = tileObj;

        // Update bottom half to destination
        botChar.textContent = toChar === ' ' ? '\u00A0' : toChar;

        // Create front flap (shows fromChar, folds away)
        const front = document.createElement('span');
        front.className = 'split-flap-text__flap split-flap-text__flap--front';
        const frontChar = document.createElement('span');
        frontChar.className = 'split-flap-text__char';
        frontChar.textContent = fromChar === ' ' ? '\u00A0' : fromChar;
        front.append(frontChar);

        // Create back flap (shows toChar, unfolds in)
        const back = document.createElement('span');
        back.className = 'split-flap-text__flap split-flap-text__flap--back';
        const backChar = document.createElement('span');
        backChar.className = 'split-flap-text__char';
        backChar.textContent = toChar === ' ' ? '\u00A0' : toChar;
        back.append(backChar);

        tile.append(front, back);

        const dur = FLIP_MS;
        setTimeout(() => {
          front.remove();
          back.remove();
          topChar.textContent = toChar === ' ' ? '\u00A0' : toChar;
          resolve();
        }, dur * 2);
      }, delay);
    });
  }

  /* ── Animate word transition ── */
  async function animateTo(tiles, fromWord, toWord) {
    const width = tiles.length;
    const from = pad(fromWord, width);
    const to   = pad(toWord,   width);

    const promises = [];

    for (let i = 0; i < width; i++) {
      if (from[i] === to[i]) continue;

      const seq = buildSeq(to[i], FLIPS_PER);
      let delay = i * STAGGER_MS;
      let prev = from[i];

      for (const next of seq) {
        const capturedPrev = prev;
        const capturedNext = next;
        const capturedDelay = delay;

        promises.push(
          (async () => {
            await new Promise(r => setTimeout(r, capturedDelay));
            await flipTile(tiles[i], capturedPrev, capturedNext, 0);
          })()
        );

        delay += FLIP_MS;
        prev = next;
      }
    }

    await Promise.all(promises);
  }

  /* ── Mount the board ── */
  function mount(emEl) {
    const width = Math.max(...WORDS.map(w => w.length));

    /* Wrapper */
    const wrapper = document.createElement('span');
    wrapper.className = 'hero-split-flap-wrapper';

    /* SplitFlapText root */
    const board = document.createElement('span');
    board.className = 'split-flap-text';
    board.setAttribute('role', 'text');
    board.style.setProperty('--split-flap-tile-color', TILE_COLOR);
    board.style.setProperty('--split-flap-text-color', TEXT_COLOR);
    board.style.setProperty('--split-flap-radius', TILE_RADIUS);
    board.style.setProperty('--split-flap-gap', GAP);
    board.style.setProperty('--split-flap-font-size', FONT_SIZE);
    board.style.setProperty('--split-flap-flip-duration', `${FLIP_MS / 1000}s`);

    /* Build tiles for first word */
    const firstWord = pad(WORDS[0], width);
    const tileObjs = Array.from({ length: width }, (_, i) => {
      const obj = createTileEl(firstWord[i]);
      board.append(obj.tile);
      return obj;
    });

    wrapper.append(board);
    emEl.replaceWith(wrapper);

    /* Cycle */
    let current = 0;
    let currentWord = WORDS[0];

    const cycle = async () => {
      await new Promise(r => setTimeout(r, CYCLE_DELAY));
      current = (current + 1) % WORDS.length;
      const nextWord = pad(WORDS[current], width);
      await animateTo(tileObjs, currentWord, nextWord);
      currentWord = nextWord;
      cycle();
    };

    cycle();
  }

  /* ── Track which <em> elements have already been mounted ── */
  const mounted = new WeakSet();

  /* ── Find and mount any un-mounted hero <em>shipment</em> ── */
  function tryMount() {
    const candidates = [...document.querySelectorAll('h1 em, h2 em, .hero-copy em')]
      .filter(el => el.textContent.trim().toLowerCase() === 'shipment');

    let didMount = false;
    for (const em of candidates) {
      if (!mounted.has(em)) {
        mounted.add(em);
        mount(em);
        didMount = true;
      }
    }
    return didMount;
  }

  /* ── Keep the observer alive permanently so SPA re-renders are caught ── */
  tryMount();
  const obs = new MutationObserver(() => tryMount());
  obs.observe(document.body, { childList: true, subtree: true });
})();
