import { MigrationInterface, QueryRunner } from "typeorm";

export class LastMigration1715970367032 implements MigrationInterface {
    name = 'LastMigration1715970367032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`people_films\` DROP FOREIGN KEY \`FK_a6ae8e23d835bdbc6b9fe43823f\``);
        await queryRunner.query(`ALTER TABLE \`people_films\` DROP FOREIGN KEY \`FK_f9d0038e205e511024d88b4c441\``);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` DROP FOREIGN KEY \`FK_1228470b9119a37bc0608e7ac62\``);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` DROP FOREIGN KEY \`FK_f858faa2a7663a7258052fb4e54\``);
        await queryRunner.query(`ALTER TABLE \`people_starships\` DROP FOREIGN KEY \`FK_25cb50d5fba38a9219e6b2eb79e\``);
        await queryRunner.query(`ALTER TABLE \`people_starships\` DROP FOREIGN KEY \`FK_2ee1350798626e1c52a83f26c0f\``);
        await queryRunner.query(`ALTER TABLE \`films_starships\` DROP FOREIGN KEY \`FK_98904c9cab6a9c3c11aeacf768b\``);
        await queryRunner.query(`ALTER TABLE \`films_starships\` DROP FOREIGN KEY \`FK_c6ae67fefde29efc7325b74baa4\``);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` DROP FOREIGN KEY \`FK_4465b1c1a89520616f3c6ccad73\``);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` DROP FOREIGN KEY \`FK_d892418f6e02d0ebce56bd35809\``);
        await queryRunner.query(`ALTER TABLE \`films_planets\` DROP FOREIGN KEY \`FK_56eec3c43f5246c6a26f4e61d81\``);
        await queryRunner.query(`ALTER TABLE \`films_planets\` DROP FOREIGN KEY \`FK_a8db04b134255125a4a990c656d\``);
        await queryRunner.query(`ALTER TABLE \`films_starships\` ADD CONSTRAINT \`FK_98904c9cab6a9c3c11aeacf768b\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starships\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`films_starships\` ADD CONSTRAINT \`FK_c6ae67fefde29efc7325b74baa4\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people_starships\` ADD CONSTRAINT \`FK_2ee1350798626e1c52a83f26c0f\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starships\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_starships\` ADD CONSTRAINT \`FK_25cb50d5fba38a9219e6b2eb79e\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`films_planets\` ADD CONSTRAINT \`FK_56eec3c43f5246c6a26f4e61d81\` FOREIGN KEY (\`planetsId\`) REFERENCES \`planets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`films_planets\` ADD CONSTRAINT \`FK_a8db04b134255125a4a990c656d\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people_films\` ADD CONSTRAINT \`FK_f9d0038e205e511024d88b4c441\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_films\` ADD CONSTRAINT \`FK_a6ae8e23d835bdbc6b9fe43823f\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` ADD CONSTRAINT \`FK_1228470b9119a37bc0608e7ac62\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` ADD CONSTRAINT \`FK_f858faa2a7663a7258052fb4e54\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` ADD CONSTRAINT \`FK_d892418f6e02d0ebce56bd35809\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` ADD CONSTRAINT \`FK_4465b1c1a89520616f3c6ccad73\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` DROP FOREIGN KEY \`FK_4465b1c1a89520616f3c6ccad73\``);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` DROP FOREIGN KEY \`FK_d892418f6e02d0ebce56bd35809\``);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` DROP FOREIGN KEY \`FK_f858faa2a7663a7258052fb4e54\``);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` DROP FOREIGN KEY \`FK_1228470b9119a37bc0608e7ac62\``);
        await queryRunner.query(`ALTER TABLE \`people_films\` DROP FOREIGN KEY \`FK_a6ae8e23d835bdbc6b9fe43823f\``);
        await queryRunner.query(`ALTER TABLE \`people_films\` DROP FOREIGN KEY \`FK_f9d0038e205e511024d88b4c441\``);
        await queryRunner.query(`ALTER TABLE \`films_planets\` DROP FOREIGN KEY \`FK_a8db04b134255125a4a990c656d\``);
        await queryRunner.query(`ALTER TABLE \`films_planets\` DROP FOREIGN KEY \`FK_56eec3c43f5246c6a26f4e61d81\``);
        await queryRunner.query(`ALTER TABLE \`people_starships\` DROP FOREIGN KEY \`FK_25cb50d5fba38a9219e6b2eb79e\``);
        await queryRunner.query(`ALTER TABLE \`people_starships\` DROP FOREIGN KEY \`FK_2ee1350798626e1c52a83f26c0f\``);
        await queryRunner.query(`ALTER TABLE \`films_starships\` DROP FOREIGN KEY \`FK_c6ae67fefde29efc7325b74baa4\``);
        await queryRunner.query(`ALTER TABLE \`films_starships\` DROP FOREIGN KEY \`FK_98904c9cab6a9c3c11aeacf768b\``);
        await queryRunner.query(`ALTER TABLE \`films_planets\` ADD CONSTRAINT \`FK_a8db04b134255125a4a990c656d\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`films_planets\` ADD CONSTRAINT \`FK_56eec3c43f5246c6a26f4e61d81\` FOREIGN KEY (\`planetsId\`) REFERENCES \`planets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` ADD CONSTRAINT \`FK_d892418f6e02d0ebce56bd35809\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`films_vehicles\` ADD CONSTRAINT \`FK_4465b1c1a89520616f3c6ccad73\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`films_starships\` ADD CONSTRAINT \`FK_c6ae67fefde29efc7325b74baa4\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`films_starships\` ADD CONSTRAINT \`FK_98904c9cab6a9c3c11aeacf768b\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starships\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_starships\` ADD CONSTRAINT \`FK_2ee1350798626e1c52a83f26c0f\` FOREIGN KEY (\`starshipsId\`) REFERENCES \`starships\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_starships\` ADD CONSTRAINT \`FK_25cb50d5fba38a9219e6b2eb79e\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` ADD CONSTRAINT \`FK_f858faa2a7663a7258052fb4e54\` FOREIGN KEY (\`vehiclesId\`) REFERENCES \`vehicles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`people_vehicles\` ADD CONSTRAINT \`FK_1228470b9119a37bc0608e7ac62\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people_films\` ADD CONSTRAINT \`FK_f9d0038e205e511024d88b4c441\` FOREIGN KEY (\`peopleId\`) REFERENCES \`people\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`people_films\` ADD CONSTRAINT \`FK_a6ae8e23d835bdbc6b9fe43823f\` FOREIGN KEY (\`filmsId\`) REFERENCES \`films\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
