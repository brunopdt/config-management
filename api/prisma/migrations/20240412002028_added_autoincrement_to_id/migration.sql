-- AlterTable
CREATE SEQUENCE userplace_id_seq;
ALTER TABLE "UserPlace" ALTER COLUMN "id" SET DEFAULT nextval('userplace_id_seq');
ALTER SEQUENCE userplace_id_seq OWNED BY "UserPlace"."id";
