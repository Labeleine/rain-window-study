import { initTypingEffects } from './typing.js';
import { initCursorEffects } from './cursor.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌧️ 雨窗阁 v2.0 启动中...');
  
  initTypingEffects();
  initCursorEffects();
  
  console.log('✅ 新功能模块已加载');
});