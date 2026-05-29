// 한국어 받침 여부로 을/를 조사 반환
// 유니코드 완성형 한글: 0xAC00 ~ 0xD7A3, (코드 - 0xAC00) % 28 === 0 이면 받침 없음
export function eulReul(word) {
  if (!word) return '을(를)';
  const last = word[word.length - 1];
  const code = last.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return '을(를)';
  return (code - 0xAC00) % 28 === 0 ? '를' : '을';
}

// 아이템 티어별 힌트 문장 생성
export const TIER_HINT = {
  평범: (name) => `${name}${eulReul(name)} 만들 수 있을 것 같다.`,
  비범: (name) => `${name}${eulReul(name)} 제작하면 꽤 쓸만할 것 같다.`,
  희귀: (name) => `${name}${eulReul(name)} 구하기 쉽지 않겠지만, 만들 수 있다면 강력할 것이다.`,
  유일: (name) => `전설 속의 ${name}${eulReul(name)} 재현할 수 있다면 무적이 될 것이다.`,
};
