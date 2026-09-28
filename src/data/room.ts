// Room geometry, in percent of the scene (the room SVG is a 100×100 box stretched to
// the viewport). Shared so the furniture and decor sit where the drawing says the
// walls, windows, and floor are.

// One-point perspective vanishing point.
export const V = { x: 50, y: 46 };
// The back wall's edges.
export const BACK = { l: 6, r: 94, ceiling: 8, floor: 80 };
// Window head and sill heights on the back wall.
export const WIN = { top: 20, sill: 58 };
// French doors on the back wall.
export const DOOR = { x: 8, y: 17, w: 24, h: BACK.floor - 17 };
// Back-wall windows. The right one stops short of the corner to leave wall for a photo.
export const WINDOWS = [
    { x: 36, w: 24, split: 48 },
    { x: 63, w: 22, split: 74 },
];

// The strip of wall between the right window and the right corner.
export const RIGHT_WALL = { l: WINDOWS[1].x + WINDOWS[1].w, r: BACK.r };

// How much bigger something standing on the floor at height y looks than it would
// against the back wall (1 at the back wall, growing toward the viewer).
export const depthScale = (floorY: number) => (floorY - V.y) / (BACK.floor - V.y);
