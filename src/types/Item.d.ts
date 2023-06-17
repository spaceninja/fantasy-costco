export interface Item {
  id: string;
  name: string;
  category: string;
  categoryNotes?: string;
  rarity: string;
  description: string;
  source?: string;
  restrictions?: string;
  attunement: boolean;
  stocked: boolean;
  purchased: boolean;
  gachapon: boolean;
}
