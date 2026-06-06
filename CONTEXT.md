# CONTEXT.md — Состояние проекта Wavepeak

## Что такое Wavepeak
Платформа с бесплатными онлайн аудио инструментами.
Целевой рынок: англоязычный (EN), монетизация через AdSense + Freemium.
Сайт: https://wavepeak-iota.vercel.app
Репо: https://github.com/backinblaaaaaaack-sys/wavepeak

## Стек
- Next.js App Router + TypeScript + Tailwind CSS
- shadcn/ui — основная библиотека компонентов
- FFmpeg.wasm — обработка аудио в браузере без сервера
- Vercel — хостинг (автодеплой из GitHub)

---

## Принятые решения

### Архитектура конвертера
Один универсальный компонент AudioConverter с пропсами fromFormat и toFormat.
Каждый URL — отдельная SEO страница с предвыбранными форматами.
Пример: /flac-to-mp3 → предвыбрано FLAC→MP3, но дропдауны открыты — можно поменять.

### Поддерживаемые форматы
MP3, WAV, FLAC, M4A, AAC, OGG, OPUS

### Quality selector
Показывается только когда формат To = MP3 или AAC.
Для WAV, FLAC, OGG, OPUS — скрыт (они lossless).

### UX флоу (общий для всех инструментов)
1. Пустой экран — большая зона drag & drop
2. Файл загружен — зона сжимается в компактную строку с именем файла и кнопкой ×
3. Обработка — прогресс на кнопке
4. Готово — блок с галочкой, имя файла, кнопка Download, ссылка "... another file"

### Архитектура AudioCutter
Компонент src/components/audio-cutter/AudioCutter.tsx.
- Waveform: Web Audio API (AudioContext.decodeAudioData) → extractPeaks → canvas
- Два range-слайдера (Start / End) с accent-violet-500
- Подсветка выбранного диапазона на canvas фиолетовым (#7c3aed)
- FFmpeg: -ss [start] -to [end] -i input output (ре-энкод для точности)
- Выходной файл: то же расширение + суффикс _cut

---

## Что сделано

### Готово ✅
- Next.js проект создан, задеплоен на Vercel
- shadcn/ui установлен
- Главная страница — сетка карточек всех инструментов (все кликабельны)
- /audio-converter — рабочий универсальный конвертер
- /audio-cutter — обрезка аудио с waveform, drag-ручками и плеером
- SEO metadata для всех страниц
- Страницы с предвыбранными форматами:
  - /flac-to-mp3
  - /wav-to-mp3
  - /m4a-to-mp3
  - /ogg-to-mp3
  - /mp3-to-wav
  - /mp3-to-flac

### Заглушки (нужно сделать) 🔲
- /ringtone-maker — создание рингтонов (можно переиспользовать AudioCutter)
- /volume-booster — усилитель громкости
- /audio-merger — склейка файлов
- /audio-speed-changer — изменение скорости

---

## Следующий шаг
/volume-booster или /audio-merger
