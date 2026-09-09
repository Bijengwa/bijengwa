const bcrypt = require('bcryptjs');

const DAVID_UUID = '11111111-1111-1111-1111-111111111111';
const TENANT_UUID = '22222222-2222-2222-2222-222222222222';

const PROPERTY_1_UUID = 'a1111111-1111-1111-1111-111111111111';
const PROPERTY_2_UUID = 'a2222222-2222-2222-2222-222222222222';
const PROPERTY_3_UUID = 'a3333333-3333-3333-3333-333333333333';

const UNIT_1A_UUID = 'b1111111-1111-1111-1111-111111111111';
const UNIT_1B_UUID = 'b1111111-1111-1111-1111-111111111112';
const UNIT_1C_UUID = 'b1111111-1111-1111-1111-111111111113';
const UNIT_1D_UUID = 'b1111111-1111-1111-1111-111111111114';
const UNIT_2A_UUID = 'b2222222-2222-2222-2222-222222222221';
const UNIT_3A_UUID = 'b3333333-3333-3333-3333-333333333331';
const UNIT_3B_UUID = 'b3333333-3333-3333-3333-333333333332';

const AGREEMENT_UUID = 'c1111111-1111-1111-1111-111111111111';

const CHAT_UUID = 'd1111111-1111-1111-1111-111111111111';

exports.seed = async function seed(knex) {
  await knex('chat_messages').del();
  await knex('chats').del();
  await knex('payments').del();
  await knex('rental_agreements').del();
  await knex('units').del();
  await knex('properties').del();
  await knex('settings').del();
  await knex('profiles').del();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  await knex('profiles').insert([
    {
      uuid: DAVID_UUID,
      full_name: 'David Mushi',
      username: 'david.mushi',
      email: 'david@bijengwa.test',
      phone_number: '+255700000001',
      password: passwordHash,
    },
    {
      uuid: TENANT_UUID,
      full_name: 'Grace Mwakalinga',
      username: 'grace.mwakalinga',
      email: 'grace@bijengwa.test',
      phone_number: '+255700000002',
      password: passwordHash,
    },
  ]);

  await knex('settings').insert([
    { user_uuid: DAVID_UUID, language: 'en', theme: 'light' },
    { user_uuid: TENANT_UUID, language: 'sw', theme: 'dark' },
  ]);

  await knex('properties').insert([
    {
      uuid: PROPERTY_1_UUID,
      owner_uuid: DAVID_UUID,
      title: 'Mikocheni Residence',
      property_type: 'apartment_building',
      pictures: JSON.stringify(['https://picsum.photos/seed/mikocheni1/800/600']),
      location: 'Mikocheni, Dar es Salaam',
      street: 'Mwai Kibaki Road',
      description: 'A four-unit residential building in a quiet Mikocheni neighborhood.',
      house_rules: 'No smoking indoors. Quiet hours after 10pm.',
    },
    {
      uuid: PROPERTY_2_UUID,
      owner_uuid: DAVID_UUID,
      title: 'Masaki Standalone House',
      property_type: 'house',
      pictures: JSON.stringify(['https://picsum.photos/seed/masaki1/800/600']),
      location: 'Masaki, Dar es Salaam',
      street: 'Chole Road',
      description: 'A single standalone house with a private compound.',
      house_rules: 'Pets allowed with prior approval.',
    },
    {
      uuid: PROPERTY_3_UUID,
      owner_uuid: DAVID_UUID,
      title: 'Kariakoo Commercial Block',
      property_type: 'commercial_building',
      pictures: JSON.stringify(['https://picsum.photos/seed/kariakoo1/800/600']),
      location: 'Kariakoo, Dar es Salaam',
      street: 'Tandamuti Street',
      description: 'A mixed-use block with shop and office spaces.',
      house_rules: 'Business hours access only for shared areas.',
    },
  ]);

  await knex('units').insert([
    {
      uuid: UNIT_1A_UUID,
      property_uuid: PROPERTY_1_UUID,
      unit_name: 'Unit A01',
      room_type: 'apartment',
      purpose: 'living',
      rent_tzs: 450000,
      minimum_stay: '6 months',
      rent_paid_in_advance: '1 month',
      notice_before_leaving_days: 30,
      description: 'One-bedroom apartment on the ground floor.',
      photos: JSON.stringify(['https://picsum.photos/seed/unitA01/600/400']),
      status: 'occupied',
    },
    {
      uuid: UNIT_1B_UUID,
      property_uuid: PROPERTY_1_UUID,
      unit_name: 'Unit A02',
      room_type: 'apartment',
      purpose: 'living',
      rent_tzs: 480000,
      minimum_stay: '6 months',
      rent_paid_in_advance: '1 month',
      notice_before_leaving_days: 30,
      description: 'One-bedroom apartment, first floor, balcony.',
      photos: JSON.stringify(['https://picsum.photos/seed/unitA02/600/400']),
      status: 'available',
    },
    {
      uuid: UNIT_1C_UUID,
      property_uuid: PROPERTY_1_UUID,
      unit_name: 'Unit A03',
      room_type: 'single_room',
      purpose: 'living',
      rent_tzs: 200000,
      minimum_stay: '3 months',
      rent_paid_in_advance: '1 month',
      notice_before_leaving_days: 14,
      description: 'Single room with shared bathroom.',
      photos: JSON.stringify(['https://picsum.photos/seed/unitA03/600/400']),
      status: 'available',
    },
    {
      uuid: UNIT_1D_UUID,
      property_uuid: PROPERTY_1_UUID,
      unit_name: 'Unit A04',
      room_type: 'single_room',
      purpose: 'living',
      rent_tzs: 200000,
      minimum_stay: '3 months',
      rent_paid_in_advance: '1 month',
      notice_before_leaving_days: 14,
      description: 'Single room with shared bathroom, second floor.',
      photos: JSON.stringify(['https://picsum.photos/seed/unitA04/600/400']),
      status: 'occupied',
    },
    {
      uuid: UNIT_2A_UUID,
      property_uuid: PROPERTY_2_UUID,
      unit_name: 'Whole House',
      room_type: 'whole_house',
      purpose: 'living',
      rent_tzs: 1800000,
      minimum_stay: '12 months',
      rent_paid_in_advance: '3 months',
      notice_before_leaving_days: 60,
      description: 'Four-bedroom standalone house with garden and parking.',
      photos: JSON.stringify(['https://picsum.photos/seed/masakiHouse/600/400']),
      status: 'available',
    },
    {
      uuid: UNIT_3A_UUID,
      property_uuid: PROPERTY_3_UUID,
      unit_name: 'Shop 1',
      room_type: 'shop',
      purpose: 'business',
      rent_tzs: 600000,
      minimum_stay: '12 months',
      rent_paid_in_advance: '2 months',
      notice_before_leaving_days: 30,
      description: 'Ground floor shop facing the main street.',
      photos: JSON.stringify(['https://picsum.photos/seed/shop1/600/400']),
      status: 'available',
    },
    {
      uuid: UNIT_3B_UUID,
      property_uuid: PROPERTY_3_UUID,
      unit_name: 'Office 1',
      room_type: 'office',
      purpose: 'business',
      rent_tzs: 750000,
      minimum_stay: '12 months',
      rent_paid_in_advance: '2 months',
      notice_before_leaving_days: 30,
      description: 'Second floor office space, 40 sqm.',
      photos: JSON.stringify(['https://picsum.photos/seed/office1/600/400']),
      status: 'available',
    },
  ]);

  await knex('rental_agreements').insert([
    {
      uuid: AGREEMENT_UUID,
      unit_uuid: UNIT_1A_UUID,
      tenant_uuid: TENANT_UUID,
      start_date: '2026-06-01',
      end_date: '2026-12-01',
      monthly_rent_tzs: 450000,
      months_paid_in_advance: 1,
      minimum_stay: '6 months',
      notice_before_leaving_days: 30,
      status: 'active',
    },
  ]);

  await knex('payments').insert([
    {
      rental_agreement_uuid: AGREEMENT_UUID,
      amount_tzs: 450000,
      months_paid_for: 1,
      payment_date: '2026-06-01',
      period_start_date: '2026-06-01',
      period_end_date: '2026-06-30',
      payment_method: 'mobile_money',
      reference_number: 'MPESA-DEMO-0001',
      status: 'completed',
    },
    {
      rental_agreement_uuid: AGREEMENT_UUID,
      amount_tzs: 450000,
      months_paid_for: 1,
      payment_date: '2026-07-01',
      period_start_date: '2026-07-01',
      period_end_date: '2026-07-31',
      payment_method: 'mobile_money',
      reference_number: 'MPESA-DEMO-0002',
      status: 'completed',
    },
  ]);

  const chat = await knex('chats')
    .insert({
      uuid: CHAT_UUID,
      unit_uuid: UNIT_2A_UUID,
      tenant_uuid: TENANT_UUID,
      owner_uuid: DAVID_UUID,
      status: 'open',
    })
    .returning('uuid');

  const chatUuid = Array.isArray(chat) ? chat[0].uuid || chat[0] : CHAT_UUID;

  await knex('chat_messages').insert([
    {
      chat_uuid: chatUuid,
      sender_uuid: TENANT_UUID,
      message: 'Hi, is the Masaki house still available? Can I come see it this weekend?',
    },
    {
      chat_uuid: chatUuid,
      sender_uuid: DAVID_UUID,
      message: 'Hello Grace, yes it is available. Saturday at 10am works for a viewing.',
    },
  ]);
};
