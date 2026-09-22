(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const players = [];

  function pause(player) {
    if (!player.video.paused) {
      // Native pause events are asynchronous, including pauses initiated here.
      player.expectedPause = true;
      player.video.pause();
    }
  }

  function load(player) {
    const source = player.video.dataset.src;
    if (!source || player.loadedSource === source) return;
    player.loadedSource = source;
    player.video.src = source;
    player.video.load();
  }

  function shouldPlay(player) {
    return player.visible && !document.hidden && !reducedMotion.matches &&
      !player.userPaused && !player.failed;
  }

  function update(player) {
    if (!player.visible || document.hidden) {
      pause(player);
      return;
    }
    load(player);
    if (!shouldPlay(player) || !player.video.paused) return;
    if (player.pendingPlay) {
      player.pendingPlay.recheck = true;
      return;
    }

    const attempt = { revision: player.revision };
    player.pendingPlay = attempt;
    player.video.muted = true;
    player.video.play().then(() => {
      if (attempt.revision === player.revision && !shouldPlay(player)) pause(player);
    }).catch(() => {
      // Autoplay restrictions and source changes leave native controls usable.
    }).finally(() => {
      if (player.pendingPlay === attempt) {
        player.pendingPlay = null;
        if (attempt.recheck) update(player);
      }
    });
  }

  function select(player, button) {
    if (player.selected === button) return;
    pause(player);
    player.revision += 1;
    player.pendingPlay = null;
    player.userPaused = false;
    player.failed = false;
    player.selected = button;
    player.video.dataset.src = button.dataset.video;
    player.video.poster = button.dataset.poster;
    player.video.setAttribute('aria-label', button.getAttribute('aria-label'));
    if (player.error) player.error.hidden = true;

    for (const thumbnail of player.buttons) {
      const selected = thumbnail === button;
      thumbnail.classList.toggle('is-selected', selected);
      thumbnail.setAttribute('aria-pressed', String(selected));
    }

    // Reset even when several logical slots share the same placeholder file.
    player.loadedSource = null;
    player.video.removeAttribute('src');
    player.video.load();
    update(player);
  }

  for (const video of document.querySelectorAll('video[data-player]')) {
    const block = video.closest('[data-gallery], [data-video-block]');
    if (!block) continue;
    const player = {
      video,
      buttons: Array.from(block.querySelectorAll('button[data-video]')),
      error: block.querySelector('[data-video-error]'),
      selected: null,
      visible: false,
      userPaused: false,
      expectedPause: false,
      failed: false,
      loadedSource: null,
      pendingPlay: null,
      revision: 0,
    };
    players.push(player);
    video.muted = true;

    video.addEventListener('pause', () => {
      if (player.expectedPause) {
        player.expectedPause = false;
      } else if (player.visible && !document.hidden && !video.ended) {
        player.userPaused = true;
      }
    });
    video.addEventListener('play', () => {
      player.userPaused = false;
      if (!player.visible || document.hidden) pause(player);
    });
    video.addEventListener('loadedmetadata', () => {
      // load() can discard a queued pause event from the preceding clip.
      player.expectedPause = false;
      if (video.videoWidth && video.videoHeight) {
        video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
      }
    });
    video.addEventListener('error', () => {
      if (!video.getAttribute('src')) return;
      player.failed = true;
      if (player.error) {
        player.error.textContent = player.buttons.length
          ? 'This video is unavailable. Please choose another clip.'
          : 'This video is unavailable. Please try again later.';
        player.error.hidden = false;
      }
    });

    for (const button of player.buttons) {
      button.addEventListener('click', () => select(player, button));
      button.addEventListener('keydown', (event) => {
        const index = player.buttons.indexOf(button);
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % player.buttons.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + player.buttons.length) % player.buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = player.buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        player.buttons[next].focus();
        select(player, player.buttons[next]);
      });
    }

    if (player.buttons.length) {
      select(player, player.buttons.find((button) => button.getAttribute('aria-pressed') === 'true') || player.buttons[0]);
    }
  }

  if ('IntersectionObserver' in window) {
    const byVideo = new Map(players.map((player) => [player.video, player]));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const player = byVideo.get(entry.target);
        player.visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        update(player);
      }
    }, { threshold: [0, 0.15] });
    for (const player of players) observer.observe(player.video);
  } else {
    // Older browsers still offer native playback without eager media loading.
    for (const player of players) {
      player.visible = true;
      player.userPaused = true;
      load(player);
    }
  }

  document.addEventListener('visibilitychange', () => players.forEach(update));
  reducedMotion.addEventListener('change', () => {
    for (const player of players) {
      if (reducedMotion.matches) pause(player);
      else update(player);
    }
  });
})();
