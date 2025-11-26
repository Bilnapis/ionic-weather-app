<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Jakarta Weather</ion-title>
        <ion-buttons slot="end">
          <ion-button
            size="small"
            fill="outline"
            :disabled="loading"
            @click="loadWeather"
          >
            Refresh
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="page-content">
      <section class="current-section">
        <div class="current-card">
          <div class="card-fog fog-a"></div>
          <div class="card-fog fog-b"></div>

          <div v-if="loading" class="state state-light">
            <ion-spinner name="crescent" />
            <span>Updating Jakarta weather...</span>
          </div>
          <ion-text color="light" class="state state-light" v-else-if="error">
            {{ error }} </ion-text
          ><template v-else-if="currentWeather">
            <div class="current-top">
              <div>
                <p class="current-label">
                  {{ formatDay(currentWeather.time) }}
                </p>
                <h1 class="current-title">Jakarta Now</h1>
                <p class="current-sub">
                  {{ currentDescriptor.label }} &middot;
                  {{ formatTime(currentWeather.time) }}
                </p>
              </div>
              <ion-icon class="hero-icon" :icon="currentIcon" />
            </div>

            <div class="current-temp">
              <span class="temp-main">
                {{ formatTemperature(currentWeather.temperature) }}
              </span>
              <span class="temp-unit">&deg;C</span>
            </div>
          </template>
          <div class="state state-light" v-else>
            <span>No weather data available.</span>
          </div>
        </div>
      </section>

      <ion-card class="hourly-card">
        <ion-card-header>
          <ion-card-title>Hourly temperature</ion-card-title>
          <ion-card-subtitle
            >Time in local timezone, degrees in Celsius</ion-card-subtitle
          >
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none" class="list-header">
            <ion-label>Time</ion-label>
            <ion-label class="temp">Temp (&deg;C)</ion-label>
          </ion-item>

          <div class="state" v-if="loading">
            <ion-spinner name="crescent" />
            <span>Loading forecast...</span>
          </div>

          <ion-text color="danger" v-else-if="error">
            {{ error }}
          </ion-text>

          <ion-list v-else>
            <ion-item v-for="entry in weather" :key="entry.time" lines="full">
              <ion-label>
                <div class="time">{{ formatTime(entry.time) }}</div>
                <div class="date">{{ formatDate(entry.time) }}</div>
              </ion-label>
              <ion-label class="temp" slot="end">
                {{ entry.temperature.toFixed(1) }}&deg;
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { computed, onMounted, ref } from "vue";
import {
  CurrentWeather,
  describeWeather,
  fetchCurrentWeather,
  fetchHourlyWeather,
  HourlyWeather,
} from "@/services/weatherService";
import {
  cloudOutline,
  partlySunnyOutline,
  rainyOutline,
  sunnyOutline,
  thunderstormOutline,
} from "ionicons/icons";

const weather = ref<HourlyWeather[]>([]);
const currentWeather = ref<CurrentWeather | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const formatTime = (iso: string | undefined) =>
  iso
    ? new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatDay = (iso: string | undefined) => {
  if (!iso) return "Today";
  const date = new Date(iso);
  const today = new Date();
  return date.toDateString() === today.toDateString()
    ? "Today"
    : date.toLocaleDateString([], { weekday: "long" });
};

const formatTemperature = (value: number | undefined) => {
  if (value === undefined || value === null || Number.isNaN(value)) return "--";
  return Math.round(value);
};

const currentDescriptor = computed(() =>
  describeWeather(currentWeather.value?.weatherCode)
);

const weatherIcons = {
  rainy: rainyOutline,
  cloudy: cloudOutline,
  "partly-sunny": partlySunnyOutline,
  sunny: sunnyOutline,
  thunderstorm: thunderstormOutline,
};

const currentIcon = computed(
  () => weatherIcons[currentDescriptor.value.icon] ?? cloudOutline
);

const loadWeather = async () => {
  loading.value = true;
  error.value = null;
  currentWeather.value = null;
  weather.value = [];
  try {
    const [current, hourly] = await Promise.all([
      fetchCurrentWeather(),
      fetchHourlyWeather(),
    ]);
    currentWeather.value = current;
    weather.value = hourly;
  } catch (err) {
    console.error(err);
    error.value = "Unable to load weather data right now.";
  } finally {
    loading.value = false;
  }
};

onMounted(loadWeather);
</script>

<style scoped>
.current-section {
  padding: 18px 14px 8px;
  background: linear-gradient(135deg, #0b1a2f 0%, #0f2744 60%, #132f55 100%);
}

.page-content {
  --background: #0b1a2f;
  background: linear-gradient(180deg, #0b1a2f 0%, #0d223c 40%, #0f2b4d 100%);
}

.current-card {
  position: relative;
  color: #e9f1ff;
  padding: 18px 16px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.card-fog {
  position: absolute;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.14),
    transparent 60%
  );
  filter: blur(40px);
  opacity: 0.45;
}

.fog-a {
  width: 200px;
  height: 140px;
  top: -40px;
  right: -30px;
}

.fog-b {
  width: 240px;
  height: 160px;
  bottom: -60px;
  left: -70px;
}

.current-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.current-label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.current-title {
  margin: 4px 0 6px;
  font-size: 22px;
}

.current-sub {
  margin: 0;
  font-size: 14px;
  opacity: 0.85;
}

.hero-icon {
  font-size: 64px;
  color: #b9d5ff;
  filter: drop-shadow(0 12px 18px rgba(0, 0, 0, 0.25));
}

.current-temp {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 10px 0 4px;
}

.temp-main {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.temp-unit {
  font-size: 18px;
  opacity: 0.85;
}

.temp-feels {
  font-size: 16px;
  opacity: 0.75;
}

.current-conditions {
  margin: 2px 0 14px;
  opacity: 0.82;
  font-size: 14px;
}

.current-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.detail {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 10px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.detail ion-icon {
  font-size: 20px;
  color: #b9d5ff;
  margin-bottom: 6px;
}

.detail-value {
  font-weight: 700;
  color: #ffffff;
}

.detail-label {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.75;
  letter-spacing: 0.01em;
}

.state {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  color: #475569;
}

.state-light {
  color: #e9f1ff;
}

.hourly-card .state {
  color: #c8d9f5;
}

.hourly-card .state ion-spinner {
  --color: #d8e6ff;
}

.state-light ion-spinner {
  --color: #ffffff;
}

ion-card {
  margin: 16px 12px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.06);
  border-radius: 16px;
}

.hourly-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.45);
  color: #e9f1ff;
  backdrop-filter: blur(8px);
}

.hourly-card ion-card-title,
.hourly-card ion-card-subtitle {
  color: #d8e6ff;
}

.hourly-card ion-card-content {
  color: #e9f1ff;
}

.list-header {
  --background: transparent;
  font-weight: 700;
  color: #c8d9f5;
}

.time {
  font-weight: 700;
  color: #e9f1ff;
}

.date {
  font-size: 13px;
  color: #9fb7d6;
}

.temp {
  text-align: right;
  min-width: 80px;
  color: #e9f1ff;
  font-weight: 600;
}

.hourly-card ion-item {
  --background: transparent;
  --color: #e9f1ff;
  --border-color: rgba(255, 255, 255, 0.06);
}

.hourly-card ion-item::part(native) {
  background: transparent;
}

.hourly-card ion-list {
  background: transparent;
}

.hourly-card ion-item:last-of-type {
  --border-style: none;
}
</style>
