# fapost.in

The website for [FaPost](https://github.com/fapost-lab/core) — an open-source platform for
building conversational assistants and automating multichannel communication.

A single static page. No build step, no dependencies: `index.html` carries its own styles, and
the only external request is Google Fonts.

## Local preview

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Deployment

GitHub Pages serves the `main` branch. A push republishes the site; the custom domain is
configured in the repository settings and pinned by `CNAME`.

## Related

| | |
|---|---|
| Platform | [fapost-lab/core](https://github.com/fapost-lab/core) |
| Documentation | [docs.fapost.in](https://docs.fapost.in) |

The FaPost name and logo are covered by the
[Trademark Policy](https://github.com/fapost-lab/core/blob/main/TRADEMARK.md), not by this
repository's licence.
