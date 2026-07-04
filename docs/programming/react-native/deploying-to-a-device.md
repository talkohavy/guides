# Deploying to a Device (Release Build)

This guide covers how to take an **Expo** React Native app and get it onto a real phone once you're ready for a release — either by **sideloading** a build directly onto a physical device for final testing, or by **submitting** it to the App Store / Play Store.

Both flows are built on top of **EAS** (Expo Application Services): `eas build` creates the binary, and `eas submit` uploads it to a store.

## - Prerequisites

Install the EAS CLI and log in to your Expo account:

```bash
npm install -g eas-cli
eas login
```

If your project hasn't been configured for EAS yet, run this once from the project root:

```bash
eas build:configure
```

This generates an **eas.json** file next to your `package.json`, with three default build profiles: `development`, `preview` and `production`.

```json
{
  "cli": {
    "version": ">=13.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

:::info
The `preview` profile (`"distribution": "internal"`) is the one you'll use for **sideloading**. The `production` profile is the one you'll use for **store submission** — it can't be installed directly on a device, it must go through the App Store / Play Store.
:::

<br/>

## - Option A: Sideload a build directly to your phone

Use this when you just want to hand-test the final, production-like JS bundle on a real device before submitting it to the store.

### Android

No extra setup is required — any physical Android device can install an APK.

```bash
eas build --platform android --profile preview
```

When the build finishes, EAS prints a link and a QR code. Options to get it on the phone:

- Scan the QR code with the phone's camera — it opens the Expo build page, from which you can download and install the APK directly.
- Or download the `.apk` from the build page on your computer and transfer/install it with:

  ```bash
  adb install path/to/your-app.apk
  ```

:::warning
The Android device needs "Install unknown apps" permission enabled for the browser/app you use to download the APK, since it isn't coming from the Play Store.
:::

### iOS

iOS requires **ad hoc provisioning**: every physical device that will install the build must have its UDID registered with Apple *before* the build is created.

1. Register the device (do this once per device):

   ```bash
   eas device:create
   ```

   This prints a link/QR code — open it **on the iPhone itself** and follow the prompts. It installs a small profile that reports the device's UDID back to EAS.

2. Build with the `preview` profile:

   ```bash
   eas build --platform ios --profile preview
   ```

   EAS automatically generates (or reuses) an ad hoc provisioning profile that includes every device you've registered with `eas device:create`.

3. On the registered iPhone, open the link/QR code from the finished build. Safari will prompt to install the app directly — no App Store or TestFlight needed.

:::warning
If you register a new device with `eas device:create` *after* a build already exists, you need to create a **new build** for that device to be included — existing builds only work for devices that were registered at build time.
:::

<br/>

## - Option B: Submit to the App Store / Play Store

Once sideloaded testing looks good, build with the `production` profile and submit with `eas submit`.

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

Production builds output an `.aab` (Android) and an `.ipa` (iOS) — the formats each store expects. They are **not** directly installable on a device.

### Android (Google Play)

1. One-time setup: create a Google Service Account with access to your app in the Play Console, download its JSON key, and reference it in `eas.json`:

   ```json
   {
     "submit": {
       "production": {
         "android": {
           "serviceAccountKeyPath": "./google-service-account.json",
           "track": "internal"
         }
       }
     }
   }
   ```

   :::info
   The very first release of an app usually has to be uploaded manually through the Play Console at least once, since Google requires an app listing to exist before automated submission works.
   :::

2. Submit the build:

   ```bash
   eas submit --platform android --latest
   ```

3. Promote the release from the chosen `track` (`internal` → `alpha`/`beta` → `production`) inside the Play Console when you're ready to widen the rollout.

### iOS (App Store)

1. One-time setup: make sure you have an **App Store Connect API Key**, or be ready to sign in interactively with your Apple ID during submission. EAS will prompt for whichever it needs.

2. Submit the build:

   ```bash
   eas submit --platform ios --latest
   ```

3. The build first lands in **TestFlight**. From App Store Connect you can:
   - Distribute it to internal/external TestFlight testers for one more round of real-world testing, or
   - Submit it for App Review to go live on the App Store.

<br/>

## - Quick reference

| Goal                                   | Command                                         | Profile      |
| --------------------------------------- | ------------------------------------------------ | ------------ |
| Install directly on an Android phone    | `eas build --platform android --profile preview` | `preview`    |
| Install directly on an iPhone           | `eas build --platform ios --profile preview`     | `preview`    |
| Publish to Google Play                  | `eas build/submit --platform android --profile production` | `production` |
| Publish to the App Store                | `eas build/submit --platform ios --profile production`     | `production` |
