import type { IHandlePriceChange } from '#/interfaces/helpers.interface.js';
import type { ISpecificCoinRequest, ITopCoin } from '#/interfaces/requests.interface.js';

export const escapeMarkdown = (text: string | undefined | null): string => {
  if (text === undefined || text === null) {
    return '';
  }
  return text.toString().replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
};

export const handlePriceChange = (
  coinInfo: ITopCoin | ISpecificCoinRequest,
): IHandlePriceChange => {
  const priceChange = coinInfo.price_change_percentage_24h || 0;
  const priceChangeIcon = priceChange >= 0 ? '🟢' : '🔴';

  return {
    priceChange,
    priceChangeIcon,
  };
};
