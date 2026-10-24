export const morphismFamilies = ["All styles", "Glass", "Soft", "Physical", "Graphic", "Digital"] as const;
export type MorphismFamily = (typeof morphismFamilies)[number];
export type MorphismStyle = {
  id: string;
  name: string;
  family: Exclude<MorphismFamily, "All styles">;
  note: string;
  background: string;
  colors: readonly [string, string, string];
  ink: string;
  dark?: boolean;
};

// A collection of UI materials, established design styles, and experimental finishes.
// These are browser interpretations, not native implementations of platform materials.
export const morphismStyles: readonly MorphismStyle[] = [
  { id: "glass", name: "Glassmorphism", family: "Glass", note: "Translucent layers. Soft blur. A little light passing through.", background: "#dbe9df", colors: ["#4c9575", "#df9f80", "#c6dafa"], ink: "#173d32" },
  { id: "liquid", name: "Liquid glass", family: "Glass", note: "Glossy edges and a fluid silhouette, with light that follows your hand.", background: "#d6e5d8", colors: ["#41876a", "#dea782", "#a4bde6"], ink: "#153c31" },
  { id: "frost", name: "Frosted glass", family: "Glass", note: "A cooler, cloudier pane. Diffuse the background; keep the foreground clear.", background: "#dce6ee", colors: ["#678eb5", "#be92bb", "#83abae"], ink: "#263c52" },
  { id: "acrylic", name: "Acrylic", family: "Glass", note: "A softly tinted, translucent surface inspired by Fluent materials.", background: "#e0def0", colors: ["#8d78bd", "#b88da9", "#779fb4"], ink: "#38344e" },
  { id: "neumorph", name: "Neumorphism", family: "Soft", note: "Raised and pressed shapes, sculpted from the same soft surface.", background: "#dce2dc", colors: ["#618575", "#b3977d", "#91a7aa"], ink: "#2a463d" },
  { id: "clay", name: "Claymorphism", family: "Soft", note: "Puffy forms, rounded edges, and the softest little double shadows.", background: "#ead6c9", colors: ["#b7684d", "#8c9d6b", "#d39c72"], ink: "#623a2b" },
  { id: "bloom", name: "Organic bloom", family: "Soft", note: "An experimental finish: petal forms, growing curves, and a playful organic feel.", background: "#e3e6cd", colors: ["#69964b", "#b96e83", "#bd9449"], ink: "#3b512a" },
  { id: "skeuo", name: "Skeuomorphism", family: "Physical", note: "Tactile controls that feel like small objects you could pick up.", background: "#d7ccb8", colors: ["#826747", "#9a744d", "#6f8679"], ink: "#463c2c" },
  { id: "paper", name: "Papermorphism", family: "Physical", note: "Warm stock, folded corners, fine grain, and an ink-like field.", background: "#efe6d4", colors: ["#787455", "#ad744e", "#8a9b7d"], ink: "#514a36" },
  { id: "leather", name: "Leather", family: "Physical", note: "Stitched edges and a warm, textured finish. A tiny digital keepsake.", background: "#4d342a", colors: ["#dfb78b", "#f1d3b0", "#b38a6a"], ink: "#f2deca", dark: true },
  { id: "metal", name: "Metallic", family: "Physical", note: "Brushed highlights, cool reflections, and a machined little control.", background: "#bfc8cc", colors: ["#526a77", "#8d6d66", "#738a79"], ink: "#283e49" },
  { id: "mica", name: "Mica", family: "Physical", note: "An opaque, softly tinted base inspired by the calm of a desktop material.", background: "#e4dfe8", colors: ["#8c7197", "#658c8c", "#bc956c"], ink: "#494052" },
  { id: "flat", name: "Flat design", family: "Graphic", note: "Clean shapes and solid color. Let the composition do the talking.", background: "#dbe6cb", colors: ["#427750", "#c88157", "#7e9b73"], ink: "#234c32" },
  { id: "material", name: "Material", family: "Graphic", note: "Tonal surfaces, clear hierarchy, and deliberate layers of elevation.", background: "#dedfe9", colors: ["#6d6b9b", "#a07e9e", "#7a9395"], ink: "#393958" },
  { id: "neo", name: "Neobrutalism", family: "Graphic", note: "Loud color. Strong outlines. An unapologetic hard shadow.", background: "#eceb84", colors: ["#414823", "#cd6247", "#648373"], ink: "#252b1d" },
  { id: "brutal", name: "Brutalism", family: "Graphic", note: "Raw blocks, square corners, and a direct, almost unstyled attitude.", background: "#e4e3dc", colors: ["#343a34", "#79674f", "#717c71"], ink: "#252d26" },
  { id: "outline", name: "Outline", family: "Graphic", note: "A drawing of an interface. Fine borders, open space, and almost no fill.", background: "#f2efe5", colors: ["#526b59", "#ac795f", "#8c927e"], ink: "#334b3b" },
  { id: "bauhaus", name: "Bauhaus", family: "Graphic", note: "Primary colors and geometric forms, arranged like a small poster.", background: "#e9d9ba", colors: ["#b44d35", "#426f9c", "#ad8a24"], ink: "#433b2b" },
  { id: "neon", name: "Neon", family: "Digital", note: "A luminous field and electric edges, glowing out of the dark.", background: "#172a25", colors: ["#b1f295", "#e5ae85", "#8acdc4"], ink: "#d5f4c6", dark: true },
  { id: "hologram", name: "Holographic", family: "Digital", note: "Iridescent gradients with a different color at every turn.", background: "#deddea", colors: ["#9173ac", "#448c8f", "#b87393"], ink: "#453c60" },
  { id: "aurora", name: "Aurora", family: "Digital", note: "Soft ribbons of color, drifting across a deep, atmospheric surface.", background: "#1c3539", colors: ["#9fe1b6", "#bca8e3", "#7bc7ce"], ink: "#d7f0e7", dark: true },
  { id: "prism", name: "Prismatic", family: "Digital", note: "Angular reflections and split-color highlights. A little light experiment.", background: "#dfe7e4", colors: ["#548d86", "#ab719d", "#b59257"], ink: "#36564f" },
  { id: "retro", name: "Retro pixel", family: "Digital", note: "Stepped edges, pixel-like points, and a tiny bit of old-computer joy.", background: "#c3d0a0", colors: ["#405630", "#6c7439", "#65714c"], ink: "#304225" },
  { id: "wire", name: "Wireframe", family: "Digital", note: "Strip the surface back to its structure. Points, lines, and possibility.", background: "#192f37", colors: ["#91c5ce", "#e4bc91", "#86aba2"], ink: "#c8e6e6", dark: true },
];

export const morphShapes = ["Globe", "Waves", "Torus", "Cube", "Bloom"] as const;
export type MorphShape = (typeof morphShapes)[number];
export const fieldBehaviors = ["Scatter", "Attract", "Vortex"] as const;
export type FieldBehavior = (typeof fieldBehaviors)[number];

export function morphismById(id: string) {
  return morphismStyles.find(style => style.id === id) ?? morphismStyles[0];
}
