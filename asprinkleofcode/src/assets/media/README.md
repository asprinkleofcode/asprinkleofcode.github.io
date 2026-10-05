# Content photos

Every photo a story or page shows lives here, one folder per dimension or path:

```text
media/
  powerlifting/
  birdhouses/
  engineering/   # only if a work story ever uses a photo (rare)
  leadership/    # only if a work story ever uses a photo (rare)
```

Content refers to a photo by its path inside `media/`, for example
`birdhouses/01-raw-gourd.webp`. The rules (what to capture, how many per page, alt text,
public safety) are in `_bmad-output/EXPERIENCE.md` §22 Photography; how a path resolves
is in `_bmad-output/architecture/ARCHITECTURE-SPINE.md` Conventions → Images.

The existing headshot and `pl-1.jpg` / `pl-2.jpg` stay in `src/assets/` (AGENTS.md).

## Before you commit a photo

1. **Export it for the web.** WebP, about 1600 px on the long edge (up to 2000 px for a
   page's main photo), and under about 250 KB. [Squoosh](https://squoosh.app) does this
   in the browser. Keep the camera original on your own drive, not in the repo.
2. **Remove location data.** Squoosh's WebP export drops it. Otherwise, on Windows:
   right-click → Properties → Details → *Remove Properties and Personal Information*.
3. **Check what's in the frame.** Nothing from work (screens, badges, whiteboards).
   Nobody who hasn't agreed to appear. Someone else's photo only with their permission.
4. **Name it.** Lowercase, hyphens, says what it shows. Number photos that form a
   sequence: `01-raw-gourd.webp`, `02-cleaned.webp`, `03-cut-entrance.webp`.
5. **Write the alt text now,** while you remember why you picked it. It goes in the
   story with the photo, not in the file name.
