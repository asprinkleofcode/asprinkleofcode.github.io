/// <reference types="vite/client" />

// `?photo` imports of src/assets/media/ files (plugins/photoMeta.ts): the asset
// URL plus the pixel size read at build time.
declare module "*?photo" {
  const photo: import("./lib/media").MediaPhoto;
  export default photo;
}
