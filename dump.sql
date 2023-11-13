CREATE TABLE users (
    id serial primary key,
    name text not null, 
    email text not null unique, 
    password text not null
);

CREATE TABLE threeDetSheets (
	id serial primary key,
	user_id integer references users(id) not null,
  characterName text not null,
  points integer,
  characterClass text,
  characterRace text,
  strenghPoints integer,
  habilityPoints integer,
  resistancePoints integer,
  armorPoints integer, 
  firePowerPoints integer,
  vantages text,
  disavantages text, 
  healthPoints integer, 
  manaPoints integer, 
  experiencePoints integer, 
  damageType text,
  spellsKnown text, 
  inventory text,
  history text
);

CREATE TABLE user_sheets (
	user_id integer references users(id),
  sheet_id integer,
  system text
);

CREATE TABLE terra_devastada (
	id serial primary key,
  user_id integer references users(id) not null, 
  characterName text not null, 
  horrorPoints integer,
  characterAppearance text, 
  characterConcept text,
  characteristics text, 
  conditions text, 
  convictionPoints integer,
  trumps text,
  inventory text
);

