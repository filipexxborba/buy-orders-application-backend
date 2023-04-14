import { Item } from 'src/@types/Item.type';

export const getTotalPrice = (items: Item[]) => {
  let total = 0;
  items.map((item: Item) => (total += item.price ?? 0));
  return total;
};
