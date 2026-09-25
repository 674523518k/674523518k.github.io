# LucidLyra

Static project page with local media. No build step or dependencies.

Preview a copy of `index.html` and `assets/` with a local static server.
Keep `.git` outside the served directory.

Gallery entries in `index.html` specify the video, poster, and thumbnail.
Use silent H.264 MP4s with fast-start enabled. Keep existing video resolution
and frame rate; current gallery videos are already efficiently encoded.
Use full-resolution WebP posters (quality 85) and WebP thumbnails (quality 50)
sized for 80x68 CSS pixels at 2x density, preserving aspect ratio. Generate
these from original images kept outside this repository.
Gallery posters use `data-poster` and load within 300 pixels of the viewport;
videos retain `preload="none"` and load when visible. Keep the teaser poster
eager and the method diagram lossless, with responsive WebP sizes.
The original method PNG remains available through the full-resolution link.
Update the `?v=` values when replacing media and the initial poster when
changing a gallery's first entry.

Publish the repository root with GitHub Pages. Set the sharing URLs in
`index.html` to the deployment hostname. Use anonymous Git authorship and
keep source footage and working files outside this repository.
