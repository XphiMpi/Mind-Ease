// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import MindDumpView from "../views/MindDumpView.vue";
import RealityCheckView from "../views/RealityCheckView.vue";
import CalmCornerView from "../views/CalmCornerView.vue";
import MoodTrackerView from "../views/MoodTrackerView.vue";
import GratitudeView from "../views/GratitudeView.vue";
import JournalView from "../views/JournalView.vue";
import StatsView from "../views/StatsView.vue";
import ProfileView from "../views/ProfileView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/mind-dump", name: "mind-dump", component: MindDumpView },
  {
    path: "/reality-check",
    name: "reality-check",
    component: RealityCheckView,
  },
  { path: "/calm-corner", name: "calm-corner", component: CalmCornerView },
  { path: "/mood-tracker", name: "mood-tracker", component: MoodTrackerView },
  { path: "/gratitude", name: "gratitude", component: GratitudeView },
  { path: "/journal", name: "journal", component: JournalView },
  { path: "/stats", name: "stats", component: StatsView },
  { path: "/profile", name: "profile", component: ProfileView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
