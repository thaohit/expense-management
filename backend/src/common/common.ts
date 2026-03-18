/**
 * 引数に日本語が含まれるかを判定する
 *
 * @param target any
 * @return boolean
 */
export function hasJapanese(target: any):boolean
{
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

/**
 * 英語数字・文字チェック
 * * [0~9, a~Z]
 * @param target 
 * @returns 
 */
export function checkString(target: any): boolean 
{
    const regex = /^[0-9a-zA-Z]+$/;
    return regex.test(target);
}

/**
 * 英語数字チェック
 * * [0~9]
 * @param target 
 * @returns 
 */
export function checkNumber(target: any): boolean
{

  const numberFormat = /^[0-9]+$/;
  return numberFormat.test(target);

}