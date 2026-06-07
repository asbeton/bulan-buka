# Saleh

> Multi-məzhəb namaz vaxtları — iOS + Android.
> *Vaxtında, sakitcə.*

## Stack

- **Expo SDK 52** + React Native 0.76 + Hermes + New Architecture
- **TypeScript** strict mode
- **expo-router** (file-based routing)
- **adhan** — namaz vaxtı hesablama (offline, MIT)
- **expo-notifications** — lokal bildiriş (7 gün öncədən planlaşdırma)
- **expo-location** — GPS + reverse geocoding
- **i18n-js + expo-localization** — AZ / EN / RU
- **AsyncStorage** — tənzimləmə yaddaşı

## Qovluq strukturu

```
saleh/
├── app/                  # expo-router screens
│   ├── _layout.tsx       # root layout (theme + settings provider)
│   ├── index.tsx         # əsas ekran (namaz vaxtları)
│   └── settings.tsx      # tənzimləmələr modalı
├── src/
│   ├── components/       # Brand, LocationHeader, NextPrayerHero, PrayerList, DateFooter
│   ├── data/             # methods.ts, cities.ts
│   ├── hooks/            # useSettings, usePrayerTimes
│   ├── i18n/             # az.json, en.json, ru.json, index.ts
│   ├── lib/              # prayer, notifications, hijri, location, storage
│   ├── theme/            # palette (dawn/dusk), ThemeProvider
│   └── types/            # Madhab, Method, PrayerKey
├── assets/               # icon.png, splash.png, adaptive-icon.png (Faza 1: placeholder)
├── scripts/              # apply.sh, rollback.sh
├── app.json
├── eas.json
├── package.json
└── tsconfig.json
```

## Quraşdırma

```bash
# 1. Asılılıqları yüklə
npm install

# 2. Asset şəkillərini yerləşdir (Faza 1 üçün placeholder işləyir)
# /assets/icon.png            (1024×1024)
# /assets/splash.png          (1284×2778)
# /assets/adaptive-icon.png   (1024×1024)
# /assets/notification-icon.png (96×96, monochrome)

# 3. Development server-i başlat
npm start

# 4. Simulator/emulator-da aç
npm run ios     # macOS + Xcode
npm run android # Android Studio + JDK 17
```

## Production build

```bash
npm install -g eas-cli
eas login
eas build:configure
npm run build:ios       # Apple Developer ($99/il)
npm run build:android   # Google Play Console ($25 birdəfəlik)
```

## Hesablama metodları (13)

Default: **Diyanet (Türkiyə)** — AZ üçün ən yaxın.

| Metod | Fəcr | İşa | Region |
|---|---|---|---|
| Diyanet | 18° | 17° | Türkiyə, CIS |
| MWL | 18° | 17° | Avropa, qlobal |
| ISNA | 15° | 15° | ABŞ, Kanada |
| Egyptian | 19.5° | 17.5° | Misir |
| Ümmül-Qura | 18.5° | +90 dəq | Səudiyyə |
| Karachi | 18° | 18° | Pakistan, Hindistan |
| Tehran | 17.7° | 14° | İran |
| Jafari | 16° | 14° | Şia |
| Singapore | 20° | 18° | SE Asia |
| Moonsighting | 18° | 18° | Qlobal |
| Dubai | 18.2° | 18.2° | BƏƏ |
| Kuwait | 18° | 17.5° | Kuveyt |
| Qatar | 18° | +90 dəq | Qatar |

## Məzhəblər (yalnız Əsr-ə təsir edir)

- **Hənəfi:** kölgə = 2× obyekt uzunluğu (factor 2)
- **Şafii / Maliki / Hənbəli / Cəfəri:** kölgə = obyekt uzunluğu (factor 1)

## Lokal bildirişlər

iOS-da maksimum **64 pending notification** limiti var. Saleh **7 gün × 5 namaz = 35** bildiriş planlaşdırır və app foreground-a gələndə yenilənir.

Sonradan backend push (Procumo stack: Express + BullMQ + Expo Push API) → **Faza 3**.

## Faza planı

- ✅ **Faza 1** — MVP: prayer times, madhab/method, GPS, local notifications, i18n, themes
- ⏳ **Faza 2** — Qibla kompası, aylıq view, audio adhan
- 📋 **Faza 3** — Backend, cloud sync, push
- 📋 **Faza 4** — Custom adhan upload, family/zikr tracking, mosque finder

## Lisenziya

Qərar verilməyib (open-source `Madrasah` modeli və ya commercial). Faza 2 sonu üçün.
