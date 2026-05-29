// 제작 레시피 테이블 — 전초기지에서 아이템 제작 시 필요 재료
// item_id: CRAFTABLE_ITEMS의 id (items.js)
// materials: [{ id: material_id, qty: 수량 }]  — MATERIALS의 id (materials.js)

export const RECIPES = [

  // ═══ 무기 ════════════════════════════════════════════════════════════════

  { id: 'r_iron_sword',
    item_id: 'iron_sword',
    materials: [
      { id: 'iron_ore',    qty: 3 },
      { id: 'terra_grass', qty: 2 },
    ],
  },
  { id: 'r_iron_dagger',
    item_id: 'iron_dagger',
    materials: [
      { id: 'iron_ore',    qty: 2 },
      { id: 'obsidian',    qty: 1 },
    ],
  },
  { id: 'r_frost_blade',
    item_id: 'frost_blade',
    materials: [
      { id: 'iron_ore',      qty: 2 },
      { id: 'frost_crystal', qty: 3 },
      { id: 'frost_moss',    qty: 2 },
    ],
  },
  { id: 'r_aurora_staff',
    item_id: 'aurora_staff',
    materials: [
      { id: 'aurora_crystal',  qty: 2 },
      { id: 'mana_shard',      qty: 3 },
      { id: 'aurora_tentacle', qty: 2 },
      { id: 'ancient_bark',    qty: 1 },
    ],
  },
  { id: 'r_mirr_claw',
    item_id: 'mirr_claw',
    materials: [
      { id: 'mirr_scale',      qty: 1 },
      { id: 'mirr_bloodstone', qty: 1 },
      { id: 'pure_mana_crystal', qty: 1 },
      { id: 'deep_iron',       qty: 2 },
    ],
  },

  // ═══ 상체갑옷 ════════════════════════════════════════════════════════════

  { id: 'r_iron_chest',
    item_id: 'iron_chest',
    materials: [
      { id: 'iron_ore',    qty: 4 },
      { id: 'terra_grass', qty: 2 },
    ],
  },
  { id: 'r_ironhide_chest',
    item_id: 'ironhide_chest',
    materials: [
      { id: 'iron_ore',    qty: 3 },
      { id: 'iron_hide',   qty: 2 },
      { id: 'deep_iron',   qty: 1 },
    ],
  },
  { id: 'r_glacier_armor',
    item_id: 'glacier_armor',
    materials: [
      { id: 'glacier_shell',  qty: 1 },
      { id: 'deep_iron',      qty: 2 },
      { id: 'frost_moss',     qty: 3 },
      { id: 'glacier_gem',    qty: 1 },
    ],
  },
  { id: 'r_mirr_scale_armor',
    item_id: 'mirr_scale_armor',
    materials: [
      { id: 'mirr_scale',      qty: 2 },
      { id: 'mirr_ore',        qty: 1 },
      { id: 'ancient_ore',     qty: 2 },
      { id: 'spirit_crystal',  qty: 1 },
    ],
  },

  // ═══ 하체갑옷 ════════════════════════════════════════════════════════════

  { id: 'r_iron_greaves',
    item_id: 'iron_greaves',
    materials: [
      { id: 'iron_ore',    qty: 3 },
      { id: 'terra_grass', qty: 1 },
    ],
  },
  { id: 'r_aurora_greaves',
    item_id: 'aurora_greaves',
    materials: [
      { id: 'iron_ore',    qty: 2 },
      { id: 'aurora_pelt', qty: 2 },
      { id: 'snowflake_herb', qty: 1 },
    ],
  },
  { id: 'r_ancient_greaves',
    item_id: 'ancient_greaves',
    materials: [
      { id: 'ancient_ore',     qty: 1 },
      { id: 'fossil_mineral',  qty: 2 },
      { id: 'ancient_bark',    qty: 2 },
    ],
  },

  // ═══ 투구 ════════════════════════════════════════════════════════════════

  { id: 'r_iron_helm',
    item_id: 'iron_helm',
    materials: [
      { id: 'iron_ore',    qty: 2 },
      { id: 'terra_grass', qty: 1 },
    ],
  },
  { id: 'r_fossil_helm',
    item_id: 'fossil_helm',
    materials: [
      { id: 'iron_ore',        qty: 2 },
      { id: 'fossil_fragment', qty: 2 },
      { id: 'fossil_mineral',  qty: 1 },
    ],
  },
  { id: 'r_spirit_helm',
    item_id: 'spirit_helm',
    materials: [
      { id: 'spirit_crystal', qty: 1 },
      { id: 'fossil_fragment', qty: 2 },
      { id: 'aurora_crystal',  qty: 1 },
      { id: 'deep_iron',       qty: 1 },
    ],
  },

  // ═══ 장갑 ════════════════════════════════════════════════════════════════

  { id: 'r_iron_gloves',
    item_id: 'iron_gloves',
    materials: [
      { id: 'iron_ore',    qty: 2 },
      { id: 'terra_grass', qty: 2 },
    ],
  },
  { id: 'r_aurora_gloves',
    item_id: 'aurora_gloves',
    materials: [
      { id: 'iron_ore',    qty: 1 },
      { id: 'aurora_pelt', qty: 2 },
      { id: 'aurora_petal', qty: 1 },
    ],
  },
  { id: 'r_lava_gauntlets',
    item_id: 'lava_gauntlets',
    materials: [
      { id: 'lava_core',     qty: 1 },
      { id: 'volcanic_rock', qty: 3 },
      { id: 'obsidian',      qty: 1 },
      { id: 'iron_hide',     qty: 1 },
    ],
  },

  // ═══ 신발 ════════════════════════════════════════════════════════════════

  { id: 'r_leather_boots',
    item_id: 'leather_boots',
    materials: [
      { id: 'terra_grass',  qty: 3 },
      { id: 'liferoot',     qty: 1 },
    ],
  },
  { id: 'r_frost_boots',
    item_id: 'frost_boots',
    materials: [
      { id: 'terra_grass',   qty: 2 },
      { id: 'frost_moss',    qty: 3 },
      { id: 'frost_crystal', qty: 1 },
    ],
  },
  { id: 'r_shadow_boots',
    item_id: 'shadow_boots',
    materials: [
      { id: 'obsidian',      qty: 2 },
      { id: 'aurora_pelt',   qty: 1 },
      { id: 'ancient_bark',  qty: 2 },
    ],
  },

  // ═══ 목걸이 ══════════════════════════════════════════════════════════════

  { id: 'r_liferoot_amulet',
    item_id: 'liferoot_amulet',
    materials: [
      { id: 'liferoot',      qty: 3 },
      { id: 'terra_grass',   qty: 2 },
    ],
  },
  { id: 'r_aurora_necklace',
    item_id: 'aurora_necklace',
    materials: [
      { id: 'aurora_tentacle', qty: 1 },
      { id: 'aurora_petal',    qty: 2 },
      { id: 'snowflake_herb',  qty: 2 },
    ],
  },
  { id: 'r_mana_pendant',
    item_id: 'mana_pendant',
    materials: [
      { id: 'mana_shard',    qty: 2 },
      { id: 'liferoot',      qty: 2 },
      { id: 'polar_herb',    qty: 1 },
    ],
  },
  { id: 'r_spirit_necklace',
    item_id: 'spirit_necklace',
    materials: [
      { id: 'spirit_crystal', qty: 1 },
      { id: 'aurora_crystal', qty: 1 },
      { id: 'mirr_moss',      qty: 1 },
      { id: 'aurora_petal',   qty: 2 },
    ],
  },

  // ═══ 반지 ════════════════════════════════════════════════════════════════

  { id: 'r_iron_ring',
    item_id: 'iron_ring',
    materials: [
      { id: 'iron_ore',   qty: 1 },
      { id: 'liferoot',   qty: 1 },
    ],
  },
  { id: 'r_glacier_ring',
    item_id: 'glacier_ring',
    materials: [
      { id: 'glacier_gem',   qty: 1 },
      { id: 'frost_crystal', qty: 2 },
      { id: 'mana_shard',    qty: 1 },
    ],
  },
  { id: 'r_mirr_ring',
    item_id: 'mirr_ring',
    materials: [
      { id: 'mirr_ore',        qty: 1 },
      { id: 'pure_mana_crystal', qty: 1 },
      { id: 'spirit_stone',    qty: 1 },
    ],
  },

  // ═══ 허리띠 ══════════════════════════════════════════════════════════════

  { id: 'r_grass_belt',
    item_id: 'grass_belt',
    materials: [
      { id: 'terra_grass',  qty: 4 },
      { id: 'liferoot',     qty: 1 },
    ],
  },
  { id: 'r_ancient_belt',
    item_id: 'ancient_belt',
    materials: [
      { id: 'ancient_bark',  qty: 3 },
      { id: 'iron_ore',      qty: 1 },
      { id: 'polar_herb',    qty: 1 },
    ],
  },
  { id: 'r_lava_belt',
    item_id: 'lava_belt',
    materials: [
      { id: 'volcanic_rock',    qty: 3 },
      { id: 'lava_core',        qty: 1 },
      { id: 'volcanic_ash_herb', qty: 2 },
    ],
  },

  // ═══ 방패 ════════════════════════════════════════════════════════════════

  { id: 'r_iron_shield',
    item_id: 'iron_shield',
    materials: [
      { id: 'iron_ore',    qty: 4 },
      { id: 'ancient_bark', qty: 1 },
    ],
  },
  { id: 'r_fossil_shield',
    item_id: 'fossil_shield',
    materials: [
      { id: 'iron_ore',        qty: 3 },
      { id: 'fossil_fragment', qty: 2 },
      { id: 'ancient_bark',    qty: 2 },
    ],
  },
  { id: 'r_spirit_shield',
    item_id: 'spirit_shield',
    materials: [
      { id: 'spirit_crystal', qty: 1 },
      { id: 'fossil_fragment', qty: 2 },
      { id: 'deep_iron',       qty: 2 },
      { id: 'spirit_stone',    qty: 1 },
    ],
  },
];

// recipe_id로 레시피 단건 조회
export function getRecipe(recipe_id) {
  return RECIPES.find(r => r.id === recipe_id) ?? null;
}

// item_id로 레시피 조회
export function getRecipeByItem(item_id) {
  return RECIPES.find(r => r.item_id === item_id) ?? null;
}

// 보유 재료로 제작 가능한 레시피 반환
export function getCraftableRecipes(materials) {
  return RECIPES.filter(r =>
    r.materials.every(m => (materials[m.id] ?? 0) >= m.qty)
  );
}
