import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.sequelize.query(`
    ALTER TABLE hotels
    ADD COLUMN rating DECIMAL(3,2) DEFAULT NULL,
    ADD COLUMN rating_count INT DEFAULT NULL;
  `);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.sequelize.query(`
    ALTER TABLE hotels
    DROP COLUMN rating,
    DROP COLUMN rating_count;
  `);
}
