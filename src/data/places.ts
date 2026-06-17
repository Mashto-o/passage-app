// ── Image imports ──────────────────────────────────────────────────────────

import shelterAccessibleCover      from '../assets/images/places/shelter_accessible_cover.jpg'
import shelterAccessibleInside     from '../assets/images/places/shelter_accessible_inside.jpg'
import shelterInaccessibleCover    from '../assets/images/places/shelter_inaccessible_cover.jpg'
import shelterInaccessibleInside   from '../assets/images/places/shelter_inaccessible_inside.jpg'

import hospitalAccessibleCover     from '../assets/images/places/hospital_accessible_cover.jpg'
import hospitalAccessibleToilet    from '../assets/images/places/hospital_accessible_toilet.jpg'
import hospitalAccessibleInside    from '../assets/images/places/hospital_accessible_inside.jpg'
import hospitalInaccessibleCover   from '../assets/images/places/hospital_inaccessible_cover.jpg'
import hospitalInaccessibleToilet  from '../assets/images/places/hospital_inaccessible_toilet.jpg'
import hospitalInaccessibleInside  from '../assets/images/places/hospital_inaccessible_inside.jpg'

import restaurantAccessibleCover     from '../assets/images/places/restaurant_accessible_cover.jpg'
import restaurantAccessibleToilet    from '../assets/images/places/restaurant_accessible_toilet.jpg'
import restaurantAccessibleInside    from '../assets/images/places/restaurant_accessible_inside.jpg'
import restaurantInaccessibleCover   from '../assets/images/places/restaurant_inaccessible_cover.jpg'
import restaurantInaccessibleToilet  from '../assets/images/places/restaurant_inaccessible_toilet.jpg'
import restaurantInaccessibleInside  from '../assets/images/places/restaurant_inaccessible_inside.jpg'

import landmarkAccessibleCover     from '../assets/images/places/landmark_accessible_cover.jpg'
import landmarkAccessibleToilet    from '../assets/images/places/landmark_accessible_toilet.jpg'
import landmarkAccessibleInside    from '../assets/images/places/landmark_accessible_inside.jpg'
import landmarkInaccessibleCover   from '../assets/images/places/landmark_inaccessible_cover.jpg'
import landmarkInaccessibleToilet  from '../assets/images/places/landmark_inaccessible_toilet.jpg'
import landmarkInaccessibleInside  from '../assets/images/places/landmark_inaccessible_inside.jpg'

import supermarketAccessibleCover    from '../assets/images/places/supermarket_accessible_cover.jpg'
import supermarketAccessibleInside   from '../assets/images/places/supermarket_accessible_inside.jpg'
import supermarketInaccessibleCover  from '../assets/images/places/supermarket_inaccessible_cover.jpg'
import supermarketInaccessibleInside from '../assets/images/places/supermarket_inaccessible_inside.jpg'

import parkAccessibleCover     from '../assets/images/places/park_accessible_cover.jpg'
import parkAccessibleToilet    from '../assets/images/places/park_accessible_toilet.jpg'
import parkInaccessibleCover   from '../assets/images/places/park_inaccessible_cover.jpg'
import parkInaccessibleToilet  from '../assets/images/places/park_inaccessible_toilet.jpg'

import bankAccessibleCover     from '../assets/images/places/bank_accessible_cover.jpg'
import bankAccessibleInside    from '../assets/images/places/bank_accessible_inside.jpg'
import bankInaccessibleCover   from '../assets/images/places/bank_inaccessible_cover.jpg'
import bankInaccessibleInside  from '../assets/images/places/bank_inaccessible_inside.jpg'

import toiletAccessibleCover    from '../assets/images/places/toilet_accessible_cover.jpg'
import toiletAccessibleToilet   from '../assets/images/places/toilet_accessible_toilet.jpg'
import toiletInaccessibleCover  from '../assets/images/places/toilet_inaccessible_cover.jpg'
import toiletInaccessibleToilet from '../assets/images/places/toilet_inaccessible_toilet.jpg'

import pharmacyAccessibleCover    from '../assets/images/places/pharmacy_accessible_cover.jpg'
import pharmacyAccessibleInside   from '../assets/images/places/pharmacy_accessible_inside.jpg'
import pharmacyInaccessibleCover  from '../assets/images/places/pharmacy_inaccessible_cover.jpg'
import pharmacyInaccessibleInside from '../assets/images/places/pharmacy_inaccessible_inside.jpg'

// ── Types ──────────────────────────────────────────────────────────────────

export type PlaceCategory =
  | 'shelter' | 'hospital' | 'restaurant' | 'landmark'
  | 'supermarket' | 'park' | 'bank' | 'toilet' | 'pharmacy'

export type PlaceFeatures = {
  entrance: boolean
  toilet:   boolean
  inside:   boolean
}

export interface PlacePhoto {
  src:         string
  isVerified:  boolean
  updatedAt:   string
  updatedAtUk: string
}

export interface PlaceSection {
  accessibilityStatus: 'accessible' | 'inaccessible' | 'partial' | 'unknown'
  photos:              PlacePhoto[]
}

export type PlaceSections = {
  entrance?: PlaceSection
  toilet?:   PlaceSection
  inside?:   PlaceSection
}

export type Place = {
  id:                string
  name:              string
  nameUk:            string
  address:           string
  addressUk:         string
  category:          PlaceCategory
  coordinates:       [number, number]
  accessibilityScore: number
  barrierCount:      number
  distanceM:         number
  verifiedAt:        Date
  isLiftDependent:   boolean
  featuresOverride?: Partial<PlaceFeatures>
  sections:          PlaceSections
}

// ── Sort types ─────────────────────────────────────────────────────────────

export type SortKey = 'most-accessible' | 'nearest' | 'recently-verified'
export const SORT_KEYS: SortKey[] = ['most-accessible', 'nearest', 'recently-verified']

export function sortPlaces(places: Place[], sortKey: SortKey): Place[] {
  const sorted = [...places]
  switch (sortKey) {
    case 'most-accessible':
      return sorted.sort((a, b) => b.accessibilityScore - a.accessibilityScore)
    case 'nearest':
      return sorted.sort((a, b) => a.distanceM - b.distanceM)
    case 'recently-verified':
      return sorted.sort((a, b) => b.verifiedAt.getTime() - a.verifiedAt.getTime())
    default:
      return sorted
  }
}

// ── Section image lookups ──────────────────────────────────────────────────

const COVER_IMG: Record<PlaceCategory, { accessible: string; inaccessible: string }> = {
  shelter:    { accessible: shelterAccessibleCover,    inaccessible: shelterInaccessibleCover    },
  hospital:   { accessible: hospitalAccessibleCover,   inaccessible: hospitalInaccessibleCover   },
  restaurant: { accessible: restaurantAccessibleCover, inaccessible: restaurantInaccessibleCover },
  landmark:   { accessible: landmarkAccessibleCover,   inaccessible: landmarkInaccessibleCover   },
  supermarket:{ accessible: supermarketAccessibleCover,inaccessible: supermarketInaccessibleCover},
  park:       { accessible: parkAccessibleCover,       inaccessible: parkInaccessibleCover       },
  bank:       { accessible: bankAccessibleCover,       inaccessible: bankInaccessibleCover       },
  toilet:     { accessible: toiletAccessibleCover,     inaccessible: toiletInaccessibleCover     },
  pharmacy:   { accessible: pharmacyAccessibleCover,   inaccessible: pharmacyInaccessibleCover   },
}

const TOILET_IMG: Partial<Record<PlaceCategory, { accessible: string; inaccessible: string }>> = {
  hospital:   { accessible: hospitalAccessibleToilet,   inaccessible: hospitalInaccessibleToilet   },
  restaurant: { accessible: restaurantAccessibleToilet, inaccessible: restaurantInaccessibleToilet },
  landmark:   { accessible: landmarkAccessibleToilet,   inaccessible: landmarkInaccessibleToilet   },
  park:       { accessible: parkAccessibleToilet,       inaccessible: parkInaccessibleToilet       },
  toilet:     { accessible: toiletAccessibleToilet,     inaccessible: toiletInaccessibleToilet     },
}

const INSIDE_IMG: Partial<Record<PlaceCategory, { accessible: string; inaccessible: string }>> = {
  shelter:    { accessible: shelterAccessibleInside,    inaccessible: shelterInaccessibleInside    },
  hospital:   { accessible: hospitalAccessibleInside,   inaccessible: hospitalInaccessibleInside   },
  restaurant: { accessible: restaurantAccessibleInside, inaccessible: restaurantInaccessibleInside },
  landmark:   { accessible: landmarkAccessibleInside,   inaccessible: landmarkInaccessibleInside   },
  supermarket:{ accessible: supermarketAccessibleInside,inaccessible: supermarketInaccessibleInside},
  bank:       { accessible: bankAccessibleInside,       inaccessible: bankInaccessibleInside       },
  pharmacy:   { accessible: pharmacyAccessibleInside,   inaccessible: pharmacyInaccessibleInside   },
}

// ── Section builder ────────────────────────────────────────────────────────

function buildSections(category: PlaceCategory, score: number): PlaceSections {
  const tier:   'accessible' | 'inaccessible' = score >= 70 ? 'accessible' : 'inaccessible'
  const status: PlaceSection['accessibilityStatus'] = score >= 70 ? 'accessible' : 'inaccessible'

  const photo = (src: string): PlacePhoto => ({
    src,
    isVerified:  true,
    updatedAt:   '2 days ago',
    updatedAtUk: '2 дні тому',
  })

  const sections: PlaceSections = {
    entrance: { accessibilityStatus: status, photos: [photo(COVER_IMG[category][tier])] },
  }

  const toiletImgs = TOILET_IMG[category]
  if (toiletImgs) {
    sections.toilet = { accessibilityStatus: status, photos: [photo(toiletImgs[tier])] }
  }

  const insideImgs = INSIDE_IMG[category]
  if (insideImgs) {
    sections.inside = { accessibilityStatus: status, photos: [photo(insideImgs[tier])] }
  }

  return sections
}

// ── Place data ─────────────────────────────────────────────────────────────

type PlaceData = Omit<Place, 'sections'>

const PLACE_DATA: PlaceData[] = [
  // Shelters
  { id: 's1',  name: 'Shelter Maidan',                   nameUk: 'Укриття Майдан',                        address: 'Maidan Nezalezhnosti 1',          addressUk: 'Майдан Незалежності 1',              category: 'shelter',     coordinates: [30.5234, 50.4504], accessibilityScore: 80, barrierCount: 1, distanceM: 200,  verifiedAt: new Date('2026-06-05T18:00:00'), isLiftDependent: false },
  { id: 's2',  name: 'Shelter Lukyanivska',               nameUk: "Укриття Лук'янівська",                  address: 'vul. Oleny Telihy 3',             addressUk: 'вул. Олени Теліги 3',                category: 'shelter',     coordinates: [30.4986, 50.4612], accessibilityScore: 50, barrierCount: 3, distanceM: 2100, verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: false },
  { id: 's3',  name: 'Shelter Pechersk',                  nameUk: 'Укриття Печерськ',                      address: 'vul. Lavrska 15',                 addressUk: 'вул. Лаврська 15',                   category: 'shelter',     coordinates: [30.5574, 50.4338], accessibilityScore: 65, barrierCount: 2, distanceM: 1800, verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 's4',  name: 'Shelter Podil',                     nameUk: 'Укриття Поділ',                         address: 'vul. Sahaidachnoho 10',           addressUk: 'вул. Сагайдачного 10',               category: 'shelter',     coordinates: [30.5189, 50.4634], accessibilityScore: 72, barrierCount: 2, distanceM: 1500, verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 's5',  name: 'Shelter Obolon',                    nameUk: 'Укриття Оболонь',                       address: 'prosp. Obolonsky 1',              addressUk: 'просп. Оболонський 1',               category: 'shelter',     coordinates: [30.4978, 50.5012], accessibilityScore: 88, barrierCount: 0, distanceM: 3200, verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: false },
  { id: 's6',  name: 'Shelter Sviatoshyn',                nameUk: 'Укриття Святошин',                      address: 'vul. Peremohy 90',                addressUk: 'вул. Перемоги 90',                   category: 'shelter',     coordinates: [30.3912, 50.4567], accessibilityScore: 45, barrierCount: 4, distanceM: 4100, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Hospitals / Pharmacies
  { id: 'h1',  name: 'Pharmacy Liky',                     nameUk: 'Аптека Ліки',                           address: 'vul. Khreschyatyk 22',            addressUk: 'вул. Хрещатик 22',                   category: 'pharmacy',    coordinates: [30.5238, 50.4494], accessibilityScore: 90, barrierCount: 0, distanceM: 300,  verifiedAt: new Date('2026-06-04T09:00:00'), isLiftDependent: false },
  { id: 'h2',  name: 'Oleksandrivska Hospital',           nameUk: 'Олександрівська лікарня',               address: 'bulv. Tarasa Shevchenka 17',      addressUk: 'бульв. Тараса Шевченка 17',          category: 'hospital',    coordinates: [30.5106, 50.4478], accessibilityScore: 55, barrierCount: 4, distanceM: 1100, verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: true  },
  { id: 'h3',  name: 'Kyiv City Clinical Hospital 1',     nameUk: 'Київська міська клінічна лікарня №1',   address: 'vul. Heroyiv Dnipra 37',          addressUk: 'вул. Героїв Дніпра 37',              category: 'hospital',    coordinates: [30.4889, 50.5023], accessibilityScore: 62, barrierCount: 3, distanceM: 3500, verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: true  },
  { id: 'h4',  name: 'Pharmacy 911',                      nameUk: 'Аптека 911',                            address: 'vul. Baseyna 12',                 addressUk: 'вул. Басейна 12',                    category: 'pharmacy',    coordinates: [30.5201, 50.4445], accessibilityScore: 85, barrierCount: 1, distanceM: 800,  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'h5',  name: 'Dobrobut Clinic',                   nameUk: 'Клініка Добробут',                      address: 'vul. Velyka Vasylkivska 55',      addressUk: 'вул. Велика Васильківська 55',       category: 'hospital',    coordinates: [30.5178, 50.4356], accessibilityScore: 91, barrierCount: 0, distanceM: 1600, verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: true  },
  { id: 'h6',  name: 'Pharmacy D.S.',                     nameUk: 'Аптека Д.С.',                           address: 'prosp. Peremohy 12',              addressUk: 'просп. Перемоги 12',                 category: 'pharmacy',    coordinates: [30.4934, 50.4521], accessibilityScore: 70, barrierCount: 2, distanceM: 2000, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Restaurants / Cafés
  { id: 'r1',  name: 'Puzata Hata',                       nameUk: 'Пузата Хата',                           address: 'vul. Baseyna 5',                  addressUk: 'вул. Басейна 5',                     category: 'restaurant',  coordinates: [30.5189, 50.4432], accessibilityScore: 60, barrierCount: 3, distanceM: 800,  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'r2',  name: 'Veterano Pizza',                    nameUk: 'Ветерано Піца',                         address: 'vul. Horodetskoho 10',            addressUk: 'вул. Городецького 10',               category: 'restaurant',  coordinates: [30.5271, 50.4468], accessibilityScore: 75, barrierCount: 1, distanceM: 600,  verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 'r3',  name: 'Zhyva Kava',                        nameUk: 'Жива Кава',                             address: 'vul. Velyka Vasylkivska 45',      addressUk: 'вул. Велика Васильківська 45',       category: 'restaurant',  coordinates: [30.5223, 50.4385], accessibilityScore: 65, barrierCount: 2, distanceM: 1400, verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: false },
  { id: 'r4',  name: 'Kanapa Restaurant',                 nameUk: 'Ресторан Канапа',                       address: 'vul. Andriivsky Uzviz 19',        addressUk: 'вул. Андріївський узвіз 19',         category: 'restaurant',  coordinates: [30.5134, 50.4589], accessibilityScore: 42, barrierCount: 5, distanceM: 1900, verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: true  },
  { id: 'r5',  name: 'Pervak',                            nameUk: 'Первак',                                address: 'vul. Rohnidynska 2',              addressUk: 'вул. Рогнідинська 2',                category: 'restaurant',  coordinates: [30.5156, 50.4423], accessibilityScore: 78, barrierCount: 1, distanceM: 1000, verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'r6',  name: 'Spotykach',                         nameUk: 'Спотикач',                              address: 'vul. Volodymyrska 16',            addressUk: 'вул. Володимирська 16',              category: 'restaurant',  coordinates: [30.5145, 50.4534], accessibilityScore: 35, barrierCount: 6, distanceM: 1300, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Landmarks / Museums
  { id: 'l1',  name: 'Kyiv City Museum',                  nameUk: 'Київський міський музей',               address: 'vul. Khreschyatyk 15',            addressUk: 'вул. Хрещатик 15',                   category: 'landmark',    coordinates: [30.5214, 50.4501], accessibilityScore: 70, barrierCount: 2, distanceM: 500,  verifiedAt: new Date('2026-06-05T18:00:00'), isLiftDependent: false },
  { id: 'l2',  name: 'National Museum of History',        nameUk: 'Національний музей історії',            address: 'vul. Volodymyrska 2',             addressUk: 'вул. Володимирська 2',               category: 'landmark',    coordinates: [30.5136, 50.4547], accessibilityScore: 45, barrierCount: 5, distanceM: 1300, verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: true  },
  { id: 'l3',  name: 'Pinchuk Art Centre',                nameUk: 'Мистецький центр Пінчука',              address: 'vul. Velyka Vasylkivska 1',       addressUk: 'вул. Велика Васильківська 1',        category: 'landmark',    coordinates: [30.5241, 50.4447], accessibilityScore: 85, barrierCount: 1, distanceM: 900,  verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: true  },
  { id: 'l4',  name: 'Museum of Western & Oriental Art',  nameUk: 'Музей Західного та Східного мистецтва', address: 'vul. Tereshchenkivska 15',        addressUk: 'вул. Терещенківська 15',             category: 'landmark',    coordinates: [30.5123, 50.4456], accessibilityScore: 38, barrierCount: 6, distanceM: 1100, verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: true  },
  { id: 'l5',  name: 'Mystetskyi Arsenal',                nameUk: 'Мистецький арсенал',                    address: 'vul. Lavrska 10-12',              addressUk: 'вул. Лаврська 10-12',                category: 'landmark',    coordinates: [30.5534, 50.4367], accessibilityScore: 82, barrierCount: 1, distanceM: 2200, verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: true  },
  { id: 'l6',  name: 'National Art Museum',               nameUk: 'Національний художній музей',           address: 'vul. Hrushevskoho 6',             addressUk: 'вул. Грушевського 6',                category: 'landmark',    coordinates: [30.5312, 50.4478], accessibilityScore: 58, barrierCount: 3, distanceM: 1000, verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: true  },
  // Supermarkets
  { id: 'sm1', name: 'Silpo Khreschyatyk',                nameUk: 'Сільпо Хрещатик',                       address: 'vul. Khreschyatyk 44',            addressUk: 'вул. Хрещатик 44',                   category: 'supermarket', coordinates: [30.5198, 50.4471], accessibilityScore: 88, barrierCount: 0, distanceM: 700,  verifiedAt: new Date('2026-06-04T09:00:00'), isLiftDependent: true  },
  { id: 'sm2', name: 'Novus Lukyanivska',                  nameUk: "Новус Лук'янівська",                    address: 'vul. Turhenievska 38',            addressUk: 'вул. Тургенєвська 38',               category: 'supermarket', coordinates: [30.5012, 50.4598], accessibilityScore: 72, barrierCount: 2, distanceM: 1900, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 'sm3', name: 'ATB Podil',                          nameUk: 'АТБ Поділ',                             address: 'vul. Sahaidachnoho 25',           addressUk: 'вул. Сагайдачного 25',               category: 'supermarket', coordinates: [30.5201, 50.4645], accessibilityScore: 55, barrierCount: 3, distanceM: 2000, verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'sm4', name: 'Fora Pechersk',                      nameUk: 'Фора Печерськ',                         address: 'vul. Instytutska 18',             addressUk: 'вул. Інститутська 18',               category: 'supermarket', coordinates: [30.5389, 50.4423], accessibilityScore: 80, barrierCount: 1, distanceM: 1500, verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: true  },
  { id: 'sm5', name: 'Metro Cash & Carry',                 nameUk: 'Метро Cash & Carry',                    address: 'vul. Akademika Palladin 44',      addressUk: 'вул. Академіка Палладіна 44',        category: 'supermarket', coordinates: [30.4312, 50.4234], accessibilityScore: 91, barrierCount: 0, distanceM: 5100, verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'sm6', name: 'Velika Kyshenya',                    nameUk: 'Велика Кишеня',                         address: 'prosp. Peremohy 34',              addressUk: 'просп. Перемоги 34',                 category: 'supermarket', coordinates: [30.4756, 50.4512], accessibilityScore: 63, barrierCount: 3, distanceM: 2800, verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: true  },
  // Parks
  { id: 'p1',  name: 'Shevchenko Park',                    nameUk: 'Парк Шевченка',                         address: 'bulv. Tarasa Shevchenka 1',       addressUk: 'бульв. Тараса Шевченка 1',           category: 'park',        coordinates: [30.5134, 50.4453], accessibilityScore: 78, barrierCount: 2, distanceM: 1000, verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 'p2',  name: 'Mariinsky Park',                     nameUk: 'Маріїнський парк',                      address: 'vul. Hrushevskoho 5',             addressUk: 'вул. Грушевського 5',                category: 'park',        coordinates: [30.5385, 50.4489], accessibilityScore: 62, barrierCount: 3, distanceM: 1600, verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: false },
  { id: 'p3',  name: 'Hydropark',                          nameUk: 'Гідропарк',                             address: 'Hydropark Island',                addressUk: 'Острів Гідропарк',                   category: 'park',        coordinates: [30.5912, 50.4634], accessibilityScore: 48, barrierCount: 4, distanceM: 3800, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 'p4',  name: 'Feofania Park',                      nameUk: 'Парк Феофанія',                         address: 'vul. Akademika Zabolotnoho 21',   addressUk: 'вул. Академіка Заболотного 21',      category: 'park',        coordinates: [30.4823, 50.3934], accessibilityScore: 55, barrierCount: 3, distanceM: 6200, verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: false },
  { id: 'p5',  name: 'Syretsky Park',                      nameUk: 'Сирецький парк',                        address: 'vul. Syretska 1',                 addressUk: 'вул. Сирецька 1',                    category: 'park',        coordinates: [30.4923, 50.4812], accessibilityScore: 83, barrierCount: 1, distanceM: 2900, verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: false },
  { id: 'p6',  name: 'Babyn Yar Park',                     nameUk: 'Парк Бабин Яр',                         address: 'vul. Melnikova 44',               addressUk: 'вул. Мельникова 44',                 category: 'park',        coordinates: [30.4489, 50.4712], accessibilityScore: 70, barrierCount: 2, distanceM: 3500, verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: false },
  // Banks
  { id: 'b1',  name: 'PrivatBank Central',                 nameUk: 'ПриватБанк Центральний',                address: 'vul. Hrushevskoho 1d',            addressUk: 'вул. Грушевського 1д',               category: 'bank',        coordinates: [30.5301, 50.4512], accessibilityScore: 83, barrierCount: 1, distanceM: 400,  verifiedAt: new Date('2026-06-05T18:00:00'), isLiftDependent: false },
  { id: 'b2',  name: 'Oschadbank Maidan',                  nameUk: 'Ощадбанк Майдан',                       address: 'Maidan Nezalezhnosti 2',          addressUk: 'Майдан Незалежності 2',              category: 'bank',        coordinates: [30.5223, 50.4502], accessibilityScore: 75, barrierCount: 2, distanceM: 250,  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'b3',  name: 'Monobank Office',                    nameUk: 'Офіс Монобанку',                        address: 'vul. Baseyna 7',                  addressUk: 'вул. Басейна 7',                     category: 'bank',        coordinates: [30.5189, 50.4441], accessibilityScore: 92, barrierCount: 0, distanceM: 850,  verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'b4',  name: 'Raiffeisen Bank',                    nameUk: 'Райффайзен Банк',                       address: 'vul. Lesi Ukrainky 9',            addressUk: 'вул. Лесі Українки 9',               category: 'bank',        coordinates: [30.5423, 50.4378], accessibilityScore: 68, barrierCount: 2, distanceM: 1700, verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: true  },
  { id: 'b5',  name: 'PUMB Bank',                          nameUk: 'Банк ПУМБ',                             address: 'vul. Volodymyrska 48',            addressUk: 'вул. Володимирська 48',              category: 'bank',        coordinates: [30.5112, 50.4512], accessibilityScore: 55, barrierCount: 3, distanceM: 1200, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 'b6',  name: 'Ukrsibbank',                         nameUk: 'УкрСибБанк',                            address: 'prosp. Peremohy 22',              addressUk: 'просп. Перемоги 22',                 category: 'bank',        coordinates: [30.4845, 50.4523], accessibilityScore: 78, barrierCount: 1, distanceM: 2300, verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: false },
  // Public Toilets
  { id: 't1',  name: 'Public Toilet Maidan',               nameUk: 'Громадський туалет Майдан',             address: 'Maidan Nezalezhnosti',            addressUk: 'Майдан Незалежності',                category: 'toilet',      coordinates: [30.5221, 50.4503], accessibilityScore: 85, barrierCount: 1, distanceM: 150,  verifiedAt: new Date('2026-06-04T09:00:00'), isLiftDependent: false },
  { id: 't2',  name: 'Public Toilet Shevchenko Park',      nameUk: 'Громадський туалет парк Шевченка',      address: 'bulv. Tarasa Shevchenka',         addressUk: 'бульв. Тараса Шевченка',             category: 'toilet',      coordinates: [30.5129, 50.4461], accessibilityScore: 82, barrierCount: 1, distanceM: 1100, verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: false },
  { id: 't3',  name: 'Public Toilet Besarabska',           nameUk: 'Громадський туалет Бессарабська',       address: 'Besarabska pl. 1',                addressUk: 'Бессарабська пл. 1',                 category: 'toilet',      coordinates: [30.5201, 50.4445], accessibilityScore: 55, barrierCount: 3, distanceM: 800,  verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: false },
  { id: 't4',  name: 'Public Toilet Podil',                nameUk: 'Громадський туалет Поділ',              address: 'Kontraktova pl. 4',               addressUk: 'Контрактова пл. 4',                  category: 'toilet',      coordinates: [30.5167, 50.4634], accessibilityScore: 40, barrierCount: 4, distanceM: 2000, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  { id: 't5',  name: 'Public Toilet Olimpiyska',           nameUk: 'Громадський туалет Олімпійська',        address: 'vul. Velyka Vasylkivska 55',      addressUk: 'вул. Велика Васильківська 55',       category: 'toilet',      coordinates: [30.5212, 50.4334], accessibilityScore: 35, barrierCount: 5, distanceM: 1800, verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: false },
  // Pharmacies
  { id: 'ph1', name: 'Pharmacy Liky Plus',                 nameUk: 'Аптека Ліки Плюс',                      address: 'vul. Baseyna 14',                 addressUk: 'вул. Басейна 14',                    category: 'pharmacy',    coordinates: [30.5195, 50.4442], accessibilityScore: 92, barrierCount: 0, distanceM: 750,  verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 'ph2', name: 'Apteka Dobrogo Dnya',                nameUk: 'Аптека Доброго Дня',                    address: 'vul. Khreschyatyk 30',            addressUk: 'вул. Хрещатик 30',                   category: 'pharmacy',    coordinates: [30.5229, 50.4488], accessibilityScore: 88, barrierCount: 0, distanceM: 400,  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'ph3', name: 'Pharmacy 36.6',                      nameUk: 'Аптека 36.6',                           address: 'vul. Volodymyrska 20',            addressUk: 'вул. Володимирська 20',              category: 'pharmacy',    coordinates: [30.5141, 50.4523], accessibilityScore: 63, barrierCount: 2, distanceM: 1200, verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 'ph4', name: 'Tabletka Pharmacy',                  nameUk: 'Аптека Таблетка',                       address: 'prosp. Peremohy 18',              addressUk: 'просп. Перемоги 18',                 category: 'pharmacy',    coordinates: [30.4912, 50.4534], accessibilityScore: 48, barrierCount: 4, distanceM: 2600, verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: false },
  { id: 'ph5', name: 'D.S. Pharmacy Pechersk',             nameUk: 'Аптека Д.С. Печерськ',                  address: 'vul. Lavrska 8',                  addressUk: 'вул. Лаврська 8',                    category: 'pharmacy',    coordinates: [30.5512, 50.4356], accessibilityScore: 71, barrierCount: 2, distanceM: 2100, verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: false },
]

export const PLACES: Place[] = PLACE_DATA.map(p => ({
  ...p,
  sections: buildSections(p.category, p.accessibilityScore),
}))
