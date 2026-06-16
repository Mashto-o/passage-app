import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Map, { Marker } from 'react-map-gl/mapbox'
import type { MapRef } from 'react-map-gl/mapbox'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Funnel, Hospital, Utensils, Landmark, ShoppingCart, Trees, Toilet, Pill, ChevronLeft } from 'lucide-react'
import ShelterIcon from '../assets/icons/shelter.svg?react'
import { getCategoryIcon } from '../utils/categoryIcon'
import { formatDistance } from '../utils/formatUnits'
import { getLocalizedField } from '../utils/localizedField'
import type { FilterState } from '../context/FilterContext'
import { useFilterContext } from '../context/FilterContext'
import {
  SearchBar, Chip, AccessibilityBadge, NavBar, Button,
  PlaceListItem, SortControl, Divider, PlacePopupCard, SortSheet,
  PlaceDetailSheet, RoutePlanningSheet, RouteDestination, RouteDetailSheet,
  ActiveNavigationSheet,
} from '../components'
import type { Route } from '../components'

// ── Types & data ───────────────────────────────────────────────────────────

export type PlaceCategory =
  | 'shelter' | 'hospital' | 'restaurant' | 'landmark'
  | 'supermarket' | 'park' | 'bank' | 'toilet' | 'pharmacy'

export type PlaceFeatures = {
  entrance: boolean
  toilet: boolean
  inside: boolean
}

export type Place = {
  id: string
  name: string
  nameUk: string
  address: string
  addressUk: string
  category: PlaceCategory
  coordinates: [number, number]
  accessibilityScore: number
  barrierCount: number
  distanceM: number
  verifiedAt: Date
  isLiftDependent: boolean
  featuresOverride?: Partial<PlaceFeatures>
}

export const PLACES: Place[] = [
  // Shelters
  { id: 's1',  name: 'Shelter Maidan',                   nameUk: 'Укриття Майдан',                        address: 'Maidan Nezalezhnosti 1',          addressUk: 'Майдан Незалежності 1',              category: 'shelter',     coordinates: [30.5234, 50.4504], accessibilityScore: 80, barrierCount: 1, distanceM: 200,  verifiedAt: new Date('2026-06-05T18:00:00'), isLiftDependent: false },
  { id: 's2',  name: 'Shelter Lukyanivska',               nameUk: "Укриття Лук'янівська",                  address: 'vul. Oleny Telihy 3',             addressUk: 'вул. Олени Теліги 3',                category: 'shelter',     coordinates: [30.4986, 50.4612], accessibilityScore: 50, barrierCount: 3, distanceM: 2100, verifiedAt: new Date('2026-05-22T09:00:00'), isLiftDependent: false },
  { id: 's3',  name: 'Shelter Pechersk',                  nameUk: 'Укриття Печерськ',                      address: 'vul. Lavrska 15',                 addressUk: 'вул. Лаврська 15',                   category: 'shelter',     coordinates: [30.5574, 50.4338], accessibilityScore: 65, barrierCount: 2, distanceM: 1800, verifiedAt: new Date('2026-04-11T13:00:00'), isLiftDependent: false },
  { id: 's4',  name: 'Shelter Podil',                     nameUk: 'Укриття Поділ',                         address: 'vul. Sahaidachnoho 10',           addressUk: 'вул. Сагайдачного 10',               category: 'shelter',     coordinates: [30.5189, 50.4634], accessibilityScore: 72, barrierCount: 2, distanceM: 1500, verifiedAt: new Date('2026-06-03T10:00:00'), isLiftDependent: false },
  { id: 's5',  name: 'Shelter Obolon',                    nameUk: 'Укриття Оболонь',                       address: 'prosp. Obolonsky 1',              addressUk: 'просп. Оболонський 1',               category: 'shelter',     coordinates: [30.4978, 50.5012], accessibilityScore: 88, barrierCount: 0, distanceM: 3200, verifiedAt: new Date('2026-02-27T08:00:00'), isLiftDependent: false },
  { id: 's6',  name: 'Shelter Sviatoshyn',                nameUk: 'Укриття Святошин',                      address: 'vul. Peremohy 90',                addressUk: 'вул. Перемоги 90',                   category: 'shelter',     coordinates: [30.3912, 50.4567], accessibilityScore: 45, barrierCount: 4, distanceM: 4100, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Hospitals
  { id: 'h1',  name: 'Pharmacy Liky',                     nameUk: 'Аптека Ліки',                          address: 'vul. Khreschyatyk 22',            addressUk: 'вул. Хрещатик 22',                   category: 'pharmacy',    coordinates: [30.5238, 50.4494], accessibilityScore: 90, barrierCount: 0, distanceM: 300,  verifiedAt: new Date('2026-06-04T09:00:00'), isLiftDependent: false },
  { id: 'h2',  name: 'Oleksandrivska Hospital',           nameUk: 'Олександрівська лікарня',               address: 'bulv. Tarasa Shevchenka 17',      addressUk: 'бульв. Тараса Шевченка 17',          category: 'hospital',    coordinates: [30.5106, 50.4478], accessibilityScore: 55, barrierCount: 4, distanceM: 1100, verifiedAt: new Date('2026-03-18T11:00:00'), isLiftDependent: true  },
  { id: 'h3',  name: 'Kyiv City Clinical Hospital 1',     nameUk: 'Київська міська клінічна лікарня №1',   address: 'vul. Heroyiv Dnipra 37',          addressUk: 'вул. Героїв Дніпра 37',              category: 'hospital',    coordinates: [30.4889, 50.5023], accessibilityScore: 62, barrierCount: 3, distanceM: 3500, verifiedAt: new Date('2026-05-05T11:00:00'), isLiftDependent: true  },
  { id: 'h4',  name: 'Pharmacy 911',                      nameUk: 'Аптека 911',                            address: 'vul. Baseyna 12',                 addressUk: 'вул. Басейна 12',                    category: 'pharmacy',    coordinates: [30.5201, 50.4445], accessibilityScore: 85, barrierCount: 1, distanceM: 800,  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
  { id: 'h5',  name: 'Dobrobut Clinic',                   nameUk: 'Клініка Добробут',                      address: 'vul. Velyka Vasylkivska 55',      addressUk: 'вул. Велика Васильківська 55',       category: 'hospital',    coordinates: [30.5178, 50.4356], accessibilityScore: 91, barrierCount: 0, distanceM: 1600, verifiedAt: new Date('2026-04-30T10:00:00'), isLiftDependent: true  },
  { id: 'h6',  name: 'Pharmacy D.S.',                     nameUk: 'Аптека Д.С.',                           address: 'prosp. Peremohy 12',              addressUk: 'просп. Перемоги 12',                 category: 'pharmacy',    coordinates: [30.4934, 50.4521], accessibilityScore: 70, barrierCount: 2, distanceM: 2000, verifiedAt: new Date('2026-01-14T16:00:00'), isLiftDependent: false },
  // Restaurants / Cafés
  { id: 'r1',  name: 'Puzata Hata',                       nameUk: 'Пузата Хата',                          address: 'vul. Baseyna 5',                  addressUk: 'вул. Басейна 5',                     category: 'restaurant',  coordinates: [30.5189, 50.4432], accessibilityScore: 60, barrierCount: 3, distanceM: 800,  verifiedAt: new Date('2026-05-29T14:00:00'), isLiftDependent: false },
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
  // Toilets
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

// ── Sort helper ────────────────────────────────────────────────────────────

export type SortKey = 'most-accessible' | 'nearest' | 'recently-verified'
export const SORT_KEYS: SortKey[] = ['most-accessible', 'nearest', 'recently-verified']

function sortPlaces(places: Place[], sortKey: SortKey): Place[] {
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

// ── Filter helper ──────────────────────────────────────────────────────────

function filterPlaces(places: Place[], filter: FilterState): Place[] {
  return places.filter((place) => {
    const variant = getAccessibilityVariant(place.accessibilityScore)
    if (!filter.accessibility.has(variant)) return false
    if (filter.avoidLifts && place.isLiftDependent) return false
    return true
  })
}

// ── Search helper ─────────────────────────────────────────────────────────

function searchPlaces(places: Place[], query: string): Place[] {
  if (!query.trim()) return places
  const q = query.toLowerCase()
  const nameMatches = places.filter(
    p => p.name.toLowerCase().includes(q) || p.nameUk.toLowerCase().includes(q)
  )
  const addressOnlyMatches = places.filter(
    p => !p.name.toLowerCase().includes(q) && !p.nameUk.toLowerCase().includes(q)
      && (p.address.toLowerCase().includes(q) || p.addressUk.toLowerCase().includes(q))
  )
  return [...nameMatches, ...addressOnlyMatches]
}

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreVariant(score: number): 'positive' | 'warning' | 'negative' {
  if (score >= 80) return 'positive'
  if (score >= 40) return 'warning'
  return 'negative'
}

export function getAccessibilityVariant(score: number): 'accessible' | 'partial' | 'inaccessible' {
  if (score >= 80) return 'accessible'
  if (score >= 40) return 'partial'
  return 'inaccessible'
}

const markerColors = {
  accessible:   { outer: 'bg-success-500/20',  inner: 'bg-success-500',  ping: 'bg-success-500'  },
  partial:      { outer: 'bg-warning-500/20',   inner: 'bg-warning-500',  ping: 'bg-warning-500'  },
  inaccessible: { outer: 'bg-danger-500/20',    inner: 'bg-danger-500',   ping: 'bg-danger-500'   },
}


// ── Marker badge ───────────────────────────────────────────────────────────

function PlaceMarker({ place, selected }: { place: Place; selected: boolean }) {
  const size      = selected ? 'md' : 'sm'
  const iconSize  = selected ? 16 : 12
  const { ping }  = markerColors[getAccessibilityVariant(place.accessibilityScore)]

  return (
    <div className="relative flex items-center justify-center">
      {selected && (
        <span className={`absolute w-[48px] h-[48px] rounded-full ${ping} opacity-20 animate-ping`} />
      )}
      <AccessibilityBadge
        variant={getAccessibilityVariant(place.accessibilityScore)}
        size={size}
        icon={getCategoryIcon(place.category, iconSize)}
      />
    </div>
  )
}

// ── Category chip definitions ──────────────────────────────────────────────

type CategoryKey = Place['category']

// Icons only — labels are resolved via t() inside the component
const CHIP_DEFS: { key: CategoryKey; icon: React.ReactNode }[] = [
  { key: 'shelter',     icon: <ShelterIcon  width={14} height={14} stroke="currentColor" strokeWidth={1} aria-hidden /> },
  { key: 'toilet',      icon: <Toilet       size={14} strokeWidth={1} className="text-neutral-700" aria-hidden /> },
  { key: 'hospital',    icon: <Hospital     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'restaurant',  icon: <Utensils     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'landmark',    icon: <Landmark     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'supermarket', icon: <ShoppingCart size={14} strokeWidth={1} aria-hidden /> },
  { key: 'park',        icon: <Trees        size={14} strokeWidth={1} aria-hidden /> },
  { key: 'bank',        icon: <Landmark     size={14} strokeWidth={1} aria-hidden /> },
  { key: 'pharmacy',    icon: <Pill         size={14} strokeWidth={1} className="text-neutral-700" aria-hidden /> },
]

// ── Bottom sheet snap positions ────────────────────────────────────────────

type SnapPoint = 'half' | 'full' | 'closed'

const SNAP: Record<SnapPoint, string> = {
  half:   'top-[45%]',
  full:   'top-[8%]',
  closed: 'top-[110%]',
}

// Numeric heights matching the CSS snap positions (1 - topFraction) * vh
const SNAP_HEIGHT: Record<SnapPoint, number> = {
  half:   window.innerHeight * 0.55,
  full:   window.innerHeight * 0.92,
  closed: 0,
}

// ── Screen ─────────────────────────────────────────────────────────────────

export const MapScreen: React.FC = () => {
  const navigate                          = useNavigate()
  const location                          = useLocation()
  const { t, i18n }                       = useTranslation()
  const lang                             = i18n.language
  const mapRef                            = useRef<MapRef>(null)
  const [searchQuery, setSearchQuery]    = useState('')
  const [searchActive, setSearchActive]  = useState(false)
  const [reviewMode, setReviewMode]      = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null)
  const [sheetSnap, setSheetSnap]        = useState<SnapPoint>('closed')
  const [sheetVisible, setSheetVisible]  = useState(false)
  const [sortSheetOpen, setSortSheetOpen] = useState(false)
  const [sortValue, setSortValue]        = useState<SortKey>('most-accessible')
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<Place | null>(null)
  const [placeDetailOpen, setPlaceDetailOpen] = useState(false)
  const [routePlanningOpen, setRoutePlanningOpen] = useState(false)
  const [routeDestinationName, setRouteDestinationName] = useState('')
  const [routeSwapped, setRouteSwapped] = useState(false)
  const [routeDetailOpen, setRouteDetailOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [routeDetailSnapTop, setRouteDetailSnapTop] = useState<number | null>(null)
  const [activeNavigationOpen, setActiveNavigationOpen] = useState(false)
  const [navPanelHeight, setNavPanelHeight] = useState(0)
  const [routeEndedAt, setRouteEndedAt] = useState<{
    ts:            number
    placeId?:      string
    placeName?:    string
    placeNameUk?:  string
    address?:      string
    addressUk?:    string
    destinationName: string
  } | null>(null)
  const [routeMarkers, setRouteMarkers] = useState<{
    start: [number, number] | null
    end: [number, number] | null
  }>({ start: null, end: null })
  const dotIndexRef          = useRef(0)
  const dotMarkerRef         = useRef<mapboxgl.Marker | null>(null)
  const dotIntervalRef       = useRef<ReturnType<typeof setInterval> | null>(null)
  const handledLocationKey   = useRef<string | null>(null)
  const { filterState }                  = useFilterContext()

  // touch tracking refs
  const touchStartY  = useRef(0)
  const touchStartSnap = useRef<SnapPoint>('half')

  // ── Search handlers ───────────────────────────────────────────────
  const handleSearchFocus = () => {
    setSearchActive(true)
    closeSheet()
    setSelectedPlace(null)
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    if (!val) {
      setSearchActive(false)
    }
  }

  const dismissSearch = () => {
    setSearchActive(false)
    setSearchQuery('')
  }

  // ── Sheet helpers ─────────────────────────────────────────────────
  const openSheet = (snap: SnapPoint = 'half') => {
    setSheetVisible(true)
    setSheetSnap(snap)
  }

  const closeSheet = () => {
    setSheetSnap('closed')
    setTimeout(() => {
      setSheetVisible(false)
      setActiveCategory(null)
      setSearchQuery('')
    }, 300)
  }

  // ── Chip click ────────────────────────────────────────────────────
  const handleChipClick = (key: CategoryKey) => {
    if (activeCategory === key) {
      closeSheet()
    } else {
      setActiveCategory(key)
      setSelectedPlace(null)
      openSheet('half')
    }
  }

  // ── Marker click ──────────────────────────────────────────────────
  const handleMarkerClick = (place: Place) => {
    const doFly = () => {
      setSelectedPlace(place)
      mapRef.current?.getMap().flyTo({
        center: place.coordinates,
        zoom: 16,
        duration: 600,
        offset: [0, -80],
      })
    }

    if (sheetVisible) {
      closeSheet()
      setTimeout(doFly, 150)
    } else {
      doFly()
    }
  }

  const handleClosePopup = () => setSelectedPlace(null)

  // ── Close popup if selected place is filtered out ─────────────────
  useEffect(() => {
    if (selectedPlace && !filterPlaces(PLACES, filterState).find(p => p.id === selectedPlace.id)) {
      setSelectedPlace(null)
    }
  }, [filterState, selectedPlace])

  // ── Restore search state when returning from FilterScreen ─────────
  // Uses location.key so re-fires on same-path navigations without double-triggering.
  useEffect(() => {
    if (location.key === handledLocationKey.current) return
    handledLocationKey.current = location.key
    if (location.state?.reviewMode) {
      setReviewMode(true)
      setSearchActive(true)
    }
    if (location.state?.returnToSearch) {
      setSearchActive(true)
    }
  }, [location.key, location.state])

  // ── Reset map padding on mount ───────────────────────────────────
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (map) {
      map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 })
    }
  }, [])

  // ── Route polyline overlay ────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map || !selectedRoute) return

    const addLayers = () => {
      selectedRoute.coordinates.segments.forEach((seg, i) => {
        const sourceId = `route-seg-${i}`
        const layerId  = `route-layer-${i}`

        if (map.getLayer(layerId))  map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)

        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: seg.coords },
            properties: {},
          },
        })

        // Colours are hex strings required by Mapbox — Passage token equivalents noted inline
        const isTransport  = !['walk', 'car'].includes(seg.type)
        const hasBarriers  = seg.hasBarriers ?? false

        const color = isTransport
          ? '#361ecb'  // primary-500
          : hasBarriers
            ? '#f0a030' // warning-500
            : '#8b84e5' // primary-300

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': color,
            'line-width': 8, // same for all segment types
          },
        })
      })

      const allCoords = selectedRoute.coordinates.segments.flatMap(s => s.coords)
      const lngs = allCoords.map(c => c[0])
      const lats = allCoords.map(c => c[1])
      map.fitBounds(
        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
        {
          padding: { top: 100, bottom: 280, left: 60, right: 60 },
          duration: 800,
          maxZoom: 13,
        }
      )

      const allSegments = selectedRoute.coordinates.segments
      const startCoord = allSegments[0].coords[0]
      const lastSeg = allSegments[allSegments.length - 1]
      const endCoord = lastSeg.coords[lastSeg.coords.length - 1]
      setRouteMarkers({ start: startCoord, end: endCoord })
    }

    if (map.isStyleLoaded()) {
      addLayers()
    } else {
      map.once('load', addLayers)
    }

    return () => {
      // Remove route layers
      selectedRoute.coordinates.segments.forEach((_, i) => {
        const sourceId = `route-seg-${i}`
        const layerId  = `route-layer-${i}`
        if (map.getLayer(layerId))  map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      })
      setRouteMarkers({ start: null, end: null })
      // CRITICAL: reset padding so marker flyTo works correctly after sheet closes
      map.setPadding({ top: 0, bottom: 0, left: 0, right: 0 })
    }
  }, [selectedRoute])

  // ── Moving dot marker during active navigation ────────────────────
  useEffect(() => {
    const map = mapRef.current?.getMap()

    if (!activeNavigationOpen || !selectedRoute || !map) {
      if (dotIntervalRef.current) { clearInterval(dotIntervalRef.current); dotIntervalRef.current = null }
      dotMarkerRef.current?.remove(); dotMarkerRef.current = null
      dotIndexRef.current = 0
      return
    }

    const allCoords   = selectedRoute.coordinates.segments.flatMap(s => s.coords)
    const ARRIVAL_MS  = 13500
    const INTERVAL_MS = 300
    const totalTicks  = ARRIVAL_MS / INTERVAL_MS // 45 ticks

    // Build DOM element — inline styles used because this element is created at runtime
    const el   = document.createElement('div')
    el.style.cssText = 'position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px'

    const ring = document.createElement('div')
    // primary-300 (#8b84e5) — Mapbox DOM element, Passage token unavailable at runtime
    ring.style.cssText = 'position:absolute;width:24px;height:24px;border-radius:9999px;background-color:#8b84e5;opacity:0.75;animation:ping 1s cubic-bezier(0,0,0.2,1) infinite'

    const dot  = document.createElement('div')
    // primary-500 (#361ecb) — Mapbox DOM element, Passage token unavailable at runtime
    dot.style.cssText  = 'width:16px;height:16px;border-radius:9999px;background-color:#361ecb;position:relative;z-index:10'

    el.appendChild(ring)
    el.appendChild(dot)

    dotIndexRef.current = 0
    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat(allCoords[0])
      .addTo(map)
    dotMarkerRef.current = marker

    let tick = 0
    dotIntervalRef.current = setInterval(() => {
      tick = Math.min(tick + 1, totalTicks)
      // Map tick → coord index proportionally so the dot always takes exactly ARRIVAL_MS
      const idx = Math.floor((tick / totalTicks) * (allCoords.length - 1))
      dotIndexRef.current = idx
      dotMarkerRef.current?.setLngLat(allCoords[idx])
      if (tick >= totalTicks) {
        clearInterval(dotIntervalRef.current!)
        dotIntervalRef.current = null
      }
    }, INTERVAL_MS)

    return () => {
      if (dotIntervalRef.current) { clearInterval(dotIntervalRef.current); dotIntervalRef.current = null }
      dotMarkerRef.current?.remove(); dotMarkerRef.current = null
      dotIndexRef.current = 0
    }
  }, [activeNavigationOpen, selectedRoute])

  // ── Navigate to route review 2 s after arrival ───────────────────
  useEffect(() => {
    if (!routeEndedAt) return
    const timeout = setTimeout(() => {
      setActiveNavigationOpen(false)
      setSelectedRoute(null)
      navigate('/route-complete', {
        state: {
          distanceKm:      selectedRoute?.distanceKm,
          durationMin:     selectedRoute?.durationMin,
          placeId:         routeEndedAt.placeId,
          placeName:       routeEndedAt.placeName,
          placeNameUk:     routeEndedAt.placeNameUk,
          address:         routeEndedAt.address,
          addressUk:       routeEndedAt.addressUk,
          destinationName: routeEndedAt.destinationName,
        },
      })
      setRouteEndedAt(null)
    }, 3000)
    return () => clearTimeout(timeout)
  }, [routeEndedAt])

  // Dismiss active overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (searchActive) { dismissSearch(); return }
      if (selectedPlace && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen) { handleClosePopup(); return }
      if (sheetVisible && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen) { closeSheet() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchActive, selectedPlace, sheetVisible, placeDetailOpen, routePlanningOpen, routeDetailOpen])

  // ── Touch handlers ────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current    = e.touches[0].clientY
    touchStartSnap.current = sheetSnap
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current
    const THRESHOLD = 80
    if (touchStartSnap.current === 'half') {
      if (delta < -THRESHOLD) setSheetSnap('full')
      else if (delta > THRESHOLD) closeSheet()
    } else if (touchStartSnap.current === 'full') {
      if (delta > THRESHOLD) setSheetSnap('half')
    }
  }

  // ── i18n-derived values ───────────────────────────────────────────
  const chips = CHIP_DEFS.map(({ key, icon }) => ({
    key,
    label: t(`map.categories.${key}`),
    icon,
  }))

  const sortOptions = SORT_KEYS.map(key => ({
    key,
    label: t(`sort.${key}`),
  }))

  // ── Filtered / search places ──────────────────────────────────────
  const filteredPlaces = activeCategory ? PLACES.filter(p => p.category === activeCategory) : []
  const displayPlaces  = sortPlaces(filterPlaces(filteredPlaces, filterState), sortValue)
  const rawSearchResults = searchPlaces(filterPlaces(PLACES, filterState), searchQuery)
  const searchResults    = reviewMode && !searchQuery.trim()
    ? sortPlaces(rawSearchResults, 'nearest')
    : rawSearchResults

  const sheetTitle     = chips.find(c => c.key === activeCategory)?.label ?? ''
  const sortLabel      = sortOptions.find(o => o.key === sortValue)?.label ?? sortValue

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <h1 className="sr-only">{reviewMode ? t('placeDetail.leaveReview') : t('map.search')}</h1>

      {/* ── Search mode background (non-reviewMode only) ───────────── */}
      {searchActive && !reviewMode && (
        <>
          <div className="fixed inset-0 z-[8] bg-neutral-50" />
          <div
            aria-hidden="true"
            className="fixed inset-0 z-[9]"
            onClick={dismissSearch}
          />
        </>
      )}

      {/* ── Full-screen Mapbox map ───────────────────────────────────── */}
      {!searchActive && (
        <Map
          ref={mapRef}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={{ longitude: 30.5234, latitude: 50.4501, zoom: 14 }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          onClick={() => { if (sheetVisible) closeSheet() }}
        >
          {!routeDetailOpen && !activeNavigationOpen && filterPlaces(PLACES, filterState).map(place => (
            <Marker
              key={place.id}
              longitude={place.coordinates[0]}
              latitude={place.coordinates[1]}
              anchor="center"
              onClick={e => { e.originalEvent.stopPropagation(); handleMarkerClick(place) }}
            >
              <PlaceMarker place={place} selected={selectedPlace?.id === place.id} />
            </Marker>
          ))}

          {selectedRoute && routeMarkers.start && (
            <Marker
              longitude={routeMarkers.start[0]}
              latitude={routeMarkers.start[1]}
              anchor="center"
            >
              <img
                src="/src/assets/icons/starting-point-icon.svg"
                alt={t('map.startMarker')}
                className="w-[24px] h-[24px]"
              />
            </Marker>
          )}

          {selectedRoute && routeMarkers.end && (
            <Marker
              longitude={routeMarkers.end[0]}
              latitude={routeMarkers.end[1]}
              anchor="center"
            >
              <img
                src="/src/assets/icons/end-point-icon.svg"
                alt={t('map.endMarker')}
                className="w-[24px] h-[24px]"
              />
            </Marker>
          )}

        </Map>
      )}

      {/* ── Search / route destination bar ──────────────────────────── */}
      {routePlanningOpen && !routeDetailOpen ? (
        <div className="absolute top-[56px] left-[24px] right-[24px] z-[20]">
          <RouteDestination
            from={routeSwapped ? routeDestinationName : t('map.currentLocation')}
            to={routeSwapped ? t('map.currentLocation') : routeDestinationName}
            onFromChange={() => {}}
            onToChange={() => {}}
            onSwap={() => setRouteSwapped(prev => !prev)}
          />
        </div>
      ) : (
        <>
          {/* ── Search + filter bar + chips — hidden during active navigation */}
          {!activeNavigationOpen && (
            <>
              {/* ── Search + filter bar (non-reviewMode) ────────────── */}
              {!reviewMode && (
                <div className="absolute top-[56px] left-lg right-lg z-[10]">
                  <div className="flex items-center gap-xs">
                    <div className="flex-1">
                      <SearchBar
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        placeholder={t('map.search')}
                        leftSlot={searchActive ? (
                          <button
                            onClick={() => {
                              setSearchQuery('')
                              setSearchActive(false)
                            }}
                            className="shrink-0 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                            aria-label={t('map.backToMap')}
                          >
                            <ChevronLeft size={24} strokeWidth={1.5} className="text-neutral-500" />
                          </button>
                        ) : undefined}
                      />
                    </div>
                    <button
                      type="button"
                      className={[
                        'flex items-center justify-center shrink-0',
                        'w-[48px] h-[48px] rounded-xl',
                        'bg-neutral-0 border border-neutral-200',
                        'text-neutral-500',
                        'transition-colors duration-200',
                        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                      ].join(' ')}
                      aria-label={t('map.filterButton')}
                      onClick={() => navigate('/filter', { state: { from: searchActive ? 'search' : 'map', reviewMode: reviewMode } })}
                    >
                      <Funnel size={20} strokeWidth={1.5} aria-hidden />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Category chips ───────────────────────────────────── */}
              {!searchActive && !placeDetailOpen && (
                <div className="absolute top-[124px] left-lg right-0 z-10 flex flex-row flex-nowrap gap-xs overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  {chips.map(({ key, label, icon }) => {
                    const active = activeCategory === key
                    return (
                      <Chip
                        key={key}
                        size="md"
                        label={label}
                        variant={active ? 'active' : 'neutral'}
                        className="shrink-0 cursor-pointer"
                        icon={React.cloneElement(icon as React.ReactElement, {
                          className: active ? 'text-neutral-0' : 'text-neutral-700',
                        })}
                        onClick={() => handleChipClick(key)}
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Search results (non-reviewMode) ─────────────────────────── */}
      {searchActive && !reviewMode && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- propagation stopper only, not an interactive control
        <div
          className="absolute top-[136px] left-lg right-lg z-[10] overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 224px)' }}
          onClick={e => e.stopPropagation()}
        >
          {searchResults.length === 0 && searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center pt-2xl gap-xs">
              <p className="text-heading-sm text-neutral-900">{t('map.noResultsTitle')}</p>
              <p className="text-body-sm text-neutral-500 text-center">
                {t('map.noResultsSubtitle')}
              </p>
            </div>
          ) : (
            searchResults.map((place, idx) => (
              <React.Fragment key={place.id}>
                <PlaceListItem
                  name={getLocalizedField(place, 'name', lang)}
                  address={getLocalizedField(place, 'address', lang)}
                  distance={formatDistance(place.distanceM, lang)}
                  accessibilityScore={place.accessibilityScore}
                  category={place.category}
                  verifiedAt={place.verifiedAt}
                  isLiftDependent={place.isLiftDependent}
                  onPress={() => {
                    if (reviewMode) {
                      navigate('/review', {
                        state: {
                          placeId: place.id,
                          placeName: getLocalizedField(place, 'name', lang),
                          address: getLocalizedField(place, 'address', lang),
                        },
                      })
                    } else {
                      setSearchQuery(getLocalizedField(place, 'name', lang))
                      setSearchActive(false)
                      mapRef.current?.getMap().flyTo({
                        center: place.coordinates,
                        zoom: 16,
                        offset: [0, -80],
                      })
                      setSelectedPlaceForDetail(place)
                      setPlaceDetailOpen(true)
                    }
                  }}
                />
                {idx < searchResults.length - 1 && (
                  <div className="py-md">
                    <Divider />
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      )}

      {/* ── Review-mode full-page overlay ───────────────────────────── */}
      {searchActive && reviewMode && (
        <div className="fixed inset-0 z-[10] bg-neutral-50 flex flex-col px-lg pt-xl overflow-hidden">
          {/* Back */}
          <Button variant="back" label={t('common.back')} onClick={() => { setReviewMode(false); setSearchActive(false); setSearchQuery(''); navigate('/map', { replace: true }) }} />

          {/* Heading */}
          <h2 className="text-display-md text-neutral-900 mt-lg">
            {t('placeDetail.leaveReview')}
          </h2>

          {/* Search bar + filter */}
          <div className="flex items-center gap-xs mt-md">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder={t('map.search')}
              />
            </div>
            <button
              type="button"
              className={[
                'flex items-center justify-center shrink-0',
                'w-[48px] h-[48px] rounded-xl',
                'bg-neutral-0 border border-neutral-200',
                'text-neutral-500',
                'transition-colors duration-200',
                'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none',
              ].join(' ')}
              aria-label={t('map.filterButton')}
              onClick={() => navigate('/filter', { state: { from: 'search', reviewMode: reviewMode } })}
            >
              <Funnel size={20} strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto mt-md">
            {searchResults.length === 0 && searchQuery.trim() ? (
              <div className="flex flex-col items-center justify-center pt-2xl gap-xs">
                <p className="text-heading-sm text-neutral-900">{t('map.noResultsTitle')}</p>
                <p className="text-body-sm text-neutral-500 text-center">
                  {t('map.noResultsSubtitle')}
                </p>
              </div>
            ) : (
              searchResults.map((place, idx) => (
                <React.Fragment key={place.id}>
                  <PlaceListItem
                    name={getLocalizedField(place, 'name', lang)}
                    address={getLocalizedField(place, 'address', lang)}
                    distance={formatDistance(place.distanceM, lang)}
                    accessibilityScore={place.accessibilityScore}
                    category={place.category}
                    verifiedAt={place.verifiedAt}
                    isLiftDependent={place.isLiftDependent}
                    onPress={() => navigate('/review', {
                      state: {
                        placeId: place.id,
                        placeName: getLocalizedField(place, 'name', lang),
                        address: getLocalizedField(place, 'address', lang),
                      },
                    })}
                  />
                  {idx < searchResults.length - 1 && (
                    <div className="py-md">
                      <Divider />
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Bottom sheet backdrop ───────────────────────────────────── */}
      {sheetVisible && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[45] bg-transparent"
          onClick={() => closeSheet()}
        />
      )}

      {/* ── Bottom sheet ────────────────────────────────────────────── */}
      {sheetVisible && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen && (
        <div
          className={[
            'fixed left-0 right-0 bottom-0 z-[50]',
            'bg-neutral-0 rounded-tl-[48px] rounded-tr-[48px] shadow-2xl',
            'flex flex-col',
            'transition-all duration-300 ease-out',
            SNAP[sheetSnap],
          ].join(' ')}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Drag handle */}
          <div className="flex justify-center py-lg shrink-0">
            <div className="w-[40px] h-[3px] bg-neutral-400 rounded-full" />
          </div>

          {/* Sheet header */}
          <div className="px-lg flex flex-col gap-sm shrink-0">
            <span className="text-display-md text-neutral-900">{sheetTitle}</span>
            <SortControl value={sortLabel} onPress={() => setSortSheetOpen(true)} />
          </div>

          {/* Place list */}
          <div className="overflow-y-auto flex-1 pb-[144px] px-lg mt-[34px]">
            {displayPlaces.length === 0 ? (
              <p className="py-xl text-body-md text-neutral-500">{t('map.noPlacesFound')}</p>
            ) : (
              displayPlaces.map((place, idx) => (
                <React.Fragment key={place.id}>
                  <PlaceListItem
                    name={getLocalizedField(place, 'name', lang)}
                    address={getLocalizedField(place, 'address', lang)}
                    distance={formatDistance(place.distanceM, lang)}
                    accessibilityScore={place.accessibilityScore}
                    category={place.category}
                    verifiedAt={place.verifiedAt}
                    isLiftDependent={place.isLiftDependent}
                  onPress={() => {
                    setSelectedPlaceForDetail(place)
                    setPlaceDetailOpen(true)
                  }}
                  />
                  {idx < displayPlaces.length - 1 && (
                    <div className="py-md">
                      <Divider />
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Popup backdrop ──────────────────────────────────────────── */}
      {selectedPlace && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[55] bg-transparent"
          onClick={handleClosePopup}
        />
      )}

      {/* ── Place popup card ────────────────────────────────────────── */}
      <PlacePopupCard
        visible={!!selectedPlace && !placeDetailOpen && !routePlanningOpen && !routeDetailOpen}
        name={selectedPlace ? getLocalizedField(selectedPlace, 'name', lang) : ''}
        address={selectedPlace ? getLocalizedField(selectedPlace, 'address', lang) : ''}
        distance={selectedPlace ? formatDistance(selectedPlace.distanceM, lang) : ''}
        barrierCount={selectedPlace?.barrierCount ?? 0}
        accessibilityScore={selectedPlace?.accessibilityScore ?? 0}
        accessibilityVariant={getAccessibilityVariant(selectedPlace?.accessibilityScore ?? 0)}
        scoreVariant={scoreVariant(selectedPlace?.accessibilityScore ?? 0)}
        categoryIcon={selectedPlace ? getCategoryIcon(selectedPlace.category, 12) : undefined}
        onClose={handleClosePopup}
        onCardClick={() => {
          if (selectedPlace) {
            setSelectedPlaceForDetail(selectedPlace)
            setPlaceDetailOpen(true)
          }
        }}
        onRoute={() => {
          if (selectedPlace) {
            setRouteDestinationName(getLocalizedField(selectedPlace, 'name', lang))
            setRoutePlanningOpen(true)
          }
        }}
        onBookmark={() => console.log('save')}
        onShare={() => console.log('share')}
      />

      {/* ── NavBar ──────────────────────────────────────────────────── */}
      {!activeNavigationOpen && (
        <div className="absolute bottom-lg left-lg right-lg z-40">
          <NavBar activeTab="map" onTabChange={(tab) => navigate('/' + tab)} reviewActive={reviewMode} />
        </div>
      )}

      {/* ── Sort sheet ──────────────────────────────────────────────── */}
      <SortSheet
        isOpen={sortSheetOpen && !activeNavigationOpen}
        options={sortOptions}
        value={sortValue}
        onChange={(key) => setSortValue(key as SortKey)}
        onClose={() => setSortSheetOpen(false)}
        height={SNAP_HEIGHT[sheetSnap]}
      />

      {/* ── Place detail sheet ──────────────────────────────────────── */}
      <PlaceDetailSheet
        place={selectedPlaceForDetail}
        isOpen={placeDetailOpen && !routePlanningOpen && !activeNavigationOpen}
        onClose={() => {
          setPlaceDetailOpen(false)
          setSelectedPlaceForDetail(null)
        }}
        onBuildRoute={(name) => {
          setRouteDestinationName(name)
          setRoutePlanningOpen(true)
        }}
      />

      {/* ── Route planning sheet ────────────────────────────────────── */}
      <RoutePlanningSheet
        isOpen={routePlanningOpen && !routeDetailOpen && !activeNavigationOpen}
        destinationName={routeDestinationName}
        onClose={() => {
          setRoutePlanningOpen(false)
          setRouteDestinationName('')
          setRouteSwapped(false)
        }}
        onRouteSelect={(route) => {
          setSelectedRoute(route)
          setRouteDetailOpen(true)
        }}
        overrideTop={routeDetailOpen ? routeDetailSnapTop : null}
        maxHeight={activeNavigationOpen ? navPanelHeight : undefined}
      />

      {/* ── Route detail sheet ──────────────────────────────────────── */}
      <RouteDetailSheet
        isOpen={routeDetailOpen && !activeNavigationOpen}
        route={selectedRoute}
        destinationName={routeDestinationName}
        onClose={() => {
          setRouteDetailOpen(false)
          setSelectedRoute(null)
        }}
        onSnapChange={(top) => setRouteDetailSnapTop(top)}
        onStartRoute={() => setActiveNavigationOpen(true)}
        maxHeight={activeNavigationOpen ? navPanelHeight : undefined}
      />

      {/* ── Active navigation sheet ──────────────────────────────────── */}
      <ActiveNavigationSheet
        isOpen={activeNavigationOpen}
        route={selectedRoute}
        destinationName={routeDestinationName}
        onClose={() => setActiveNavigationOpen(false)}
        onNavStateChange={(state) => {
          if (state === 'arrived') {
            const arrivedPlaceId      = selectedPlace?.id
            const arrivedPlaceName    = selectedPlace?.name
            const arrivedPlaceNameUk  = selectedPlace?.nameUk
            const arrivedAddress      = selectedPlace?.address
            const arrivedAddressUk    = selectedPlace?.addressUk
            setRouteDetailOpen(false)
            setRoutePlanningOpen(false)
            setPlaceDetailOpen(false)
            setSelectedPlace(null)
            closeSheet()
            setRouteEndedAt({
              ts:            Date.now(),
              placeId:       arrivedPlaceId,
              placeName:     arrivedPlaceName,
              placeNameUk:   arrivedPlaceNameUk,
              address:       arrivedAddress,
              addressUk:     arrivedAddressUk,
              destinationName: routeDestinationName,
            })
          }
        }}
        onPanelHeightChange={setNavPanelHeight}
      />

    </main>
  )
}
