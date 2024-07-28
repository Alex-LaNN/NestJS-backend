import { MigrationInterface, QueryRunner } from "typeorm";

export class LastMigration1718564931891 implements MigrationInterface {
    name = 'LastMigration1718564931891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`starships\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`created\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`edited\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
            \`name\` varchar(255) NOT NULL,
            \`url\` varchar(255) NOT NULL,
            \`model\` varchar(255) NOT NULL,
            \`starship_class\` varchar(255) NOT NULL,
            \`manufacturer\` varchar(255) NOT NULL,
            \`cost_in_credits\` varchar(255) NOT NULL,
            \`length\` varchar(255) NOT NULL,
            \`crew\` varchar(255) NOT NULL,
            \`passengers\` varchar(255) NOT NULL,
            \`max_atmosphering_speed\` varchar(255) NOT NULL,
            \`hyperdrive_rating\` varchar(255) NOT NULL,
            \`MGLT\` varchar(255) NOT NULL,
            \`cargo_capacity\` varchar(255) NOT NULL,
            \`consumables\` varchar(255) NOT NULL,
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`species\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`created\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`edited\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
            \`name\` varchar(255) NOT NULL,
            \`url\` varchar(255) NOT NULL,
            \`classification\` varchar(255) NOT NULL,
            \`designation\` varchar(255) NOT NULL,
            \`average_height\` varchar(255) NOT NULL,
            \`average_lifespan\` varchar(255) NOT NULL,
            \`eye_colors\` varchar(255) NOT NULL,
            \`hair_colors\` varchar(255) NOT NULL,
            \`skin_colors\` varchar(255) NOT NULL,
            \`language\` varchar(255) NOT NULL,
            \`homeworldId\` int NULL,
            UNIQUE INDEX \`REL_6c65872be20cc863369cc11ee8\` (\`homeworldId\`),
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`images\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`name\` varchar(255) NOT NULL,
            \`description\` varchar(255) NOT NULL,
            \`url\` varchar(255) NOT NULL,
            \`peopleId\` int NULL,
            \`filmsId\` int NULL,
            \`planetsId\` int NULL,
            \`starshipsId\` int NULL,
            \`vehiclesId\` int NULL,
            \`speciesId\` int NULL,
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`planets\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`created\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`edited\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
            \`name\` varchar(255) NOT NULL,
            \`url\` varchar(255) NOT NULL,
            \`climate\` varchar(255) NOT NULL,
            \`diameter\` varchar(255) NOT NULL,
            \`rotation_period\` varchar(255) NOT NULL,
            \`orbital_period\` varchar(255) NOT NULL,
            \`gravity\` varchar(255) NOT NULL,
            \`population\` varchar(255) NOT NULL,
            \`terrain\` varchar(255) NOT NULL,
            \`surface_water\` varchar(255) NOT NULL,
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`people\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`created\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`edited\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
            \`name\` varchar(255) NOT NULL,
            \`url\` varchar(255) NOT NULL,
            \`height\` varchar(255) NOT NULL,
            \`mass\` varchar(255) NOT NULL,
            \`hair_color\` varchar(255) NOT NULL,
            \`skin_color\` varchar(255) NOT NULL,
            \`eye_color\` varchar(255) NOT NULL,
            \`birth_year\` varchar(255) NOT NULL,
            \`gender\` varchar(255) NOT NULL,
            \`homeworldId\` int NULL,
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`films\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`created\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`edited\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
            \`title\` varchar(255) NOT NULL,
            \`url\` varchar(255) NOT NULL,
            \`episode_id\` int NOT NULL,
            \`opening_crawl\` text NOT NULL,
            \`director\` varchar(255) NOT NULL,
            \`producer\` varchar(255) NOT NULL,
            \`release_date\` datetime NOT NULL,
            UNIQUE INDEX \`REL_6c40323ce20cc863369cc33ee8\` (\`url\`),
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`vehicles\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`created\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`edited\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
            \`name\` varchar(255) NOT NULL,
            \`url\` varchar(255) NOT NULL,
            \`model\` varchar(255) NOT NULL,
            \`vehicle_class\` varchar(255) NOT NULL,
            \`manufacturer\` varchar(255) NOT NULL,
            \`length\` varchar(255) NOT NULL,
            \`cost_in_credits\` varchar(255) NOT NULL,
            \`crew\` varchar(255) NOT NULL,
            \`passengers\` varchar(255) NOT NULL,
            \`max_atmosphering_speed\` varchar(255) NOT NULL,
            \`cargo_capacity\` varchar(255) NOT NULL,
            \`consumables\` varchar(255) NOT NULL,
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`users\` (
            \`id\` varchar(36) NOT NULL,
            \`userName\` varchar(255) NOT NULL,
            \`password\` varchar(255) NOT NULL,
            \`email\` varchar(255) NOT NULL,
            \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user',
            UNIQUE INDEX \`IDX_226bb9aa7aa8a69991209d58f5\` (\`userName\`),
            UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
            PRIMARY KEY (\`id\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`films_starships\` (
            \`filmsId\` int NOT NULL,
            \`starshipsId\` int NOT NULL,
            INDEX \`IDX_c6ae67fefde29efc7325b74baa\` (\`filmsId\`),
            INDEX \`IDX_98904c9cab6a9c3c11aeacf768\` (\`starshipsId\`),
            PRIMARY KEY (\`filmsId\`, \`starshipsId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`people_starships\` (
            \`peopleId\` int NOT NULL,
            \`starshipsId\` int NOT NULL,
            INDEX \`IDX_25cb50d5fba38a9219e6b2eb79\` (\`peopleId\`),
            INDEX \`IDX_2ee1350798626e1c52a83f26c0\` (\`starshipsId\`),
            PRIMARY KEY (\`peopleId\`, \`starshipsId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`people_species\` (
            \`peopleId\` int NOT NULL,
            \`speciesId\` int NOT NULL,
            INDEX \`IDX_56f67794e6fc76cd1c1427ed1a\` (\`peopleId\`),
            INDEX \`IDX_3f0fe0fa1df5ad0ef0afc4e9fb\` (\`speciesId\`),
            PRIMARY KEY (\`peopleId\`, \`speciesId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`films_species\` (
            \`filmsId\` int NOT NULL,
            \`speciesId\` int NOT NULL,
            INDEX \`IDX_30663fc8495f09199efa33ab85\` (\`filmsId\`),
            INDEX \`IDX_b5b68c8f3779bcdaa9afda0378\` (\`speciesId\`),
            PRIMARY KEY (\`filmsId\`, \`speciesId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`films_planets\` (
            \`filmsId\` int NOT NULL,
            \`planetsId\` int NOT NULL,
            INDEX \`IDX_a8db04b134255125a4a990c656\` (\`filmsId\`),
            INDEX \`IDX_56eec3c43f5246c6a26f4e61d8\` (\`planetsId\`),
            PRIMARY KEY (\`filmsId\`, \`planetsId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`people_films\` (
            \`peopleId\` int NOT NULL,
            \`filmsId\` int NOT NULL,
            INDEX \`IDX_f9d0038e205e511024d88b4c44\` (\`peopleId\`),
            INDEX \`IDX_a6ae8e23d835bdbc6b9fe43823\` (\`filmsId\`),
            PRIMARY KEY (\`peopleId\`, \`filmsId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`people_vehicles\` (
            \`peopleId\` int NOT NULL,
            \`vehiclesId\` int NOT NULL,
            INDEX \`IDX_1228470b9119a37bc0608e7ac6\` (\`peopleId\`),
            INDEX \`IDX_f858faa2a7663a7258052fb4e5\` (\`vehiclesId\`),
            PRIMARY KEY (\`peopleId\`, \`vehiclesId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS \`films_vehicles\` (
            \`filmsId\` int NOT NULL,
            \`vehiclesId\` int NOT NULL,
            INDEX \`IDX_d892418f6e02d0ebce56bd3580\` (\`filmsId\`),
            INDEX \`IDX_4465b1c1a89520616f3c6ccad7\` (\`vehiclesId\`), 
            PRIMARY KEY (\`filmsId\`, \`vehiclesId\`)) ENGINE=InnoDB`)
        await queryRunner.query(`
            ALTER TABLE \`images\` ADD CONSTRAINT \`FK_7aaee71fd817df85dd0e24d52a6\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`images\` ADD CONSTRAINT \`FK_0dc8a31ea91d9fe7574c9c6b48c\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`images\` ADD CONSTRAINT \`FK_fa13320ccbde4efa91048a55ff4\` FOREIGN KEY (\`planetsId\`) REFERENCES \`planets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`images\` ADD CONSTRAINT \`FK_53ea6b0269e66436dfe00628f31\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starships\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`images\` ADD CONSTRAINT \`FK_0ac1a8463eba3c1ce97f04ac097\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`images\` ADD CONSTRAINT \`FK_c02a4e67aceb74f955901a6464a\` FOREIGN KEY (\`speciesId\`) REFERENCES \`species\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(
            `ALTER TABLE \`people\` ADD CONSTRAINT \`FK_8f79bb03eba3c1c585da15ef3a6\` FOREIGN KEY (\`homeworldId\`) REFERENCES \`planets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE \`species\` ADD CONSTRAINT \`FK_8f79bb098a482f95590115ef3a7\` FOREIGN KEY (\`homeworldId\`) REFERENCES \`planets\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(`
            ALTER TABLE \`films_starships\` ADD CONSTRAINT \`FK_98904c9cab6a9c3c11aeacf768b\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starships\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`
            ALTER TABLE \`films_starships\` ADD CONSTRAINT \`FK_c6ae67fefde29efc7325b74baa4\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`people_starships\` ADD CONSTRAINT \`FK_2ee1350798626e1c52a83f26c0f\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starships\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`
            ALTER TABLE \`people_starships\` ADD CONSTRAINT \`FK_25cb50d5fba38a9219e6b2eb79e\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`people_species\` ADD CONSTRAINT \`FK_3f0fe0fa1df5ad0ef0afc4e9fbf\` FOREIGN KEY (\`speciesId\`) REFERENCES \`species\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`
            ALTER TABLE \`people_species\` ADD CONSTRAINT \`FK_56f67794e6fc76cd1c1427ed1a6\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`films_species\` ADD CONSTRAINT \`FK_b5b68c8f3779bcdaa9afda0378e\` FOREIGN KEY (\`speciesId\`) REFERENCES \`species\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`
            ALTER TABLE \`films_species\` ADD CONSTRAINT \`FK_30663fc8495f09199efa33ab85e\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`films_planets\` ADD CONSTRAINT \`FK_56eec3c43f5246c6a26f4e61d81\` FOREIGN KEY (\`planetsId\`) REFERENCES \`planets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`
            ALTER TABLE \`films_planets\` ADD CONSTRAINT \`FK_a8db04b134255125a4a990c656d\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`people_films\` ADD CONSTRAINT \`FK_f9d0038e205e511024d88b4c441\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`people_films\` ADD CONSTRAINT \`FK_a6ae8e23d835bdbc6b9fe43823f\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`people_vehicles\` ADD CONSTRAINT \`FK_1228470b9119a37bc0608e7ac62\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`
            ALTER TABLE \`people_vehicles\` ADD CONSTRAINT \`FK_f858faa2a7663a7258052fb4e54\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE \`films_vehicles\` ADD CONSTRAINT \`FK_d892418f6e02d0ebce56bd35809\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`
            ALTER TABLE \`films_vehicles\` ADD CONSTRAINT \`FK_4465b1c1a89520616f3c6ccad73\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` DROP FOREIGN KEY \`FK_d892418f6e02d0ebce56bd35809\``);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` DROP FOREIGN KEY \`FK_4465b1c1a89520616f3c6ccad73\``);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` DROP FOREIGN KEY \`FK_f858faa2a7663a7258052fb4e54\``);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` DROP FOREIGN KEY \`FK_1228470b9119a37bc0608e7ac62\``);
        await queryRunner.query(`ALTER TABLE \`people_films\` DROP FOREIGN KEY \`FK_a6ae8e23d835bdbc6b9fe43823f\``);
        await queryRunner.query(`ALTER TABLE \`people_films\` DROP FOREIGN KEY \`FK_f9d0038e205e511024d88b4c441\``);
        await queryRunner.query(`ALTER TABLE \`films_planets\` DROP FOREIGN KEY \`FK_a8db04b134255125a4a990c656d\``);
        await queryRunner.query(`ALTER TABLE \`films_planets\` DROP FOREIGN KEY \`FK_56eec3c43f5246c6a26f4e61d81\``);
        await queryRunner.query(`ALTER TABLE \`films_species\` DROP FOREIGN KEY \`FK_30663fc8495f09199efa33ab85e\``);
        await queryRunner.query(`ALTER TABLE \`films_species\` DROP FOREIGN KEY \`FK_b5b68c8f3779bcdaa9afda0378e\``);
        await queryRunner.query(`ALTER TABLE \`people_species\` DROP FOREIGN KEY \`FK_56f67794e6fc76cd1c1427ed1a6\``);
        await queryRunner.query(`ALTER TABLE \`people_species\` DROP FOREIGN KEY \`FK_3f0fe0fa1df5ad0ef0afc4e9fbf\``);
        await queryRunner.query(`ALTER TABLE \`people_starships\` DROP FOREIGN KEY \`FK_25cb50d5fba38a9219e6b2eb79e\``);
        await queryRunner.query(`ALTER TABLE \`people_starships\` DROP FOREIGN KEY \`FK_2ee1350798626e1c52a83f26c0f\``);
        await queryRunner.query(`ALTER TABLE \`films_starships\` DROP FOREIGN KEY \`FK_c6ae67fefde29efc7325b74baa4\``);
        await queryRunner.query(`ALTER TABLE \`films_starships\` DROP FOREIGN KEY \`FK_98904c9cab6a9c3c11aeacf768b\``);
        await queryRunner.query(`ALTER TABLE \`people\` DROP FOREIGN KEY \`FK_8f79bb03eba3c1c585da15ef3a6\``);
        await queryRunner.query(`ALTER TABLE \`species\` DROP FOREIGN KEY \`FK_8f79bb098a482f95590115ef3a7\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_c02a4e67aceb74f955901a6464a\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_0ac1a8463eba3c1ce97f04ac097\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_53ea6b0269e66436dfe00628f31\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_fa13320ccbde4efa91048a55ff4\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_0dc8a31ea91d9fe7574c9c6b48c\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_7aaee71fd817df85dd0e24d52a6\``);
        await queryRunner.query(`DROP INDEX \`IDX_4465b1c1a89520616f3c6ccad7\` ON \`films_vehicles\``);
        await queryRunner.query(`DROP INDEX \`IDX_d892418f6e02d0ebce56bd3580\` ON \`films_vehicles\``);
        await queryRunner.query(`DROP TABLE \`films_vehicles\``);
        await queryRunner.query(`DROP INDEX \`IDX_f858faa2a7663a7258052fb4e5\` ON \`people_vehicles\``);
        await queryRunner.query(`DROP INDEX \`IDX_1228470b9119a37bc0608e7ac6\` ON \`people_vehicles\``);
        await queryRunner.query(`DROP TABLE \`people_vehicles\``);
        await queryRunner.query(`DROP INDEX \`IDX_a6ae8e23d835bdbc6b9fe43823\` ON \`people_films\``);
        await queryRunner.query(`DROP INDEX \`IDX_f9d0038e205e511024d88b4c44\` ON \`people_films\``);
        await queryRunner.query(`DROP TABLE \`people_films\``);
        await queryRunner.query(`DROP INDEX \`IDX_a8db04b134255125a4a990c656\` ON \`films_planets\``);
        await queryRunner.query(`DROP INDEX \`IDX_56eec3c43f5246c6a26f4e61d8\` ON \`films_planets\``);
        await queryRunner.query(`DROP TABLE \`films_planets\``);
        await queryRunner.query(`DROP INDEX \`IDX_30663fc8495f09199efa33ab85\` ON \`films_species\``);
        await queryRunner.query(`DROP INDEX \`IDX_b5b68c8f3779bcdaa9afda0378\` ON \`films_species\``);
        await queryRunner.query(`DROP TABLE \`films_species\``);
        await queryRunner.query(`DROP INDEX \`IDX_56f67794e6fc76cd1c1427ed1a\` ON \`people_species\``);
        await queryRunner.query(`DROP INDEX \`IDX_3f0fe0fa1df5ad0ef0afc4e9fb\` ON \`people_species\``);
        await queryRunner.query(`DROP TABLE \`people_species\``);
        await queryRunner.query(`DROP INDEX \`IDX_25cb50d5fba38a9219e6b2eb79\` ON \`people_starships\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ee1350798626e1c52a83f26c0\` ON \`people_starships\``);
        await queryRunner.query(`DROP TABLE \`people_starships\``);
        await queryRunner.query(`DROP INDEX \`IDX_c6ae67fefde29efc7325b74baa\` ON \`films_starships\``);
        await queryRunner.query(`DROP INDEX \`IDX_98904c9cab6a9c3c11aeacf768\` ON \`films_starships\``);
        await queryRunner.query(`DROP TABLE \`films_starships\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_226bb9aa7aa8a69991209d58f5\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`vehicles\``);
        await queryRunner.query(`DROP INDEX \`REL_6c40323ce20cc863369cc33ee8\` ON \`films\``);
        await queryRunner.query(`DROP TABLE \`films\``);
        await queryRunner.query(`DROP TABLE \`people\``);
        await queryRunner.query(`DROP TABLE \`planets\``);
        await queryRunner.query(`DROP TABLE \`images\``);
        await queryRunner.query(`DROP INDEX \`REL_6c65872be20cc863369cc11ee8\` ON \`species\``)
        await queryRunner.query(`DROP TABLE \`species\``);
        await queryRunner.query(`DROP TABLE \`starships\``);
    }

}
