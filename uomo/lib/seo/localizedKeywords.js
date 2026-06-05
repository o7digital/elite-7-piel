const LOCAL_MARKET_SUFFIX = "Mexico CDMX";
const LOCAL_MARKET_PATTERN = /\b(m[eé]xico|mexico|cdmx)\b/i;

export function localizeKeyword(keyword = "") {
  return LOCAL_MARKET_PATTERN.test(keyword)
    ? keyword
    : `${keyword} ${LOCAL_MARKET_SUFFIX}`;
}

export function localizeKeywords(keywords = []) {
  return keywords.map(localizeKeyword);
}
