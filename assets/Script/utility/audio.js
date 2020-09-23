/**最小音量 */
let volume_min = 0;

/**最大音量 */
let volume_max = 1.0;

/**默认背景音乐的音量 */
let bgm_volume = 1.0;

/**默认音效的音量 */
let snd_volume = 1.0;

/**背景音频id，初始为-1，代表无背景音乐 */
let bgm_audio_id = -1;
let bgm_audio_url = null;

/**
 * 音频初始化
 */
function init() {
  set_bmg_volume(cc.durian.storage.data.volume_bgm);
  set_sound_volume(cc.durian.storage.data.volume_snd);
}

/**
 * 播放音效
 * @param {string} url 音效资源地址
 */
function play_sound(url) {
  if (snd_volume <= 0) return;
  cc.durian.c_statics.load(url, cc.AudioClip, (clip) => {
    cc.audioEngine.play(clip, false, snd_volume);
  });
}

/**
 * 播放背景音乐
 * @param {string} url 背景音乐资源地址
 */
function play_bgm(url) {
  if (bgm_audio_url === url) return;
  stop_bgm();
  if (bgm_volume <= 0) return;
  cc.durian.c_statics.load(url, cc.AudioClip, (clip) => {
    bgm_audio_url = url;
    bgm_audio_id = cc.audioEngine.play(clip, true, bgm_volume);
  });
}

/**
 * 暂停背景音乐
 */
function stop_bgm() {
  if(bgm_audio_id >= 0) {
    cc.audioEngine.stop(bgm_audio_id);
    bgm_audio_url = null;
  }
}

/**
 * 获得背景音乐的音量
 * @return {number} 音量
 */
function get_bgm_volume() {
  return bgm_volume;
}

/**
 * 设置背景音乐音量
 * @param {number} volume 音量
 */
function set_bmg_volume(volume) {
  bgm_volume = Math.min(volume_max, Math.max(volume_min, volume));
  cc.durian.storage.data.volume_bgm = bgm_volume;
  bgm_audio_id >= 0 && cc.audioEngine.setVolume(bgm_audio_id, bgm_volume);
}

/**
 * 获得音效的音量
 * @return {number} 音量
 */
function get_sound_volume() {
  return snd_volume;
}

/**
 * 设置音效音量
 * @param {number} volume 音量
 */
function set_sound_volume(volume) {
  snd_volume = Math.min(volume_max, Math.max(volume_min, volume));
  cc.durian.storage.data.volume_snd, snd_volume;
}

/**
 * 暂停所有音频
 */
function pause_all() {
  cc.audioEngine.pauseAll();
}

/**
 * 恢复所有音频
 */
function resume_all() {
  cc.audioEngine.resumeAll();
}

/**
 * 音频管理器
 */
export default {
  init,
  play_sound,
  play_bgm,
  stop_bgm,
  get_bgm_volume,
  set_bmg_volume,
  get_sound_volume,
  set_sound_volume,
  pause_all,
  resume_all
};
