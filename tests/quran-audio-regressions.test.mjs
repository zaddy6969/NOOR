import assert from 'node:assert/strict';
import test from 'node:test';
import { GET } from '../app/api/quran/surah/[number]/route.ts';

const reciters = [
  ['alafasy', 7, 'mishari_al_afasy', 'Mishary Rashid Alafasy'],
  ['sudais', 3, 'abdurrahmaan_as_sudais', 'Abdurrahman as-Sudais'],
  ['husary', 6, 'khalil_al_husary', 'Mahmoud Khalil Al-Husary'],
  ['minshawi', 9, 'siddiq_minshawi', 'Muhammad Siddiq al-Minshawi'],
];
const textPayload = { data: [
  { number: 1, englishName: 'Al-Faatiha', edition: { identifier: 'quran-uthmani' }, ayahs: [{ numberInSurah: 1, text: 'Arabic' }] },
  { edition: { identifier: 'en.sahih' }, ayahs: [{ numberInSurah: 1, text: 'Translation' }] },
] };
const recording = path => `https://download.quranicaudio.com/qdc/${path}/murattal/1.mp3`;
const request = reciter => GET(new Request(`https://noor.test/api/quran/surah/1?reciter=${reciter}`), { params: Promise.resolve({ number: '1' }) });

test('all four selected voices use their own chapter recording and matching timings', async t => {
  const urls = new Set();
  for (const [id, providerId, path, label] of reciters) {
    t.mock.method(globalThis, 'fetch', async url => {
      if (url.includes('alquran.cloud')) return Response.json(textPayload);
      assert.ok(url.includes(`/reciters/${providerId}/audio_files?chapter=1&segments=true`));
      return Response.json({ audio_files: [{ chapter_id: 1, audio_url: recording(path), duration: 48000,
        verse_timings: [{ verse_key: '1:1', timestamp_from: 0, timestamp_to: 5220, duration: -5220 }] }] });
    });
    const response = await request(id);
    assert.equal(response.status, 200);
    const { surah } = await response.json();
    assert.equal(surah.audio.reciterId, id);
    assert.equal(surah.audio.reciterName, label);
    assert.equal(surah.audio.src, recording(path));
    assert.deepEqual(surah.audio.verseTimings, [{ number: 1, from: 0, to: 5220, duration: 5220 }]);
    urls.add(surah.audio.src);
    t.mock.restoreAll();
  }
  assert.equal(urls.size, 4);
});

test('timing outages and malformed responses retain text and the selected voice', async t => {
  for (const outcome of ['offline', 'malformed', 'wrong-recording', 'wrong-chapter']) {
    t.mock.method(globalThis, 'fetch', async url => {
      if (url.includes('alquran.cloud')) return Response.json(textPayload);
      if (outcome === 'offline') throw new Error('Provider unavailable');
      if (outcome === 'malformed') return new Response('not JSON');
      return Response.json({ audio_files: [{ chapter_id: outcome === 'wrong-chapter' ? 2 : 1,
        audio_url: recording(outcome === 'wrong-recording' ? 'mishari_al_afasy' : 'siddiq_minshawi'),
        verse_timings: [{ verse_key: '1:1', timestamp_from: 0, timestamp_to: 6000 }] }] });
    });
    const response = await request('minshawi');
    assert.equal(response.status, 200);
    const { surah } = await response.json();
    assert.equal(surah.ayahs[0].arabic, 'Arabic');
    assert.equal(surah.audio.src, recording('siddiq_minshawi'));
    assert.equal(surah.audio.reciterId, 'minshawi');
    assert.deepEqual(surah.audio.verseTimings, []);
    t.mock.restoreAll();
  }
});
