# LucidLyra anonymous supplementary website

A static page with local media and no runtime dependencies. Serve this directory
to preview it:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000` in a browser. The page reserves a teaser, six
galleries with 15, 4, 2, 4, 4, and 4 clips, and a baseline comparison video.
Two shared silent placeholder videos cover reconstruction (12:11) and
landscape (16:9) formats.

## Replacing media

1. Place the delivery MP4 and its poster image in `assets/media/`, using neutral
   names such as `static-01.mp4` and `static-01.png`.
2. In the matching thumbnail button in `index.html`, update `data-video`,
   `data-poster`, and its `aria-label`. Update its thumbnail
   image's `src` to a small `*-thumb.webp` file and remove the placeholder wording.
   Keep the full-size poster in `data-poster`; the selector should use its separate
   compressed thumbnail. Refresh the thumbnail's `?v=` value when replacing it.
3. For a gallery's first clip, also update the initial video's poster and width/height
   attributes. JavaScript reads the selected button as the source of
   truth, so do not add a video `src` attribute.
4. For the teaser and baseline comparison, update `data-src`, `poster`,
   width/height, and the `aria-label` to remove placeholder wording.

The page preserves each video's intrinsic dimensions. The reconstruction videos
are already composed from three website exports placed side by side. Media
assembly is performed before delivery, not by this website.

Use H.264 MP4s with `yuv420p` pixel format and fast-start enabled. Prefer silent
clips. To make a web copy without modifying the source:

```sh
ffmpeg -i input.mp4 -map 0:v:0 -an -map_metadata -1 -map_chapters -1 \
  -c:v libx264 -crf 23 -preset medium -pix_fmt yuv420p \
  -movflags +faststart assets/media/static-01.mp4
ffmpeg -i assets/media/static-01.mp4 -frames:v 1 -map_metadata -1 \
  assets/media/static-01.png
ffmpeg -i assets/media/static-01.png -vf "scale=256:-2:flags=lanczos" \
  -frames:v 1 -c:v libwebp -quality 78 -compression_level 6 -map_metadata -1 \
  assets/media/static-01-thumb.webp
```

Choose final encoding quality after checking small semantic labels. Aim for
20–30 MB per clip when possible, keep every file below 100 MiB, and keep the
published site below 1 GB. GitHub Pages does not serve Git LFS media. Commit
delivery assets only; keep large masters and intermediate exports elsewhere.

## Playback

Select a thumbnail to change clips. Arrow keys and Home/End navigate the focused
gallery. Selected clips load when needed, autoplay muted while visible, loop,
and pause off screen or in a hidden tab. Manual pauses are retained for the
selected clip. Reduced-motion preferences disable automatic playback; native
controls still work.

## Before submission

- Replace every placeholder, including the teaser, and check the page on desktop
  and mobile. Test every thumbnail and the native playback controls.
- Inspect published text, comments, filenames, links, metadata, and all visible
  media for identifying information. Keep manuscript sources, original exports,
  and private paths out of this repository.
- Confirm there are no missing assets, console errors, or external network
  requests. Keep the repository free of analytics and third-party embeds.
- Verify anonymous author and committer details and the authenticated GitHub
  account before committing or pushing. Anonymity includes public Git history.

When ready to publish, configure GitHub Pages to deploy from `main`, folder
`/(root)`. The `.nojekyll` file enables plain static-file publishing. Deployment
is separate from local preview; pushing to the configured source publishes it.
