// Epic Coin Clicker - Stability-first comprehensive upgrade
// Focus: robust progression, performance, panel management, upgrades, quests,
// settings, save slots/backups, defensive coding, and low-lag rendering.

(() => {
  "use strict";

  /* =========================================================
     Constants / Versioning
  ========================================================= */
  const VERSION = 4;
  const STORAGE_KEY = "epicClickerSaveV4";
  const LEGACY_KEYS = [
    "epicClickerSaveV3",
    "epicClickerSaveV2",
    "epicClickerSave",
  ];
  const SLOT_PREFIX = "epicClickerSlot_";
  const MAX_BUILDINGS = 15;
  const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
  const DAILY_MS = 24 * 60 * 60 * 1000;

  // Account & Role System
  const ACCOUNTS_KEY = "epicClickerAccounts";
  const CURRENT_USER_KEY = "epicClickerCurrentUser";
  const PLAYER_DATA_PREFIX = "epicClickerPlayerData_";
  const SOCIAL_KEY = "epicClickerSocialV1";
  const OWNER_USERNAME = "nadorov";
  const BASE_PRESTIGE_COST = 50000;
  const PRESTIGE_COST_GROWTH = 1.85;
  const BUILDING_COST_GROWTH = 1.18;
  const MAX_CHAT_MESSAGES = 80;
  const MAX_GIFT_HISTORY = 120;
  const CHAT_COOLDOWN_MS = 700;
  const GIFT_COOLDOWN_MS = 3000;

  const BASE_PROGRESS_STATS = {
    comboBoost: 1,
    comboTimeoutMs: 3000,
    critChance: 5,
    clickPowerMult: 1,
    costReduction: 0,
    incomeBoostBase: 0,
    prestigeDiscount: 1,
    researchBoost: 1,
  };

  const DEFAULT_SETTINGS = {
    soundEnabled: true,
    particlesEnabled: true,
    shakeEnabled: true,
    reducedMotion: false,
    autoSaveIntervalSec: 3,
    fpsCap: 60,
  };

  /* =========================================================
     Static Data
  ========================================================= */

  const buildings = [
    {
      id: 0,
      name: "Auto-Clicker",
      icon: "🤖",
      baseCost: 15,
      rate: 0.1,
      tier: 1,
    },
    { id: 1, name: "Worker", icon: "👷", baseCost: 100, rate: 1, tier: 1 },
    { id: 2, name: "Factory", icon: "🏭", baseCost: 500, rate: 5, tier: 1 },
    { id: 3, name: "Robot", icon: "🦾", baseCost: 2500, rate: 20, tier: 1 },
    { id: 4, name: "AI", icon: "🧠", baseCost: 10000, rate: 50, tier: 1 },
    {
      id: 5,
      name: "Supercomputer",
      icon: "💻",
      baseCost: 50000,
      rate: 250,
      tier: 2,
    },
    {
      id: 6,
      name: "Quantum Processor",
      icon: "⚛️",
      baseCost: 250000,
      rate: 1000,
      tier: 2,
    },
    {
      id: 7,
      name: "Neural Network",
      icon: "🧬",
      baseCost: 1000000,
      rate: 5000,
      tier: 2,
    },
    {
      id: 8,
      name: "Matrix Core",
      icon: "🌐",
      baseCost: 5000000,
      rate: 25000,
      tier: 2,
    },
    {
      id: 9,
      name: "Singularity",
      icon: "🕳️",
      baseCost: 25000000,
      rate: 125000,
      tier: 2,
    },
    {
      id: 10,
      name: "Dyson Sphere",
      icon: "☀️",
      baseCost: 100000000,
      rate: 500000,
      tier: 3,
    },
    {
      id: 11,
      name: "Kardashev Engine",
      icon: "⭐",
      baseCost: 500000000,
      rate: 2500000,
      tier: 3,
    },
    {
      id: 12,
      name: "Dimensional Rift",
      icon: "🌀",
      baseCost: 2500000000,
      rate: 12500000,
      tier: 3,
    },
    {
      id: 13,
      name: "Cosmic Web",
      icon: "🕸️",
      baseCost: 12500000000,
      rate: 62500000,
      tier: 3,
    },
    {
      id: 14,
      name: "Void Tap",
      icon: "⚫",
      baseCost: 62500000000,
      rate: 312500000,
      tier: 3,
    },
  ];

  const pets = [
    {
      id: "cat",
      name: "Cat",
      icon: "🐱",
      unlocksAt: 1,
      ability: "Passive Income",
      bonus: (lv) => lv * 0.05,
      maxLevel: 100,
    },
    {
      id: "dog",
      name: "Dog",
      icon: "🐶",
      unlocksAt: 3,
      ability: "Click Damage",
      bonus: (lv) => lv * 0.1,
      maxLevel: 100,
    },
    {
      id: "eagle",
      name: "Eagle",
      icon: "🦅",
      unlocksAt: 5,
      ability: "Crit Chance",
      bonus: (lv) => lv * 0.03,
      maxLevel: 100,
    },
    {
      id: "fox",
      name: "Fox",
      icon: "🦊",
      unlocksAt: 7,
      ability: "All Income",
      bonus: (lv) => lv * 0.01,
      maxLevel: 100,
    },
    {
      id: "dragon",
      name: "Dragon",
      icon: "🐉",
      unlocksAt: 10,
      ability: "Ultimate",
      bonus: (lv) => lv * 0.005,
      maxLevel: 100,
    },
  ];

  const petAbilities = {
    10: { name: "Auto-Feed", desc: "+1% passive coins from buildings" },
    25: { name: "Lucky Encounter", desc: "Random bonus every 60s" },
    50: { name: "Super Mode", desc: "2x multiplier for 30s" },
    75: { name: "Fusion", desc: "Synergy boost with active upgrades" },
    100: { name: "Ascension", desc: "Permanent +10% all income" },
  };

  const achievements = [
    {
      id: "earn_1k",
      icon: "🪙",
      name: "Penny Pincher",
      desc: "Earn 1K coins",
      target: 1e3,
      type: "earnings",
      bonus: 0.01,
    },
    {
      id: "earn_1m",
      icon: "💰",
      name: "Money Maker",
      desc: "Earn 1M coins",
      target: 1e6,
      type: "earnings",
      bonus: 0.01,
    },
    {
      id: "earn_1b",
      icon: "💎",
      name: "Billionaire",
      desc: "Earn 1B coins",
      target: 1e9,
      type: "earnings",
      bonus: 0.01,
    },
    {
      id: "earn_1t",
      icon: "🚀",
      name: "Cosmic Wealth",
      desc: "Earn 1T coins",
      target: 1e12,
      type: "earnings",
      bonus: 0.02,
    },
    {
      id: "click_100",
      icon: "👆",
      name: "Clicker",
      desc: "Click 100 times",
      target: 100,
      type: "clicks",
      bonus: 0.01,
    },
    {
      id: "click_1k",
      icon: "⚡",
      name: "Rapid Fire",
      desc: "Click 1K times",
      target: 1000,
      type: "clicks",
      bonus: 0.01,
    },
    {
      id: "click_10k",
      icon: "🔥",
      name: "Finger Master",
      desc: "Click 10K times",
      target: 10000,
      type: "clicks",
      bonus: 0.02,
    },
    {
      id: "crit_100",
      icon: "⭐",
      name: "Lucky",
      desc: "Get 100 crits",
      target: 100,
      type: "crits",
      bonus: 0.01,
    },
    {
      id: "crit_1k",
      icon: "✨",
      name: "Golden Touch",
      desc: "Get 1K crits",
      target: 1000,
      type: "crits",
      bonus: 0.02,
    },
    {
      id: "build_10",
      icon: "🏢",
      name: "Builder",
      desc: "Own 10 of any building",
      target: 10,
      type: "buildings",
      bonus: 0.01,
    },
    {
      id: "build_100",
      icon: "🌃",
      name: "Architect",
      desc: "Own 100 of any building",
      target: 100,
      type: "buildings",
      bonus: 0.02,
    },
    {
      id: "prestige_1",
      icon: "✨",
      name: "Prestige",
      desc: "Prestige once",
      target: 1,
      type: "prestige",
      bonus: 0.02,
    },
    {
      id: "prestige_5",
      icon: "👑",
      name: "Royal",
      desc: "Reach prestige 5",
      target: 5,
      type: "prestige",
      bonus: 0.02,
    },
  ];

  const researchTree = [
    {
      id: "crit_chance",
      icon: "⭐",
      name: "Sharp Reflexes",
      desc: "+1% crit chance",
      cost: 5,
      bonus: (gs) => {
        gs.critChance += 1;
      },
    },
    {
      id: "efficiency_1",
      icon: "💰",
      name: "Economy",
      desc: "-10% building costs",
      cost: 10,
      bonus: (gs) => {
        gs.costReduction += 10;
      },
    },
    {
      id: "power_1",
      icon: "💪",
      name: "Enhancement",
      desc: "+10% income",
      cost: 10,
      bonus: (gs) => {
        gs.incomeBoostBase += 10;
      },
    },
    {
      id: "prestige_discount",
      icon: "🎯",
      name: "Ambition",
      desc: "-20% prestige requirement",
      cost: 15,
      bonus: (gs) => {
        gs.prestigeDiscount = 0.8;
      },
    },
    {
      id: "combo_boost",
      icon: "🔥",
      name: "Momentum",
      desc: "+50% combo multiplier",
      cost: 20,
      bonus: (gs) => {
        gs.comboBoost = 1.5;
      },
    },
    {
      id: "bulk_procurement",
      icon: "📦",
      name: "Bulk Procurement",
      desc: "-7% building costs",
      cost: 30,
      requires: ["efficiency_1"],
      bonus: (gs) => {
        gs.costReduction += 7;
      },
    },
    {
      id: "lucky_math",
      icon: "🎲",
      name: "Lucky Math",
      desc: "+3% crit chance",
      cost: 35,
      requires: ["crit_chance"],
      bonus: (gs) => {
        gs.critChance += 3;
      },
    },
    {
      id: "automation_theory",
      icon: "🛰️",
      name: "Automation Theory",
      desc: "+18% passive income",
      cost: 40,
      requires: ["power_1"],
      bonus: (gs) => {
        gs.incomeBoostBase += 18;
      },
    },
    {
      id: "prestige_engineering",
      icon: "🧪",
      name: "Prestige Engineering",
      desc: "Prestige costs scale slower",
      cost: 55,
      requires: ["prestige_discount"],
      bonus: (gs) => {
        gs.prestigeDiscount *= 0.85;
      },
    },
    {
      id: "quantum_clicks",
      icon: "🫰",
      name: "Quantum Clicks",
      desc: "+60% click power",
      cost: 65,
      requires: ["combo_boost", "lucky_math"],
      bonus: (gs) => {
        gs.clickPowerMult *= 1.6;
      },
    },
  ];

  const prestigePerks = [
    {
      id: "crit_bonus",
      name: "Sharp Eye",
      icon: "👁️",
      desc: "+5% crit chance",
      unlockAt: 1,
      bonus: (gs) => {
        gs.critChance += 5;
      },
    },
    {
      id: "income_boost",
      name: "Prosperity",
      icon: "💰",
      desc: "+20% income",
      unlockAt: 1,
      bonus: (gs) => {
        gs.incomeBoostBase += 20;
      },
    },
    {
      id: "cost_reduction",
      name: "Efficiency",
      icon: "⚙️",
      desc: "-10% building costs",
      unlockAt: 1,
      bonus: (gs) => {
        gs.costReduction += 10;
      },
    },
    {
      id: "research_boost",
      name: "Insight",
      icon: "🧠",
      desc: "+50% research points",
      unlockAt: 2,
      bonus: (gs) => {
        gs.researchBoost *= 1.5;
      },
    },
  ];

  const events = [
    { name: "🍀 Lucky Strike", duration: 10, multiplier: 1.5 },
    { name: "🔥 Hot Streak", duration: 15, multiplier: 2 },
    { name: "⚡ Power Surge", duration: 20, multiplier: 5 },
    { name: "📉 Market Slump", duration: 18, multiplier: 0.65 },
    { name: "🧊 Frozen Supply", duration: 12, multiplier: 0.8 },
    {
      name: "💎 Treasure",
      trigger: "instant",
      reward: (coins) => Math.max(100, coins * 0.1),
    },
    {
      name: "🧾 Tax Audit",
      trigger: "instant",
      apply: (gs) => {
        const loss = Math.min(
          Math.max(250, gs.coins * 0.04),
          Math.max(
            250,
            getPassiveIncomePerSecond({ includeEventBoost: false }) * 45,
          ),
        );
        gs.coins = Math.max(0, gs.coins - loss);
        return `${formatNumber(loss)} coins lost`;
      },
    },
    {
      name: "🔬 Lab Breakthrough",
      trigger: "instant",
      apply: (gs) => {
        const points = Math.max(1, Math.floor(2 + gs.prestigeLevel / 2));
        gs.researchPoints += points;
        return `+${points} research`;
      },
    },
  ];

  const upgrades = [
    // Click
    {
      id: "u_click_1",
      icon: "👆",
      name: "Stronger Fingers I",
      type: "click",
      cost: 250,
      desc: "+25% click power",
      apply: (gs) => {
        gs.clickPowerMult *= 1.25;
      },
    },
    {
      id: "u_click_2",
      icon: "⚡",
      name: "Stronger Fingers II",
      type: "click",
      cost: 5000,
      desc: "+40% click power",
      requires: ["u_click_1"],
      apply: (gs) => {
        gs.clickPowerMult *= 1.4;
      },
    },
    {
      id: "u_click_3",
      icon: "🔥",
      name: "Hyper Tap",
      type: "click",
      cost: 50000,
      desc: "+75% click power",
      requires: ["u_click_2"],
      apply: (gs) => {
        gs.clickPowerMult *= 1.75;
      },
    },

    // Income
    {
      id: "u_income_1",
      icon: "🏭",
      name: "Assembly Optimizer",
      type: "income",
      cost: 1000,
      desc: "+15% passive income",
      apply: (gs) => {
        gs.incomeBoostBase += 15;
      },
    },
    {
      id: "u_income_2",
      icon: "💻",
      name: "Parallel Schedulers",
      type: "income",
      cost: 10000,
      desc: "+25% passive income",
      requires: ["u_income_1"],
      apply: (gs) => {
        gs.incomeBoostBase += 25;
      },
    },
    {
      id: "u_income_3",
      icon: "🌌",
      name: "Galactic Throughput",
      type: "income",
      cost: 1000000,
      desc: "+50% passive income",
      requires: ["u_income_2"],
      apply: (gs) => {
        gs.incomeBoostBase += 50;
      },
    },

    // Special
    {
      id: "u_special_1",
      icon: "🎯",
      name: "Keen Sight",
      type: "special",
      cost: 15000,
      desc: "+2% crit chance",
      apply: (gs) => {
        gs.critChance += 2;
      },
    },
    {
      id: "u_special_2",
      icon: "🔁",
      name: "Combo Keeper",
      type: "special",
      cost: 80000,
      desc: "Combo decay slower",
      apply: (gs) => {
        gs.comboTimeoutMs += 800;
      },
    },
    {
      id: "u_special_3",
      icon: "🧲",
      name: "Efficient Shopper",
      type: "special",
      cost: 250000,
      desc: "-5% building cost",
      apply: (gs) => {
        gs.costReduction += 5;
      },
    },
  ];

  /* =========================================================
     State
  ========================================================= */

  const gameState = {
    version: VERSION,

    // Currency / progression
    coins: 0,
    prestigeLevel: 0,
    prestigeTier: 0,
    prestigePerks: [],
    voidMachineOwned: false,

    // Buildings
    buildingCounts: new Array(MAX_BUILDINGS).fill(0),

    // Stats
    totalClicks: 0,
    totalEarnings: 0,
    critHits: 0,
    maxCombo: 0,
    startTime: Date.now(),
    totalPrestiges: 0,

    // Systems
    combo: 0,
    comboLastClick: 0,
    comboBoost: BASE_PROGRESS_STATS.comboBoost,
    comboTimeoutMs: BASE_PROGRESS_STATS.comboTimeoutMs,
    critChance: BASE_PROGRESS_STATS.critChance,
    clickPowerMult: BASE_PROGRESS_STATS.clickPowerMult,

    costReduction: BASE_PROGRESS_STATS.costReduction,
    incomeBoostBase: BASE_PROGRESS_STATS.incomeBoostBase,
    incomeBoostPet: 0,

    prestigeDiscount: BASE_PROGRESS_STATS.prestigeDiscount,
    researchPoints: 0,
    researchBoost: BASE_PROGRESS_STATS.researchBoost,
    purchasedResearch: {},
    achievements: {},

    // Upgrades
    purchasedUpgrades: {},
    upgradeFilter: "all",

    // Quests
    quests: {
      daily: [],
      weekly: [],
      streakCompletedDays: 0,
      lastGeneratedAt: 0,
      dailyBaseline: { clicks: 0, earnings: 0, buildings: 0, prestige: 0 },
      weeklyBaseline: { clicks: 0, earnings: 0, buildings: 0, prestige: 0 },
      dailyCompletionsToday: 0,
      dailyCompletionsStamp: 0,
    },

    // Cosmetics / UX
    theme: "dark",
    buyMode: "1",
    settings: { ...DEFAULT_SETTINGS },
    socialLastReadAt: 0,

    // Events
    activeEvent: null,
    eventEndTime: 0,
    eventMultiplier: 1,
    nextEventAt: 0,

    // Pets
    unlockedPets: [],
    activePet: null,
    petLevels: {},
    petXP: {},
    petAbilitiesUnlocked: {},
    totalPetBonus: 0,

    // Session tracking
    lastSaveAt: Date.now(),
    lastActiveAt: Date.now(),
    lastLoginDate: 0,
    loginStreak: 0,

    // Performance
    frameTimes: [],
    fpsSmoothed: 60,
  };

  const defaultGameStateSnapshot = JSON.parse(JSON.stringify(gameState));

  function createFreshStateDefaults() {
    const defaults = JSON.parse(JSON.stringify(defaultGameStateSnapshot));
    const now = nowMs();
    defaults.startTime = now;
    defaults.lastSaveAt = now;
    defaults.lastActiveAt = now;
    return defaults;
  }

  let runtime = {
    rafId: 0,
    running: false,
    lastTs: 0,
    lastSaveTs: 0,
    lastUiRenderTs: 0,
    lastAccountSyncTs: 0,
    saveEveryMs: DEFAULT_SETTINGS.autoSaveIntervalSec * 1000,
    minFrameMs: 1000 / DEFAULT_SETTINGS.fpsCap,
    accountSyncEveryMs: 3000,
    comboIntervalId: 0,
    uiDirty: true,
    lastMiniGameAt: 0,
    miniGameCooldownMs: 45000,
    lastChatAt: 0,
    lastGiftAt: 0,
    nextPetLuckyAt: 0,
    lastLayoutSyncAt: 0,
  };

  /* =========================================================
     Account & Role System
  ========================================================= */

  let currentUser = null;
  let selectedAdminPlayer = null;
  let authHandlersBound = false;
  let playerHandlersBound = false;
  let adminHandlersBound = false;
  let socialHandlersBound = false;

  function normalizeUsername(username) {
    return String(username || "").trim();
  }

  function accountKey(username) {
    return normalizeUsername(username).toLowerCase();
  }

  function normalizeRole(role) {
    const value = String(role || "player").trim().toLowerCase();
    if (value === "owner") return "owner";
    if (value === "admin" || value === "administrator") return "admin";
    return "player";
  }

  function currentRole() {
    return normalizeRole(currentUser?.role);
  }

  function isSelfTarget(username) {
    return !!currentUser && accountKey(currentUser.username) === accountKey(username);
  }

  function hashPassword(pwd) {
    return btoa(
      String(pwd || "")
        .split("")
        .reverse()
        .join(""),
    );
  }

  function getPlayerSaveKey(username) {
    return `${PLAYER_DATA_PREFIX}${username}`;
  }

  function getPlayerSlotKey(slot, username = currentUser?.username) {
    return `${SLOT_PREFIX}${username || "unknown"}_${slot}`;
  }

  function clearPlayerSlots(username) {
    for (let i = 1; i <= 3; i++) {
      localStorage.removeItem(getPlayerSlotKey(i, username));
    }
  }

  function removeAllPlayerData(username) {
    localStorage.removeItem(getPlayerSaveKey(username));
    clearPlayerSlots(username);
  }

  function readPlayerSave(username) {
    const raw = localStorage.getItem(getPlayerSaveKey(username));
    return raw ? safeJsonParse(raw) : null;
  }

  function writePlayerSave(username, state) {
    localStorage.setItem(getPlayerSaveKey(username), JSON.stringify(state));
  }

  const accountSystem = {
    register(username, password) {
      const normalizedUsername = normalizeUsername(username);
      if (!normalizedUsername || !password) {
        return { success: false, error: "Username and password required" };
      }

      if (normalizedUsername.length < 3) {
        return {
          success: false,
          error: "Username must be at least 3 characters",
        };
      }

      if (password.length < 3) {
        return {
          success: false,
          error: "Password must be at least 3 characters",
        };
      }

      const accounts = this.getAllAccounts();
      const exists = accounts.find(
        (a) => accountKey(a.username) === accountKey(normalizedUsername),
      );
      if (exists) {
        return { success: false, error: "Username already exists" };
      }

      const ownerExists = accounts.some((a) => normalizeRole(a.role) === "owner");
      const isOwnerClaim =
        accountKey(normalizedUsername) === accountKey(OWNER_USERNAME) &&
        !ownerExists;

      const newAccount = {
        username: normalizedUsername,
        passwordHash: hashPassword(password),
        role: isOwnerClaim ? "owner" : "player",
        isActive: true,
        createdAt: nowMs(),
        lastLogin: null,
        warnings: 0,
        notifications: [],
        kickedUntil: 0,
      };

      accounts.push(newAccount);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

      return { success: true, account: newAccount };
    },

    login(username, password) {
      const normalizedUsername = normalizeUsername(username);
      if (!normalizedUsername || !password) {
        return { success: false, error: "Username and password required" };
      }

      const accounts = this.getAllAccounts();
      const account = accounts.find(
        (a) => accountKey(a.username) === accountKey(normalizedUsername),
      );

      if (!account) {
        return { success: false, error: "Account not found" };
      }

      if (account.passwordHash !== hashPassword(password)) {
        return { success: false, error: "Incorrect password" };
      }

      if (!account.isActive) {
        return { success: false, error: "Account is disabled" };
      }

      if (Number(account.kickedUntil || 0) > nowMs()) {
        const remaining = Number(account.kickedUntil) - nowMs();
        return {
          success: false,
          error: `You are kicked. Try again in ${formatDuration(remaining)}.`,
        };
      }

      account.lastLogin = nowMs();
      if (Number(account.kickedUntil || 0) <= nowMs()) account.kickedUntil = 0;
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

      currentUser = {
        username: account.username,
        role: normalizeRole(account.role),
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

      return { success: true, user: currentUser };
    },

    restoreSession() {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;

      const parsed = safeJsonParse(raw);
      if (!parsed?.username) {
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }

      const account = this.getAccount(parsed.username);
      if (!account || !account.isActive) {
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }

      if (Number(account.kickedUntil || 0) > nowMs()) {
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }

      currentUser = {
        username: account.username,
        role: normalizeRole(account.role),
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      return currentUser;
    },

    logout() {
      currentUser = null;
      selectedAdminPlayer = null;
      localStorage.removeItem(CURRENT_USER_KEY);
    },

    getAllAccounts() {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      const accounts = data ? safeJsonParse(data) : [];
      if (!Array.isArray(accounts)) return [];

      let dirty = false;
      const normalized = accounts
        .filter((account) => isObj(account) && normalizeUsername(account.username))
        .map((account) => {
          const next = {
            ...account,
            username: normalizeUsername(account.username),
            role: normalizeRole(account.role),
            isActive: account.isActive !== false,
            warnings: Number(account.warnings || 0),
            notifications: Array.isArray(account.notifications)
              ? account.notifications
              : [],
            kickedUntil: Number(account.kickedUntil || 0),
          };

          if (
            next.username !== account.username ||
            next.role !== account.role ||
            next.isActive !== account.isActive ||
            next.warnings !== account.warnings ||
            next.notifications !== account.notifications ||
            next.kickedUntil !== account.kickedUntil
          ) {
            dirty = true;
          }

          return next;
        });

      const hasOwner = normalized.some((a) => a.role === "owner");
      const claimableOwner = normalized.find(
        (a) => accountKey(a.username) === accountKey(OWNER_USERNAME),
      );
      if (!hasOwner && claimableOwner) {
        claimableOwner.role = "owner";
        dirty = true;
      }

      if (dirty) localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(normalized));
      return normalized;
    },

    getAccount(username) {
      const accounts = this.getAllAccounts();
      return accounts.find((a) => accountKey(a.username) === accountKey(username)) || null;
    },

    updateAccount(username, updates) {
      const accounts = this.getAllAccounts();
      const idx = accounts.findIndex(
        (a) => accountKey(a.username) === accountKey(username),
      );
      if (idx === -1) return false;

      accounts[idx] = { ...accounts[idx], ...updates };
      if (updates.role) accounts[idx].role = normalizeRole(updates.role);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

      if (
        currentUser &&
        accountKey(currentUser.username) === accountKey(username) &&
        updates.role
      ) {
        currentUser.role = normalizeRole(updates.role);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      }

      return true;
    },

    deleteAccount(username) {
      const accounts = this.getAllAccounts();
      const filtered = accounts.filter(
        (a) => accountKey(a.username) !== accountKey(username),
      );
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));
      removeAllPlayerData(username);
    },

    promoteToAdmin(username) {
      return this.updateAccount(username, { role: "admin" });
    },

    demoteToPlayer(username) {
      return this.updateAccount(username, { role: "player" });
    },

    addWarning(username, byUsername = "Admin") {
      const account = this.getAccount(username);
      if (!account) return false;

      const nextWarnings = Number(account.warnings || 0) + 1;
      const notifications = Array.isArray(account.notifications)
        ? [...account.notifications]
        : [];
      notifications.push({
        id: `${nowMs()}_${Math.random().toString(36).slice(2, 8)}`,
        type: "warning",
        message: `⚠️ You were warned by ${byUsername}.`,
        createdAt: nowMs(),
      });

      return this.updateAccount(username, {
        warnings: nextWarnings,
        notifications,
      });
    },

    clearWarnings(username) {
      return this.updateAccount(username, { warnings: 0 });
    },

    kickPlayer(username, byUsername, minutes = 10) {
      const account = this.getAccount(username);
      if (!account) return false;

      const kickMinutes = clamp(Number(minutes) || 10, 1, 1440);
      const kickedUntil = nowMs() + kickMinutes * 60 * 1000;
      const notifications = Array.isArray(account.notifications)
        ? [...account.notifications]
        : [];

      notifications.push({
        id: `${nowMs()}_${Math.random().toString(36).slice(2, 8)}`,
        type: "kick",
        message: `🛑 You were kicked by ${byUsername} for ${Math.floor(kickMinutes)} minute(s).`,
        createdAt: nowMs(),
      });

      return this.updateAccount(username, { kickedUntil, notifications });
    },

    collectNotifications(username) {
      const account = this.getAccount(username);
      if (!account) return [];
      const notifications = Array.isArray(account.notifications)
        ? [...account.notifications]
        : [];
      if (notifications.length)
        this.updateAccount(username, { notifications: [] });
      return notifications;
    },
  };

  const permissionSystem = {
    canPromoteAdmin(targetUsername) {
      return (
        !!currentUser &&
        currentRole() === "owner" &&
        !isSelfTarget(targetUsername)
      );
    },

    canDemoteAdmin(targetUsername) {
      return (
        !!currentUser &&
        currentRole() === "owner" &&
        !isSelfTarget(targetUsername)
      );
    },

    canDeleteAccount(targetUsername) {
      return (
        !!currentUser &&
        currentRole() === "owner" &&
        !isSelfTarget(targetUsername)
      );
    },

    canResetPlayer(targetUsername) {
      return (
        !!currentUser &&
        (currentRole() === "owner" || currentRole() === "admin") &&
        !isSelfTarget(targetUsername)
      );
    },

    canModifyCoins(targetUsername) {
      return !!currentUser && currentRole() === "owner" && !!targetUsername;
    },

    canViewPlayers() {
      return !!currentUser;
    },

    canViewAllPlayerData() {
      return (
        !!currentUser &&
        (currentRole() === "owner" || currentRole() === "admin")
      );
    },

    canWarnPlayer(targetUsername) {
      return (
        !!currentUser &&
        (currentRole() === "owner" || currentRole() === "admin") &&
        !isSelfTarget(targetUsername)
      );
    },

    canKickPlayer(targetUsername) {
      return (
        !!currentUser &&
        (currentRole() === "owner" || currentRole() === "admin") &&
        !isSelfTarget(targetUsername)
      );
    },

    canClearWarnings(targetUsername) {
      return !!currentUser && currentRole() === "owner" && !!targetUsername;
    },

    isOwner() {
      return !!currentUser && currentRole() === "owner";
    },

    isAdmin() {
      return (
        !!currentUser &&
        (currentRole() === "admin" || currentRole() === "owner")
      );
    },

    isLoggedIn() {
      return !!currentUser;
    },
  };

  /* =========================================================
     Social System (local same-browser multiplayer)
  ========================================================= */

  function makeId(prefix = "id") {
    return `${prefix}_${nowMs()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function getEmptySocialStore() {
    return { chat: [], gifts: [] };
  }

  function readSocialStore() {
    const raw = localStorage.getItem(SOCIAL_KEY);
    const parsed = raw ? safeJsonParse(raw) : null;
    const store = isObj(parsed) ? parsed : getEmptySocialStore();
    if (!Array.isArray(store.chat)) store.chat = [];
    if (!Array.isArray(store.gifts)) store.gifts = [];
    return store;
  }

  function writeSocialStore(store) {
    const next = isObj(store) ? store : getEmptySocialStore();
    next.chat = Array.isArray(next.chat)
      ? next.chat.slice(-MAX_CHAT_MESSAGES)
      : [];
    next.gifts = Array.isArray(next.gifts)
      ? next.gifts.slice(-MAX_GIFT_HISTORY)
      : [];
    localStorage.setItem(SOCIAL_KEY, JSON.stringify(next));
  }

  function addAccountNotification(username, message, type = "social") {
    const account = accountSystem.getAccount(username);
    if (!account) return false;
    const notifications = Array.isArray(account.notifications)
      ? [...account.notifications]
      : [];
    notifications.push({
      id: makeId(type),
      type,
      message,
      createdAt: nowMs(),
    });
    return accountSystem.updateAccount(account.username, { notifications });
  }

  function addSystemChat(text) {
    const store = readSocialStore();
    store.chat.push({
      id: makeId("chat"),
      username: "System",
      role: "system",
      text: String(text || "").slice(0, 180),
      createdAt: nowMs(),
      system: true,
    });
    writeSocialStore(store);
  }

  function getUnreadSocialCount() {
    if (!currentUser?.username) return 0;
    const store = readSocialStore();
    const lastRead = Number(gameState.socialLastReadAt || 0);
    return (
      store.chat.filter((m) => Number(m.createdAt || 0) > lastRead).length +
      store.gifts.filter(
        (g) =>
          accountKey(g.to) === accountKey(currentUser.username) &&
          !g.claimed &&
          !g.rejected,
      ).length
    );
  }

  function markSocialRead() {
    gameState.socialLastReadAt = nowMs();
    saveGame();
    updateSocialBadge();
  }

  function updateSocialBadge() {
    const badge = q(".social-unread-badge");
    if (!badge) return;
    const count = getUnreadSocialCount();
    badge.textContent = String(Math.min(99, count));
    badge.classList.toggle("hidden", count <= 0);
  }

  function selectSocialTab(tab = "chat") {
    qa(".social-tab-btn").forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.socialTab === tab),
    );
    qa(".social-tab-content").forEach((content) =>
      content.classList.toggle(
        "active",
        content.dataset.socialTab === tab,
      ),
    );
  }

  function openSocialHub(tab = "chat", target = "") {
    if (!permissionSystem.isLoggedIn()) {
      showEventNotification("Please login first");
      return;
    }
    selectSocialTab(tab);
    if (target) {
      const giftTarget = q(".gift-target-input");
      if (giftTarget) giftTarget.value = target;
    }
    renderSocialPanel();
    openPanel(".social-panel");
    markSocialRead();
  }

  function sendChatMessage(text, options = {}) {
    if (!currentUser?.username) return false;
    const msg = String(text || "").trim().replace(/\s+/g, " ");
    if (!msg) return false;
    if (!options.system && nowMs() - runtime.lastChatAt < CHAT_COOLDOWN_MS) {
      showEventNotification("Chat is cooling down for a moment");
      return false;
    }

    const store = readSocialStore();
    store.chat.push({
      id: makeId("chat"),
      username: currentUser.username,
      role: currentRole(),
      text: msg.slice(0, 160),
      createdAt: nowMs(),
    });
    writeSocialStore(store);
    runtime.lastChatAt = nowMs();
    renderSocialPanel();
    updateSocialBadge();
    return true;
  }

  function sendCheer(targetUsername) {
    const account = accountSystem.getAccount(targetUsername);
    if (!account || isSelfTarget(account.username)) return;
    const bonus = Math.max(
      50,
      getPassiveIncomePerSecond({ includeEventBoost: false }) * 10,
    );
    gameState.coins += bonus;
    gameState.totalEarnings += bonus;
    addAccountNotification(
      account.username,
      `📣 ${currentUser.username} cheered for you in chat.`,
      "cheer",
    );
    sendChatMessage(`📣 cheered for ${account.username}!`, { system: true });
    showEventNotification(`Team spirit: +${formatNumber(bonus)} coins`);
    runtime.uiDirty = true;
  }

  function sendGift(targetUsername, coins, research, note = "") {
    if (!currentUser?.username) return;
    if (nowMs() - runtime.lastGiftAt < GIFT_COOLDOWN_MS) {
      showEventNotification("Gift sending is cooling down");
      return;
    }

    const targetAccount = accountSystem.getAccount(targetUsername);
    if (!targetAccount) {
      showEventNotification("Player not found");
      playSound("error");
      return;
    }
    if (isSelfTarget(targetAccount.username)) {
      showEventNotification("You cannot gift yourself");
      playSound("error");
      return;
    }

    const giftCoins = Math.max(0, Math.floor(Number(coins) || 0));
    const giftResearch = Math.max(0, Math.floor(Number(research) || 0));
    if (giftCoins <= 0 && giftResearch <= 0) {
      showEventNotification("Add coins or research to gift");
      playSound("error");
      return;
    }
    if (giftCoins > gameState.coins || giftResearch > gameState.researchPoints) {
      showEventNotification("You do not have enough for that gift");
      playSound("error");
      return;
    }

    gameState.coins -= giftCoins;
    gameState.researchPoints -= giftResearch;

    const mysteryBoost = Math.random() < 0.12;
    const deliveredCoins = mysteryBoost ? giftCoins * 2 : giftCoins;
    const deliveredResearch = mysteryBoost ? giftResearch + 1 : giftResearch;
    const store = readSocialStore();
    const gift = {
      id: makeId("gift"),
      from: currentUser.username,
      to: targetAccount.username,
      coins: deliveredCoins,
      research: deliveredResearch,
      note: String(note || "").trim().slice(0, 80),
      createdAt: nowMs(),
      claimed: false,
      rejected: false,
      mysteryBoost,
    };
    store.gifts.push(gift);
    writeSocialStore(store);

    const kindnessBonus =
      giftResearch > 0 ||
      giftCoins >=
        Math.max(1000, getPassiveIncomePerSecond({ includeEventBoost: false }) * 60)
        ? 1
        : 0;
    if (kindnessBonus) gameState.researchPoints += kindnessBonus;

    addAccountNotification(
      targetAccount.username,
      `🎁 ${currentUser.username} sent you a gift.`,
      "gift",
    );
    addSystemChat(
      `🎁 ${currentUser.username} sent ${targetAccount.username} a gift${
        mysteryBoost ? " and it became a mystery bonus!" : ""
      }.`,
    );

    runtime.lastGiftAt = nowMs();
    runtime.uiDirty = true;
    saveGame();
    renderSocialPanel();
    showEventNotification(
      `Gift sent${mysteryBoost ? " and doubled" : ""}${
        kindnessBonus ? " (+1 kindness research)" : ""
      }`,
    );
    playSound("purchase");
  }

  function updateGiftStatus(giftId, updater) {
    const store = readSocialStore();
    const gift = store.gifts.find((g) => g.id === giftId);
    if (!gift) return null;
    updater(gift);
    writeSocialStore(store);
    return gift;
  }

  function claimGift(giftId) {
    const existing = readSocialStore().gifts.find((g) => g.id === giftId);
    if (
      !existing ||
      accountKey(existing.to) !== accountKey(currentUser?.username) ||
      existing.claimed ||
      existing.rejected
    ) {
      showEventNotification("Gift unavailable");
      return;
    }

    const gift = updateGiftStatus(giftId, (g) => {
      if (
        accountKey(g.to) !== accountKey(currentUser?.username) ||
        g.claimed ||
        g.rejected
      ) {
        return;
      }
      g.claimed = true;
      g.claimedAt = nowMs();
    });

    if (!gift || !gift.claimed) {
      showEventNotification("Gift unavailable");
      return;
    }

    gameState.coins += Number(gift.coins) || 0;
    gameState.researchPoints += Number(gift.research) || 0;
    runtime.uiDirty = true;
    saveGame();
    renderSocialPanel();
    showEventNotification(
      `Gift claimed: +${formatNumber(gift.coins || 0)} coins +${gift.research || 0} research`,
    );
    playSound("achievement");
  }

  function rejectGift(giftId) {
    const gift = updateGiftStatus(giftId, (g) => {
      if (
        accountKey(g.to) !== accountKey(currentUser?.username) ||
        g.claimed ||
        g.rejected
      ) {
        return;
      }
      g.rejected = true;
      g.rejectedAt = nowMs();
    });
    if (!gift) return;
    renderSocialPanel();
    showEventNotification("Gift dismissed");
  }

  /* =========================================================
     DOM helpers
  ========================================================= */
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

  const panelSelectors = [
    ".research-tree",
    ".achievements-panel",
    ".upgrades-panel",
    ".quests-panel",
    ".stats-panel",
    ".settings-panel",
    ".save-manager-panel",
    ".social-panel",
    ".pet-panel",
    ".players-panel",
    ".admin-panel",
    ".modal",
    ".confirm-modal",
    ".pet-modal",
  ];

  function safeText(el, text) {
    if (el) el.textContent = text;
  }

  function setHidden(el, hidden) {
    if (!el) return;
    el.classList.toggle("hidden", !!hidden);
    el.setAttribute("aria-hidden", hidden ? "true" : "false");
  }

  function openPanel(selector) {
    const target = q(selector);
    if (!target) return;
    // close modal-level panels except pet indicator style panel
    panelSelectors.forEach((sel) => {
      const el = q(sel);
      if (!el || el === target) return;
      if (!el.classList.contains("pet-indicator")) setHidden(el, true);
    });
    setHidden(target, false);
  }

  function closePanel(selector) {
    setHidden(q(selector), true);
  }

  /* =========================================================
     Math / formatting / guards
  ========================================================= */

  function clamp(v, min, max) {
    const n = Number(v);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function isObj(v) {
    return v && typeof v === "object" && !Array.isArray(v);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function nowMs() {
    return Date.now();
  }

  function perfNow() {
    return performance.now();
  }

  function formatNumber(n) {
    const x = Number(n) || 0;
    if (x < 1000) return Math.floor(x).toString();
    if (x < 1e6) return `${(x / 1e3).toFixed(1)}K`;
    if (x < 1e9) return `${(x / 1e6).toFixed(1)}M`;
    if (x < 1e12) return `${(x / 1e9).toFixed(1)}B`;
    if (x < 1e15) return `${(x / 1e12).toFixed(1)}T`;
    if (x < 1e18) return `${(x / 1e15).toFixed(1)}Qa`;
    if (x < 1e21) return `${(x / 1e18).toFixed(1)}Qi`;
    return x.toExponential(2);
  }

  function formatDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  function formatRelativeTime(ts) {
    const diff = nowMs() - Number(ts || 0);
    if (!Number.isFinite(diff) || diff < 0) return "now";
    if (diff < 60000) return `${Math.max(1, Math.floor(diff / 1000))}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < DAILY_MS) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(Number(ts)).toLocaleDateString();
  }

  function dayStamp(ts) {
    return Math.floor(ts / DAILY_MS);
  }

  /* =========================================================
     Notifications / confirm
  ========================================================= */

  function showEventNotification(text, timeout = 2800) {
    const el = q(".event-notification");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("hidden");
    setTimeout(() => el.classList.add("hidden"), timeout);
  }

  function showAchievementNotif(ach) {
    const reward = Math.floor(5 * gameState.researchBoost);
    gameState.researchPoints += reward;

    const n = document.createElement("div");
    n.className = "achievement-notification";
    n.style.cssText =
      "position:fixed;top:100px;right:20px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:12px 16px;border-radius:8px;font-weight:600;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,.35);";
    n.innerHTML = `${ach.icon || "🏆"} ${ach.name || "Achievement"} - ${ach.desc || ""}<br><span style="font-size:12px;opacity:.85">+${reward} research</span>`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2500);
  }

  function confirmAction(message, onYes) {
    const modal = q(".confirm-modal");
    const msg = q(".confirm-message");
    const yes = q(".confirm-yes-btn");
    const no = q(".confirm-no-btn");
    if (!modal || !yes || !no || !msg) {
      if (window.confirm(message)) onYes?.();
      return;
    }

    msg.textContent = message;
    setHidden(modal, false);

    const cleanup = () => {
      yes.onclick = null;
      no.onclick = null;
      setHidden(modal, true);
    };
    yes.onclick = () => {
      cleanup();
      onYes?.();
    };
    no.onclick = cleanup;
  }

  /* =========================================================
     Audio
  ========================================================= */

  let audioCtx = null;
  function playSound(type = "click") {
    if (!gameState.settings.soundEnabled) return;
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx;
      const t = ctx.currentTime;

      const cfgMap = {
        click: { f: 380, d: 0.07, g: 0.12 },
        crit: { f: 840, d: 0.14, g: 0.16 },
        purchase: { f: 620, d: 0.1, g: 0.12 },
        event: { f: 520, d: 0.18, g: 0.14 },
        prestige: { f: 730, d: 0.25, g: 0.15 },
        achievement: { f: 920, d: 0.2, g: 0.15 },
        error: { f: 190, d: 0.09, g: 0.12 },
      };
      const c = cfgMap[type] || cfgMap.click;

      for (let i = 0; i < 2; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(c.f + i * 120, t + i * 0.03);
        gain.gain.setValueAtTime(c.g, t + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, t + c.d + i * 0.03);

        osc.start(t + i * 0.03);
        osc.stop(t + c.d + i * 0.03);
      }
    } catch (_) {}
  }

  /* =========================================================
     FX (particle-safe)
  ========================================================= */

  function canFx() {
    return (
      gameState.settings.particlesEnabled && !gameState.settings.reducedMotion
    );
  }

  function createFloatingCoin(amount, isCrit = false) {
    if (!canFx()) return;
    const layer = q("#floating-coins");
    const btn = q(".main-button");
    if (!layer || !btn) return;

    const coin = document.createElement("div");
    coin.className = isCrit ? "floating-coin crit" : "floating-coin normal";
    coin.textContent = `+${formatNumber(amount)}${isCrit ? "!" : ""}`;
    coin.style.left = `${btn.offsetLeft + btn.offsetWidth / 2}px`;
    coin.style.top = `${btn.offsetTop + btn.offsetHeight / 2}px`;
    layer.appendChild(coin);
    setTimeout(() => coin.remove(), 900);
  }

  function createConfetti(count = 20) {
    if (!canFx()) return;
    const btn = q(".main-button");
    if (!btn) return;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.style.cssText = `position:fixed;width:8px;height:8px;left:${btn.offsetLeft + btn.offsetWidth / 2}px;top:${btn.offsetTop + btn.offsetHeight / 2}px;border-radius:50%;background:hsl(${Math.random() * 360},100%,55%);pointer-events:none;z-index:9999;`;
      document.body.appendChild(p);

      const vx = rand(-6, 6);
      let vy = rand(-9, -2);
      let x = btn.offsetLeft + btn.offsetWidth / 2;
      let y = btn.offsetTop + btn.offsetHeight / 2;
      let life = 0;

      const tick = () => {
        x += vx;
        vy += 0.35;
        y += vy;
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.opacity = `${Math.max(0, 1 - life / 35)}`;
        life++;
        if (life < 35) requestAnimationFrame(tick);
        else p.remove();
      };
      requestAnimationFrame(tick);
    }
  }

  function createShockwave() {
    if (!canFx()) return;
    const btn = q(".main-button");
    if (!btn) return;
    const sw = document.createElement("div");
    sw.style.cssText = `position:fixed;left:${btn.offsetLeft + btn.offsetWidth / 2}px;top:${btn.offsetTop + btn.offsetHeight / 2}px;width:20px;height:20px;border-radius:50%;border:2px solid var(--primary);transform:translate(-50%,-50%);pointer-events:none;z-index:9998;`;
    document.body.appendChild(sw);

    let size = 20;
    let opacity = 1;
    let f = 0;
    const iv = setInterval(() => {
      size += 8;
      opacity -= 0.12;
      sw.style.width = `${size}px`;
      sw.style.height = `${size}px`;
      sw.style.opacity = `${opacity}`;
      f++;
      if (f > 8) {
        clearInterval(iv);
        sw.remove();
      }
    }, 16);
  }

  /* =========================================================
     Derived calculations
  ========================================================= */

  function getIncomeBoostPercent() {
    return (
      gameState.incomeBoostBase +
      gameState.incomeBoostPet +
      (gameState.voidMachineOwned ? 100 : 0)
    );
  }

  function getPrestigeMultiplier() {
    return 1 + gameState.prestigeLevel * 0.1;
  }

  function getPrestigeRequirement() {
    const purchases = Math.max(0, Number(gameState.totalPrestiges) || 0);
    const prestigePressure =
      1 + Math.max(0, Number(gameState.prestigeLevel) || 0) * 0.08;
    return (
      BASE_PRESTIGE_COST *
      Math.pow(PRESTIGE_COST_GROWTH, purchases) *
      prestigePressure *
      gameState.prestigeDiscount
    );
  }

  function getPrestigeGain(req = getPrestigeRequirement()) {
    if (gameState.coins < req) return 0;
    return Math.max(1, Math.floor(Math.sqrt(gameState.coins / req)));
  }

  function getPetAbilityLevels(petId = gameState.activePet) {
    const levels = gameState.petAbilitiesUnlocked?.[petId];
    return Array.isArray(levels) ? levels : [];
  }

  function hasPetAbility(level, petId = gameState.activePet) {
    return getPetAbilityLevels(petId).includes(level);
  }

  function normalizePetState(state = gameState) {
    state.unlockedPets = Array.isArray(state.unlockedPets)
      ? state.unlockedPets.filter((id) => pets.some((pet) => pet.id === id))
      : [];

    if (!isObj(state.petLevels)) state.petLevels = {};
    if (!isObj(state.petXP)) state.petXP = {};
    if (!isObj(state.petAbilitiesUnlocked)) state.petAbilitiesUnlocked = {};

    state.unlockedPets.forEach((id) => {
      if (!Number.isFinite(Number(state.petLevels[id]))) {
        state.petLevels[id] = 1;
      }
      state.petLevels[id] = clamp(
        Math.floor(state.petLevels[id]),
        1,
        pets.find((pet) => pet.id === id)?.maxLevel || 100,
      );
      if (!Number.isFinite(Number(state.petXP[id]))) state.petXP[id] = 0;
      if (!Array.isArray(state.petAbilitiesUnlocked[id])) {
        state.petAbilitiesUnlocked[id] = [];
      }
      state.petAbilitiesUnlocked[id] = [
        ...new Set(state.petAbilitiesUnlocked[id].map(Number)),
      ].filter((level) => petAbilities[level]);

      const pet = pets.find((p) => p.id === id);
      while (
        pet &&
        state.petLevels[id] < pet.maxLevel &&
        state.petXP[id] >= 100 * state.petLevels[id]
      ) {
        state.petXP[id] -= 100 * state.petLevels[id];
        state.petLevels[id] += 1;
        if (
          petAbilities[state.petLevels[id]] &&
          !state.petAbilitiesUnlocked[id].includes(state.petLevels[id])
        ) {
          state.petAbilitiesUnlocked[id].push(state.petLevels[id]);
        }
      }
      if (pet && state.petLevels[id] >= pet.maxLevel) state.petXP[id] = 0;
    });

    if (
      state.activePet &&
      !state.unlockedPets.includes(state.activePet)
    ) {
      state.activePet = null;
    }
    if (!state.activePet && state.unlockedPets.length) {
      state.activePet = state.unlockedPets[0];
    }
  }

  function recalcDerivedBonuses() {
    gameState.incomeBoostPet = 0;
    gameState.totalPetBonus = 0;

    normalizePetState();
    const pid = gameState.activePet;
    if (!pid) return;
    const pet = pets.find((p) => p.id === pid);
    if (!pet) return;
    const lv = gameState.petLevels[pid] || 1;

    gameState.totalPetBonus = pet.bonus(lv);

    if (pid === "cat" || pid === "fox" || pid === "dragon") {
      gameState.incomeBoostPet += gameState.totalPetBonus * 100;
    }

    if (hasPetAbility(10, pid)) gameState.incomeBoostPet += 1;
    if (hasPetAbility(75, pid)) {
      gameState.incomeBoostPet +=
        Object.keys(gameState.purchasedUpgrades || {}).length * 0.5;
    }
    if (hasPetAbility(100, pid)) gameState.incomeBoostPet += 10;
  }

  function applyProgressBonus(source) {
    if (typeof source?.bonus === "function") {
      source.bonus(gameState);
    } else if (typeof source?.apply === "function") {
      source.apply(gameState);
    }
  }

  function rebuildProgressionBonuses() {
    Object.assign(gameState, BASE_PROGRESS_STATS);

    achievements.forEach((achievement) => {
      if (gameState.achievements[achievement.id]) {
        gameState.incomeBoostBase += achievement.bonus * 100;
      }
    });

    upgrades.forEach((upgrade) => {
      if (gameState.purchasedUpgrades[upgrade.id]) applyProgressBonus(upgrade);
    });

    researchTree.forEach((research) => {
      if (gameState.purchasedResearch[research.id]) applyProgressBonus(research);
    });

    (gameState.prestigePerks || []).forEach((id) => {
      const perk = prestigePerks.find((p) => p.id === id);
      if (perk) applyProgressBonus(perk);
    });

    recalcDerivedBonuses();
  }

  function getPassiveIncomePerSecond(opts = {}) {
    const includeEventBoost = opts.includeEventBoost !== false;
    const incBoost = getIncomeBoostPercent();

    let total = 0;
    for (let i = 0; i < buildings.length; i++) {
      total +=
        buildings[i].rate * gameState.buildingCounts[i] * (1 + incBoost / 100);
    }

    const eventMul = includeEventBoost ? gameState.eventMultiplier : 1;
    return total * getPrestigeMultiplier() * eventMul;
  }

  function getEffectiveClickBase() {
    return 1 * gameState.clickPowerMult;
  }

  function calculateCrit() {
    let petCritBonus = 0;
    if (gameState.activePet === "eagle" || gameState.activePet === "dragon") {
      petCritBonus =
        gameState.totalPetBonus * (gameState.activePet === "dragon" ? 50 : 100);
    }
    return Math.random() * 100 < gameState.critChance + petCritBonus;
  }

  function getCritMultiplier() {
    return rand(2, 5);
  }

  function getBuildingUnitCost(index, ownedCount) {
    const b = buildings[index];
    if (!b) return Number.POSITIVE_INFINITY;
    const tierPressure = 1 + (Number(b.tier || 1) - 1) * 0.02;
    const prestigePressure = 1 + Math.min(0.35, gameState.prestigeLevel * 0.002);
    const growth = BUILDING_COST_GROWTH * tierPressure * prestigePressure;
    const raw = b.baseCost * Math.pow(growth, ownedCount);
    const discount = 1 - clamp(gameState.costReduction, 0, 95) / 100;
    return raw * discount;
  }

  function getBulkCost(index, amount) {
    const current = gameState.buildingCounts[index] || 0;
    if (amount === "max") {
      let bought = 0;
      let cost = 0;
      while (bought < 5000) {
        const c = getBuildingUnitCost(index, current + bought);
        if (!Number.isFinite(c) || cost + c > gameState.coins) break;
        cost += c;
        bought++;
      }
      return { cost, amount: bought };
    }

    const a = Math.max(1, Number(amount) || 1);
    let total = 0;
    for (let i = 0; i < a; i++) {
      total += getBuildingUnitCost(index, current + i);
    }
    return { cost: total, amount: a };
  }

  /* =========================================================
     Events / random scheduler
  ========================================================= */

  function scheduleNextEvent(now = perfNow()) {
    gameState.nextEventAt = now + rand(30000, 120000);
  }

  function triggerRandomEvent(now = perfNow()) {
    const ev = events[Math.floor(Math.random() * events.length)];

    if (ev.trigger === "instant") {
      gameState.activeEvent = null;
      gameState.eventEndTime = 0;
      if (typeof ev.apply === "function") {
        const message = ev.apply(gameState);
        showEventNotification(`${ev.name} ${message || ""}`.trim());
      } else {
        const reward = ev.reward(gameState.coins);
        gameState.coins += reward;
        if (reward > 0) gameState.totalEarnings += reward;
        showEventNotification(`${ev.name} +${formatNumber(reward)}`);
      }
    } else {
      gameState.activeEvent = ev.name;
      gameState.eventMultiplier = ev.multiplier;
      gameState.eventEndTime = now + ev.duration * 1000;
      showEventNotification(`${ev.name} x${ev.multiplier} for ${ev.duration}s`);
    }

    playSound("event");
    runtime.uiDirty = true;
    scheduleNextEvent(now);
  }

  /* =========================================================
     Quests
  ========================================================= */

  function makeQuest(id, label, type, target, rewardCoins, rewardResearch) {
    return {
      id,
      label,
      type,
      target,
      progress: 0,
      done: false,
      claimed: false,
      rewardCoins,
      rewardResearch,
    };
  }

  function generateQuests(force = false) {
    const now = nowMs();
    const today = dayStamp(now);
    const lastDay = dayStamp(gameState.quests.lastGeneratedAt || 0);

    if (!force && today === lastDay && gameState.quests.daily.length) return;

    const totalBuildings = gameState.buildingCounts.reduce((a, b) => a + b, 0);
    const weeklyReset =
      !gameState.quests.weekly.length || (today % 7 === 0 && today !== lastDay);

    // Preserve previous day completion count for streak logic
    const previousDailyCompleted = Array.isArray(gameState.quests.daily)
      ? gameState.quests.daily.filter((q) => q?.claimed).length
      : 0;

    gameState.quests.daily = [
      makeQuest("d_click_200", "Click 200 times", "clicks", 200, 2500, 2),
      makeQuest(
        "d_earn_50k",
        "Earn 50K coins",
        "earningsDelta",
        50000,
        5000,
        3,
      ),
      makeQuest("d_buy_20", "Buy 20 buildings", "buildingsDelta", 20, 8000, 4),
    ];

    if (weeklyReset) {
      gameState.quests.weekly = [
        makeQuest(
          "w_click_5000",
          "Click 5,000 times",
          "clicksDelta",
          5000,
          500000,
          25,
        ),
        makeQuest(
          "w_earn_5m",
          "Earn 5M coins",
          "earningsDelta",
          5000000,
          1000000,
          30,
        ),
        makeQuest(
          "w_prestige_3",
          "Prestige 3 times",
          "prestigeDelta",
          3,
          2000000,
          50,
        ),
      ];
      gameState.quests.weeklyBaseline = {
        clicks: gameState.totalClicks,
        earnings: gameState.totalEarnings,
        buildings: totalBuildings,
        prestige: gameState.totalPrestiges,
      };
    } else if (!isObj(gameState.quests.weeklyBaseline)) {
      gameState.quests.weeklyBaseline = {
        clicks: gameState.totalClicks,
        earnings: gameState.totalEarnings,
        buildings: totalBuildings,
        prestige: gameState.totalPrestiges,
      };
    }

    // Daily streak progression is based on finishing all daily quests yesterday
    if (!force && today !== lastDay) {
      if (lastDay > 0 && previousDailyCompleted >= 3) {
        gameState.quests.streakCompletedDays =
          (Number(gameState.quests.streakCompletedDays) || 0) + 1;
      } else {
        gameState.quests.streakCompletedDays =
          previousDailyCompleted >= 3 ? 1 : 0;
      }
      gameState.quests.dailyCompletionsToday = 0;
      gameState.quests.dailyCompletionsStamp = today;
    } else if (!Number.isFinite(gameState.quests.dailyCompletionsStamp)) {
      gameState.quests.dailyCompletionsStamp = today;
    }

    gameState.quests.lastGeneratedAt = now;
    gameState.quests.dailyBaseline = {
      clicks: gameState.totalClicks,
      earnings: gameState.totalEarnings,
      buildings: totalBuildings,
      prestige: gameState.totalPrestiges,
    };
  }

  function updateQuestProgress() {
    const dBase = gameState.quests.dailyBaseline || {
      clicks: 0,
      earnings: 0,
      buildings: 0,
      prestige: 0,
    };
    const wBase = gameState.quests.weeklyBaseline || {
      clicks: 0,
      earnings: 0,
      buildings: 0,
      prestige: 0,
    };

    const totalBuildings = gameState.buildingCounts.reduce((a, b) => a + b, 0);

    const updateOne = (qobj, base) => {
      if (!qobj || qobj.claimed) return;
      switch (qobj.type) {
        case "clicks":
          qobj.progress = gameState.totalClicks;
          break;
        case "clicksDelta":
          qobj.progress = gameState.totalClicks - base.clicks;
          break;
        case "earningsDelta":
          qobj.progress = gameState.totalEarnings - base.earnings;
          break;
        case "buildingsDelta":
          qobj.progress = totalBuildings - base.buildings;
          break;
        case "prestigeDelta":
          qobj.progress = gameState.totalPrestiges - base.prestige;
          break;
        default:
          qobj.progress = 0;
      }
      qobj.progress = Math.max(0, qobj.progress);
      if (qobj.progress >= qobj.target) qobj.done = true;
    };

    gameState.quests.daily.forEach((qq) => updateOne(qq, dBase));
    gameState.quests.weekly.forEach((qq) => updateOne(qq, wBase));
  }

  function claimQuest(qid, bucket) {
    const isWeekly = bucket === "weekly";
    const list = isWeekly ? gameState.quests.weekly : gameState.quests.daily;
    const quest = list.find((x) => x.id === qid);
    if (!quest || !quest.done || quest.claimed) return;

    quest.claimed = true;
    gameState.coins += quest.rewardCoins;
    gameState.totalEarnings += quest.rewardCoins;
    gameState.researchPoints += quest.rewardResearch;

    if (!isWeekly) {
      const today = dayStamp(nowMs());
      if (gameState.quests.dailyCompletionsStamp !== today) {
        gameState.quests.dailyCompletionsToday = 0;
        gameState.quests.dailyCompletionsStamp = today;
      }
      gameState.quests.dailyCompletionsToday =
        (Number(gameState.quests.dailyCompletionsToday) || 0) + 1;
    }

    showEventNotification(`✅ Quest completed: ${quest.label}`);
    playSound("achievement");
    runtime.uiDirty = true;
  }

  /* =========================================================
     Upgrades
  ========================================================= */

  function hasUpgrade(id) {
    return !!gameState.purchasedUpgrades[id];
  }

  function missingUpgradeRequirements(u) {
    return (u?.requires || []).filter((id) => !hasUpgrade(id));
  }

  function canBuyUpgrade(u) {
    if (!u || hasUpgrade(u.id)) return false;
    if (gameState.coins < u.cost) return false;
    if (missingUpgradeRequirements(u).length) return false;
    return true;
  }

  function getUpgradeBlockedMessage(u) {
    if (!u) return "Upgrade unavailable";
    if (hasUpgrade(u.id)) return "Already purchased";
    const missing = missingUpgradeRequirements(u);
    if (missing.length) {
      return `Requires: ${missing
        .map((id) => upgrades.find((x) => x.id === id)?.name || id)
        .join(", ")}`;
    }
    if (gameState.coins < u.cost) {
      return `Need ${formatNumber(u.cost - gameState.coins)} more coins`;
    }
    return "";
  }

  function buyUpgrade(id) {
    const u = upgrades.find((x) => x.id === id);
    if (!canBuyUpgrade(u)) {
      const message = getUpgradeBlockedMessage(u);
      if (message) showEventNotification(message);
      playSound("error");
      return;
    }

    gameState.coins -= u.cost;
    gameState.purchasedUpgrades[u.id] = true;
    try {
      rebuildProgressionBonuses();
      playSound("purchase");
      showEventNotification(`🧰 Purchased: ${u.name}`);
      runtime.uiDirty = true;
    } catch (_) {
      // rollback if any unexpected issue
      gameState.coins += u.cost;
      delete gameState.purchasedUpgrades[u.id];
      rebuildProgressionBonuses();
      playSound("error");
      showEventNotification("Upgrade failed safely; no coins lost.");
    }
  }

  /* =========================================================
     Achievements
  ========================================================= */

  function checkAchievements() {
    achievements.forEach((a) => {
      if (gameState.achievements[a.id]) return;

      let ok = false;
      if (a.type === "earnings" && gameState.totalEarnings >= a.target)
        ok = true;
      if (a.type === "clicks" && gameState.totalClicks >= a.target) ok = true;
      if (a.type === "crits" && gameState.critHits >= a.target) ok = true;
      if (
        a.type === "buildings" &&
        gameState.buildingCounts.some((c) => c >= a.target)
      )
        ok = true;
      if (a.type === "prestige" && gameState.prestigeLevel >= a.target)
        ok = true;

      if (!ok) return;
      gameState.achievements[a.id] = true;
      rebuildProgressionBonuses();
      showAchievementNotif(a);
      playSound("achievement");

      // Controlled mini-game trigger with cooldown to avoid spam
      const now = nowMs();
      if (
        (a.type === "earnings" || a.type === "prestige") &&
        now - runtime.lastMiniGameAt >= runtime.miniGameCooldownMs
      ) {
        runtime.lastMiniGameAt = now;
        setTimeout(() => triggerMiniGame(), 500);
      }
    });
  }

  /* =========================================================
     Pets
  ========================================================= */

  function updatePrestigeTier() {
    if (gameState.prestigeLevel >= 100) gameState.prestigeTier = 5;
    else if (gameState.prestigeLevel >= 50) gameState.prestigeTier = 4;
    else if (gameState.prestigeLevel >= 30) gameState.prestigeTier = 3;
    else if (gameState.prestigeLevel >= 15) gameState.prestigeTier = 2;
    else if (gameState.prestigeLevel >= 5) gameState.prestigeTier = 1;
    else gameState.prestigeTier = 0;
  }

  function unlockNewPets() {
    pets.forEach((pet) => {
      if (
        gameState.prestigeLevel >= pet.unlocksAt &&
        !gameState.unlockedPets.includes(pet.id)
      ) {
        gameState.unlockedPets.push(pet.id);
        if (!gameState.petLevels[pet.id]) gameState.petLevels[pet.id] = 1;
        if (!gameState.petXP[pet.id]) gameState.petXP[pet.id] = 0;
        showAchievementNotif({
          icon: pet.icon,
          name: pet.name,
          desc: "Pet Unlocked!",
        });
      }
    });
    if (!gameState.activePet && gameState.unlockedPets.length) {
      gameState.activePet = gameState.unlockedPets[0];
    }
  }

  function gainPetXP(petId, amount) {
    if (!petId || !gameState.petLevels[petId]) return;
    gameState.petXP[petId] = (gameState.petXP[petId] || 0) + amount;
    levelUpPet(petId);
  }

  function levelUpPet(petId) {
    const pet = pets.find((p) => p.id === petId);
    if (!pet) return;

    let levelsGained = 0;
    while ((gameState.petLevels[petId] || 1) < pet.maxLevel) {
      const lv = gameState.petLevels[petId] || 1;
      const need = 100 * lv;
      if ((gameState.petXP[petId] || 0) < need) break;

      gameState.petXP[petId] -= need;
      gameState.petLevels[petId] = lv + 1;
      levelsGained++;

      const nextLv = gameState.petLevels[petId];
      if (petAbilities[nextLv]) {
        gameState.petAbilitiesUnlocked[petId] =
          gameState.petAbilitiesUnlocked[petId] || [];
        if (!gameState.petAbilitiesUnlocked[petId].includes(nextLv)) {
          gameState.petAbilitiesUnlocked[petId].push(nextLv);
          showAchievementNotif({
            icon: "⭐",
            name: `${pet.name} - ${petAbilities[nextLv].name}`,
            desc: petAbilities[nextLv].desc,
          });
          if (nextLv === 50) {
            gameState.eventMultiplier = Math.max(gameState.eventMultiplier, 2);
            gameState.eventEndTime = perfNow() + 30000;
            gameState.activeEvent = `${pet.icon} ${pet.name} Super Mode`;
          }
        }
      }
    }

    if ((gameState.petLevels[petId] || 1) >= pet.maxLevel) {
      gameState.petXP[petId] = 0;
    }

    if (levelsGained > 0) {
      showEventNotification(
        `${pet.icon} ${pet.name} leveled up to ${gameState.petLevels[petId]}`,
      );
    }
    recalcDerivedBonuses();
    runtime.uiDirty = true;
  }

  function levelUpPetManual(method = "coins") {
    const petId = gameState.activePet;
    if (!petId || !gameState.petLevels[petId]) {
      showEventNotification("Unlock a pet by prestiging first");
      return;
    }
    const lv = gameState.petLevels[petId] || 1;

    if (method === "coins") {
      const cost = 10000 * lv;
      if (gameState.coins < cost) {
        showEventNotification(`Pet level needs ${formatNumber(cost)} coins`);
        playSound("error");
        return;
      }
      gameState.coins -= cost;
      gainPetXP(petId, 50);
      createConfetti(10);
    } else {
      const cost = 5 * lv;
      if (gameState.researchPoints < cost) {
        showEventNotification(`Pet level needs ${cost} research`);
        playSound("error");
        return;
      }
      gameState.researchPoints -= cost;
      gainPetXP(petId, 50);
      createConfetti(10);
    }
    runtime.uiDirty = true;
  }

  function selectPet(petId) {
    if (!gameState.unlockedPets.includes(petId)) return;
    gameState.activePet = petId;
    recalcDerivedBonuses();
    playSound("purchase");
    runtime.uiDirty = true;
  }

  /* =========================================================
     Gameplay actions
  ========================================================= */

  function updateCombo() {
    gameState.combo++;
    gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
    gameState.comboLastClick = perfNow();

    const comboDisplay = q(".combo-display");
    const comboMeter = q(".combo-meter");
    const comboProgress = q(".combo-progress");
    if (comboDisplay) comboDisplay.classList.remove("hidden");
    if (comboMeter) comboMeter.classList.remove("hidden");

    const maxCombo = 25;
    const pct = Math.min((gameState.combo / maxCombo) * 100, 100);
    if (comboProgress) comboProgress.style.width = `${pct}%`;

    safeText(q(".combo-count"), String(gameState.combo));
    safeText(
      q(".combo-multiplier"),
      `x${(1 + gameState.combo * 0.04 * gameState.comboBoost).toFixed(1)}`,
    );

    if (gameState.combo > 0 && gameState.combo % 50 === 0) {
      const reward = Math.max(
        250,
        getPassiveIncomePerSecond({ includeEventBoost: false }) * 8 +
          gameState.combo * 20,
      );
      const researchReward = gameState.combo % 100 === 0 ? 1 : 0;
      gameState.coins += reward;
      gameState.totalEarnings += reward;
      gameState.researchPoints += researchReward;
      createConfetti(researchReward ? 22 : 12);
      showEventNotification(
        `🔥 ${gameState.combo} combo bonus: +${formatNumber(reward)}${
          researchReward ? " +1 research" : ""
        }`,
      );
    }
  }

  function resetCombo() {
    if (gameState.combo <= 0) return;
    gameState.combo = 0;
    setHidden(q(".combo-display"), true);
    setHidden(q(".combo-meter"), true);
  }

  function earnCoins(amount, isCrit = false) {
    let finalAmount = Number(amount) || 0;
    if (gameState.activePet === "dog" || gameState.activePet === "dragon")
      finalAmount *= 1 + gameState.totalPetBonus;

    gameState.coins += finalAmount;
    gameState.totalEarnings += finalAmount;
    gameState.totalClicks += 1;
    if (isCrit) gameState.critHits += 1;

    if (gameState.activePet) gainPetXP(gameState.activePet, 1);

    updateCombo();
    updateQuestProgress();
    checkAchievements();

    createFloatingCoin(finalAmount, isCrit);
    playSound(isCrit ? "crit" : "click");
    runtime.uiDirty = true;
  }

  function purchaseBuilding(buildingId, mode = gameState.buyMode) {
    const idx = Number(buildingId);
    if (!Number.isInteger(idx) || idx < 0 || idx >= buildings.length) return;

    const buyAmount = mode === "max" ? "max" : parseInt(mode, 10) || 1;
    const quote = getBulkCost(idx, buyAmount);

    if (quote.amount <= 0) {
      playSound("error");
      return;
    }

    if (gameState.coins >= quote.cost) {
      gameState.coins -= quote.cost;
      gameState.buildingCounts[idx] += quote.amount;

      playSound("purchase");
      if (quote.amount >= 10) createConfetti(12);

      updateQuestProgress();
      checkAchievements();
      runtime.uiDirty = true;
    } else {
      playSound("error");
      if (gameState.settings.shakeEnabled) {
        const b = q(".main-button");
        if (b) {
          b.classList.add("shake");
          setTimeout(() => b.classList.remove("shake"), 220);
        }
      }
    }
  }

  function prestige() {
    const req = getPrestigeRequirement();
    if (gameState.coins < req) {
      showEventNotification(
        `Prestige needs ${formatNumber(req - gameState.coins)} more coins`,
      );
      playSound("error");
      return;
    }

    const gain = getPrestigeGain(req);
    gameState.prestigeLevel += gain;
    gameState.totalPrestiges += 1;

    gameState.researchPoints += Math.floor(gain * 2 * gameState.researchBoost);
    gameState.coins = 0;
    gameState.buildingCounts = new Array(MAX_BUILDINGS).fill(0);

    gameState.combo = 0;
    gameState.activeEvent = null;
    gameState.eventMultiplier = 1;
    gameState.eventEndTime = 0;

    const oldTier = gameState.prestigeTier;
    updatePrestigeTier();
    unlockNewPets();
    rebuildProgressionBonuses();

    if (
      gameState.prestigeTier > oldTier &&
      (gameState.prestigePerks || []).length < 3
    ) {
      openPrestigePerkPicker();
    }

    updateQuestProgress();
    checkAchievements();

    createConfetti(30);
    playSound("prestige");
    runtime.uiDirty = true;
  }

  function openPrestigePerkPicker() {
    const modal = q(".modal");
    const body = q("#modal-body");
    const title = q("#modal-title");
    if (!modal || !body || !title) return;

    const available = prestigePerks.filter(
      (p) => p.unlockAt <= gameState.prestigeTier,
    );
    if (!available.length) return;

    title.textContent = "Choose up to 3 Prestige Perks";
    body.innerHTML = `<div style="display:grid;gap:10px;margin:10px 0;" class="perk-grid"></div>`;
    const holder = q(".perk-grid", body);

    const selected = new Set(gameState.prestigePerks || []);

    available.forEach((perk) => {
      const btn = document.createElement("button");
      btn.className = "modal-button";
      btn.style.textAlign = "left";
      btn.innerHTML = `${perk.icon} ${perk.name}<br><span style="font-size:12px;opacity:.75">${perk.desc}</span>`;

      const paint = () => {
        btn.style.background = selected.has(perk.id)
          ? "var(--accent)"
          : "var(--primary)";
      };
      paint();

      btn.onclick = () => {
        if (selected.has(perk.id)) selected.delete(perk.id);
        else if (selected.size < 3) selected.add(perk.id);
        paint();
      };

      holder?.appendChild(btn);
    });

    const confirm = document.createElement("button");
    confirm.className = "modal-button";
    confirm.textContent = "Confirm";
    confirm.onclick = () => {
      gameState.prestigePerks = Array.from(selected);
      rebuildProgressionBonuses();
      closePanel(".modal");
      playSound("purchase");
      runtime.uiDirty = true;
    };

    body.appendChild(confirm);
    openPanel(".modal");
  }

  function purchaseVoidMachine() {
    if (gameState.voidMachineOwned) return;
    if (gameState.prestigeTier < 4) return;
    if (gameState.coins < 1e15) return;

    gameState.coins -= 1e15;
    gameState.voidMachineOwned = true;
    createConfetti(45);
    showAchievementNotif({
      icon: "⚫",
      name: "Void Machine",
      desc: "Purchased! +100% income",
    });
    playSound("prestige");
    runtime.uiDirty = true;
  }

  function purchaseResearch(id) {
    const r = researchTree.find((x) => x.id === id);
    if (!r) return;
    if (gameState.purchasedResearch[id]) {
      showEventNotification("Research already purchased");
      return;
    }

    const missing = (r.requires || []).filter(
      (rid) => !gameState.purchasedResearch[rid],
    );
    if (missing.length) {
      showEventNotification(
        `Requires: ${missing
          .map((rid) => researchTree.find((x) => x.id === rid)?.name || rid)
          .join(", ")}`,
      );
      playSound("error");
      return;
    }

    if (gameState.researchPoints < r.cost) {
      showEventNotification(
        `Need ${Math.ceil(r.cost - gameState.researchPoints)} more research`,
      );
      playSound("error");
      return;
    }

    gameState.researchPoints -= r.cost;
    gameState.purchasedResearch[id] = true;
    rebuildProgressionBonuses();
    playSound("purchase");
    showEventNotification(`🔬 Researched: ${r.name}`);
    runtime.uiDirty = true;
  }

  /* =========================================================
     Rendering
  ========================================================= */

  function setTheme(theme) {
    gameState.theme = theme || "dark";
    document.documentElement.setAttribute("data-theme", gameState.theme);
    qa(".theme-btn").forEach((b) =>
      b.classList.toggle("active", b.dataset.theme === gameState.theme),
    );
  }

  function applyReducedMotionFlag() {
    document.documentElement.classList.toggle(
      "reduced-motion",
      !!gameState.settings.reducedMotion,
    );
  }

  function isPanelOpen(selector) {
    const el = q(selector);
    return !!el && !el.classList.contains("hidden");
  }

  function syncLayoutMetrics() {
    const dashboard = q(".dashboard");
    if (!dashboard || dashboard.classList.contains("hidden")) return;
    document.documentElement.style.setProperty(
      "--dashboard-height",
      `${Math.ceil(dashboard.getBoundingClientRect().height)}px`,
    );
  }

  function updateHeaderCore() {
    const coinEl = q(".coin-count");
    if (coinEl) {
      coinEl.textContent = formatNumber(gameState.coins);
      coinEl.classList.remove("pop");
      if (!gameState.settings.reducedMotion) {
        void coinEl.offsetWidth;
        coinEl.classList.add("pop");
      }
    }

    safeText(q(".income-rate"), formatNumber(getPassiveIncomePerSecond()));
    safeText(
      q('[data-stat="clicks"]', document),
      String(gameState.totalClicks),
    );
    safeText(q('[data-stat="crits"]', document), String(gameState.critHits));
    safeText(
      q('[data-stat="achievements"]', document),
      String(Object.keys(gameState.achievements).length),
    );
    safeText(
      q('[data-stat="research"]', document),
      String(Math.floor(gameState.researchPoints)),
    );
    updateSocialBadge();
  }

  function renderBuildings(force = false) {
    const grid = q(".building-grid");
    if (!grid) return;

    if (force || grid.children.length !== buildings.length) {
      grid.innerHTML = "";
      buildings.forEach((b) => {
        const card = document.createElement("div");
        card.className = "building-card";
        card.dataset.id = String(b.id);
        card.innerHTML = `
          <span class="building-icon">${b.icon}</span>
          <div class="building-name">${b.name}</div>
          <div class="building-rate">+${formatNumber(b.rate)}/s</div>
          <div class="building-cost">Cost</div>
          <div class="building-count">Owned: 0</div>
        `;
        card.addEventListener("click", () => purchaseBuilding(b.id));
        grid.appendChild(card);
      });
    }

    qa(".building-card", grid).forEach((card) => {
      const i = Number(card.dataset.id);
      const mode = gameState.buyMode;
      const quote = getBulkCost(i, mode === "max" ? "max" : parseInt(mode, 10));
      const can = gameState.coins >= quote.cost && quote.amount > 0;

      card.classList.toggle("affordable", can);
      card.classList.toggle("unaffordable", !can);

      const cEl = q(".building-cost", card);
      const nEl = q(".building-count", card);

      if (cEl) {
        cEl.textContent =
          mode === "max"
            ? `Cost(MAX ${quote.amount}): ${formatNumber(quote.cost)}`
            : `Cost(x${quote.amount}): ${formatNumber(quote.cost)}`;
        cEl.className = `building-cost ${can ? "affordable" : "unaffordable"}`;
      }
      if (nEl) nEl.textContent = `Owned: ${gameState.buildingCounts[i] || 0}`;
    });
  }

  function renderResearchTree() {
    const grid = q(".research-grid");
    if (!grid) return;
    grid.innerHTML = "";

    researchTree.forEach((r) => {
      const purchased = !!gameState.purchasedResearch[r.id];
      const canAfford = gameState.researchPoints >= r.cost;
      const missing = (r.requires || []).filter(
        (rid) => !gameState.purchasedResearch[rid],
      );
      const locked = !purchased && (!canAfford || missing.length > 0);
      const node = document.createElement("div");
      node.className = `research-node ${purchased ? "purchased" : ""} ${locked ? "locked" : ""}`;
      const requiresText = missing.length
        ? `Requires: ${missing
            .map((rid) => researchTree.find((x) => x.id === rid)?.name || rid)
            .join(", ")}`
        : "";
      node.innerHTML = `
        <div class="research-node-icon">${r.icon}</div>
        <div class="research-node-name">${r.name}</div>
        <div class="research-node-desc">${r.desc}</div>
        <div class="research-node-cost">${purchased ? "✓ Purchased" : `${r.cost} points`}</div>
        ${requiresText ? `<div class="research-node-requires">${requiresText}</div>` : ""}
      `;
      if (!purchased)
        node.addEventListener("click", () => purchaseResearch(r.id));
      grid.appendChild(node);
    });
  }

  function renderAchievements() {
    const grid = q(".achievements-grid");
    if (!grid) return;
    grid.innerHTML = "";

    achievements.forEach((a) => {
      const unlocked = !!gameState.achievements[a.id];

      let progress = 0;
      if (a.type === "earnings") progress = gameState.totalEarnings / a.target;
      if (a.type === "clicks") progress = gameState.totalClicks / a.target;
      if (a.type === "crits") progress = gameState.critHits / a.target;
      if (a.type === "prestige") progress = gameState.prestigeLevel / a.target;
      if (a.type === "buildings")
        progress = Math.max(...gameState.buildingCounts) / a.target;

      const badge = document.createElement("div");
      badge.className = `achievement-badge ${unlocked ? "unlocked" : ""}`;
      badge.innerHTML = `
        <div class="achievement-icon">${a.icon}</div>
        <div class="achievement-name">${a.name}</div>
        <div class="achievement-progress ${unlocked ? "unlocked" : ""}">
          ${unlocked ? "✓ Unlocked" : `${Math.floor(clamp(progress * 100, 0, 100))}%`}
        </div>
      `;
      grid.appendChild(badge);
    });
  }

  function renderUpgrades() {
    const grid = q(".upgrades-grid");
    if (!grid) return;

    const filter = gameState.upgradeFilter || "all";
    grid.innerHTML = "";

    upgrades
      .filter((u) => (filter === "all" ? true : u.type === filter))
      .forEach((u) => {
        const bought = hasUpgrade(u.id);
        const can = canBuyUpgrade(u);
        const blockedMessage = !bought && !can ? getUpgradeBlockedMessage(u) : "";
        const card = document.createElement("div");
        card.className = `building-card ${bought ? "affordable" : can ? "affordable" : "unaffordable"}`;
        card.innerHTML = `
          <span class="building-icon">${u.icon}</span>
          <div class="building-name">${u.name}</div>
          <div class="building-rate">${u.desc}</div>
          <div class="building-cost ${can ? "affordable" : "unaffordable"}">${bought ? "✓ Purchased" : `Cost: ${formatNumber(u.cost)}`}</div>
          <div class="building-count">${blockedMessage || `Type: ${u.type}`}</div>
        `;
        if (!bought) card.addEventListener("click", () => buyUpgrade(u.id));
        grid.appendChild(card);
      });

    qa(".upgrade-filter-btn").forEach((b) =>
      b.classList.toggle("active", b.dataset.filter === filter),
    );
  }

  function renderQuests() {
    const grid = q(".quests-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const addQuestCards = (list, bucketLabel) => {
      list.forEach((quest) => {
        const pct = Math.floor(
          clamp((quest.progress / quest.target) * 100, 0, 100),
        );
        const card = document.createElement("div");
        card.className = `building-card ${quest.done ? "affordable" : "unaffordable"}`;
        card.innerHTML = `
          <span class="building-icon">${bucketLabel === "daily" ? "☀️" : "🌙"}</span>
          <div class="building-name">${quest.label}</div>
          <div class="building-rate">Progress: ${Math.floor(quest.progress)} / ${quest.target} (${pct}%)</div>
          <div class="building-cost ${quest.done ? "affordable" : "unaffordable"}">Reward: ${formatNumber(quest.rewardCoins)} + ${quest.rewardResearch} RP</div>
          <div class="building-count">${quest.claimed ? "✓ Claimed" : quest.done ? "Claim available" : "In progress"}</div>
        `;
        if (quest.done && !quest.claimed) {
          card.addEventListener("click", () =>
            claimQuest(quest.id, bucketLabel),
          );
        }
        grid.appendChild(card);
      });
    };

    addQuestCards(gameState.quests.daily, "daily");
    addQuestCards(gameState.quests.weekly, "weekly");

    const dailyClaimedCount = gameState.quests.daily.filter(
      (x) => x.claimed,
    ).length;
    const dailyStreakMetric =
      (Number(gameState.quests.streakCompletedDays) || 0) +
      (dailyClaimedCount >= 3 ? 1 : 0);

    safeText(q('[data-quest="daily"]'), String(dailyClaimedCount));
    safeText(
      q('[data-quest="weekly"]'),
      String(gameState.quests.weekly.filter((x) => x.claimed).length),
    );
    safeText(q('[data-quest="streak"]'), String(dailyStreakMetric));
  }

  function renderStatsPanel() {
    const playtime = nowMs() - gameState.startTime;
    safeText(q('[data-lifetime="playtime"]'), formatDuration(playtime));
    safeText(
      q('[data-lifetime="earned"]'),
      formatNumber(gameState.totalEarnings),
    );
    safeText(
      q('[data-lifetime="income"]'),
      `${formatNumber(getPassiveIncomePerSecond())}/s`,
    );
    safeText(q('[data-lifetime="combo"]'), String(gameState.maxCombo));
    safeText(q('[data-lifetime="prestige"]'), String(gameState.totalPrestiges));
    safeText(
      q('[data-lifetime="pets"]'),
      String(gameState.unlockedPets.length),
    );
  }

  function renderSaveSlotsMeta() {
    for (let i = 1; i <= 3; i++) {
      const raw = localStorage.getItem(getPlayerSlotKey(i));
      const metaEl = q(`[data-slot-meta="${i}"]`);
      if (!metaEl) continue;
      if (!raw) {
        metaEl.textContent = "Empty";
        continue;
      }
      try {
        const d = JSON.parse(raw);
        const t = new Date(d?.meta?.savedAt || Date.now()).toLocaleString();
        metaEl.textContent = `Saved ${t} • Coins ${formatNumber(d?.state?.coins || 0)} • Prestige ${d?.state?.prestigeLevel || 0}`;
      } catch {
        metaEl.textContent = "Corrupt";
      }
    }
  }

  function renderPetIndicatorAndPanel() {
    let indicator = q(".pet-indicator");
    if (!indicator && gameState.unlockedPets.length) {
      indicator = document.createElement("div");
      indicator.className = "pet-indicator";
      indicator.addEventListener("click", () => {
        openPanel(".pet-panel");
        renderPetPanel();
      });
      document.body.appendChild(indicator);
    }
    if (indicator) {
      if (!gameState.activePet) {
        indicator.style.display = "none";
      } else {
        const pet = pets.find((p) => p.id === gameState.activePet);
        indicator.style.display = "flex";
        indicator.innerHTML = `
          <span class="pet-indicator-icon">${pet ? pet.icon : "🐾"}</span>
          <div class="pet-indicator-info">
            <div class="pet-indicator-name">${pet ? pet.name : "Pet"}</div>
            <div class="pet-indicator-level">Lv. ${gameState.petLevels[gameState.activePet] || 1}</div>
          </div>
        `;
      }
    }

    renderPetPanel();
  }

  function renderPetPanel() {
    const display = q("#active-pet-display");
    const selector = q(".pet-selector");
    if (!display || !selector) return;

    normalizePetState();
    if (gameState.activePet) {
      const pet = pets.find((p) => p.id === gameState.activePet);
      const lv = gameState.petLevels[gameState.activePet] || 1;
      const xp = gameState.petXP[gameState.activePet] || 0;
      const need = 100 * lv;
      const pct = Math.floor(clamp((xp / need) * 100, 0, 100));
      const abilityNames = getPetAbilityLevels(gameState.activePet)
        .map((level) => petAbilities[level]?.name)
        .filter(Boolean)
        .join(", ");

      display.innerHTML = `
        <span class="pet-icon-large">${pet ? pet.icon : "🐾"}</span>
        <div class="pet-info">
          <div class="pet-name">${pet ? pet.name : "Pet"} <span style="font-size:12px;opacity:.7">- ${pet ? pet.ability : ""}</span></div>
          <div class="pet-level">Level ${lv}</div>
          <div class="pet-xp-bar"><div class="pet-xp-progress" style="width:${pct}%"></div></div>
          <div style="font-size:10px;opacity:.75;margin-top:4px">${xp}/${need} XP</div>
          <div class="pet-abilities">${abilityNames || "No special abilities yet"}</div>
        </div>
      `;
    } else {
      display.innerHTML = `
        <span class="pet-icon-large">🐾</span>
        <div class="pet-info">
          <div class="pet-name">No active pet</div>
          <div class="pet-level">Prestige to unlock your first companion.</div>
          <div class="pet-xp-bar"><div class="pet-xp-progress" style="width:0%"></div></div>
        </div>
      `;
    }

    selector.innerHTML = "";
    gameState.unlockedPets.forEach((pid) => {
      const pet = pets.find((p) => p.id === pid);
      const card = document.createElement("div");
      card.className = `pet-selector-card ${gameState.activePet === pid ? "active" : ""}`;
      card.innerHTML = `
        <div class="pet-selector-icon">${pet ? pet.icon : "🐾"}</div>
        <div class="pet-selector-name">${pet ? pet.name : pid}</div>
        <div class="pet-selector-level">Level ${gameState.petLevels[pid] || 1}</div>
      `;
      card.addEventListener("click", () => selectPet(pid));
      selector.appendChild(card);
    });

    pets.forEach((pet) => {
      if (gameState.unlockedPets.includes(pet.id)) return;
      const card = document.createElement("div");
      card.className = "pet-selector-card locked";
      card.innerHTML = `
        <div class="pet-selector-icon">${pet.icon}</div>
        <div class="pet-selector-name">${pet.name}</div>
        <div class="pet-selector-unlock">Prestige ${pet.unlocksAt}+</div>
      `;
      selector.appendChild(card);
    });
  }

  function updateButtonsVisibility() {
    const pBtn = q(".prestige-button");
    if (pBtn) {
      const req = getPrestigeRequirement();
      const gain = getPrestigeGain(req);
      pBtn.classList.toggle("hidden", gameState.coins < req);
      pBtn.textContent = `✨ Prestige +${Math.max(1, gain)} (${formatNumber(req)})`;
    }

    const vBtn = q("[data-void-machine]");
    if (vBtn) {
      const show = gameState.prestigeTier >= 4 && !gameState.voidMachineOwned;
      vBtn.classList.toggle("hidden", !show);
    }
  }

  function renderAll(forceBuildings = false) {
    updateHeaderCore();
    renderBuildings(forceBuildings);

    if (isPanelOpen(".research-tree")) renderResearchTree();
    if (isPanelOpen(".achievements-panel")) renderAchievements();
    if (isPanelOpen(".upgrades-panel")) renderUpgrades();
    if (isPanelOpen(".quests-panel")) renderQuests();
    if (isPanelOpen(".stats-panel")) renderStatsPanel();
    if (isPanelOpen(".save-manager-panel")) renderSaveSlotsMeta();
    if (isPanelOpen(".pet-panel")) renderPetPanel();
    if (isPanelOpen(".players-panel")) renderPlayersList();
    if (isPanelOpen(".admin-panel")) renderAdminPanel();
    if (isPanelOpen(".social-panel")) renderSocialPanel();

    renderPetIndicatorAndPanel();
    updateButtonsVisibility();
    syncLayoutMetrics();
    runtime.uiDirty = false;
  }

  /* =========================================================
     Save / load / migration / backups
  ========================================================= */

  function serializeState() {
    return {
      ...gameState,
      version: VERSION,
      lastSaveAt: nowMs(),
      lastActiveAt: nowMs(),
    };
  }

  function safeJsonParse(raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function migrate(data) {
    const merged = {
      ...createFreshStateDefaults(),
      ...(isObj(data) ? data : {}),
    };

    if (!Array.isArray(merged.buildingCounts))
      merged.buildingCounts = new Array(MAX_BUILDINGS).fill(0);
    if (merged.buildingCounts.length < MAX_BUILDINGS) {
      while (merged.buildingCounts.length < MAX_BUILDINGS)
        merged.buildingCounts.push(0);
    } else if (merged.buildingCounts.length > MAX_BUILDINGS) {
      merged.buildingCounts = merged.buildingCounts.slice(0, MAX_BUILDINGS);
    }

    merged.purchasedResearch = isObj(merged.purchasedResearch)
      ? merged.purchasedResearch
      : {};
    merged.achievements = isObj(merged.achievements) ? merged.achievements : {};
    merged.purchasedUpgrades = isObj(merged.purchasedUpgrades)
      ? merged.purchasedUpgrades
      : {};
    merged.prestigePerks = Array.isArray(merged.prestigePerks)
      ? merged.prestigePerks.filter((id) => prestigePerks.some((p) => p.id === id))
      : [];
    merged.unlockedPets = Array.isArray(merged.unlockedPets)
      ? merged.unlockedPets
      : [];
    merged.petLevels = isObj(merged.petLevels) ? merged.petLevels : {};
    merged.petXP = isObj(merged.petXP) ? merged.petXP : {};
    merged.petAbilitiesUnlocked = isObj(merged.petAbilitiesUnlocked)
      ? merged.petAbilitiesUnlocked
      : {};
    merged.socialLastReadAt = Number(merged.socialLastReadAt) || 0;

    if (!isObj(merged.settings)) merged.settings = { ...DEFAULT_SETTINGS };
    merged.settings = {
      ...DEFAULT_SETTINGS,
      ...merged.settings,
    };
    merged.settings.autoSaveIntervalSec = clamp(
      merged.settings.autoSaveIntervalSec,
      2,
      60,
    );
    merged.settings.fpsCap = clamp(merged.settings.fpsCap, 30, 120);

    // back-compat with old flat soundEnabled
    if (typeof merged.soundEnabled === "boolean")
      merged.settings.soundEnabled = merged.soundEnabled;

    merged.researchBoost = Number.isFinite(merged.researchBoost)
      ? merged.researchBoost
      : 1;
    merged.incomeBoostBase = Number.isFinite(merged.incomeBoostBase)
      ? merged.incomeBoostBase
      : Number(merged.incomeBoost) || 0;
    merged.incomeBoostPet = Number.isFinite(merged.incomeBoostPet)
      ? merged.incomeBoostPet
      : 0;

    if (!isObj(merged.quests))
      merged.quests = {
        daily: [],
        weekly: [],
        streakCompletedDays: 0,
        lastGeneratedAt: 0,
        dailyBaseline: { clicks: 0, earnings: 0, buildings: 0, prestige: 0 },
        weeklyBaseline: { clicks: 0, earnings: 0, buildings: 0, prestige: 0 },
        dailyCompletionsToday: 0,
        dailyCompletionsStamp: 0,
      };
    if (!Array.isArray(merged.quests.daily)) merged.quests.daily = [];
    if (!Array.isArray(merged.quests.weekly)) merged.quests.weekly = [];
    if (!isObj(merged.quests.dailyBaseline)) {
      merged.quests.dailyBaseline = {
        clicks: Number(merged.totalClicks) || 0,
        earnings: Number(merged.totalEarnings) || 0,
        buildings: Array.isArray(merged.buildingCounts)
          ? merged.buildingCounts.reduce((a, b) => a + (Number(b) || 0), 0)
          : 0,
        prestige: Number(merged.totalPrestiges) || 0,
      };
    }
    if (!isObj(merged.quests.weeklyBaseline)) {
      merged.quests.weeklyBaseline = {
        clicks: Number(merged.totalClicks) || 0,
        earnings: Number(merged.totalEarnings) || 0,
        buildings: Array.isArray(merged.buildingCounts)
          ? merged.buildingCounts.reduce((a, b) => a + (Number(b) || 0), 0)
          : 0,
        prestige: Number(merged.totalPrestiges) || 0,
      };
    }
    merged.quests.streakCompletedDays =
      Number(merged.quests.streakCompletedDays) || 0;
    merged.quests.lastGeneratedAt = Number(merged.quests.lastGeneratedAt) || 0;
    merged.quests.dailyCompletionsToday =
      Number(merged.quests.dailyCompletionsToday) || 0;
    merged.quests.dailyCompletionsStamp =
      Number(merged.quests.dailyCompletionsStamp) || 0;

    merged.version = VERSION;
    normalizePetState(merged);
    return merged;
  }

  function saveGame() {
    try {
      if (!currentUser?.username) return;
      writePlayerSave(currentUser.username, serializeState());
    } catch {
      showEventNotification("⚠️ Save failed (storage full?)");
    }
  }

  function applyOfflineProgress(savedState) {
    const then = Number(
      savedState.lastActiveAt || savedState.lastSaveAt || nowMs(),
    );
    const deltaSec = clamp((nowMs() - then) / 1000, 0, OFFLINE_CAP_SECONDS);
    if (deltaSec <= 1) return;

    const gain =
      getPassiveIncomePerSecond({ includeEventBoost: false }) * deltaSec;
    gameState.coins += gain;
    gameState.totalEarnings += gain;
    showEventNotification(
      `⏱️ Offline gains: +${formatNumber(gain)} (${Math.floor(deltaSec)}s)`,
    );
  }

  function applyDailyReward() {
    const now = nowMs();
    const today = dayStamp(now);
    const last = dayStamp(gameState.lastLoginDate || 0);
    if (today === last) return;

    if (today === last + 1) gameState.loginStreak += 1;
    else gameState.loginStreak = 1;

    gameState.lastLoginDate = now;
    const reward =
      1000 * gameState.loginStreak +
      getPassiveIncomePerSecond({ includeEventBoost: false }) * 60;
    gameState.coins += reward;
    gameState.totalEarnings += reward;
    gameState.researchPoints += Math.floor(1 + gameState.loginStreak / 2);

    showEventNotification(
      `🎁 Daily reward (streak ${gameState.loginStreak}): +${formatNumber(reward)}`,
    );
  }

  function loadFromBestSource() {
    if (!currentUser?.username) {
      scheduleNextEvent();
      generateQuests(true);
      return;
    }

    let raw = localStorage.getItem(getPlayerSaveKey(currentUser.username));

    // One-time migration from global save into first authenticated account.
    if (!raw) {
      raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        for (const k of LEGACY_KEYS) {
          raw = localStorage.getItem(k);
          if (raw) break;
        }
      }
      if (raw) {
        localStorage.setItem(getPlayerSaveKey(currentUser.username), raw);
        localStorage.removeItem(STORAGE_KEY);
        LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
      }
    }

    if (!raw) {
      scheduleNextEvent();
      generateQuests(true);
      applyDailyReward();
      return;
    }

    const parsed = safeJsonParse(raw);
    if (!parsed) {
      showEventNotification("⚠️ Save data corrupted. Starting fresh.");
      scheduleNextEvent();
      generateQuests(true);
      return;
    }

    const migrated = migrate(parsed);
    Object.assign(gameState, migrated);

    // Reset ephemeral event state to prevent stale timers
    gameState.activeEvent = null;
    gameState.eventMultiplier = 1;
    gameState.eventEndTime = 0;
    scheduleNextEvent(perfNow());

    updatePrestigeTier();
    unlockNewPets();
    rebuildProgressionBonuses();

    // Ensure quest rollovers are always evaluated from current day
    generateQuests(false);
    updateQuestProgress();

    applyOfflineProgress(migrated);
    applyDailyReward();

    runtime.saveEveryMs = gameState.settings.autoSaveIntervalSec * 1000;
    runtime.minFrameMs = 1000 / gameState.settings.fpsCap;
  }

  function exportSaveClipboard() {
    try {
      const payload = btoa(
        unescape(encodeURIComponent(JSON.stringify(serializeState()))),
      );
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(payload)
          .then(() => showEventNotification("📤 Save exported to clipboard"))
          .catch(() => prompt("Copy your save:", payload));
      } else {
        prompt("Copy your save:", payload);
      }
    } catch {
      showEventNotification("Export failed");
    }
  }

  function importSavePrompt() {
    const txt = prompt("Paste your exported save string:");
    if (!txt) return;
    try {
      const decoded = decodeURIComponent(escape(atob(txt.trim())));
      const parsed = safeJsonParse(decoded);
      if (!parsed) throw new Error("bad");
      const migrated = migrate(parsed);
      Object.assign(gameState, migrated);

      // reset ephemeral timers
      gameState.activeEvent = null;
      gameState.eventMultiplier = 1;
      gameState.eventEndTime = 0;
      scheduleNextEvent(perfNow());

      updatePrestigeTier();
      unlockNewPets();
      rebuildProgressionBonuses();
      generateQuests(false);
      updateQuestProgress();
      runtime.uiDirty = true;

      saveGame();
      renderAll(true);
      showEventNotification("📥 Save imported");
    } catch {
      showEventNotification("Import failed: invalid data");
    }
  }

  function saveToSlot(slot) {
    if (!currentUser?.username) return;
    const key = getPlayerSlotKey(slot);
    const data = {
      meta: {
        slot,
        savedAt: nowMs(),
        version: VERSION,
        username: currentUser.username,
      },
      state: serializeState(),
    };
    localStorage.setItem(key, JSON.stringify(data));
    renderSaveSlotsMeta();
    runtime.uiDirty = true;
    showEventNotification(`💾 Saved to slot ${slot}`);
  }

  function loadFromSlot(slot) {
    if (!currentUser?.username) return;
    const key = getPlayerSlotKey(slot);
    const raw = localStorage.getItem(key);
    if (!raw) {
      showEventNotification(`Slot ${slot} is empty`);
      return;
    }
    const obj = safeJsonParse(raw);
    const state = obj?.state;
    if (!state) {
      showEventNotification(`Slot ${slot} is corrupted`);
      return;
    }

    const migrated = migrate(state);
    Object.assign(gameState, migrated);

    gameState.activeEvent = null;
    gameState.eventMultiplier = 1;
    gameState.eventEndTime = 0;
    scheduleNextEvent(perfNow());

    updatePrestigeTier();
    unlockNewPets();
    rebuildProgressionBonuses();
    generateQuests(false);
    updateQuestProgress();
    runtime.uiDirty = true;

    saveGame();
    renderAll(true);
    renderSaveSlotsMeta();
    showEventNotification(`📂 Loaded slot ${slot}`);
  }

  function deleteSlot(slot) {
    localStorage.removeItem(getPlayerSlotKey(slot));
    renderSaveSlotsMeta();
    runtime.uiDirty = true;
    showEventNotification(`🗑️ Deleted slot ${slot}`);
  }

  function downloadBackupFile() {
    const data = JSON.stringify(serializeState(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `epic-clicker-save-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 0);
  }

  function uploadBackupFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = safeJsonParse(String(reader.result));
        if (!parsed) throw new Error("bad");
        const migrated = migrate(parsed);
        Object.assign(gameState, migrated);

        gameState.activeEvent = null;
        gameState.eventMultiplier = 1;
        gameState.eventEndTime = 0;
        scheduleNextEvent(perfNow());

        updatePrestigeTier();
        unlockNewPets();
        rebuildProgressionBonuses();
        generateQuests(false);
        updateQuestProgress();
        runtime.uiDirty = true;

        saveGame();
        renderAll(true);
        showEventNotification("⬆️ Backup loaded");
      } catch {
        showEventNotification("Invalid backup file");
      }
    };
    reader.readAsText(file);
  }

  /* =========================================================
     Settings
  ========================================================= */

  function syncSettingsToUI() {
    const s = gameState.settings;
    const sound = q(".setting-sound");
    const particles = q(".setting-particles");
    const shake = q(".setting-shake");
    const rm = q(".setting-reduced-motion");
    const as = q(".setting-autosave-interval");
    const fps = q(".setting-fps-cap");

    if (sound) sound.checked = !!s.soundEnabled;
    if (particles) particles.checked = !!s.particlesEnabled;
    if (shake) shake.checked = !!s.shakeEnabled;
    if (rm) rm.checked = !!s.reducedMotion;
    if (as) as.value = String(s.autoSaveIntervalSec);
    if (fps) fps.value = String(s.fpsCap);
  }

  function applySettingsFromUI() {
    const next = {
      soundEnabled: !!q(".setting-sound")?.checked,
      particlesEnabled: !!q(".setting-particles")?.checked,
      shakeEnabled: !!q(".setting-shake")?.checked,
      reducedMotion: !!q(".setting-reduced-motion")?.checked,
      autoSaveIntervalSec: clamp(
        Number(q(".setting-autosave-interval")?.value || 3),
        2,
        60,
      ),
      fpsCap: clamp(Number(q(".setting-fps-cap")?.value || 60), 30, 120),
    };

    gameState.settings = next;
    runtime.saveEveryMs = next.autoSaveIntervalSec * 1000;
    runtime.minFrameMs = 1000 / next.fpsCap;

    applyReducedMotionFlag();
    saveGame();
    showEventNotification("⚙️ Settings applied");
  }

  function resetSettingsDefault() {
    gameState.settings = { ...DEFAULT_SETTINGS };
    runtime.saveEveryMs = gameState.settings.autoSaveIntervalSec * 1000;
    runtime.minFrameMs = 1000 / gameState.settings.fpsCap;
    applyReducedMotionFlag();
    syncSettingsToUI();
    saveGame();
    showEventNotification("⚙️ Settings reset");
  }

  /* =========================================================
     UI events / keybinds
  ========================================================= */

  function bindPanelButtons() {
    q(".research-btn")?.addEventListener("click", () =>
      openPanel(".research-tree"),
    );
    q(".achievements-open-trigger")?.addEventListener("click", () =>
      openPanel(".achievements-panel"),
    );
    q(".upgrades-open-trigger")?.addEventListener("click", () =>
      openPanel(".upgrades-panel"),
    );
    q(".quests-open-trigger")?.addEventListener("click", () =>
      openPanel(".quests-panel"),
    );
    q(".stats-open-trigger")?.addEventListener("click", () =>
      openPanel(".stats-panel"),
    );
    q(".settings-open-trigger")?.addEventListener("click", () => {
      syncSettingsToUI();
      openPanel(".settings-panel");
    });
    q(".saves-open-trigger")?.addEventListener("click", () => {
      renderSaveSlotsMeta();
      openPanel(".save-manager-panel");
    });

    q(".close-research")?.addEventListener("click", () =>
      closePanel(".research-tree"),
    );
    q(".close-achievements")?.addEventListener("click", () =>
      closePanel(".achievements-panel"),
    );
    q(".close-upgrades")?.addEventListener("click", () =>
      closePanel(".upgrades-panel"),
    );
    q(".close-quests")?.addEventListener("click", () =>
      closePanel(".quests-panel"),
    );
    q(".close-stats")?.addEventListener("click", () =>
      closePanel(".stats-panel"),
    );
    q(".close-settings")?.addEventListener("click", () =>
      closePanel(".settings-panel"),
    );
    q(".close-save-manager")?.addEventListener("click", () =>
      closePanel(".save-manager-panel"),
    );
    q(".close-pet-panel")?.addEventListener("click", () =>
      closePanel(".pet-panel"),
    );
    q(".close-pet-modal")?.addEventListener("click", () =>
      closePanel(".pet-modal"),
    );
    q(".modal .modal-close")?.addEventListener("click", () =>
      closePanel(".modal"),
    );
  }

  function bindCoreButtons() {
    q(".main-button")?.addEventListener("click", () => {
      const crit = calculateCrit();
      const comboMul = 1 + gameState.combo * 0.04 * gameState.comboBoost;
      const amount =
        getEffectiveClickBase() * comboMul * (crit ? getCritMultiplier() : 1);
      earnCoins(amount, crit);
      createShockwave();
    });

    q(".prestige-button")?.addEventListener("click", prestige);
    q("[data-void-machine]")?.addEventListener("click", purchaseVoidMachine);

    qa(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setTheme(btn.dataset.theme || "dark");
        saveGame();
      });
    });

    qa(".buy-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        gameState.buyMode = btn.dataset.buyMode || "1";
        qa(".buy-mode-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        runtime.uiDirty = true;
      });
    });

    qa("[data-pet-level-up]").forEach((btn) => {
      btn.addEventListener("click", () => {
        levelUpPetManual(btn.getAttribute("data-pet-level-up") || "coins");
      });
    });

    q(".save-btn")?.addEventListener("click", () => {
      saveGame();
      showEventNotification("💾 Saved");
    });

    q(".reset-btn")?.addEventListener("click", () => {
      confirmAction(
        "Hard reset? This clears your current account progress.",
        () => {
          if (currentUser?.username) {
            removeAllPlayerData(currentUser.username);
          }
          location.reload();
        },
      );
    });

    q(".sound-toggle-btn")?.addEventListener("click", () => {
      gameState.settings.soundEnabled = !gameState.settings.soundEnabled;
      safeText(
        q(".sound-toggle-btn"),
        gameState.settings.soundEnabled ? "🔊 Sound" : "🔇 Sound",
      );
      saveGame();
    });

    q(".export-save-btn")?.addEventListener("click", exportSaveClipboard);
    q(".import-save-btn")?.addEventListener("click", importSavePrompt);

    q(".settings-apply-btn")?.addEventListener("click", applySettingsFromUI);
    q(".settings-default-btn")?.addEventListener("click", resetSettingsDefault);

    qa(".upgrade-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        gameState.upgradeFilter = btn.dataset.filter || "all";
        renderUpgrades();
      });
    });

    qa(".slot-save-btn").forEach((btn) =>
      btn.addEventListener("click", () => saveToSlot(btn.dataset.slot)),
    );
    qa(".slot-load-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const slot = btn.dataset.slot;
        confirmAction(
          `Load slot ${slot}? Unsaved progress will be overwritten.`,
          () => loadFromSlot(slot),
        );
      }),
    );
    qa(".slot-delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const slot = btn.dataset.slot;
        confirmAction(`Delete slot ${slot}?`, () => deleteSlot(slot));
      }),
    );

    q(".backup-download-btn")?.addEventListener("click", downloadBackupFile);
    q(".backup-upload-input")?.addEventListener("change", (e) => {
      const file = e.target?.files?.[0];
      uploadBackupFile(file);
      e.target.value = "";
    });
  }

  function bindKeyboardShortcuts() {
    // Guard against duplicate listener bindings
    if (bindKeyboardShortcuts._bound) return;
    bindKeyboardShortcuts._bound = true;

    document.addEventListener("keydown", (e) => {
      if (e.repeat) return;

      const target = e.target;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if (typing) return;

      const key = (e.key || "").toLowerCase();

      if (key === " ") {
        e.preventDefault();
        q(".main-button")?.click();
      } else if (key === "p") {
        q(".prestige-button")?.click();
      } else if (key === "r") {
        q(".research-btn")?.click();
      } else if (key === "a") {
        q(".achievements-open-trigger")?.click();
      } else if (key === "u") {
        q(".upgrades-open-trigger")?.click();
      } else if (key === "q") {
        q(".quests-open-trigger")?.click();
      } else if (key === "c") {
        q(".social-open-trigger")?.click();
      } else if (key === "m") {
        q(".sound-toggle-btn")?.click();
      } else if (key === "escape") {
        panelSelectors.forEach((sel) => closePanel(sel));
      } else if ((e.ctrlKey || e.metaKey) && key === "s") {
        e.preventDefault();
        saveGame();
        showEventNotification("💾 Saved");
      } else if (key >= "1" && key <= "5") {
        const map = { 1: "1", 2: "10", 3: "25", 4: "100", 5: "max" };
        const mode = map[key];
        const btn = q(`.buy-mode-btn[data-buy-mode="${mode}"]`);
        if (btn) btn.click();
      }
    });
  }

  /* =========================================================
     Mini-games
  ========================================================= */

  function triggerMiniGame() {
    const modal = q(".modal");
    const body = q("#modal-body");
    const title = q("#modal-title");
    if (!modal || !title) return;

    // Guard: if modal body is missing, fail safely without scheduling content
    if (!body) {
      showEventNotification("Mini-game unavailable right now.");
      return;
    }

    // If modal is already open, avoid re-scheduling another mini-game on top
    if (!modal.classList.contains("hidden")) return;

    const game = ["Number Guess", "Dice Roll", "Coin Flip"][
      Math.floor(Math.random() * 3)
    ];
    title.textContent = game;

    if (game === "Number Guess") playNumberGuess(body);
    else if (game === "Dice Roll") playDiceRoll(body);
    else playCoinFlip(body);

    openPanel(".modal");
  }

  function playNumberGuess(container) {
    const target = Math.floor(Math.random() * 10) + 1;
    const reward = Math.max(100, gameState.totalEarnings * 0.1);

    container.innerHTML = `<p>Pick a number between 1 and 10!</p><div class="num-grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:10px"></div>`;
    const grid = q(".num-grid", container);
    for (let i = 1; i <= 10; i++) {
      const b = document.createElement("button");
      b.className = "modal-button";
      b.textContent = String(i);
      b.onclick = () => {
        if (i === target) {
          gameState.coins += reward;
          gameState.totalEarnings += reward;
          container.innerHTML = `<p>🎉 Correct! Won ${formatNumber(reward)} coins.</p>`;
          playSound("achievement");
        } else {
          container.innerHTML = `<p>❌ Wrong. It was ${target}.</p>`;
          playSound("error");
        }
        runtime.uiDirty = true;
        if (q(".modal")) {
          setTimeout(() => {
            if (q(".modal") && !q(".modal")?.classList.contains("hidden")) {
              closePanel(".modal");
            }
          }, 1600);
        }
      };
      grid?.appendChild(b);
    }
  }

  function playDiceRoll(container) {
    const ai = Math.floor(Math.random() * 6) + 1;
    const you = Math.floor(Math.random() * 6) + 1;
    container.innerHTML = `<p>You: <strong>${you}</strong> | AI: <strong>${ai}</strong></p>`;
    setTimeout(() => {
      if (you > ai) {
        gameState.eventMultiplier = Math.max(gameState.eventMultiplier, 1.5);
        gameState.eventEndTime = perfNow() + 60000;
        gameState.activeEvent = "🎲 Dice Blessing";
        container.innerHTML = "<p>🎉 You won! 1.5x income for 60s.</p>";
        playSound("achievement");
      } else {
        container.innerHTML = "<p>❌ AI won. Try again next time.</p>";
        playSound("error");
      }
      runtime.uiDirty = true;
      if (q(".modal")) {
        setTimeout(() => {
          if (q(".modal") && !q(".modal")?.classList.contains("hidden")) {
            closePanel(".modal");
          }
        }, 1500);
      }
    }, 600);
  }

  function playCoinFlip(container) {
    const guess = Math.random() > 0.5 ? "heads" : "tails";
    const flip = Math.random() > 0.5 ? "heads" : "tails";
    const risk = Math.max(1000, gameState.coins * 0.1);

    container.innerHTML = `<p>You guessed <strong>${guess.toUpperCase()}</strong>...</p>`;
    setTimeout(() => {
      if (guess === flip) {
        gameState.coins += risk;
        gameState.totalEarnings += risk;
        container.innerHTML = `<p>🎉 ${flip.toUpperCase()}! You won ${formatNumber(risk)}.</p>`;
        playSound("achievement");
      } else {
        gameState.coins = Math.max(0, gameState.coins - risk);
        container.innerHTML = `<p>❌ ${flip.toUpperCase()}! You lost ${formatNumber(risk)}.</p>`;
        playSound("error");
      }
      runtime.uiDirty = true;
      if (q(".modal")) {
        setTimeout(() => {
          if (q(".modal") && !q(".modal")?.classList.contains("hidden")) {
            closePanel(".modal");
          }
        }, 1500);
      }
    }, 700);
  }

  /* =========================================================
     Loop / performance-tuned tick
  ========================================================= */

  function updateFps(dtMs) {
    gameState.frameTimes.push(dtMs);
    if (gameState.frameTimes.length > 30) gameState.frameTimes.shift();
    const avg =
      gameState.frameTimes.reduce((a, b) => a + b, 0) /
      Math.max(1, gameState.frameTimes.length);
    gameState.fpsSmoothed = Math.max(1, Math.round(1000 / avg));
  }

  function tick(ts) {
    if (!runtime.running) return;

    if (!runtime.lastTs) runtime.lastTs = ts;
    let deltaMs = ts - runtime.lastTs;
    if (deltaMs < runtime.minFrameMs - 0.5) {
      runtime.rafId = requestAnimationFrame(tick);
      return;
    }

    // Detect hidden-tab/background throttling and apply deterministic catch-up.
    if (deltaMs > 2000) {
      const catchupSec = clamp(deltaMs / 1000, 0, 30);
      const catchupIncome =
        getPassiveIncomePerSecond({ includeEventBoost: false }) * catchupSec;
      gameState.coins += catchupIncome;
      gameState.totalEarnings += catchupIncome;
      gameState.activeEvent = null;
      gameState.eventMultiplier = 1;
      gameState.eventEndTime = 0;
      scheduleNextEvent(ts);
      showEventNotification(
        `⏯️ Session resumed: +${formatNumber(catchupIncome)} catch-up`,
      );
      runtime.uiDirty = true;
      deltaMs = runtime.minFrameMs;
    }

    runtime.lastTs = ts;
    updateFps(deltaMs);

    const dt = clamp(deltaMs / 1000, 0, 1);
    gameState.lastActiveAt = nowMs();

    // Passive gains
    const income = getPassiveIncomePerSecond();
    const gain = income * dt;
    gameState.coins += gain;
    gameState.totalEarnings += gain;

    // Event expiration
    if (gameState.activeEvent && ts >= gameState.eventEndTime) {
      gameState.activeEvent = null;
      gameState.eventMultiplier = 1;
      gameState.eventEndTime = 0;
      q(".event-notification")?.classList.add("hidden");
    }

    // Event trigger
    if (!gameState.activeEvent && ts >= gameState.nextEventAt) {
      triggerRandomEvent(ts);
    }

    // Quest updates (cheap)
    updateQuestProgress();

    if (
      gameState.activePet &&
      hasPetAbility(25) &&
      ts >= runtime.nextPetLuckyAt
    ) {
      const petReward = Math.max(
        500,
        getPassiveIncomePerSecond({ includeEventBoost: false }) * 20,
      );
      gameState.coins += petReward;
      gameState.totalEarnings += petReward;
      runtime.nextPetLuckyAt = ts + 60000;
      showEventNotification(`🐾 Lucky pet find: +${formatNumber(petReward)}`);
      runtime.uiDirty = true;
    }

    // Autosave
    if (ts - runtime.lastSaveTs >= runtime.saveEveryMs) {
      saveGame();
      runtime.lastSaveTs = ts;
    }

    // Periodically re-sync moderation/account status (kick, role changes, warnings)
    if (ts - runtime.lastAccountSyncTs >= runtime.accountSyncEveryMs) {
      syncCurrentUserAccountState();
      runtime.lastAccountSyncTs = ts;
    }

    // UI render throttled to ~15fps max
    if (runtime.uiDirty || ts - runtime.lastUiRenderTs > 66) {
      renderAll(false);
      runtime.lastUiRenderTs = ts;
    }

    runtime.rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (runtime.running) return;
    runtime.running = true;
    runtime.lastTs = 0;
    runtime.lastAccountSyncTs = 0;
    runtime.rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    runtime.running = false;
    if (runtime.rafId) cancelAnimationFrame(runtime.rafId);
    runtime.rafId = 0;
  }

  /* =========================================================
     Initialization
  ========================================================= */

  function boot() {
    loadFromBestSource();
    setTheme(gameState.theme);
    applyReducedMotionFlag();

    // init button text / active states
    safeText(
      q(".sound-toggle-btn"),
      gameState.settings.soundEnabled ? "🔊 Sound" : "🔇 Sound",
    );
    const activeMode = qa(".buy-mode-btn").find(
      (b) => b.dataset.buyMode === gameState.buyMode,
    );
    if (activeMode) {
      qa(".buy-mode-btn").forEach((b) => b.classList.remove("active"));
      activeMode.classList.add("active");
    }

    bindPanelButtons();
    bindCoreButtons();
    bindKeyboardShortcuts();

    renderAll(true);

    // combo timeout checker
    runtime.comboIntervalId = setInterval(() => {
      if (perfNow() - gameState.comboLastClick > gameState.comboTimeoutMs) {
        resetCombo();
      }
    }, 400);

    // persist on lifecycle changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        saveGame();
        stopLoop();
      } else {
        startLoop();
      }
    });

    window.addEventListener("beforeunload", () => {
      saveGame();
      stopLoop();
      if (runtime.comboIntervalId) clearInterval(runtime.comboIntervalId);
    });

    window.addEventListener("resize", () => {
      syncLayoutMetrics();
      runtime.uiDirty = true;
    });

    syncLayoutMetrics();
    startLoop();
  }

  function initApp() {
    setupAuthHandlers();
    setupPlayerListHandlers();
    setupSocialHandlers();
    setupAdminHandlers();

    const restored = accountSystem.restoreSession();
    if (restored) {
      hideAuthModal();
      boot();
      updateUserInfo();
      renderPlayersList();
      showPendingUserNotifications();
    } else {
      showAuthModal();
      updateUserInfo();
    }
  }

  function showAuthModal() {
    setHidden(q(".auth-modal"), false);
    q(".dashboard")?.classList.add("hidden");
    q(".shops-container")?.classList.add("hidden");
    closePanel(".admin-panel");
    closePanel(".players-panel");
  }

  function hideAuthModal() {
    setHidden(q(".auth-modal"), true);
    q(".dashboard")?.classList.remove("hidden");
    q(".shops-container")?.classList.remove("hidden");
  }

  function updateUserInfo() {
    const adminBtn = q(".admin-open-trigger");

    if (!currentUser) {
      safeText(q(".user-name"), "Guest");
      safeText(q(".user-role"), "OFFLINE");
      adminBtn?.classList.add("hidden");
      return;
    }

    safeText(q(".user-name"), currentUser.username);
    currentUser.role = currentRole();
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    safeText(q(".user-role"), currentUser.role.toUpperCase());

    if (permissionSystem.isAdmin()) {
      adminBtn?.classList.remove("hidden");
    } else {
      adminBtn?.classList.add("hidden");
    }
  }

  function showPendingUserNotifications() {
    if (!currentUser?.username) return;
    const notifications = accountSystem.collectNotifications(
      currentUser.username,
    );
    notifications.forEach((note, idx) => {
      setTimeout(() => {
        if (currentUser?.username) {
          showEventNotification(note?.message || "New account notification");
        }
      }, idx * 1700);
    });
  }

  function syncCurrentUserAccountState() {
    if (!currentUser?.username) return;

    const account = accountSystem.getAccount(currentUser.username);
    if (!account || !account.isActive) {
      saveGame();
      stopLoop();
      accountSystem.logout();
      updateUserInfo();
      showAuthModal();
      showEventNotification("Account unavailable. Please log in again.");
      return;
    }

    const kickedUntil = Number(account.kickedUntil || 0);
    if (kickedUntil > nowMs()) {
      saveGame();
      stopLoop();
      accountSystem.logout();
      updateUserInfo();
      showAuthModal();
      showEventNotification(
        `You were kicked. Try again in ${formatDuration(kickedUntil - nowMs())}.`,
      );
      return;
    }

    const accountRole = normalizeRole(account.role);
    if (accountRole !== currentRole()) {
      currentUser.role = accountRole;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      updateUserInfo();
      if (!permissionSystem.isAdmin()) closePanel(".admin-panel");
      renderPlayersList();
    }

    if (!permissionSystem.isAdmin()) {
      closePanel(".admin-panel");
    }

    showPendingUserNotifications();
  }

  function getTargetUsernameFromAdminUI() {
    const inputValue = normalizeUsername(q(".admin-target-player")?.value);
    return inputValue || selectedAdminPlayer || "";
  }

  function setSelectedAdminPlayer(username) {
    selectedAdminPlayer = username || null;
    const targetInput = q(".admin-target-player");
    if (targetInput) targetInput.value = selectedAdminPlayer || "";

    qa(".admin-player-item").forEach((item) => {
      item.classList.toggle(
        "selected",
        item.dataset.username === selectedAdminPlayer,
      );
    });
  }

  function getPlayerStatsForAdmin(username) {
    const data = readPlayerSave(username);
    if (!data) {
      return {
        coins: 0,
        earnings: 0,
        clicks: 0,
        prestige: 0,
        lastSaveAt: 0,
      };
    }

    const state = migrate(data);
    return {
      coins: Number(state.coins) || 0,
      earnings: Number(state.totalEarnings) || 0,
      clicks: Number(state.totalClicks) || 0,
      prestige: Number(state.prestigeLevel) || 0,
      lastSaveAt: Number(state.lastSaveAt) || 0,
    };
  }

  function resetPlayerProgress(username) {
    removeAllPlayerData(username);
  }

  function modifyPlayerCoins(username, delta) {
    if (isSelfTarget(username)) {
      const before = Number(gameState.coins) || 0;
      const requestedDelta = Number(delta) || 0;
      const after = Math.max(0, before + requestedDelta);
      const applied = after - before;

      gameState.coins = after;
      if (applied > 0) {
        gameState.totalEarnings =
          (Number(gameState.totalEarnings) || 0) + applied;
      }
      runtime.uiDirty = true;
      saveGame();
      return applied;
    }

    const existing = readPlayerSave(username);
    const state = migrate(existing || {});

    const before = Number(state.coins) || 0;
    const requestedDelta = Number(delta) || 0;
    const after = Math.max(0, before + requestedDelta);
    const applied = after - before;

    state.coins = after;
    if (applied > 0) {
      state.totalEarnings = (Number(state.totalEarnings) || 0) + applied;
    }
    state.lastSaveAt = nowMs();
    state.lastActiveAt = nowMs();

    writePlayerSave(username, state);
    return applied;
  }

  function setupAuthHandlers() {
    if (authHandlersBound) return;
    authHandlersBound = true;

    qa(".auth-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        qa(".auth-tab-btn").forEach((b) => b.classList.remove("active"));
        qa(".auth-tab-content").forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        q(`.auth-tab-content[data-tab="${btn.dataset.tab}"]`)?.classList.add(
          "active",
        );
      });
    });

    q("#login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = normalizeUsername(q("#login-username")?.value);
      const password = q("#login-password")?.value || "";

      const result = accountSystem.login(username, password);
      if (!result.success) {
        safeText(q("#login-error"), result.error);
        return;
      }

      safeText(q("#login-error"), "");
      if (q("#login-username")) q("#login-username").value = "";
      if (q("#login-password")) q("#login-password").value = "";

      hideAuthModal();
      boot();
      updateUserInfo();
      renderPlayersList();
      showPendingUserNotifications();
    });

    q("#register-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = normalizeUsername(q("#register-username")?.value);
      const password = q("#register-password")?.value || "";
      const confirmPassword = q("#register-confirm")?.value || "";

      if (password !== confirmPassword) {
        safeText(q("#register-error"), "Passwords do not match");
        return;
      }

      const result = accountSystem.register(username, password);
      if (!result.success) {
        safeText(q("#register-error"), result.error);
        return;
      }

      safeText(q("#register-error"), "");
      if (q("#register-username")) q("#register-username").value = "";
      if (q("#register-password")) q("#register-password").value = "";
      if (q("#register-confirm")) q("#register-confirm").value = "";

      const loginResult = accountSystem.login(username, password);
      if (!loginResult.success) {
        safeText(
          q("#register-error"),
          loginResult.error || "Auto-login failed",
        );
        return;
      }

      hideAuthModal();
      boot();
      updateUserInfo();
      renderPlayersList();
      showPendingUserNotifications();
    });

    q(".logout-btn")?.addEventListener("click", () => {
      confirmAction("Logout from this account?", () => {
        saveGame();
        stopLoop();
        accountSystem.logout();
        updateUserInfo();
        showAuthModal();
        location.reload();
      });
    });
  }

  function setupPlayerListHandlers() {
    if (playerHandlersBound) return;
    playerHandlersBound = true;

    q(".players-open-trigger")?.addEventListener("click", () => {
      if (!permissionSystem.canViewPlayers()) {
        showEventNotification("Please login first");
        return;
      }
      renderPlayersList();
      openPanel(".players-panel");
    });

    q(".close-players")?.addEventListener("click", () => {
      closePanel(".players-panel");
    });
  }

  function setupSocialHandlers() {
    if (socialHandlersBound) return;
    socialHandlersBound = true;

    q(".social-open-trigger")?.addEventListener("click", () => {
      openSocialHub("chat");
    });

    q(".close-social")?.addEventListener("click", () => {
      closePanel(".social-panel");
      markSocialRead();
    });

    qa(".social-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectSocialTab(btn.dataset.socialTab || "chat");
        renderSocialPanel();
        markSocialRead();
      });
    });

    q(".chat-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = q(".chat-input");
      if (!input) return;
      if (sendChatMessage(input.value)) {
        input.value = "";
        markSocialRead();
      }
    });

    qa(".quick-chat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendChatMessage(btn.dataset.chat || btn.textContent || "");
        markSocialRead();
      });
    });

    q(".gift-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      sendGift(
        q(".gift-target-input")?.value,
        q(".gift-coins-input")?.value,
        q(".gift-research-input")?.value,
        q(".gift-note-input")?.value,
      );
      if (q(".gift-coins-input")) q(".gift-coins-input").value = "";
      if (q(".gift-research-input")) q(".gift-research-input").value = "";
      if (q(".gift-note-input")) q(".gift-note-input").value = "";
    });

    qa(".gift-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const preset = btn.dataset.giftPreset;
        const coinsInput = q(".gift-coins-input");
        const researchInput = q(".gift-research-input");
        if (preset === "small") {
          if (coinsInput)
            coinsInput.value = String(
              Math.max(25, Math.floor(gameState.coins * 0.02)),
            );
          if (researchInput) researchInput.value = "0";
        } else if (preset === "big") {
          if (coinsInput)
            coinsInput.value = String(
              Math.max(100, Math.floor(gameState.coins * 0.1)),
            );
          if (researchInput) researchInput.value = "0";
        } else {
          if (coinsInput) coinsInput.value = "0";
          if (researchInput)
            researchInput.value = String(
              Math.max(1, Math.floor(gameState.researchPoints * 0.1)),
            );
        }
      });
    });
  }

  function renderPlayersList() {
    const list = q(".players-list");
    if (!list) return;

    const priority = { owner: 0, admin: 1, player: 2 };
    const accounts = accountSystem
      .getAllAccounts()
      .sort(
        (a, b) =>
          (priority[a.role] ?? 9) - (priority[b.role] ?? 9) ||
          a.username.localeCompare(b.username),
      );

    list.innerHTML = "";
    if (!accounts.length) {
      list.innerHTML =
        '<div class="player-item">No players registered yet.</div>';
      return;
    }

    accounts.forEach((account) => {
      const div = document.createElement("div");
      div.className = "player-item";

      const role = String(account.role || "player").toUpperCase();
      const warnings = Number(account.warnings || 0);
      const isCurrent = currentUser?.username === account.username;

      div.innerHTML = `
        <div>
          <span class="player-name">${escapeHtml(account.username)}${isCurrent ? " (You)" : ""}</span>
          <span class="player-role">${role}</span>
          <span class="player-status">${account.isActive ? "✓" : "✗"}</span>
          ${warnings > 0 ? `<span class="admin-player-warnings">⚠️ ${warnings}</span>` : ""}
        </div>
        <div class="player-stats">
          Last Login: ${account.lastLogin ? new Date(account.lastLogin).toLocaleString() : "Never"}
        </div>
        <div class="player-actions">
          <button class="utility-btn player-chat-btn" data-username="${escapeHtml(account.username)}">Chat</button>
          <button class="utility-btn player-gift-btn" data-username="${escapeHtml(account.username)}">Gift</button>
          ${isCurrent ? "" : `<button class="utility-btn player-cheer-btn" data-username="${escapeHtml(account.username)}">Cheer</button>`}
        </div>
      `;

      list.appendChild(div);

      q(".player-chat-btn", div)?.addEventListener("click", () => {
        openSocialHub("chat");
        const input = q(".chat-input");
        if (input && !isCurrent) {
          input.value = `@${account.username} `;
          input.focus();
        }
      });
      q(".player-gift-btn", div)?.addEventListener("click", () => {
        openSocialHub("gifts", account.username);
      });
      q(".player-cheer-btn", div)?.addEventListener("click", () => {
        sendCheer(account.username);
      });
    });
  }

  function renderSocialPanel() {
    renderChatPanel();
    renderGiftPanel();
    renderLeaderboardPanel();
    updateSocialBadge();
  }

  function renderChatPanel() {
    const log = q(".chat-log");
    if (!log) return;
    const store = readSocialStore();
    log.innerHTML = "";

    if (!store.chat.length) {
      log.innerHTML = '<div class="empty-state">No messages yet.</div>';
      return;
    }

    store.chat.slice(-MAX_CHAT_MESSAGES).forEach((msg) => {
      const row = document.createElement("div");
      row.className = `chat-message ${msg.system ? "system" : ""}`;
      row.innerHTML = `
        <div class="chat-meta">
          <span class="chat-user">${escapeHtml(msg.username || "Player")}</span>
          <span class="chat-role">${escapeHtml(msg.role || "player")}</span>
          <span>${formatRelativeTime(msg.createdAt)}</span>
        </div>
        <div class="chat-text">${escapeHtml(msg.text || "")}</div>
      `;
      log.appendChild(row);
    });
    log.scrollTop = log.scrollHeight;
  }

  function renderGiftPanel() {
    const inbox = q(".gift-inbox");
    if (!inbox) return;
    const store = readSocialStore();
    const mine = store.gifts
      .filter(
        (gift) =>
          accountKey(gift.to) === accountKey(currentUser?.username) ||
          accountKey(gift.from) === accountKey(currentUser?.username),
      )
      .slice(-40)
      .reverse();

    inbox.innerHTML = "";
    if (!mine.length) {
      inbox.innerHTML = '<div class="empty-state">No gifts yet.</div>';
      return;
    }

    mine.forEach((gift) => {
      const incoming =
        accountKey(gift.to) === accountKey(currentUser?.username);
      const pending = incoming && !gift.claimed && !gift.rejected;
      const status = gift.claimed
        ? "Claimed"
        : gift.rejected
          ? "Dismissed"
          : incoming
            ? "Ready"
            : "Sent";
      const card = document.createElement("div");
      card.className = `gift-card ${pending ? "pending" : ""}`;
      card.innerHTML = `
        <div>
          <strong>${incoming ? "From" : "To"} ${escapeHtml(incoming ? gift.from : gift.to)}</strong>
          <div class="gift-meta">${formatRelativeTime(gift.createdAt)} • ${status}</div>
          <div class="gift-value">+${formatNumber(gift.coins || 0)} coins • +${gift.research || 0} research</div>
          ${gift.mysteryBoost ? `<div class="gift-note">Mystery bonus activated.</div>` : ""}
          ${gift.note ? `<div class="gift-note">${escapeHtml(gift.note)}</div>` : ""}
        </div>
        ${
          pending
            ? `<div class="gift-actions">
                <button class="utility-btn gift-claim-btn" data-gift-id="${escapeHtml(gift.id)}">Claim</button>
                <button class="utility-btn gift-reject-btn" data-gift-id="${escapeHtml(gift.id)}">Dismiss</button>
              </div>`
            : ""
        }
      `;
      inbox.appendChild(card);
      q(".gift-claim-btn", card)?.addEventListener("click", () =>
        claimGift(gift.id),
      );
      q(".gift-reject-btn", card)?.addEventListener("click", () =>
        rejectGift(gift.id),
      );
    });
  }

  function renderLeaderboardPanel() {
    const grid = q(".leaderboard-grid");
    if (!grid) return;
    const accounts = accountSystem.getAllAccounts();
    const rows = accounts
      .map((account) => {
        const stats = getPlayerStatsForAdmin(account.username);
        return {
          username: account.username,
          role: normalizeRole(account.role),
          coins: stats.coins,
          earnings: stats.earnings,
          clicks: stats.clicks,
          prestige: stats.prestige,
          score:
            stats.earnings +
            stats.coins * 0.1 +
            stats.prestige * 1000000 +
            stats.clicks * 10,
        };
      })
      .sort((a, b) => b.score - a.score);

    grid.innerHTML = "";
    if (!rows.length) {
      grid.innerHTML = '<div class="empty-state">No players yet.</div>';
      return;
    }

    rows.forEach((row, index) => {
      const current = isSelfTarget(row.username);
      const card = document.createElement("div");
      card.className = `leaderboard-card ${current ? "current" : ""}`;
      card.innerHTML = `
        <div class="leaderboard-rank">#${index + 1}</div>
        <div class="leaderboard-main">
          <strong>${escapeHtml(row.username)}${current ? " (You)" : ""}</strong>
          <span>${row.role.toUpperCase()} • Prestige ${row.prestige}</span>
          <span>${formatNumber(row.earnings)} earned • ${formatNumber(row.coins)} coins • ${formatNumber(row.clicks)} clicks</span>
        </div>
        <div class="leaderboard-actions">
          ${current ? "" : `<button class="utility-btn leaderboard-gift-btn" data-username="${escapeHtml(row.username)}">Gift</button>`}
          ${current ? "" : `<button class="utility-btn leaderboard-cheer-btn" data-username="${escapeHtml(row.username)}">Cheer</button>`}
        </div>
      `;
      grid.appendChild(card);
      q(".leaderboard-gift-btn", card)?.addEventListener("click", () => {
        openSocialHub("gifts", row.username);
      });
      q(".leaderboard-cheer-btn", card)?.addEventListener("click", () => {
        sendCheer(row.username);
      });
    });
  }

  function setupAdminHandlers() {
    if (adminHandlersBound) return;
    adminHandlersBound = true;

    q(".admin-open-trigger")?.addEventListener("click", () => {
      if (!permissionSystem.isAdmin()) {
        showEventNotification("Access denied: admin only");
        return;
      }
      renderAdminPanel();
      openPanel(".admin-panel");
    });

    q(".close-admin")?.addEventListener("click", () => {
      closePanel(".admin-panel");
    });

    qa(".admin-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        qa(".admin-tab-btn").forEach((b) => b.classList.remove("active"));
        qa(".admin-tab-content").forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        q(
          `.admin-tab-content[data-admin-tab="${btn.dataset.adminTab}"]`,
        )?.classList.add("active");
      });
    });

    q(".admin-promote-admin-btn")?.addEventListener("click", () => {
      const target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      if (isSelfTarget(target))
        return showEventNotification("You cannot promote yourself");
      if (!permissionSystem.canPromoteAdmin(target))
        return showEventNotification("Owner permission required");

      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      if (targetAccount.role === "owner")
        return showEventNotification("Cannot change owner role");

      if (accountSystem.promoteToAdmin(target)) {
        showEventNotification(`✓ ${target} promoted to admin`);
        setSelectedAdminPlayer(target);
        renderAdminPanel();
        renderPlayersList();
      }
    });

    q(".admin-demote-admin-btn")?.addEventListener("click", () => {
      const target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      if (isSelfTarget(target))
        return showEventNotification("You cannot demote yourself");
      if (!permissionSystem.canDemoteAdmin(target))
        return showEventNotification("Owner permission required");

      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      if (targetAccount.role === "owner")
        return showEventNotification("Cannot demote owner");

      if (accountSystem.demoteToPlayer(target)) {
        showEventNotification(`✓ ${target} demoted to player`);
        setSelectedAdminPlayer(target);
        renderAdminPanel();
        renderPlayersList();
      }
    });

    q(".admin-delete-account-btn")?.addEventListener("click", () => {
      const target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      if (isSelfTarget(target))
        return showEventNotification("You cannot delete your own account here");
      if (!permissionSystem.canDeleteAccount(target))
        return showEventNotification("Owner permission required");

      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      if (targetAccount.role === "owner")
        return showEventNotification("Cannot delete owner account");

      confirmAction(`Delete ${target} and all their data?`, () => {
        accountSystem.deleteAccount(target);
        if (selectedAdminPlayer === target) setSelectedAdminPlayer(null);
        renderAdminPanel();
        renderPlayersList();
        showEventNotification(`✓ Deleted ${target}`);
      });
    });

    q(".admin-give-coins-btn")?.addEventListener("click", () => {
      let target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      target = targetAccount.username;
      if (!permissionSystem.canModifyCoins(target))
        return showEventNotification("Owner permission required");

      const amount = Math.floor(
        Math.abs(Number(q(".admin-coins-amount")?.value) || 0),
      );
      if (amount <= 0)
        return showEventNotification("Enter a valid coin amount");

      const applied = modifyPlayerCoins(target, amount);
      q(".admin-coins-amount").value = "";
      showEventNotification(
        `✓ Added ${formatNumber(applied)} coins to ${target}`,
      );
      renderAdminPanel();
    });

    q(".admin-remove-coins-btn")?.addEventListener("click", () => {
      let target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      target = targetAccount.username;
      if (!permissionSystem.canModifyCoins(target))
        return showEventNotification("Owner permission required");

      const amount = Math.floor(
        Math.abs(Number(q(".admin-coins-amount")?.value) || 0),
      );
      if (amount <= 0)
        return showEventNotification("Enter a valid coin amount");

      const applied = modifyPlayerCoins(target, -amount);
      q(".admin-coins-amount").value = "";
      showEventNotification(
        `✓ Removed ${formatNumber(Math.abs(applied))} coins from ${target}`,
      );
      renderAdminPanel();
    });

    q(".admin-clear-warnings-btn")?.addEventListener("click", () => {
      let target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      target = targetAccount.username;
      if (!permissionSystem.canClearWarnings(target))
        return showEventNotification("Owner permission required");

      if (accountSystem.clearWarnings(target)) {
        showEventNotification(`✓ Cleared warnings for ${target}`);
        renderAdminPanel();
        renderPlayersList();
      }
    });

    q(".admin-reset-player-btn")?.addEventListener("click", () => {
      let target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      target = targetAccount.username;
      if (!permissionSystem.canResetPlayer(target))
        return showEventNotification("Cannot reset this player");

      confirmAction(`Reset all progress for ${target}?`, () => {
        resetPlayerProgress(target);
        showEventNotification(`✓ Reset progress for ${target}`);
        renderAdminPanel();
      });
    });

    q(".admin-warn-player-btn")?.addEventListener("click", () => {
      let target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      target = targetAccount.username;
      if (!permissionSystem.canWarnPlayer(target))
        return showEventNotification("Cannot warn this player");

      const ok = accountSystem.addWarning(
        target,
        currentUser?.username || "Admin",
      );
      if (!ok) return showEventNotification("Failed to warn player");

      showEventNotification(`✓ Warned ${target}`);
      renderAdminPanel();
      renderPlayersList();
    });

    q(".admin-kick-player-btn")?.addEventListener("click", () => {
      let target = getTargetUsernameFromAdminUI();
      if (!target) return showEventNotification("Select a player first");
      const targetAccount = accountSystem.getAccount(target);
      if (!targetAccount) return showEventNotification("Player not found");
      target = targetAccount.username;
      if (!permissionSystem.canKickPlayer(target))
        return showEventNotification("Cannot kick this player");

      const minutes = clamp(
        Number(q(".admin-kick-minutes")?.value || 10),
        1,
        1440,
      );
      if (
        accountSystem.kickPlayer(
          target,
          currentUser?.username || "Admin",
          minutes,
        )
      ) {
        showEventNotification(
          `✓ Kicked ${target} for ${Math.floor(minutes)} minute(s)`,
        );
        renderAdminPanel();
      }
    });
  }

  function renderAdminPanel() {
    const panel = q(".admin-panel");
    const list = q(".admin-players-list");
    if (!panel || !list) return;

    if (!permissionSystem.isAdmin()) {
      closePanel(".admin-panel");
      return;
    }

    const ownerActions = q("#owner-actions");
    ownerActions?.classList.toggle("hidden", !permissionSystem.isOwner());

    const accounts = accountSystem
      .getAllAccounts()
      .sort((a, b) => a.username.localeCompare(b.username));

    list.innerHTML = "";
    if (!accounts.length) {
      list.innerHTML =
        '<div class="admin-player-item">No accounts found.</div>';
      return;
    }

    accounts.forEach((account) => {
      const stats = getPlayerStatsForAdmin(account.username);
      const kickedUntil = Number(account.kickedUntil || 0);
      const kickedText =
        kickedUntil > nowMs()
          ? `Kicked: ${formatDuration(kickedUntil - nowMs())} left`
          : "Not kicked";

      const div = document.createElement("div");
      div.className = "admin-player-item";
      div.dataset.username = account.username;
      if (selectedAdminPlayer === account.username)
        div.classList.add("selected");

      const canViewStats = permissionSystem.canViewAllPlayerData();

      div.innerHTML = `
        <div class="admin-player-info">
          <span class="admin-player-name">${escapeHtml(account.username)}</span>
          <span class="admin-player-role">${String(account.role || "player").toUpperCase()}</span>
          ${Number(account.warnings || 0) > 0 ? `<span class="admin-player-warnings">⚠️ ${Number(account.warnings)}</span>` : ""}
          <span class="player-status">${account.isActive ? "✓" : "✗"}</span>
        </div>
        <div class="player-stats">
          Last Login: ${account.lastLogin ? new Date(account.lastLogin).toLocaleString() : "Never"}
          ${canViewStats ? `<br>Coins: ${formatNumber(stats.coins)} | Prestige: ${stats.prestige} | Clicks: ${formatNumber(stats.clicks)} | Earned: ${formatNumber(stats.earnings)}` : ""}
          ${canViewStats ? `<br>${kickedText}` : ""}
        </div>
        <div class="admin-player-actions">
          <button class="utility-btn admin-select-btn" data-username="${escapeHtml(account.username)}">Select</button>
        </div>
      `;

      list.appendChild(div);

      q(".admin-select-btn", div)?.addEventListener("click", () => {
        setSelectedAdminPlayer(account.username);
      });
    });
  }

  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return String(text || "").replace(/[&<>"']/g, (m) => map[m]);
  }

  // Expose minimal safe helpers for existing markup compatibility
  window.levelUpPetManual = (petId, method) => {
    if (petId && petId !== gameState.activePet) gameState.activePet = petId;
    levelUpPetManual(method || "coins");
  };
  window.renderAchievements = () => {
    renderAchievements();
    openPanel(".achievements-panel");
    runtime.uiDirty = true;
  };

  document.addEventListener("DOMContentLoaded", initApp);
})();
