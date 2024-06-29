// import { MigrationInterface, QueryRunner } from "typeorm";

// export class LastMigration1719502193529 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `CREATE TABLE \`planet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`edited\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`rotation_period\` varchar(255) NOT NULL, \`orbital_period\` varchar(255) NOT NULL, \`diameter\` varchar(255) NOT NULL, \`climate\` varchar(255) NOT NULL, \`gravity\` varchar(255) NOT NULL, \`terrain\` varchar(255) NOT NULL, \`surface_water\` varchar(255) NOT NULL, \`population\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`species\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`edited\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`classification\` varchar(255) NOT NULL, \`designation\` varchar(255) NOT NULL, \`average_height\` varchar(255) NOT NULL, \`skin_colors\` varchar(255) NOT NULL, \`hair_colors\` varchar(255) NOT NULL, \`eye_colors\` varchar(255) NOT NULL, \`average_lifespan\` varchar(255) NOT NULL, \`language\` varchar(255) NOT NULL, \`homeworldId\` int NULL, UNIQUE INDEX \`REL_3427f7c92316561d7131c296bc\` (\`homeworldId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`starship\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`edited\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`manufacturer\` varchar(255) NOT NULL, \`cost_in_credits\` varchar(255) NOT NULL, \`length\` varchar(255) NOT NULL, \`max_atmosphering_speed\` varchar(255) NOT NULL, \`crew\` varchar(255) NOT NULL, \`passengers\` varchar(255) NOT NULL, \`cargo_capacity\` varchar(255) NOT NULL, \`consumables\` varchar(255) NOT NULL, \`hyperdrive_rating\` varchar(255) NOT NULL, \`MGLT\` varchar(255) NOT NULL, \`starship_class\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`edited\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`peopleId\` int NULL, \`filmsId\` int NULL, \`planetsId\` int NULL, \`speciesId\` int NULL, \`starshipsId\` int NULL, \`vehiclesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`edited\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`height\` varchar(255) NOT NULL, \`mass\` varchar(255) NOT NULL, \`hair_color\` varchar(255) NOT NULL, \`skin_color\` varchar(255) NOT NULL, \`eye_color\` varchar(255) NOT NULL, \`birth_year\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`homeworldId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`film\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`edited\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`episode_id\` int NOT NULL, \`opening_crawl\` mediumtext NOT NULL, \`director\` varchar(255) NOT NULL, \`producer\` varchar(255) NOT NULL, \`release_date\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`vehicle\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`edited\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`url\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`manufacturer\` varchar(255) NOT NULL, \`cost_in_credits\` varchar(255) NOT NULL, \`length\` varchar(255) NOT NULL, \`max_atmosphering_speed\` varchar(255) NOT NULL, \`crew\` varchar(255) NOT NULL, \`passengers\` varchar(255) NOT NULL, \`cargo_capacity\` varchar(255) NOT NULL, \`consumables\` varchar(255) NOT NULL, \`vehicle_class\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_films_film\` (\`peopleId\` int NOT NULL, \`filmId\` int NOT NULL, INDEX \`IDX_99ce84505b9d277789a5742906\` (\`peopleId\`), INDEX \`IDX_c4597771baad7514441c33793f\` (\`filmId\`), PRIMARY KEY (\`peopleId\`, \`filmId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_species_species\` (\`peopleId\` int NOT NULL, \`speciesId\` int NOT NULL, INDEX \`IDX_d6d545e4740ee652e6f79e9ffd\` (\`peopleId\`), INDEX \`IDX_9232984d4ee14342ad97f44382\` (\`speciesId\`), PRIMARY KEY (\`peopleId\`, \`speciesId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_vehicles_vehicle\` (\`peopleId\` int NOT NULL, \`vehicleId\` int NOT NULL, INDEX \`IDX_0c4799c95577dd53de3c919206\` (\`peopleId\`), INDEX \`IDX_69511f955e4694544aa0056f25\` (\`vehicleId\`), PRIMARY KEY (\`peopleId\`, \`vehicleId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_starships_starship\` (\`peopleId\` int NOT NULL, \`starshipId\` int NOT NULL, INDEX \`IDX_cd69a89b18df6a4e42c67877cf\` (\`peopleId\`), INDEX \`IDX_baf66aafe260a12223240c8d4a\` (\`starshipId\`), PRIMARY KEY (\`peopleId\`, \`starshipId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`film_planets_planet\` (\`filmId\` int NOT NULL, \`planetId\` int NOT NULL, INDEX \`IDX_9e9d858b064b7d0fa02a9764e1\` (\`filmId\`), INDEX \`IDX_6821d91826ca31cc4e4588b535\` (\`planetId\`), PRIMARY KEY (\`filmId\`, \`planetId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`film_starships_starship\` (\`filmId\` int NOT NULL, \`starshipId\` int NOT NULL, INDEX \`IDX_ed79253745f81534b737ce768c\` (\`filmId\`), INDEX \`IDX_21297c5d74a841542bcb7fe063\` (\`starshipId\`), PRIMARY KEY (\`filmId\`, \`starshipId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`film_vehicles_vehicle\` (\`filmId\` int NOT NULL, \`vehicleId\` int NOT NULL, INDEX \`IDX_af46f6d0bef8eba92546a8c537\` (\`filmId\`), INDEX \`IDX_8be4e7e1014359bb4715338cf2\` (\`vehicleId\`), PRIMARY KEY (\`filmId\`, \`vehicleId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`film_species_species\` (\`filmId\` int NOT NULL, \`speciesId\` int NOT NULL, INDEX \`IDX_5dca805e1b117016b196e64305\` (\`filmId\`), INDEX \`IDX_3af75337b121624486cf179bf1\` (\`speciesId\`), PRIMARY KEY (\`filmId\`, \`speciesId\`)) ENGINE=InnoDB`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`species\` ADD CONSTRAINT \`FK_3427f7c92316561d7131c296bc6\` FOREIGN KEY (\`homeworldId\`) REFERENCES \`planet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_195b21b02ba0227f336b1ef7065\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_a2c1ee702ce1accdd98c9ff67a0\` FOREIGN KEY (\`filmsId\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_59acd383cc58324a12bbb174b81\` FOREIGN KEY (\`planetsId\`) REFERENCES \`planet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_5a9e4a23ffd399fa29aa06be4e5\` FOREIGN KEY (\`speciesId\`) REFERENCES \`species\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_08f53d2b62e59296bc11817619f\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starship\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_9bad33153b67558894fc988f5d6\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people\` ADD CONSTRAINT \`FK_8f79bb098a482fa585da15ef3a6\` FOREIGN KEY (\`homeworldId\`) REFERENCES \`planet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_films_film\` ADD CONSTRAINT \`FK_99ce84505b9d277789a5742906b\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_films_film\` ADD CONSTRAINT \`FK_c4597771baad7514441c33793f5\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_species_species\` ADD CONSTRAINT \`FK_d6d545e4740ee652e6f79e9ffd5\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_species_species\` ADD CONSTRAINT \`FK_9232984d4ee14342ad97f443824\` FOREIGN KEY (\`speciesId\`) REFERENCES \`species\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_vehicles_vehicle\` ADD CONSTRAINT \`FK_0c4799c95577dd53de3c9192060\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_vehicles_vehicle\` ADD CONSTRAINT \`FK_69511f955e4694544aa0056f256\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_starships_starship\` ADD CONSTRAINT \`FK_cd69a89b18df6a4e42c67877cf5\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_starships_starship\` ADD CONSTRAINT \`FK_baf66aafe260a12223240c8d4a5\` FOREIGN KEY (\`starshipId\`) REFERENCES \`starship\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_planets_planet\` ADD CONSTRAINT \`FK_9e9d858b064b7d0fa02a9764e18\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_planets_planet\` ADD CONSTRAINT \`FK_6821d91826ca31cc4e4588b5355\` FOREIGN KEY (\`planetId\`) REFERENCES \`planet\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_starships_starship\` ADD CONSTRAINT \`FK_ed79253745f81534b737ce768c1\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_starships_starship\` ADD CONSTRAINT \`FK_21297c5d74a841542bcb7fe063a\` FOREIGN KEY (\`starshipId\`) REFERENCES \`starship\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_vehicles_vehicle\` ADD CONSTRAINT \`FK_af46f6d0bef8eba92546a8c5375\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_vehicles_vehicle\` ADD CONSTRAINT \`FK_8be4e7e1014359bb4715338cf20\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_species_species\` ADD CONSTRAINT \`FK_5dca805e1b117016b196e64305b\` FOREIGN KEY (\`filmId\`) REFERENCES \`film\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_species_species\` ADD CONSTRAINT \`FK_3af75337b121624486cf179bf13\` FOREIGN KEY (\`speciesId\`) REFERENCES \`species\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
//     )
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `ALTER TABLE \`film_species_species\` DROP FOREIGN KEY \`FK_3af75337b121624486cf179bf13\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_species_species\` DROP FOREIGN KEY \`FK_5dca805e1b117016b196e64305b\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_vehicles_vehicle\` DROP FOREIGN KEY \`FK_8be4e7e1014359bb4715338cf20\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_vehicles_vehicle\` DROP FOREIGN KEY \`FK_af46f6d0bef8eba92546a8c5375\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_starships_starship\` DROP FOREIGN KEY \`FK_21297c5d74a841542bcb7fe063a\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_starships_starship\` DROP FOREIGN KEY \`FK_ed79253745f81534b737ce768c1\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_planets_planet\` DROP FOREIGN KEY \`FK_6821d91826ca31cc4e4588b5355\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`film_planets_planet\` DROP FOREIGN KEY \`FK_9e9d858b064b7d0fa02a9764e18\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_starships_starship\` DROP FOREIGN KEY \`FK_baf66aafe260a12223240c8d4a5\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_starships_starship\` DROP FOREIGN KEY \`FK_cd69a89b18df6a4e42c67877cf5\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_vehicles_vehicle\` DROP FOREIGN KEY \`FK_69511f955e4694544aa0056f256\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_vehicles_vehicle\` DROP FOREIGN KEY \`FK_0c4799c95577dd53de3c9192060\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_species_species\` DROP FOREIGN KEY \`FK_9232984d4ee14342ad97f443824\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_species_species\` DROP FOREIGN KEY \`FK_d6d545e4740ee652e6f79e9ffd5\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_films_film\` DROP FOREIGN KEY \`FK_c4597771baad7514441c33793f5\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people_films_film\` DROP FOREIGN KEY \`FK_99ce84505b9d277789a5742906b\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_8f79bb098a482fa585da15ef3a6\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_9bad33153b67558894fc988f5d6\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_08f53d2b62e59296bc11817619f\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_5a9e4a23ffd399fa29aa06be4e5\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_59acd383cc58324a12bbb174b81\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_a2c1ee702ce1accdd98c9ff67a0\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_195b21b02ba0227f336b1ef7065\``,
//     )
//     await queryRunner.query(
//       `ALTER TABLE \`species\` DROP FOREIGN KEY \`FK_3427f7c92316561d7131c296bc6\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_3af75337b121624486cf179bf1\` ON \`film_species_species\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_5dca805e1b117016b196e64305\` ON \`film_species_species\``,
//     )
//     await queryRunner.query(`DROP TABLE \`film_species_species\``)
//     await queryRunner.query(
//       `DROP INDEX \`IDX_8be4e7e1014359bb4715338cf2\` ON \`film_vehicles_vehicle\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_af46f6d0bef8eba92546a8c537\` ON \`film_vehicles_vehicle\``,
//     )
//     await queryRunner.query(`DROP TABLE \`film_vehicles_vehicle\``)
//     await queryRunner.query(
//       `DROP INDEX \`IDX_21297c5d74a841542bcb7fe063\` ON \`film_starships_starship\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_ed79253745f81534b737ce768c\` ON \`film_starships_starship\``,
//     )
//     await queryRunner.query(`DROP TABLE \`film_starships_starship\``)
//     await queryRunner.query(
//       `DROP INDEX \`IDX_6821d91826ca31cc4e4588b535\` ON \`film_planets_planet\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_9e9d858b064b7d0fa02a9764e1\` ON \`film_planets_planet\``,
//     )
//     await queryRunner.query(`DROP TABLE \`film_planets_planet\``)
//     await queryRunner.query(
//       `DROP INDEX \`IDX_baf66aafe260a12223240c8d4a\` ON \`people_starships_starship\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_cd69a89b18df6a4e42c67877cf\` ON \`people_starships_starship\``,
//     )
//     await queryRunner.query(`DROP TABLE \`people_starships_starship\``)
//     await queryRunner.query(
//       `DROP INDEX \`IDX_69511f955e4694544aa0056f25\` ON \`people_vehicles_vehicle\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_0c4799c95577dd53de3c919206\` ON \`people_vehicles_vehicle\``,
//     )
//     await queryRunner.query(`DROP TABLE \`people_vehicles_vehicle\``)
//     await queryRunner.query(
//       `DROP INDEX \`IDX_9232984d4ee14342ad97f44382\` ON \`people_species_species\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_d6d545e4740ee652e6f79e9ffd\` ON \`people_species_species\``,
//     )
//     await queryRunner.query(`DROP TABLE \`people_species_species\``)
//     await queryRunner.query(
//       `DROP INDEX \`IDX_c4597771baad7514441c33793f\` ON \`people_films_film\``,
//     )
//     await queryRunner.query(
//       `DROP INDEX \`IDX_99ce84505b9d277789a5742906\` ON \`people_films_film\``,
//     )
//     await queryRunner.query(`DROP TABLE \`people_films_film\``)
//     await queryRunner.query(`DROP TABLE \`vehicle\``)
//     await queryRunner.query(`DROP TABLE \`film\``)
//     await queryRunner.query(`DROP TABLE \`people\``)
//     await queryRunner.query(`DROP TABLE \`image\``)
//     await queryRunner.query(`DROP TABLE \`starship\``)
//     await queryRunner.query(
//       `DROP INDEX \`REL_3427f7c92316561d7131c296bc\` ON \`species\``,
//     )
//     await queryRunner.query(`DROP TABLE \`species\``)
//     await queryRunner.query(`DROP TABLE \`planet\``)
//   }
// }
