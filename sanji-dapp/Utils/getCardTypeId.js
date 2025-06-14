const CARD_TYPES = {
  "Sanji's Tactical Whistle": 0,
  "Sam Altman's First Code": 1
};

export function getCardTypeId(cardName) {
  if (!(cardName in CARD_TYPES)) {
    throw new Error(`Unknown card name: ${cardName}`);
  }
  return CARD_TYPES[cardName];
}
