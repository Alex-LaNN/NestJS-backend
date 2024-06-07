//  import { MigrationInterface, QueryRunner } from 'typeorm'

// export class InitialSchema1715958108788 implements MigrationInterface {
//   name = 'InitialSchema1715958108788'

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // await queryRunner.query(
//     //   `CREATE TABLE IF NOT EXISTS \`migrations\` (\`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`))`,
//     // )
//     await queryRunner.query(
//       `CREATE TABLE \`people\` (\`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`films\` (\`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`starships\` (\`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`vehicles\` (\`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`planets\` (\`id\` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (\`id\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_films\` (\`peopleId\` int NOT NULL, \`filmsId\` int NOT NULL, PRIMARY KEY (\`peopleId\`, \`filmsId\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_vehicles\` (\`peopleId\` int NOT NULL, \`vehiclesId\` int NOT NULL, PRIMARY KEY (\`peopleId\`, \`vehiclesId\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_starships\` (\`peopleId\` int NOT NULL, \`starshipsId\` int NOT NULL, PRIMARY KEY (\`peopleId\`, \`starshipsId\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`people_species\` (\`peopleId\` int NOT NULL, \`speciesId\` int NOT NULL, PRIMARY KEY (\`peopleId\`, \`speciesId\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`films_starships\` (\`filmsId\` int NOT NULL, \`starshipsId\` int NOT NULL, PRIMARY KEY (\`filmsId\`, \`starshipsId\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`films_vehicles\` (\`filmsId\` int NOT NULL, \`vehiclesId\` int NOT NULL, PRIMARY KEY (\`filmsId\`, \`vehiclesId\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`films_planets\` (\`filmsId\` int NOT NULL, \`planetsId\` int NOT NULL, PRIMARY KEY (\`filmsId\`, \`planetsId\`))`,
//     )
//     await queryRunner.query(
//       `CREATE TABLE \`films_species\` (\`filmsId\` int NOT NULL, \`speciesId\` int NOT NULL, PRIMARY KEY (\`filmsId\`, \`speciesId\`))`,
//     )
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DROP TABLE \`films_planets\``)
//     await queryRunner.query(`DROP TABLE \`films_vehicles\``)
//     await queryRunner.query(`DROP TABLE \`films_starships\``)
//     await queryRunner.query(`DROP TABLE \`films_species\``)
//     await queryRunner.query(`DROP TABLE \`people_species\``)
//     await queryRunner.query(`DROP TABLE \`people_starships\``)
//     await queryRunner.query(`DROP TABLE \`people_vehicles\``)
//     await queryRunner.query(`DROP TABLE \`people_films\``)
//     await queryRunner.query(`DROP TABLE \`planets\``)
//     await queryRunner.query(`DROP TABLE \`vehicles\``)
//     await queryRunner.query(`DROP TABLE \`starships\``)
//     await queryRunner.query(`DROP TABLE \`films\``)
//     await queryRunner.query(`DROP TABLE \`people\``)
// //    await queryRunner.query(`DROP TABLE \`migrations\``)
//   }
// }