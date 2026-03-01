

/**
 * 引数に日本語が含まれるかを判定する
 *
 * @param {string} target
 * @return {boolean}
 */
const hasJapanese = (target: any) => {
  // ひらがな
  if (/\p{Script=Hiragana}/u.test(target)) return true;
  // カタカナ
  if (/\p{Script=Katakana}/u.test(target)) return true;
  // 漢字
  if (/\p{Script=Han}/u.test(target)) return true;
  // 約物・記号など
  if (/\p{Script=Common}/u.test(target)) return true;

  return false;
};

console.log(hasJapanese("abc"))