# LucidLyra

Static project page with local media. No build step or dependencies.

Preview a copy of `index.html` and `assets/` with a local static server.
Keep `.git` outside the served directory.

Gallery entries in `index.html` specify the video, poster, and thumbnail.
Use silent H.264 MP4s with fast-start enabled and 256-pixel WebP thumbnails.
Update the `?v=` values when replacing media and the initial poster when
changing a gallery's first entry.

Publish the repository root with GitHub Pages. Set the sharing URLs in
`index.html` to the deployment hostname. Use anonymous Git authorship and
keep source footage and working files outside this repository.
