# 📱 TaskMaster Pro Native

React Native ile geliştirilmiş native mobil uygulama.

## ✨ Özellikler

- 🎯 **Native Görev Yönetimi** - iOS ve Android için optimize
- 📝 **Mobil Not Alma** - Touch-friendly arayüz
- 🍅 **Pomodoro Timer** - Native timer ve bildirimler
- 📊 **İlerleme Takibi** - Native charts ve istatistikler
- 🔄 **AsyncStorage** - Offline veri depolama
- 🎨 **Material Design** - React Native Paper UI

## 🚀 Kurulum

### Ön Gereksinimler

1. **Node.js 18+**
2. **React Native CLI**
3. **Android Studio** (Android için)
4. **Xcode** (iOS için)

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
```bash
cd TaskMasterProNative
npm install
```

2. **iOS için (Mac):**
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

3. **Android için:**
```bash
npx react-native run-android
```

## 📱 Platform Gereksinimleri

### Android
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 34 (Android 14)
- **Java:** 17+
- **Gradle:** 8.0+

### iOS
- **Min iOS:** 13.0
- **Xcode:** 14+
- **Swift:** 5.0+

## 🛠️ Kullanılan Teknolojiler

### Core
- **React Native 0.80.2**
- **TypeScript**
- **React 19**

### State Management
- **Redux Toolkit**
- **AsyncStorage**

### UI/UX
- **React Native Paper**
- **React Navigation 6**
- **Vector Icons**

### Native Features
- **Safe Area Context**
- **Gesture Handler**
- **AsyncStorage**

## 📁 Proje Yapısı

```
src/
├── components/         # Reusable components
├── screens/           # App screens
│   ├── TasksScreen.tsx
│   ├── NotesScreen.tsx
│   ├── CalendarScreen.tsx
│   ├── PomodoroScreen.tsx
│   ├── ProgressScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/        # Navigation setup
├── store/            # Redux store
│   └── slices/       # Redux slices
├── types/            # TypeScript types
└── utils/            # Utility functions
    └── storage.ts    # AsyncStorage helpers
```

## 🎮 Demo Verileri

Uygulama ilk açılışta demo verilerle gelir:

- ✅ **Sample Todo:** "TaskMaster Pro'ya hoş geldiniz!"
- 📝 **Sample Note:** "İlk Notum"
- 🏷️ **Categories:** Genel, İş, Kişisel, Alışveriş

## 📊 Özellik Detayları

### Görev Yönetimi
- ✅ Touch-friendly task list
- ✅ Swipe gestures
- ✅ Priority indicators
- ✅ Status management
- ✅ Category filtering

### Not Sistemi
- ✅ Native text editor
- ✅ Tag system
- ✅ Search functionality
- ✅ Grid/List view toggle

### Pomodoro Timer
- ✅ Native countdown timer
- ✅ Background timer support
- ✅ Sound notifications
- ✅ Session tracking

### İlerleme Takibi
- ✅ Native progress bars
- ✅ Statistics dashboard
- ✅ Achievement tracking
- ✅ Weekly/Monthly reports

## 🔧 Development

### Debug Mode
```bash
npx react-native start
npx react-native run-android --mode debug
```

### Release Build
```bash
npx react-native run-android --mode release
```

### Debugging
- **Flipper** - Native debugging
- **Metro Bundler** - JS debugging
- **React DevTools** - Component debugging

## 📱 Platform-Specific Features

### Android
- ✅ Material Design 3
- ✅ Android back button handling
- ✅ Adaptive icons
- ✅ Android notifications

### iOS
- ✅ iOS design guidelines
- ✅ Safe area support
- ✅ iOS-specific navigation
- ✅ iOS notifications

## 🚧 TODO Features

- [ ] Push notifications
- [ ] Background sync
- [ ] Widget support
- [ ] Dark theme
- [ ] Biometric authentication
- [ ] Cloud sync
- [ ] Export/Import data

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npx react-native start --reset-cache
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..
```

### iOS Build Issues
```bash
cd ios && xcodebuild clean && cd ..
```

## 📞 Support

- **GitHub Issues:** [Report bugs](https://github.com/your-repo/issues)
- **Email:** support@taskmaster.com

---

**TaskMaster Pro Native** - Native mobil üretkenlik uygulaması! 🚀📱